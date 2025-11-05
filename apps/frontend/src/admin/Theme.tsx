import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { settingsAPI } from '../lib/api'

export default function Theme() {
  const [branding, setBranding] = useState({
    departmentName: 'Sterling Recreation',
    logoUrl: '',
    primaryColor: '#2563EB',
    accentColor: '#10B981',
  })

  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get()
      if (response.branding) {
        setBranding({
          departmentName: response.branding.departmentName || 'Sterling Recreation',
          logoUrl: response.branding.logoUrl || '',
          primaryColor: response.branding.primaryColor || '#2563EB',
          accentColor: response.branding.accentColor || '#10B981',
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await settingsAPI.update({ ...branding }, {}, {})
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save theme:', error)
      alert('Failed to save theme settings')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-brand-muted">Loading settings...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-extrabold text-brand-neutral">
            Theme & Branding
          </h1>
          <p className="text-brand-muted mt-1">
            Customize the look and feel of your public website
          </p>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6">
            ✓ Theme settings saved successfully!
          </div>
        )}

        <div className="bg-white rounded-2xl border border-brand-border p-6 space-y-6">
          {/* Department Name */}
          <div>
            <label className="block text-sm font-medium text-brand-neutral mb-2">
              Department Name
            </label>
            <input
              type="text"
              value={branding.departmentName}
              onChange={(e) => setBranding({ ...branding, departmentName: e.target.value })}
              className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
              placeholder="e.g., Sterling Recreation"
            />
            <p className="text-xs text-brand-muted mt-1">
              Displayed in the header and footer of your website
            </p>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-brand-neutral mb-2">
              Logo
            </label>
            <div className="border-2 border-dashed border-brand-border rounded-lg p-8 text-center">
              {branding.logoUrl ? (
                <div>
                  <img src={branding.logoUrl} alt="Logo" className="mx-auto h-20 mb-4" />
                  <button
                    onClick={() => setBranding({ ...branding, logoUrl: '' })}
                    className="text-red-600 hover:text-red-700 font-semibold text-sm"
                  >
                    Remove Logo
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-brand-muted mb-4">No logo uploaded</p>
                  <button className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-primaryHover transition-colors">
                    Upload Logo
                  </button>
                  <p className="text-xs text-brand-muted mt-2">
                    PNG or SVG, max 2MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-neutral mb-2">
                Primary Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="w-16 h-12 rounded border border-brand-border cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="flex-1 px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring font-mono text-sm"
                  placeholder="#2563EB"
                />
              </div>
              <p className="text-xs text-brand-muted mt-1">
                Used for buttons, links, and highlights
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-neutral mb-2">
                Accent Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={branding.accentColor}
                  onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                  className="w-16 h-12 rounded border border-brand-border cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.accentColor}
                  onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                  className="flex-1 px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring font-mono text-sm"
                  placeholder="#10B981"
                />
              </div>
              <p className="text-xs text-brand-muted mt-1">
                Secondary accent for CTAs and emphasis
              </p>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-brand-neutral mb-2">
              Preview
            </label>
            <div className="border border-brand-border rounded-lg p-6 bg-gray-50">
              <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl font-display font-bold">{branding.departmentName}</div>
                </div>
                <button
                  style={{ backgroundColor: branding.primaryColor }}
                  className="text-white font-semibold px-4 py-2 rounded-lg"
                >
                  Primary Button
                </button>
                <button
                  style={{ backgroundColor: branding.accentColor }}
                  className="text-white font-semibold px-4 py-2 rounded-lg ml-3"
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-brand-border">
            <button
              onClick={handleSave}
              className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-primaryHover transition-colors"
            >
              Save Theme Settings
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-brand-neutral mb-2">💡 Theme Tips</h3>
          <ul className="text-sm text-brand-muted space-y-1">
            <li>• Choose colors that represent your department's brand</li>
            <li>• Ensure sufficient contrast for accessibility (WCAG AA)</li>
            <li>• Your logo should be horizontal format, ideally 200-400px wide</li>
            <li>• Changes apply instantly to your public website</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
