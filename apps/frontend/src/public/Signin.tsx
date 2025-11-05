import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import { getAPI } from '../lib/api'

export default function Signin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await getAPI().post('/public/login', {
        email: formData.email,
        password: formData.password,
      })

      // Store token and user info
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user_id,
        email: response.data.email,
        role: response.data.role,
      }))

      // Redirect based on role
      if (response.data.role === 'RESIDENT') {
        navigate('/programs')
      } else {
        navigate('/admin/dashboard')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-display font-extrabold text-brand-neutral">
              Sign In to Your Account
            </h2>
            <p className="mt-2 text-center text-sm text-brand-muted">
              Access your programs and registrations
            </p>
          </div>

          <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-neutral mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-brand-neutral mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-primaryHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-brand-muted">Don't have an account? </span>
              <a href="/signup" className="text-brand-primary hover:text-brand-primaryHover font-semibold">
                Sign Up
              </a>
            </div>
          </form>

          <div className="text-center">
            <a href="/admin/login" className="text-sm text-brand-muted hover:text-brand-neutral">
              Are you a department admin? <span className="font-semibold">Sign in here</span>
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
