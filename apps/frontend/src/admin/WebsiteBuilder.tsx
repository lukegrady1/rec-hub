import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Settings, Eye, Smartphone, Tablet, Monitor, Save, Globe } from 'lucide-react'
import TemplateSelector from './components/website/TemplateSelector'
import SettingsDrawer from './components/website/SettingsDrawer'
import TemplatePreview from './components/website/TemplatePreview'
import { getAPI } from '../lib/api'

export interface WebsiteConfig {
  template: 'classic_civic' | 'modern_grid' | 'parks_trails'
  themePreset: 'default' | 'forest' | 'sunset' | 'ocean'
  enabledPages: {
    events: boolean
    programs: boolean
    facilities: boolean
    news: boolean
    contact: boolean
    faq: boolean
  }
  hero: {
    headline: string
    subheadline: string
    ctaText: string
    ctaLink: string
    backgroundImage?: string
  }
  published: boolean
  publishedAt?: string
}

type DeviceSize = 'mobile' | 'tablet' | 'desktop'

export default function WebsiteBuilder() {
  const [config, setConfig] = useState<WebsiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop')
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const api = getAPI()
      const response = await api.get('/website/config')
      setConfig(response.data)
    } catch (error) {
      console.error('Failed to fetch website config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!config) return

    setSaving(true)
    try {
      const api = getAPI()
      await api.put('/website/config', config)
      // Show success toast (you can add a toast library)
      console.log('Config saved successfully')
    } catch (error) {
      console.error('Failed to save config:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!config) return

    setPublishing(true)
    try {
      const api = getAPI()
      await api.post('/website/publish')
      await fetchConfig() // Refresh to get updated published status
      // Show success toast
      console.log('Website published successfully')
    } catch (error) {
      console.error('Failed to publish website:', error)
      alert('Failed to publish website')
    } finally {
      setPublishing(false)
    }
  }

  const handleConfigUpdate = (updates: Partial<WebsiteConfig>) => {
    if (!config) return
    setConfig({ ...config, ...updates })
  }

  const handleOpenPreview = async () => {
    // Save current config before opening preview
    await handleSave()

    // Open preview in new tab at /preview (public route)
    window.open('/preview', '_blank')
  }

  const getDeviceWidth = () => {
    switch (deviceSize) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      case 'desktop': return '100%'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-brand-muted">Loading website builder...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!config) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load website configuration</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-6rem)]">
        {/* Header Bar */}
        <div className="bg-white border-b-2 border-slate-200 px-6 py-4 mb-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brand-neutral">Website Builder</h1>
              <p className="text-sm text-brand-muted mt-1">
                {config.published ? (
                  <span className="text-green-600">✓ Published</span>
                ) : (
                  <span className="text-yellow-600">⚠ Unpublished changes</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Device Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setDeviceSize('mobile')}
                  className={`p-2 rounded ${deviceSize === 'mobile' ? 'bg-white shadow-sm' : 'text-brand-muted'}`}
                  title="Mobile"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceSize('tablet')}
                  className={`p-2 rounded ${deviceSize === 'tablet' ? 'bg-white shadow-sm' : 'text-brand-muted'}`}
                  title="Tablet"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceSize('desktop')}
                  className={`p-2 rounded ${deviceSize === 'desktop' ? 'bg-white shadow-sm' : 'text-brand-muted'}`}
                  title="Desktop"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="px-4 py-2 bg-slate-100 text-brand-neutral rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Change Template
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  showSettings
                    ? 'bg-brand-primary text-white'
                    : 'bg-slate-100 text-brand-neutral hover:bg-slate-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <button
                onClick={handleOpenPreview}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview Site
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primaryHover transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>

              <button
                onClick={handlePublish}
                disabled={publishing}
                className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accentHover transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Globe className="w-4 h-4" />
                {publishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-4 h-[calc(100%-5rem)]">
          {/* Preview Area */}
          <div className="flex-1 bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm">
            <div className="h-full flex items-center justify-center bg-slate-50 p-8">
              <div
                style={{ width: getDeviceWidth(), maxWidth: '100%' }}
                className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
              >
                <div className="h-[calc(100vh-16rem)] overflow-y-auto">
                  <TemplatePreview config={config} />
                </div>
              </div>
            </div>
          </div>

          {/* Settings Drawer */}
          {showSettings && (
            <SettingsDrawer
              config={config}
              onConfigUpdate={handleConfigUpdate}
              onClose={() => setShowSettings(false)}
            />
          )}
        </div>

        {/* Template Selector Modal */}
        {showTemplateSelector && (
          <TemplateSelector
            currentTemplate={config.template}
            onSelectTemplate={(template) => {
              handleConfigUpdate({ template })
              setShowTemplateSelector(false)
            }}
            onClose={() => setShowTemplateSelector(false)}
          />
        )}
      </div>
    </AdminLayout>
  )
}
