import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAPI } from '../lib/api'
import PreviewLayout from './PreviewLayout'
import { MapPin, FileText, Building2, Calendar } from 'lucide-react'

export default function PreviewFacilityDetail() {
  const { id } = useParams<{ id: string }>()
  const [facility, setFacility] = useState<any>(null)
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFacility()
  }, [id])

  const fetchFacility = async () => {
    try {
      const api = getAPI()
      const [configRes, dataRes] = await Promise.all([
        api.get('/website/preview-config'),
        api.get('/website/preview-data')
      ])
      setConfig(configRes.data)

      // Find the specific facility from the preview data
      const facilities = dataRes.data.facilities || []
      const foundFacility = facilities.find((f: any) => f.id === id)
      setFacility(foundFacility || null)
    } catch (error) {
      console.error('Failed to fetch facility:', error)
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
            <p className="text-brand-muted">Loading facility...</p>
          </div>
        </div>
      </PreviewLayout>
    )
  }

  if (!facility) {
    return (
      <PreviewLayout config={config}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Facility Not Found</h1>
            <Link to="/preview/facilities" className="text-brand-primary hover:underline">
              ← Back to Facilities
            </Link>
          </div>
        </div>
      </PreviewLayout>
    )
  }

  const getFacilityIcon = (type: string) => {
    const icons: Record<string, string> = {
      'room': '🏛️',
      'field': '⚽',
      'court': '🏀',
      'gym': '🏋️',
      'pool': '🏊',
      'park': '🌳',
    }
    return icons[type?.toLowerCase()] || '🏢'
  }

  return (
    <PreviewLayout config={config}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/preview/facilities"
            className="text-brand-primary hover:text-brand-primaryHover font-medium inline-flex items-center gap-2"
          >
            ← Back to Facilities
          </Link>
        </nav>

        {/* Facility Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-green-500 to-teal-600 h-64 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="text-8xl mb-4">{getFacilityIcon(facility.type)}</div>
              <h1 className="text-5xl font-bold">{facility.name}</h1>
            </div>
          </div>

          {/* Facility Details Grid */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-brand-primary/10 p-3 rounded-xl">
                  <Building2 className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Facility Type</h3>
                  <p className="text-gray-600 capitalize">{facility.type || 'General Facility'}</p>
                </div>
              </div>

              {facility.address && (
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/10 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">{facility.address}</p>
                  </div>
                </div>
              )}

              {facility.capacity && (
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/10 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Capacity</h3>
                    <p className="text-gray-600">{facility.capacity} people</p>
                  </div>
                </div>
              )}
            </div>

            {/* Rules */}
            {facility.rules && (
              <div className="mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/10 p-3 rounded-xl">
                    <FileText className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-3">Facility Rules</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {facility.rules}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities */}
            {facility.amenities && facility.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {facility.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-brand-accent">✓</span>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking CTA */}
            <div className="bg-brand-primary/5 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Book?</h3>
              <p className="text-gray-600 mb-6">
                Reserve this facility for your next event or activity
              </p>
              <button className="bg-brand-accent hover:bg-brand-accentHover text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg">
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </PreviewLayout>
  )
}
