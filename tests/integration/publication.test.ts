// @vitest-environment node

import type { Payload } from 'payload'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { canonicalPath } from '@/lib/routes'

import { type IsolatedPayload, startIsolatedPayload } from './testPayload'

const cacheMocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('next/cache', () => cacheMocks)

import { revalidateContent } from '@/hooks/revalidateContent'

const lexicalDocument = {
  root: {
    children: [
      {
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: 'Article', type: 'text', version: 1 }],
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

let isolatedPayload: IsolatedPayload
let payload: Payload

beforeAll(async () => {
  isolatedPayload = await startIsolatedPayload('t6_publication')
  payload = isolatedPayload.payload
}, 90_000)

afterAll(async () => {
  await isolatedPayload?.destroy()
}, 90_000)

beforeEach(() => {
  cacheMocks.revalidatePath.mockReset()
  cacheMocks.revalidateTag.mockReset()
})

describe('Task 6 public Local API publication contract', () => {
  it('applies access with overrideAccess:false and omits drafts and future schedules', async () => {
    const token = Date.now().toString(36)
    const now = Date.now()
    const records = [
      { publishedAt: new Date(now - 60_000).toISOString(), slug: `live-${token}`, status: 'published' },
      { publishedAt: new Date(now - 60_000).toISOString(), slug: `draft-${token}`, status: 'draft' },
      { publishedAt: new Date(now + 86_400_000).toISOString(), slug: `future-${token}`, status: 'published' },
    ] as const

    for (const record of records) {
      await payload.create({
        collection: 'projects',
        context: { disableRevalidate: true },
        data: {
          ...record,
          seo: { canonicalURL: `https://alruknfurniture.ae/projects/${record.slug}/` },
          title: record.slug,
        },
        draft: record.status === 'draft',
        overrideAccess: true,
      })
    }

    const result = await payload.find({
      collection: 'projects',
      depth: 0,
      overrideAccess: false,
      pagination: false,
      where: { slug: { in: records.map(({ slug }) => slug) } },
    })

    expect(result.docs.map(({ slug }) => slug)).toEqual([`live-${token}`])
  })

  it('enforces publication dates for published records while allowing valid future schedules', async () => {
    const token = Date.now().toString(36)
    await expect(
      payload.create({
        collection: 'projects',
        context: { disableRevalidate: true },
        data: {
          seo: { canonicalURL: `https://alruknfurniture.ae/projects/missing-date-${token}/` },
          slug: `missing-date-${token}`,
          status: 'published',
          title: 'Missing publication date',
        },
        draft: false,
        overrideAccess: true,
      }),
    ).rejects.toThrow(/publication date/i)

    const scheduled = await payload.create({
      collection: 'projects',
      context: { disableRevalidate: true },
      data: {
        publishedAt: new Date(Date.now() + 86_400_000).toISOString(),
        seo: { canonicalURL: `https://alruknfurniture.ae/projects/scheduled-${token}/` },
        slug: `scheduled-${token}`,
        status: 'published',
        title: 'Scheduled publication',
      },
      draft: false,
      overrideAccess: true,
    })
    expect(scheduled.publishedAt).toEqual(expect.any(String))
  })

  it('uses the publication predicate on every public content collection', async () => {
    const contentSlugs = ['services', 'projects', 'posts', 'pages'] as const
    for (const collection of contentSlugs) {
      expect(payload.config.collections.find(({ slug }) => slug === collection)?.access?.read).toEqual(
        expect.any(Function),
      )
    }

    const token = Date.now().toString(36)
    const post = await payload.create({
      collection: 'posts',
      context: { disableRevalidate: true },
      data: {
        content: lexicalDocument,
        excerpt: 'Private draft excerpt',
        seo: { canonicalURL: `https://alruknfurniture.ae/blog/private-post-${token}/` },
        slug: `private-post-${token}`,
        status: 'draft',
        title: 'Private draft',
      },
      draft: true,
      overrideAccess: true,
    })

    await expect(
      payload.findByID({ collection: 'posts', id: post.id, overrideAccess: false }),
    ).rejects.toThrow()
  })
})

describe('precise content cache invalidation', () => {
  const logger = { info: vi.fn() }

  it('invalidates current and former project paths, index, featured homepage, related service, and sitemap', async () => {
    const find = vi.fn().mockResolvedValue({
      docs: [{ id: 41, publishedAt: '2026-01-01T00:00:00.000Z', slug: 'custom-sofa', status: 'published' }],
    })

    await revalidateContent({
      collection: 'projects',
      doc: {
        featured: true,
        id: 7,
        publishedAt: '2026-01-01T00:00:00.000Z',
        service: 41,
        slug: 'new-project',
        status: 'published',
      },
      operation: 'change',
      previousDoc: {
        featured: false,
        id: 7,
        publishedAt: '2026-01-01T00:00:00.000Z',
        service: 41,
        slug: 'old-project',
        status: 'published',
      },
      req: { context: {}, payload: { find, logger } },
    })

    expect(new Set(cacheMocks.revalidatePath.mock.calls.map(([path]) => path))).toEqual(
      new Set([
        canonicalPath('project', 'new-project'),
        canonicalPath('project', 'old-project'),
        '/projects/',
        '/',
        canonicalPath('service', 'custom-sofa'),
      ]),
    )
    expect(cacheMocks.revalidateTag).toHaveBeenCalledWith('sitemap', 'max')
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'services',
        depth: 0,
        overrideAccess: true,
        where: expect.objectContaining({ and: expect.any(Array) }),
      }),
    )
    expect(JSON.stringify(find.mock.calls)).toContain('publishedAt')
    expect(JSON.stringify(find.mock.calls)).toContain('status')
  })

  it('invalidates the former canonical path and index when unpublished', async () => {
    await revalidateContent({
      collection: 'posts',
      doc: { id: 9, slug: 'article', status: 'draft' },
      operation: 'change',
      previousDoc: {
        id: 9,
        publishedAt: '2026-01-01T00:00:00.000Z',
        slug: 'article',
        status: 'published',
      },
      req: { context: {}, payload: { find: vi.fn(), logger } },
    })

    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith(canonicalPath('post', 'article'))
    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/blog/')
    expect(cacheMocks.revalidateTag).toHaveBeenCalledWith('sitemap', 'max')
  })

  it('invalidates published delete paths, affected indexes, featured homepage, and related records', async () => {
    const find = vi
      .fn()
      .mockResolvedValueOnce({ docs: [{ id: 23, slug: 'villa-majlis' }] })
      .mockResolvedValueOnce({ docs: [{ id: 12, slug: 'custom-beds-headboards' }] })
    await revalidateContent({
      collection: 'services',
      doc: {
        featured: true,
        id: 11,
        projects: [{ id: 23, slug: 'villa-majlis' }],
        publishedAt: '2026-01-01T00:00:00.000Z',
        relatedServices: [{ id: 12, slug: 'custom-beds-headboards' }],
        slug: 'majlis-furniture',
        status: 'published',
      },
      operation: 'delete',
      req: { context: {}, payload: { find, logger } },
    })

    expect(new Set(cacheMocks.revalidatePath.mock.calls.map(([path]) => path))).toEqual(
      new Set([
        canonicalPath('service', 'majlis-furniture'),
        '/services/',
        '/',
        canonicalPath('project', 'villa-majlis'),
        canonicalPath('service', 'custom-beds-headboards'),
      ]),
    )
    expect(find).toHaveBeenCalledTimes(2)
    expect(cacheMocks.revalidateTag).toHaveBeenCalledWith('sitemap', 'max')
  })

  it('does nothing when revalidation is explicitly disabled', async () => {
    const find = vi.fn()
    await revalidateContent({
      collection: 'pages',
      doc: {
        id: 1,
        publishedAt: '2026-01-01T00:00:00.000Z',
        slug: 'company',
        status: 'published',
      },
      operation: 'change',
      req: { context: { disableRevalidate: true }, payload: { find, logger } },
    })
    expect(cacheMocks.revalidatePath).not.toHaveBeenCalled()
    expect(cacheMocks.revalidateTag).not.toHaveBeenCalled()
    expect(find).not.toHaveBeenCalled()
  })
})
