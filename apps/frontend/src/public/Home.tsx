export default function Home() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Navigation */}
      <nav className="bg-white border-b border-brand-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-display font-extrabold text-brand-primary">
              Rec Hub
            </div>
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

      {/* Hero Section */}
      <div className="bg-brand-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-extrabold mb-4 tracking-tight">
            Welcome to Rec Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-medium opacity-95">
            Recreation management made simple.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/admin/register" className="bg-brand-accent hover:bg-brand-accentHover text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl">
              Create Your Department Site
            </a>
            <a href="/programs" className="bg-white hover:bg-brand-bg text-brand-primary px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl">
              Browse Programs
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-display font-extrabold text-brand-neutral text-center mb-8 tracking-tight">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-border hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-display font-bold text-brand-neutral mb-3">Programs</h3>
            <p className="text-brand-muted">Manage seasonal programs and registrations</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-border hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-display font-bold text-brand-neutral mb-3">Events</h3>
            <p className="text-brand-muted">Create and promote community events</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-border hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-display font-bold text-brand-neutral mb-3">Facilities</h3>
            <p className="text-brand-muted">Book and manage facility rentals</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-border hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-display font-bold text-brand-neutral mb-3">Website</h3>
            <p className="text-brand-muted">Custom branded public website</p>
          </div>
        </div>
      </div>

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
              <h4 className="font-bold mb-4">For Departments</h4>
              <ul className="space-y-2">
                <li><a href="/admin/login" className="text-gray-400 hover:text-white transition-colors">Staff Sign In</a></li>
                <li><a href="/admin/register" className="text-gray-400 hover:text-white transition-colors">Create Your Site</a></li>
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
