import Link from 'next/link'
import React from 'react'
import { Logo } from '@/components/Logo/Logo'
import { CookieSettingsButton } from '@/components/CookieSettingsButton'
import { TrackedContactLink } from '@/components/TrackedContactLink'
import { phoneHref, whatsappHref } from '@/lib/contactLinks'
import { canonicalPath } from '@/lib/routes'
import { presentationPath, type PresentationDestination } from '@/lib/presentationRoutes'

// Payload relationship values vary with query depth and are narrowed at use sites.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordData = Record<string, any>
export type FooterProps = { contact?: RecordData; data?: RecordData; settings?: RecordData; social?: RecordData }

export const Footer: React.FC<FooterProps> = ({ contact = {}, data = {}, settings = {}, social = {} }) => {
  const call = phoneHref(contact.phoneE164)
  const whatsapp = contact.whatsappAvailable === false ? null : whatsappHref(contact.whatsappE164, settings.whatsAppCopy?.defaultMessage)
  const address = [...new Set([contact.address?.line1, contact.address?.line2, contact.address?.city, contact.address?.country].filter(Boolean))]
  const services = Array.isArray(data.serviceLinks) ? data.serviceLinks : []
  const groups = Array.isArray(data.navigationGroups) ? data.navigationGroups : []
  const legal = Array.isArray(data.legalLinks) ? data.legalLinks : []
  const socialLinks = Array.isArray(social.links) ? social.links : []
  return <footer className="site-footer"><div className="site-container footer-grid"><div className="footer-brand"><Link aria-label={`${settings.brandName || 'Al Rukn Furniture'} Homepage`} href="/"><Logo brandName={settings.brandName} logo={settings.logo} /></Link>{data.supportingCopy && <p>{data.supportingCopy}</p>}<ul className="footer-contact">{call && <li><TrackedContactLink analytics={{ cta_location: 'footer' }} eventName="phone_call_click" href={call}>{contact.phoneE164}</TrackedContactLink></li>}{whatsapp && <li><TrackedContactLink analytics={{ cta_location: 'footer' }} eventName="whatsapp_click" href={whatsapp} rel="noopener noreferrer" target="_blank">WhatsApp</TrackedContactLink></li>}{contact.email && <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>}{address.length > 0 && <li>{address.join(', ')}</li>}{contact.mapURL && <li><a href={contact.mapURL} rel="noopener noreferrer" target="_blank">Google Maps</a></li>}</ul></div><div><h2>Services</h2><ul>{services.map((entry: RecordData) => { const service = typeof entry.service === 'object' ? entry.service : null; return service?.slug ? <li key={entry.id || service.id}><Link href={canonicalPath('service', service.slug)}>{entry.label || service.title}</Link></li> : null })}</ul></div>{groups.map((group: RecordData) => <div key={group.id || group.heading}><h2>{group.heading}</h2><ul>{(group.items || []).map((item: RecordData) => <li key={item.id || item.label}><Link href={presentationPath(item.destination as PresentationDestination)}>{item.label}</Link></li>)}</ul></div>)}<div><h2>Connect</h2><ul>{socialLinks.map((item: RecordData) => <li key={item.id || item.url}><a href={item.url} rel="noopener noreferrer" target="_blank">{item.label}</a></li>)}</ul></div></div><div className="site-container footer-bottom"><p>© {new Date().getFullYear()} {settings.brandName || 'Al Rukn Furniture'}.</p><nav aria-label="Legal">{legal.map((item: RecordData) => <Link href={presentationPath(item.legalDestination as PresentationDestination)} key={item.id || item.label}>{item.label}</Link>)}<CookieSettingsButton /></nav></div></footer>
}
