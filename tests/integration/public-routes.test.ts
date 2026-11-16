// @vitest-environment node

import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { FIXED_SERVICE_SLUGS, RESERVED_EXACT_ROUTES, canonicalPath } from '@/lib/routes'
import { validatePageSlug } from '@/lib/slug'

import { type IsolatedPayload, startIsolatedPayload } from './testPayload'

let isolatedPayload: IsolatedPayload
let payload: Payload

beforeAll(async () => {
  isolatedPayload = await startIsolatedPayload('t12_public_routes')
  payload = isolatedPayload.payload
}, 90_000)

afterAll(async () => {
  await isolatedPayload?.destroy()
}, 90_000)

describe('Task 12 public route contract & publication filtering', () => {
  it('defines canonical paths for all nine fixed service slugs', () => {
    expect(FIXED_SERVICE_SLUGS).toHaveLength(9)
    for (const serviceSlug of FIXED_SERVICE_SLUGS) {
      expect(canonicalPath('service', serviceSlug)).toBe(`/${serviceSlug}/`)
    }
  })

  it('rejects reserved exact routes and generic service paths from dynamic page slugs', () => {
    const prohibited = [
      ...RESERVED_EXACT_ROUTES,
      'services',
      'services/sofa-upholstery',
      'services/custom-wardrobes',
      'admin',
      'api',
      'projects',
      'blog',
      'about-us',
      'contact',
    ]

    for (const slug of prohibited) {
      expect(validatePageSlug(slug)).not.toBe(true)
    }
  })

  it('queries only published service documents for all fixed service routes', async () => {
    await payload.create({
      collection: 'services',
      context: { disableRevalidate: true },
      data: {
        _status: 'published',
        title: 'Sofa Upholstery Service',
        slug: 'sofa-upholstery',
        status: 'published',
        publishedAt: new Date(Date.now() - 60_000).toISOString(),
        seo: { canonicalURL: 'https://alruknfurniture.ae/sofa-upholstery/' },
        hero: { heading: 'Expert Sofa Upholstery' },
      },
      draft: false,
      overrideAccess: true,
    })

    await payload.create({
      collection: 'services',
      context: { disableRevalidate: true },
      data: {
        _status: 'draft',
        title: 'Draft Custom Sofa',
        slug: 'custom-sofa',
        status: 'draft',
        publishedAt: new Date(Date.now() - 60_000).toISOString(),
        seo: { canonicalURL: 'https://alruknfurniture.ae/custom-sofa/' },
      },
      draft: true,
      overrideAccess: true,
    })

    const pubSofa = await payload.find({
      collection: 'services',
      overrideAccess: false,
      where: { slug: { equals: 'sofa-upholstery' } },
    })
    expect(pubSofa.docs).toHaveLength(1)
    expect(pubSofa.docs[0]?.title).toBe('Sofa Upholstery Service')

    const pubDraft = await payload.find({
      collection: 'services',
      overrideAccess: false,
      where: { slug: { equals: 'custom-sofa' } },
    })
    expect(pubDraft.docs).toHaveLength(0)
  })

  it('queries only published projects for project detail and archive', async () => {
    const token = Date.now().toString(36)
    const pubSlug = `pub-proj-${token}`
    const draftSlug = `draft-proj-${token}`

    await payload.create({
      collection: 'projects',
      context: { disableRevalidate: true },
      data: {
        _status: 'published',
        title: 'Published Luxury Majlis',
        slug: pubSlug,
        status: 'published',
        publishedAt: new Date(Date.now() - 60_000).toISOString(),
        seo: { canonicalURL: `https://alruknfurniture.ae/projects/${pubSlug}/` },
      },
      draft: false,
      overrideAccess: true,
    })

    await payload.create({
      collection: 'projects',
      context: { disableRevalidate: true },
      data: {
        _status: 'draft',
        title: 'Draft Project',
        slug: draftSlug,
        status: 'draft',
        publishedAt: new Date(Date.now() - 60_000).toISOString(),
        seo: { canonicalURL: `https://alruknfurniture.ae/projects/${draftSlug}/` },
      },
      draft: true,
      overrideAccess: true,
    })

    const pubRes = await payload.find({
      collection: 'projects',
      overrideAccess: false,
      where: { slug: { equals: pubSlug } },
    })
    expect(pubRes.docs).toHaveLength(1)

    const draftRes = await payload.find({
      collection: 'projects',
      overrideAccess: false,
      where: { slug: { equals: draftSlug } },
    })
    expect(draftRes.docs).toHaveLength(0)
  })

  it('queries only published blog posts for post detail and archive', async () => {
    const token = Date.now().toString(36)
    const pubSlug = `pub-post-${token}`
    const draftSlug = `draft-post-${token}`

    const lexicalContent = {
      root: {
        children: [
          {
            children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: 'Post content', type: 'text', version: 1 }],
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

    await payload.create({
      collection: 'posts',
      context: { disableRevalidate: true },
      data: {
        _status: 'published',
        title: 'Published Post',
        slug: pubSlug,
        status: 'published',
        publishedAt: new Date(Date.now() - 60_000).toISOString(),
        excerpt: 'A published post excerpt for testing.',
        content: lexicalContent,
        seo: { canonicalURL: `https://alruknfurniture.ae/blog/${pubSlug}/` },
      },
      draft: false,
      overrideAccess: true,
    })

    await payload.create({
      collection: 'posts',
      context: { disableRevalidate: true },
      data: {
        _status: 'draft',
        title: 'Draft Post',
        slug: draftSlug,
        status: 'draft',
        publishedAt: new Date(Date.now() - 60_000).toISOString(),
        excerpt: 'A draft post excerpt for testing.',
        content: lexicalContent,
        seo: { canonicalURL: `https://alruknfurniture.ae/blog/${draftSlug}/` },
      },
      draft: true,
      overrideAccess: true,
    })

    const pubRes = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      where: { slug: { equals: pubSlug } },
    })
    expect(pubRes.docs).toHaveLength(1)

    const draftRes = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      where: { slug: { equals: draftSlug } },
    })
    expect(draftRes.docs).toHaveLength(0)
  })
})
