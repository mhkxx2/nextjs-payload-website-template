'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import React, { useEffect, useId, useRef, useState } from 'react'
import type { SofaGalleryItem } from '@/lib/sofaGalleryItems'

/** The surrounding section's heading and introduction remain server-rendered. */
export function SofaGallery({
  heading,
  intro,
  items,
}: {
  heading: string
  intro?: string | null
  items: SofaGalleryItem[]
}) {
  const [activeId, setActiveId] = useState<SofaGalleryItem['id'] | null>(null)
  const viewer = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const captionId = useId()
  const activeIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeIndex]
  const opened = Boolean(activeItem)

  const close = () => setActiveId(null)
  const showSibling = (direction: -1 | 1) => {
    if (activeIndex < 0 || items.length < 2) return
    setActiveId(items[(activeIndex + direction + items.length) % items.length]!.id)
  }

  useEffect(() => {
    const dialog = viewer.current
    if (!opened || !dialog) return
    const previousOverflow = document.body.style.overflow
    const returnFocus = trigger.current
    document.body.style.overflow = 'hidden'
    // The native top layer also makes the rest of the page inert to pointer and focus input.
    dialog.showModal()
    closeButton.current?.focus()
    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
      touchStart.current = null
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true })
    }
  }, [opened])

  return (
    <div
      aria-label={heading}
      aria-describedby={intro ? `${captionId}-intro` : undefined}
      role="group"
      className="sofa-gallery"
    >
      {intro && (
        <span id={`${captionId}-intro`} hidden>
          {intro}
        </span>
      )}
      <div className="sofa-gallery-grid">
        {items.map((item) => (
          <figure key={item.id}>
            <button
              type="button"
              className="sofa-gallery-trigger"
              aria-label={`View ${item.alt}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                trigger.current = event.currentTarget
                setActiveId(item.id)
              }}
            >
              <Image
                alt={item.alt}
                src={item.url}
                width={item.width}
                height={item.height}
                sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) 46vw, 30vw"
                loading="lazy"
              />
              <span className="sofa-gallery-view" aria-hidden="true">
                View image <ArrowRight size={16} />
              </span>
            </button>
            <figcaption>{item.caption || 'Design inspiration'}</figcaption>
          </figure>
        ))}
      </div>
      {activeItem && (
        <dialog
          ref={viewer}
          className="sofa-lightbox"
          aria-label={heading}
          aria-modal="true"
          aria-describedby={captionId}
          onCancel={(event) => {
            event.preventDefault()
            close()
          }}
          onClose={close}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              close()
            }
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              showSibling(-1)
            }
            if (event.key === 'ArrowRight') {
              event.preventDefault()
              showSibling(1)
            }
            if (event.key !== 'Tab') return
            const controls =
              event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
            const first = controls[0]
            const last = controls[controls.length - 1]
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault()
              last?.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault()
              first?.focus()
            }
          }}
        >
          <div className="sofa-lightbox-toolbar">
            <p role="status" aria-live="polite" aria-atomic="true">
              {activeIndex + 1} / {items.length}
            </p>
            <button type="button" aria-label="Close gallery" ref={closeButton} onClick={close}>
              <X aria-hidden="true" />
            </button>
          </div>
          <figure
            onTouchStart={(event) => {
              const point = event.touches.length === 1 ? event.touches[0] : null
              touchStart.current = point ? { x: point.clientX, y: point.clientY } : null
            }}
            onTouchCancel={() => {
              touchStart.current = null
            }}
            onTouchEnd={(event) => {
              const start = touchStart.current
              touchStart.current = null
              const end = event.changedTouches[0]
              if (!start || !end || event.touches.length > 0) return
              const x = end.clientX - start.x
              const y = end.clientY - start.y
              if (Math.abs(x) > 55 && Math.abs(x) > Math.abs(y)) showSibling(x > 0 ? -1 : 1)
            }}
          >
            <div className="sofa-lightbox-image">
              <Image
                alt={activeItem.alt}
                src={activeItem.url}
                width={activeItem.width}
                height={activeItem.height}
                sizes="(max-width: 1024px) 95vw, 1100px"
                loading="eager"
              />
            </div>
            <figcaption id={captionId}>{activeItem.caption || 'Design inspiration'}</figcaption>
          </figure>
          <div className="sofa-lightbox-navigation">
            <button
              type="button"
              aria-label="Previous image"
              disabled={items.length < 2}
              onClick={() => showSibling(-1)}
            >
              <ArrowLeft aria-hidden="true" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              aria-label="Next image"
              disabled={items.length < 2}
              onClick={() => showSibling(1)}
            >
              <span>Next</span>
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </dialog>
      )}
    </div>
  )
}
