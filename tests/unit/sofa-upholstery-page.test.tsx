import React from 'react'
import { readFileSync } from 'node:fs'
import postcss from 'postcss'
import { cleanup, fireEvent, render, within, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Media, Service } from '@/payload-types'
import { SofaServiceCards } from '@/components/sofa-upholstery/SofaServiceCards'
import { serviceBySlug } from '@/seed/services'

const query = vi.hoisted(() => vi.fn())
vi.mock('@/lib/publicQueries', () => ({ queryPublicDocBySlug: query }))
vi.mock('@/utilities/getGlobals', () => ({
  getCachedGlobal: () => async () => ({
    phoneE164: '+971501234567',
    whatsappE164: '+971501234567',
    brandName: 'Al Rukn Furniture',
    titlePattern: '{title} | {brand}',
  }),
}))
vi.mock('@/lib/schema', async (original) => ({
  ...(await original<typeof import('@/lib/schema')>()),
  getSchemaGlobals: async () => ({ businessName: 'Al Rukn Furniture' }),
}))
// The reusable reviews component has its own integration coverage and asynchronous settings read.
vi.mock('@/components/google-reviews/GoogleReviewsSection', () => ({
  GoogleReviewsSection: () => (
    <section aria-label="Customer reviews" className="google-reviews-section">
      <h2>What Our Customers Say</h2>
    </section>
  ),
}))

const image = (name: string): Media => ({
  id: 1,
  alt: `${name} catalogue inspiration`,
  decorative: false,
  sourceURL: 'https://fixtures.example.test/catalogue',
  license: 'Owned catalogue',
  uploadedBy: 1,
  url: `/media/${name}.jpg`,
  width: 800,
  height: 600,
  mimeType: 'image/jpeg',
  updatedAt: '2026-10-01T00:00:00Z',
  createdAt: '2026-10-01T00:00:00Z',
})
const mediaCaption = (text: string): Media['caption'] => ({
  root: {
    type: 'root', version: 1, direction: 'ltr', format: '', indent: 0,
    children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text }] }],
  },
})
const fixture = (): Service => ({
  id: 1,
  slug: 'sofa-upholstery',
  title: 'Sofa Upholstery',
  status: 'published',
  publishedAt: '2026-10-01T00:00:00Z',
  _status: 'published',
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
  seo: {
    canonicalURL: 'https://alruknfurniture.ae/sofa-upholstery/',
    schemaTypes: ['Service', 'BreadcrumbList', 'FAQPage'],
  },
  hero: {
    eyebrow: 'Made for your furniture',
    heading: 'Sofa Upholstery in Dubai',
    copy: 'Serving Dubai from our Ajman workshop.',
    image: image('hero'),
  },
  trustItems: ['Ajman workshop', 'Fabric guidance', 'Photo enquiries', 'Foam assessment'].map(
    (label) => ({ label }),
  ),
  serviceOptions: {
    heading: 'Popular Sofa Upholstery Services',
    intro: 'Choose the scope for your seating.',
  },
  materialsHeading: 'Choose the Right Upholstery Fabric',
  sofaUpholsteryLanding: {
    popularServices: [
      'Fabric Replacement',
      'Corner Sofa',
      'Chair Upholstery',
      'Majlis Seating',
      'Cushion Covers',
      'Leather Sofa',
      'Dining Chairs',
      'Ottoman',
      'Bed & Headboard Upholstery',
    ].map((title, index) => ({
      title,
      description: `Discuss ${title.toLowerCase()} with our team.`,
      image: image(`service-${index}`),
      ctaLabel: index === 8 ? 'Coming Soon' : 'Discuss this service',
      comingSoon: index === 8,
      href: index === 8 ? '/bed-upholstery/' : null,
    })),
    fabricCards: ['Chenille', 'Velvet', 'Boucle', 'Linen Blends', 'Durable Woven Fabrics'].map(
      (title, index) => ({
        title,
        image: image(`fabric-${index}`),
        bestUse: `${title} seating`,
        comfort: `${title} texture`,
        durability: `${title} care guidance`,
      }),
    ),
    foamComfort: {
      heading: 'Restore Comfort, Not Just the Fabric',
      copy: 'Discuss cushion support during assessment.',
      items: [{ text: 'Seat support assessment' }],
      ctaLabel: 'Ask About Foam Replacement',
    },
    bedTeaser: {
      title: 'Bed Upholstery',
      description: 'A future furniture service.',
      label: 'Coming Soon',
      image: image('bed'),
    },
  },
  comparison: {
    heading: 'Sofa Repair vs Reupholstery',
    leftTitle: 'Sofa Repair',
    leftItems: [{ text: 'Discuss structural issues' }],
    rightTitle: 'Reupholstery',
    rightItems: [{ text: 'Discuss fabric replacement' }],
  },
  processHeading: 'How Your Sofa Is Reupholstered',
  process: ['Send Photos', 'Choose Materials', 'Workshop Work', 'Arrange Delivery'].map(
    (title) => ({ title, description: `We discuss ${title.toLowerCase()} with you.` }),
  ),
  benefits: [
    {
      title: 'Ajman workshop',
      description: 'Furniture work is coordinated from our Ajman workshop.',
    },
    { title: 'Material advice', description: 'Compare the available fabric samples.' },
  ],
  presentationLabels: {
    benefitsHeading: 'Why Choose Al Rukn',
    faqHeading: 'Sofa Upholstery FAQs',
    workshopNote: 'Serving Dubai from Ajman',
  },
  galleryHeading: 'Sofa Upholstery Gallery',
  gallery: [{ image: image('gallery') }],
  relatedHeading: 'Related Furniture Services',
  relatedServices: ['custom-furniture', 'custom-sofa', 'sofa-repair', 'curtains-blinds'].map(
    (slug, index) =>
      ({
        id: index + 2,
        slug,
        title: ['Custom Furniture', 'Custom Sofa', 'Sofa Repair', 'Curtains & Blinds'][index],
        summary: 'Explore our furniture services.',
        hero: { image: image(`related-${index}`) },
      }) as Service,
  ),
  serviceAreaHeading: 'Sofa Upholstery Across Dubai, Sharjah & UAE',
  serviceAreaCopy: 'Contact us to discuss your location.',
  serviceAreas: [{ area: 'Dubai' }, { area: 'Sharjah' }, { area: 'Ajman' }],
  faqs: Array.from(
    { length: 13 },
    (_, index) =>
      ({
        id: index + 1,
        question: `Sofa question ${index + 1}?`,
        answer: `Sofa answer ${index + 1}.`,
        schemaEligible: true,
        status: 'published',
        _status: 'published',
        publishedAt: '2026-10-01T00:00:00Z',
      }) as NonNullable<Service['faqs']>[number],
  ),
  quotationContext: {
    heading: 'Get a Sofa Upholstery Quote',
    buttonLabel: 'Get Free Quote',
    message: 'Send your furniture photos for an assessment.',
  },
  whatsAppContext: {
    label: 'WhatsApp Your Sofa Photo',
    message: 'I would like a sofa upholstery quote.',
  },
})

async function renderRoute() {
  const { default: Page } = await import('@/app/(frontend)/(services)/sofa-upholstery/page')
  const element = await Page()
  const Component = element.type as (props: unknown) => Promise<React.ReactElement>
  return render(await Component(element.props))
}

beforeEach(() => {
  query.mockReset()
  query.mockResolvedValue(fixture())
  window.dataLayer = []
  vi.stubEnv('__NEXT_TRAILING_SLASH', 'true')
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('dedicated sofa upholstery route', () => {
  it('publishes the approved CMS SEO title absolutely, full description and validated canonical', async () => {
    const service = fixture()
    service.seo = { ...service.seo, ...serviceBySlug('sofa-upholstery')!.seo }
    query.mockResolvedValue(service)
    const { generateMetadata } = await import('@/app/(frontend)/(services)/sofa-upholstery/page')
    const meta = await generateMetadata()
    expect(meta.title).toEqual({ absolute: 'Sofa Upholstery Dubai | Reupholstery & Sofa Repair | Al Rukn' })
    expect(meta.description).toBe('Professional sofa upholstery in Dubai for fabric replacement, foam renewal, corner sofas, chairs and Majlis seating. Serving Dubai from our Ajman workshop. Send photos for a quote.')
    expect(meta.openGraph?.title).toBe('Sofa Upholstery Dubai | Reupholstery & Sofa Repair | Al Rukn')
    expect(meta.twitter?.title).toBe('Sofa Upholstery Dubai | Reupholstery & Sofa Repair | Al Rukn')
    expect(meta.openGraph?.description).toBe(meta.description)
    expect(meta.twitter?.description).toBe(meta.description)
    expect(meta.alternates?.canonical).toBe('https://alruknfurniture.ae/sofa-upholstery/')
    service.seo!.title = 'Edited CMS sofa title'
    service.seo!.description = 'Edited CMS description.'
    service.seo!.canonicalURL = 'https://evil.example/sofa-upholstery/'
    expect(await generateMetadata()).toMatchObject({
      title: { absolute: 'Edited CMS sofa title' },
      description: 'Edited CMS description.',
      alternates: { canonical: 'https://alruknfurniture.ae/sofa-upholstery/' },
    })
  })

  it('limits route schema to service, breadcrumbs and exactly the visible eligible CMS FAQs', async () => {
    const service = fixture()
    const faqs = service.faqs as import('@/payload-types').Faq[]
    faqs[1]!.schemaEligible = false
    query.mockResolvedValue(service)
    const view = await renderRoute()
    const schemas = JSON.parse(view.container.querySelector('script[type="application/ld+json"]')!.textContent!) as Record<string, unknown>[]
    expect(schemas.map((schema) => schema['@type']).sort()).toEqual(['BreadcrumbList', 'FAQPage', 'Service'])
    expect(schemas.find((schema) => schema['@type'] === 'FAQPage')!.mainEntity).toEqual(
      Array.from(view.container.querySelectorAll('.service-faq-list details'))
        .filter((_, index) => index !== 1)
        .map((item) => ({ '@type': 'Question', name: item.querySelector('summary')!.textContent, acceptedAnswer: { '@type': 'Answer', text: item.querySelector('p')!.textContent } })),
    )
    expect(JSON.stringify(schemas)).not.toMatch(/"(?:Review|AggregateRating|Product|Offer)"|"(?:price|aggregateRating|ratingValue|review)":/i)
  })
  it('shows the edited CMS hero Media caption beside its image as an accessible disclosure', async () => {
    for (const disclosure of ['Company-owned catalogue inspiration; not a customer project.', 'Edited AI design inspiration <img src=x onerror=alert(1)>']) {
      const service = fixture()
      const heroImage = service.hero!.image as Media
      heroImage.caption = mediaCaption(disclosure)
      query.mockResolvedValue(service)
      const view = await renderRoute()
      const figure = view.container.querySelector('.service-hero-media')!
      const caption = figure.querySelector('figcaption')
      expect(caption?.textContent).toBe(disclosure)
      expect(figure.tagName).toBe('FIGURE')
      expect(within(figure as HTMLElement).getByRole('img').getAttribute('aria-describedby')).toBe(caption!.id)
      expect(caption?.querySelector('img')).toBeNull()
      expect(getComputedStyle(caption!).display).not.toBe('none')
      cleanup()
    }
  }, 20_000)

  it('discloses the actual seeded Eco hero when reused borrowed Media has no caption', async () => {
    const seed = serviceBySlug('sofa-upholstery')!
    const service = fixture()
    service.hero!.image = image(seed.hero.imageFile)
    service.galleryIntro = seed.galleryIntro
    const heroImage = service.hero!.image as Media
    heroImage.caption = null
    query.mockResolvedValue(service)
    const view = await renderRoute()
    const caption = view.container.querySelector('.service-hero-media figcaption')
    expect(caption?.textContent).toBe(seed.galleryIntro)
    expect(caption?.textContent).toMatch(/company-owned Eco Furniture catalogue inspiration/i)
    expect(caption?.textContent).toMatch(/not completed Al Rukn customer projects/i)
  })

  it('keeps the visible hero disclosure above WCAG AA contrast on its opaque background', async () => {
    const css = postcss.parse(readFileSync('src/app/(frontend)/globals.css', 'utf8'))
    css.walkAtRules(/^(import|config|custom-variant|plugin|source|theme|variant)$/, (rule) => { rule.remove() })
    const stylesheet = document.createElement('style')
    stylesheet.textContent = css.toString()
    document.head.append(stylesheet)
    try {
      const service = fixture()
      ;(service.hero!.image as Media).caption = mediaCaption('Catalogue inspiration; not a customer project.')
      query.mockResolvedValue(service)
      const view = await renderRoute()
      const caption = view.container.querySelector('.service-hero-media figcaption')
      expect(caption).not.toBeNull()
      const style = getComputedStyle(caption!)
      const luminance = (color: string) => {
        const channels = color.match(/[\d.]+/g)!.map(Number)
        expect(channels.length === 3 || channels[3] === 1).toBe(true)
        const linear = channels.slice(0, 3).map((channel) => { const value = channel / 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4 })
        return linear[0]! * .2126 + linear[1]! * .7152 + linear[2]! * .0722
      }
      const foreground = luminance(style.color)
      const background = luminance(style.backgroundColor)
      expect((Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05)).toBeGreaterThanOrEqual(4.5)
      expect(style.visibility).toBe('visible')
      expect(style.display).not.toBe('none')
    } finally { stylesheet.remove() }
  })

  it('keeps the small hero workshop note at WCAG AA text contrast', async () => {
    const css = postcss.parse(readFileSync('src/app/(frontend)/globals.css', 'utf8'))
    css.walkAtRules(/^(import|config|custom-variant|plugin|source|theme|variant)$/, (rule) => { rule.remove() })
    const stylesheet = document.createElement('style')
    stylesheet.textContent = css.toString()
    document.head.append(stylesheet)
    try {
      const view = await renderRoute()
      const note = view.container.querySelector('.service-workshop-note')!
      const hero = view.container.querySelector('.service-hero')!
      expect(note.textContent).toBe('Serving Dubai from Ajman')
      const luminance = (color: string) => {
        const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number)
        const linear = channels.map((channel) => {
          const value = channel / 255
          return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4
        })
        return linear[0]! * .2126 + linear[1]! * .7152 + linear[2]! * .0722
      }
      const foreground = luminance(getComputedStyle(note).color)
      const background = luminance(getComputedStyle(hero).backgroundColor)
      expect((Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05)).toBeGreaterThanOrEqual(4.5)
    } finally { stylesheet.remove() }
  }, 20_000)

  it('renders distinct CMS hero, process, form and final WhatsApp action labels', async () => {
    const service = fixture()
    Object.assign(service.presentationLabels!, { heroQuoteLabel: 'Get Free Quote', processCtaLabel: 'Get Your Sofa Quote', quoteWhatsAppLabel: 'WhatsApp Your Photos' })
    service.quotationContext!.buttonLabel = 'Request My Sofa Quote'
    service.whatsAppContext!.label = 'WhatsApp Your Sofa Photo'
    query.mockResolvedValue(service)
    const { SofaUpholsteryPage } = await import('@/components/sofa-upholstery/SofaUpholsteryPage')
    const view = render(await SofaUpholsteryPage())
    expect(within(view.container.querySelector('.service-hero')!).getByRole('link', { name: 'Get Free Quote' })).toBeTruthy()
    expect(within(view.container.querySelector('.service-process-section')!).getByRole('link', { name: 'Get Your Sofa Quote' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Request My Sofa Quote' })).toBeTruthy()
    expect(within(view.container.querySelector('.service-quote-section')!).getByRole('link', { name: 'WhatsApp Your Photos' })).toBeTruthy()
  }, 20_000)
  it.each([
    '/./bed-upholstery/',
    '/custom-sofa/../bed-upholstery/',
    '/custom-sofa/%2e%2e/bed-upholstery/?source=card#quote',
    '/%2E/bed-upholstery/',
    '/%62ed-upholstery/',
    '/%2562ed-upholstery/',
    '/custom-sofa/..//bed-upholstery/',
  ])('suppresses normalized bed destinations on legacy linked cards: %s', (href) => {
    const view = render(
      <SofaServiceCards
        cards={[
          {
            title: 'Legacy service card',
            description: 'An existing CMS card.',
            image: image('legacy'),
            ctaLabel: 'Discuss service',
            comingSoon: false,
            href,
          },
        ]}
      />,
    )
    expect(view.getByRole('link', { name: 'Discuss service' }).getAttribute('href')).toBe(
      '#request-service-quote',
    )
  })

  it('canonicalizes a valid fixed service destination and preserves its query and fragment', () => {
    const view = render(
      <SofaServiceCards
        cards={[
          {
            title: 'Repair service card',
            description: 'An existing CMS card.',
            image: image('repair'),
            ctaLabel: 'Discuss repair',
            comingSoon: false,
            href: '/custom-sofa/../sofa-repair/?source=card#quote',
          },
        ]}
      />,
    )
    expect(view.getByRole('link', { name: 'Discuss repair' }).getAttribute('href')).toBe(
      '/sofa-repair/?source=card#quote',
    )
  })

  it('renders one CMS H1, three hero actions and four trust points from one service query', async () => {
    const view = await renderRoute()
    expect(
      view.getAllByRole('heading', { level: 1 }).map((heading) => heading.textContent),
    ).toEqual(['Sofa Upholstery in Dubai'])
    const hero = within(view.container.querySelector('.service-hero')!)
    expect(hero.getByRole('link', { name: 'Get Free Quote' }).getAttribute('href')).toBe(
      '#request-service-quote',
    )
    expect(
      hero.getByRole('link', { name: 'WhatsApp Your Sofa Photo' }).getAttribute('href'),
    ).toContain('wa.me/971501234567')
    expect(hero.getByRole('link', { name: 'Call Now' }).getAttribute('href')).toBe(
      'tel:+971501234567',
    )
    expect(view.container.querySelectorAll('.service-trust-grid > *')).toHaveLength(4)
    expect(query).toHaveBeenCalledExactlyOnceWith('services', 'sofa-upholstery', 2)
  })

  it('renders nine image-led popular cards and suppresses all links on coming-soon cards', async () => {
    const view = await renderRoute()
    const cards = view.container.querySelectorAll('.sofa-popular-grid > article')
    expect(cards).toHaveLength(9)
    cards.forEach((card) =>
      expect(
        within(card as HTMLElement)
          .getByRole('img')
          .getAttribute('alt'),
      ).toContain('catalogue inspiration'),
    )
    const bed = view
      .getByRole('heading', { name: 'Bed & Headboard Upholstery' })
      .closest('article')!
    expect(within(bed).queryByRole('link')).toBeNull()
    expect(within(bed).getByText('Coming Soon')).toBeTruthy()
    expect(view.container.querySelector('a[href="/bed-upholstery/"]')).toBeNull()
  })

  it('renders exactly the five supplied fabric cards with all guidance and accepts a confirmed sixth', async () => {
    const view = await renderRoute()
    expect(view.container.querySelectorAll('.sofa-fabric-grid > article')).toHaveLength(5)
    expect(view.getByText('Chenille seating')).toBeTruthy()
    expect(view.getByText('Chenille texture')).toBeTruthy()
    expect(view.getByText('Chenille care guidance')).toBeTruthy()
    expect(view.queryByRole('heading', { name: 'Performance Fabrics' })).toBeNull()
    cleanup()
    const service = fixture()
    service.sofaUpholsteryLanding!.fabricCards!.push({
      title: 'Performance Fabrics',
      image: image('performance'),
      bestUse: 'Confirmed seating',
      comfort: 'Sample guidance',
      durability: 'Supplier guidance',
    })
    query.mockResolvedValue(service)
    const next = await renderRoute()
    expect(next.container.querySelectorAll('.sofa-fabric-grid > article')).toHaveLength(6)
    expect(next.getByRole('heading', { name: 'Performance Fabrics' })).toBeTruthy()
  })

  it('provides foam and process quote actions, repair navigation and the CMS benefits', async () => {
    const view = await renderRoute()
    expect(
      view.getByRole('link', { name: 'Ask About Foam Replacement' }).getAttribute('href'),
    ).toBe('#request-service-quote')
    const comparison = within(view.container.querySelector('.service-comparison-section')!)
    expect(comparison.getByRole('link', { name: 'Sofa Repair' }).getAttribute('href')).toBe(
      '/sofa-repair/',
    )
    const process = view.container.querySelector('.service-process-section')!
    expect(within(process as HTMLElement).getAllByRole('listitem')).toHaveLength(4)
    expect(
      within(process as HTMLElement).getByRole('link', { name: 'Get Free Quote' }),
    ).toBeTruthy()
    expect(view.getByText('Furniture work is coordinated from our Ajman workshop.')).toBeTruthy()
    expect(view.container.textContent).not.toMatch(/guaranteed|warranty|24.hour|Dubai workshop/i)
  })

  it('keeps gallery, fabric, foam, reviews, five image-related cards and areas in approved order', async () => {
    const view = await renderRoute()
    const headings = view
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent)
    const ordered = [
      'Popular Sofa Upholstery Services',
      'Sofa Upholstery Gallery',
      'Choose the Right Upholstery Fabric',
      'Restore Comfort, Not Just the Fabric',
      'Sofa Repair vs Reupholstery',
      'How Your Sofa Is Reupholstered',
      'Why Choose Al Rukn',
      'What Our Customers Say',
      'Related Furniture Services',
      'Sofa Upholstery Across Dubai, Sharjah & UAE',
      'Sofa Upholstery FAQs',
      'Get a Sofa Upholstery Quote',
    ]
    ordered.forEach((heading, index) => {
      expect(headings).toContain(heading)
      if (index)
        expect(headings.indexOf(heading)).toBeGreaterThan(headings.indexOf(ordered[index - 1]!))
    })
    const related = view.container.querySelectorAll('.sofa-related-grid > article')
    expect(related).toHaveLength(5)
    related.forEach((card) => expect(within(card as HTMLElement).getByRole('img')).toBeTruthy())
    expect(
      within(view.getByRole('heading', { name: 'Bed Upholstery' }).closest('article')!).queryByRole(
        'link',
      ),
    ).toBeNull()
  })

  it('shows all thirteen FAQs and reuses the upload-and-consent quote form with contact alternatives', async () => {
    const view = await renderRoute()
    expect(view.container.querySelectorAll('.service-faq-list details')).toHaveLength(13)
    expect(view.getByText('Sofa answer 13.')).toBeTruthy()
    const quote = view.container.querySelector('#request-service-quote')!
    expect(quote.querySelector('input[type="file"][name="photo"][required]')).toBeTruthy()
    expect(quote.querySelector('input[type="checkbox"][name="consent"][required]')).toBeTruthy()
    expect((quote.querySelector('select[name="service"]') as HTMLSelectElement).value).toBe(
      'sofa-upholstery',
    )
    expect(
      within(quote as HTMLElement).getByRole('link', { name: 'WhatsApp Your Sofa Photo' }),
    ).toBeTruthy()
    expect(within(quote as HTMLElement).getByRole('link', { name: 'Call Now' })).toBeTruthy()
    const schemas = JSON.parse(
      view.container.querySelector('script[type="application/ld+json"]')!.textContent!,
    )
    expect(JSON.stringify(schemas)).toContain('Sofa question 13?')
  })

  it('tracks hero and quote contact clicks and quote submission with service context', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ message: 'Received' }) }),
    )
    const view = await renderRoute()
    view.container.addEventListener('click', (event) => event.preventDefault())
    for (const selector of ['.service-hero', '#request-service-quote']) {
      const section = within(view.container.querySelector(selector)! as HTMLElement)
      fireEvent.click(section.getByRole('link', { name: 'WhatsApp Your Sofa Photo' }))
      fireEvent.click(section.getByRole('link', { name: 'Call Now' }))
    }
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ event: 'whatsapp_click', service: 'sofa-upholstery' }),
        expect.objectContaining({ event: 'phone_call_click', service: 'sofa-upholstery' }),
      ]),
    )
    expect(window.dataLayer).toHaveLength(4)
    fireEvent.submit(view.container.querySelector('form')!)
    await waitFor(() =>
      expect(window.dataLayer).toContainEqual(
        expect.objectContaining({ event: 'generate_lead', service: 'sofa-upholstery' }),
      ),
    )
  })

  it('uses changed CMS content rather than duplicating editable copy in the renderer', async () => {
    const service = fixture()
    service.hero!.heading = 'Edited sofa heading'
    service.materialsHeading = 'Edited fabric guide'
    service.sofaUpholsteryLanding!.popularServices![0]!.title = 'Edited popular service'
    service.sofaUpholsteryLanding!.foamComfort!.ctaLabel = 'Edited foam action'
    query.mockResolvedValue(service)
    const view = await renderRoute()
    expect(view.getByRole('heading', { level: 1, name: 'Edited sofa heading' })).toBeTruthy()
    expect(view.getByRole('heading', { name: 'Edited fabric guide' })).toBeTruthy()
    expect(view.getByRole('heading', { name: 'Edited popular service' })).toBeTruthy()
    expect(view.getByRole('link', { name: 'Edited foam action' })).toBeTruthy()
  })
})
