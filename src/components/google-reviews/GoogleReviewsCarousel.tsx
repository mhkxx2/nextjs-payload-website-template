import React from 'react'

import type { GooglePlaceReview, GooglePlaceReviewsPayload } from '@/lib/fetchGooglePlaceReviews'
import { ratingLabel } from '@/lib/fetchGooglePlaceReviews'

import { GoogleReviewLinks } from './GoogleReviewLinks'
import { GoogleReviewStars } from './GoogleReviewStars'
import { GoogleReviewText } from './GoogleReviewText'
import { GoogleReviewsScroller } from './GoogleReviewsScroller'
import { GoogleGIcon, GoogleWordmark } from './icons'

type Props = {
  mapsUrl: string
  payload: GooglePlaceReviewsPayload
  writeReviewUrl: string
}

const AVATAR_COLORS = ['#835b2b', '#5c6b4a', '#6b4f3a', '#4a5c6b', '#7a5a3a', '#3f5d4a']

function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i) * (i + 1)) % AVATAR_COLORS.length
  return AVATAR_COLORS[hash] ?? AVATAR_COLORS[0]!
}

function ReviewCard({ review }: { review: GooglePlaceReview }) {
  const initial = review.authorName.trim().charAt(0).toUpperCase() || 'G'
  return (
    <article className="google-review-card" tabIndex={0}>
      <header className="google-review-card-header">
        <div className="google-review-author">
          {review.authorPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote Google avatar; fixed size avoids CLS
            <img
              alt=""
              className="google-review-avatar"
              decoding="async"
              height={40}
              loading="lazy"
              src={review.authorPhotoUrl}
              width={40}
            />
          ) : (
            <span
              aria-hidden="true"
              className="google-review-avatar google-review-avatar-fallback"
              style={{ background: avatarColor(review.authorName) }}
            >
              {initial}
            </span>
          )}
          <div className="google-review-author-meta">
            <p className="google-review-author-name">{review.authorName}</p>
            {review.relativeTime ? <p className="google-review-author-date">{review.relativeTime}</p> : null}
          </div>
        </div>
        <GoogleGIcon className="google-review-g" size={20} />
      </header>
      <GoogleReviewStars className="google-review-card-stars" rating={review.rating} size={17} />
      <GoogleReviewText text={review.text} />
    </article>
  )
}

export function GoogleReviewsCarousel({ mapsUrl, payload, writeReviewUrl }: Props) {
  return (
    <div className="google-reviews-native">
      <div className="google-reviews-layout">
        <aside className="google-reviews-summary">
          <p className="google-reviews-summary-label">{ratingLabel(payload.rating)}</p>
          <GoogleReviewStars rating={payload.rating} size={28} />
          <p className="google-reviews-summary-count">
            Based on {payload.userRatingCount} review{payload.userRatingCount === 1 ? '' : 's'}
          </p>
          <GoogleWordmark className="google-reviews-summary-logo" />
          <p className="google-reviews-attribution">Reviews from Google</p>
        </aside>

        <GoogleReviewsScroller>
          {payload.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </GoogleReviewsScroller>
      </div>

      <GoogleReviewLinks mapsUrl={mapsUrl} writeReviewUrl={writeReviewUrl} />
    </div>
  )
}
