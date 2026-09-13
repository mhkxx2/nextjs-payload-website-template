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
  'health',
  'graphql',
  'graphql-playground',
  ...FIXED_SERVICE_SLUGS,
] as const

export const RESERVED_PREFIXES = [...RESERVED_EXACT_ROUTES] as const

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
