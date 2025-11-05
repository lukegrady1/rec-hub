import { useEffect, useState } from 'react'
import { publicAPI } from '../lib/api'
import PublicLayout from '../components/PublicLayout'
import ProgramRegistrationModal from '../components/ProgramRegistrationModal'

interface Program {
  id: string
  title: string
  description: string
  season: string
  price_cents: number
  status: string
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await publicAPI.getPrograms()
      setPrograms(response.programs || [])
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

  const seasons = ['all', ...new Set(programs.map(p => p.season).filter(Boolean))]

  const filteredPrograms = programs.filter(p => {
    if (filter === 'all') return true
    return p.season === filter
  })

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-brand-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-display font-extrabold mb-4">
            Recreation Programs
          </h1>
          <p className="text-xl text-blue-100">
            Discover activities and programs for all ages
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Season Filter */}
        {seasons.length > 1 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              {seasons.map((season) => (
                <button
                  key={season}
                  onClick={() => setFilter(season)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filter === season
                      ? 'bg-brand-primary text-white shadow-lg'
                      : 'bg-white text-brand-neutral hover:shadow-md'
                  }`}
                >
                  {season === 'all' ? 'All Seasons' : season}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Programs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-brand-muted text-lg">Loading programs...</div>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-brand-neutral mb-2">
              No programs available
            </h3>
            <p className="text-brand-muted">
              Check back soon for new programs!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-2xl border border-brand-border overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
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

                  <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                    <div className="text-2xl font-bold text-brand-primary">
                      {formatPrice(program.price_cents)}
                    </div>
                    <button
                      onClick={() => setSelectedProgram(program)}
                      className="bg-brand-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-brand-primaryHover transition-colors"
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg z-50">
            ✓ Registration submitted successfully! An admin will review your registration.
          </div>
        )}

        {/* Registration Modal */}
        {selectedProgram && (
          <ProgramRegistrationModal
            program={selectedProgram}
            onClose={() => setSelectedProgram(null)}
            onSuccess={() => {
              setSelectedProgram(null)
              setShowSuccess(true)
              setTimeout(() => setShowSuccess(false), 5000)
            }}
          />
        )}
      </div>
    </PublicLayout>
  )
}
