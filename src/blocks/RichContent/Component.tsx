import React from 'react'
import RichText from '@/components/RichText'

export type RichContentBlockProps = {
  blockType?: 'richContent'
  content: unknown
  width?: 'narrow' | 'wide' | 'full' | null
}

export const RichContentBlockComponent: React.FC<RichContentBlockProps> = ({ content, width = 'narrow' }) => {
  const containerClass =
    width === 'full'
      ? 'max-w-none'
      : width === 'wide'
      ? 'max-w-5xl mx-auto'
      : 'max-w-3xl mx-auto'

  return (
    <section className="py-10 md:py-14">
      <div className={`container mx-auto px-4 ${containerClass}`}>
        <RichText content={content as never} />
      </div>
    </section>
  )
}
