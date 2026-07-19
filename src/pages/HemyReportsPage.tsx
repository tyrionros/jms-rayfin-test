import { useState } from 'react';

export function HemyReportsPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#021838]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-[#DDD4C0] bg-[#021838] shadow-md">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C4D2F] text-[#FAF8F2]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            <span className="text-base font-semibold tracking-tight text-[#FAF8F2]">
              Hemy Reports
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
          src="https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entitylist&etn=new_hemyreports&viewid=c8d0f12a-4ec9-4c46-98b5-631ddd68c890&viewType=1039&navbar=off"
          className="h-full w-full border-0"
          allow="geolocation; microphone; camera; payment"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          onLoad={() => setIsLoading(false)}
        />
      </main>
    </div>
  );
}
