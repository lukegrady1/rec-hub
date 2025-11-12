import { useState, useEffect } from 'react'
import { getAPI } from '../lib/api'
import PreviewLayout from './PreviewLayout'

export default function PreviewEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const api = getAPI()
      const [configRes, dataRes] = await Promise.all([
        api.get('/website/preview-config'),
        api.get('/website/preview-data')
      ])
      setConfig(configRes.data)
      setEvents(dataRes.data.events || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
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
            <p className="text-brand-muted">Loading events...</p>
          </div>
        </div>
      </PreviewLayout>
    )
  }

  return (
    <PreviewLayout config={config}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
          <p className="text-lg text-gray-600">
            Join us for exciting community events and activities
          </p>
        </div>

        {events.length > 0 ? (
          <div className="space-y-6">
            {events.map((event) => {
              const eventDate = event.starts_at ? new Date(event.starts_at) : new Date()
              const day = eventDate.getDate()
              const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()
              const year = eventDate.getFullYear()
              const time = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

              return (
                <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="flex">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-8 flex flex-col items-center justify-center min-w-[140px]">
                      <div className="text-sm font-bold mb-1">{month}</div>
                      <div className="text-5xl font-bold">{day}</div>
                      <div className="text-sm mt-1">{year}</div>
                    </div>
                    <div className="flex-1 p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      {event.location && (
                        <p className="text-gray-600 mb-2 flex items-center gap-2">
                          <span>📍</span>
                          {event.location}
                        </p>
                      )}
                      <p className="text-gray-600 mb-2 flex items-center gap-2">
                        <span>🕐</span>
                        {time}
                      </p>
                      {event.description && (
                        <p className="text-gray-700 mb-4">{event.description}</p>
                      )}
                      {event.capacity && (
                        <p className="text-sm text-gray-500 mb-4">
                          Capacity: {event.capacity} people
                        </p>
                      )}
                      <button className="bg-brand-accent text-white px-6 py-2 rounded-lg hover:bg-brand-accentHover transition-colors font-semibold">
                        Register for Event
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming events at this time.</p>
          </div>
        )}
      </div>
    </PreviewLayout>
  )
}
