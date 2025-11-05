interface HeroBlockProps {
  config: {
    headline: string
    subheadline?: string
    ctaText?: string
    ctaHref?: string
    bgImage?: string
    overlayOpacity?: number
    align?: 'left' | 'center' | 'right'
  }
}

export default function HeroBlock({ config }: HeroBlockProps) {
  const { headline, subheadline, ctaText, ctaHref, bgImage, overlayOpacity = 0.4, align = 'center' } = config

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align]

  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      {bgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}

      {/* Content */}
      <div className={`relative py-20 md:py-32 ${!bgImage ? 'bg-brand-primary' : ''}`}>
        <div className="container mx-auto px-4">
          <div className={`max-w-4xl ${align === 'center' ? 'mx-auto' : ''} ${alignmentClass}`}>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-4 tracking-tight">
              {headline}
            </h1>
            {subheadline && (
              <p className="text-xl md:text-2xl text-white opacity-90 mb-8">
                {subheadline}
              </p>
            )}
            {ctaText && ctaHref && (
              <a
                href={ctaHref}
                className="inline-block bg-brand-accent hover:bg-brand-accentHover text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                {ctaText}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
