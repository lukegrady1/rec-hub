import { WebsiteConfig } from '../../../WebsiteBuilder'

interface PreviewData {
  programs?: any[]
  events?: any[]
  facilities?: any[]
}

interface TemplateProps {
  config: WebsiteConfig
  previewData?: PreviewData
  hideHeader?: boolean
}

export default function ClassicCivicTemplate({ config, previewData, hideHeader = false }: TemplateProps) {
  const enabledPagesList = Object.entries(config.enabledPages)
    .filter(([_, enabled]) => enabled)
    .map(([page]) => page)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {!hideHeader && (
        <header className="bg-white border-b-4 border-blue-600 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recreation Department</h1>
                <p className="text-sm text-gray-600">City Services</p>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                {enabledPagesList.map((page) => (
                  <a key={page} href="#" className="text-gray-700 hover:text-blue-600 font-medium capitalize">
                    {page}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {config.hero.headline}
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {config.hero.subheadline}
            </p>
            <a
              href={config.hero.ctaLink}
              className="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              {config.hero.ctaText}
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Links</h3>
              <ul className="space-y-2">
                {enabledPagesList.map((page) => (
                  <li key={page}>
                    <a href="#" className="text-blue-600 hover:underline capitalize">
                      {page}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <h4 className="font-bold text-sm mb-2 text-gray-900">Office Hours</h4>
              <p className="text-sm text-gray-700">Monday - Friday<br />8:00 AM - 5:00 PM</p>
            </div>
          </aside>

          {/* Content Area */}
          <div className="md:col-span-2 space-y-8">
            {config.enabledPages.programs && (
              <section className="bg-white rounded-lg shadow p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Featured Programs</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {previewData?.programs && previewData.programs.length > 0 ? (
                    previewData.programs.slice(0, 4).map((program) => (
                      <div key={program.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-gray-900 mb-2">{program.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{program.description || 'Check out this exciting program!'}</p>
                        {program.price_cents > 0 && (
                          <p className="text-sm font-medium text-blue-600 mb-2">${(program.price_cents / 100).toFixed(2)}</p>
                        )}
                        <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Learn More →</a>
                      </div>
                    ))
                  ) : (
                    [1, 2, 3, 4].map((i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-gray-900 mb-2">Sample Program {i}</h4>
                        <p className="text-sm text-gray-600 mb-3">Join us for this exciting activity...</p>
                        <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Learn More →</a>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {config.enabledPages.events && (
              <section className="bg-white rounded-lg shadow p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Upcoming Events</h3>
                <div className="space-y-4">
                  {previewData?.events && previewData.events.length > 0 ? (
                    previewData.events.slice(0, 3).map((event) => {
                      const eventDate = event.starts_at ? new Date(event.starts_at) : new Date()
                      const day = eventDate.getDate()
                      const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()

                      return (
                        <div key={event.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                          <div className="flex-shrink-0 bg-blue-100 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-700">{day}</div>
                            <div className="text-xs text-gray-600">{month}</div>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{event.title}</h4>
                            <p className="text-sm text-gray-600">
                              {event.location || 'Community Center'}
                            </p>
                            {event.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                        <div className="flex-shrink-0 bg-blue-100 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-700">15</div>
                          <div className="text-xs text-gray-600">NOV</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Sample Event {i}</h4>
                          <p className="text-sm text-gray-600">Location: Community Center</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      {!hideHeader && (
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-6">
              <div>
                <h4 className="font-bold mb-3">Recreation Department</h4>
                <p className="text-sm text-gray-400">Serving our community with quality programs and facilities</p>
              </div>
              <div>
                <h4 className="font-bold mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  {enabledPagesList.slice(0, 4).map((page) => (
                    <li key={page}>
                      <a href="#" className="text-gray-400 hover:text-white capitalize">{page}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Contact</h4>
                <p className="text-sm text-gray-400">
                  123 Main Street<br />
                  City, State 12345<br />
                  (555) 123-4567
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
              © 2025 Recreation Department. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
