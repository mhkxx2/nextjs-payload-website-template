'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { FocusTrap } from '@/components/FocusTrap'
import { TrackedContactLink } from '@/components/TrackedContactLink'
import { phoneHref, whatsappHref } from '@/lib/contactLinks'
import { canonicalPath } from '@/lib/routes'
import { presentationPath, type PresentationDestination } from '@/lib/presentationRoutes'

// Payload relationship values vary with query depth and are narrowed at use sites.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordData = Record<string, any>

const DRAWER_ID = 'mobile-navigation-drawer'

export function MobileNav({ contact = {}, data = {}, settings = {} }: { contact?: RecordData; data?: RecordData; settings?: RecordData }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

    const scrollY = window.scrollY
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    }
    const previousRootOverflow = document.documentElement.style.overflow

    document.body.dataset.mobileNavOpen = 'true'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      delete document.body.dataset.mobileNavOpen
      document.documentElement.style.overflow = previousRootOverflow
      document.body.style.overflow = previousBodyStyles.overflow
      document.body.style.position = previousBodyStyles.position
      document.body.style.top = previousBodyStyles.top
      document.body.style.width = previousBodyStyles.width
      window.scrollTo(0, scrollY)
    }
  }, [open])

  const call = phoneHref(contact.phoneE164)
  const whatsapp = contact.whatsappAvailable === false ? null : whatsappHref(contact.whatsappE164, settings.whatsAppCopy?.defaultMessage)
  const navigation = Array.isArray(data.navigation) ? data.navigation : []
  const services = Array.isArray(data.serviceLinks) ? data.serviceLinks : []

  const drawer = open && typeof document !== 'undefined' ? createPortal(
    <FocusTrap active onEscape={close}>
      <div
        aria-label="Navigation menu"
        aria-modal="true"
        className="mobile-drawer"
        id={DRAWER_ID}
        role="dialog"
      >
        <div className="mobile-drawer-scroll">
          <div className="drawer-head">
            <span className="drawer-brand">{settings.brandName || 'Al Rukn Furniture'}</span>
            <button aria-label="Close navigation menu" onClick={close} type="button">×</button>
          </div>
          <nav aria-label="Mobile navigation">
            {navigation.map((item: RecordData) => {
              if (item.destination === 'services') {
                return <div className="mobile-services" key={item.id || item.label}>
                  <Link href="/services/" onClick={close}>{item.label || 'Services'}</Link>
                  {services.map((entry: RecordData) => {
                    const service = typeof entry.service === 'object' ? entry.service : null
                    return service?.slug ? <Link href={canonicalPath('service', service.slug)} key={entry.id || service.id} onClick={close}>{entry.label || service.title}</Link> : null
                  })}
                </div>
              }
              const href = item.destination === 'areas' ? '/#areas-we-serve' : typeof item.destination === 'string' ? presentationPath(item.destination as PresentationDestination) : null
              return href ? <Link href={href} key={item.id || item.label} onClick={close}>{item.label}</Link> : null
            })}
          </nav>
          <div className="drawer-actions">
            {call && <TrackedContactLink analytics={{ cta_location: 'mobile_navigation' }} eventName="phone_call_click" href={call}>Call Now</TrackedContactLink>}
            {whatsapp && <TrackedContactLink analytics={{ cta_location: 'mobile_navigation' }} eventName="whatsapp_click" href={whatsapp} rel="noopener noreferrer" target="_blank">WhatsApp</TrackedContactLink>}
            <Link href="/#request-quote" onClick={close}>Get Free Quote</Link>
          </div>
        </div>
      </div>
    </FocusTrap>,
    document.body,
  ) : null

  return <div className="mobile-nav">
    <button
      aria-controls={DRAWER_ID}
      aria-expanded={open}
      aria-label={open ? 'Navigation menu open' : 'Open navigation menu'}
      className="menu-trigger"
      onClick={() => setOpen((value) => !value)}
      ref={trigger}
      type="button"
    >
      <span /><span /><span />
    </button>
    {drawer}
  </div>
}
