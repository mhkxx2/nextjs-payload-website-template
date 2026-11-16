import React from 'react'

const STAR = '#FBBC04'
const EMPTY = '#E0D6C8'

function StarPath({ fill }: { fill: string }) {
  return (
    <path
      d="M12 2.5l2.9 5.88 6.5.94-4.7 4.58 1.11 6.46L12 17.27 6.19 20.36l1.11-6.46-4.7-4.58 6.5-.94L12 2.5z"
      fill={fill}
    />
  )
}

export function GoogleReviewStars({
  rating,
  size = 18,
  className = '',
}: {
  rating: number
  size?: number
  className?: string
}) {
  const clamped = Math.max(0, Math.min(5, rating))
  const label = `${clamped.toFixed(1).replace(/\.0$/, '')} out of 5 stars`

  return (
    <div
      aria-label={label}
      className={`google-review-stars ${className}`.trim()}
      role="img"
      style={{ ['--star-size' as string]: `${size}px` }}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, clamped - index))
        return (
          <span className="google-review-star" key={index}>
            <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}>
              <StarPath fill={EMPTY} />
            </svg>
            {fill > 0 ? (
              <svg
                aria-hidden="true"
                className="google-review-star-fill"
                height={size}
                style={{ width: `${fill * 100}%` }}
                viewBox="0 0 24 24"
                width={size}
              >
                <StarPath fill={STAR} />
              </svg>
            ) : null}
          </span>
        )
      })}
    </div>
  )
}
