import Script from 'next/script'
import React from 'react'

import { buildConsentInitializationScript } from '@/lib/consent'

export const DEFAULT_GA_ID = 'G-G3SBEVF77F'
export const DEFAULT_GTM_ID = 'GTM-TDBXB2JP'

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || DEFAULT_GA_ID
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || DEFAULT_GTM_ID
export const ANALYTICS_ENABLED = process.env.NODE_ENV === 'production'

type AnalyticsScriptsProps = {
  enabled: boolean
  gaId: string
  gtmId: string
}

type GoogleTagManagerNoScriptProps = {
  enabled: boolean
  gtmId: string
}

export function GoogleTagManagerNoScript({
  enabled,
  gtmId,
}: GoogleTagManagerNoScriptProps) {
  if (!enabled) return null

  return (
    <noscript>
      <iframe
        height="0"
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
        width="0"
      />
    </noscript>
  )
}

export function AnalyticsScripts({ enabled, gaId, gtmId }: AnalyticsScriptsProps) {
  if (!enabled) return null

  return (
    <>
      {/* Consent defaults must be queued before GTM or GA4 can process storage. */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script id="google-consent-default" strategy="beforeInteractive">
        {buildConsentInitializationScript()}
      </Script>
      {/* App Router supports beforeInteractive in the root layout; this legacy lint rule only names pages/_document. */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script id="google-tag-manager" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
      <Script
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}');`}
      </Script>
    </>
  )
}
