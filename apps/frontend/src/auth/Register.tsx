import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../lib/api'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [departmentName, setDepartmentName] = useState('')
  const [departmentSlug, setDepartmentSlug] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Auto-generate slug from department name
  const handleDepartmentNameChange = (value: string) => {
    setDepartmentName(value)
    // Auto-generate slug: lowercase, replace spaces with hyphens, remove special chars
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)
    setDepartmentSlug(slug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.register(email, password, departmentName, departmentSlug)

      // Store the token
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify({
        userId: response.user_id,
        tenantId: response.tenant_id,
        email: response.email
      }))

      // Redirect to admin dashboard
      navigate('/admin')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-extrabold text-brand-neutral mb-2">
            Create Your Site
          </h1>
          <p className="text-brand-muted">
            Get your recreation department online in minutes
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-border">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="departmentName" className="block text-sm font-medium text-brand-neutral mb-1">
                Department Name
              </label>
              <input
                id="departmentName"
                type="text"
                placeholder="e.g., Sterling Recreation Department"
                value={departmentName}
                onChange={(e) => handleDepartmentNameChange(e.target.value)}
                required
                className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand-primary"
              />
            </div>

            <div>
              <label htmlFor="departmentSlug" className="block text-sm font-medium text-brand-neutral mb-1">
                Site URL
              </label>
              <div className="flex items-center">
                <input
                  id="departmentSlug"
                  type="text"
                  value={departmentSlug}
                  onChange={(e) => setDepartmentSlug(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 border border-brand-border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand-primary"
                />
                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-brand-border rounded-r-lg text-brand-muted text-sm">
                  .local.rechub
                </span>
              </div>
              <p className="mt-1 text-xs text-brand-muted">
                This will be your site's address
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-neutral mb-1">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-neutral mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand-primary"
              />
              <p className="mt-1 text-xs text-brand-muted">
                Minimum 8 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-primaryHover transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating your site...' : 'Create My Site'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-brand-muted">
              Already have an account?{' '}
              <a href="/auth/login" className="text-brand-primary hover:text-brand-primaryHover font-semibold">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
