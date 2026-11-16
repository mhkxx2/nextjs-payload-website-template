import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { FIXED_SERVICE_SLUGS } from '@/lib/routes'

vi.mock('@/lib/publicQueries', () => ({
  queryPublicDocBySlug: vi.fn(async () => ({
    id: 1, title: 'Service', slug: 'sofa-upholstery',
    relatedServices: [{ id: 2, slug: 'sofa-repair', title: 'Sofa Repair' }],
  })),
}))
vi.mock('@/utilities/getGlobals', () => ({ getCachedGlobal: () => async () => ({ whatsappAvailable: false }) }))
vi.mock('@/lib/schema', () => ({ getSchemaGlobals: async () => ({}), buildSchemas: () => [] }))
vi.mock('@/lib/seo', () => ({ getSeoDefaults: async () => ({}), buildMetadata: () => ({}) }))
vi.mock('@/components/google-reviews/GoogleReviewsSection', () => ({
  GoogleReviewsSection: () => <section className="google-reviews-section">Customer reviews</section>,
}))
vi.mock('@/blocks/QuoteForm/Component', () => ({ QuoteFormBlockComponent: () => null }))
vi.mock('@/components/Media', () => ({ Media: () => null }))
vi.mock('@/components/RichText', () => ({ default: () => null }))
vi.mock('@/components/WhatsAppAction', () => ({ WhatsAppAction: () => null }))

describe('service reviews integration', () => {
  it('renders reviews before related services on sofa upholstery', async () => {
    const { ServicePage } = await import('@/components/ServicePage')
    const html = renderToStaticMarkup(await ServicePage({ slug: 'sofa-upholstery' }))
    expect(html).toContain('google-reviews-section')
    expect(html.indexOf('google-reviews-section')).toBeLessThan(html.indexOf('service-related-section'))
  })

  it.each(FIXED_SERVICE_SLUGS.filter((slug) => slug !== 'sofa-upholstery'))(
    'keeps reviews out of %s', async (slug) => {
      const { ServicePage } = await import('@/components/ServicePage')
      const html = renderToStaticMarkup(await ServicePage({ slug }))
      expect(html).not.toContain('google-reviews-section')
      expect(html).toContain('service-related-section')
    },
  )
})
