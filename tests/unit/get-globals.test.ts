import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  draftEnabled: false,
  draftMode: vi.fn(),
  findGlobal: vi.fn(),
  unstableCache: vi.fn((fn: () => unknown) => fn),
}))

vi.mock('payload', async (importOriginal) => {
  const actual = await importOriginal<typeof import('payload')>()
  return { ...actual, getPayload: vi.fn(async () => ({ findGlobal: mocks.findGlobal })) }
})
vi.mock('@payload-config', () => ({ default: Promise.resolve({}) }))
vi.mock('next/cache', () => ({ unstable_cache: mocks.unstableCache }))
vi.mock('next/headers', () => ({
  draftMode: mocks.draftMode,
}))

import { getCachedGlobal } from '@/utilities/getGlobals'

describe('public cached global reads', () => {
  beforeEach(() => {
    mocks.draftEnabled = false
    mocks.draftMode.mockReset()
    mocks.draftMode.mockImplementation(async () => ({ isEnabled: mocks.draftEnabled }))
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
        draft: false,
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
      tags: ['global:header', 'collection:services'],
    }))
  })

  it('uses a safe select and access enforcement for missing non-relational globals', async () => {
    mocks.findGlobal.mockResolvedValue({})
    await expect(getCachedGlobal('social-media', 0)()).resolves.toEqual({ links: [] })
    expect(mocks.findGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'social-media', depth: 0, draft: false, overrideAccess: false, select: { links: true } }),
    )
  })

  it('caches only the public Google Reviews settings under their shared tag', async () => {
    const settings = { enabled: false, placeId: '', heading: 'Customer reviews', reviewLimit: 5 }
    mocks.findGlobal.mockResolvedValue(settings)
    await expect(getCachedGlobal('google-reviews')()).resolves.toEqual(settings)
    expect(mocks.findGlobal).toHaveBeenCalledWith({
      slug: 'google-reviews', depth: 0, draft: false, overrideAccess: false,
      select: {
        enabled: true, placeId: true, heading: true, subheading: true,
        reviewLimit: true, mapsUrl: true, writeReviewUrl: true,
      },
    })
    expect(mocks.unstableCache).toHaveBeenCalledWith(expect.any(Function), ['google-reviews', '0'], {
      tags: ['global:google-reviews'],
    })
  })

  it('bypasses the settings cache for Google Reviews draft previews', async () => {
    mocks.draftEnabled = true
    mocks.findGlobal.mockResolvedValue({ enabled: true, placeId: 'draft-place-id' })
    await getCachedGlobal('google-reviews')()
    expect(mocks.unstableCache).not.toHaveBeenCalled()
    expect(mocks.findGlobal).toHaveBeenCalledWith(expect.objectContaining({
      slug: 'google-reviews', depth: 0, draft: true, overrideAccess: true,
    }))
  })

  it('bypasses unstable_cache and requests drafts only in preview mode', async () => {
    mocks.draftEnabled = true
    mocks.findGlobal.mockResolvedValue({ sections: [] })

    await getCachedGlobal('homepage', 1)()

    expect(mocks.unstableCache).not.toHaveBeenCalled()
    expect(mocks.findGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ draft: true, overrideAccess: true, slug: 'homepage' }),
    )
  })

  it('uses published cached content when called outside a Next.js request', async () => {
    mocks.draftMode.mockRejectedValueOnce(
      new Error('`draftMode` was called outside a request scope.'),
    )
    mocks.findGlobal.mockResolvedValue({ titlePattern: '{title}' })

    await expect(getCachedGlobal('seo-defaults', 1)()).resolves.toEqual({
      titlePattern: '{title}',
    })
    expect(mocks.findGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ draft: false, overrideAccess: false, slug: 'seo-defaults' }),
    )
  })
})
