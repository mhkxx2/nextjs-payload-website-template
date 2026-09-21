import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { JsonLd } from '@/components/JsonLd'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import {
  SCHEMA_CONTEXT,
  SUPPORTED_SCHEMA_TYPES,
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildSchemas,
  resolveSchemaClaims,
  selectSchemaEligibleFaqs,
  serializeJsonLd,
  type JsonLdObject,
  type SchemaGlobals,
} from '@/lib/schema'
import { CANONICAL_ORIGIN, type SeoRecord } from '@/lib/seo'

const ORIGIN = CANONICAL_ORIGIN

const globals: SchemaGlobals = {
  brandName: 'Al Rukn Furniture',
  businessName: 'Al Rukn Furniture Upholstery',
  contact: {
    address: {
      city: 'Ajman',
      country: 'United Arab Emirates',
      emirate: 'Ajman',
      line1: 'Shop 5, Al Jerf 1',
    },
    email: 'info@alruknfurniture.ae',
    openingHours: [
      { closed: false, closes: '18:00', day: 'monday', opens: '09:00' },
      { closed: true, day: 'friday' },
      { closes: '18:00', day: 'funday', opens: '09:00' },
    ],
    phoneE164: '+971501234567',
  },
  localBusiness: { businessType: 'FurnitureStore', priceRange: 'moderate' },
  organization: {
    description: 'Upholstery and custom furniture made in Ajman.',
    logo: { alt: 'Al Rukn Furniture', height: 200, url: '/media/logo.png', width: 600 },
    name: 'Al Rukn Furniture',
  },
  social: { links: [{ label: 'Instagram', network: 'instagram', url: 'https://instagram.com/alruknfurniture' }] },
}

/** Test records may carry relation fields that the schema builders read structurally. */
type TestRecord = SeoRecord & {
  faqs?: unknown
  serviceAreas?: unknown
}

const published = (overrides: TestRecord = {}): TestRecord => ({
  _status: 'published',
  publishedAt: '2026-01-05T08:00:00.000Z',
  status: 'published',
  updatedAt: '2026-02-01T08:00:00.000Z',
  ...overrides,
})

const byType = (schemas: JsonLdObject[], type: string): JsonLdObject | undefined =>
  schemas.find((schema) => schema['@type'] === type)

const faq = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
  _status: 'published',
  answer: 'We rebuild the frame and replace the foam.',
  publishedAt: '2026-01-05T08:00:00.000Z',
  question: 'Can you rebuild a sagging frame?',
  schemaEligible: true,
  status: 'published',
  ...overrides,
})

describe('Organization and LocalBusiness', () => {
  it('builds the Organization only from validated global values', () => {
    const organization = buildOrganizationSchema(globals, ORIGIN)

    expect(organization).not.toBeNull()
    expect(organization?.['@context']).toBe(SCHEMA_CONTEXT)
    expect(organization?.['@type']).toBe('Organization')
    expect(organization?.name).toBe('Al Rukn Furniture')
    expect(organization?.url).toBe(`${ORIGIN}/`)
    expect(organization?.description).toBe('Upholstery and custom furniture made in Ajman.')
    expect(organization?.logo).toEqual({
      '@type': 'ImageObject',
      height: 200,
      url: `${ORIGIN}/media/logo.png`,
      width: 600,
    })
    expect(organization?.sameAs).toEqual(['https://instagram.com/alruknfurniture'])
    expect(organization?.contactPoint).toEqual({
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@alruknfurniture.ae',
      telephone: '+971501234567',
      url: `${ORIGIN}/contact/`,
    })
  })

  it('claims nothing when the globals carry no organization name', () => {
    expect(buildOrganizationSchema(null, ORIGIN)).toBeNull()
    expect(buildOrganizationSchema({}, ORIGIN)).toBeNull()
    expect(buildOrganizationSchema({ contact: globals.contact }, ORIGIN)).toBeNull()

    const named = buildOrganizationSchema({ brandName: 'Al Rukn Furniture' }, ORIGIN)

    expect(named?.name).toBe('Al Rukn Furniture')
    expect(named?.sameAs).toBeUndefined()
    expect(named?.logo).toBeUndefined()
    expect(named?.contactPoint).toBeUndefined()
  })

  it('only claims a LocalBusiness when the contact global holds a postal address', () => {
    const localBusiness = buildLocalBusinessSchema(globals, ORIGIN)

    expect(localBusiness?.['@type']).toBe('FurnitureStore')
    expect(localBusiness?.name).toBe('Al Rukn Furniture')
    expect(localBusiness?.url).toBe(`${ORIGIN}/`)
    expect(localBusiness?.address).toEqual({
      '@type': 'PostalAddress',
      addressCountry: 'United Arab Emirates',
      addressLocality: 'Ajman',
      addressRegion: 'Ajman',
      streetAddress: 'Shop 5, Al Jerf 1',
    })
    expect(localBusiness?.telephone).toBe('+971501234567')
    expect(localBusiness?.email).toBe('info@alruknfurniture.ae')
    expect(localBusiness?.priceRange).toBe('moderate')
    // Closed days and unknown days are dropped instead of being guessed at.
    expect(localBusiness?.openingHoursSpecification).toEqual([
      {
        '@type': 'OpeningHoursSpecification',
        closes: '18:00',
        dayOfWeek: 'https://schema.org/Monday',
        opens: '09:00',
      },
    ])
  })

  it('falls back to the generic type and refuses an address-less business', () => {
    const declared = buildLocalBusinessSchema(
      { ...globals, localBusiness: { businessType: 'AggregateRating' } },
      ORIGIN,
    )

    expect(declared?.['@type']).toBe('LocalBusiness')

    expect(
      buildLocalBusinessSchema(
        { ...globals, contact: { address: { city: 'Ajman' }, email: 'info@alruknfurniture.ae' } },
        ORIGIN,
      ),
    ).toBeNull()
  })
})

describe('Service', () => {
  const service = published({
    serviceAreas: [{ area: 'Ajman' }, { area: 'Sharjah' }],
    seo: { description: 'Sofa repair across Ajman.' },
    slug: 'sofa-repair',
    summary: 'Frames rebuilt and re-covered.',
    title: 'Sofa Repair',
  })

  it('is emitted only for a published service page', () => {
    const schemas = buildSchemas({
      breadcrumbs: buildBreadcrumbs('/sofa-repair/', service),
      globals,
      kind: 'service',
      path: '/sofa-repair/',
      record: service,
    })

    const schema = byType(schemas, 'Service')

    expect(schema?.name).toBe('Sofa Repair')
    expect(schema?.url).toBe(`${ORIGIN}/sofa-repair/`)
    expect(schema?.description).toBe('Sofa repair across Ajman.')
    expect(schema?.areaServed).toEqual(['Ajman', 'Sharjah'])
    expect(schema?.provider).toEqual({
      '@id': `${ORIGIN}/#organization`,
      '@type': 'Organization',
      name: 'Al Rukn Furniture',
      url: `${ORIGIN}/`,
    })
    expect(schema?.offers).toBeUndefined()
    expect(schema?.aggregateRating).toBeUndefined()
  })

  it('is never claimed from a page, project or archive kind', () => {
    for (const kind of ['archive', 'home', 'page', 'post', 'project'] as const) {
      const schemas = buildSchemas({ globals, kind, path: '/sofa-repair/', record: service })

      expect(byType(schemas, 'Service'), kind).toBeUndefined()
    }
  })

  it('is withheld for unpublished records and for records that claim other types', () => {
    const draft = published({ _status: 'draft', serviceAreas: [], title: 'Sofa Repair' })

    expect(
      buildSchemas({ globals, kind: 'service', path: '/sofa-repair/', record: draft }),
    ).toEqual([expect.objectContaining({ '@type': 'Organization' })])

    const articleOnly = published({
      seo: { schemaTypes: ['Article'] },
      slug: 'sofa-repair',
      title: 'Sofa Repair',
    })

    expect(
      buildSchemas({ globals, kind: 'service', path: '/sofa-repair/', record: articleOnly }).map(
        (schema) => schema['@type'],
      ),
    ).toEqual(['Organization'])
  })
})

describe('Article', () => {
  const post = published({
    excerpt: 'How we rebuild a frame.',
    populatedAuthors: [{ name: 'Al Rukn Workshop' }],
    slug: 'rebuilding-a-frame',
    title: 'Rebuilding a frame',
  })

  it('is emitted only for a published post', () => {
    const schemas = buildSchemas({
      breadcrumbs: buildBreadcrumbs('/blog/rebuilding-a-frame/', post),
      globals,
      kind: 'post',
      path: '/blog/rebuilding-a-frame/',
      record: post,
    })

    const article = byType(schemas, 'Article')

    expect(article?.headline).toBe('Rebuilding a frame')
    expect(article?.description).toBe('How we rebuild a frame.')
    expect(article?.author).toEqual({ '@type': 'Person', name: 'Al Rukn Workshop' })
    expect(article?.datePublished).toBe('2026-01-05T08:00:00.000Z')
    expect(article?.dateModified).toBe('2026-02-01T08:00:00.000Z')
    expect(article?.mainEntityOfPage).toEqual({
      '@id': `${ORIGIN}/blog/rebuilding-a-frame/`,
      '@type': 'WebPage',
    })
    expect(article?.publisher).toEqual({
      '@type': 'Organization',
      name: 'Al Rukn Furniture',
      url: `${ORIGIN}/`,
    })
  })

  it('is withheld for drafts, future schedules and other content types', () => {
    const draft = published({ _status: 'draft', title: 'Rebuilding a frame' })
    const scheduled = published({
      publishedAt: new Date(Date.now() + 86_400_000).toISOString(),
      title: 'Rebuilding a frame',
    })

    expect(buildArticleSchema(draft, { globals, origin: ORIGIN, path: '/blog/x/' })).toBeNull()
    expect(buildArticleSchema(scheduled, { globals, origin: ORIGIN, path: '/blog/x/' })).toBeNull()

    const project = published({ slug: 'majlis-refit', title: 'Majlis refit' })
    const schemas = buildSchemas({
      globals,
      kind: 'project',
      path: '/projects/majlis-refit/',
      record: project,
    })

    expect(byType(schemas, 'Article')).toBeUndefined()
  })

  it('clamps an overlong headline instead of publishing it verbatim', () => {
    const article = buildArticleSchema(published({ title: 'x'.repeat(200) }), {
      globals,
      origin: ORIGIN,
      path: '/blog/long/',
    })

    expect(String(article?.headline)).toHaveLength(110)
  })
})

describe('FAQPage', () => {
  it('describes exactly the visible FAQs an editor marked eligible', () => {
    const visible = [
      faq(),
      faq({ question: 'Hidden answer', schemaEligible: false }),
      faq({ question: 'Still a draft', _status: 'draft' }),
      faq({ question: 'No answer yet', answer: '' }),
      faq({ question: 'Scheduled later', publishedAt: new Date(Date.now() + 86_400_000).toISOString() }),
      12,
      null,
    ]

    const eligible = selectSchemaEligibleFaqs(visible, new Date('2026-03-01T00:00:00.000Z'))
    const schema = buildFaqSchema(visible, { now: new Date('2026-03-01T00:00:00.000Z') })

    expect(eligible).toHaveLength(1)
    expect(schema?.['@type']).toBe('FAQPage')
    expect(schema?.mainEntity).toEqual([
      {
        '@type': 'Question',
        acceptedAnswer: { '@type': 'Answer', text: 'We rebuild the frame and replace the foam.' },
        name: 'Can you rebuild a sagging frame?',
      },
    ])
  })

  it('accepts relationship ids and unversioned docs without inventing questions', () => {
    expect(selectSchemaEligibleFaqs([1, 2])).toEqual([])
    expect(buildFaqSchema([])).toBeNull()
    expect(buildFaqSchema(undefined)).toBeNull()
    expect(
      selectSchemaEligibleFaqs([
        { answer: 'Yes.', question: 'Do you deliver?' },
        { answer: 'Yes.', question: 'Do you deliver?', schemaEligible: true },
      ]),
    ).toHaveLength(1)
  })

  it('never adds a FAQPage to a page that shows no eligible FAQ', () => {
    const schemas = buildSchemas({
      globals,
      kind: 'page',
      path: '/privacy-policy/',
      visibleFaqs: [faq({ schemaEligible: false })],
    })

    expect(schemas.some((schema) => schema['@type'] === 'FAQPage')).toBe(false)
  })
})

describe('BreadcrumbList', () => {
  it('mirrors the visible breadcrumbs, Home first and no link on the current page', () => {
    const breadcrumbs = buildBreadcrumbs('/projects/majlis-refit/', { title: 'Majlis refit' })
    const schema = buildBreadcrumbSchema(breadcrumbs, ORIGIN)

    expect(breadcrumbs).toEqual([
      { href: '/projects/', label: 'Projects' },
      { label: 'Majlis refit' },
    ])
    expect(schema?.['@type']).toBe('BreadcrumbList')
    expect(schema?.itemListElement).toEqual([
      { '@type': 'ListItem', item: `${ORIGIN}/`, name: 'Home', position: 1 },
      { '@type': 'ListItem', item: `${ORIGIN}/projects/`, name: 'Projects', position: 2 },
      { '@type': 'ListItem', name: 'Majlis refit', position: 3 },
    ])
  })

  it('is absent wherever the app shows no breadcrumbs', () => {
    expect(buildBreadcrumbSchema(buildBreadcrumbs('/', null), ORIGIN)).toBeNull()
    expect(buildBreadcrumbSchema([], ORIGIN)).toBeNull()
    expect(buildBreadcrumbSchema(undefined, ORIGIN)).toBeNull()

    const home = buildSchemas({ globals, kind: 'home', path: '/' })

    expect(byType(home, 'BreadcrumbList')).toBeUndefined()
  })

  it('drops a label it cannot publish instead of injecting markup', () => {
    const schema = buildBreadcrumbSchema(
      [{ href: '/blog/', label: 'Blog' }, { label: '<img src=x onerror=alert(1)>' }],
      ORIGIN,
    )

    expect(schema?.itemListElement).toEqual([
      { '@type': 'ListItem', item: `${ORIGIN}/`, name: 'Home', position: 1 },
      { '@type': 'ListItem', item: `${ORIGIN}/blog/`, name: 'Blog', position: 2 },
    ])
    expect(JSON.stringify(schema)).not.toContain('onerror')
  })
})

describe('buildSchemas', () => {
  it('publishes the site identity on the home page and the contact page', () => {
    const home = buildSchemas({
      globals,
      includeLocalBusiness: true,
      kind: 'home',
      path: '/',
    })

    expect(home.map((schema) => schema['@type'])).toEqual(['Organization', 'FurnitureStore'])

    const contact = buildSchemas({
      breadcrumbs: buildBreadcrumbs('/contact/', null),
      globals,
      includeLocalBusiness: true,
      kind: 'page',
      path: '/contact/',
    })

    expect(contact.map((schema) => schema['@type'])).toEqual([
      'Organization',
      'FurnitureStore',
      'BreadcrumbList',
    ])
  })

  it('ignores schema claims that are not supported', () => {
    const claims = resolveSchemaClaims({ seo: { schemaTypes: ['Review', 'AggregateRating'] } }, 'page')

    expect([...claims]).toEqual(['BreadcrumbList'])
    expect([...SUPPORTED_SCHEMA_TYPES]).toEqual([
      'Organization',
      'LocalBusiness',
      'Service',
      'Article',
      'FAQPage',
      'BreadcrumbList',
    ])

    const schemas = buildSchemas({
      globals,
      kind: 'page',
      path: '/about-us/',
      record: { seo: { schemaTypes: ['Review', 'AggregateRating'] }, title: 'About' },
    })

    expect(schemas.map((schema) => schema['@type'])).toEqual(['Organization'])
  })

  it('assembles the full service page graph in a stable order', () => {
    const service = published({
      faqs: [faq()],
      seo: { description: 'Upholstery across the UAE.' },
      slug: 'sofa-upholstery',
      title: 'Sofa Upholstery',
    })

    const schemas = buildSchemas({
      breadcrumbs: buildBreadcrumbs('/sofa-upholstery/', service),
      globals,
      kind: 'service',
      path: '/sofa-upholstery/',
      record: service,
      visibleFaqs: service.faqs,
    })

    expect(schemas.map((schema) => schema['@type'])).toEqual([
      'Organization',
      'Service',
      'FAQPage',
      'BreadcrumbList',
    ])
    expect(schemas.every((schema) => schema['@context'] === SCHEMA_CONTEXT)).toBe(true)
  })
})

describe('serialisation', () => {
  it('escapes every character that could close the script element', () => {
    const serialized = serializeJsonLd([
      { '@type': 'Organization', name: 'Al <Rukn> & Sons', value: 'a</script>b' },
    ])

    expect(serialized).not.toContain('<')
    expect(serialized).not.toContain('>')
    expect(serialized).toContain('\\u003c')
    expect(serialized).toContain('\\u003e')
    expect(serialized).toContain('\\u0026')
    expect(JSON.parse(serialized)).toEqual([
      { '@type': 'Organization', name: 'Al <Rukn> & Sons', value: 'a</script>b' },
    ])
  })

  it('renders one JSON-LD script element and nothing when there is no schema', () => {
    const markup = renderToStaticMarkup(
      React.createElement(JsonLd, {
        schemas: buildSchemas({
          breadcrumbs: buildBreadcrumbs('/about-us/', null),
          globals,
          kind: 'page',
          path: '/about-us/',
        }),
      }),
    )

    expect(markup).toContain('type="application/ld+json"')
    expect(markup.match(/application\/ld\+json/g)).toHaveLength(1)
    expect(JSON.parse(markup.slice(markup.indexOf('>') + 1, markup.lastIndexOf('</script>')))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ '@type': 'Organization' }),
        expect.objectContaining({ '@type': 'BreadcrumbList' }),
      ]),
    )

    expect(renderToStaticMarkup(React.createElement(JsonLd, { schemas: [] }))).toBe('')
    expect(renderToStaticMarkup(React.createElement(JsonLd, { schemas: null }))).toBe('')
  })
})
