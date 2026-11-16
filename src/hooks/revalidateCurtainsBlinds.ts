import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { collectionTag, documentTag } from '@/lib/cacheTags'
import { expirePath, expireTag, type CacheInvalidationRequest } from '@/lib/cacheInvalidation'

type CurtainsDoc = {
  id?: number | string
  active?: boolean
  published?: boolean
  slug?: string
}

type CurtainsInvalidationArgs = {
  collection: 'curtain-blind-categories' | 'curtain-blind-products'
  doc: CurtainsDoc
  operation: 'change' | 'delete'
  previousDoc?: CurtainsDoc | null
  req: CacheInvalidationRequest & { context?: Record<string, unknown> }
}

const isPublic = (doc: CurtainsDoc | null | undefined) =>
  doc?.active === true || doc?.published === true

export const revalidateCurtainsBlinds = ({
  collection,
  doc,
  operation,
  previousDoc,
  req,
}: CurtainsInvalidationArgs): void => {
  if (req.context?.disableRevalidate === true) return

  const nowPublic = operation === 'delete' ? isPublic(doc) : isPublic(doc)
  const wasPublic = isPublic(previousDoc)
  if (!nowPublic && !wasPublic) return

  req.payload.logger.info?.(`Revalidating ${collection}`)
  expireTag(req, collectionTag(collection))
  expirePath(req, '/curtains-blinds/')

  const slugs = new Set<string>()
  if (typeof doc.slug === 'string' && doc.slug) slugs.add(doc.slug)
  if (typeof previousDoc?.slug === 'string' && previousDoc.slug) slugs.add(previousDoc.slug)

  if (collection === 'curtain-blind-products') {
    for (const slug of slugs) {
      expirePath(req, `/curtains-blinds/product/${slug}/`)
      expireTag(req, documentTag(collection, slug))
    }
  }

  if (collection === 'curtain-blind-categories') {
    for (const slug of slugs) {
      expirePath(req, `/curtains-blinds/?category=${slug}`)
    }
  }
}

export const revalidateCurtainBlindCategoriesAfterChange: CollectionAfterChangeHook = (args) => {
  revalidateCurtainsBlinds({
    collection: 'curtain-blind-categories',
    doc: args.doc,
    operation: 'change',
    previousDoc: args.previousDoc,
    req: args.req as unknown as CurtainsInvalidationArgs['req'],
  })
  return args.doc
}

export const revalidateCurtainBlindCategoriesAfterDelete: CollectionAfterDeleteHook = (args) => {
  revalidateCurtainsBlinds({
    collection: 'curtain-blind-categories',
    doc: args.doc,
    operation: 'delete',
    req: args.req as unknown as CurtainsInvalidationArgs['req'],
  })
  return args.doc
}

export const revalidateCurtainBlindProductsAfterChange: CollectionAfterChangeHook = (args) => {
  revalidateCurtainsBlinds({
    collection: 'curtain-blind-products',
    doc: args.doc,
    operation: 'change',
    previousDoc: args.previousDoc,
    req: args.req as unknown as CurtainsInvalidationArgs['req'],
  })
  return args.doc
}

export const revalidateCurtainBlindProductsAfterDelete: CollectionAfterDeleteHook = (args) => {
  revalidateCurtainsBlinds({
    collection: 'curtain-blind-products',
    doc: args.doc,
    operation: 'delete',
    req: args.req as unknown as CurtainsInvalidationArgs['req'],
  })
  return args.doc
}
