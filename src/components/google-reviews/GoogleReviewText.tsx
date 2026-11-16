'use client'

import React, { useEffect, useRef, useState } from 'react'

export function GoogleReviewText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      if (expanded) return
      setClamped(node.scrollHeight > node.clientHeight + 1)
    }
    measure()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    observer?.observe(node)
    return () => observer?.disconnect()
  }, [expanded, text])

  return (
    <div className="google-review-card-body">
      <p className={expanded ? 'google-review-text is-expanded' : 'google-review-text'} ref={ref}>
        {text}
      </p>
      {clamped || expanded ? (
        <button
          className="google-review-read-more"
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      ) : null}
    </div>
  )
}
