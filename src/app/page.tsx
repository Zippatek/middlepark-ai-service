export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream text-charcoal font-sans selection:bg-red-muted/30 p-6">
      <main className="flex flex-col w-full max-w-5xl gap-12">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center rounded-full border border-red-muted bg-white px-3 py-1 text-sm text-red backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-red mr-2 animate-pulse"></span>
            System Operational
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-charcoal-dark font-cormorant">
            <span className="text-charcoal-dark">MIDDLE</span>
            <span className="text-red">PARK</span>
            <span className="font-sans font-normal ml-3">AI Microservices</span>
          </h1>
          <p className="text-charcoal-light max-w-2xl">
            Directory of active endpoints and internal dashboards for the MiddlePark AI infrastructure. Select a service below to access it.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Dashboard Shortcut */}
          <a href="/dashboard" className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-cream-border hover:border-red hover:shadow-card-hover transition-all duration-300">
            <div className="absolute inset-0 bg-red-tint opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-tint text-red flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-charcoal-dark mb-2">CS Dashboard</h3>
              <p className="text-charcoal-light text-sm">
                Customer Service admin panel for managing AI interactions and monitoring metrics.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center text-red font-medium text-sm group-hover:translate-x-1 transition-transform">
              Access Dashboard &rarr;
            </div>
          </a>

          {/* User Dashboard Shortcut */}
          <a href="/user" className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-cream-border hover:border-red hover:shadow-card-hover transition-all duration-300">
            <div className="absolute inset-0 bg-red-tint opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-tint text-red flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-charcoal-dark mb-2">User Simulation</h3>
              <p className="text-charcoal-light text-sm">
                Simulated public website with embedded chat widget to test user interactions.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center text-red font-medium text-sm group-hover:translate-x-1 transition-transform">
              View Prototype &rarr;
            </div>
          </a>

          {/* Chat API Shortcut */}
          <a href="/api/ai-agent/chat" className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-cream-border hover:border-red hover:shadow-card-hover transition-all duration-300">
            <div className="absolute inset-0 bg-red-tint opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-tint text-red flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-charcoal-dark mb-2">Chat API</h3>
              <p className="text-charcoal-light text-sm">
                Main POST endpoint for the customer-facing chat widget. Handles AI inference.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center text-red font-medium text-sm group-hover:translate-x-1 transition-transform">
              View Endpoint &rarr;
            </div>
          </a>

          {/* Conversations API Shortcut */}
          <a href="/api/ai-agent/conversations" className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-cream-border hover:border-red hover:shadow-card-hover transition-all duration-300">
            <div className="absolute inset-0 bg-red-tint opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-tint text-red flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-charcoal-dark mb-2">Conversations API</h3>
              <p className="text-charcoal-light text-sm">
                GET endpoint for fetching historical conversation logs and metrics.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center text-red font-medium text-sm group-hover:translate-x-1 transition-transform">
              View Endpoint &rarr;
            </div>
          </a>

        </div>
      </main>
    </div>
  );
}
