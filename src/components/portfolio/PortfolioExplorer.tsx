'use client'

import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'

import { TrackedContactLink } from '@/components/TrackedContactLink'
import { trackGenerateLead } from '@/lib/analytics'

type PortfolioMedia = {
  alt: string
  height: number
  url: string
  width: number
}

export type PortfolioCardData = {
  description?: null | string
  furnitureType: string
  id: number | string
  image: PortfolioMedia
  relatedService?: null | { slug: string; title: string }
  roomCategory: string
  slug: string
  title: string
  whatsappURL?: null | string
}

export type PortfolioFilter = { count: number; label: string; value: string }

type Props = {
  activeFilter: string
  filters: PortfolioFilter[]
  initialDesign?: null | string
  items: PortfolioCardData[]
  loadMoreHref?: null | string
  total: number
}

const roomLabel = (value: string) =>
  ({
    bathroom: 'Bathroom',
    bedroom: 'Bedroom',
    'dining-room': 'Dining Room',
    'kids-room': 'Kids Room',
    'living-room': 'Living Room',
    'office-study': 'Office / Study',
    storage: 'Storage',
  })[value] ?? value

const subscribeToHydration = () => () => undefined

export function PortfolioExplorer({ activeFilter, filters, initialDesign, items, loadMoreHref, total }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const closeButton = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const designTrigger = useRef<HTMLButtonElement>(null)
  const quoteTrigger = useRef<HTMLButtonElement>(null)
  const returnToQuoteTrigger = useRef(false)
  const touchStart = useRef<number | null>(null)
  const [quoteItem, setQuoteItem] = useState<PortfolioCardData | null>(null)
  const [copyState, setCopyState] = useState<'copied' | 'idle'>('idle')
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false)
  const [submission, setSubmission] = useState<null | { kind: 'error' | 'success'; message: string }>(null)
  const [pending, setPending] = useState(false)

  const designSlug = searchParams.get('design') || (!hydrated ? initialDesign : null)
  const activeIndex = useMemo(
    () => (designSlug ? items.findIndex((item) => item.slug === designSlug) : -1),
    [designSlug, items],
  )
  const activeItem = activeIndex >= 0 ? items[activeIndex] : null

  const updateDesign = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) params.set('design', slug)
    else params.delete('design')
    const query = params.toString()
    window.history.pushState(null, '', query ? `${pathname}?${query}` : pathname)
  }

  const showSibling = (direction: -1 | 1) => {
    if (activeIndex < 0 || items.length < 2) return
    const nextIndex = (activeIndex + direction + items.length) % items.length
    updateDesign(items[nextIndex]?.slug)
  }

  const restoreFocus = (target: React.RefObject<HTMLButtonElement | null>) => {
    window.requestAnimationFrame(() => target.current?.focus())
  }

  const closeDesign = () => {
    updateDesign()
    restoreFocus(designTrigger)
  }

  const closeQuote = () => {
    returnToQuoteTrigger.current = true
    setQuoteItem(null)
  }

  useEffect(() => {
    if (!activeItem && !quoteItem) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (quoteItem) closeQuote()
        else closeDesign()
        return
      }
      if (event.key === 'Tab') {
        const focusable = Array.from(
          dialog.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        ).filter((element) => element.getClientRects().length > 0)
        const first = focusable[0]
        const last = focusable.at(-1)
        if (first && last && event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (first && last && !event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
      if (!quoteItem && event.key === 'ArrowLeft') showSibling(-1)
      if (!quoteItem && event.key === 'ArrowRight') showSibling(1)
    }
    document.addEventListener('keydown', onKeyDown)
    const focusTimer = window.setTimeout(() => {
      if (returnToQuoteTrigger.current) {
        returnToQuoteTrigger.current = false
        quoteTrigger.current?.focus()
      } else {
        closeButton.current?.focus()
      }
    }, 0)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
    // Router/search params intentionally drive the active lightbox.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem?.id, quoteItem?.id])

  const requestItem = (item: PortfolioCardData) => {
    setSubmission(null)
    setQuoteItem(item)
  }

  async function submitQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setPending(true)
    setSubmission(null)
    try {
      const formData = new FormData(form)
      const response = await fetch('/api/quote-request', { body: formData, method: 'POST' })
      const result = (await response.json().catch(() => null)) as { message?: string } | null
      if (!response.ok) {
        setSubmission({ kind: 'error', message: result?.message ?? 'Please check the form and try again.' })
        return
      }
      trackGenerateLead({
        area: String(formData.get('area') ?? ''),
        category: quoteItem?.roomCategory,
        cta_location: 'portfolio',
        lead_type: 'portfolio_request',
        portfolio_item: quoteItem?.slug,
        service: quoteItem?.relatedService?.slug ?? String(formData.get('service') ?? ''),
      })
      form.reset()
      setSubmission({ kind: 'success', message: result?.message ?? 'Your quotation request has been received.' })
    } catch {
      setSubmission({ kind: 'error', message: 'The request could not be sent. Please use WhatsApp or try again.' })
    } finally {
      setPending(false)
    }
  }

  const copyLink = async (item: PortfolioCardData) => {
    const url = new URL(window.location.href)
    url.searchParams.set('design', item.slug)
    await navigator.clipboard.writeText(url.toString())
    setCopyState('copied')
    window.setTimeout(() => setCopyState('idle'), 1800)
  }

  return (
    <>
      <nav aria-label="Filter furniture portfolio" className="portfolio-filter-wrap">
        <div className="site-container portfolio-filters">
          {filters.map((filter) => {
            const href = filter.value === 'all' ? '/portfolio/' : `/portfolio/?category=${filter.value}`
            const selected = activeFilter === filter.value
            return (
              <Link aria-current={selected ? 'page' : undefined} className={selected ? 'is-active' : ''} href={href} key={filter.value}>
                {filter.label}<span>{filter.count}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <section className="portfolio-gallery-section" id="designs">
        <div className="site-container">
          <div className="portfolio-gallery-heading">
            <div><p className="eyebrow">Design library</p><h2>Explore Our Furniture Collection</h2></div>
            <p>Showing {items.length} of {total} designs</p>
          </div>
          <div className="portfolio-grid">
            {items.map((item, index) => (
              <article className={`portfolio-card portfolio-card-${(index % 7) + 1}`} key={item.id}>
                <button aria-label={`View ${item.title}`} className="portfolio-card-trigger" disabled={!hydrated} onClick={(event) => {
                  designTrigger.current = event.currentTarget
                  updateDesign(item.slug)
                }} type="button">
                  <Image alt={item.image.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" src={item.image.url} />
                  <span className="portfolio-card-shade" />
                  <span className="portfolio-card-copy"><span>{roomLabel(item.roomCategory)} · {item.furnitureType}</span><strong>{item.title}</strong></span>
                  <span className="portfolio-card-actions"><span>View Design</span><span>Get Similar Made</span></span>
                </button>
              </article>
            ))}
          </div>
          {items.length === 0 && <p className="portfolio-empty">No designs are published in this category yet.</p>}
          {loadMoreHref && <div className="portfolio-load-more"><Link className="button button-outline" href={loadMoreHref}>Load More Designs</Link></div>}
        </div>
      </section>

      {activeItem && !quoteItem && (
        <div aria-label={`${activeItem.title} design viewer`} aria-modal="true" className="portfolio-lightbox" ref={dialog} role="dialog">
          <button aria-label="Close design viewer" className="portfolio-lightbox-close" onClick={closeDesign} ref={closeButton} type="button"><X /></button>
          <button aria-label="Previous design" className="portfolio-lightbox-arrow is-prev" onClick={() => showSibling(-1)} type="button"><ArrowLeft /></button>
          <div className="portfolio-lightbox-layout" onTouchEnd={(event) => {
            if (touchStart.current == null) return
            const distance = event.changedTouches[0]!.clientX - touchStart.current
            if (Math.abs(distance) > 55) showSibling(distance > 0 ? -1 : 1)
            touchStart.current = null
          }} onTouchStart={(event) => { touchStart.current = event.touches[0]!.clientX }}>
            <div className="portfolio-lightbox-image"><Image alt={activeItem.image.alt} fill priority sizes="(max-width: 1023px) 100vw, 72vw" src={activeItem.image.url} /></div>
            <aside className="portfolio-lightbox-details">
              <p className="eyebrow">Design Inspiration</p>
              <p className="portfolio-lightbox-count">{activeIndex + 1} / {items.length}</p>
              <h2>{activeItem.title}</h2>
              <p className="portfolio-lightbox-meta">{roomLabel(activeItem.roomCategory)} · {activeItem.furnitureType}</p>
              {activeItem.description && <p>{activeItem.description}</p>}
              {activeItem.relatedService && <Link className="portfolio-service-link" href={`/${activeItem.relatedService.slug}/`}>Explore {activeItem.relatedService.title} <ExternalLink size={15} /></Link>}
              <div className="portfolio-lightbox-actions">
                <button className="button button-primary" onClick={() => requestItem(activeItem)} ref={quoteTrigger} type="button">Request Similar Design</button>
                {activeItem.whatsappURL && <TrackedContactLink analytics={{ category: activeItem.roomCategory, cta_location: 'portfolio', portfolio_item: activeItem.slug, service: activeItem.relatedService?.slug }} className="button button-whatsapp" eventName="whatsapp_click" href={activeItem.whatsappURL} rel="noopener noreferrer" target="_blank">Send on WhatsApp</TrackedContactLink>}
                <button className="portfolio-copy-link" onClick={() => copyLink(activeItem)} type="button">{copyState === 'copied' ? <Check size={16} /> : <Copy size={16} />}{copyState === 'copied' ? 'Link copied' : 'Copy design link'}</button>
              </div>
            </aside>
          </div>
          <button aria-label="Next design" className="portfolio-lightbox-arrow is-next" onClick={() => showSibling(1)} type="button"><ArrowRight /></button>
        </div>
      )}

      {quoteItem && (
        <div aria-label={`Request ${quoteItem.title}`} aria-modal="true" className="portfolio-quote-modal" ref={dialog} role="dialog">
          <div className="portfolio-quote-panel">
            <button aria-label="Close quotation form" className="portfolio-quote-close" onClick={closeQuote} ref={closeButton} type="button"><X /></button>
            <div className="portfolio-quote-reference"><Image alt={quoteItem.image.alt} fill sizes="(max-width: 767px) 100vw, 38vw" src={quoteItem.image.url} /></div>
            <div className="portfolio-quote-form">
              <p className="eyebrow">Request this design</p><h2>{quoteItem.title}</h2>
              <p>Tell us your room, size and preferred finish. We’ll discuss a custom quotation with you.</p>
              <form encType="multipart/form-data" onSubmit={submitQuote}>
                <input name="portfolioItem" type="hidden" value={String(quoteItem.id)} />
                <input name="service" type="hidden" value={quoteItem.relatedService?.slug || 'custom-furniture'} />
                <label><span>Name</span><input autoComplete="name" name="name" required type="text" /></label>
                <label><span>Phone / WhatsApp</span><input autoComplete="tel" inputMode="tel" name="phone" required type="tel" /></label>
                <label><span>Area</span><input name="area" required type="text" /></label>
                <label><span>Message</span><textarea defaultValue={`I would like a custom design similar to ${quoteItem.title}.`} name="message" required rows={4} /></label>
                <label><span>Additional photo <small>(optional)</small></span><input accept="image/jpeg,image/png,image/webp,image/avif" name="photo" type="file" /></label>
                <label className="consent-row"><input name="consent" required type="checkbox" value="true" /><span>I agree that Al Rukn may use these details to respond to my request. See the <Link href="/privacy/">privacy policy</Link>.</span></label>
                <button className="button button-primary button-wide" disabled={pending} type="submit">{pending ? 'Sending…' : 'Request a Quotation'}</button>
                <p aria-live="polite" className={submission?.kind === 'error' ? 'form-status form-error' : 'form-status form-success'} role="status">{submission?.message}</p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
