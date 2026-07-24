import { useState } from 'react';

export function HemyProjectsPage() {
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
