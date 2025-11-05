import { useState } from 'react'
import { getAPI } from '../lib/api'

interface Program {
  id: string
  title: string
  description: string
  price_cents: number
}

interface ProgramRegistrationModalProps {
  program: Program
  onClose: () => void
  onSuccess: () => void
}

export default function ProgramRegistrationModal({ program, onClose, onSuccess }: ProgramRegistrationModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    participantName: '',
    participantAge: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please sign in to register for programs')
      setLoading(false)
      return
    }

    try {
      await getAPI().post('/program-registrations', {
        program_id: program.id,
        participant_name: formData.participantName,
        participant_age: formData.participantAge ? parseInt(formData.participantAge) : null,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        notes: formData.notes,
      })

      onSuccess()
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.response?.data?.error || 'Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (cents: number) => {
    if (cents === 0) return 'Free'
    return `$${(cents / 100).toFixed(2)}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-brand-border">
          <h2 className="text-2xl font-display font-bold text-brand-neutral">
            Register for {program.title}
          </h2>
          <p className="text-brand-muted mt-1">{formatPrice(program.price_cents)}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
              {error.includes('sign in') && (
                <div className="mt-2">
                  <a href="/signin" className="font-semibold underline">
                    Sign in here
                  </a>
                  {' or '}
                  <a href="/signup" className="font-semibold underline">
                    create an account
                  </a>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-brand-neutral mb-1">
              Participant Name *
            </label>
            <input
              type="text"
              required
              value={formData.participantName}
              onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
              className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
              placeholder="Full name of participant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-neutral mb-1">
              Participant Age
            </label>
            <input
              type="number"
              value={formData.participantAge}
              onChange={(e) => setFormData({ ...formData, participantAge: e.target.value })}
              className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
              placeholder="Age (optional)"
              min="1"
              max="150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-neutral mb-1">
              Emergency Contact Name *
            </label>
            <input
              type="text"
              required
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-neutral mb-1">
              Emergency Contact Phone *
            </label>
            <input
              type="tel"
              required
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
              className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-neutral mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
              placeholder="Any special requirements or notes..."
              rows={3}
            />
          </div>

          {program.price_cents > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Registration will be pending until payment is processed.
                An admin will contact you with payment instructions.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-brand-neutral font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-primaryHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
