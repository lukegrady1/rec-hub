import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { eventsAPI } from '../lib/api'

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
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    starts_at: '',
    ends_at: '',
    location: '',
    capacity: 0,
    status: 'active',
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.list()
      setEvents(response.events || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await eventsAPI.update(editingId, formData)
      } else {
        await eventsAPI.create(formData)
      }
      await fetchEvents()
      resetForm()
    } catch (error) {
      console.error('Failed to save event:', error)
    }
  }

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      starts_at: formatDateForInput(event.starts_at),
      ends_at: formatDateForInput(event.ends_at),
      location: event.location,
      capacity: event.capacity,
      status: event.status,
    })
    setEditingId(event.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      await eventsAPI.delete(id)
      await fetchEvents()
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      starts_at: '',
      ends_at: '',
      location: '',
      capacity: 0,
      status: 'active',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const getEventStatus = (startsAt: string, endsAt: string) => {
    const now = new Date()
    const start = new Date(startsAt)
    const end = new Date(endsAt)

    if (now < start) return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' }
    if (now > end) return { label: 'Past', color: 'bg-gray-100 text-gray-700' }
    return { label: 'Ongoing', color: 'bg-green-100 text-green-700' }
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-brand-neutral">
              Events
            </h1>
            <p className="text-brand-muted mt-1">
              Manage your recreation events and activities
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primaryHover transition-colors shadow-lg"
          >
            + Add Event
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-brand-border">
                <h2 className="text-2xl font-display font-bold text-brand-neutral">
                  {editingId ? 'Edit Event' : 'New Event'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-neutral mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                    placeholder="e.g., Summer Concert Series"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-neutral mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                    placeholder="Describe the event..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-neutral mb-1">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.starts_at}
                      onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral mb-1">
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.ends_at}
                      onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-neutral mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                      placeholder="e.g., Community Park"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-neutral mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-primaryHover transition-colors"
                  >
                    {editingId ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 text-brand-neutral font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Events List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-brand-muted">Loading events...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-brand-neutral mb-2">
              No events yet
            </h3>
            <p className="text-brand-muted mb-6">
              Create your first recreation event to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primaryHover transition-colors"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const status = getEventStatus(event.starts_at, event.ends_at)
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-brand-neutral flex-1">
                      {event.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <p className="text-brand-muted text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-brand-muted">📍</span>
                      <span className="text-brand-neutral">{event.location || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-muted">🕒</span>
                      <span className="text-brand-neutral">{formatDateTime(event.starts_at)}</span>
                    </div>
                    {event.capacity > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-brand-muted">👥</span>
                        <span className="text-brand-neutral">{event.capacity} capacity</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex-1 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-primaryHover transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="flex-1 bg-red-50 text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
