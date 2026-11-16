'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { TrackedContactLink } from '@/components/TrackedContactLink'
import { phoneHref, whatsappHref } from '@/lib/contactLinks'

// Payload relationship values vary with query depth and are narrowed at use sites.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordData = Record<string, any>

const SOFA_SLUG = 'sofa-upholstery'
const CURTAINS_SLUG = 'curtains-blinds'
const SOFA_WHATSAPP_MESSAGE =
  "Hi Al Rukn, I want a quote for sofa upholstery. Area: ___. I'll send sofa photos and approximate size."
const CURTAINS_WHATSAPP_MESSAGE =
  'Hello Al Rukn Furniture, I would like a quotation for custom curtains or blinds in Dubai.'

export function MobileStickyBar({ contact = {}, settings = {} }: { contact?: RecordData; settings?: RecordData }) {
  const pathname = usePathname() || ''
  const onSofaUpholstery =
    pathname === `/${SOFA_SLUG}` ||
    pathname === `/${SOFA_SLUG}/` ||
    pathname.startsWith(`/${SOFA_SLUG}/`)
  const onCurtainsBlinds =
    pathname === `/${CURTAINS_SLUG}` ||
    pathname === `/${CURTAINS_SLUG}/` ||
    pathname.startsWith(`/${CURTAINS_SLUG}/`)

  const call = phoneHref(contact.phoneE164)
  const whatsappMessage = onSofaUpholstery
    ? SOFA_WHATSAPP_MESSAGE
    : onCurtainsBlinds
      ? CURTAINS_WHATSAPP_MESSAGE
      : settings.whatsAppCopy?.defaultMessage
  const whatsapp =
    contact.whatsappAvailable === false
      ? null
      : whatsappHref(contact.whatsappE164, whatsappMessage)
  const quoteHref = onSofaUpholstery
    ? `/${SOFA_SLUG}/#request-service-quote`
    : onCurtainsBlinds
      ? `/${CURTAINS_SLUG}/#quick-quote`
      : '/#request-quote'
  const waAnalytics = onSofaUpholstery
    ? { cta_location: 'mobile_sticky', service: SOFA_SLUG }
    : onCurtainsBlinds
      ? { cta_location: 'mobile_sticky', service: CURTAINS_SLUG }
      : { cta_location: 'mobile_sticky' }

  if (!call && !whatsapp) return null

  return (
    <nav aria-label="Quick contact" className="mobile-sticky-bar">
      {call && (
        <TrackedContactLink
          analytics={{ cta_location: 'mobile_sticky' }}
          eventName="phone_call_click"
          href={call}
        >
          Call
        </TrackedContactLink>
      )}
      {whatsapp && (
        <TrackedContactLink
          analytics={waAnalytics}
          eventName="whatsapp_click"
          href={whatsapp}
          rel="noopener noreferrer"
          target="_blank"
        >
          WhatsApp
        </TrackedContactLink>
      )}
      <Link href={quoteHref}>Get Quote</Link>
    </nav>
  )
}
