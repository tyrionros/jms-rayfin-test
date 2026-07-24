export function HemyFinancePage() {
  const hemyFinanceUrl =
    'https://businesscentral.dynamics.com/ead65215-ebfd-4a8d-9e73-b403a85a7e04/Production';

  const handleOpenFinance = () => {
    window.open(hemyFinanceUrl, '_blank');
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
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-[#021838]">
              Hemy Finance
            </h1>

            {/* Description */}
            <p className="text-center text-[#C4956A] mb-2 text-sm md:text-base leading-relaxed">
              Access your Business Central Finance environment
            </p>

            <p className="text-center text-[#7C4D2F] mb-8 text-xs md:text-sm leading-relaxed">
              Business Central opens in a new tab to provide the best experience with full functionality and performance.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleOpenFinance}
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
                Open Business Central
              </button>
            </div>

            {/* Footer Info */}
            <p className="text-center text-[#C4956A] text-xs md:text-sm mt-8 pt-6 border-t border-[#DDD4C0]">
              💡 Tip: You'll be automatically authenticated with your current session
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
