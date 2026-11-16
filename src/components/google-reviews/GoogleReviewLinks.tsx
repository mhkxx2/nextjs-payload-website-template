'use client'

import React from 'react'

import { pushDataLayerEvent } from '@/lib/analytics'

type Props = {
  mapsUrl: string
  writeReviewUrl: string
}

export function GoogleReviewLinks({ mapsUrl, writeReviewUrl }: Props) {
  return (
    <div className="google-reviews-actions">
      <a
        className="button button-outline"
        href={mapsUrl}
        onClick={() =>
          pushDataLayerEvent({
            event: 'reviews_view_google_click',
            cta_location: 'google_reviews',
            link_url: mapsUrl,
          })
        }
        rel="noopener noreferrer"
        target="_blank"
      >
        View Reviews on Google
      </a>
      <a
        className="button button-primary"
        href={writeReviewUrl}
        onClick={() =>
          pushDataLayerEvent({
            event: 'review_write_click',
            cta_location: 'google_reviews',
            link_url: writeReviewUrl,
          })
        }
        rel="noopener noreferrer"
        target="_blank"
      >
        Write a Review
      </a>
    </div>
  )
}
