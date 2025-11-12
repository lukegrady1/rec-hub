import { WebsiteConfig } from '../../../WebsiteBuilder'

interface PreviewData {
  programs?: any[]
  events?: any[]
  facilities?: any[]
}

interface TemplateProps {
  config: WebsiteConfig
  previewData?: PreviewData
}

export default function ModernGridTemplate({ config, previewData }: TemplateProps) {
  const enabledPagesList = Object.entries(config.enabledPages)
    .filter(([_, enabled]) => enabled)
    .map(([page]) => page)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tight">REC</h1>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="font-semibold hover:text-emerald-400 transition-colors">Home</a>
              {enabledPagesList.map((page) => (
                <a key={page} href="#" className="font-semibold hover:text-emerald-400 transition-colors capitalize">
                  {page}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            {config.hero.headline}
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-medium">
            {config.hero.subheadline}
          </p>
          <a
            href={config.hero.ctaLink}
            className="inline-block bg-black text-white font-bold px-10 py-5 rounded-full hover:bg-gray-900 transition-all transform hover:scale-105 shadow-2xl"
          >
            {config.hero.ctaText}
          </a>
        </div>
      </section>

      {/* Main Content - Card Grid */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        {config.enabledPages.programs && (
          <section className="mb-20">
            <h3 className="text-4xl font-black mb-10 text-gray-900">Programs</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {previewData?.programs && previewData.programs.length > 0 ? (
                previewData.programs.slice(0, 6).map((program, index) => (
                  <div key={program.id} className="group cursor-pointer">
                    <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl mb-4 overflow-hidden group-hover:scale-105 transition-transform">
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        {['⚽', '🏀', '🏊', '🎨', '🎭', '🎸'][index % 6]}
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-2 text-gray-900">{program.title}</h4>
                    <p className="text-gray-600">{program.description || 'Engage in this exciting program'}</p>
                    {program.price_cents > 0 && (
                      <p className="text-emerald-600 font-bold mt-2">${(program.price_cents / 100).toFixed(2)}</p>
                    )}
                  </div>
                ))
              ) : (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl mb-4 overflow-hidden group-hover:scale-105 transition-transform">
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        {['⚽', '🏀', '🏊', '🎨', '🎭', '🎸'][i - 1]}
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-2 text-gray-900">Activity {i}</h4>
                    <p className="text-gray-600">Engage in this exciting program</p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {config.enabledPages.events && (
          <section className="mb-20">
            <h3 className="text-4xl font-black mb-10 text-gray-900">Events</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {previewData?.events && previewData.events.length > 0 ? (
                previewData.events.slice(0, 4).map((event) => {
                  const eventDate = event.starts_at ? new Date(event.starts_at) : new Date()
                  const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()

                  return (
                    <div key={event.id} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 hover:shadow-xl transition-shadow border-l-8 border-orange-500">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-sm font-bold text-orange-600 mb-2">{dateStr}</div>
                          <h4 className="text-2xl font-black text-gray-900">{event.title}</h4>
                        </div>
                        <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                          {event.capacity ? `${event.capacity} spots` : 'FREE'}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{event.description || 'Join us for an amazing community gathering...'}</p>
                      {event.location && <p className="text-sm text-gray-600 mb-4">📍 {event.location}</p>}
                      <a href="#" className="font-bold text-orange-600 hover:text-orange-700">Register Now →</a>
                    </div>
                  )
                })
              ) : (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 hover:shadow-xl transition-shadow border-l-8 border-orange-500">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm font-bold text-orange-600 mb-2">NOV 15, 2025</div>
                        <h4 className="text-2xl font-black text-gray-900">Event Title {i}</h4>
                      </div>
                      <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        FREE
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">Join us for an amazing community gathering...</p>
                    <a href="#" className="font-bold text-orange-600 hover:text-orange-700">Register Now →</a>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {config.enabledPages.facilities && (
          <section>
            <h3 className="text-4xl font-black mb-10 text-gray-900">Facilities</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-black text-white rounded-2xl p-6 hover:bg-gray-900 transition-colors">
                  <div className="text-4xl mb-4">{['🏟️', '🏊', '🎾', '⛹️'][i - 1]}</div>
                  <h4 className="font-bold text-lg mb-2">Facility {i}</h4>
                  <p className="text-sm text-gray-400 mb-4">Available for booking</p>
                  <a href="#" className="text-emerald-400 text-sm font-bold hover:underline">View Schedule →</a>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="text-2xl font-black mb-4">REC</h4>
              <p className="text-gray-400 text-sm">Modern recreation for modern times</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Pages</h5>
              <ul className="space-y-2 text-sm">
                {enabledPagesList.map((page) => (
                  <li key={page}>
                    <a href="#" className="text-gray-400 hover:text-white capitalize">{page}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Connect</h5>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Facebook • Instagram</p>
                <p>Twitter • YouTube</p>
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-4">Contact</h5>
              <p className="text-sm text-gray-400">
                hello@recreation.city<br />
                (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            © 2025 Recreation Department
          </div>
        </div>
      </footer>
    </div>
  )
}
