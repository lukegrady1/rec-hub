import { X, Check } from 'lucide-react'

interface TemplateSelectorProps {
  currentTemplate: string
  onSelectTemplate: (template: 'classic_civic' | 'modern_grid' | 'parks_trails') => void
  onClose: () => void
}

const templates = [
  {
    id: 'classic_civic' as const,
    name: 'Classic Civic',
    description: 'Traditional government site with clean navigation and professional layout',
    preview: '/templates/classic-civic-preview.png',
    features: ['Traditional navigation', 'Sidebar layout', 'Professional styling']
  },
  {
    id: 'modern_grid' as const,
    name: 'Modern Grid',
    description: 'Contemporary card-based design with bold typography and vibrant colors',
    preview: '/templates/modern-grid-preview.png',
    features: ['Card-based layout', 'Modern typography', 'Responsive grid']
  },
  {
    id: 'parks_trails' as const,
    name: 'Parks & Trails',
    description: 'Nature-inspired design with outdoor imagery and earthy tones',
    preview: '/templates/parks-trails-preview.png',
    features: ['Nature imagery', 'Earthy colors', 'Outdoor focus']
  }
]

export default function TemplateSelector({ currentTemplate, onSelectTemplate, onClose }: TemplateSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-neutral">Choose a Template</h2>
            <p className="text-sm text-brand-muted mt-1">
              Select a design that best represents your department
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template) => {
              const isSelected = currentTemplate === template.id

              return (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template.id)}
                  className={`text-left rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                    isSelected
                      ? 'border-brand-primary shadow-lg'
                      : 'border-slate-200 hover:border-brand-primary'
                  }`}
                >
                  {/* Preview Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">
                        {template.id === 'classic_civic' && '📋'}
                        {template.id === 'modern_grid' && '🎨'}
                        {template.id === 'parks_trails' && '🌲'}
                      </div>
                      <p className="text-xs text-slate-500">Template Preview</p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-brand-primary text-white rounded-full p-1">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-brand-neutral mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-brand-muted mb-3">
                      {template.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-1">
                      {template.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-brand-muted flex items-center gap-2">
                          <span className="w-1 h-1 bg-brand-primary rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <p className="text-sm text-brand-muted">
            💡 Tip: You can customize colors, fonts, and content after selecting a template
          </p>
        </div>
      </div>
    </div>
  )
}
