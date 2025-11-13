import { Link } from 'react-router-dom'
import { WebsiteConfig } from '../../../WebsiteBuilder'
import MonthlyCalendar from '../../../../components/MonthlyCalendar'
import ModernHero from '../../../../components/ModernHero'

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
      <ModernHero
        title={config.hero.headline}
        description={config.hero.subheadline}
        gradient="from-blue-600 via-indigo-600 to-purple-700"
        pattern="dots"
      >
        <Link
          to="/preview/programs"
          className="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          {config.hero.ctaText}
        </Link>
      </ModernHero>

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
                    <Link to={`/preview/${page}`} className="text-blue-600 hover:underline capitalize">
                      {page}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6">
              <h4 className="font-bold text-sm mb-2 text-gray-900">Office Hours</h4>
              <p className="text-sm text-gray-700">Monday - Friday<br />8:00 AM - 5:00 PM</p>
            </div>

            <MonthlyCalendar className="mb-6" events={previewData?.events || []} />
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
                        <Link to={`/preview/programs/${program.id}`} className="text-blue-600 text-sm font-medium hover:underline">Learn More →</Link>
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

            {config.enabledPages.facilities && (
              <section className="bg-white rounded-lg shadow p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">View Facilities</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {previewData?.facilities && previewData.facilities.length > 0 ? (
                    previewData.facilities.slice(0, 4).map((facility) => {
                      const getFacilityIcon = (type: string) => {
                        const icons: Record<string, string> = {
                          'room': '🏛️',
                          'field': '⚽',
                          'court': '🏀',
                          'gym': '🏋️',
                          'pool': '🏊',
                          'park': '🌳',
                        }
                        return icons[type?.toLowerCase()] || '🏢'
                      }

                      return (
                        <div key={facility.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">{getFacilityIcon(facility.type)}</span>
                            <div>
                              <h4 className="font-bold text-gray-900">{facility.name}</h4>
                              <span className="text-xs text-blue-600 uppercase font-medium">{facility.type || 'Facility'}</span>
                            </div>
                          </div>
                          {facility.address && (
                            <p className="text-sm text-gray-600 mb-2">📍 {facility.address}</p>
                          )}
                          <Link to={`/preview/facilities/${facility.id}`} className="text-blue-600 text-sm font-medium hover:underline">Book Now →</Link>
                        </div>
                      )
                    })
                  ) : (
                    [1, 2, 3, 4].map((i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">🏢</span>
                          <div>
                            <h4 className="font-bold text-gray-900">Sample Facility {i}</h4>
                            <span className="text-xs text-blue-600 uppercase font-medium">FACILITY</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">📍 123 Main Street</p>
                        <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Book Now →</a>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Upcoming Events Section */}
            {config.enabledPages.events && (
              <section className="bg-white rounded-lg shadow p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Upcoming Events</h3>
                <div className="space-y-4">
                  {(() => {
                    const now = new Date()
                    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

                    const upcomingEvents = previewData?.events?.filter((event: any) => {
                      const eventDate = new Date(event.starts_at)
                      return eventDate >= now && eventDate <= threeDaysFromNow
                    }).slice(0, 3) || []

                    return upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event: any) => {
                        const eventDate = event.starts_at ? new Date(event.starts_at) : new Date()
                        const day = eventDate.getDate()
                        const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()
                        const time = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

                        return (
                          <Link
                            key={event.id}
                            to={`/preview/events/${event.id}`}
                            className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors p-2 rounded"
                          >
                            <div className="flex-shrink-0 bg-orange-100 rounded-lg p-4 text-center w-20">
                              <div className="text-2xl font-bold text-orange-600">{day}</div>
                              <div className="text-xs text-gray-600">{month}</div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                              <p className="text-sm text-gray-600 mb-1">
                                🕒 {time}
                              </p>
                              <p className="text-sm text-gray-600">
                                📍 {event.location || 'Community Center'}
                              </p>
                              {event.description && (
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>
                              )}
                            </div>
                          </Link>
                        )
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-lg mb-2">📅</p>
                        <p>No events scheduled in the next 3 days</p>
                        <Link to="/preview/events" className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block">
                          View all events →
                        </Link>
                      </div>
                    )
                  })()}
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
                      <Link to={`/preview/${page}`} className="text-gray-400 hover:text-white capitalize">{page}</Link>
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
