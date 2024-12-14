import { UptimeMonitor } from '@/components/uptime-monitor'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-6 w-6 rounded-sm bg-blue-600" />
            <span className="text-lg font-semibold text-gray-800">Status</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Status Overview */}
        <div className="mb-16">
          <div className="flex items-center gap-4">
            <div className="h-4 w-4 rounded-full bg-green-500" />
            <h1 className="text-3xl font-bold text-gray-900">All systems operational</h1>
          </div>
          <p className="mt-4 text-lg text-gray-600">
            Last updated {new Date().toLocaleString()}
          </p>
        </div>

        {/* Monitors */}
        <div className="space-y-16">
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Monitors</h2>
            <UptimeMonitor />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Incident History</h2>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-lg text-gray-600">No incidents reported.</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-lg text-gray-600">
            <div>Powered by Hetrix Tools</div>
            <div> {new Date().getFullYear()}</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
