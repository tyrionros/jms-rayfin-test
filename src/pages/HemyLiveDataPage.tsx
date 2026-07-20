import { useEffect, useState } from 'react';

export function HemyLiveDataPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const workspaceId = '0f49bb62-6832-40a7-825d-b730e9874a50';
  const dashboardId = '504c0b42-48e2-48e4-84c2-127b69c7dac6';

  useEffect(() => {
    const loadFabricEmbed = async () => {
      try {
        setIsLoading(true);
        // Load the Fabric Embed SDK
        const script = document.createElement('script');
        script.src = 'https://app.fabric.microsoft.com/v1/embed';
        script.async = true;
        script.onload = () => {
          // SDK loaded, embed the dashboard
          if ((window as any).fabric && (window as any).fabric.embeds) {
            (window as any).fabric.embeds.embedKQLDashboard(document.getElementById('fabric-embed'), {
              dashboardId: dashboardId,
              groupId: workspaceId,
              pageView: 'fitToWidth',
            });
          }
          setIsLoading(false);
        };
        script.onerror = () => {
          setError('Failed to load Fabric Embed SDK');
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } catch (err) {
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
