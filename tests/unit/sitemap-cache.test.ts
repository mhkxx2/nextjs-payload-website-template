import { describe, expect, it } from 'vitest'

import {
  PAGES_SITEMAP_CACHE_TAGS,
  POSTS_SITEMAP_CACHE_TAGS,
  SITEMAP_CACHE_TAG,
} from '@/lib/cacheTags'

describe('sitemap cache tag contract', () => {
  it.each([
    ['pages', PAGES_SITEMAP_CACHE_TAGS, 'pages-sitemap'],
    ['posts', POSTS_SITEMAP_CACHE_TAGS, 'posts-sitemap'],
  ] as const)('%s sitemap consumes the shared producer tag and preserves its specific tag', (_name, tags, specificTag) => {
    expect(tags).toContain(SITEMAP_CACHE_TAG)
    expect(tags).toContain(specificTag)
  })
})
