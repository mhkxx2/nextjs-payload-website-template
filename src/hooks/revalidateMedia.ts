import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { MEDIA_DEPENDENCY_TAGS } from '@/lib/cacheTags'
import { expirePath, expireTag, type CacheInvalidationRequest } from '@/lib/cacheInvalidation'

type MediaInvalidationArgs = {
  doc: { id?: number | string }
  req: CacheInvalidationRequest & { context?: Record<string, unknown> }
}

export const revalidateMedia = ({ req }: MediaInvalidationArgs): void => {
  if (req.context?.disableRevalidate === true) return

  req.payload.logger.info?.('Revalidating content that references Media')
  for (const tag of new Set(MEDIA_DEPENDENCY_TAGS)) expireTag(req, tag)
  expirePath(req, '/', 'layout')
}

export const revalidateMediaAfterChange: CollectionAfterChangeHook = (args) => {
  revalidateMedia({ doc: args.doc, req: args.req as unknown as MediaInvalidationArgs['req'] })
  return args.doc
}

export const revalidateMediaAfterDelete: CollectionAfterDeleteHook = (args) => {
  revalidateMedia({ doc: args.doc, req: args.req as unknown as MediaInvalidationArgs['req'] })
  return args.doc
}
