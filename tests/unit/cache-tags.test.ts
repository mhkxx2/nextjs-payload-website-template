import { describe, expect, it } from 'vitest'

import {
  CONTENT_COLLECTIONS,
  CONTENT_GLOBALS,
  GOOGLE_REVIEWS_CACHE_TAG,
  HOMEPAGE_TAG,
  LAYOUT_TAG,
  MEDIA_DEPENDENCY_TAGS,
  METADATA_TAG,
  collectionTag,
  documentTag,
  globalTag,
} from '@/lib/cacheTags'

describe('central cache tag contract', () => {
  it('includes Google Reviews settings in the shared global invalidation namespace', () => {
    expect(GOOGLE_REVIEWS_CACHE_TAG).toBe('global:google-reviews')
    expect(CONTENT_GLOBALS).toContain('google-reviews')
    expect(MEDIA_DEPENDENCY_TAGS).toContain(GOOGLE_REVIEWS_CACHE_TAG)
  })
  it('uses one namespace for global, collection, and document data', () => {
    expect(globalTag('site-settings')).toBe('global:site-settings')
    expect(collectionTag('services')).toBe('collection:services')
    expect(documentTag('services', 'sofa-upholstery')).toBe(
      'document:services:sofa-upholstery',
    )
    expect(LAYOUT_TAG).toBe('global:layout')
    expect(METADATA_TAG).toBe('global:metadata')
    expect(HOMEPAGE_TAG).toBe('global:homepage-route')
  })

  it('covers every content owner when a Media record changes', () => {
    const tags = new Set(MEDIA_DEPENDENCY_TAGS)

    for (const collection of CONTENT_COLLECTIONS) {
      expect(tags).toContain(collectionTag(collection))
    }
    for (const global of CONTENT_GLOBALS) {
      expect(tags).toContain(globalTag(global))
    }
    expect(tags).toContain(collectionTag('portfolio-items'))
    expect(tags).toContain(LAYOUT_TAG)
    expect(tags).toContain(METADATA_TAG)
  })
})
