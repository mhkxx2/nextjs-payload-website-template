import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

import { collectionTag, globalTag } from '@/lib/cacheTags'

type Global = keyof Config['globals']

const GLOBAL_SELECTS: Partial<Record<Global, Record<string, unknown>>> = {
  'google-reviews': {
    enabled: true,
    placeId: true,
    heading: true,
    subheading: true,
    reviewLimit: true,
    mapsUrl: true,
    writeReviewUrl: true,
  },
  header: { navigation: true, serviceLinks: true, conversionActions: true, mobileNavigation: true },
  footer: { navigationGroups: true, serviceLinks: true, legalLinks: true, supportingCopy: true, conversionContent: true },
  'social-media': { links: true },
}
const GLOBAL_POPULATE: Partial<Record<Global, Record<string, unknown>>> = {
  header: {
    services: {
      id: true,
      title: true,
      slug: true,
      status: true,
      publishedAt: true,
      _status: true,
    },
  },
  footer: {
    services: {
      id: true,
      title: true,
      slug: true,
      status: true,
      publishedAt: true,
      _status: true,
    },
  },
}

function sanitizeServiceLinks(serviceLinks: unknown): unknown[] {
  if (!Array.isArray(serviceLinks)) return []
  return serviceLinks
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const service = (item as Record<string, unknown>).service
      if (!service || typeof service !== 'object') return null
      const s = service as Record<string, unknown>
      if (typeof s.id !== 'number' && typeof s.id !== 'string') return null
      if (typeof s.slug !== 'string' || typeof s.title !== 'string') return null
      if (s.slug.startsWith('..')) return null
      if (s._status === 'draft' || s.status === 'draft') return null

      return {
        ...item,
        service: {
          id: s.id,
          title: s.title,
          slug: s.slug,
        },
      }
    })
    .filter(Boolean) as unknown[]
}

async function isDraftModeEnabled(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled
  } catch (error) {
    if (error instanceof Error && error.message.includes('outside a request scope')) return false
    throw error
  }
}

async function getGlobal<T extends Global>(
  slug: T,
  depth = 0,
  draft = false,
): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })
  const effectiveDepth = slug === 'site-settings' ? Math.max(depth, 1) : depth

  const findOptions: Record<string, unknown> = {
    slug,
    depth: effectiveDepth,
    draft,
    overrideAccess: draft,
  }

  if (GLOBAL_SELECTS[slug]) {
    findOptions.select = GLOBAL_SELECTS[slug]
  }
  if (GLOBAL_POPULATE[slug]) {
    findOptions.populate = GLOBAL_POPULATE[slug]
  }

  const raw = await payload.findGlobal(findOptions as Parameters<typeof payload.findGlobal>[0])
  const global = (raw || {}) as unknown as Record<string, unknown>

  if (slug === 'social-media' && !global.links) {
    global.links = []
  }

  if ((slug === 'header' || slug === 'footer') && global.serviceLinks) {
    global.serviceLinks = sanitizeServiceLinks(global.serviceLinks)
  }

  return global as unknown as DataFromGlobalSlug<T>
}

/**
 * Returns an unstable_cache function mapped with the cache tags for the slug
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) => {
  const effectiveDepth = slug === 'site-settings' ? Math.max(depth, 1) : depth
  const tags: string[] = [globalTag(slug)]
  if (slug === 'header' || slug === 'footer') {
    tags.push(collectionTag('services'))
  }

  return async () => {
    const draft = await isDraftModeEnabled()
    if (draft) return getGlobal<T>(slug, effectiveDepth, true)

    return unstable_cache(
      async () => getGlobal<T>(slug, effectiveDepth, false),
      [slug, String(effectiveDepth)],
      { tags },
    )()
  }
}
