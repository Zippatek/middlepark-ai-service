import { ChatWidget } from '../../ai-agent/client/ChatWidget';

export default function UserDashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream text-charcoal font-sans p-6 mb-[150px]">
      <main className="flex flex-col w-full max-w-5xl gap-6 flex-grow pt-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-charcoal-dark font-cormorant">
            User Simulation Dashboard
          </h1>
          <p className="text-charcoal-light max-w-2xl">
            This dashboard simulates a user interacting with the MiddlePark website. 
            Use the chat widget in the bottom right corner to test the AI agent and the customer agent handoff.
          </p>
        </div>
        
        {/* Some dummy content to make it look like a website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full">
          <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-sm flex flex-col justify-between h-56 transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-bold mb-2">Properties for Sale</h2>
              <p className="text-sm text-charcoal-light">Discover luxury properties in prime locations.</p>
            </div>
            <div className="self-start text-red font-medium text-sm border-b border-red pb-1 hover:text-red-dark hover:border-red-dark cursor-pointer mt-auto">
              View Listings &rarr;
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-sm flex flex-col justify-between h-56 transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-bold mb-2">Recent Sales</h2>
              <p className="text-sm text-charcoal-light">View our track record of successful transactions.</p>
            </div>
            <div className="self-start text-red font-medium text-sm border-b border-red pb-1 hover:text-red-dark hover:border-red-dark cursor-pointer mt-auto">
              View Track Record &rarr;
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-charcoal-light/70">
          Scroll down or look at the bottom right corner of the screen to interact with the AI assistant.
        </div>
      </main>

      {/* Embed the Chat Widget */}
      <ChatWidget autoOpenAfterSeconds={1} />
    </div>
  );
}
