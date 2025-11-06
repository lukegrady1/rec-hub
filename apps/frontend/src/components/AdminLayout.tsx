import { ReactNode, useState, useEffect } from 'react'
import { settingsAPI } from '../lib/api'
import AdminSidebar from '../admin/components/AdminSidebar'

interface AdminLayoutProps {
  children: ReactNode
}

interface TenantSettings {
  branding?: {
    departmentName?: string
    logoUrl?: string
    primaryColor?: string
    accentColor?: string
  }
  config?: {
    departmentName?: string
  }
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [settings, setSettings] = useState<TenantSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get()
      setSettings(response)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const tenantName = settings.branding?.departmentName || settings.config?.departmentName || 'Recreation Department'

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar tenantName={tenantName} />
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
