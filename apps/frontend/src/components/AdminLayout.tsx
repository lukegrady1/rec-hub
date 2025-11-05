import { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { settingsAPI } from '../lib/api'

interface AdminLayoutProps {
  children: ReactNode
}

interface TenantSettings {
  branding?: {
    departmentName?: string
    logoUrl?: string
    primaryColor?: string
    accentColor?: string
  }
  config?: {
    departmentName?: string
  }
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [settings, setSettings] = useState<TenantSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get()
      setSettings(response)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/admin/login')
  }

  const departmentName = settings.branding?.departmentName || settings.config?.departmentName || 'Recreation Department'
  const logoUrl = settings.branding?.logoUrl
  const primaryColor = settings.branding?.primaryColor || '#2563EB'

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/pages', label: 'Pages', icon: '📄' },
    { path: '/admin/programs', label: 'Programs', icon: '🎯' },
    { path: '/admin/events', label: 'Events', icon: '📅' },
    { path: '/admin/facilities', label: 'Facilities', icon: '🏢' },
    { path: '/admin/bookings', label: 'Bookings', icon: '📝' },
    { path: '/admin/program-registrations', label: 'Registrations', icon: '✅' },
    { path: '/admin/theme', label: 'Theme', icon: '🎨' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={departmentName}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {departmentName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-lg font-display font-bold text-brand-neutral">
                  {departmentName}
                </h1>
                <p className="text-xs text-brand-muted">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-muted hover:text-brand-primary transition-colors"
              >
                View Public Site →
              </a>
              <button
                onClick={handleLogout}
                className="text-sm text-brand-muted hover:text-brand-danger transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${
                        isActive
                          ? 'text-white font-semibold'
                          : 'text-brand-neutral hover:bg-gray-100'
                      }
                    `}
                    style={isActive ? { backgroundColor: primaryColor } : {}}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
