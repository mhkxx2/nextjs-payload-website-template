import type { Metadata } from 'next'
import { describe, expect, it } from 'vitest'

import {
  CANONICAL_ORIGIN,
  DEFAULT_TITLE_PATTERN,
  FALLBACK_SOCIAL_IMAGE,
  MAX_META_DESCRIPTION,
  PRIVATE_PATH_DISALLOW,
  buildMetadata,
  buildRobots,
  canonicalURL,
  isSameOriginCanonical,
  resolveCanonicalOrigin,
  type SeoDefaults,
  type SeoRecord,
} from '@/lib/seo'

const ORIGIN = CANONICAL_ORIGIN

const defaults = (overrides: Partial<SeoDefaults> = {}): SeoDefaults => ({
  brandName: 'Al Rukn Furniture',
  descriptionFallback: 'Upholstery and custom furniture made in Ajman.',
  path: '/',
  titlePattern: DEFAULT_TITLE_PATTERN,
  ...overrides,
})

const published = (overrides: SeoRecord = {}): SeoRecord => ({
  _status: 'published',
  publishedAt: '2026-01-05T08:00:00.000Z',
  status: 'published',
  updatedAt: '2026-02-01T08:00:00.000Z',
  ...overrides,
})

/** Read the first Open Graph image without trusting the union Next declares. */
const ogImage = (meta: Metadata): Record<string, unknown> => {
  const images = meta.openGraph?.images
  const [first] = Array.isArray(images) ? images : []

  return (first ?? {}) as Record<string, unknown>
}

const twitterImage = (meta: Metadata): unknown => {
  const images = meta.twitter?.images

  return Array.isArray(images) ? images[0] : images
}

describe('buildMetadata', () => {
  it('preserves a complete approved 180-character description across search and social metadata', () => {
    const description = 'Professional sofa upholstery in Dubai for fabric replacement, foam renewal, corner sofas, chairs and Majlis seating. Serving Dubai from our Ajman workshop. Send photos for a quote.'
    const meta = buildMetadata({ seo: { description } }, defaults({ path: '/sofa-upholstery/' }))
    expect(meta.description).toBe(description)
    expect(meta.openGraph?.description).toBe(description)
    expect(meta.twitter?.description).toBe(description)
    expect(buildMetadata({ seo: { description: 'x'.repeat(181) } }, defaults()).description).toHaveLength(180)
  })
  const cases: [string, SeoRecord, string][] = [
    [
      'service',
      published({
        seo: { description: 'Sofa repair across Ajman.', title: 'Sofa Repair' },
        slug: 'sofa-repair',
        title: 'Sofa Repair',
      }),
      '/sofa-repair/',
    ],
    [
      'post',
      published({
        seo: { description: 'How we rebuild a frame.', title: 'Rebuilding a frame' },
        slug: 'rebuilding-a-frame',
        title: 'Rebuilding a frame',
      }),
      '/blog/rebuilding-a-frame/',
    ],
    [
      'project',
      published({
        seo: { description: 'A majlis refit in Ajman.', title: 'Majlis refit' },
        slug: 'majlis-refit',
        title: 'Majlis refit',
      }),
      '/projects/majlis-refit/',
    ],
    [
      'page',
      published({
        seo: { description: 'How we handle your details.', title: 'Privacy Policy' },
        slug: 'privacy-policy',
        title: 'Privacy Policy',
      }),
      '/privacy-policy/',
    ],
  ]

  it.each(cases)(
    'produces title, description, canonical, open graph, twitter and robots for a %s record',
    (_kind, record, path) => {
      const meta = buildMetadata(record, defaults({ path }))

      expect(meta.title).toBe(`${record.title} | Al Rukn Furniture`)
      expect(meta.description).toBe((record.seo as { description: string }).description)
      expect(meta.alternates?.canonical).toBe(`${ORIGIN}${path}`)
      expect(meta.openGraph?.url).toBe(`${ORIGIN}${path}`)
      expect(meta.openGraph?.title).toBe(meta.title)
      expect(meta.openGraph?.siteName).toBe('Al Rukn Furniture')
      expect(meta.openGraph?.images).toHaveLength(1)
      expect(ogImage(meta).url).toBe(`${ORIGIN}${FALLBACK_SOCIAL_IMAGE}`)
      expect(twitterImage(meta)).toBe(`${ORIGIN}${FALLBACK_SOCIAL_IMAGE}`)
      expect((meta.twitter as { card?: string } | undefined)?.card).toBe('summary_large_image')
      expect(meta.twitter?.title).toBe(meta.title)
      expect(meta.robots).toEqual({ follow: true, index: true })
    },
  )

  it('covers routes that have no record of their own', () => {
    const meta = buildMetadata(null, defaults({ path: '/about-us/', titleFallback: 'About' }))

    expect(meta.title).toBe('About | Al Rukn Furniture')
    expect(meta.alternates?.canonical).toBe(`${ORIGIN}/about-us/`)
    expect(meta.openGraph?.images).toHaveLength(1)
    expect(meta.robots).toEqual({ follow: true, index: true })
  })

  it('honours only same-origin canonicals and otherwise falls back to the route path', () => {
    const at = (canonicalURLValue: null | string) =>
      buildMetadata(
        published({ seo: { canonicalURL: canonicalURLValue }, title: 'Custom Sofa' }),
        defaults({ path: '/custom-sofa/' }),
      )

    expect(at('/custom-sofa/').alternates?.canonical).toBe(`${ORIGIN}/custom-sofa/`)
    expect(at(`${ORIGIN}/custom-sofa/`).alternates?.canonical).toBe(`${ORIGIN}/custom-sofa/`)
    expect(at('https://evil.example/custom-sofa/').alternates?.canonical).toBe(
      `${ORIGIN}/custom-sofa/`,
    )
    expect(at('http://alruknfurniture.ae/custom-sofa/').alternates?.canonical).toBe(
      `${ORIGIN}/custom-sofa/`,
    )
    expect(at('//evil.example/custom-sofa/').alternates?.canonical).toBe(`${ORIGIN}/custom-sofa/`)
    expect(at('https://alruknfurniture.ae:8443/custom-sofa/').alternates?.canonical).toBe(
      `${ORIGIN}/custom-sofa/`,
    )
  })

  it('applies the authored title pattern and the brand from the globals', () => {
    expect(
      buildMetadata({ title: 'Majlis Furniture' }, defaults({ path: '/majlis-furniture/' })).title,
    ).toBe('Majlis Furniture | Al Rukn Furniture')

    expect(
      buildMetadata(
        { title: 'Majlis Furniture' },
        defaults({ path: '/majlis-furniture/', titlePattern: '{title} – {brand}' }),
      ).title,
    ).toBe('Majlis Furniture – Al Rukn Furniture')

    expect(
      buildMetadata({ title: 'Majlis Furniture' }, defaults({ path: '/majlis-furniture/', titlePattern: '{title}' }))
        .title,
    ).toBe('Majlis Furniture')
  })

  it('never invents a title, description or brand that the data does not contain', () => {
    const withoutBrand = buildMetadata(null, { path: '/privacy-policy/' })

    expect(withoutBrand.title).toBeUndefined()
    expect(withoutBrand.description).toBeUndefined()
    expect(withoutBrand.alternates?.canonical).toBe(`${ORIGIN}/privacy-policy/`)

    const withBrandOnly = buildMetadata(null, defaults({ path: '/privacy-policy/' }))

    expect(withBrandOnly.title).toBe('Al Rukn Furniture')
    expect(withBrandOnly.description).toBe(defaults().descriptionFallback)
  })

  it('rejects markup instead of publishing it', () => {
    const meta = buildMetadata(
      { title: '<script>alert(1)</script>' },
      defaults({ path: '/about-us/' }),
    )

    expect(meta.title).toBe('Al Rukn Furniture')
    expect(JSON.stringify(meta)).not.toContain('<script>')
  })

  it('uses the record summary, author copy and clamped fallbacks in order', () => {
    expect(
      buildMetadata({ summary: 'A majlis rebuilt in Ajman.' }, defaults({ path: '/majlis-furniture/' }))
        .description,
    ).toBe('A majlis rebuilt in Ajman.')

    expect(
      buildMetadata({ excerpt: '' }, defaults({ path: '/blog/post/' })).description,
    ).toBe(defaults().descriptionFallback)

    const long = 'a'.repeat(MAX_META_DESCRIPTION + 40)
    const clamped = buildMetadata({}, defaults({ descriptionFallback: long, path: '/' }))

    expect(clamped.description).toHaveLength(MAX_META_DESCRIPTION)
  })

  it('uses the media relation for social previews with explicit dimensions', () => {
    const meta = buildMetadata(
      {
        seo: {
          openGraphImage: {
            alt: 'Cream majlis sofa',
            height: 630,
            sizes: { og: { height: 630, url: '/media/majlis-og.webp', width: 1200 } },
            url: '/media/majlis.webp',
            width: 1200,
          },
        },
        title: 'Majlis Furniture',
      },
      defaults({ path: '/majlis-furniture/' }),
    )

    expect(ogImage(meta)).toEqual({
      alt: 'Cream majlis sofa',
      height: 630,
      url: `${ORIGIN}/media/majlis-og.webp`,
      width: 1200,
    })
  })

  it('falls back to the global social image and then to the owned card', () => {
    const fromGlobal = buildMetadata(
      { title: 'Majlis Furniture' },
      defaults({
        path: '/majlis-furniture/',
        socialImage: { alt: 'Workshop', height: 630, url: '/media/global.webp', width: 1200 },
      }),
    )

    expect(ogImage(fromGlobal).url).toBe(`${ORIGIN}/media/global.webp`)
  })

  it('forces noindex and nofollow for records that are not actually published', () => {
    const draft = buildMetadata(
      { _status: 'draft', publishedAt: '2026-01-05T08:00:00.000Z', status: 'published', title: 'Draft' },
      defaults({ path: '/draft/' }),
    )

    expect(draft.robots).toEqual({ follow: false, index: false })

    const scheduled = buildMetadata(
      {
        _status: 'published',
        publishedAt: new Date(Date.now() + 86_400_000).toISOString(),
        status: 'published',
        title: 'Scheduled',
      },
      defaults({ path: '/scheduled/' }),
    )

    expect(scheduled.robots).toEqual({ follow: false, index: false })
  })

  it('lets a record, then the globals, then the default decide index and follow', () => {
    const record = published({ seo: { index: false }, title: 'Hidden' })

    expect(buildMetadata(record, defaults({ path: '/hidden/' })).robots).toEqual({
      follow: true,
      index: false,
    })
    expect(
      buildMetadata({ title: 'Visible' }, defaults({ follow: false, index: false, path: '/x/' }))
        .robots,
    ).toEqual({ follow: false, index: false })
    expect(buildMetadata({ title: 'Visible' }, defaults({ path: '/x/' })).robots).toEqual({
      follow: true,
      index: true,
    })
  })
})

describe('canonical origin', () => {
  it('accepts the production origin and rejects anything that cannot serve it', () => {
    expect(resolveCanonicalOrigin(ORIGIN)).toBe(ORIGIN)
    expect(resolveCanonicalOrigin(`${ORIGIN}/`)).toBe(ORIGIN)
    expect(resolveCanonicalOrigin('http://alruknfurniture.ae')).toBe(ORIGIN)
    expect(resolveCanonicalOrigin('https://alruknfurniture.ae:8443')).toBe(ORIGIN)
    expect(resolveCanonicalOrigin('https://user:pass@alruknfurniture.ae')).toBe(ORIGIN)
    expect(resolveCanonicalOrigin('https://alruknfurniture.ae/?x=1')).toBe(ORIGIN)
    expect(resolveCanonicalOrigin('https://alruknfurniture.ae/#anchor')).toBe(ORIGIN)
    expect(resolveCanonicalOrigin('not a url')).toBe(ORIGIN)
    expect(resolveCanonicalOrigin('')).toBe(ORIGIN)
  })

  it('builds one canonical form per path', () => {
    expect(canonicalURL('/', ORIGIN)).toBe(`${ORIGIN}/`)
    expect(canonicalURL('', ORIGIN)).toBe(`${ORIGIN}/`)
    expect(canonicalURL('/custom-sofa', ORIGIN)).toBe(`${ORIGIN}/custom-sofa/`)
    expect(canonicalURL('/custom-sofa/', ORIGIN)).toBe(`${ORIGIN}/custom-sofa/`)
    expect(canonicalURL('/blog/page/2/?utm=x#top', ORIGIN)).toBe(`${ORIGIN}/blog/page/2/`)
    expect(canonicalURL('//projects//majlis/', ORIGIN)).toBe(`${ORIGIN}/projects/majlis/`)
  })

  it('only treats same-origin https URLs and root-relative paths as canonical', () => {
    expect(isSameOriginCanonical(`${ORIGIN}/sofa-upholstery/`, ORIGIN)).toBe(true)
    expect(isSameOriginCanonical('/sofa-upholstery/', ORIGIN)).toBe(true)
    expect(isSameOriginCanonical('//evil.example/sofa-upholstery/', ORIGIN)).toBe(false)
    expect(isSameOriginCanonical('/sofa-upholstery/?x=1', ORIGIN)).toBe(false)
    expect(isSameOriginCanonical('https://evil.example/', ORIGIN)).toBe(false)
    expect(isSameOriginCanonical(null, ORIGIN)).toBe(false)
  })
})

describe('buildRobots', () => {
  const disallowAll = { rules: [{ disallow: '/', userAgent: '*' }] }

  it('permits public pages and blocks private surfaces in production', () => {
    const robots = buildRobots({ NODE_ENV: 'production' }, ORIGIN)

    expect(robots.sitemap).toBe(`${ORIGIN}/sitemap.xml`)
    expect(robots.host).toBe(ORIGIN)

    const [rule] = Array.isArray(robots.rules) ? robots.rules : [robots.rules]

    expect(rule?.allow).toBe('/')
    expect(rule?.disallow).toEqual(expect.arrayContaining([...PRIVATE_PATH_DISALLOW]))
    expect(PRIVATE_PATH_DISALLOW).toEqual(
      expect.arrayContaining(['/admin/', '/api/', '/next/', '/graphql/', '/search/']),
    )
    expect(rule?.disallow).not.toContain('/services/')
  })

  it('disallows everything outside production or away from the production origin', () => {
    expect(buildRobots({ NODE_ENV: 'development' }, ORIGIN)).toEqual(disallowAll)
    expect(buildRobots({ NODE_ENV: 'test' }, ORIGIN)).toEqual(disallowAll)
    expect(buildRobots({ NODE_ENV: 'production' }, 'https://staging.alruknfurniture.ae')).toEqual(
      disallowAll,
    )
    expect(
      buildRobots({ NODE_ENV: 'production', VERCEL_ENV: 'preview' }, ORIGIN),
    ).toEqual(disallowAll)
    expect(buildRobots({ NODE_ENV: 'production', VERCEL_ENV: 'production' }, ORIGIN).sitemap).toBe(
      `${ORIGIN}/sitemap.xml`,
    )
  })
})

describe('ownership of routes', () => {
  it('reserves the fixed service paths, the archives and the metadata files', async () => {
    const { isApplicationOwnedPath } = await import('@/lib/routes')

    for (const owned of [
      '/',
      '/services/',
      '/projects/',
      '/blog/',
      '/about-us/',
      '/contact/',
      '/search/',
      '/sofa-upholstery/',
      '/custom-beds-headboards/',
      '/sitemap.xml',
      '/robots.txt',
    ]) {
      expect(isApplicationOwnedPath(owned), owned).toBe(true)
    }

    for (const free of ['/legacy/', '/about/', '/posts/', '/blog/old-post/', '/privacy-policy/']) {
      expect(isApplicationOwnedPath(free), free).toBe(false)
    }
  })
})

describe('robots route convention', () => {
  it('keeps the robots file at the app root, which is where Next resolves /robots.txt', async () => {
    const { existsSync } = await import('node:fs')

    // Next only matches the robots convention at the app root, so a copy inside a
    // route group is silently ignored and /robots.txt would fall through to a page.
    expect(existsSync('src/app/robots.ts')).toBe(true)
    expect(existsSync('src/app/(frontend)/robots.ts')).toBe(false)

    const { default: robots } = await import('@/app/robots')

    // The route simply publishes the policy: outside production that is "disallow all".
    expect(robots()).toEqual({ rules: [{ disallow: '/', userAgent: '*' }] })
  })
})
