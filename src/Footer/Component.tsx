import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'
import { phoneHref, whatsappHref } from '@/lib/contactLinks'
import { canonicalPath } from '@/lib/routes'
import { presentationPath } from '@/lib/presentationRoutes'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function Footer() {
  const [footerData, contact, settings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('contact-information', 0)(),
    getCachedGlobal('site-settings', 0)(),
  ])
  const phoneLink = phoneHref(contact.phoneE164)
  const whatsAppLink = contact.whatsappAvailable
    ? whatsappHref(contact.whatsappE164, settings.whatsAppCopy?.defaultMessage)
    : null

  return (
    <footer className="mt-auto border-t border-border bg-black text-white dark:bg-card">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-wrap gap-8">
          {(footerData.navigationGroups ?? []).map((group) => (
            <nav aria-label={group.heading} key={group.id ?? group.heading}>
              <p className="mb-2 font-medium">{group.heading}</p>
              <div className="flex flex-col gap-2">
                {(group.items ?? []).map((item) => (
                  <Link href={presentationPath(item.destination)} key={item.id ?? item.destination}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          ))}

          <nav aria-label="Services" className="flex flex-col gap-2">
            {(footerData.serviceLinks ?? []).map((item) => {
              if (typeof item.service === 'number') return null
              return (
                <Link href={canonicalPath('service', item.service.slug)} key={item.id ?? item.service.id}>
                  {item.label || item.service.title}
                </Link>
              )
            })}
          </nav>

          <nav aria-label="Legal" className="flex flex-col gap-2">
            {(footerData.legalLinks ?? []).map((item) => (
              <Link href={presentationPath(item.legalDestination)} key={item.id ?? item.legalDestination}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-start gap-4">
          {footerData.conversionContent?.heading ? (
            <p className="font-medium">{footerData.conversionContent.heading}</p>
          ) : null}
          {footerData.conversionContent?.copy ? <p>{footerData.conversionContent.copy}</p> : null}
          {footerData.conversionContent?.quotationLabel ? (
            <Link href="/contact">{footerData.conversionContent.quotationLabel}</Link>
          ) : null}
          {whatsAppLink && footerData.conversionContent?.whatsAppLabel ? (
            <Link href={whatsAppLink}>{footerData.conversionContent.whatsAppLabel}</Link>
          ) : null}
          {phoneLink ? <Link href={phoneLink}>{contact.phoneE164}</Link> : null}
          {footerData.supportingCopy ? <p>{footerData.supportingCopy}</p> : null}
          <ThemeSelector />
        </div>
      </div>
    </footer>
  )
}
