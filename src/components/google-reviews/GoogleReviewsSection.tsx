import React from 'react'

import { getGooglePlaceReviews, getGooglePlacesApiKey } from '@/lib/fetchGooglePlaceReviews'
import { resolveGoogleReviewsSettings } from '@/lib/googleReviews'
import { getCachedGlobal } from '@/utilities/getGlobals'

import { GoogleReviewLinks } from './GoogleReviewLinks'
import { GoogleReviewsCarousel } from './GoogleReviewsCarousel'

export async function GoogleReviewsSection({ className = '' }: { className?: string }) {
  const global = await getCachedGlobal('google-reviews', 0)()
  const apiKeyPresent = Boolean(getGooglePlacesApiKey())
  const settings = resolveGoogleReviewsSettings(global, apiKeyPresent)

  if (settings.mode !== 'native') {
    return (
      <section className={`google-reviews-section ${className}`.trim()}>
        <div className="site-container">
          <header className="section-heading">
            <p className="eyebrow">Google Reviews</p>
            <h2>{settings.heading}</h2>
            {settings.subheading ? <p>{settings.subheading}</p> : null}
          </header>
          <div className="google-reviews-fallback">
            <p>See our customer reviews on Google.</p>
            <GoogleReviewLinks mapsUrl={settings.mapsUrl} writeReviewUrl={settings.writeReviewUrl} />
          </div>
        </div>
      </section>
    )
  }

  const payload = await getGooglePlaceReviews(settings.placeId)
  if (!payload) return null

  const reviews = payload.reviews.slice(0, settings.reviewLimit)
  if (reviews.length === 0) return null

  return (
    <section className={`google-reviews-section ${className}`.trim()} data-reviews-source="google-places">
      <div className="site-container">
        <header className="section-heading section-heading-center">
          <p className="eyebrow">Google Reviews</p>
          <h2>{settings.heading}</h2>
          {settings.subheading ? <p>{settings.subheading}</p> : null}
        </header>
        <GoogleReviewsCarousel
          mapsUrl={settings.mapsUrl}
          payload={{ ...payload, reviews }}
          writeReviewUrl={settings.writeReviewUrl}
        />
      </div>
    </section>
  )
}
