import { useState } from 'react';

export function MyActionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dashboardUrl =
    'https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&navbar=off&pagetype=dashboard&id=94f6fb8a-af0f-f011-998a-000d3ab98ff7&type=system&_canOverride=true';

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('Failed to load dashboard. Please check your connection or permissions.');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#021838]">
      <main className="h-screen w-full">
        {isLoading && (
          <div className="flex h-full items-center justify-center bg-[#FAF8F2]">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#DDD4C0] border-t-[#021838]" />
              </div>
              <p className="text-sm text-[#C4956A]">Loading dashboard...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex h-full items-center justify-center bg-[#FAF8F2]">
            <div className="rounded-2xl border border-[#DDD4C0] bg-white p-8 text-center shadow-md">
              <svg
                className="mx-auto mb-4 h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0 6a9 9 0 110-18 9 9 0 010 18zm0-13a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              <h3 className="mb-2 font-semibold text-[#021838]">Connection Error</h3>
              <p className="text-sm text-[#C4956A]">{error}</p>
            </div>
          </div>
        )}

        <iframe
          src={dashboardUrl}
          title="My Action - Dynamics Dashboard"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: isLoading || error ? 'none' : 'block',
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="geolocation; microphone; camera"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        />
      </main>
    </div>
  );
}
