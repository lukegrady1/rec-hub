import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { programsAPI } from '../lib/api'

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
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    season: '',
    price_cents: 0,
    status: 'active',
  })

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await programsAPI.list()
      setPrograms(response.programs || [])
    } catch (error) {
      console.error('Failed to fetch programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await programsAPI.update(editingId, formData)
      } else {
        await programsAPI.create(formData)
      }
      await fetchPrograms()
      resetForm()
    } catch (error) {
      console.error('Failed to save program:', error)
    }
  }

  const handleEdit = (program: Program) => {
    setFormData({
      title: program.title,
      description: program.description,
      season: program.season,
      price_cents: program.price_cents,
      status: program.status,
    })
    setEditingId(program.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return
    try {
      await programsAPI.delete(id)
      await fetchPrograms()
    } catch (error) {
      console.error('Failed to delete program:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      season: '',
      price_cents: 0,
      status: 'active',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-brand-neutral">
              Programs
            </h1>
            <p className="text-brand-muted mt-1">
              Manage your recreation programs and activities
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primaryHover transition-colors shadow-lg"
          >
            + Add Program
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-brand-border">
                <h2 className="text-2xl font-display font-bold text-brand-neutral">
                  {editingId ? 'Edit Program' : 'New Program'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-neutral mb-1">
                    Program Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                    placeholder="e.g., Youth Soccer League"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-neutral mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                    placeholder="Describe the program..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-neutral mb-1">
                      Season
                    </label>
                    <input
                      type="text"
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                      placeholder="e.g., Fall 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral mb-1">
                      Price (dollars) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price_cents / 100}
                      onChange={(e) => setFormData({ ...formData, price_cents: Math.round(parseFloat(e.target.value) * 100) })}
                      required
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-neutral mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-primaryHover transition-colors"
                  >
                    {editingId ? 'Update Program' : 'Create Program'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 text-brand-neutral font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Programs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-brand-muted">Loading programs...</div>
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-brand-neutral mb-2">
              No programs yet
            </h3>
            <p className="text-brand-muted mb-6">
              Create your first recreation program to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primaryHover transition-colors"
            >
              Create First Program
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-brand-neutral flex-1">
                    {program.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    program.status === 'active' ? 'bg-green-100 text-green-700' :
                    program.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {program.status}
                  </span>
                </div>

                <p className="text-brand-muted text-sm mb-3 line-clamp-2">
                  {program.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-brand-muted">{program.season}</span>
                  <span className="text-lg font-bold text-brand-primary">
                    {formatPrice(program.price_cents)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(program)}
                    className="flex-1 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-primaryHover transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className="flex-1 bg-red-50 text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
