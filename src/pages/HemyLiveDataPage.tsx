import { useEffect, useState, useRef } from 'react';

declare global {
  interface Window {
    fabric?: {
      embeds?: {
        embedKQLDashboard?: (element: HTMLElement, config: any) => any;
      };
    };
  }
}

interface HemyLiveDataPageProps {
  // Pass this in from the global auth state or MSAL provider context
  userAuthToken?: string; 
}

export function HemyLiveDataPage({ userAuthToken }: HemyLiveDataPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // React ref for clean container targeting
  const containerRef = useRef<HTMLDivElement>(null); 
  const embedInstanceRef = useRef<any>(null);

  const workspaceId = '0f49bb62-6832-40a7-825d-b730e9874a50';
  const dashboardId = '504c0b42-48e2-48e4-84c2-127b69c7dac6';

  useEffect(() => {
    const loadFabricEmbed = async () => {
      try {
        setIsLoading(true);

        // A secure token is required before executing the embed script
        if (!userAuthToken) {
          setError('Authentication token is required to initialize the Fabric dashboard.');
          setIsLoading(false);
          return;
        }

        const renderDashboard = () => {
          if (window.fabric?.embeds?.embedKQLDashboard && containerRef.current) {
            // Clear out old instances before drawing a new one
            containerRef.current.innerHTML = ''; 

            // Corrected native Fabric object schema
            embedInstanceRef.current = window.fabric.embeds.embedKQLDashboard(containerRef.current, {
              type: 'KQLDashboard',
              id: dashboardId,          // Correct field key
              workspaceId: workspaceId, // Correct field key
              accessToken: userAuthToken,
              settings: {
                pageView: 'fitToWidth'
              }
            });

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
          // Give the window frame an instantiation buffer window
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

    loadFabricEmbed();

    // Clean up connections when navigating away from the page
    return () => {
      if (embedInstanceRef.current && typeof embedInstanceRef.current.clean === 'function') {
        embedInstanceRef.current.clean();
      }
    };
  }, [userAuthToken]);

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
