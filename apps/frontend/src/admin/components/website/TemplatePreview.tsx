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
  hideHeader?: boolean
}

export default function TemplatePreview({ config, previewData, hideHeader = false }: TemplatePreviewProps) {
  const renderTemplate = () => {
    switch (config.template) {
      case 'classic_civic':
        return <ClassicCivicTemplate config={config} previewData={previewData} hideHeader={hideHeader} />
      case 'modern_grid':
        return <ModernGridTemplate config={config} previewData={previewData} hideHeader={hideHeader} />
      case 'parks_trails':
        return <ParksTrailsTemplate config={config} previewData={previewData} hideHeader={hideHeader} />
      default:
        return <ClassicCivicTemplate config={config} previewData={previewData} hideHeader={hideHeader} />
    }
  }

  return (
    <div className="min-h-full">
      {renderTemplate()}
    </div>
  )
}
