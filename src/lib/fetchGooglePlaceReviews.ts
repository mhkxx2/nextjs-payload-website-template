import { unstable_cache } from 'next/cache'

export type GooglePlaceReview = {
  authorName: string
  authorPhotoUrl: string | null
  authorUrl: string | null
  id: string
  rating: number
  relativeTime: string
  reviewUrl: string | null
  text: string
}

export type GooglePlaceReviewsPayload = {
  fetchedAt: string
  placeId: string
  placeName: string
  rating: number
  reviews: GooglePlaceReview[]
  userRatingCount: number
}

const REVALIDATE_SECONDS = 60 * 60 * 12
const FIELD_MASK = 'id,displayName,rating,userRatingCount,reviews'

/** Process-local last successful payload for graceful failure while the process is warm. */
let lastGood: GooglePlaceReviewsPayload | null = null

type PlacesApiReview = {
  authorAttribution?: {
    displayName?: string
    photoUri?: string
    uri?: string
  }
  googleMapsUri?: string
  name?: string
  rating?: number
  relativePublishTimeDescription?: string
  text?: { text?: string }
}

type PlacesApiResponse = {
  displayName?: { text?: string }
  error?: { message?: string; status?: string }
  id?: string
  rating?: number
  reviews?: PlacesApiReview[]
  userRatingCount?: number
}

const httpsUrl = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

function normalizePayload(placeId: string, body: PlacesApiResponse): GooglePlaceReviewsPayload {
  const rating = typeof body.rating === 'number' && Number.isFinite(body.rating) ? body.rating : NaN
  const userRatingCount =
    typeof body.userRatingCount === 'number' && Number.isFinite(body.userRatingCount)
      ? Math.max(0, Math.round(body.userRatingCount))
      : NaN
  if (!Number.isFinite(rating) || !Number.isFinite(userRatingCount)) {
    throw new Error('Google Places response missing rating or review count.')
  }

  const reviews = (body.reviews ?? [])
    .map((review, index): GooglePlaceReview | null => {
      const authorName = review.authorAttribution?.displayName?.trim()
      const text = review.text?.text?.trim()
      const reviewRating = typeof review.rating === 'number' ? review.rating : NaN
      if (!authorName || !text || !Number.isFinite(reviewRating)) return null
      return {
        authorName,
        authorPhotoUrl: httpsUrl(review.authorAttribution?.photoUri),
        authorUrl: httpsUrl(review.authorAttribution?.uri),
        id: review.name?.trim() || `${placeId}-${index}`,
        rating: reviewRating,
        relativeTime: review.relativePublishTimeDescription?.trim() || '',
        reviewUrl: httpsUrl(review.googleMapsUri),
        text,
      }
    })
    .filter((review): review is GooglePlaceReview => review !== null)

  if (reviews.length === 0) {
    throw new Error('Google Places response contained no usable reviews.')
  }

  return {
    fetchedAt: new Date().toISOString(),
    placeId: body.id?.trim() || placeId,
    placeName: body.displayName?.text?.trim() || 'Google reviews',
    rating,
    reviews,
    userRatingCount,
  }
}

async function fetchPlaceReviewsFromGoogle(
  placeId: string,
  apiKey: string,
): Promise<GooglePlaceReviewsPayload> {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      // Caching is owned by unstable_cache below; avoid double-caching secrets in Next fetch.
      cache: 'no-store',
    },
  )

  const body = (await response.json()) as PlacesApiResponse
  if (!response.ok || body.error) {
    throw new Error(body.error?.message || `Google Places request failed (${response.status}).`)
  }

  return normalizePayload(placeId, body)
}

const getCachedPlaceReviews = unstable_cache(
  async (placeId: string, apiKey: string) => fetchPlaceReviewsFromGoogle(placeId, apiKey),
  ['google-place-reviews-v1'],
  { revalidate: REVALIDATE_SECONDS, tags: ['google-place-reviews'] },
)

export function getGooglePlacesApiKey(): string {
  return process.env.GOOGLE_PLACES_API_KEY?.trim() ?? ''
}

export async function getGooglePlaceReviews(
  placeId: string,
): Promise<GooglePlaceReviewsPayload | null> {
  const trimmedPlaceId = placeId.trim()
  const apiKey = getGooglePlacesApiKey()
  if (!trimmedPlaceId || !apiKey) return lastGood

  try {
    const payload = await getCachedPlaceReviews(trimmedPlaceId, apiKey)
    lastGood = payload
    return payload
  } catch {
    return lastGood
  }
}

export function ratingLabel(rating: number): string {
  if (rating >= 4.5) return 'EXCELLENT'
  if (rating >= 4) return 'GREAT'
  if (rating >= 3.5) return 'GOOD'
  if (rating >= 3) return 'AVERAGE'
  return 'POOR'
}

/** Test helper — clears process-local cache between unit tests. */
export function __resetGooglePlaceReviewsCacheForTests(): void {
  lastGood = null
}
