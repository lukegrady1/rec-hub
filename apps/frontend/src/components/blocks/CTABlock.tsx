interface CTABlockProps {
  config: {
    text: string
    href: string
    style?: 'primary' | 'accent' | 'outline'
  }
}

export default function CTABlock({ config }: CTABlockProps) {
  const { text, href, style = 'primary' } = config

  const styleClasses = {
    primary: 'bg-brand-primary hover:bg-brand-primaryHover text-white',
    accent: 'bg-brand-accent hover:bg-brand-accentHover text-white',
    outline: 'bg-white hover:bg-brand-bg text-brand-primary border-2 border-brand-primary',
  }[style]

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 text-center">
        <a
          href={href}
          className={`inline-block font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl ${styleClasses}`}
        >
          {text}
        </a>
      </div>
    </div>
  )
}
