import { WebsiteConfig } from '../../WebsiteBuilder'
import ClassicCivicTemplate from './templates/ClassicCivicTemplate'
import ModernGridTemplate from './templates/ModernGridTemplate'
import ParksTrailsTemplate from './templates/ParksTrailsTemplate'

interface TemplatePreviewProps {
  config: WebsiteConfig
}

export default function TemplatePreview({ config }: TemplatePreviewProps) {
  const renderTemplate = () => {
    switch (config.template) {
      case 'classic_civic':
        return <ClassicCivicTemplate config={config} />
      case 'modern_grid':
        return <ModernGridTemplate config={config} />
      case 'parks_trails':
        return <ParksTrailsTemplate config={config} />
      default:
        return <ClassicCivicTemplate config={config} />
    }
  }

  return (
    <div className="min-h-full">
      {renderTemplate()}
    </div>
  )
}
