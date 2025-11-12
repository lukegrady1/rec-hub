import { useState, useEffect } from 'react'
import { getAPI } from '../lib/api'
import PreviewLayout from './PreviewLayout'

export default function PreviewPrograms() {
  const [programs, setPrograms] = useState<any[]>([])
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
      setPrograms(dataRes.data.programs || [])
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
            <p className="text-brand-muted">Loading programs...</p>
          </div>
        </div>
      </PreviewLayout>
    )
  }

  return (
    <PreviewLayout config={config}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h1>
          <p className="text-lg text-gray-600">
            Discover exciting recreational programs for all ages and interests
          </p>
        </div>

        {programs.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <div className="text-6xl">🏃</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {program.description || 'Join us for this exciting program!'}
                  </p>
                  {program.season && (
                    <p className="text-sm text-gray-500 mb-2">Season: {program.season}</p>
                  )}
                  {program.price_cents > 0 && (
                    <p className="text-2xl font-bold text-brand-primary mb-4">
                      ${(program.price_cents / 100).toFixed(2)}
                    </p>
                  )}
                  <button className="w-full bg-brand-primary text-white py-2 rounded-lg hover:bg-brand-primaryHover transition-colors font-semibold">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No programs available at this time.</p>
          </div>
        )}
      </div>
    </PreviewLayout>
  )
}
