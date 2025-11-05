import { useEffect, useState } from 'react'
import { publicAPI } from '../../lib/api'

interface ProgramGridBlockProps {
  config: {
    limit?: number
    showPrice?: boolean
  }
}

interface Program {
  id: string
  title: string
  description: string
  season: string
  price_cents: number
}

export default function ProgramGridBlock({ config }: ProgramGridBlockProps) {
  const { limit = 6, showPrice = true } = config
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await publicAPI.getPrograms()
      const limited = (response.programs || []).slice(0, limit)
      setPrograms(limited)
    } catch (error) {
      console.error('Failed to fetch programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (cents: number) => {
    if (cents === 0) return 'Free'
    return `$${(cents / 100).toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="py-12 bg-brand-bg">
        <div className="container mx-auto px-4 text-center">
          <div className="text-brand-muted">Loading programs...</div>
        </div>
      </div>
    )
  }

  if (programs.length === 0) {
    return null
  }

  return (
    <div className="py-12 bg-brand-bg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-display font-bold text-brand-neutral mb-8 text-center">
          Our Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-brand-neutral flex-1">
                  {program.title}
                </h3>
                {program.season && (
                  <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium ml-2">
                    {program.season}
                  </span>
                )}
              </div>
              <p className="text-brand-muted mb-4 line-clamp-3">
                {program.description}
              </p>
              {showPrice && (
                <div className="pt-4 border-t border-brand-border">
                  <div className="text-2xl font-bold text-brand-primary">
                    {formatPrice(program.price_cents)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="/programs"
            className="inline-block bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-primaryHover transition-colors"
          >
            View All Programs
          </a>
        </div>
      </div>
    </div>
  )
}
