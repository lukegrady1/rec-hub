import { useEffect, useState } from 'react'
import { publicAPI, facilitiesAPI, bookingsAPI } from '../lib/api'
import PublicLayout from '../components/PublicLayout'

interface Facility {
  id: string
  name: string
  type: string
  address: string
  rules: string
  photo_id: string | null
}

interface FacilitySlot {
  id: string
  facility_id: string
  starts_at: string
  ends_at: string
  status: string
}

export default function Facilities() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [slots, setSlots] = useState<FacilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<FacilitySlot | null>(null)
  const [bookingFormData, setBookingFormData] = useState({
    requester_name: '',
    requester_email: '',
    notes: '',
  })
  const [bookingSubmitted, setBookingSubmitted] = useState(false)

  useEffect(() => {
    fetchFacilities()
  }, [])

  const fetchFacilities = async () => {
    try {
      const response = await publicAPI.getFacilities()
      setFacilities(response.facilities || [])
    } catch (error) {
      console.error('Failed to fetch facilities:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSlots = async (facilityId: string) => {
    try {
      const response = await facilitiesAPI.listSlots(facilityId)
      // Only show open slots
      const openSlots = (response.slots || []).filter((s: FacilitySlot) => s.status === 'open')
      setSlots(openSlots)
    } catch (error) {
      console.error('Failed to fetch slots:', error)
    }
  }

  const handleViewAvailability = async (facility: Facility) => {
    setSelectedFacility(facility)
    await fetchSlots(facility.id)
  }

  const handleRequestBooking = (slot: FacilitySlot) => {
    setSelectedSlot(slot)
    setShowBookingForm(true)
  }

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) return

    try {
      await bookingsAPI.createPublic(
        selectedSlot.id,
        bookingFormData.requester_name,
        bookingFormData.requester_email,
        bookingFormData.notes
      )
      setBookingSubmitted(true)
      setBookingFormData({ requester_name: '', requester_email: '', notes: '' })
      setTimeout(() => {
        setShowBookingForm(false)
        setBookingSubmitted(false)
        setSelectedSlot(null)
      }, 3000)
    } catch (error) {
      console.error('Failed to submit booking:', error)
      alert('Failed to submit booking request. Please try again.')
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const getFacilityTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      room: '🚪',
      field: '🌳',
      court: '🏀',
      gym: '🏋️',
    }
    return icons[type] || '🏢'
  }

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-accent to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-display font-extrabold mb-4">
            Recreation Facilities
          </h1>
          <p className="text-xl text-green-100">
            Book our facilities for your events and activities
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Facilities Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-brand-muted text-lg">Loading facilities...</div>
          </div>
        ) : !selectedFacility ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-4xl">{getFacilityTypeIcon(facility.type)}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-brand-neutral">
                      {facility.name}
                    </h3>
                    <p className="text-sm text-brand-muted capitalize">{facility.type}</p>
                  </div>
                </div>

                {facility.address && (
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <span>📍</span>
                    <span className="text-brand-neutral">{facility.address}</span>
                  </div>
                )}

                {facility.rules && (
                  <p className="text-brand-muted text-sm mb-4 line-clamp-2">
                    {facility.rules}
                  </p>
                )}

                <button
                  onClick={() => handleViewAvailability(facility)}
                  className="w-full bg-brand-accent text-white font-semibold py-3 rounded-lg hover:bg-brand-accentHover transition-colors"
                >
                  View Availability
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Availability View */
          <div>
            <button
              onClick={() => {
                setSelectedFacility(null)
                setSlots([])
              }}
              className="mb-6 text-brand-primary hover:text-brand-primaryHover font-semibold flex items-center gap-2"
            >
              ← Back to all facilities
            </button>

            <div className="bg-white rounded-2xl border border-brand-border p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-4xl">{getFacilityTypeIcon(selectedFacility.type)}</span>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-brand-neutral">
                    {selectedFacility.name}
                  </h2>
                  <p className="text-brand-muted capitalize">{selectedFacility.type}</p>
                </div>
              </div>

              {selectedFacility.address && (
                <div className="flex items-center gap-2 mb-3">
                  <span>📍</span>
                  <span className="text-brand-neutral">{selectedFacility.address}</span>
                </div>
              )}

              {selectedFacility.rules && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-brand-neutral mb-2">Rules & Guidelines</h4>
                  <p className="text-brand-muted text-sm">{selectedFacility.rules}</p>
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold text-brand-neutral mb-4">
              Available Time Slots
            </h3>

            {slots.length === 0 ? (
              <div className="bg-white rounded-2xl border border-brand-border p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-brand-neutral mb-2">
                  No available slots
                </h3>
                <p className="text-brand-muted">
                  Please check back later for new availability
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-white rounded-xl border border-brand-border p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🕒</span>
                      <div className="flex-1">
                        <div className="font-semibold text-brand-neutral">
                          {formatDateTime(slot.starts_at)}
                        </div>
                        <div className="text-sm text-brand-muted">
                          to {formatDateTime(slot.ends_at)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRequestBooking(slot)}
                      className="w-full bg-brand-primary text-white font-semibold py-2 rounded-lg hover:bg-brand-primaryHover transition-colors"
                    >
                      Request Booking
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 border-b border-brand-border">
                <h2 className="text-2xl font-display font-bold text-brand-neutral">
                  Request Booking
                </h2>
              </div>

              {bookingSubmitted ? (
                <div className="p-6 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-brand-neutral mb-2">
                    Booking Request Submitted!
                  </h3>
                  <p className="text-brand-muted">
                    We'll review your request and send you a confirmation email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
                  <div className="bg-brand-bg rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-brand-neutral mb-1">
                      {selectedFacility?.name}
                    </div>
                    <div className="text-sm text-brand-muted">
                      {formatDateTime(selectedSlot.starts_at)} - {formatDateTime(selectedSlot.ends_at)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={bookingFormData.requester_name}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, requester_name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={bookingFormData.requester_email}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, requester_email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={bookingFormData.notes}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                      placeholder="Any special requests or notes..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-primaryHover transition-colors"
                    >
                      Submit Request
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingForm(false)
                        setSelectedSlot(null)
                      }}
                      className="flex-1 bg-gray-100 text-brand-neutral font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
