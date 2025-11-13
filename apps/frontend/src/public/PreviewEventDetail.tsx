import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAPI } from '../lib/api'
import PreviewLayout from './PreviewLayout'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

export default function PreviewEventDetail() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<any>(null)
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const api = getAPI()
      const [configRes, dataRes] = await Promise.all([
        api.get('/website/preview-config'),
        api.get('/website/preview-data')
      ])
      setConfig(configRes.data)

      // Find the specific event from the preview data
      const events = dataRes.data.events || []
      const foundEvent = events.find((e: any) => e.id === id)
      setEvent(foundEvent || null)
    } catch (error) {
      console.error('Failed to fetch event:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PreviewLayout config={config}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-brand-muted">Loading event...</p>
          </div>
        </div>
      </PreviewLayout>
    )
  }

  if (!event) {
    return (
      <PreviewLayout config={config}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <Link to="/preview/events" className="text-brand-primary hover:underline">
              ← Back to Events
            </Link>
          </div>
        </div>
      </PreviewLayout>
    )
  }

  const eventDate = event.starts_at ? new Date(event.starts_at) : new Date()
  const endDate = event.ends_at ? new Date(event.ends_at) : null
  const dateStr = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  const timeStr = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
  const endTimeStr = endDate ? endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }) : null

  return (
    <PreviewLayout config={config}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/preview/events"
            className="text-brand-primary hover:text-brand-primaryHover font-medium inline-flex items-center gap-2"
          >
            ← Back to Events
          </Link>
        </nav>

        {/* Event Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-64 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h1 className="text-5xl font-bold mb-4">{event.title}</h1>
              {event.category && (
                <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  {event.category}
                </span>
              )}
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-brand-primary/10 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Date</h3>
                  <p className="text-gray-600">{dateStr}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-primary/10 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Time</h3>
                  <p className="text-gray-600">
                    {timeStr}
                    {endTimeStr && ` - ${endTimeStr}`}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/10 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
              )}

              {event.capacity && (
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/10 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Capacity</h3>
                    <p className="text-gray-600">
                      {event.capacity} attendees
                      {event.registered_count !== undefined && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({event.registered_count} registered)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {/* Registration CTA */}
            <div className="bg-brand-primary/5 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join Us?</h3>
              <p className="text-gray-600 mb-6">
                Register now to secure your spot at this event
              </p>
              <button className="bg-brand-accent hover:bg-brand-accentHover text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg">
                Register for Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </PreviewLayout>
  )
}
