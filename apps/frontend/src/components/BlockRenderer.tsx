import HeroBlock from './blocks/HeroBlock'
import RichTextBlock from './blocks/RichTextBlock'
import ProgramGridBlock from './blocks/ProgramGridBlock'
import EventListBlock from './blocks/EventListBlock'
import FacilityGridBlock from './blocks/FacilityGridBlock'
import CTABlock from './blocks/CTABlock'

interface Block {
  id: string
  kind: string
  order: number
  config: any
}

interface BlockRendererProps {
  blocks: Block[]
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  const renderBlock = (block: Block) => {
    switch (block.kind) {
      case 'hero':
        return <HeroBlock key={block.id} config={block.config} />
      case 'rich_text':
        return <RichTextBlock key={block.id} config={block.config} />
      case 'program_grid':
        return <ProgramGridBlock key={block.id} config={block.config} />
      case 'event_list':
        return <EventListBlock key={block.id} config={block.config} />
      case 'facility_grid':
        return <FacilityGridBlock key={block.id} config={block.config} />
      case 'cta':
        return <CTABlock key={block.id} config={block.config} />
      default:
        console.warn(`Unknown block type: ${block.kind}`)
        return null
    }
  }

  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

  return (
    <div>
      {sortedBlocks.map(block => renderBlock(block))}
    </div>
  )
}
