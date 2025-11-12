import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PreviewToolbar from '../components/PreviewToolbar'
import PreviewFrame from '../components/PreviewFrame'
import { getAPI } from '../lib/api'
import { WebsiteConfig } from './WebsiteBuilder'

type DeviceSize = 'mobile' | 'tablet' | 'desktop'

export default function Preview() {
  const navigate = useNavigate()
  const [config, setConfig] = useState<WebsiteConfig | null>(null)
  const [previewData, setPreviewData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop')
  const [publishing, setPublishing] = useState(false)

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
      setConfig(configResponse.data)
      setPreviewData(dataResponse.data)
    } catch (error) {
      console.error('Failed to fetch preview data:', error)
      alert('Failed to load preview')
    } finally {
      setLoading(false)
    }
  }

  const handleReturnToBuilder = () => {
    navigate('/admin/website')
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const api = getAPI()
      await api.post('/website/publish')
      alert('Website published successfully!')
      await fetchPreviewData() // Refresh config
    } catch (error) {
      console.error('Failed to publish website:', error)
      alert('Failed to publish website')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-brand-muted">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (!config || !previewData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load preview</p>
          <button
            onClick={handleReturnToBuilder}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primaryHover"
          >
            Return to Builder
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white">
      <PreviewToolbar
        deviceMode={deviceSize}
        onDeviceChange={setDeviceSize}
        onReturnToBuilder={handleReturnToBuilder}
        onPublish={handlePublish}
        hasChanges={!config?.published}
      />
      <div className="pt-16">
        <PreviewFrame
          deviceMode={deviceSize}
          config={config}
          previewData={previewData}
        />
      </div>
    </div>
  )
}
