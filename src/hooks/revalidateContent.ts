import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
} from 'payload'

import { SITEMAP_CACHE_TAG, collectionTag, documentTag } from '@/lib/cacheTags'
import { expirePath, expireTag } from '@/lib/cacheInvalidation'
import { canonicalPath, type CanonicalPathKind } from '@/lib/routes'
import { isPubliclyPublished } from '@/lib/publication'

type ContentCollection = 'areas' | 'faqs' | 'pages' | 'posts' | 'projects' | 'services' | 'testimonials'
type ContentDocument = Record<string, unknown> & {
  _status?: null | string
  id?: number | string
  publishedAt?: Date | null | string
  slug?: null | string
  status?: null | string
}
type RelatedCollection = 'pages' | 'posts' | 'projects' | 'services'
type RequestLike = {
  context?: Record<string, unknown>
  payload: {
    find: (args: Record<string, unknown>) => Promise<{ docs: ContentDocument[] }>
    logger: { info: (message: string) => void; warn?: (message: string) => void }
  }
  user?: { id?: number | string } | null
}

export type RevalidateContentArgs = {
  collection: ContentCollection
  doc: ContentDocument
  operation: 'change' | 'delete'
  previousDoc?: ContentDocument | null
  req: RequestLike
}

const collectionRoutes: Record<
  ContentCollection,
  { index?: string; kind?: CanonicalPathKind }
> = {
  areas: {},
  faqs: {},
  pages: { kind: 'page' },
  posts: { index: '/blog/', kind: 'post' },
  projects: { index: '/projects/', kind: 'project' },
  services: { index: '/services/', kind: 'service' },
  testimonials: {},
}

const homepageCollections = new Set<ContentCollection>([
  'areas',
  'faqs',
  'projects',
  'services',
  'testimonials',
])

const relationFields: Record<
  ContentCollection,
  Array<{ collection: RelatedCollection; field: string; kind: CanonicalPathKind }>
> = {
  areas: [{ collection: 'pages', field: 'landingPage', kind: 'page' }],
  faqs: [{ collection: 'services', field: 'services', kind: 'service' }],
  pages: [],
  posts: [
    { collection: 'services', field: 'services', kind: 'service' },
    { collection: 'posts', field: 'relatedPosts', kind: 'post' },
  ],
  projects: [{ collection: 'services', field: 'service', kind: 'service' }],
  services: [
    { collection: 'projects', field: 'projects', kind: 'project' },
    { collection: 'services', field: 'relatedServices', kind: 'service' },
  ],
  testimonials: [
    { collection: 'services', field: 'service', kind: 'service' },
    { collection: 'projects', field: 'project', kind: 'project' },
  ],
}

const asRelations = (value: unknown): unknown[] =>
  value == null ? [] : Array.isArray(value) ? value : [value]

const addCanonicalPath = (
  paths: Set<string>,
  kind: CanonicalPathKind,
  document: ContentDocument,
): void => {
  if (typeof document.slug !== 'string') return
  if (kind === 'page' && document.slug === 'home') {
    paths.add('/')
    return
  }
  try {
    paths.add(canonicalPath(kind, document.slug))
  } catch {
    // Invalid legacy values must not prevent the remaining cache entries from being purged.
  }
}

async function addRelatedPaths(
  paths: Set<string>,
  collection: ContentCollection,
  documents: ContentDocument[],
  req: RequestLike,
  now: Date,
): Promise<void> {
  for (const relation of relationFields[collection]) {
    const ids = new Set<number | string>()

    for (const document of documents) {
      for (const value of asRelations(document[relation.field])) {
        if (typeof value === 'object' && value !== null) {
          const populated = value as ContentDocument
          if (typeof populated.id === 'number' || typeof populated.id === 'string') {
            ids.add(populated.id)
          } else if (isPubliclyPublished(populated, now)) {
            addCanonicalPath(paths, relation.kind, populated)
          }
        } else if (typeof value === 'number' || typeof value === 'string') {
          ids.add(value)
        }
      }
    }

    if (ids.size === 0) continue

    const related = await req.payload.find({
      collection: relation.collection,
      depth: 0,
      limit: ids.size,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [
          { id: { in: [...ids] } },
          { _status: { equals: 'published' } },
          { status: { equals: 'published' } },
          { publishedAt: { less_than_equal: now.toISOString() } },
        ],
      },
    })

    for (const document of related.docs) addCanonicalPath(paths, relation.kind, document)
  }
}

/**
 * Invalidates only publicly reachable content and explicitly related public records.
 * Relation lookups repeat the public publication predicate even for internal hooks,
 * so drafts and future schedules are never loaded for cache regeneration.
 */
export async function revalidateContent({
  collection,
  doc,
  operation,
  previousDoc,
  req,
}: RevalidateContentArgs): Promise<void> {
  if (req.context?.disableRevalidate === true) return

  const now = new Date()
  const currentIsPublic = operation === 'change' && isPubliclyPublished(doc, now)
  const previousIsPublic = previousDoc ? isPubliclyPublished(previousDoc, now) : false
  const deletedIsPublic = operation === 'delete' && isPubliclyPublished(doc, now)

  if (!currentIsPublic && !previousIsPublic && !deletedIsPublic) return

  const paths = new Set<string>()
  const route = collectionRoutes[collection]
  const relatedFrom: ContentDocument[] = []

  if (currentIsPublic || deletedIsPublic) {
    if (route.kind) addCanonicalPath(paths, route.kind, doc)
    relatedFrom.push(doc)
  }
  if (previousIsPublic && previousDoc) {
    if (route.kind) addCanonicalPath(paths, route.kind, previousDoc)
    relatedFrom.push(previousDoc)
  }

  if (route.index) paths.add(route.index)
  if (
    homepageCollections.has(collection) ||
    (currentIsPublic && doc.featured === true) ||
    (deletedIsPublic && doc.featured === true) ||
    (previousIsPublic && previousDoc?.featured === true)
  ) {
    paths.add('/')
  }

  await addRelatedPaths(paths, collection, relatedFrom, req, now)

  for (const path of paths) {
    req.payload.logger.info(`Revalidating content at path: ${path}`)
    expirePath(req, path)
  }
  expireTag(req, SITEMAP_CACHE_TAG)
  expireTag(req, collectionTag(collection))
  for (const document of relatedFrom) {
    if (typeof document.slug === 'string') {
      expireTag(req, documentTag(collection, document.slug))
    }
  }
}

export const revalidateContentAfterChange: CollectionAfterChangeHook = async (args) => {
  await revalidateContent({
    collection: args.collection.slug as ContentCollection,
    doc: args.doc,
    operation: 'change',
    previousDoc: args.previousDoc,
    req: args.req as unknown as RequestLike,
  })
  return args.doc
}

export const revalidateContentAfterDelete: CollectionAfterDeleteHook = async (args) => {
  await revalidateContent({
    collection: args.collection.slug as ContentCollection,
    doc: args.doc,
    operation: 'delete',
    req: args.req as unknown as RequestLike,
  })
  return args.doc
}

/** Records authenticated ownership without allowing callers to forge audit fields. */
export const populateContentAudit: CollectionBeforeChangeHook = ({ data, operation, originalDoc, req }) => {
  const next = { ...data }
  const userID = req.user?.id

  if (operation === 'create') {
    if (userID != null) next.createdBy = userID
  } else if (originalDoc?.createdBy != null) {
    next.createdBy =
      typeof originalDoc.createdBy === 'object' ? originalDoc.createdBy.id : originalDoc.createdBy
  }
  if (userID != null) next.updatedBy = userID

  return next
}

/** A published state always has a valid date; drafts may remain unscheduled. */
export const validatePublicationSchedule: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const next = { ...data }
  const status = next.status ?? originalDoc?.status
  const publishedAt = next.publishedAt ?? originalDoc?.publishedAt

  if (status === 'published') {
    const timestamp =
      publishedAt instanceof Date
        ? publishedAt.getTime()
        : typeof publishedAt === 'string'
          ? Date.parse(publishedAt)
          : Number.NaN
    if (!Number.isFinite(timestamp)) {
      throw new Error('A valid publication date is required before publishing.')
    }
  }

  return next
}
