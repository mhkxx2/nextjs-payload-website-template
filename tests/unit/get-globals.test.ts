import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  findGlobal: vi.fn(),
  unstableCache: vi.fn((fn: () => unknown) => fn),
}))

vi.mock('payload', async (importOriginal) => {
  const actual = await importOriginal<typeof import('payload')>()
  return { ...actual, getPayload: vi.fn(async () => ({ findGlobal: mocks.findGlobal })) }
})
vi.mock('@payload-config', () => ({ default: Promise.resolve({}) }))
vi.mock('next/cache', () => ({ unstable_cache: mocks.unstableCache }))

import { getCachedGlobal } from '@/utilities/getGlobals'

describe('public cached global reads', () => {
  beforeEach(() => {
    mocks.findGlobal.mockReset()
    mocks.unstableCache.mockClear()
  })

  it('enforces access, safe global selects, and minimal Service population', async () => {
    mocks.findGlobal.mockResolvedValue({
      serviceLinks: [
        {
          label: 'Good',
          service: {
            id: 1,
            title: 'Custom Sofa',
            slug: 'custom-sofa',
            status: 'published',
            _status: 'published',
            publishedAt: '2026-01-01T00:00:00.000Z',
            details: 'must not survive',
          },
        },
        {
          label: 'Draft',
          service: {
            id: 2,
            title: 'Draft',
            slug: 'sofa-repair',
            status: 'draft',
            _status: 'draft',
            publishedAt: '2026-01-01T00:00:00.000Z',
          },
        },
        { label: 'Unresolved', service: 3 },
        { label: 'Malformed', service: { id: 4, slug: '../admin', title: 'Bad' } },
      ],
    })

    const result = await getCachedGlobal('header', 1)()
    expect(mocks.findGlobal).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'header',
        depth: 1,
        overrideAccess: false,
        select: expect.objectContaining({ serviceLinks: expect.anything() }),
        populate: {
          services: {
            id: true,
            title: true,
            slug: true,
            status: true,
            publishedAt: true,
            _status: true,
          },
        },
      }),
    )
    expect(result.serviceLinks).toEqual([
      { label: 'Good', service: { id: 1, title: 'Custom Sofa', slug: 'custom-sofa' } },
    ])
    expect(mocks.unstableCache).toHaveBeenCalledWith(expect.any(Function), ['header', '1'], expect.objectContaining({
      tags: ['global_header', 'collection_services'],
    }))
  })

  it('uses a safe select and access enforcement for missing non-relational globals', async () => {
    mocks.findGlobal.mockResolvedValue({})
    await expect(getCachedGlobal('social-media', 0)()).resolves.toEqual({ links: [] })
    expect(mocks.findGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'social-media', depth: 0, overrideAccess: false, select: { links: true } }),
    )
  })
})
