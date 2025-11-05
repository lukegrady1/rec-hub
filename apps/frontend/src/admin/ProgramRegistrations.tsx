import { useState, useEffect } from 'react'
import { getAPI } from '../lib/api'
import AdminLayout from '../components/AdminLayout'

interface Registration {
  id: string
  program_id: string
  program_title: string
  user_id: string
  user_email: string
  participant_name: string
  participant_age?: number
  emergency_contact_name: string
  emergency_contact_phone: string
  notes?: string
  status: 'pending' | 'approved' | 'waitlisted' | 'cancelled' | 'completed'
  registered_at: string
}

export default function ProgramRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const response = await getAPI().get('/program-registrations')
      setRegistrations(response.data.registrations || [])
      setError('')
    } catch (err: any) {
      console.error('Failed to fetch registrations:', err)
      setError(err.response?.data?.error || 'Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdating(id)
      await getAPI().put(`/program-registrations/${id}/status`, { status })
      // Refresh the list
      await fetchRegistrations()
      setError('')
    } catch (err: any) {
      console.error('Failed to update status:', err)
      setError(err.response?.data?.error || 'Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'waitlisted':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredRegistrations = registrations.filter(reg => {
    if (filter === 'all') return true
    return reg.status === filter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-neutral mb-2">
          Program Registrations
        </h1>
        <p className="text-brand-muted">
          View and manage resident program registrations
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-brand-border rounded-xl p-4">
          <p className="text-sm text-brand-muted mb-1">Total</p>
          <p className="text-2xl font-bold text-brand-neutral">{registrations.length}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-700 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-800">
            {registrations.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-700 mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-800">
            {registrations.filter(r => r.status === 'approved').length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-700 mb-1">Waitlisted</p>
          <p className="text-2xl font-bold text-blue-800">
            {registrations.filter(r => r.status === 'waitlisted').length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-700 mb-1">Completed</p>
          <p className="text-2xl font-bold text-purple-800">
            {registrations.filter(r => r.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-brand-neutral hover:bg-gray-200'
            }`}
          >
            All ({registrations.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            Pending ({registrations.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            Approved ({registrations.filter(r => r.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('waitlisted')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'waitlisted'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            Waitlisted ({registrations.filter(r => r.status === 'waitlisted').length})
          </button>
        </div>
      </div>

      {/* Registrations List */}
      {filteredRegistrations.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-xl p-12 text-center">
          <p className="text-brand-muted text-lg">
            {filter === 'all' ? 'No registrations yet' : `No ${filter} registrations`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map(registration => (
            <div
              key={registration.id}
              className="bg-white border border-brand-border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left: Registration Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-brand-neutral mb-1">
                        {registration.participant_name}
                        {registration.participant_age && (
                          <span className="text-brand-muted font-normal ml-2">
                            (Age {registration.participant_age})
                          </span>
                        )}
                      </h3>
                      <p className="text-brand-muted text-sm">
                        Program: <span className="font-medium">{registration.program_title}</span>
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        registration.status
                      )}`}
                    >
                      {registration.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-brand-muted mb-1">Parent/Guardian</p>
                      <p className="text-sm text-brand-neutral">{registration.user_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-muted mb-1">Emergency Contact</p>
                      <p className="text-sm text-brand-neutral">
                        {registration.emergency_contact_name}
                      </p>
                      <p className="text-sm text-brand-muted">
                        {registration.emergency_contact_phone}
                      </p>
                    </div>
                  </div>

                  {registration.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-brand-muted mb-1">Notes</p>
                      <p className="text-sm text-brand-neutral">{registration.notes}</p>
                    </div>
                  )}

                  <p className="text-xs text-brand-muted">
                    Registered: {formatDate(registration.registered_at)}
                  </p>
                </div>

                {/* Right: Actions */}
                {registration.status === 'pending' && (
                  <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[140px]">
                    <button
                      onClick={() => updateStatus(registration.id, 'approved')}
                      disabled={updating === registration.id}
                      className="flex-1 lg:flex-none bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating === registration.id ? 'Updating...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => updateStatus(registration.id, 'waitlisted')}
                      disabled={updating === registration.id}
                      className="flex-1 lg:flex-none bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating === registration.id ? 'Updating...' : 'Waitlist'}
                    </button>
                    <button
                      onClick={() => updateStatus(registration.id, 'cancelled')}
                      disabled={updating === registration.id}
                      className="flex-1 lg:flex-none bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating === registration.id ? 'Updating...' : 'Decline'}
                    </button>
                  </div>
                )}

                {registration.status === 'approved' && (
                  <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[140px]">
                    <button
                      onClick={() => updateStatus(registration.id, 'completed')}
                      disabled={updating === registration.id}
                      className="flex-1 lg:flex-none bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating === registration.id ? 'Updating...' : 'Mark Complete'}
                    </button>
                    <button
                      onClick={() => updateStatus(registration.id, 'cancelled')}
                      disabled={updating === registration.id}
                      className="flex-1 lg:flex-none bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating === registration.id ? 'Updating...' : 'Cancel'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </AdminLayout>
  )
}
