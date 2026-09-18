import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

const GLOBAL_SELECTS: Partial<Record<Global, Record<string, unknown>>> = {
  header: { navItems: true, serviceLinks: true },
  footer: { navItems: true, serviceLinks: true, copyrightText: true },
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

async function getGlobal<T extends Global>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const findOptions: Record<string, unknown> = {
    slug,
    depth,
    overrideAccess: false,
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
  const tags = [`global_${slug}`]
  if (slug === 'header' || slug === 'footer') {
    tags.push('collection_services')
  }

  return unstable_cache(async () => getGlobal<T>(slug, depth), [slug, String(depth)], {
    tags,
  })
}
