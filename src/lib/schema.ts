import type { Breadcrumb } from '@/lib/breadcrumbs'
import { isPubliclyPublished } from '@/lib/publication'
import {
  canonicalURL,
  isRecordPublished,
  readField,
  resolveCanonicalOrigin,
  safeText,
  type MediaLike,
  type SeoRecord,
} from '@/lib/seo'

export const SCHEMA_CONTEXT = 'https://schema.org'

/**
 * The only schema types this site is allowed to claim. Anything else an editor
 * stores on a record is ignored rather than published.
 */
export const SUPPORTED_SCHEMA_TYPES = [
  'Organization',
  'LocalBusiness',
  'Service',
  'Article',
  'FAQPage',
  'BreadcrumbList',
] as const

export type SupportedSchemaType = (typeof SUPPORTED_SCHEMA_TYPES)[number]

export type JsonLdObject = {
  '@context': string
  '@type': string
  [key: string]: unknown
}

export type SchemaKind = 'archive' | 'home' | 'page' | 'post' | 'project' | 'service'

export type SchemaGlobals = {
  brandName?: unknown
  businessName?: unknown
  contact?: unknown
  localBusiness?: unknown
  organization?: unknown
  social?: unknown
}

export type SchemaContext = {
  breadcrumbs?: Breadcrumb[] | null | undefined
  globals?: SchemaGlobals | null | undefined
  includeLocalBusiness?: boolean
  /** Dedicated landing pages can publish only their page-specific entities. */
  includeOrganization?: boolean
  kind: SchemaKind
  now?: Date
  origin?: null | string | undefined
  path: string
  record?: SeoRecord | null | undefined
  visibleFaqs?: unknown
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

const asText = (value: unknown, maxLength?: number): null | string => safeText(value, maxLength)

const readText = (value: unknown, key: string, maxLength?: number): null | string =>
  asText(readField(value, key), maxLength)

const asMedia = (value: unknown): MediaLike | null =>
  isObject(value) && typeof value.url === 'string' ? (value as MediaLike) : null

const isSupportedSchemaType = (value: unknown): value is SupportedSchemaType =>
  typeof value === 'string' && (SUPPORTED_SCHEMA_TYPES as readonly string[]).includes(value)

/** A schema is only ever serialized with '<' escaped so it cannot break out of the tag. */
export const serializeJsonLd = (value: unknown): string =>
  JSON.stringify(value ?? null)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029')

const DAY_LABELS: Record<string, string> = {
  friday: 'Friday',
  monday: 'Monday',
  saturday: 'Saturday',
  sunday: 'Sunday',
  thursday: 'Thursday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

const ALLOWED_BUSINESS_TYPES = ['LocalBusiness'] as const

/**
 * FAQPage is emitted only for the exact set of FAQs the page renders, and only
 * for entries an editor explicitly marked schema eligible.
 */
export function selectSchemaEligibleFaqs(faqs: unknown, now: Date = new Date()): Record<string, unknown>[] {
  return asArray(faqs).filter((faq): faq is Record<string, unknown> => {
    if (!isObject(faq)) return false
    if (faq.schemaEligible !== true) return false
    if (!asText(faq.question) || !asText(faq.answer)) return false

    const hasPublication = '_status' in faq || 'status' in faq
    if (!hasPublication) return true

    return isPubliclyPublished(
      {
        _status: typeof faq._status === 'string' ? faq._status : undefined,
        publishedAt: typeof faq.publishedAt === 'string' ? faq.publishedAt : undefined,
        status: faq.status === 'draft' || faq.status === 'published' ? faq.status : undefined,
      },
      now,
    )
  })
}

export function buildFaqSchema(
  faqs: unknown,
  options: { now?: Date } = {},
): JsonLdObject | null {
  const eligible = selectSchemaEligibleFaqs(faqs, options.now ?? new Date())

  if (eligible.length === 0) return null

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'FAQPage',
    mainEntity: eligible.map((faq) => ({
      '@type': 'Question',
      acceptedAnswer: { '@type': 'Answer', text: asText(faq.answer) },
      name: asText(faq.question),
    })),
  }
}

const organizationName = (globals: SchemaGlobals | null | undefined): null | string =>
  readText(globals?.organization, 'name') ?? readText(globals, 'businessName') ?? readText(globals, 'brandName')

const organizationLogo = (globals: SchemaGlobals | null | undefined, origin: string) => {
  const logo = asMedia(readField(globals?.organization, 'logo'))
  const url = asText(logo?.url)

  if (!url) return null

  const width = typeof logo?.width === 'number' && logo.width > 0 ? logo.width : undefined
  const height = typeof logo?.height === 'number' && logo.height > 0 ? logo.height : undefined

  return {
    '@type': 'ImageObject',
    ...(height ? { height } : {}),
    url: url.startsWith('http') ? url : canonicalURL(url, origin),
    ...(width ? { width } : {}),
  }
}

const socialProfiles = (globals: SchemaGlobals | null | undefined): string[] =>
  asArray(readField(globals?.social, 'links'))
    .map((link) => asText(readField(link, 'url')) ?? getLinkURL(link))
    .filter((url): url is string => Boolean(url && url.startsWith('https://')))

function getLinkURL(link: unknown): null | string {
  const url = asText(link)

  return url && url.startsWith('https://') ? url : null
}

export function buildOrganizationSchema(
  globals: SchemaGlobals | null | undefined,
  origin: string,
): JsonLdObject | null {
  const name = organizationName(globals)

  if (!name) return null

  const description = readText(globals?.organization, 'description')
  const logo = organizationLogo(globals, origin)
  const telephone = asText(readField(globals?.contact, 'phoneE164'))
  const email = asText(readField(globals?.contact, 'email'))
  const sameAs = socialProfiles(globals)
  const contactPoint =
    telephone || email
      ? {
          '@type': 'ContactPoint',
          ...(email ? { email } : {}),
          ...(telephone ? { telephone } : {}),
          contactType: 'customer service',
          url: canonicalURL('/contact/', origin),
        }
      : null

  return {
    '@context': SCHEMA_CONTEXT,
    '@id': `${canonicalURL('/', origin)}#organization`,
    '@type': 'Organization',
    ...(contactPoint ? { contactPoint } : {}),
    ...(description ? { description } : {}),
    ...(logo ? { logo } : {}),
    name,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    url: canonicalURL('/', origin),
  }
}

/** The canonical site entity is emitted on the homepage only. */
export function buildWebsiteSchema(
  globals: SchemaGlobals | null | undefined,
  origin: string,
): JsonLdObject | null {
  const name = organizationName(globals)
  if (!name) return null

  return {
    '@context': SCHEMA_CONTEXT,
    '@id': `${canonicalURL('/', origin)}#website`,
    '@type': 'WebSite',
    name,
    publisher: { '@id': `${canonicalURL('/', origin)}#organization` },
    url: canonicalURL('/', origin),
  }
}

/**
 * LocalBusiness is only claimed when the contact global actually carries a
 * postal address; without one there is nothing truthful to publish.
 */
export function buildLocalBusinessSchema(
  globals: SchemaGlobals | null | undefined,
  origin: string,
): JsonLdObject | null {
  const name = organizationName(globals)
  const address = globals?.contact ? readField(globals.contact, 'address') : null
  const city = readText(address, 'city')
  const country = readText(address, 'country')

  if (!name || !city || !country) return null

  const line1 = readText(address, 'line1')
  const line2 = readText(address, 'line2')
  const emirate = readText(address, 'emirate')
  const streetAddress = [...new Set([line1, line2].filter(Boolean))].join(', ') || undefined
  const declaredType = readText(globals?.localBusiness, 'businessType')
  const businessType =
    declaredType && (ALLOWED_BUSINESS_TYPES as readonly string[]).includes(declaredType)
      ? declaredType
      : 'LocalBusiness'
  const telephone = asText(readField(globals?.contact, 'phoneE164'))
  const email = asText(readField(globals?.contact, 'email'))
  const openingHours = buildOpeningHours(globals?.contact)

  return {
    '@context': SCHEMA_CONTEXT,
    '@id': `${canonicalURL('/', origin)}#localbusiness`,
    '@type': businessType,
    address: {
      '@type': 'PostalAddress',
      addressCountry: country,
      addressLocality: city,
      ...(emirate ? { addressRegion: emirate } : {}),
      ...(streetAddress ? { streetAddress } : {}),
    },
    ...(email ? { email } : {}),
    name,
    ...(openingHours.length > 0 ? { openingHoursSpecification: openingHours } : {}),
    ...(telephone ? { telephone } : {}),
    url: canonicalURL('/', origin),
  }
}

function buildOpeningHours(contact: unknown): Record<string, unknown>[] {
  return asArray(readField(contact, 'openingHours'))
    .map((entry): Record<string, unknown> | null => {
      const day = readText(entry, 'day')
      const opens = readText(entry, 'opens')
      const closes = readText(entry, 'closes')
      const closed = readField(entry, 'closed') === true

      if (!day || closed) return null
      if (!opens || !closes) return null
      if (!TIME_PATTERN.test(opens) || !TIME_PATTERN.test(closes)) return null

      const dayOfWeek = DAY_LABELS[day.toLowerCase()]
      if (!dayOfWeek) return null

      return {
        '@type': 'OpeningHoursSpecification',
        closes,
        dayOfWeek: `https://schema.org/${dayOfWeek}`,
        opens,
      }
    })
    .filter((entry) => entry !== null)
}

const recordSummary = (record: SeoRecord | null | undefined): null | string =>
  readText(record ? readField(record, 'seo') : null, 'description', 300) ??
  readText(record, 'summary', 300) ??
  readText(record, 'excerpt', 300)

const serviceAreas = (record: SeoRecord | null | undefined): string[] =>
  asArray(readField(record, 'serviceAreas'))
    .map((entry) => asText(readField(entry, 'area')) ?? asText(entry))
    .filter((area): area is string => Boolean(area))

export function buildServiceSchema(
  record: SeoRecord | null | undefined,
  context: { globals?: SchemaGlobals | null | undefined; now?: Date; origin: string; path: string },
): JsonLdObject | null {
  const name = asText(readField(record, 'title'))
  const globals = context.globals

  if (!name || !isRecordPublished(record, context.now)) return null

  const description = recordSummary(record)
  const providerName = organizationName(globals)
  const areas = serviceAreas(record)

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Service',
    ...(areas.length > 0 ? { areaServed: areas } : {}),
    ...(description ? { description } : {}),
    name,
    ...(providerName
      ? {
          provider: {
            '@id': `${canonicalURL('/', context.origin)}#organization`,
            '@type': 'Organization',
            name: providerName,
            url: canonicalURL('/', context.origin),
          },
        }
      : {}),
    url: canonicalURL(context.path, context.origin),
  }
}

export function buildArticleSchema(
  record: SeoRecord | null | undefined,
  context: { globals?: SchemaGlobals | null | undefined; now?: Date; origin: string; path: string },
): JsonLdObject | null {
  const headline = asText(readField(record, 'title'), 110)

  if (!headline || !isRecordPublished(record, context.now)) return null

  const description = recordSummary(record)
  const publishedAt = readText(record, 'publishedAt')
  const updatedAt = readText(record, 'updatedAt')
  const authorName = asText(readField(asArray(readField(record, 'populatedAuthors'))[0], 'name'))
  const providerName = organizationName(context.globals)

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Article',
    ...(authorName
      ? { author: { '@type': 'Person', name: authorName } }
      : providerName
        ? { author: { '@type': 'Organization', name: providerName } }
        : {}),
    ...(description ? { description } : {}),
    headline,
    mainEntityOfPage: { '@id': canonicalURL(context.path, context.origin), '@type': 'WebPage' },
    ...(publishedAt ? { datePublished: new Date(publishedAt).toISOString() } : {}),
    ...(providerName
      ? { publisher: { '@type': 'Organization', name: providerName, url: canonicalURL('/', context.origin) } }
      : {}),
    ...(updatedAt ? { dateModified: new Date(updatedAt).toISOString() } : {}),
    url: canonicalURL(context.path, context.origin),
  }
}

/**
 * The breadcrumb list mirrors the visible component exactly: Home first, the
 * same labels, and no URL on the final crumb.
 */
export function buildBreadcrumbSchema(
  breadcrumbs: Breadcrumb[] | null | undefined,
  origin: string,
): JsonLdObject | null {
  const visible = (breadcrumbs ?? []).filter((crumb) => asText(crumb.label))

  if (visible.length === 0) return null

  const items = [
    { '@type': 'ListItem', item: canonicalURL('/', origin), name: 'Home', position: 1 },
    ...visible.map((crumb, index) => {
      const item = asText(crumb.href)

      return {
        '@type': 'ListItem',
        ...(item ? { item: canonicalURL(item, origin) } : {}),
        name: asText(crumb.label),
        position: index + 2,
      }
    }),
  ]

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

/** Declared claims win; otherwise each route kind gets its truthful default. */
export function resolveSchemaClaims(
  record: SeoRecord | null | undefined,
  kind: SchemaKind,
): Set<SupportedSchemaType> {
  const declared = asArray(readField(record ? readField(record, 'seo') : null, 'schemaTypes')).filter(
    isSupportedSchemaType,
  )

  if (declared.length > 0) return new Set(declared)

  const defaults: Record<SchemaKind, SupportedSchemaType[]> = {
    archive: ['BreadcrumbList'],
    home: ['BreadcrumbList'],
    page: ['BreadcrumbList'],
    post: ['Article', 'BreadcrumbList'],
    project: ['BreadcrumbList'],
    service: ['Service', 'BreadcrumbList'],
  }

  return new Set(defaults[kind])
}

/** Resolve the schema claims for a declared list, ignoring unsupported values. */
export function isSchemaTypeSupported(value: unknown): value is SupportedSchemaType {
  return isSupportedSchemaType(value)
}

/**
 * Validated global values used by the schema builders. Lazy import keeps pure
 * unit tests free of a Payload boot.
 */
export async function getSchemaGlobals(): Promise<SchemaGlobals> {
  const { getCachedGlobal } = await import('@/utilities/getGlobals')

  const [seoDefaults, siteSettings, contact, social] = await Promise.all([
    getCachedGlobal('seo-defaults', 1)(),
    getCachedGlobal('site-settings', 1)(),
    getCachedGlobal('contact-information', 1)(),
    getCachedGlobal('social-media', 1)(),
  ])

  return {
    brandName: readField(siteSettings, 'brandName'),
    businessName: readField(siteSettings, 'businessName'),
    contact,
    localBusiness: readField(seoDefaults, 'localBusinessSchema'),
    organization: readField(seoDefaults, 'organizationSchema'),
    social,
  }
}

export function buildSchemas(context: SchemaContext): JsonLdObject[] {
  const origin = resolveCanonicalOrigin(context.origin)
  const now = context.now ?? new Date()
  const globals = context.globals
  const schemas: JsonLdObject[] = []

  const organization = context.includeOrganization === false ? null : buildOrganizationSchema(globals, origin)
  if (organization) schemas.push(organization)

  if (context.includeLocalBusiness) {
    const localBusiness = buildLocalBusinessSchema(globals, origin)
    if (localBusiness) schemas.push(localBusiness)
  }

  if (context.kind === 'home') {
    const website = buildWebsiteSchema(globals, origin)
    if (website) schemas.push(website)
  }

  const claims = resolveSchemaClaims(context.record, context.kind)

  if (context.kind === 'service' && claims.has('Service')) {
    const service = buildServiceSchema(context.record, { globals, now, origin, path: context.path })
    if (service) schemas.push(service)
  }

  if (context.kind === 'post' && claims.has('Article')) {
    const article = buildArticleSchema(context.record, { globals, now, origin, path: context.path })
    if (article) schemas.push(article)
  }

  // FAQPage is content derived: it only ever describes the visible, eligible set.
  const faq = buildFaqSchema(context.visibleFaqs, { now })
  if (faq) schemas.push(faq)

  if (claims.has('BreadcrumbList')) {
    const breadcrumbs = buildBreadcrumbSchema(context.breadcrumbs, origin)
    if (breadcrumbs) schemas.push(breadcrumbs)
  }

  return schemas
}
