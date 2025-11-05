import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { programsAPI, eventsAPI, facilitiesAPI, bookingsAPI, getAPI } from '../lib/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    programs: 0,
    events: 0,
    facilities: 0,
    bookings: 0,
    registrations: 0,
    pendingRegistrations: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [programs, events, facilities, bookings, registrations] = await Promise.all([
          programsAPI.list(),
          eventsAPI.list(),
          facilitiesAPI.list(),
          bookingsAPI.list(),
          getAPI().get('/program-registrations'),
        ])

        const registrationsList = registrations.data.registrations || []
        const pendingCount = registrationsList.filter((r: any) => r.status === 'pending').length

        setStats({
          programs: programs.programs?.length || 0,
          events: events.events?.length || 0,
          facilities: facilities.facilities?.length || 0,
          bookings: bookings.bookings?.length || 0,
          registrations: registrationsList.length,
          pendingRegistrations: pendingCount,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: 'Programs', value: stats.programs, icon: '🎯', color: 'text-blue-600' },
    { label: 'Events', value: stats.events, icon: '📅', color: 'text-green-600' },
    { label: 'Facilities', value: stats.facilities, icon: '🏢', color: 'text-purple-600' },
    { label: 'Bookings', value: stats.bookings, icon: '📝', color: 'text-orange-600' },
    { label: 'Pending Registrations', value: stats.pendingRegistrations, icon: '✅', color: 'text-yellow-600', highlight: stats.pendingRegistrations > 0 },
  ]

  const quickActions = [
    { title: 'Create Page', href: '/admin/pages', icon: '📄', color: 'bg-blue-500' },
    { title: 'Add Program', href: '/admin/programs', icon: '🎯', color: 'bg-green-500' },
    { title: 'Schedule Event', href: '/admin/events', icon: '📅', color: 'bg-purple-500' },
    { title: 'View Registrations', href: '/admin/program-registrations', icon: '✅', color: 'bg-yellow-500' },
  ]

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-display font-extrabold text-brand-neutral mb-2">
          Dashboard
        </h1>
        <p className="text-brand-muted mb-8">
          Welcome back! Here's what's happening with your recreation site.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`p-6 rounded-2xl shadow-sm border ${
                stat.highlight
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-white border-brand-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-brand-muted">{stat.label}</span>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {loading ? '...' : stat.value}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-display font-bold text-brand-neutral mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-bold text-brand-neutral group-hover:text-brand-primary">
                    {action.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
