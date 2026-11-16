import React from 'react'
import Image from 'next/image'

export type MediaBlockProps = {
  blockType?: 'media'
  media: { url?: string; alt?: string; width?: number; height?: number } | number | null
  caption?: string | null
  position?: 'default' | 'wide' | 'fullscreen' | null
}

export const MediaBlockComponent: React.FC<MediaBlockProps> = ({
  media,
  caption,
  position = 'default',
}) => {
  const imageUrl = typeof media === 'object' && media !== null ? media.url : null
  const imageAlt = typeof media === 'object' && media !== null ? media.alt || '' : ''

  if (!imageUrl) return null

  const widthClass =
    position === 'fullscreen'
      ? 'w-full'
      : position === 'wide'
      ? 'max-w-5xl mx-auto'
      : 'max-w-3xl mx-auto'

  return (
    <figure className={`py-6 ${widthClass}`}>
      <div className="container mx-auto px-4">
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
          <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
        </div>
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-neutral-500 italic">
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  )
}
