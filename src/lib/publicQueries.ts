import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'

import { isPubliclyPublished } from '@/lib/publication'

export type PublicContentCollection =
  | 'pages'
  | 'posts'
  | 'projects'
  | 'services'
  | 'faqs'
  | 'testimonials'

export type PublicQueryResult<T> = {
  docs: T[]
  hasNextPage: boolean
  hasPrevPage: boolean
  page: number
  totalDocs: number
  totalPages: number
}

type PublicQueryOptions = {
  collection: PublicContentCollection
  depth?: number
  limit?: number
  page?: number
  sort?: string
  where?: Where
}

/**
 * Public reads are constrained twice: the query asks the database for published
 * records only, and every returned document is re-checked against the shared
 * publication rule. Draft preview (enabled only through the preview route)
 * bypasses both on purpose.
 */
export const publicationConstraints = (now: Date = new Date()): Where => ({
  and: [
    {
      _status: {
        equals: 'published',
      },
    },
    {
      status: {
        equals: 'published',
      },
    },
    {
      publishedAt: {
        less_than_equal: now.toISOString(),
      },
    },
  ],
})

const combineConstraints = (where: Where | undefined, draft: boolean, now: Date): Where | undefined => {
  if (draft) return where

  const publication = publicationConstraints(now)

  return where ? ({ and: [where, publication] } as Where) : publication
}

/**
 * The draft flag is passed in rather than read inside: `draftMode()` is a
 * request-scoped dynamic API, so callers that run outside a request (build-time
 * `generateStaticParams`) must be able to query without touching it.
 */
const runQuery = async (options: PublicQueryOptions, draft: boolean) => {
  const now = new Date()
  const payload = await getPayload({ config: configPromise })

  const findOptions = {
    collection: options.collection,
    depth: options.depth ?? 1,
    draft,
    limit: options.limit,
    overrideAccess: draft,
    page: options.page,
    pagination: options.limit !== undefined,
    sort: options.sort,
    where: combineConstraints(options.where, draft, now),
  }

  return payload.find(findOptions as Parameters<typeof payload.find>[0])
}

const keepPublic = <T>(docs: T[], draft: boolean, now: Date): T[] => {
  if (draft) return docs

  return docs.filter((doc) => isPubliclyPublished(doc as Record<string, unknown>, now))
}

/** Single publicly visible record by slug, or null when absent, draft, or scheduled in the future. */
export const queryPublicDocBySlug = async <T>(
  collection: PublicContentCollection,
  slug: string,
  depth = 2,
): Promise<T | null> => {
  const { isEnabled: draft } = await draftMode()
  const now = new Date()
  const result = await runQuery(
    {
      collection,
      depth,
      limit: 1,
      where: { slug: { equals: slug } },
    },
    draft,
  )

  const docs = (result.docs ?? []) as unknown as T[]

  return keepPublic(docs, draft, now)[0] ?? null
}

/** Published index listing with pagination metadata. */
export const queryPublicList = async <T>(
  options: PublicQueryOptions,
): Promise<PublicQueryResult<T>> => {
  const { isEnabled: draft } = await draftMode()
  const now = new Date()
  const result = await runQuery(options, draft)

  return {
    docs: keepPublic((result.docs ?? []) as unknown as T[], draft, now),
    hasNextPage: Boolean(result.hasNextPage),
    hasPrevPage: Boolean(result.hasPrevPage),
    page: result.page ?? 1,
    totalDocs: result.totalDocs ?? 0,
    totalPages: result.totalPages ?? 0,
  }
}

/**
 * Slugs of every publicly visible record, used to prerender static routes.
 *
 * Published-only on purpose and never draft-aware: this runs inside
 * `generateStaticParams`, which Next.js executes at build time without a
 * request, and `draftMode()` is rejected there as a dynamic API used in the
 * wrong context. Draft previews render through the dynamic request path instead.
 */
export const queryPublicSlugs = async (
  collection: PublicContentCollection,
  limit = 1000,
): Promise<string[]> => {
  const now = new Date()
  const result = await runQuery({ collection, limit }, false)

  return ((result.docs ?? []) as unknown as { slug?: null | string }[])
    .filter((doc) => isPubliclyPublished(doc as Record<string, unknown>, now))
    .map((doc) => doc.slug)
    .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0)
}
