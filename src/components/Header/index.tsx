import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'
import { TrackedContactLink } from '@/components/TrackedContactLink'
import { phoneHref, whatsappHref } from '@/lib/contactLinks'
import { canonicalPath } from '@/lib/routes'
import { presentationPath, type PresentationDestination } from '@/lib/presentationRoutes'
import { MobileNav } from './MobileNav'

// Payload relationship values vary with query depth and are narrowed at use sites.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordData = Record<string, any>
export type HeaderProps = { contact?: RecordData; data?: RecordData; settings?: RecordData }

const destinationHref = (destination: unknown) => destination === 'areas' ? '/#areas-we-serve' : typeof destination === 'string' ? presentationPath(destination as PresentationDestination) : null

export const Header: React.FC<HeaderProps> = ({ contact = {}, data = {}, settings = {} }) => {
  const navigation = Array.isArray(data.navigation) ? data.navigation : []
  const serviceLinks = Array.isArray(data.serviceLinks) ? data.serviceLinks : []
  const call = phoneHref(contact.phoneE164)
  const whatsapp = contact.whatsappAvailable === false ? null : whatsappHref(contact.whatsappE164, settings.whatsAppCopy?.defaultMessage)
  return <header className="site-header"><div className="site-container header-inner"><Link aria-label={`${settings.brandName || 'Al Rukn Furniture'} Homepage`} className="brand-link" href="/"><Logo brandName={settings.brandName} loading="eager" logo={settings.logo} priority="high" /></Link><nav aria-label="Main navigation" className="desktop-nav">{navigation.map((item: RecordData) => { if (item.destination === 'services') return <div className="services-menu" key={item.id || item.label}><Link href="/services/">{item.label || 'Services'} <span aria-hidden="true">⌄</span></Link><div className="services-dropdown">{serviceLinks.map((entry: RecordData) => { const service = typeof entry.service === 'object' ? entry.service : null; return service?.slug ? <Link href={canonicalPath('service', service.slug)} key={entry.id || service.id}>{entry.label || service.title}</Link> : null })}</div></div>; const href = destinationHref(item.destination); return href ? <Link href={href} key={item.id || item.label}>{item.label}</Link> : null })}</nav><div className="header-actions">{call && <TrackedContactLink analytics={{ cta_location: 'header' }} className="header-call" eventName="phone_call_click" href={call}>Call Now</TrackedContactLink>}{whatsapp && <TrackedContactLink analytics={{ cta_location: 'header' }} aria-label="WhatsApp Al Rukn" className="header-whatsapp" eventName="whatsapp_click" href={whatsapp} rel="noopener noreferrer" target="_blank">WhatsApp</TrackedContactLink>}<Link className="button button-primary" href="/#request-quote">Get Free Quote</Link></div><MobileNav contact={contact} data={data} settings={settings} /></div></header>
}
