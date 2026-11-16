import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/script', () => ({
  default: ({ children, strategy: _strategy, ...props }: React.ComponentProps<'script'> & { strategy?: string }) => (
    <script {...props}>{children}</script>
  ),
}))

import {
  AnalyticsScripts,
  DEFAULT_GA_ID,
  DEFAULT_GTM_ID,
  GoogleTagManagerNoScript,
} from '@/components/AnalyticsScripts'

const occurrences = (value: string, needle: string) => value.split(needle).length - 1

describe('analytics script installation', () => {
  it('mounts each analytics component exactly once in the root layout', () => {
    const layout = readFileSync('src/app/(frontend)/layout.tsx', 'utf8')
    const headStart = layout.indexOf('<head>')
    const headEnd = layout.indexOf('</head>')
    const scripts = layout.indexOf('<AnalyticsScripts ')
    const bodyStart = layout.indexOf('<body>')
    const noScript = layout.indexOf('<GoogleTagManagerNoScript ')

    expect(occurrences(layout, '<AnalyticsScripts ')).toBe(1)
    expect(occurrences(layout, '<GoogleTagManagerNoScript ')).toBe(1)
    expect(scripts).toBeGreaterThan(headStart)
    expect(scripts).toBeLessThan(headEnd)
    expect(noScript).toBeGreaterThan(bodyStart)
  })

  it('renders one direct GA4 installation and one GTM installation with the supplied IDs', () => {
    const html = renderToStaticMarkup(
      <>
        <GoogleTagManagerNoScript enabled gtmId={DEFAULT_GTM_ID} />
        <AnalyticsScripts enabled gaId={DEFAULT_GA_ID} gtmId={DEFAULT_GTM_ID} />
      </>,
    )

    expect(DEFAULT_GA_ID).toBe('G-G3SBEVF77F')
    expect(DEFAULT_GTM_ID).toBe('GTM-TDBXB2JP')
    expect(occurrences(html, 'googletagmanager.com/gtag/js?id=G-G3SBEVF77F')).toBe(1)
    expect(occurrences(html, "gtag('config', 'G-G3SBEVF77F')")).toBe(1)
    expect(occurrences(html, "'GTM-TDBXB2JP'")).toBe(1)
    expect(occurrences(html, 'googletagmanager.com/ns.html?id=GTM-TDBXB2JP')).toBe(1)
    expect(html).not.toContain("gtag('event'")
  })

  it('establishes Consent Mode defaults before GTM and GA4 initialization', () => {
    const html = renderToStaticMarkup(
      <AnalyticsScripts enabled gaId={DEFAULT_GA_ID} gtmId={DEFAULT_GTM_ID} />,
    )
    const consent = html.indexOf('google-consent-default')
    const gtm = html.indexOf('google-tag-manager')
    const ga = html.indexOf('google-analytics-loader')

    expect(consent).toBeGreaterThanOrEqual(0)
    expect(consent).toBeLessThan(gtm)
    expect(gtm).toBeLessThan(ga)
    expect(occurrences(html, "gtag('consent', 'default'")).toBe(1)
    expect(html).toContain("analytics_storage:'denied'")
    expect(html).toContain("ad_storage:'denied'")
    expect(html).toContain("ad_user_data:'denied'")
    expect(html).toContain("ad_personalization:'denied'")
  })

  it('renders no analytics markup when production analytics is disabled', () => {
    const html = renderToStaticMarkup(
      <>
        <GoogleTagManagerNoScript enabled={false} gtmId={DEFAULT_GTM_ID} />
        <AnalyticsScripts enabled={false} gaId={DEFAULT_GA_ID} gtmId={DEFAULT_GTM_ID} />
      </>,
    )

    expect(html).toBe('')
  })

  it('accepts environment-provided IDs without introducing a second installation', () => {
    const html = renderToStaticMarkup(
      <AnalyticsScripts enabled gaId="G-OVERRIDE123" gtmId="GTM-OVERRIDE123" />,
    )

    expect(occurrences(html, 'G-OVERRIDE123')).toBe(2)
    expect(occurrences(html, 'GTM-OVERRIDE123')).toBe(1)
    expect(html).not.toContain(DEFAULT_GA_ID)
    expect(html).not.toContain(DEFAULT_GTM_ID)
  })
})
