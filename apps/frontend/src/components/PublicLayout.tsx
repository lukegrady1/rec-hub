import { ReactNode } from 'react'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Navigation */}
      <nav className="bg-white border-b border-brand-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-display font-extrabold text-brand-primary hover:opacity-80 transition-opacity">
              Rec Hub
            </a>
            <div className="flex gap-6 items-center">
              <a href="/" className="text-brand-neutral hover:text-brand-primary font-medium transition-colors">
                Home
              </a>
              <a href="/programs" className="text-brand-neutral hover:text-brand-primary font-medium transition-colors">
                Programs
              </a>
              <a href="/events" className="text-brand-neutral hover:text-brand-primary font-medium transition-colors">
                Events
              </a>
              <a href="/facilities" className="text-brand-neutral hover:text-brand-primary font-medium transition-colors">
                Facilities
              </a>
              <a href="/signin" className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primaryHover transition-colors font-semibold">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-brand-neutral text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-display font-bold mb-4">Rec Hub</h3>
              <p className="text-gray-400">
                Recreation management made simple for communities everywhere.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/programs" className="text-gray-400 hover:text-white transition-colors">Programs</a></li>
                <li><a href="/events" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
                <li><a href="/facilities" className="text-gray-400 hover:text-white transition-colors">Facilities</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Admin</h4>
              <ul className="space-y-2">
                <li><a href="/admin/login" className="text-gray-400 hover:text-white transition-colors">Staff Sign In</a></li>
                <li><a href="/admin/register" className="text-gray-400 hover:text-white transition-colors">Create Department Site</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Rec Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
