import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  draftEnabled: false,
  find: vi.fn(),
  unstableCache: vi.fn(
    (fn: () => unknown, _key: string[], _options: { tags?: string[] }) => fn,
  ),
}))

vi.mock('payload', async (importOriginal) => {
  const actual = await importOriginal<typeof import('payload')>()
  return { ...actual, getPayload: vi.fn(async () => ({ find: mocks.find })) }
})
vi.mock('@payload-config', () => ({ default: Promise.resolve({}) }))
vi.mock('next/headers', () => ({
  draftMode: vi.fn(async () => ({ isEnabled: mocks.draftEnabled })),
}))
vi.mock('next/cache', () => ({ unstable_cache: mocks.unstableCache }))

import { queryPublicDocBySlug, queryPublicList } from '@/lib/publicQueries'

const published = {
  _status: 'published',
  id: 1,
  publishedAt: '2026-01-01T00:00:00.000Z',
  slug: 'sofa-upholstery',
  status: 'published',
}

describe('public query cache registration', () => {
  beforeEach(() => {
    mocks.draftEnabled = false
    mocks.find.mockReset()
    mocks.find.mockResolvedValue({
      docs: [published],
      hasNextPage: false,
      hasPrevPage: false,
      page: 1,
      totalDocs: 1,
      totalPages: 1,
    })
    mocks.unstableCache.mockClear()
  })

  it('tags public lists with their collection owner', async () => {
    await queryPublicList({ collection: 'services', depth: 1, limit: 20 })

    expect(mocks.unstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      expect.arrayContaining(['public-query', 'services']),
      { tags: ['collection:services'] },
    )
  })

  it('tags public documents with collection and slug ownership', async () => {
    await queryPublicDocBySlug('services', 'sofa-upholstery')

    expect(mocks.unstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      expect.arrayContaining(['public-document', 'services', 'sofa-upholstery']),
      {
        tags: ['collection:services', 'document:services:sofa-upholstery'],
      },
    )
  })

  it('bypasses persistent cache in draft preview', async () => {
    mocks.draftEnabled = true

    await queryPublicList({ collection: 'services', depth: 1, limit: 20 })

    expect(mocks.unstableCache).not.toHaveBeenCalled()
    expect(mocks.find).toHaveBeenCalledWith(
      expect.objectContaining({ draft: true, overrideAccess: true }),
    )
  })
})
