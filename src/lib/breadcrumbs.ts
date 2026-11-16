import { FIXED_SERVICE_SLUGS } from '@/lib/routes'
import { validatePageSlug } from '@/lib/slug'

/**
 * Breadcrumb trails are derived from the path alone so a trail can never be
 * invented for a route that does not exist. The record only supplies the leaf
 * label, and when that label is missing the trail is empty — an empty trail
 * means "no visible breadcrumbs", which is also what the page renders.
 */
export type Breadcrumb = {
  href?: string
  label: string
}

/** Matches the services link used by the visible service page breadcrumbs. */
export const SERVICES_BREADCRUMB_HREF = '/#services'

const STATIC_TRAILS: Record<string, Breadcrumb[]> = {
  '/about-us/': [{ label: 'About' }],
  '/blog/': [{ label: 'Blog' }],
  '/contact/': [{ label: 'Contact' }],
  '/projects/': [{ label: 'Projects' }],
  '/portfolio/': [{ label: 'Portfolio' }],
  '/services/': [{ label: 'Services' }],
}

/** Collapse a path (with any query/hash) into its exact trailing-slash form. */
export const normalizeBreadcrumbPath = (path: string): string => {
  const [withoutQuery = ''] = String(path ?? '').split(/[?#]/)
  const withLeadingSlash = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`
  const segments = withLeadingSlash
    .split('/')
    .filter((segment) => segment.length > 0 && segment !== '.')

  return segments.length === 0 ? '/' : `/${segments.join('/')}/`
}

const label = (value: unknown): null | string => {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : null
}

export function buildBreadcrumbs(
  path: string,
  record?: { title?: unknown } | null,
): Breadcrumb[] {
  const normalized = normalizeBreadcrumbPath(path)

  if (normalized === '/') return []

  const staticTrail = STATIC_TRAILS[normalized]
  if (staticTrail) return staticTrail.map((item) => ({ ...item }))

  const segments = normalized.split('/').filter((segment) => segment.length > 0)
  const leaf = label(record?.title)

  if (segments.length === 1) {
    const slug = segments[0] as string

    // The homepage is the root of every trail and never a crumb of its own.
    if (slug === 'home') return []

    if ((FIXED_SERVICE_SLUGS as readonly string[]).includes(slug)) {
      if (!leaf) return []

      return [{ label: 'Services', href: SERVICES_BREADCRUMB_HREF }, { label: leaf }]
    }

    // General pages only earn a crumb when a published record supplies the label
    // and the segment is not owned by another route.
    if (!leaf || validatePageSlug(slug) !== true) return []

    return [{ label: leaf }]
  }

  if (segments.length === 2) {
    const [section] = segments as [string, string]
    if (!leaf) return []

    if (section === 'projects') return [{ label: 'Projects', href: '/projects/' }, { label: leaf }]
    if (section === 'blog') return [{ label: 'Blog', href: '/blog/' }, { label: leaf }]

    return []
  }

  if (segments.length === 3 && segments[0] === 'blog' && segments[1] === 'page') {
    const pageNumber = segments[2] as string

    if (!/^\d+$/.test(pageNumber)) return []

    const parsed = Number.parseInt(pageNumber, 10)
    if (!Number.isInteger(parsed) || parsed < 2) return []

    return [{ label: 'Blog', href: '/blog/' }, { label: `Page ${parsed}` }]
  }

  return []
}
