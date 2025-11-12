import { WebsiteConfig } from '../../WebsiteBuilder'
import ClassicCivicTemplate from './templates/ClassicCivicTemplate'
import ModernGridTemplate from './templates/ModernGridTemplate'
import ParksTrailsTemplate from './templates/ParksTrailsTemplate'

interface PreviewData {
  programs?: any[]
  events?: any[]
  facilities?: any[]
}

interface TemplatePreviewProps {
  config: WebsiteConfig
  previewData?: PreviewData
}

export default function TemplatePreview({ config, previewData }: TemplatePreviewProps) {
  const renderTemplate = () => {
    switch (config.template) {
      case 'classic_civic':
        return <ClassicCivicTemplate config={config} previewData={previewData} />
      case 'modern_grid':
        return <ModernGridTemplate config={config} previewData={previewData} />
      case 'parks_trails':
        return <ParksTrailsTemplate config={config} previewData={previewData} />
      default:
        return <ClassicCivicTemplate config={config} previewData={previewData} />
    }
  }

  return (
    <div className="min-h-full">
      {renderTemplate()}
    </div>
  )
}
