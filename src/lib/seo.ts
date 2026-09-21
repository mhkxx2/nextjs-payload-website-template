import type { Metadata, MetadataRoute } from 'next'
import type { Payload } from 'payload'

import { isPubliclyPublished } from '@/lib/publication'
import { FIXED_SERVICE_SLUGS, canonicalPath } from '@/lib/routes'
import { validatePageSlug } from '@/lib/slug'
import { getCanonicalURL } from '@/utilities/getCanonicalURL'

/**
 * The launch origin. Every canonical URL the site publishes is resolved against
 * this origin, and any stored canonical that does not belong to it is ignored.
 */
export const CANONICAL_ORIGIN = 'https://alruknfurniture.ae'

/** How a title is assembled from the record title and the brand name. */
export const DEFAULT_TITLE_PATTERN = '{title} | {brand}'

/** Repo-owned social preview used when no Media relation supplies one. */
export const FALLBACK_SOCIAL_IMAGE = '/al-rukn-social-card.svg'

export const MAX_META_TITLE = 60
export const MAX_META_DESCRIPTION = 160

/** Utility and admin areas that must never be advertised to crawlers. */
export const PRIVATE_PATH_DISALLOW = [
  '/admin/',
  '/api/',
  '/graphql/',
  '/internal/',
  '/next/',
  '/search/',
] as const

/** Public routes that always render, with the priority they are advertised at. */
export const STRUCTURAL_SITEMAP_PATHS: { changeFrequency: 'monthly' | 'weekly'; path: string; priority: number }[] = [
  { changeFrequency: 'weekly', path: '/', priority: 1 },
  { changeFrequency: 'monthly', path: '/services/', priority: 0.9 },
  { changeFrequency: 'monthly', path: '/projects/', priority: 0.8 },
  { changeFrequency: 'monthly', path: '/blog/', priority: 0.8 },
  { changeFrequency: 'monthly', path: '/about-us/', priority: 0.7 },
  { changeFrequency: 'monthly', path: '/contact/', priority: 0.7 },
]

export type MediaLike = {
  alt?: unknown
  height?: unknown
  sizes?: unknown
  url?: unknown
  width?: unknown
}

/**
 * Records are read structurally: only fields that exist on the record are ever
 * used, and every value passes through `safeText` before it is published.
 */
export type SeoRecord = {
  _status?: unknown
  excerpt?: unknown
  meta?: unknown
  populatedAuthors?: unknown
  publishedAt?: unknown
  seo?: unknown
  slug?: unknown
  status?: unknown
  summary?: unknown
  title?: unknown
  updatedAt?: unknown
}

export type SeoDefaults = {
  brandName?: null | string
  /** Visible copy that may be reused as a description when nothing else exists. */
  descriptionFallback?: null | string
  follow?: boolean | null
  index?: boolean | null
  origin?: null | string
  path: string
  socialImage?: unknown
  titleFallback?: null | string
  titlePattern?: null | string
  type?: 'article' | 'website'
}

export type ResolvedRobots = {
  follow: boolean
  index: boolean
}

export type ResolvedSeoDefaults = {
  brandName: null | string
  descriptionFallback: null | string
  follow: boolean
  index: boolean
  socialImage: MediaLike | null
  titlePattern: string
}

export type SocialImage = {
  alt: string
  height?: number
  url: string
  width?: number
}

export type SitemapDoc = {
  seo?: unknown
  slug?: unknown
  updatedAt?: unknown
}

export type SitemapPayloadClient = Pick<Payload, 'find'> & {
  findGlobal?: Payload['findGlobal']
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Strip anything that cannot be published verbatim: non strings, control
 * characters, markup and repeated whitespace. Values that still contain markup
 * are rejected outright rather than silently rewritten.
 */
export function safeText(value: unknown, maxLength?: number): null | string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  if (typeof value !== 'string') return null

  const collapsed = value
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (collapsed.length === 0) return null
  if (collapsed.includes('<') || collapsed.includes('>')) return null

  if (typeof maxLength === 'number' && collapsed.length > maxLength) {
    return collapsed.slice(0, maxLength).trim() || null
  }

  return collapsed
}

/** Read a nested field without assuming the shape of a Payload document. */
export const readField = (value: unknown, key: string): unknown =>
  isObject(value) ? value[key] : undefined

const readText = (value: unknown, key: string, maxLength?: number): null | string =>
  safeText(readField(value, key), maxLength)

const asMedia = (value: unknown): MediaLike | null =>
  isObject(value) && typeof value.url === 'string' ? (value as MediaLike) : null

const readMedia = (value: unknown, key: string): MediaLike | null => asMedia(readField(value, key))

const asBoolean = (value: unknown): boolean | null => (typeof value === 'boolean' ? value : null)

const readBoolean = (value: unknown, key: string): boolean | null => asBoolean(readField(value, key))

/** Env driven so a preview deployment can never publish production canonicals. */
export function resolveCanonicalOrigin(candidate?: null | string | undefined): string {
  const raw = safeText(candidate ?? getCanonicalURL())

  if (!raw) return CANONICAL_ORIGIN

  try {
    const url = new URL(raw)

    if (url.protocol !== 'https:') return CANONICAL_ORIGIN
    if (url.username || url.password) return CANONICAL_ORIGIN
    if (url.port) return CANONICAL_ORIGIN
    if (url.search || url.hash) return CANONICAL_ORIGIN

    return url.origin
  } catch {
    return CANONICAL_ORIGIN
  }
}

/** Resolve a site path against the canonical origin, keeping one trailing slash. */
export function canonicalURL(path: string, origin?: null | string | undefined): string {
  const base = resolveCanonicalOrigin(origin)
  const [withoutQuery = ''] = String(path ?? '').split(/[?#]/)
  const segments = withoutQuery
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0 && segment !== '.')

  if (segments.length === 0) return `${base}/`

  const last = segments[segments.length - 1] ?? ''
  const resolvedPath = `${base}/${segments.join('/')}`

  // Asset and metadata paths keep their exact form instead of gaining a slash.
  return /\.[a-z0-9]{2,5}$/i.test(last) ? resolvedPath : `${resolvedPath}/`
}

/**
 * A stored canonical is only honoured when it points at this origin, over
 * https, with no credentials, port, query or fragment.
 */
export function isSameOriginCanonical(value: unknown, origin?: null | string | undefined): boolean {
  const raw = safeText(value)
  if (!raw) return false

  const base = resolveCanonicalOrigin(origin)

  if (raw.startsWith('/')) {
    return !raw.startsWith('//') && raw.length > 1 && !raw.includes('?') && !raw.includes('#')
  }

  try {
    const url = new URL(raw)

    if (url.origin !== base) return false
    if (url.username || url.password || url.port) return false

    return !url.search && !url.hash
  } catch {
    return false
  }
}

/** Titles are assembled from the pattern; a brand-less site never gets a stray separator. */
export function applyTitlePattern(
  pattern: null | string | undefined,
  title: null | string | undefined,
  brand: null | string | undefined,
): null | string {
  const resolvedPattern = safeText(pattern) ?? DEFAULT_TITLE_PATTERN

  if (!title) return brand ?? null
  if (!brand) return safeText(title)

  const combined = resolvedPattern
    .replaceAll('{title}', title)
    .replaceAll('{brand}', brand)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[|\-–—:\s]+/, '')
    .replace(/[|\-–—:\s]+$/, '')
    .trim()

  return safeText(combined) ?? title
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2})?/

const asISODate = (value: unknown): null | string => {
  const raw = typeof value === 'string' ? value : value instanceof Date ? value.toISOString() : null
  if (!raw || !DATE_PATTERN.test(raw)) return null

  const parsed = new Date(raw)

  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

/** Only records that carry publication state are subject to the published rule. */
export const hasPublicationState = (record: SeoRecord | null | undefined): boolean =>
  isObject(record) && ('_status' in record || 'status' in record)

export const isRecordPublished = (record: SeoRecord | null | undefined, now: Date = new Date()): boolean => {
  if (!record) return true
  if (!hasPublicationState(record)) return true

  return isPubliclyPublished(
    {
      _status: typeof record._status === 'string' ? record._status : undefined,
      publishedAt: typeof record.publishedAt === 'string' ? record.publishedAt : undefined,
      status: record.status === 'draft' || record.status === 'published' ? record.status : undefined,
    },
    now,
  )
}

/**
 * Index/follow resolves record → global defaults → sane default. Anything that
 * is not currently published is forced to noindex/nofollow.
 */
export function resolveRobots(
  record: SeoRecord | null | undefined,
  defaults: Pick<SeoDefaults, 'follow' | 'index'> = {},
  now: Date = new Date(),
): ResolvedRobots {
  const seo = record ? readField(record, 'seo') : null
  const index = readBoolean(seo, 'index') ?? asBoolean(defaults.index) ?? true
  const follow = readBoolean(seo, 'follow') ?? asBoolean(defaults.follow) ?? true

  if (hasPublicationState(record) && !isRecordPublished(record, now)) {
    return { follow: false, index: false }
  }

  return { follow, index }
}

/** Prefer the dedicated OG rendition, then the original upload. */
export function resolveSocialImage(value: unknown, origin?: null | string | undefined): SocialImage | null {
  const media = asMedia(value)
  const url = safeText(media?.url)

  if (!media || !url) return null

  const og = asMedia(readField(media, 'sizes') ? readField(readField(media, 'sizes'), 'og') : null)
  const chosen = og?.url ? og : media
  const chosenURL = safeText(chosen.url)

  if (!chosenURL) return null

  const absolute = chosenURL.startsWith('http')
    ? isSameOriginCanonical(chosenURL, origin)
      ? chosenURL
      : null
    : canonicalURL(chosenURL, origin)

  if (!absolute) return null

  const width = typeof chosen.width === 'number' && chosen.width > 0 ? chosen.width : undefined
  const height = typeof chosen.height === 'number' && chosen.height > 0 ? chosen.height : undefined
  const alt = safeText(media.alt) ?? ''

  return {
    alt,
    ...(height ? { height } : {}),
    url: absolute,
    ...(width ? { width } : {}),
  }
}

const resolveCanonicalTarget = (
  record: SeoRecord | null | undefined,
  defaults: SeoDefaults,
): string => {
  const seo = record ? readField(record, 'seo') : null
  const declared = readField(seo, 'canonicalURL')

  if (isSameOriginCanonical(declared, defaults.origin)) {
    const raw = safeText(declared) as string

    return raw.startsWith('/') ? canonicalURL(raw, defaults.origin) : raw
  }

  return canonicalURL(defaults.path, defaults.origin)
}

const resolveDescription = (
  record: SeoRecord | null | undefined,
  defaults: SeoDefaults,
): null | string => {
  const seo = record ? readField(record, 'seo') : null
  const meta = record ? readField(record, 'meta') : null

  return (
    readText(seo, 'description', MAX_META_DESCRIPTION) ??
    readText(meta, 'description', MAX_META_DESCRIPTION) ??
    readText(record, 'summary', MAX_META_DESCRIPTION) ??
    readText(record, 'excerpt', MAX_META_DESCRIPTION) ??
    safeText(defaults.descriptionFallback, MAX_META_DESCRIPTION)
  )
}

const resolveTitle = (
  record: SeoRecord | null | undefined,
  defaults: SeoDefaults,
): { brand: null | string; title: null | string } => {
  const seo = record ? readField(record, 'seo') : null
  const meta = record ? readField(record, 'meta') : null
  const brand = safeText(defaults.brandName) ?? null
  const base =
    readText(seo, 'title') ??
    readText(meta, 'title') ??
    safeText(record ? readField(record, 'title') : null) ??
    safeText(defaults.titleFallback)

  return { brand, title: applyTitlePattern(defaults.titlePattern, base, brand) }
}

/**
 * The single metadata builder every public route uses. Every value comes from
 * the record, a validated global, or the caller supplied fallback — a missing
 * fact stays missing instead of being invented.
 */
export function buildMetadata(record: SeoRecord | null | undefined, defaults: SeoDefaults): Metadata {
  const { brand, title } = resolveTitle(record, defaults)
  const description = resolveDescription(record, defaults)
  const canonical = resolveCanonicalTarget(record, defaults)
  const socialImage = resolveSocialImage(
    (record ? readField(record, 'seo') : null)
      ? readMedia(record ? readField(record, 'seo') : null, 'openGraphImage')
      : null,
  )
  const image =
    socialImage ?? resolveSocialImage(defaults.socialImage, defaults.origin) ?? fallbackSocialImage(defaults.origin)
  const robots = resolveRobots(record, defaults)
  const published = asISODate(record ? readField(record, 'publishedAt') : null)
  const modified = asISODate(record ? readField(record, 'updatedAt') : null)
  const type = defaults.type ?? (published ? 'article' : 'website')

  return {
    alternates: { canonical },
    ...(description ? { description } : {}),
    openGraph: {
      ...(description ? { description } : {}),
      images: [{ ...image }],
      ...(modified ? { modifiedTime: modified } : {}),
      ...(published ? { publishedTime: published } : {}),
      siteName: brand ?? undefined,
      title: title ?? undefined,
      type,
      url: canonical,
    },
    robots: { follow: robots.follow, index: robots.index },
    ...(title ? { title } : {}),
    twitter: {
      card: 'summary_large_image',
      ...(description ? { description } : {}),
      images: [image.url],
      title: title ?? undefined,
    },
  }
}

const fallbackSocialImage = (origin?: null | string | undefined): SocialImage => ({
  alt: '',
  url: canonicalURL(FALLBACK_SOCIAL_IMAGE, origin),
})

/** Production is the only environment allowed to invite crawlers in. */
export function isProductionEnvironment(env: Record<string, string | undefined> = process.env): boolean {
  if (typeof env.VERCEL_ENV === 'string' && env.VERCEL_ENV.length > 0) {
    return env.VERCEL_ENV === 'production'
  }

  return env.NODE_ENV === 'production'
}

/**
 * Crawlers are only invited in when this deployment is a production environment
 * *and* it is serving the production origin. A staging or preview deployment
 * always answers "disallow everything".
 */
export function resolveRobotsPolicy(
  env: Record<string, string | undefined> = process.env,
  origin?: null | string | undefined,
): { allowed: boolean; origin: string } {
  const base = resolveCanonicalOrigin(origin)
  const allowed = isProductionEnvironment(env) && base === CANONICAL_ORIGIN

  return { allowed, origin: base }
}

export function buildRobots(
  env: Record<string, string | undefined> = process.env,
  origin?: null | string | undefined,
): MetadataRoute.Robots {
  const policy = resolveRobotsPolicy(env, origin)

  if (!policy.allowed) {
    return { rules: [{ disallow: '/', userAgent: '*' }] }
  }

  return {
    host: policy.origin,
    rules: [{ allow: '/', disallow: [...PRIVATE_PATH_DISALLOW], userAgent: '*' }],
    sitemap: `${policy.origin}/sitemap.xml`,
  }
}

/** Global handled lookup, kept lazy so pure unit tests never boot Payload. */
export async function getSeoDefaults(): Promise<ResolvedSeoDefaults> {
  const { getCachedGlobal } = await import('@/utilities/getGlobals')

  const [seoDefaults, siteSettings] = await Promise.all([
    getCachedGlobal('seo-defaults', 1)(),
    getCachedGlobal('site-settings', 1)(),
  ])

  const socialImage = readMedia(seoDefaults, 'socialImage')

  return {
    brandName: readText(siteSettings, 'brandName') ?? readText(siteSettings, 'businessName'),
    descriptionFallback: readText(seoDefaults, 'fallbackDescription', MAX_META_DESCRIPTION),
    follow: readBoolean(seoDefaults, 'follow') ?? true,
    index: readBoolean(seoDefaults, 'index') ?? true,
    socialImage: socialImage && safeText(socialImage.url) ? socialImage : null,
    titlePattern: safeText(readField(seoDefaults, 'titlePattern')) ?? DEFAULT_TITLE_PATTERN,
  }
}

const isIndexableRecord = (record: SeoRecord): boolean => readBoolean(readField(record, 'seo'), 'index') !== false

const readDocs = (result: unknown): SitemapDoc[] => {
  const docs = isObject(result) ? result.docs : undefined

  return Array.isArray(docs) ? (docs.filter(isObject) as SitemapDoc[]) : []
}

const toSitemapEntries = (
  docs: SitemapDoc[],
  buildPath: (slug: string) => null | string,
  origin: string,
  priority: number,
  now: Date,
): MetadataRoute.Sitemap =>
  docs
    .filter((doc) => isRecordPublished(doc as SeoRecord, now) && isIndexableRecord(doc as SeoRecord))
    .map((doc) => ({ path: buildPath(safeText(doc.slug) ?? ''), updatedAt: asISODate(doc.updatedAt) }))
    .filter((entry): entry is { path: string; updatedAt: null | string } => Boolean(entry.path))
    .map((entry) => ({
      ...(entry.updatedAt ? { lastModified: entry.updatedAt } : {}),
      priority,
      url: canonicalURL(entry.path, origin),
    }))

/**
 * The sitemap contains canonical, indexable, published URLs only: no drafts, no
 * scheduled-in-the-future records, no noindexed records, no admin or API paths.
 */
export async function getSitemapEntries(
  payload: SitemapPayloadClient,
  options: { now?: Date; origin?: null | string | undefined } = {},
): Promise<MetadataRoute.Sitemap> {
  const now = options.now ?? new Date()
  const origin = resolveCanonicalOrigin(options.origin)

  const seoDefaults = payload.findGlobal
    ? await payload
        .findGlobal({ depth: 0, slug: 'seo-defaults' })
        .then((global) => global)
        .catch(() => null)
    : null

  if (readBoolean(seoDefaults, 'index') === false) return []

  const where = publicationConstraints(now)
  const allowedSlugs = new Set<string>(FIXED_SERVICE_SLUGS)

  const found = await Promise.all(
    (['services', 'projects', 'posts', 'pages'] as const).map(async (collection) =>
      readDocs(
        await payload.find({
          collection,
          depth: 0,
          draft: false,
          limit: 0,
          overrideAccess: false,
          pagination: false,
          sort: 'slug',
          where,
        } as unknown as Parameters<Payload['find']>[0]),
      ),
    ),
  )

  const [services = [], projects = [], posts = [], pages = []] = found

  const structural: MetadataRoute.Sitemap = STRUCTURAL_SITEMAP_PATHS.map((entry) => ({
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    url: canonicalURL(entry.path, origin),
  }))

  const serviceEntries = services
    .filter((doc) => isRecordPublished(doc as SeoRecord, now) && isIndexableRecord(doc as SeoRecord))
    .map((doc) => safeText(doc.slug) ?? '')
    .filter((slug) => allowedSlugs.has(slug))
    .sort((a, b) => FIXED_SERVICE_SLUGS.indexOf(a as never) - FIXED_SERVICE_SLUGS.indexOf(b as never))
    .map((slug) => canonicalPath('service', slug))
    .map((path) => ({ changeFrequency: 'monthly' as const, priority: 0.8, url: canonicalURL(path, origin) }))

  const pageEntries = toSitemapEntries(pages, (slug) => {
    if (!slug || slug === 'home') return null
    if (validatePageSlug(slug) !== true) return null

    return `/${slug}/`
  }, origin, 0.6, now)

  const projectEntries = toSitemapEntries(
    projects,
    (slug) => (slug ? canonicalPath('project', slug) : null),
    origin,
    0.6,
    now,
  )

  const postEntries = toSitemapEntries(posts, (slug) => (slug ? canonicalPath('post', slug) : null), origin, 0.5, now)

  const seen = new Set<string>()

  return [...structural, ...serviceEntries, ...pageEntries, ...projectEntries, ...postEntries].filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)

    return true
  })
}

/** Publication where clause shared with the public queries. */
function publicationConstraints(now: Date) {
  return {
    and: [
      { _status: { equals: 'published' } },
      { status: { equals: 'published' } },
      { publishedAt: { less_than_equal: now.toISOString() } },
    ],
  }
}
