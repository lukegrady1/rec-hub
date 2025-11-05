import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { pagesAPI, blocksAPI } from '../lib/api'

interface Block {
  id: string
  kind: string
  order: number
  config: any
}

interface Page {
  id: string
  title: string
  slug: string
  blocks: Block[]
}

const BLOCK_TYPES = [
  { kind: 'hero', label: 'Hero Section', icon: '🎯', description: 'Large header with CTA' },
  { kind: 'rich_text', label: 'Rich Text', icon: '📝', description: 'HTML content' },
  { kind: 'program_grid', label: 'Programs Grid', icon: '🎨', description: 'Display programs' },
  { kind: 'event_list', label: 'Events List', icon: '📅', description: 'Show upcoming events' },
  { kind: 'facility_grid', label: 'Facilities Grid', icon: '🏢', description: 'Display facilities' },
  { kind: 'cta', label: 'Call to Action', icon: '🔘', description: 'Button link' },
]

export default function PageEditor() {
  const { pageId } = useParams<{ pageId: string }>()
  const navigate = useNavigate()
  const [page, setPage] = useState<Page | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [blockConfig, setBlockConfig] = useState<any>({})

  useEffect(() => {
    if (pageId) {
      fetchPage()
    }
  }, [pageId])

  const fetchPage = async () => {
    try {
      const response = await pagesAPI.list()
      const foundPage = response.pages?.find((p: any) => p.id === pageId)
      if (foundPage) {
        setPage(foundPage)
        // Fetch blocks for this page
        if (pageId) {
          const blocksResponse = await blocksAPI.list(pageId)
          setBlocks(blocksResponse.blocks || [])
        }
      }
    } catch (error) {
      console.error('Failed to fetch page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBlock = async (kind: string) => {
    if (!pageId) return

    const order = blocks.length
    const defaultConfigs: Record<string, any> = {
      hero: { headline: 'Welcome', subheadline: 'Your subtitle here', align: 'center' },
      rich_text: { html: '<p>Add your content here...</p>' },
      program_grid: { limit: 6, showPrice: true },
      event_list: { limit: 5, showDates: true },
      facility_grid: { limit: 6, showAvailability: true },
      cta: { text: 'Get Started', href: '/contact', style: 'primary' },
    }

    try {
      const response = await blocksAPI.create(pageId, kind, order, defaultConfigs[kind] || {})
      setBlocks([...blocks, { id: response.id, kind, order, config: defaultConfigs[kind] || {} }])
      setShowBlockMenu(false)
    } catch (error) {
      console.error('Failed to add block:', error)
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Delete this block?')) return
    try {
      await blocksAPI.delete(blockId)
      setBlocks(blocks.filter(b => b.id !== blockId))
    } catch (error) {
      console.error('Failed to delete block:', error)
    }
  }

  const moveBlock = async (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newBlocks.length) return

    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]
    // Update order values
    newBlocks.forEach((block, idx) => {
      block.order = idx
    })
    setBlocks(newBlocks)

    // Persist the order changes to backend
    try {
      if (!pageId) return
      await Promise.all(
        newBlocks.map(block =>
          blocksAPI.update(block.id, {
            page_id: pageId,
            kind: block.kind,
            order: block.order,
            config: block.config,
          })
        )
      )
    } catch (error) {
      console.error('Failed to update block order:', error)
    }
  }

  const getBlockIcon = (kind: string) => {
    return BLOCK_TYPES.find(t => t.kind === kind)?.icon || '📦'
  }

  const getBlockLabel = (kind: string) => {
    return BLOCK_TYPES.find(t => t.kind === kind)?.label || kind
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-brand-muted">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  if (!page) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-brand-muted">Page not found</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/pages')}
            className="text-brand-primary hover:text-brand-primaryHover mb-4 font-semibold"
          >
            ← Back to Pages
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display font-extrabold text-brand-neutral">
                {page.title}
              </h1>
              <p className="text-brand-muted mt-1">/{page.slug}</p>
            </div>
            <button
              onClick={() => setShowBlockMenu(true)}
              className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primaryHover transition-colors shadow-lg"
            >
              + Add Block
            </button>
          </div>
        </div>

        {/* Block Menu Modal */}
        {showBlockMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-brand-border">
                <h2 className="text-2xl font-display font-bold text-brand-neutral">
                  Add a Block
                </h2>
                <p className="text-brand-muted mt-1">Choose a block type to add to your page</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {BLOCK_TYPES.map((blockType) => (
                    <button
                      key={blockType.kind}
                      onClick={() => handleAddBlock(blockType.kind)}
                      className="p-4 border-2 border-brand-border rounded-xl hover:border-brand-primary hover:shadow-md transition-all text-left"
                    >
                      <div className="text-3xl mb-2">{blockType.icon}</div>
                      <div className="font-bold text-brand-neutral mb-1">{blockType.label}</div>
                      <div className="text-sm text-brand-muted">{blockType.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-brand-border">
                <button
                  onClick={() => setShowBlockMenu(false)}
                  className="w-full bg-gray-100 text-brand-neutral font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blocks List */}
        {blocks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-brand-neutral mb-2">
              No blocks yet
            </h3>
            <p className="text-brand-muted mb-6">
              Start building your page by adding blocks
            </p>
            <button
              onClick={() => setShowBlockMenu(true)}
              className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primaryHover transition-colors"
            >
              Add First Block
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="bg-white rounded-xl border border-brand-border p-4 flex items-center gap-4"
              >
                <div className="text-3xl">{getBlockIcon(block.kind)}</div>
                <div className="flex-1">
                  <div className="font-bold text-brand-neutral">{getBlockLabel(block.kind)}</div>
                  <div className="text-sm text-brand-muted">Order: {index + 1}</div>
                </div>
                <div className="flex gap-2">
                  {index > 0 && (
                    <button
                      onClick={() => moveBlock(index, 'up')}
                      className="p-2 text-brand-muted hover:text-brand-neutral"
                      title="Move up"
                    >
                      ↑
                    </button>
                  )}
                  {index < blocks.length - 1 && (
                    <button
                      onClick={() => moveBlock(index, 'down')}
                      className="p-2 text-brand-muted hover:text-brand-neutral"
                      title="Move down"
                    >
                      ↓
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        {blocks.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-brand-neutral mb-2">💡 Next Steps</h3>
            <ul className="text-sm text-brand-muted space-y-1">
              <li>• Blocks are displayed in the order shown above</li>
              <li>• Use the arrows to reorder blocks</li>
              <li>• Default configurations are applied to each block</li>
              <li>• Visit the page to see your changes live</li>
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
