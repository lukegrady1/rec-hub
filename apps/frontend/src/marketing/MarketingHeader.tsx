import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function MarketingHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/#faq' }
  ]

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    setMobileMenuOpen(false)
  }

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.substring(2)
      scrollToSection(id)
    } else {
      navigate(href)
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">
              Rec<span className="text-brand-primary">Hub</span>
            </span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className="text-slate-700 hover:text-brand-primary font-medium transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/auth/login')}
              className="px-5 py-2 text-slate-700 hover:text-brand-primary font-semibold transition-colors duration-200"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/auth/register')}
              className="px-6 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Get started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-brand-primary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left px-4 py-2 text-slate-700 hover:text-brand-primary hover:bg-slate-50 rounded-lg font-medium transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-slate-200 pt-4 px-4 space-y-3">
              <button
                onClick={() => {
                  navigate('/auth/login')
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-center px-5 py-2 text-slate-700 hover:text-brand-primary font-semibold border-2 border-slate-200 rounded-xl transition-colors duration-200"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  navigate('/auth/register')
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-center px-6 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold rounded-xl shadow-sm transition-all duration-200"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
