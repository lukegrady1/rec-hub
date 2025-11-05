import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import BlockRenderer from '../components/BlockRenderer'
import { publicAPI } from '../lib/api'

interface Block {
  id: string
  kind: string
  order: number
  config: any
}

interface PageData {
  id: string
  slug: string
  title: string
  blocks: Block[]
  meta?: {
    title?: string
    description?: string
  }
}

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchPage(slug)
    }
  }, [slug])

  useEffect(() => {
    // Update document title and meta tags when page loads
    if (page) {
      const pageTitle = page.meta?.title || page.title
      document.title = `${pageTitle} | Rec Hub`

      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      if (page.meta?.description) {
        metaDescription.setAttribute('content', page.meta.description)
      }
    }
  }, [page])

  const fetchPage = async (pageSlug: string) => {
    try {
      const response = await publicAPI.getPage(pageSlug)
      setPage(response)
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch page:', err)
      setError(err.response?.status === 404 ? 'Page not found' : 'Failed to load page')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-brand-muted text-lg">Loading...</div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (error || !page) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-3xl font-bold text-brand-neutral mb-2">
              {error || 'Page Not Found'}
            </h1>
            <p className="text-brand-muted mb-6">
              The page you're looking for doesn't exist or hasn't been published yet.
            </p>
            <a
              href="/"
              className="inline-block bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-primaryHover transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      {page.blocks && page.blocks.length > 0 ? (
        <BlockRenderer blocks={page.blocks} />
      ) : (
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-brand-neutral mb-4">
            {page.title}
          </h1>
          <p className="text-brand-muted">
            This page doesn't have any content yet.
          </p>
        </div>
      )}
    </PublicLayout>
  )
}
