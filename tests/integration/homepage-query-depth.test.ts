import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  queryPublicList: vi.fn(),
}))

vi.mock('next/headers', () => ({
  draftMode: vi.fn(async () => ({ isEnabled: false })),
}))
vi.mock('@/components/JsonLd', () => ({ JsonLd: () => null }))
vi.mock('@/components/LivePreviewListener', () => ({ LivePreviewListener: () => null }))
vi.mock('@/components/home/HomepageView', () => ({ HomepageView: () => null }))
vi.mock('@/lib/homepage', () => ({ getHomepageGlobal: vi.fn(async () => ({ sections: [] })) }))
vi.mock('@/lib/publicQueries', () => ({ queryPublicList: mocks.queryPublicList }))
vi.mock('@/lib/schema', () => ({
  buildSchemas: vi.fn(() => []),
  getSchemaGlobals: vi.fn(async () => ({})),
}))
vi.mock('@/lib/seo', () => ({ buildMetadata: vi.fn(), getSeoDefaults: vi.fn() }))
vi.mock('@/utilities/getGlobals', () => ({
  getCachedGlobal: vi.fn(() => async () => ({})),
}))

import HomePage from '@/app/(frontend)/page'

describe('Homepage public query depth', () => {
  beforeEach(() => {
    mocks.queryPublicList.mockReset()
    mocks.queryPublicList.mockResolvedValue({ docs: [] })
  })

  it('keeps the Services cache entry below the Next.js size limit', async () => {
    await HomePage()

    expect(mocks.queryPublicList).toHaveBeenCalledWith({
      collection: 'services',
      depth: 1,
      limit: 20,
    })
  })
})
