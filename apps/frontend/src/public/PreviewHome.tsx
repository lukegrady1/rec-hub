import { useState, useEffect } from 'react'
import { getAPI } from '../lib/api'
import PreviewLayout from './PreviewLayout'
import TemplatePreview from '../admin/components/website/TemplatePreview'
import { WebsiteConfig } from '../admin/WebsiteBuilder'

interface PreviewData {
  programs: any[]
  events: any[]
  facilities: any[]
}

export default function PreviewHome() {
  const [config, setConfig] = useState<WebsiteConfig | null>(null)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [tenantName, setTenantName] = useState<string>('Recreation Department')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPreviewData()
  }, [])

  const fetchPreviewData = async () => {
    try {
      const api = getAPI()
      const [configResponse, dataResponse] = await Promise.all([
        api.get('/website/preview-config'),
        api.get('/website/preview-data')
      ])

      // Handle new response structure
      if (configResponse.data.config) {
        setConfig(configResponse.data.config)
        setTenantName(configResponse.data.tenantName || 'Recreation Department')
      } else {
        setConfig(configResponse.data)
      }

      setPreviewData(dataResponse.data)
    } catch (error) {
      console.error('Failed to fetch preview data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PreviewLayout config={config}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-brand-muted">Loading preview...</p>
          </div>
        </div>
      </PreviewLayout>
    )
  }

  if (!config || !previewData) {
    return (
      <PreviewLayout config={config}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600">Failed to load preview</p>
          </div>
        </div>
      </PreviewLayout>
    )
  }

  return (
    <PreviewLayout config={config} tenantName={tenantName}>
      <TemplatePreview config={config} previewData={previewData} hideHeader={true} />
    </PreviewLayout>
  )
}
