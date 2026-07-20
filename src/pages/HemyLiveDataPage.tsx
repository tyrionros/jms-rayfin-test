import { useEffect, useState, useRef } from 'react';

import {
  EmbedManager,
  KQLDashboardEmbedClient,
  type KQLDashboardEmbedConfiguration,
} from '@microsoft/fabric-embed';
import { useAuth } from '@/hooks/AuthContext';
import { acquireFabricToken } from '@/services/fabricTokenService';

export function HemyLiveDataPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const embedManagerRef = useRef<EmbedManager | null>(null);

  const workspaceId = '0f49bb62-6832-40a7-825d-b730e9874a50';
  const dashboardId = '504c0b42-48e2-48e4-84c2-127b69c7dac6';

  useEffect(() => {
    const embedDashboard = async () => {
      try {
        if (!user || !containerRef.current) {
          setError('User must be authenticated to view this dashboard.');
          setIsLoading(false);
          return;
        }

        setIsLoading(true);

        // Initialize the embed manager with KQL Dashboard support
        const embedManager = new EmbedManager({
          embedClientClasses: [KQLDashboardEmbedClient],
        });
        embedManagerRef.current = embedManager;

        // Acquire initial token using MSAL
        let initialToken: string;
        try {
          initialToken = await acquireFabricToken();
        } catch (tokenErr) {
          setError(`Authentication Error: ${tokenErr instanceof Error ? tokenErr.message : 'Failed to acquire token'}`);
          setIsLoading(false);
          return;
        }

        const config: KQLDashboardEmbedConfiguration = {
          itemType: 'KQLDashboard',
          workspaceId: workspaceId,
          itemId: dashboardId,
          accessToken: { token: initialToken },
          eventHooks: {
            accessTokenProvider: {
              callback: async ({ scopes }) => {
                try {
                  const token = await acquireFabricToken(scopes);
                  return { token };
                } catch (err) {
                  console.error('Token provider error:', err);
                  setError('Failed to refresh access token for dashboard.');
                  throw err;
                }
              },
            },
            rendered: {
              callback: async () => {
                console.log('Dashboard rendered successfully');
                setIsLoading(false);
              },
            },
            error: {
              callback: async (event: any) => {
                console.error('Embed error:', event);
                const errorMsg = event?.message || event?.toString() || 'Unknown error';
                setError(`Dashboard Error: ${errorMsg}`);
                setIsLoading(false);
              },
            },
          },
        };

        // Embed the dashboard
        await embedManager.embed(containerRef.current, config);
      } catch (err) {
        console.error('Error embedding Fabric dashboard:', err);
        setError(`Error: ${err instanceof Error ? err.message : 'Failed to embed dashboard'}`);
        setIsLoading(false);
      }
    };

    if (user) {
      embedDashboard();
    }

    return () => {
      // Clean up embed manager on unmount
      if (embedManagerRef.current) {
        try {
          (embedManagerRef.current as any).dispose?.();
        } catch (e) {
          console.warn('Error disposing embed manager:', e);
        }
      }
    };
  }, [user]);

  return (
    <div className="flex flex-col h-screen bg-[#FAF8F2]">
      {/* Header */}
            <header className="sticky top-0 z-40 border-b border-[#DDD4C0] bg-[#021838] shadow-md">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C4D2F] text-[#FAF8F2]">
              <Hemy360Icon className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight text-[#FAF8F2]" title="Hemy 360 - test by JMS">
              Hemy Live Data & BMS
            </span>
          </div>
        </div>
      </header>
      {/* Content */}
      <div className="flex-1 overflow-hidden p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F2] z-10">
            <div className="text-center">
              <div className="inline-block animate-spin w-12 h-12 border-4 border-[#021838] border-t-[#7C4D2F] rounded-full" />
              <p className="mt-4 text-gray-600 font-medium">Loading live capacity feed...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F2] z-10">
            <div className="text-center text-red-600 max-w-md p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-lg font-bold mb-2">Embedding Initialization Halted</p>
              <p className="text-sm whitespace-pre-line">{error}</p>
            </div>
          </div>
        )}

        {/* Bound to React Container Ref */}
        <div
          ref={containerRef}
          id="fabric-embed"
          className="w-full h-full border-0 rounded-lg shadow-sm overflow-hidden bg-white"
          style={{ visibility: isLoading || error ? 'hidden' : 'visible' }}
        />
      </div>
    </div>
  );
}
function Hemy360Icon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {/* Letter H */}
      <text
        x="12"
        y="16"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="sans-serif"
      >
        H
      </text>
      {/* Circular arrow 360 degrees - arc with arrowhead */}
      <path
        d="M 12 3 A 9 9 0 0 1 21 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path d="M 21 12 L 19.5 10.5 L 20.5 11.5" fill="currentColor" />
    </svg>
  );
}

