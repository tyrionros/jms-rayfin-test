import { useState } from 'react';

export function HemyDataPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#021838]">
      <main className="h-screen w-full relative">
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
