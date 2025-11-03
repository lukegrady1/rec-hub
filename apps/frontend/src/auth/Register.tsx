import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [departmentName, setDepartmentName] = useState('')
  const [departmentSlug, setDepartmentSlug] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement registration
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-brand-neutral">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Department Name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Department Slug"
            value={departmentSlug}
            onChange={(e) => setDepartmentSlug(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-brand-primary text-white py-2 rounded-lg hover:bg-brand-primaryHover"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}
