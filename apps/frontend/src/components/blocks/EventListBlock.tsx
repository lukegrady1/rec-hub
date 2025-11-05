import { useEffect, useState } from 'react'
import { publicAPI } from '../../lib/api'

interface EventListBlockProps {
  config: {
    limit?: number
    showDates?: boolean
  }
}

interface Event {
  id: string
  title: string
  description: string
  starts_at: string
  ends_at: string
  location: string
  capacity: number
}

export default function EventListBlock({ config }: EventListBlockProps) {
  const { limit = 5, showDates = true } = config
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await publicAPI.getUpcomingEvents()
      const limited = (response.events || []).slice(0, limit)
      setEvents(limited)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-brand-muted">Loading events...</div>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return null
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-display font-bold text-brand-neutral mb-8">
          Upcoming Events
        </h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-brand-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {showDates && (
                  <div className="bg-brand-primary text-white rounded-lg p-4 md:w-24 flex flex-col items-center justify-center shrink-0">
                    <div className="text-3xl font-bold">
                      {new Date(event.starts_at).getDate()}
                    </div>
                    <div className="text-sm font-medium uppercase">
                      {new Date(event.starts_at).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-brand-neutral mb-2">
                    {event.title}
                  </h3>
                  <p className="text-brand-muted mb-2 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-brand-muted">
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.capacity > 0 && (
                      <div className="flex items-center gap-1">
                        <span>👥</span>
                        <span>{event.capacity} capacity</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="/events"
            className="inline-block bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-primaryHover transition-colors"
          >
            View All Events
          </a>
        </div>
      </div>
    </div>
  )
}
