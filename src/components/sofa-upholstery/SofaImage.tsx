import Image from 'next/image'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const mediaRecord = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'url' in value && typeof value.url === 'string' && value.url
    ? (value as Media)
    : null

/** Keep catalogue imagery server-rendered, with reserved geometry and informative CMS alt text. */
export function SofaImage({
  resource,
  hero = false,
  describedBy,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: {
  resource: unknown
  hero?: boolean
  describedBy?: string
  sizes?: string
}) {
  const image = mediaRecord(resource)
  if (!image) return null
  return (
    <picture className="sofa-image">
      <Image
        alt={image.alt || ''}
        aria-describedby={describedBy}
        src={getMediaUrl(image.url, image.updatedAt)}
        width={image.width || 800}
        height={image.height || 600}
        sizes={sizes}
        preload={hero}
        fetchPriority={hero ? 'high' : 'auto'}
        loading={hero ? 'eager' : 'lazy'}
      />
    </picture>
  )
}
