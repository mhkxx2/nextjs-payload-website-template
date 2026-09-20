import { FIXED_SERVICE_SLUGS, canonicalPath } from '@/lib/routes'
import { isSafeSlug, normalizeSlug, validatePageSlug } from '@/lib/slug'

type FixedServiceSlug = (typeof FIXED_SERVICE_SLUGS)[number]

/** True when the value is one of the nine fixed service slugs. */
export const isFixedServiceSlug = (slug: unknown): slug is FixedServiceSlug =>
  typeof slug === 'string' && (FIXED_SERVICE_SLUGS as readonly string[]).includes(slug)

/**
 * Canonical public URLs. Every helper returns null instead of throwing when a
 * record carries a slug that has no public route, so a single bad record can
 * never take a whole page down.
 */
export const serviceHref = (slug: unknown): null | string =>
  isFixedServiceSlug(slug) ? canonicalPath('service', slug) : null

export const projectHref = (slug: unknown): null | string =>
  typeof slug === 'string' && isSafeSlug(slug) ? canonicalPath('project', slug) : null

export const postHref = (slug: unknown): null | string =>
  typeof slug === 'string' && isSafeSlug(slug) ? canonicalPath('post', slug) : null

export const pageHref = (slug: unknown): null | string => {
  if (typeof slug !== 'string') return null
  if (normalizeSlug(slug) === 'home') return null
  if (!isSafeSlug(slug) || validatePageSlug(slug) !== true) return null

  return canonicalPath('page', slug)
}

/**
 * Deterministic order for the nine fixed services, so navigation, grids and
 * archives always present the same sequence regardless of CMS ordering.
 */
export const orderFixedServices = <T extends { slug?: null | string }>(records: T[]): T[] =>
  [...records].sort((a, b) => serviceRank(a.slug) - serviceRank(b.slug))

const serviceRank = (slug?: null | string): number => {
  const index = (FIXED_SERVICE_SLUGS as readonly string[]).indexOf(slug ?? '')

  return index === -1 ? FIXED_SERVICE_SLUGS.length : index
}
