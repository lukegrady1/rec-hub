import { X } from 'lucide-react'
import { WebsiteConfig } from '../../WebsiteBuilder'

interface SettingsDrawerProps {
  config: WebsiteConfig
  onConfigUpdate: (updates: Partial<WebsiteConfig>) => void
  onClose: () => void
}

const themePresets = [
  { id: 'default', name: 'Default Blue', primary: '#2563EB', accent: '#10B981' },
  { id: 'forest', name: 'Forest Green', primary: '#059669', accent: '#84CC16' },
  { id: 'sunset', name: 'Sunset Orange', primary: '#EA580C', accent: '#F59E0B' },
  { id: 'ocean', name: 'Ocean Teal', primary: '#0891B2', accent: '#06B6D4' }
]

export default function SettingsDrawer({ config, onConfigUpdate, onClose }: SettingsDrawerProps) {
  const handleTogglePage = (page: keyof WebsiteConfig['enabledPages']) => {
    onConfigUpdate({
      enabledPages: {
        ...config.enabledPages,
        [page]: !config.enabledPages[page]
      }
    })
  }

  const handleHeroUpdate = (field: keyof WebsiteConfig['hero'], value: string) => {
    onConfigUpdate({
      hero: {
        ...config.hero,
        [field]: value
      }
    })
  }

  return (
    <div className="w-96 bg-white border-l-2 border-slate-200 shadow-xl overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
        <h3 className="font-bold text-lg text-brand-neutral">Website Settings</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Theme Preset */}
        <div>
          <label className="block text-sm font-semibold text-brand-neutral mb-3">
            Color Theme
          </label>
          <div className="grid grid-cols-2 gap-3">
            {themePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onConfigUpdate({ themePreset: preset.id as any })}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  config.themePreset === preset.id
                    ? 'border-brand-primary bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: preset.primary }}
                  ></div>
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: preset.accent }}
                  ></div>
                </div>
                <p className="text-xs font-medium text-brand-neutral">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Enabled Pages */}
        <div>
          <label className="block text-sm font-semibold text-brand-neutral mb-3">
            Enabled Pages
          </label>
          <div className="space-y-2">
            {Object.entries(config.enabledPages).map(([page, enabled]) => (
              <label
                key={page}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <span className="text-sm font-medium text-brand-neutral capitalize">
                  {page}
                </span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleTogglePage(page as keyof WebsiteConfig['enabledPages'])}
                  className="w-5 h-5 text-brand-primary rounded focus:ring-2 focus:ring-brand-ring"
                />
              </label>
            ))}
          </div>
          <p className="text-xs text-brand-muted mt-2">
            Disabled pages won't appear in navigation
          </p>
        </div>

        {/* Hero Content */}
        <div>
          <label className="block text-sm font-semibold text-brand-neutral mb-3">
            Hero Section
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-brand-neutral mb-1">
                Headline
              </label>
              <input
                type="text"
                value={config.hero.headline}
                onChange={(e) => handleHeroUpdate('headline', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring text-sm"
                placeholder="Welcome to our recreation department"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-neutral mb-1">
                Subheadline
              </label>
              <textarea
                value={config.hero.subheadline}
                onChange={(e) => handleHeroUpdate('subheadline', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring text-sm"
                placeholder="Discover programs, events, and facilities..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-neutral mb-1">
                Call-to-Action Text
              </label>
              <input
                type="text"
                value={config.hero.ctaText}
                onChange={(e) => handleHeroUpdate('ctaText', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring text-sm"
                placeholder="Explore Programs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-neutral mb-1">
                CTA Link
              </label>
              <input
                type="text"
                value={config.hero.ctaLink}
                onChange={(e) => handleHeroUpdate('ctaLink', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring text-sm"
                placeholder="/programs"
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-800">
            <strong>💡 Tip:</strong> Changes are previewed in real-time. Remember to save and publish when you're ready!
          </p>
        </div>
      </div>
    </div>
  )
}
