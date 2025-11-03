import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// Pages
import Home from './public/Home'

// Admin
import AdminDashboard from './admin/Dashboard'
import AdminPages from './admin/Pages'
import AdminPrograms from './admin/Programs'
import AdminEvents from './admin/Events'
import AdminFacilities from './admin/Facilities'
import AdminBookings from './admin/Bookings'
import AdminTheme from './admin/Theme'
import AdminSettings from './admin/Settings'

// Auth
import Login from './auth/Login'
import Register from './auth/Register'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pages" element={<AdminPages />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/facilities" element={<AdminFacilities />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/theme" element={<AdminTheme />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
