import { useEffect, useState, useRef } from 'react';

import {
  EmbedManager,
  KQLDashboardEmbedClient,
  type KQLDashboardEmbedConfiguration,
} from '@microsoft/fabric-embed';
import { useMsal } from '@azure/msal-react';
import { useAuth } from '@/hooks/AuthContext';

export function HemyLiveDataPage() {
  const { user } = useAuth();
  const { instance } = useMsal();
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

        // Function to acquire Fabric API token using MSAL
        const acquireToken = async (scopes?: string[]): Promise<string> => {
          const currentAccounts = instance.getAllAccounts();
          
          if (currentAccounts.length === 0) {
            throw new Error('No active user sessions found in MSAL. Please ensure you are logged in.');
          }

          const targetAccount = instance.getActiveAccount() || currentAccounts[0];
          const tokenScopes = scopes || ['https://api.fabric.microsoft.com/.default'];

          const tokenRequest = {
            scopes: tokenScopes,
            account: targetAccount,
          };

          try {
            const response = await instance.acquireTokenSilent(tokenRequest);
            return response.accessToken;
          } catch (silentErr) {
            console.warn('Silent token acquisition failed, attempting interactive popup:', silentErr);
            const response = await instance.acquireTokenPopup(tokenRequest);
            return response.accessToken;
          }
        };

        // Acquire initial token
        let initialToken: string;
        try {
          initialToken = await acquireToken();
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
                  const token = await acquireToken(scopes);
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
  }, [user, instance]);

  return (
    <div className="flex flex-col h-screen bg-[#FAF8F2]">
      {/* Header */}
      <div className="bg-[#021838] text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hemy Live Data & BMS</h1>
      </div>

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

        {/* Container for Fabric Embed SDK */}
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