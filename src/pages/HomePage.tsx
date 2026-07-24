import { ActionMenu } from '@/components/ActionMenu';

export function HomePage({ onNavigate }: { onNavigate?: (pageId: string) => void }) {
  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#021838]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-[#DDD4C0] bg-[#021838] shadow-md">
        <div className="flex items-center justify-between px-8 py-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C4D2F] text-[#FAF8F2]">
              <Hemy360Icon className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-[#FAF8F2]" title="Hemy 360 - test by JMS">
              Hemy 360
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ActionMenu
              title="My Action"
              items={[
                { label: 'My Action', onClick: () => onNavigate?.('myaction') },
                { label: 'My Activity', onClick: () => console.log('Activity') },
                { label: 'Oh My My', onClick: () => console.log('Oh My') },
              ]}
            />
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero Section ── */}
        <section className="relative px-4 py-20 sm:px-6 lg:px-8 xl:py-32">
          <div className="mx-auto max-w-4xl">
            {/* Hero Content */}
            <div className="text-center">
              {/* Badge */}
              <div className="mb-8 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#DDD4C0] bg-white px-4 py-2 text-sm font-medium text-[#7C4D2F]">
                  <span className="h-2 w-2 rounded-full bg-[#7C4D2F]"></span>
                  Welcome to Hemy 360
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="mb-6 bg-gradient-to-r from-[#021838] via-[#0D2E5C] to-[#7C4D2F] bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl xl:text-7xl">
                360° Business Intelligence
              </h1>

              {/* Subheadline */}
              <p className="mx-auto mb-8 max-w-2xl text-xl text-[#7C4D2F] sm:text-2xl">
                Comprehensive enterprise solutions for modern organizations. Real-time data, intelligent analytics, and seamless integration.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                  onClick={() => onNavigate?.('hemyai')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#021838] px-8 py-4 font-semibold text-[#FAF8F2] shadow-lg transition-all hover:bg-[#0D2E5C] hover:shadow-xl"
                >
                  <span>Explore AI Assistant</span>
                  <ArrowIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onNavigate?.('hemlivedata')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDD4C0] bg-white px-8 py-4 font-semibold text-[#021838] shadow-md transition-all hover:bg-[#F0EAD8] hover:shadow-lg"
                >
                  <span>View Live Data</span>
                  <ChartIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Section ── */}
        <section className="border-t border-[#DDD4C0] bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-[#021838] sm:text-5xl">
                Integrated Business Modules
              </h2>
              <p className="text-lg text-[#7C4D2F]">
                Everything you need to manage your organization in one platform
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  onClick={() => onNavigate?.(feature.pageId)}
                  className="group cursor-pointer rounded-xl border border-[#DDD4C0] bg-[#FAF8F2] p-8 transition-all hover:border-[#7C4D2F] hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#021838] text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-[#021838]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#7C4D2F]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats Section ── */}
        <section className="border-t border-[#DDD4C0] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mb-2 text-4xl font-bold text-[#021838] sm:text-5xl">
                    {stat.value}
                  </div>
                  <p className="text-sm text-[#7C4D2F]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="border-t border-[#DDD4C0] bg-[#021838] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-[#FAF8F2] sm:text-5xl">
              Ready to Transform Your Business?
            </h2>
            <p className="mb-8 text-lg text-[#DDD4C0]">
              Join organizations worldwide using Hemy 360 to drive growth and efficiency.
            </p>
            <button
              onClick={() => onNavigate?.('hemyai')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7C4D2F] px-8 py-4 font-semibold text-[#FAF8F2] shadow-lg transition-all hover:bg-[#9B6240] hover:shadow-xl"
            >
              Get Started Today
              <ArrowIcon className="h-5 w-5" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

const features = [
  {
    id: 'ai',
    pageId: 'hemyai',
    icon: '🤖',
    title: 'Hemy AI',
    description: 'Intelligent assistant powered by Azure AI Foundry for smart insights and automation',
  },
  {
    id: 'data',
    pageId: 'hemlivedata',
    icon: '📊',
    title: 'Live Data & BMS',
    description: 'Real-time dashboards and KPIs from your Fabric workspace',
  },
  {
    id: 'crm',
    pageId: 'hemyx',
    icon: '👥',
    title: 'Hemy X',
    description: 'Customer relationship management integrated with Dynamics',
  },
  {
    id: 'sales',
    pageId: 'hemysale',
    icon: '💼',
    title: 'Hemy Sale',
    description: 'Sales pipeline tracking and revenue analytics',
  },
  {
    id: 'finance',
    pageId: 'hemyfinance',
    icon: '💰',
    title: 'Hemy Finance',
    description: 'Financial operations and accounting via Business Central',
  },
  {
    id: 'projects',
    pageId: 'hemyprojects',
    icon: '🎯',
    title: 'Hemy Projects',
    description: 'Project management and resource planning',
  },
];

const stats = [
  { value: '10+', label: 'Integrated Modules' },
  { value: '24/7', label: 'Availability' },
  { value: '99.9%', label: 'Uptime' },
  { value: '∞', label: 'Scalability' },
];

function Hemy360Icon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <text
        x="12"
        y="16"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="sans-serif"
      >
        H
      </text>
      <path
        d="M 12 3 A 9 9 0 0 1 21 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M 21 12 L 19.5 10.5 L 20.5 11.5" fill="currentColor" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}
