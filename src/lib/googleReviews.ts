export const DEFAULT_GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/zUhpC9PNhgwM69qp6'
export const DEFAULT_GOOGLE_REVIEW_URL = 'https://g.page/r/CZ5_iPy3nYpdEBM/review'

export type GoogleReviewsSettings = {
  heading: string
  mapsUrl: string
  mode: 'fallback' | 'native'
  placeId: string
  reviewLimit: number
  subheading: string
  writeReviewUrl: string
}

const safeURL = (value: unknown, hosts: string[]): string | null => {
  if (
    typeof value !== 'string' ||
    value.trim() !== value ||
    /^https:\/\/[^/?#]*:\d+(?:[/?#]|$)/i.test(value)
  ) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password && !url.port && !url.hash && hosts.includes(url.hostname)
      ? url.toString()
      : null
  } catch {
    return null
  }
}

export function resolveGoogleReviewsSettings(value: unknown, apiKeyPresent: boolean): GoogleReviewsSettings {
  const record = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const placeId = typeof record.placeId === 'string' ? record.placeId.trim() : ''
  const requestedLimit = typeof record.reviewLimit === 'number' && Number.isFinite(record.reviewLimit)
    ? record.reviewLimit
    : 5
  const mapsUrl = safeURL(record.mapsUrl ?? DEFAULT_GOOGLE_MAPS_URL,
    ['maps.app.goo.gl', 'maps.google.com', 'www.google.com', 'google.com'])
  const writeReviewUrl = safeURL(record.writeReviewUrl ?? DEFAULT_GOOGLE_REVIEW_URL,
    ['g.page', 'www.google.com', 'google.com'])
  return {
    heading: typeof record.heading === 'string' && record.heading.trim() ? record.heading.trim() : 'What Our Customers Say',
    mapsUrl: mapsUrl ?? DEFAULT_GOOGLE_MAPS_URL,
    mode: record.enabled === true && apiKeyPresent && Boolean(placeId) && mapsUrl && writeReviewUrl
      ? 'native'
      : 'fallback',
    placeId,
    reviewLimit: Math.max(3, Math.min(5, Math.round(requestedLimit))),
    subheading: typeof record.subheading === 'string' ? record.subheading.trim() : '',
    writeReviewUrl: writeReviewUrl ?? DEFAULT_GOOGLE_REVIEW_URL,
  }
}
