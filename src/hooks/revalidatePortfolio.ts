import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { collectionTag } from '@/lib/cacheTags'
import { expirePath, expireTag, type CacheInvalidationRequest } from '@/lib/cacheInvalidation'

type PortfolioDocument = { id?: number | string; published?: boolean; slug?: string }
type PortfolioInvalidationArgs = {
  doc: PortfolioDocument
  operation: 'change' | 'delete'
  previousDoc?: PortfolioDocument | null
  req: CacheInvalidationRequest & { context?: Record<string, unknown> }
}

export const revalidatePortfolio = ({
  doc,
  operation,
  previousDoc,
  req,
}: PortfolioInvalidationArgs): void => {
  if (req.context?.disableRevalidate === true) return
  const isPublic = operation === 'delete' ? doc.published === true : doc.published === true
  const wasPublic = previousDoc?.published === true
  if (!isPublic && !wasPublic) return

  req.payload.logger.info?.('Revalidating Portfolio collection')
  expireTag(req, collectionTag('portfolio-items'))
  expirePath(req, '/portfolio/')
}

export const revalidatePortfolioAfterChange: CollectionAfterChangeHook = (args) => {
  revalidatePortfolio({
    doc: args.doc,
    operation: 'change',
    previousDoc: args.previousDoc,
    req: args.req as unknown as PortfolioInvalidationArgs['req'],
  })
  return args.doc
}

export const revalidatePortfolioAfterDelete: CollectionAfterDeleteHook = (args) => {
  revalidatePortfolio({
    doc: args.doc,
    operation: 'delete',
    req: args.req as unknown as PortfolioInvalidationArgs['req'],
  })
  return args.doc
}
