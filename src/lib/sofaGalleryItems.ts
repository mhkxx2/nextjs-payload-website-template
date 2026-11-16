import type { Service } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export type SofaGalleryItem = {
  id: string | number
  url: string
  width: number
  height: number
  alt: string
  caption?: string
}

/** Captions cross the client boundary as text, never editable HTML or private provenance. */
export function captionText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  if ('text' in node && typeof node.text === 'string') return node.text
  if ('root' in node) return captionText(node.root)
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(captionText).join('type' in node && node.type === 'root' ? ' ' : '')
  }
  return 'type' in node && node.type === 'linebreak' ? ' ' : ''
}

export function sofaGalleryItems(gallery: Service['gallery']): SofaGalleryItem[] {
  return (gallery ?? [])
    .flatMap(({ id, image }) => {
      if (
        !image ||
        typeof image !== 'object' ||
        image.decorative ||
        !image.url?.trim() ||
        !image.alt?.trim() ||
        !image.width ||
        !image.height ||
        !Number.isFinite(image.width) ||
        !Number.isFinite(image.height) ||
        image.width <= 0 ||
        image.height <= 0
      )
        return []
      return [
        {
          id: id || image.id,
          url: getMediaUrl(image.url, image.updatedAt),
          width: image.width,
          height: image.height,
          alt: image.alt.trim(),
          caption: captionText(image.caption).trim() || 'Design inspiration',
        },
      ]
    })
    .slice(0, 16)
}
