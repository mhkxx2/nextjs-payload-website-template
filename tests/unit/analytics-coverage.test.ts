import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const source = (path: string) => readFileSync(path, 'utf8')

describe('analytics coverage contract', () => {
  it.each([
    ['src/components/Header/index.tsx', ['header', 'phone_call_click', 'whatsapp_click']],
    ['src/components/Header/MobileNav.tsx', ['mobile_navigation', 'phone_call_click', 'whatsapp_click']],
    ['src/components/MobileStickyBar.tsx', ['mobile_sticky', 'phone_call_click', 'whatsapp_click']],
    ['src/components/Footer/index.tsx', ['footer', 'phone_call_click', 'whatsapp_click']],
    ['src/components/home/HomepageView.tsx', ['homepage_hero', 'homepage_final_cta', 'whatsapp_click']],
    ['src/components/ServicePage.tsx', ['service_hero', 'service: slug']],
    ['src/components/portfolio/PortfolioExplorer.tsx', ['portfolio_item', 'portfolio_request', 'whatsapp_click']],
    ['src/app/(frontend)/contact/page.tsx', ['contact_hero', 'contact_details', 'leadType="contact"']],
  ])('keeps approved tracking on %s', (path, markers) => {
    const contents = source(path)
    for (const marker of markers) expect(contents).toContain(marker)
  })

  it.each([
    ['src/components/home/QuoteRequestForm.tsx', "lead_type: leadType"],
    ['src/components/portfolio/PortfolioExplorer.tsx', "lead_type: 'portfolio_request'"],
    ['src/blocks/Form/Component.tsx', "lead_type: 'form_submission'"],
  ])('keeps successful lead tracking on %s', (path, marker) => {
    expect(source(path)).toContain(marker)
  })

  it('does not add manual page-view or direct conversion delivery', () => {
    const files = [
      'src/components/AnalyticsScripts.tsx',
      'src/lib/analytics.ts',
      'src/components/TrackedContactLink.tsx',
    ]
    const contents = files.map(source).join('\n')

    expect(contents).not.toContain("gtag('event'")
    expect(contents).not.toContain("event: 'page_view'")
  })
})
