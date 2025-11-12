import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface PreviewLayoutProps {
  children: ReactNode
  config?: any
}

export default function PreviewLayout({ children, config }: PreviewLayoutProps) {
  const location = useLocation()

  const enabledPages = config?.enabledPages || {
    programs: true,
    events: true,
    facilities: true,
  }

  const navItems = [
    { path: '/preview', label: 'Home', enabled: true },
    { path: '/preview/programs', label: 'Programs', enabled: enabledPages.programs },
    { path: '/preview/events', label: 'Events', enabled: enabledPages.events },
    { path: '/preview/facilities', label: 'Facilities', enabled: enabledPages.facilities },
  ].filter(item => item.enabled)

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/preview" className="text-2xl font-bold text-brand-primary">
              Recreation Department
            </Link>
            <div className="flex gap-6 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-brand-primary border-b-2 border-brand-primary'
                      : 'text-gray-700 hover:text-brand-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
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
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-gray-400 hover:text-white">
                      {item.label}
                    </Link>
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
    </div>
  )
}
