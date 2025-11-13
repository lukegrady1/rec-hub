import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAPI } from '../lib/api'
import PreviewLayout from './PreviewLayout'
import ModernHero from '../components/ModernHero'

export default function PreviewFacilities() {
  const [facilities, setFacilities] = useState<any[]>([])
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
      setFacilities(dataRes.data.facilities || [])
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
            <p className="text-brand-muted">Loading facilities...</p>
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
      <ModernHero
        title="Our Facilities"
        subtitle="Book & Explore"
        description="Explore our state-of-the-art recreational facilities available for booking"
        gradient="from-green-500 via-teal-500 to-emerald-600"
        pattern="grid"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">

        {facilities.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {facilities.map((facility) => (
              <Link
                key={facility.id}
                to={`/preview/facilities/${facility.id}`}
                className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-64 bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                  <div className="text-8xl">{getFacilityIcon(facility.type)}</div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{facility.name}</h3>
                      <span className="inline-block bg-brand-primary text-white text-sm px-3 py-1 rounded-full capitalize">
                        {facility.type || 'Facility'}
                      </span>
                    </div>
                  </div>

                  {facility.address && (
                    <p className="text-gray-600 mb-3 flex items-start gap-2">
                      <span className="text-lg">📍</span>
                      <span>{facility.address}</span>
                    </p>
                  )}

                  {facility.rules && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Facility Rules:</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{facility.rules}</p>
                    </div>
                  )}

                  <span className="inline-block w-full bg-brand-accent text-white py-3 rounded-lg hover:bg-brand-accentHover transition-colors font-semibold text-center">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No facilities available at this time.</p>
          </div>
        )}
      </div>
    </PreviewLayout>
  )
}
