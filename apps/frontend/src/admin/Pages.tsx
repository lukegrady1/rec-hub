import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { pagesAPI, blocksAPI } from '../lib/api'

interface Page {
  id: string
  slug: string
  title: string
  published: boolean
  created_at: string
  meta?: {
    title?: string
    description?: string
  }
}

export default function Pages() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    published: false,
    metaTitle: '',
    metaDescription: '',
  })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await pagesAPI.list()
      setPages(response.pages || [])
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const meta = {
        title: formData.metaTitle || formData.title,
        description: formData.metaDescription || '',
      }
      if (editingId) {
        await pagesAPI.update(editingId, { ...formData, meta })
      } else {
        await pagesAPI.create(formData.slug, formData.title, meta)
      }
      await fetchPages()
      resetForm()
    } catch (error) {
      console.error('Failed to save page:', error)
    }
  }

  const handleEdit = (page: Page) => {
    setFormData({
      title: page.title,
      slug: page.slug,
      published: page.published,
      metaTitle: page.meta?.title || '',
      metaDescription: page.meta?.description || '',
    })
    setEditingId(page.id)
    setShowForm(true)
  }

  const handleTogglePublish = async (page: Page) => {
    try {
      await pagesAPI.update(page.id, { published: !page.published })
      await fetchPages()
    } catch (error) {
      console.error('Failed to toggle publish:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return
    try {
      await pagesAPI.delete(id)
      await fetchPages()
    } catch (error) {
      console.error('Failed to delete page:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      published: false,
      metaTitle: '',
      metaDescription: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleTitleChange = (value: string) => {
    setFormData({ ...formData, title: value })
    // Auto-generate slug from title if creating new page
    if (!editingId) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50)
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-brand-neutral">
              Pages
            </h1>
            <p className="text-brand-muted mt-1">
              Create and manage your website pages
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primaryHover transition-colors shadow-lg"
          >
            + New Page
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 border-b border-brand-border">
                <h2 className="text-2xl font-display font-bold text-brand-neutral">
                  {editingId ? 'Edit Page' : 'New Page'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-neutral mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                    placeholder="e.g., About Us"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-neutral mb-1">
                    URL Slug *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-muted text-sm">/</span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      disabled={!!editingId}
                      className="flex-1 px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="about-us"
                    />
                  </div>
                  <p className="text-xs text-brand-muted mt-1">
                    {editingId ? 'Slug cannot be changed after creation' : 'Auto-generated from title'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-neutral mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                    placeholder={formData.title || "Leave empty to use page title"}
                    maxLength={60}
                  />
                  <p className="text-xs text-brand-muted mt-1">
                    {formData.metaTitle.length}/60 characters (shows in search results)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-neutral mb-1">
                    SEO Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring"
                    placeholder="Brief description of this page"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-brand-muted mt-1">
                    {formData.metaDescription.length}/160 characters (shows in search results)
                  </p>
                </div>

                {editingId && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 text-brand-primary rounded focus:ring-brand-ring"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-brand-neutral">
                      Published
                    </label>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-primaryHover transition-colors"
                  >
                    {editingId ? 'Update Page' : 'Create Page'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 text-brand-neutral font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pages List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-brand-muted">Loading pages...</div>
          </div>
        ) : pages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-brand-neutral mb-2">
              No pages yet
            </h3>
            <p className="text-brand-muted mb-6">
              Create your first page to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primaryHover transition-colors"
            >
              Create First Page
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <div
                key={page.id}
                className="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-brand-neutral mb-1">
                      {page.title}
                    </h3>
                    <p className="text-sm text-brand-muted">/{page.slug}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    page.published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {page.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/admin/pages/${page.id}/editor`)}
                    className="flex-1 bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accentHover transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/admin/pages/${page.id}/preview`)}
                    className="flex-1 bg-purple-50 text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleTogglePublish(page)}
                    className="bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    {page.published ? 'Unpublish' : 'Publish'}
                  </button>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(page)}
                    className="flex-1 bg-gray-50 text-brand-neutral font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="bg-red-50 text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>

                {page.published && (
                  <a
                    href={`/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-sm text-brand-primary hover:underline text-center"
                  >
                    View Live Page →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
