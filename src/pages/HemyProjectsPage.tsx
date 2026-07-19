import { useState } from 'react';

export function HemyProjectsPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1B2A4A]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-[#DDD4C0] bg-[#1B2A4A] shadow-md">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C4D2F] text-[#FAF8F2]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-5 9 5m-9 5v6m-6-6v6m12-6v6"
                />
              </svg>
            </span>
            <span className="text-base font-semibold tracking-tight text-[#FAF8F2]">
              Hemy Projects
            </span>
          </div>
          <span
            className={`flex h-3 w-3 animate-pulse rounded-full ${
              !isLoading ? 'bg-green-400' : 'bg-yellow-400'
            }`}
          />
        </div>
      </header>

      <main className="relative h-[calc(100vh-80px)] w-full">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#FAF8F2]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DDD4C0] border-t-[#7C4D2F]" />
          </div>
        )}
        <iframe
          src="https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=2019ee4f-38bc-ef11-b8e9-000d3ab86138&newWindow=true&pagetype=entitylist&etn=msdyn_project&viewid=7345eda5-8eaa-f011-bbd3-7ced8d754618&viewType=4230"
          className="h-full w-full border-0"
          allow="geolocation; microphone; camera; payment"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          onLoad={() => setIsLoading(false)}
        />
      </main>
    </div>
  );
}
