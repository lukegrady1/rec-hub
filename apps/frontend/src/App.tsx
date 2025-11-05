import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// Public Pages
import Home from './public/Home'
import Programs from './public/Programs'
import Events from './public/Events'
import Facilities from './public/Facilities'
import DynamicPage from './public/DynamicPage'
import Signup from './public/Signup'
import Signin from './public/Signin'

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

// Auth
import Login from './auth/Login'
import Register from './auth/Register'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/facilities" element={<Facilities />} />

          {/* Public auth routes (for residents) */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/* Admin auth routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pages" element={<AdminPages />} />
          <Route path="/admin/pages/:pageId/editor" element={<PageEditor />} />
          <Route path="/admin/pages/:pageId/preview" element={<PagePreview />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/facilities" element={<AdminFacilities />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/program-registrations" element={<AdminProgramRegistrations />} />
          <Route path="/admin/theme" element={<AdminTheme />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Dynamic pages - catch-all route (must be last) */}
          <Route path="/:slug" element={<DynamicPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
