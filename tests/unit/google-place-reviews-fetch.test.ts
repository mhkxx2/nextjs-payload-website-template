import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}))

import {
  __resetGooglePlaceReviewsCacheForTests,
  getGooglePlaceReviews,
  ratingLabel,
} from '@/lib/fetchGooglePlaceReviews'

describe('Google Places reviews fetch', () => {
  beforeEach(() => {
    __resetGooglePlaceReviewsCacheForTests()
  })

  afterEach(() => {
    __resetGooglePlaceReviewsCacheForTests()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('maps rating labels', () => {
    expect(ratingLabel(5)).toBe('EXCELLENT')
    expect(ratingLabel(4.2)).toBe('GREAT')
    expect(ratingLabel(3.6)).toBe('GOOD')
  })

  it('returns null without a server API key and never invents reviews', async () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', '')
    await expect(getGooglePlaceReviews('ChIJ-test')).resolves.toBeNull()
  })

  it('normalizes a Places API (New) response', async () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', 'test-server-key')
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        id: 'ChIJ-test',
        rating: 5,
        userRatingCount: 7,
        displayName: { text: 'AL RUKN FURNITURE UPHOLSTERY' },
        reviews: [{
          name: 'places/ChIJ-test/reviews/1',
          rating: 5,
          relativePublishTimeDescription: 'a month ago',
          text: { text: 'Really happy with the service.' },
          authorAttribution: { displayName: 'Muhammad Tayyab', photoUri: 'https://lh3.googleusercontent.com/a/test' },
          googleMapsUri: 'https://maps.google.com/?cid=1',
        }],
      }),
    }))
    vi.stubGlobal('fetch', fetchMock)

    const payload = await getGooglePlaceReviews('ChIJ-test')
    expect(payload).toMatchObject({
      placeName: 'AL RUKN FURNITURE UPHOLSTERY',
      rating: 5,
      userRatingCount: 7,
    })
    expect(payload?.reviews[0]).toMatchObject({
      authorName: 'Muhammad Tayyab',
      text: 'Really happy with the service.',
      rating: 5,
    })
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('places.googleapis.com/v1/places/'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Goog-Api-Key': 'test-server-key',
        }),
      }),
    )
  })
})
