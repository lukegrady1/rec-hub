import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// Marketing Pages (for admin-facing SaaS landing)
import Landing from './marketing/Landing'
import PricingPage from './marketing/PricingPage'

// Public Pages (for residents on tenant subdomains)
import Home from './public/Home'
import Programs from './public/Programs'
import Events from './public/Events'
import Facilities from './public/Facilities'
import DynamicPage from './public/DynamicPage'
import Signup from './public/Signup'
import Signin from './public/Signin'
import PublicPreview from './public/Preview'

// Admin
import AdminDashboard from './admin/Dashboard'
import AdminPages from './admin/Pages'
import PageEditor from './admin/PageEditor'
import PagePreview from './admin/PagePreview'
import AdminPrograms from './admin/Programs'
import AdminEvents from './admin/Events'
import AdminFacilities from './admin/Facilities'
import AdminBookings from './admin/Bookings'
import AdminProgramRegistrations from './admin/ProgramRegistrations'
import AdminTheme from './admin/Theme'
import AdminSettings from './admin/Settings'
import WebsiteBuilder from './admin/WebsiteBuilder'
import Preview from './admin/Preview'

// Auth
import Login from './auth/Login'
import Register from './auth/Register'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Routes>
          {/* Marketing routes (admin-facing SaaS landing) */}
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Auth routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          {/* Public routes (resident-facing on tenant subdomains) */}
          <Route path="/preview" element={<PublicPreview />} />
          <Route path="/home" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/facilities" element={<Facilities />} />

          {/* Public auth routes (for residents) */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/facilities" element={<AdminFacilities />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/registrations" element={<AdminProgramRegistrations />} />
          <Route path="/admin/program-registrations" element={<AdminProgramRegistrations />} />
          <Route path="/admin/website" element={<WebsiteBuilder />} />
          <Route path="/admin/preview" element={<Preview />} />
          <Route path="/admin/pages" element={<AdminPages />} />
          <Route path="/admin/pages/:pageId/editor" element={<PageEditor />} />
          <Route path="/admin/pages/:pageId/preview" element={<PagePreview />} />
          <Route path="/admin/theme" element={<AdminTheme />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/help" element={<AdminSettings />} />

          {/* Dynamic pages - catch-all route (must be last) */}
          <Route path="/:slug" element={<DynamicPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
