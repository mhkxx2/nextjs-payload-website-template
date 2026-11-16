import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export type SplitContentBlockProps = {
  blockType?: 'splitContent'
  heading: string
  body: string
  media: { url?: string; alt?: string } | number | null
  mediaPosition?: 'left' | 'right' | null
  ctaText?: string | null
  ctaLink?: string | null
}

export const SplitContentBlockComponent: React.FC<SplitContentBlockProps> = ({
  heading,
  body,
  media,
  mediaPosition = 'right',
  ctaText,
  ctaLink,
}) => {
  const imageUrl = typeof media === 'object' && media !== null ? media.url : null
  const imageAlt = typeof media === 'object' && media !== null ? media.alt || heading : heading

  const isMediaLeft = mediaPosition === 'left'

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col gap-8 md:flex-row md:items-center ${
            isMediaLeft ? 'md:flex-row-reverse' : ''
          }`}
        >
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl md:text-4xl font-serif text-charcoal font-bold">{heading}</h2>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{body}</p>
            {ctaText && ctaLink && (
              <div className="pt-2">
                <Link
                  href={ctaLink}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded bg-amber-700 hover:bg-amber-800 text-white font-medium transition-colors"
                >
                  {ctaText}
                </Link>
              </div>
            )}
          </div>
          {imageUrl && (
            <div className="flex-1 relative aspect-square md:aspect-4/3 rounded-lg overflow-hidden shadow-md">
              <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
