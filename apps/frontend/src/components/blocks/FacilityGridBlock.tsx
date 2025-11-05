import { useEffect, useState } from 'react'
import { publicAPI } from '../../lib/api'

interface FacilityGridBlockProps {
  config: {
    limit?: number
    showAvailability?: boolean
  }
}

interface Facility {
  id: string
  name: string
  type: string
  address: string
  available_slots: number
}

export default function FacilityGridBlock({ config }: FacilityGridBlockProps) {
  const { limit = 6, showAvailability = true } = config
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFacilities()
  }, [])

  const fetchFacilities = async () => {
    try {
      const response = await publicAPI.getFacilities()
      const limited = (response.facilities || []).slice(0, limit)
      setFacilities(limited)
    } catch (error) {
      console.error('Failed to fetch facilities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFacilityIcon = (type: string) => {
    const icons: Record<string, string> = {
      room: '🚪',
      field: '🌳',
      court: '🏀',
      gym: '🏋️',
    }
    return icons[type] || '🏢'
  }

  if (loading) {
    return (
      <div className="py-12 bg-brand-bg">
        <div className="container mx-auto px-4 text-center">
          <div className="text-brand-muted">Loading facilities...</div>
        </div>
      </div>
    )
  }

  if (facilities.length === 0) {
    return null
  }

  return (
    <div className="py-12 bg-brand-bg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-display font-bold text-brand-neutral mb-8 text-center">
          Our Facilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{getFacilityIcon(facility.type)}</span>
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
              {showAvailability && (
                <div className="pt-4 border-t border-brand-border">
                  <div className="text-sm text-brand-muted">
                    {facility.available_slots > 0 ? (
                      <span className="text-green-600 font-medium">
                        {facility.available_slots} slot{facility.available_slots !== 1 ? 's' : ''} available
                      </span>
                    ) : (
                      <span className="text-gray-500">No slots available</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="/facilities"
            className="inline-block bg-brand-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-accentHover transition-colors"
          >
            View All Facilities
          </a>
        </div>
      </div>
    </div>
  )
}
