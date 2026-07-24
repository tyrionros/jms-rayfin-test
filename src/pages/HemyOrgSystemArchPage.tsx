export function HemyOrgSystemArchPage() {
  const visioFileUrl =
    'https://sbmyhre.sharepoint.com/:u:/s/DynamicsDocumentsStorage/IQDeQsiYherpSLLwOSqRPWLgARNmVYJLJqLw7-Y3bIGl940?e=MacRpj';

  const handleOpenVisio = () => {
    window.open(visioFileUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#021838]">
      <main className="h-screen w-full flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="rounded-2xl bg-white border border-[#DDD4C0] shadow-lg p-8 md:p-12">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-[#021838] p-4">
                <svg
                  className="h-8 w-8 text-[#FAF8F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 3H3v6h6V3zm0 8H3v6h6v-6zm8-8h-6v6h6V3zm0 8h-6v6h6v-6zM9 19H3v2h6v-2zm8 0h-6v2h6v-2z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-[#021838]">
              Organization System Architecture
            </h1>

            {/* Description */}
            <p className="text-center text-[#C4956A] mb-2 text-sm md:text-base leading-relaxed">
              View the Visio diagram of your organization's system architecture
            </p>

            <p className="text-center text-[#7C4D2F] mb-8 text-xs md:text-sm leading-relaxed">
              The Visio file will open in a new tab for viewing and collaboration through SharePoint.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleOpenVisio}
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[#021838] text-white rounded-lg font-semibold hover:bg-[#0D2E5C] transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View Visio Diagram
              </button>
            </div>

            {/* Footer Info */}
            <p className="text-center text-[#C4956A] text-xs md:text-sm mt-8 pt-6 border-t border-[#DDD4C0]">
              📐 Opens in SharePoint for full collaboration features
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
