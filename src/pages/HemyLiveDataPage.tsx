import { useEffect, useState } from 'react';

declare global {
  interface Window {
    fabric?: {
      embeds?: {
        embedKQLDashboard?: (element: HTMLElement | null, config: any) => void;
      };
    };
  }
}

export function HemyLiveDataPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const workspaceId = '0f49bb62-6832-40a7-825d-b730e9874a50';
  const dashboardId = '504c0b42-48e2-48e4-84c2-127b69c7dac6';

  useEffect(() => {
    const loadFabricEmbed = async () => {
      try {
        setIsLoading(true);

        // Check if SDK is already loaded
        if ((window as any).fabric?.embeds?.embedKQLDashboard) {
          const element = document.getElementById('fabric-embed');
          if (element) {
            (window as any).fabric.embeds.embedKQLDashboard(element, {
              dashboardId: dashboardId,
              groupId: workspaceId,
              pageView: 'fitToWidth',
            });
          }
          setIsLoading(false);
          return;
        }

        // Load the Fabric Embed SDK
        const script = document.createElement('script');
        script.src = 'https://app.fabric.microsoft.com/v1/embed';
        script.async = true;
        script.crossOrigin = 'anonymous';

        script.onload = () => {
          // Give the SDK a moment to initialize
          setTimeout(() => {
            if ((window as any).fabric?.embeds?.embedKQLDashboard) {
              const element = document.getElementById('fabric-embed');
              if (element) {
                (window as any).fabric.embeds.embedKQLDashboard(element, {
                  dashboardId: dashboardId,
                  groupId: workspaceId,
                  pageView: 'fitToWidth',
                });
              }
              setIsLoading(false);
            } else {
              setError('Fabric Embed SDK loaded but embedKQLDashboard method not available. Check Fabric admin settings.');
              setIsLoading(false);
            }
          }, 500);
        };

        script.onerror = (err) => {
          console.error('Script load error:', err);
          setError(
            'Failed to load Fabric Embed SDK. Please verify:\n' +
            '1. Fabric admin center has embedding enabled\n' +
            '2. Your workspace has Premium capacity\n' +
            '3. You have Member/Admin role in the workspace\n' +
            '4. Check browser console for more details'
          );
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error('Error loading Fabric Embed:', err);
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    loadFabricEmbed();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#FAF8F2]">
      {/* Header */}
      <div className="bg-[#021838] text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hemy Live Data & BMS</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-[#021838] border-t-[#7C4D2F] rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div
          id="fabric-embed"
          style={{
            width: '100%',
            height: '100%',
            display: isLoading || error ? 'none' : 'block',
          }}
        />
      </div>
    </div>
  );
}
