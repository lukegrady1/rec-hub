import DOMPurify from 'dompurify'

interface RichTextBlockProps {
  config: {
    html: string
  }
}

export default function RichTextBlock({ config }: RichTextBlockProps) {
  const { html } = config

  // Sanitize HTML to prevent XSS
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div
          className="prose prose-lg max-w-4xl mx-auto prose-headings:font-display prose-headings:text-brand-neutral prose-p:text-brand-muted prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
    </div>
  )
}
