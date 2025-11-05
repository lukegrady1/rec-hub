import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import BlockRenderer from '../components/BlockRenderer'
import { pagesAPI, blocksAPI } from '../lib/api'

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
  published: boolean
  meta?: {
    title?: string
    description?: string
  }
}

export default function PagePreview() {
  const { pageId } = useParams<{ pageId: string }>()
  const navigate = useNavigate()
  const [page, setPage] = useState<PageData | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (pageId) {
      fetchPageData(pageId)
    }
  }, [pageId])

  const fetchPageData = async (id: string) => {
    try {
      setLoading(true)

      // Fetch page details
      const pagesResponse = await pagesAPI.list()
      const foundPage = pagesResponse.pages?.find((p: any) => p.id === id)

      if (!foundPage) {
        setError('Page not found')
        setLoading(false)
        return
      }

      setPage(foundPage)

      // Fetch blocks
      const blocksResponse = await blocksAPI.list(id)
      const sortedBlocks = (blocksResponse.blocks || []).sort((a: Block, b: Block) => a.order - b.order)
      setBlocks(sortedBlocks)

      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch page:', err)
      setError('Failed to load page preview')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-brand-muted text-lg">Loading preview...</div>
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
              Unable to load the page preview.
            </p>
            <button
              onClick={() => navigate('/admin/pages')}
              className="inline-block bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-primaryHover transition-colors"
            >
              Back to Pages
            </button>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <>
      {/* Preview Banner */}
      <div className="bg-yellow-500 text-white py-3 px-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">👁️</span>
            <div>
              <p className="font-bold">Preview Mode</p>
              <p className="text-sm opacity-90">
                You're viewing: <span className="font-semibold">{page.title}</span>
                {!page.published && <span className="ml-2 bg-yellow-600 px-2 py-0.5 rounded text-xs">DRAFT</span>}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/admin/pages/${pageId}/editor`)}
              className="bg-white text-yellow-600 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              Edit Page
            </button>
            <button
              onClick={() => navigate('/admin/pages')}
              className="bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Exit Preview
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <PublicLayout>
        {blocks && blocks.length > 0 ? (
          <BlockRenderer blocks={blocks} />
        ) : (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-display font-bold text-brand-neutral mb-4">
              {page.title}
            </h1>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-blue-800 text-lg mb-4">
                This page doesn't have any content blocks yet.
              </p>
              <button
                onClick={() => navigate(`/admin/pages/${pageId}/editor`)}
                className="bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-primaryHover transition-colors"
              >
                Add Content Blocks
              </button>
            </div>
          </div>
        )}
      </PublicLayout>
    </>
  )
}
