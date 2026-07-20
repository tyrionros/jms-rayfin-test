export function HemyLiveDataPage() {
  const workspaceId = '0f49bb62-6832-40a7-825d-b730e9874a50';
  const dashboardId = '504c0b42-48e2-48e4-84c2-127b69c7dac6';

  // Construct the Fabric KQL Dashboard embed URL
  const dashboardUrl = `https://app.fabric.microsoft.com/groups/${workspaceId}/dashboards/${dashboardId}?experience=power-bi`;

  return (
    <div className="flex flex-col h-screen bg-[#FAF8F2]">
      {/* Header */}
      <div className="bg-[#021838] text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hemy Live Data & BMS</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={dashboardUrl}
          title="Hemy Live Data & BMS Dashboard"
          className="w-full h-full border-0"
          allow="geolocation; microphone; camera; payment"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
        />
      </div>
    </div>
  );
}

