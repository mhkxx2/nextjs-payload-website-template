import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { CookieConsent } from '@/components/CookieConsent'
import { WhatsAppAction } from '@/components/WhatsAppAction'
import { MobileStickyBar } from '@/components/MobileStickyBar'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { SkipLink } from '@/components/SkipLink'
import { getDocumentLocale } from '@/lib/locale'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { presentationPath } from '@/lib/presentationRoutes'
import { whatsappHref } from '@/lib/contactLinks'
import { SITE_ICON_PATHS } from '@/lib/siteIconPaths'
import {
  ANALYTICS_ENABLED,
  AnalyticsScripts,
  GA_ID,
  GoogleTagManagerNoScript,
  GTM_ID,
} from '@/components/AnalyticsScripts'

export default async function RootLayout(props: {
  children: React.ReactNode
  params?: Promise<{ locale?: string }>
}) {
  const { isEnabled } = await draftMode()
  const params = props.params ? await props.params : undefined

  const { lang, dir } = getDocumentLocale(params?.locale)
  const [settings, contact] = await Promise.all([
    getCachedGlobal('site-settings', 1)(),
    getCachedGlobal('contact-information', 0)(),
  ])
  const announcementDestination = settings.announcement?.destination
  const announcementURL = announcementDestination
    ? presentationPath(announcementDestination === 'quotation' ? 'contact' : announcementDestination)
    : null
  const whatsapp = contact.whatsappAvailable === false
    ? null
    : whatsappHref(contact.whatsappE164, settings.whatsAppCopy?.defaultMessage)

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang={lang}
      dir={dir}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <AnalyticsScripts enabled={ANALYTICS_ENABLED} gaId={GA_ID} gtmId={GTM_ID} />
      </head>
      <body>
        <GoogleTagManagerNoScript enabled={ANALYTICS_ENABLED} gtmId={GTM_ID} />
        <Providers>
          <SkipLink />
          <AnnouncementBar
            enabled={settings.announcement?.enabled ?? false}
            message={settings.announcement?.message}
            linkText={settings.announcement?.linkLabel}
            linkUrl={announcementURL}
          />
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          <main id="main-content" tabIndex={-1}>
            {props.children}
          </main>
          <Footer />
          <CookieConsent />
          <WhatsAppAction analytics={{ cta_location: 'floating_whatsapp' }} className="hidden md:flex" href={whatsapp} label={settings.whatsAppCopy?.defaultLabel || 'Chat on WhatsApp'} />
          <MobileStickyBar contact={contact} settings={settings} />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  // Public icon routes (not `/api/media/…`) — robots.txt disallows `/api/`, which
  // prevented Google Search from crawling the CMS favicon URL.
  return {
    metadataBase: new URL(getServerSideURL()),
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
    },
    icons: {
      icon: [
        { url: SITE_ICON_PATHS.favicon, type: 'image/png', sizes: '48x48' },
        { url: SITE_ICON_PATHS.icon, type: 'image/png', sizes: '192x192' },
      ],
      shortcut: SITE_ICON_PATHS.favicon,
      apple: [{ url: SITE_ICON_PATHS.apple, type: 'image/png', sizes: '180x180' }],
    },
  }
}
