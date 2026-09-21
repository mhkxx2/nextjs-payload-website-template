import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { PAGES_SITEMAP_CACHE_TAGS, POSTS_SITEMAP_CACHE_TAGS } from '@/lib/cacheTags'
import { getSitemapEntries } from '@/lib/seo'

const cacheTags = Array.from(new Set([...PAGES_SITEMAP_CACHE_TAGS, ...POSTS_SITEMAP_CACHE_TAGS]))

const getCachedSitemapEntries = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })

    return getSitemapEntries(payload)
  },
  ['sitemap-entries'],
  { tags: cacheTags },
)

/** /sitemap.xml — canonical, indexable, published URLs only. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getCachedSitemapEntries()
}
