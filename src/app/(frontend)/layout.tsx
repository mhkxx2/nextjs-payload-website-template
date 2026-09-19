import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { WhatsAppAction } from '@/components/WhatsAppAction'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { SkipLink } from '@/components/SkipLink'
import { getDocumentLocale } from '@/lib/locale'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout(props: {
  children: React.ReactNode
  params?: Promise<{ locale?: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const { isEnabled } = await draftMode()
  const params = props.params ? await props.params : undefined
  const searchParams = props.searchParams ? await props.searchParams : undefined

  const { lang, dir } = getDocumentLocale(params?.locale, searchParams)

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang={lang}
      dir={dir}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <SkipLink />
          <AnnouncementBar
            badgeText="UAE SPECIAL"
            message="Free On-Site Consultation & Fabric Sampling Across Ajman, Sharjah & Dubai"
            linkText="Book Visit"
            linkUrl="/contact/"
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
          <WhatsAppAction href="https://wa.me/971501234567" label="Chat on WhatsApp" />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
