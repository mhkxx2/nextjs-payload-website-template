'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'

export function GoogleReviewsScroller({ children }: { children: React.ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [activeDot, setActiveDot] = useState(0)
  const [dotCount, setDotCount] = useState(1)
  const labelId = useId()

  const updateControls = useCallback(() => {
    const node = scrollerRef.current
    if (!node) return
    const max = Math.max(0, node.scrollWidth - node.clientWidth)
    const left = node.scrollLeft
    setCanPrev(left > 4)
    setCanNext(left < max - 4)
    const card = node.querySelector<HTMLElement>('.google-review-card')
    const step = card ? card.offsetWidth + 16 : node.clientWidth * 0.85
    const count = Math.max(1, node.querySelectorAll('.google-review-card').length)
    setDotCount(count)
    setActiveDot(Math.min(count - 1, Math.round(left / Math.max(step, 1))))
  }, [])

  useEffect(() => {
    const node = scrollerRef.current
    if (!node) return
    updateControls()
    node.addEventListener('scroll', updateControls, { passive: true })
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateControls) : null
    observer?.observe(node)
    return () => {
      node.removeEventListener('scroll', updateControls)
      observer?.disconnect()
    }
  }, [updateControls, children])

  const scrollByCard = (direction: -1 | 1) => {
    const node = scrollerRef.current
    if (!node) return
    const card = node.querySelector<HTMLElement>('.google-review-card')
    const amount = card ? card.offsetWidth + 16 : node.clientWidth * 0.85
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollBy({ left: direction * amount, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <div className="google-reviews-carousel">
      <button
        aria-controls={labelId}
        aria-label="Previous reviews"
        className="google-reviews-arrow google-reviews-arrow-prev"
        disabled={!canPrev}
        onClick={() => scrollByCard(-1)}
        type="button"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <div
        aria-label="Customer reviews"
        className="google-reviews-scroller"
        id={labelId}
        ref={scrollerRef}
        role="region"
        tabIndex={0}
      >
        {children}
      </div>

      <button
        aria-controls={labelId}
        aria-label="Next reviews"
        className="google-reviews-arrow google-reviews-arrow-next"
        disabled={!canNext}
        onClick={() => scrollByCard(1)}
        type="button"
      >
        <span aria-hidden="true">›</span>
      </button>

      <div aria-hidden="true" className="google-reviews-dots">
        {Array.from({ length: dotCount }, (_, index) => (
          <span
            className={index === activeDot ? 'is-active' : undefined}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}
