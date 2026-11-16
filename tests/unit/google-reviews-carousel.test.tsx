import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { GoogleReviewsCarousel } from '@/components/google-reviews/GoogleReviewsCarousel'
import type { GooglePlaceReviewsPayload } from '@/lib/fetchGooglePlaceReviews'

const payload: GooglePlaceReviewsPayload = {
  fetchedAt: '2026-10-25T00:00:00.000Z',
  placeId: 'ChIJ-test',
  placeName: 'AL RUKN FURNITURE UPHOLSTERY',
  rating: 5,
  userRatingCount: 7,
  reviews: [
    {
      id: 'r1',
      authorName: 'Muhammad Tayyab',
      authorPhotoUrl: null,
      authorUrl: null,
      rating: 5,
      relativeTime: 'a month ago',
      reviewUrl: null,
      text: 'Really happy with the service. Great workmanship, good quality, and very professional team. Highly recommended!',
    },
    {
      id: 'r2',
      authorName: 'Sohail Ashraf',
      authorPhotoUrl: null,
      authorUrl: null,
      rating: 5,
      relativeTime: 'a month ago',
      reviewUrl: null,
      text: 'Excellent sofa reupholstery. On time and clean work.',
    },
    {
      id: 'r3',
      authorName: 'wisal khan',
      authorPhotoUrl: null,
      authorUrl: null,
      rating: 5,
      relativeTime: '2 months ago',
      reviewUrl: null,
      text: 'Professional team and beautiful finish.',
    },
    {
      id: 'r4',
      authorName: 'Extra Reviewer',
      authorPhotoUrl: null,
      authorUrl: null,
      rating: 5,
      relativeTime: '3 months ago',
      reviewUrl: null,
      text: 'Fourth review for carousel arrows.',
    },
  ],
}

describe('native Google reviews carousel', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders summary, real review authors, attribution, and Google CTAs without an API key', () => {
    render(
      <GoogleReviewsCarousel
        mapsUrl="https://maps.app.goo.gl/zUhpC9PNhgwM69qp6"
        payload={payload}
        writeReviewUrl="https://g.page/r/CZ5_iPy3nYpdEBM/review"
      />,
    )
    expect(screen.getByText('EXCELLENT')).toBeTruthy()
    expect(screen.getByText('Based on 7 reviews')).toBeTruthy()
    expect(screen.getByText('Reviews from Google')).toBeTruthy()
    expect(screen.getByText('Muhammad Tayyab')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'View Reviews on Google' }).getAttribute('href')).toContain('maps.app.goo.gl')
    expect(screen.getByRole('link', { name: 'Write a Review' }).getAttribute('href')).toContain('g.page')
    expect(document.body.textContent).not.toMatch(/AIza|GOOGLE_PLACES|api[_-]?key/i)
    expect(document.querySelector('iframe')).toBeNull()
    expect(document.querySelector('script[src*="maps.googleapis"]')).toBeNull()
  })

  it('pushes dataLayer events for both Google CTAs', () => {
    window.dataLayer = []
    render(
      <GoogleReviewsCarousel
        mapsUrl="https://maps.app.goo.gl/zUhpC9PNhgwM69qp6"
        payload={payload}
        writeReviewUrl="https://g.page/r/CZ5_iPy3nYpdEBM/review"
      />,
    )
    fireEvent.click(screen.getByRole('link', { name: 'View Reviews on Google' }))
    fireEvent.click(screen.getByRole('link', { name: 'Write a Review' }))
    const events = (window.dataLayer ?? []) as Array<{ event?: string }>
    expect(events.some((e) => e.event === 'reviews_view_google_click')).toBe(true)
    expect(events.some((e) => e.event === 'review_write_click')).toBe(true)
  })

  it('exposes labeled carousel arrows', () => {
    render(
      <GoogleReviewsCarousel
        mapsUrl="https://maps.app.goo.gl/zUhpC9PNhgwM69qp6"
        payload={payload}
        writeReviewUrl="https://g.page/r/CZ5_iPy3nYpdEBM/review"
      />,
    )
    expect(screen.getByRole('button', { name: 'Previous reviews' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Next reviews' })).toBeTruthy()
  })
})
