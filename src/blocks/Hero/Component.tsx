import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export type HeroBlockProps = {
  blockType?: 'hero'
  heading: string
  subheading?: string | null
  media?: { url?: string; alt?: string; width?: number; height?: number } | number | null
  ctaText?: string | null
  ctaLink?: string | null
  variant?: 'default' | 'centered' | 'split' | null
  alignment?: 'left' | 'center' | null
}

export const HeroBlockComponent: React.FC<HeroBlockProps> = ({
  heading,
  subheading,
  media,
  ctaText,
  ctaLink,
  variant = 'default',
  alignment = 'left',
}) => {
  const isCentered = alignment === 'center' || variant === 'centered'
  const imageUrl = typeof media === 'object' && media !== null ? media.url : null
  const imageAlt = typeof media === 'object' && media !== null ? media.alt || heading : heading

  return (
    <section className="py-12 md:py-20 bg-amber-50/50">
      <div className="container mx-auto px-4">
        <div className={`flex flex-col gap-8 ${variant === 'split' ? 'md:flex-row md:items-center' : ''}`}>
          <div className={`flex-1 ${isCentered ? 'text-center mx-auto max-w-3xl' : ''}`}>
            <h1 className="text-3xl md:text-5xl font-serif text-charcoal font-bold tracking-tight mb-4">
              {heading}
            </h1>
            {subheading && (
              <p className="text-lg md:text-xl text-neutral-600 mb-6 leading-relaxed">
                {subheading}
              </p>
            )}
            {ctaText && ctaLink && (
              <div>
                <Link
                  href={ctaLink}
                  className="inline-flex items-center justify-center px-6 py-3 rounded bg-amber-700 hover:bg-amber-800 text-white font-medium transition-colors"
                >
                  {ctaText}
                </Link>
              </div>
            )}
          </div>
          {imageUrl && (
            <div className={`flex-1 relative aspect-video rounded-lg overflow-hidden shadow-lg ${variant === 'split' ? 'w-full' : 'mt-6'}`}>
              <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
