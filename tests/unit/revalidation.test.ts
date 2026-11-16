import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath,
  revalidateTag: mocks.revalidateTag,
}))

import { expirePath, expireTag } from '@/lib/cacheInvalidation'
import { globalInvalidationTargets, invalidateGlobalContent } from '@/globals/hooks/revalidateGlobalContent'
import { revalidatePortfolio } from '@/hooks/revalidatePortfolio'
import { revalidateMedia } from '@/hooks/revalidateMedia'

const request = () => ({
  payload: {
    logger: {
      info: vi.fn(),
      warn: vi.fn(),
    },
  },
})

describe('immediate cache invalidation', () => {
  beforeEach(() => {
    mocks.revalidatePath.mockReset()
    mocks.revalidateTag.mockReset()
  })

  it('expires tags immediately for Next.js 16', () => {
    expireTag(request(), 'collection:services')

    expect(mocks.revalidateTag).toHaveBeenCalledWith('collection:services', { expire: 0 })
  })

  it('supports page and layout path invalidation', () => {
    const req = request()

    expirePath(req, '/services/')
    expirePath(req, '/', 'layout')

    expect(mocks.revalidatePath).toHaveBeenNthCalledWith(1, '/services/')
    expect(mocks.revalidatePath).toHaveBeenNthCalledWith(2, '/', 'layout')
  })

  it('suppresses only the known missing static generation store error', () => {
    const req = request()
    mocks.revalidateTag.mockImplementationOnce(() => {
      throw new Error('Invariant: static generation store missing in revalidateTag')
    })

    expect(() => expireTag(req, 'collection:services')).not.toThrow()
    expect(req.payload.logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('collection:services'),
    )
  })

  it('does not hide unexpected cache failures', () => {
    mocks.revalidatePath.mockImplementationOnce(() => {
      throw new Error('cache backend unavailable')
    })

    expect(() => expirePath(request(), '/')).toThrow('cache backend unavailable')
  })
})

describe('CMS owner route mappings', () => {
  it('expires only first-party Google Reviews settings and their consumer route', () => {
    expect(globalInvalidationTargets('google-reviews')).toEqual({
      tags: ['global:google-reviews'],
      paths: [{ path: '/sofa-upholstery/' }],
    })
    mocks.revalidateTag.mockReset()
    mocks.revalidatePath.mockReset()
    invalidateGlobalContent('google-reviews', request())
    expect(mocks.revalidateTag).toHaveBeenCalledExactlyOnceWith('global:google-reviews', { expire: 0 })
    expect(mocks.revalidatePath).toHaveBeenCalledExactlyOnceWith('/sofa-upholstery/')
  })
  it.each([
    ['homepage', ['/']],
    ['about-page', ['/about-us/']],
    ['contact-page', ['/contact/']],
    ['archive-settings', ['/services/', '/projects/', '/blog/', '/portfolio/']],
  ] as const)('maps %s to its public routes', (slug, expected) => {
    expect(globalInvalidationTargets(slug).paths.map(({ path }) => path)).toEqual(
      expect.arrayContaining([...expected]),
    )
  })

  it.each(['header', 'footer', 'site-settings', 'contact-information', 'seo-defaults'] as const)(
    'invalidates the layout for %s changes',
    (slug) => {
      expect(globalInvalidationTargets(slug).paths).toContainEqual({ path: '/', type: 'layout' })
    },
  )

  it('invalidates Portfolio archive for public changes and not unpublished-only drafts', () => {
    const req = request()
    revalidatePortfolio({
      doc: { id: 1, published: true, slug: 'updated-design' },
      operation: 'change',
      previousDoc: { id: 1, published: true, slug: 'old-design' },
      req,
    })

    expect(mocks.revalidateTag).toHaveBeenCalledWith('collection:portfolio-items', { expire: 0 })
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/portfolio/')

    mocks.revalidatePath.mockReset()
    mocks.revalidateTag.mockReset()
    revalidatePortfolio({
      doc: { id: 2, published: false, slug: 'private-design' },
      operation: 'change',
      previousDoc: { id: 2, published: false, slug: 'private-design' },
      req,
    })
    expect(mocks.revalidateTag).not.toHaveBeenCalled()
    expect(mocks.revalidatePath).not.toHaveBeenCalled()
  })

  it('broadly expires media relationship owners and layout on Media changes', () => {
    const req = request()
    revalidateMedia({ doc: { id: 31 }, req })

    expect(mocks.revalidateTag).toHaveBeenCalledWith('collection:services', { expire: 0 })
    expect(mocks.revalidateTag).toHaveBeenCalledWith('global:site-settings', { expire: 0 })
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/', 'layout')
  })
})
