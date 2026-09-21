import { isSafeSlug, normalizeSlug } from './slug'

export const FIXED_SERVICE_SLUGS = [
  'sofa-upholstery',
  'custom-furniture',
  'custom-sofa',
  'majlis-furniture',
  'curtains-blinds',
  'sofa-repair',
  'custom-wardrobes',
  'custom-beds-headboards',
  'office-furniture',
] as const

export const RESERVED_EXACT_ROUTES = [
  'admin',
  'api',
  'services',
  'projects',
  'blog',
  'about',
  'about-us',
  'contact',
  'sitemap.xml',
  'robots.txt',
  '_next',
  'static',
  'assets',
  'media',
  'uploads',
  'internal',
  'health',
  'graphql',
  'graphql-playground',
  ...FIXED_SERVICE_SLUGS,
] as const

export const RESERVED_PREFIXES = [...RESERVED_EXACT_ROUTES] as const

/**
 * Routes the application always renders itself. Redirect middleware must never
 * supersede one of these: a stored redirect can point *to* them, never *over* them.
 */
export const APPLICATION_OWNED_PATHS = [
  '/',
  '/about-us/',
  '/blog/',
  '/contact/',
  '/projects/',
  '/robots.txt/',
  '/search/',
  '/services/',
  '/sitemap.xml/',
  ...FIXED_SERVICE_SLUGS.map((slug) => `/${slug}/`),
] as const

/** Normalize a request path into the trailing-slash form used by the site. */
export function normalizeRoutePath(pathname: string): string {
  const [withoutQuery = ''] = String(pathname ?? '').split(/[?#]/)
  const segments = withoutQuery.split('/').filter((segment) => segment.length > 0 && segment !== '.')

  return segments.length === 0 ? '/' : `/${segments.join('/')}/`
}

export function isApplicationOwnedPath(pathname: string): boolean {
  const normalized = normalizeRoutePath(pathname).toLowerCase()

  return (APPLICATION_OWNED_PATHS as readonly string[]).includes(normalized)
}

export type CanonicalPathKind = 'service' | 'project' | 'post' | 'page'

export function canonicalPath(kind: CanonicalPathKind, slug: string): string {
  const normalized = normalizeSlug(slug)

  if (!isSafeSlug(normalized)) {
    throw new Error('A valid slug is required to build a canonical path.')
  }

  if (kind === 'service') {
    if (!(FIXED_SERVICE_SLUGS as readonly string[]).includes(normalized)) {
      throw new Error(`“${normalized}” is not a fixed service slug.`)
    }

    return `/${normalized}/`
  }

  if (kind === 'project') {
    return `/projects/${normalized}/`
  }

  if (kind === 'post') {
    return `/blog/${normalized}/`
  }

  return `/${normalized}/`
}
