import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(email, password)

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
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-extrabold text-brand-neutral mb-2">
            Welcome Back
          </h1>
          <p className="text-brand-muted">
            Sign in to manage your recreation site
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
              <label htmlFor="email" className="block text-sm font-medium text-brand-neutral mb-1">
                Email
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
                className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-primaryHover transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-brand-muted">
              Don't have an account?{' '}
              <a href="/admin/register" className="text-brand-primary hover:text-brand-primaryHover font-semibold">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
