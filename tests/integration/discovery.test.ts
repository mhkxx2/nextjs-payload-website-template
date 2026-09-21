// @vitest-environment node

import type { NextRequest } from 'next/server'
import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { FIXED_SERVICE_SLUGS, isApplicationOwnedPath } from '@/lib/routes'
import { DEFAULT_TITLE_PATTERN, buildMetadata, getSeoDefaults, getSitemapEntries } from '@/lib/seo'

import { type IsolatedPayload, startIsolatedPayload } from './testPayload'

const cacheMocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (fn: unknown) => fn,
}))

vi.mock('next/cache', () => cacheMocks)

/** The middleware reads its records through this helper; the test feeds it real rows. */
const redirectState = vi.hoisted(() => ({ records: [] as unknown[] }))

vi.mock('@/utilities/getRedirects', () => ({
  getCachedRedirects: () => async () => redirectState.records,
}))

const ORIGIN = 'https://alruknfurniture.ae'
const token = `d16${Date.now().toString(36)}`
const past = new Date(Date.now() - 3_600_000).toISOString()
const future = new Date(Date.now() + 86_400_000).toISOString()
/** The draft service: its route renders a 404, so it must never be advertised. */
const DRAFT_SERVICE = 'majlis-furniture'

let isolated: IsolatedPayload
let payload: Payload

beforeAll(async () => {
  isolated = await startIsolatedPayload('t16_discovery')
  payload = isolated.payload
}, 120_000)

afterAll(async () => {
  await isolated?.destroy()
}, 120_000)

const create = (collection: 'pages' | 'posts' | 'projects' | 'services', data: Record<string, unknown>) =>
  payload.create({
    collection,
    context: { disableRevalidate: true },
    data: data as never,
    draft: data._status === 'draft',
    overrideAccess: true,
  })

const textBlock = {
  blockType: 'faqs',
  enableSchema: false,
  faqs: [],
  heading: 'Questions',
}

/** Minimal valid Lexical document for the required post body. */
const body = {
  root: {
    children: [
      {
        children: [
          { detail: 0, format: 0, mode: 'normal', style: '', text: 'Article', type: 'text', version: 1 },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'root',
    version: 1,
  },
}

const urlsOf = async (now = new Date()) => {
  const entries = await getSitemapEntries(payload, { now, origin: ORIGIN })

  return { entries, urls: new Set(entries.map((entry) => entry.url)) }
}

describe('Task 16 sitemap contract', () => {
  it('lists the canonical indexable published URLs and nothing else', async () => {
    for (const slug of FIXED_SERVICE_SLUGS) {
      if (slug === DRAFT_SERVICE || slug === 'office-furniture') continue

      await create('services', {
        _status: 'published',
        publishedAt: past,
        seo: { canonicalURL: `${ORIGIN}/${slug}/` },
        slug,
        status: 'published',
        title: `Service ${slug}`,
      })
    }

    // A fixed service whose record is still a draft has no public page at all.
    await create('services', {
      _status: 'draft',
      publishedAt: past,
      seo: { canonicalURL: `${ORIGIN}/${DRAFT_SERVICE}/` },
      slug: DRAFT_SERVICE,
      status: 'draft',
      title: 'Majlis furniture',
    })

    await create('services', {
      _status: 'published',
      publishedAt: past,
      seo: { canonicalURL: `${ORIGIN}/office-furniture/`, index: false },
      slug: 'office-furniture',
      status: 'published',
      title: 'Office furniture',
    })

    await create('projects', {
      _status: 'published',
      publishedAt: past,
      seo: { canonicalURL: `${ORIGIN}/projects/majlis-refit-${token}/` },
      slug: `majlis-refit-${token}`,
      status: 'published',
      title: 'Majlis refit',
    })
    await create('projects', {
      _status: 'draft',
      seo: { canonicalURL: `${ORIGIN}/projects/draft-${token}/` },
      slug: `draft-${token}`,
      status: 'draft',
      title: 'Draft project',
    })
    await create('projects', {
      _status: 'published',
      publishedAt: future,
      seo: { canonicalURL: `${ORIGIN}/projects/scheduled-${token}/` },
      slug: `scheduled-${token}`,
      status: 'published',
      title: 'Scheduled project',
    })
    await create('projects', {
      _status: 'published',
      publishedAt: past,
      seo: { canonicalURL: `${ORIGIN}/projects/hidden-${token}/`, index: false },
      slug: `hidden-${token}`,
      status: 'published',
      title: 'Hidden project',
    })

    await create('posts', {
      _status: 'published',
      content: body,
      excerpt: 'How we rebuild a frame.',
      publishedAt: past,
      seo: { canonicalURL: `${ORIGIN}/blog/rebuilding-${token}/` },
      slug: `rebuilding-${token}`,
      status: 'published',
      title: 'Rebuilding a frame',
    })
    await create('posts', {
      _status: 'draft',
      content: body,
      excerpt: 'Not published yet.',
      seo: { canonicalURL: `${ORIGIN}/blog/draft-${token}/` },
      slug: `draft-post-${token}`,
      status: 'draft',
      title: 'Draft post',
    })

    await create('pages', {
      _status: 'published',
      layout: [textBlock],
      publishedAt: past,
      seo: { canonicalURL: `${ORIGIN}/workshop-visit-${token}/` },
      slug: `workshop-visit-${token}`,
      status: 'published',
      title: 'Workshop visit',
    })
    await create('pages', {
      _status: 'published',
      layout: [textBlock],
      publishedAt: past,
      seo: { canonicalURL: `${ORIGIN}/` },
      slug: 'home',
      status: 'published',
      title: 'Home',
    })
    await create('pages', {
      _status: 'published',
      layout: [textBlock],
      publishedAt: past,
      seo: { canonicalURL: `${ORIGIN}/hidden-page-${token}/`, index: false },
      slug: `hidden-page-${token}`,
      status: 'published',
      title: 'Hidden page',
    })
    await create('pages', {
      _status: 'draft',
      layout: [textBlock],
      seo: { canonicalURL: `${ORIGIN}/draft-page-${token}/` },
      slug: `draft-page-${token}`,
      status: 'draft',
      title: 'Draft page',
    })

    const { entries, urls } = await urlsOf()

    // Structural routes the application always renders.
    for (const path of ['/', '/services/', '/projects/', '/blog/', '/about-us/', '/contact/']) {
      expect(urls.has(`${ORIGIN}${path}`), path).toBe(true)
    }

    // Every published fixed service except the noindex one.
    for (const slug of FIXED_SERVICE_SLUGS) {
      const expected = `${ORIGIN}/${slug}/`

      if (slug === DRAFT_SERVICE || slug === 'office-furniture') {
        expect(urls.has(expected), expected).toBe(false)
      } else {
        expect(urls.has(expected), expected).toBe(true)
      }
    }

    expect(urls.has(`${ORIGIN}/projects/majlis-refit-${token}/`)).toBe(true)
    expect(urls.has(`${ORIGIN}/blog/rebuilding-${token}/`)).toBe(true)
    expect(urls.has(`${ORIGIN}/workshop-visit-${token}/`)).toBe(true)

    for (const absent of [
      `${ORIGIN}/home/`,
      `${ORIGIN}/projects/draft-${token}/`,
      `${ORIGIN}/projects/scheduled-${token}/`,
      `${ORIGIN}/projects/hidden-${token}/`,
      `${ORIGIN}/blog/draft-post-${token}/`,
      `${ORIGIN}/hidden-page-${token}/`,
      `${ORIGIN}/draft-page-${token}/`,
      `${ORIGIN}/services/office-furniture/`,
      `${ORIGIN}/posts/`,
      `${ORIGIN}/search/`,
    ]) {
      expect(urls.has(absent), absent).toBe(false)
    }

    // Nothing private, uncanonical or duplicated ever reaches the sitemap.
    expect(entries.map((entry) => entry.url)).toEqual([...urls])
    for (const entry of entries) {
      expect(entry.url).toMatch(new RegExp(`^${ORIGIN}/`))
      expect(entry.url.slice(ORIGIN.length)).not.toMatch(/\/\/|\?|#|%/)
      expect(entry.url.slice(ORIGIN.length)).not.toMatch(/\/(admin|api|graphql|internal|next)\//)
      expect(entry.url.slice(ORIGIN.length) === '/' || entry.url.endsWith('/')).toBe(true)
    }

    const published = entries.find((entry) => entry.url === `${ORIGIN}/projects/majlis-refit-${token}/`)

    expect(published?.lastModified).toEqual(expect.any(String))
    expect(new Date(published?.lastModified ?? '').toString()).not.toBe('Invalid Date')
  })

  it('answers the same sitemap for the same data', async () => {
    const now = new Date()
    const first = await getSitemapEntries(payload, { now, origin: ORIGIN })
    const second = await getSitemapEntries(payload, { now, origin: ORIGIN })

    expect(second).toEqual(first)
  })

  it('empties the sitemap when the site itself is set to noindex', async () => {
    await payload.updateGlobal({
      data: { index: false },
      overrideAccess: true,
      slug: 'seo-defaults',
    })

    expect(await getSitemapEntries(payload, { origin: ORIGIN })).toEqual([])

    await payload.updateGlobal({
      data: { index: true },
      overrideAccess: true,
      slug: 'seo-defaults',
    })

    expect((await getSitemapEntries(payload, { origin: ORIGIN })).length).toBeGreaterThan(0)
  })
})

describe('Task 16 metadata defaults from the globals', () => {
  it('uses the same origin, pattern and copy the editors control', async () => {
    const before = await getSeoDefaults()

    expect(before.titlePattern).toBe(DEFAULT_TITLE_PATTERN)
    expect(buildMetadata(null, { ...before, path: '/about-us/', titleFallback: 'About' }).title).toBe(
      'About',
    )
    expect(
      buildMetadata(null, { ...before, path: '/about-us/', titleFallback: 'About' }).description,
    ).toBeUndefined()

    await payload.updateGlobal({
      data: {
        brandName: 'Al Rukn Furniture',
        businessName: 'Al Rukn Furniture Upholstery',
        canonicalSiteURL: ORIGIN,
        locale: { defaultLocale: 'en', direction: 'ltr' },
      },
      overrideAccess: true,
      slug: 'site-settings',
    })
    await payload.updateGlobal({
      data: {
        fallbackDescription: 'Upholstery and custom furniture made in Ajman.',
        titlePattern: '{title} :: {brand}',
      },
      overrideAccess: true,
      slug: 'seo-defaults',
    })

    const after = await getSeoDefaults()

    expect(after.brandName).toBe('Al Rukn Furniture')
    expect(after.descriptionFallback).toBe('Upholstery and custom furniture made in Ajman.')

    const meta = buildMetadata(null, { ...after, path: '/about-us/', titleFallback: 'About' })

    expect(meta.title).toBe('About :: Al Rukn Furniture')
    expect(meta.description).toBe('Upholstery and custom furniture made in Ajman.')
    expect(meta.alternates?.canonical).toBe(`${ORIGIN}/about-us/`)
    expect(meta.robots).toEqual({ follow: true, index: true })
  })
})

describe('Task 16 redirects and the routes the application owns', () => {
  it('answers with the persisted status and never chains or supersedes app routes', async () => {
    await payload.create({
      collection: 'redirects',
      context: { disableRevalidate: true },
      data: {
        active: true,
        destination: `/permanent-${token}/`,
        source: `/legacy-${token}/`,
        type: 301 as const,
      },
      overrideAccess: true,
    })
    await payload.create({
      collection: 'redirects',
      context: { disableRevalidate: true },
      data: {
        active: true,
        destination: `/temporary-${token}/`,
        source: `/campaign-${token}/`,
        type: 302 as const,
      },
      overrideAccess: true,
    })
    // An editor can save this, but it must never take over a fixed service page.
    await payload.create({
      collection: 'redirects',
      context: { disableRevalidate: true },
      data: {
        active: true,
        destination: `/permanent-${token}/`,
        source: '/custom-sofa/',
        type: 301 as const,
      },
      overrideAccess: true,
    })

    const stored = await payload.find({
      collection: 'redirects',
      limit: 100,
      overrideAccess: true,
      pagination: false,
    })

    expect(stored.docs.map((doc) => doc.source)).toEqual(
      expect.arrayContaining([`/legacy-${token}/`, `/campaign-${token}/`, '/custom-sofa/']),
    )

    redirectState.records = stored.docs.map((doc) => ({
      active: doc.active,
      destination: doc.destination,
      id: doc.id,
      source: doc.source,
      type: doc.type,
    }))

    const { proxy } = await import('@/proxy')

    const permanent = await proxy(new Request(`${ORIGIN}/legacy-${token}/`) as NextRequest)

    expect(permanent.status).toBe(301)
    expect(permanent.headers.get('location')).toBe(`${ORIGIN}/permanent-${token}/`)

    const temporary = await proxy(new Request(`${ORIGIN}/campaign-${token}/`) as NextRequest)

    expect(temporary.status).toBe(302)
    expect(temporary.headers.get('location')).toBe(`${ORIGIN}/temporary-${token}/`)

    // Deterministic: the same request always produces the same answer.
    const again = await proxy(new Request(`${ORIGIN}/legacy-${token}/`) as NextRequest)

    expect(again.status).toBe(permanent.status)
    expect(again.headers.get('location')).toBe(permanent.headers.get('location'))

    // Application-owned routes are never redirected, whatever the CMS holds.
    for (const owned of ['/custom-sofa/', '/services/', '/blog/', '/about-us/', '/robots.txt']) {
      expect(isApplicationOwnedPath(owned), owned).toBe(true)

      const response = await proxy(new Request(`${ORIGIN}${owned}`) as NextRequest)

      expect(response.status, owned).toBe(200)
      expect(response.headers.get('location'), owned).toBeNull()
    }

  })
})
