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
      {
        _status: 'published',
        publishedAt: new Date(now - 60_000).toISOString(),
        slug: `live-${token}`,
        status: 'published',
      },
      {
        _status: 'draft',
        publishedAt: new Date(now - 60_000).toISOString(),
        slug: `draft-${token}`,
        status: 'draft',
      },
      {
        _status: 'published',
        publishedAt: new Date(now + 86_400_000).toISOString(),
        slug: `future-${token}`,
        status: 'published',
      },
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

  it('omits Payload draft revisions even when custom publication fields look public', async () => {
    const token = Date.now().toString(36)
    const slug = `payload-draft-${token}`
    await payload.create({
      collection: 'projects',
      context: { disableRevalidate: true },
      data: {
        publishedAt: new Date(Date.now() - 60_000).toISOString(),
        seo: { canonicalURL: `https://alruknfurniture.ae/projects/${slug}/` },
        slug,
        status: 'published',
        title: 'Payload draft with public custom state',
      },
      draft: true,
      overrideAccess: true,
    })

    const result = await payload.find({
      collection: 'projects',
      depth: 0,
      overrideAccess: false,
      pagination: false,
      where: { slug: { equals: slug } },
    })

    expect(result.docs).toHaveLength(0)
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
      docs: [
        {
          _status: 'published',
          id: 41,
          publishedAt: '2026-01-01T00:00:00.000Z',
          slug: 'custom-sofa',
          status: 'published',
        },
      ],
    })

    await revalidateContent({
      collection: 'projects',
      doc: {
        _status: 'published',
        featured: true,
        id: 7,
        publishedAt: '2026-01-01T00:00:00.000Z',
        service: 41,
        slug: 'new-project',
        status: 'published',
      },
      operation: 'change',
      previousDoc: {
        _status: 'published',
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

  it('invalidates populated Header and Footer service relationship caches after public Service changes', async () => {
    await revalidateContent({
      collection: 'services',
      doc: {
        _status: 'published',
        id: 41,
        publishedAt: '2026-01-01T00:00:00.000Z',
        slug: 'custom-sofa',
        status: 'published',
        title: 'Updated public title',
      },
      operation: 'change',
      previousDoc: {
        _status: 'published',
        id: 41,
        publishedAt: '2026-01-01T00:00:00.000Z',
        slug: 'custom-sofa',
        status: 'published',
        title: 'Old public title',
      },
      req: { context: {}, payload: { find: vi.fn().mockResolvedValue({ docs: [] }), logger } },
    })

    expect(cacheMocks.revalidateTag).toHaveBeenCalledWith('collection_services', 'max')
  })

  it('does not invalidate public caches for a Payload draft with public custom fields', async () => {
    const find = vi.fn()
    await revalidateContent({
      collection: 'projects',
      doc: {
        _status: 'draft',
        featured: true,
        id: 8,
        publishedAt: '2026-01-01T00:00:00.000Z',
        slug: 'payload-draft',
        status: 'published',
      },
      operation: 'change',
      req: { context: {}, payload: { find, logger } },
    })

    expect(cacheMocks.revalidatePath).not.toHaveBeenCalled()
    expect(cacheMocks.revalidateTag).not.toHaveBeenCalled()
    expect(find).not.toHaveBeenCalled()
  })

  it.each([
    {
      doc: {
        _status: 'published',
        id: 10,
        publishedAt: '2026-01-01T00:00:00.000Z',
        slug: 'home',
        status: 'published',
      },
      label: 'published change',
      operation: 'change',
      previousDoc: {
        _status: 'published',
        id: 10,
        publishedAt: '2026-01-01T00:00:00.000Z',
        slug: 'home',
        status: 'published',
      },
      paths: ['/'],
    },
    {
      doc: {
        _status: 'published',
        id: 10,
        publishedAt: '2026-01-01T00:00:00.000Z',
        slug: 'company',
        status: 'published',
      },
      label: 'rename away from home',
      operation: 'change',
      previousDoc: {
        _status: 'published',
        id: 10,
        publishedAt: '2026-01-01T00:00:00.000Z',
        slug: 'home',
        status: 'published',
      },
      paths: ['/', '/company/'],
    },
    {
      doc: { _status: 'draft', id: 10, slug: 'home', status: 'draft' },
      label: 'unpublish',
      operation: 'change',
      previousDoc: {
        _status: 'published',
        id: 10,
        publishedAt: '2026-01-01T00:00:00.000Z',
        slug: 'home',
        status: 'published',
      },
      paths: ['/'],
    },
    {
      doc: {
        _status: 'published',
        id: 10,
        publishedAt: '2026-01-01T00:00:00.000Z',
        slug: 'home',
        status: 'published',
      },
      label: 'delete',
      operation: 'delete',
      previousDoc: undefined,
      paths: ['/'],
    },
  ] as const)('invalidates the real homepage on Page home $label', async ({ doc, operation, paths, previousDoc }) => {
    await revalidateContent({
      collection: 'pages',
      doc,
      operation,
      previousDoc,
      req: { context: {}, payload: { find: vi.fn(), logger } },
    })

    expect(new Set(cacheMocks.revalidatePath.mock.calls.map(([path]) => path))).toEqual(new Set(paths))
    expect(cacheMocks.revalidatePath).not.toHaveBeenCalledWith('/home/')
  })

  it('invalidates the former canonical path and index when unpublished', async () => {
    await revalidateContent({
      collection: 'posts',
      doc: { id: 9, slug: 'article', status: 'draft' },
      operation: 'change',
      previousDoc: {
        _status: 'published',
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
      .mockResolvedValueOnce({
        docs: [
          {
            _status: 'published',
            id: 23,
            publishedAt: '2026-01-01T00:00:00.000Z',
            slug: 'villa-majlis',
            status: 'published',
          },
        ],
      })
      .mockResolvedValueOnce({
        docs: [
          {
            _status: 'published',
            id: 12,
            publishedAt: '2026-01-01T00:00:00.000Z',
            slug: 'custom-beds-headboards',
            status: 'published',
          },
        ],
      })
    await revalidateContent({
      collection: 'services',
      doc: {
        _status: 'published',
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
