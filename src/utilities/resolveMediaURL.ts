/**
 * Resolves a proper root-relative or absolute URL from a Media resource,
 * string, or related value. Returns null if invalid or unpopulated numeric ID.
 */
export function resolveMediaURL(media: unknown): string | null {
  if (!media) return null

  if (typeof media === 'string') {
    const trimmed = media.trim()
    if (!trimmed || /^\d+$/.test(trimmed)) return null
    return trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('/')
      ? trimmed
      : `/${trimmed}`
  }

  if (typeof media === 'object' && media !== null && 'url' in media) {
    const url = (media as { url?: unknown }).url
    if (typeof url === 'string') {
      const trimmed = url.trim()
      if (trimmed) {
        return trimmed.startsWith('http://') ||
          trimmed.startsWith('https://') ||
          trimmed.startsWith('/')
          ? trimmed
          : `/${trimmed}`
      }
    }
  }

  return null
}
