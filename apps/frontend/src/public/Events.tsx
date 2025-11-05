import { useEffect, useState } from 'react'
import { publicAPI } from '../lib/api'
import PublicLayout from '../components/PublicLayout'

interface Event {
  id: string
  title: string
  description: string
  starts_at: string
  ends_at: string
  location: string
  capacity: number
  status: string
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showPast, setShowPast] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await publicAPI.getUpcomingEvents()
      setEvents(response.events || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date()
  }

  const upcomingEvents = events.filter(e => isUpcoming(e.starts_at))
  const pastEvents = events.filter(e => !isUpcoming(e.starts_at))
  const displayEvents = showPast ? pastEvents : upcomingEvents

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-display font-extrabold mb-4">
            Community Events
          </h1>
          <p className="text-xl text-blue-100">
            Join us for upcoming activities and special events
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Toggle Filter */}
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setShowPast(false)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              !showPast
                ? 'bg-brand-primary text-white shadow-lg'
                : 'bg-white text-brand-neutral hover:shadow-md'
            }`}
          >
            Upcoming Events ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setShowPast(true)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              showPast
                ? 'bg-brand-primary text-white shadow-lg'
                : 'bg-white text-brand-neutral hover:shadow-md'
            }`}
          >
            Past Events ({pastEvents.length})
          </button>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-brand-muted text-lg">Loading events...</div>
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-brand-neutral mb-2">
              {showPast ? 'No past events' : 'No upcoming events'}
            </h3>
            <p className="text-brand-muted">
              {showPast
                ? 'Check the upcoming events tab for new activities'
                : 'Check back soon for new events!'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-brand-border overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Date Badge */}
                  <div className="bg-brand-primary text-white p-6 md:w-32 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold">
                      {new Date(event.starts_at).getDate()}
                    </div>
                    <div className="text-sm font-medium uppercase">
                      {new Date(event.starts_at).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 p-6">
                    <h3 className="text-2xl font-bold text-brand-neutral mb-2">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-brand-muted">
                        <span>🕒</span>
                        <span>{formatDateTime(event.starts_at)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-brand-muted">
                          <span>📍</span>
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.capacity > 0 && (
                        <div className="flex items-center gap-2 text-brand-muted">
                          <span>👥</span>
                          <span>Capacity: {event.capacity}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-brand-muted mb-4">
                      {event.description}
                    </p>

                    {isUpcoming(event.starts_at) && (
                      <button className="bg-brand-accent text-white font-semibold px-6 py-2 rounded-lg hover:bg-brand-accentHover transition-colors">
                        Register Interest
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
