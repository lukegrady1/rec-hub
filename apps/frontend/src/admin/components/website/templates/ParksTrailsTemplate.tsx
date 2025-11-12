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

export default function ParksTrailsTemplate({ config, previewData }: TemplateProps) {
  const enabledPagesList = Object.entries(config.enabledPages)
    .filter(([_, enabled]) => enabled)
    .map(([page]) => page)

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🌲</div>
              <div>
                <h1 className="text-2xl font-bold">Parks & Recreation</h1>
                <p className="text-sm text-green-200">Connecting with nature</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-white hover:text-green-200 transition-colors font-medium">Home</a>
              {enabledPagesList.map((page) => (
                <a key={page} href="#" className="text-white hover:text-green-200 transition-colors font-medium capitalize">
                  {page}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-600 to-green-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* Tree pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 15L25 25h10l-5-10zm0 30L25 35h10l-5 10z\' fill=\'%23ffffff\' fill-opacity=\'0.1\'/%3E%3C/svg%3E")',
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {config.hero.headline}
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-green-100">
              {config.hero.subheadline}
            </p>
            <a
              href={config.hero.ctaLink}
              className="inline-block bg-amber-500 text-green-900 font-bold px-8 py-4 rounded-full hover:bg-amber-400 transition-all shadow-xl"
            >
              {config.hero.ctaText}
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {config.enabledPages.programs && (
          <section className="mb-16">
            <div className="text-center mb-10">
              <h3 className="text-4xl font-bold text-green-900 mb-3">Outdoor Programs</h3>
              <p className="text-lg text-green-700">Experience nature through guided activities</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🥾', title: 'Hiking Adventures', desc: 'Explore scenic trails' },
                { icon: '🚴', title: 'Cycling Tours', desc: 'Bike through beautiful paths' },
                { icon: '🏕️', title: 'Camping Programs', desc: 'Overnight outdoor experiences' },
                { icon: '🎣', title: 'Fishing Classes', desc: 'Learn sustainable fishing' },
                { icon: '🦅', title: 'Bird Watching', desc: 'Discover local wildlife' },
                { icon: '🌿', title: 'Nature Walks', desc: 'Guided botanical tours' }
              ].map((program, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-green-600">
                  <div className="text-5xl mb-4">{program.icon}</div>
                  <h4 className="text-xl font-bold text-green-900 mb-2">{program.title}</h4>
                  <p className="text-green-700 mb-4">{program.desc}</p>
                  <a href="#" className="text-green-600 font-semibold hover:text-green-700">Learn More →</a>
                </div>
              ))}
            </div>
          </section>
        )}

        {config.enabledPages.facilities && (
          <section className="mb-16">
            <div className="text-center mb-10">
              <h3 className="text-4xl font-bold text-green-900 mb-3">Park Facilities</h3>
              <p className="text-lg text-green-700">Well-maintained spaces for your enjoyment</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { name: 'Riverside Park', features: ['Picnic areas', 'Playground', 'Walking trails'] },
                { name: 'Mountain View Trail', features: ['Scenic overlook', 'Hiking paths', 'Rest areas'] },
                { name: 'Lake Recreation Area', features: ['Swimming beach', 'Boat launch', 'Fishing pier'] },
                { name: 'Forest Grove', features: ['Camping sites', 'Nature center', 'Wildlife viewing'] }
              ].map((facility, i) => (
                <div key={i} className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-8 border-2 border-green-200">
                  <h4 className="text-2xl font-bold text-green-900 mb-4">{facility.name}</h4>
                  <ul className="space-y-2 mb-6">
                    {facility.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-green-800">
                        <span className="text-green-600">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a href="#" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                    Book Now
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {config.enabledPages.events && (
          <section>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-10">
              <h3 className="text-3xl font-bold text-green-900 mb-6">Upcoming Events</h3>
              <div className="space-y-6">
                {[
                  { date: 'Nov 15', title: 'Fall Foliage Hike', time: '9:00 AM' },
                  { date: 'Nov 22', title: 'Family Camping Weekend', time: '2:00 PM' },
                  { date: 'Nov 29', title: 'Winter Prep Workshop', time: '10:00 AM' }
                ].map((event, i) => (
                  <div key={i} className="flex items-center gap-6 bg-white rounded-lg p-6 shadow">
                    <div className="bg-green-600 text-white rounded-lg p-4 text-center min-w-[80px]">
                      <div className="text-sm font-bold">{event.date}</div>
                      <div className="text-xs mt-1">{event.time}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-green-900">{event.title}</h4>
                      <p className="text-green-700 text-sm">Outdoor recreation for all ages</p>
                    </div>
                    <a href="#" className="text-green-600 font-bold hover:text-green-700">Register →</a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌲</span>
                <h4 className="font-bold text-lg">Parks & Recreation</h4>
              </div>
              <p className="text-sm text-green-300">Preserving nature, enriching lives</p>
            </div>
            <div>
              <h5 className="font-bold mb-3">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                {enabledPagesList.map((page) => (
                  <li key={page}>
                    <a href="#" className="text-green-300 hover:text-white capitalize">{page}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-3">Hours</h5>
              <p className="text-sm text-green-300">
                Parks: Dawn to Dusk<br />
                Office: Mon-Fri 8AM-5PM
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-3">Contact</h5>
              <p className="text-sm text-green-300">
                parks@recreation.gov<br />
                (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-green-800 pt-6 text-center text-sm text-green-400">
            © 2025 Parks & Recreation Department • Protecting our natural heritage
          </div>
        </div>
      </footer>
    </div>
  )
}
