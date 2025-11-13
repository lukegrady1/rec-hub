import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAPI } from '../lib/api'
import PreviewLayout from './PreviewLayout'
import { Calendar, DollarSign, Users, Clock } from 'lucide-react'

export default function PreviewProgramDetail() {
  const { id } = useParams<{ id: string }>()
  const [program, setProgram] = useState<any>(null)
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgram()
  }, [id])

  const fetchProgram = async () => {
    try {
      const api = getAPI()
      const [configRes, dataRes] = await Promise.all([
        api.get('/website/preview-config'),
        api.get('/website/preview-data')
      ])
      setConfig(configRes.data)

      // Find the specific program from the preview data
      const programs = dataRes.data.programs || []
      const foundProgram = programs.find((p: any) => p.id === id)
      setProgram(foundProgram || null)
    } catch (error) {
      console.error('Failed to fetch program:', error)
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
            <p className="text-brand-muted">Loading program...</p>
          </div>
        </div>
      </PreviewLayout>
    )
  }

  if (!program) {
    return (
      <PreviewLayout config={config}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Program Not Found</h1>
            <Link to="/preview/programs" className="text-brand-primary hover:underline">
              ← Back to Programs
            </Link>
          </div>
        </div>
      </PreviewLayout>
    )
  }

  return (
    <PreviewLayout config={config}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/preview/programs"
            className="text-brand-primary hover:text-brand-primaryHover font-medium inline-flex items-center gap-2"
          >
            ← Back to Programs
          </Link>
        </nav>

        {/* Program Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 h-64 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h1 className="text-5xl font-bold mb-4">{program.title}</h1>
              {program.season && (
                <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  {program.season}
                </span>
              )}
            </div>
          </div>

          {/* Program Details Grid */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {program.price_cents > 0 && (
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/10 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Price</h3>
                    <p className="text-2xl font-bold text-brand-primary">
                      ${(program.price_cents / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {program.season && (
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/10 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Season</h3>
                    <p className="text-gray-600">{program.season}</p>
                  </div>
                </div>
              )}

              {program.age_min !== undefined || program.age_max !== undefined ? (
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/10 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Age Range</h3>
                    <p className="text-gray-600">
                      {program.age_min !== undefined && program.age_max !== undefined
                        ? `${program.age_min} - ${program.age_max} years`
                        : program.age_min !== undefined
                        ? `${program.age_min}+ years`
                        : `Up to ${program.age_max} years`}
                    </p>
                  </div>
                </div>
              ) : null}

              {program.duration && (
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/10 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Duration</h3>
                    <p className="text-gray-600">{program.duration}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {program.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Program</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {program.description}
                </p>
              </div>
            )}

            {/* Status Badge */}
            {program.status && (
              <div className="mb-8">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  program.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : program.status === 'full'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {program.status === 'active' ? 'Registration Open' :
                   program.status === 'full' ? 'Program Full' :
                   program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                </span>
              </div>
            )}

            {/* Registration CTA */}
            <div className="bg-brand-primary/5 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join?</h3>
              <p className="text-gray-600 mb-6">
                Register now to secure your spot in this program
              </p>
              {program.price_cents > 0 && (
                <p className="text-3xl font-bold text-brand-primary mb-6">
                  ${(program.price_cents / 100).toFixed(2)}
                </p>
              )}
              <button
                className="bg-brand-accent hover:bg-brand-accentHover text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
                disabled={program.status === 'full'}
              >
                {program.status === 'full' ? 'Program Full' : 'Register Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PreviewLayout>
  )
}
