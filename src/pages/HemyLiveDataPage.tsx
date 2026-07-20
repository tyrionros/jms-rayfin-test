import { useEffect, useState, useRef } from 'react';

import { useAuth } from '@/hooks/AuthContext';
import { getRayfinClient } from '@/services/rayfinClient';

declare global {
  interface Window {
    fabric?: {
      embeds?: {
        embedKQLDashboard?: (element: HTMLElement, config: any) => any;
      };
    };
  }
}

export function HemyLiveDataPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null); 
  const embedInstanceRef = useRef<any>(null);

  const workspaceId = '0f49bb62-6832-40a7-825d-b730e9874a50';
  const dashboardId = '504c0b42-48e2-48e4-84c2-127b69c7dac6';

  useEffect(() => {
    const loadFabricEmbed = async () => {
      try {
        setIsLoading(true);

        // Get access token from Rayfin auth client if available
        // (Fabric SDK can also auto-acquire tokens during embed)
        let accessToken: string | null = null;
        try {
          const rayfinClient = getRayfinClient();
          const session = rayfinClient.auth.getSession();
          // Try to extract token from session if available
          if (session && (session as any).accessToken) {
            accessToken = (session as any).accessToken;
          }
        } catch (tokenErr) {
          console.warn('Could not retrieve access token, letting Fabric SDK auto-acquire:', tokenErr);
        }

        const renderDashboard = () => {
          if (window.fabric?.embeds?.embedKQLDashboard && containerRef.current) {
            containerRef.current.innerHTML = ''; 

            const config: any = {
              type: 'KQLDashboard',
              id: dashboardId,
              workspaceId: workspaceId,
              settings: {
                pageView: 'fitToWidth'
              }
            };

            // Add access token if available
            if (accessToken) {
              config.accessToken = accessToken;
            }

            embedInstanceRef.current = window.fabric.embeds.embedKQLDashboard(containerRef.current, config);
            setIsLoading(false);
          } else {
            setError('Fabric Embed SDK layout is missing the embedKQLDashboard engine.');
            setIsLoading(false);
          }
        };

        // If script is already attached, execute immediately
        if (window.fabric?.embeds?.embedKQLDashboard) {
          renderDashboard();
          return;
        }

        // Dynamically inject the global script 
        const script = document.createElement('script');
        script.src = 'https://app.fabric.microsoft.com/v1/embed';
        script.async = true;
        script.crossOrigin = 'anonymous';

        script.onload = () => {
          setTimeout(() => {
            renderDashboard();
          }, 200);
        };

        script.onerror = () => {
          setError('Failed to fetch the cloud Fabric Embed SDK script resource.');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error('Error loading Fabric Embed:', err);
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    if (user) {
      loadFabricEmbed();
    } else {
      setError('User must be authenticated to view this dashboard.');
      setIsLoading(false);
    }

    return () => {
      if (embedInstanceRef.current && typeof embedInstanceRef.current.clean === 'function') {
        embedInstanceRef.current.clean();
      }
    };
  }, [user]);

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
