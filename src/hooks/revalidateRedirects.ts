import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

import { revalidateTag } from 'next/cache'

const invalidateRedirectCache = <T>(doc: T, req: PayloadRequest): T => {
  if (req.context.disableRevalidate === true) return doc
  req.payload.logger.info('Revalidating redirects')
  revalidateTag('redirects', 'max')
  return doc
}

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req }) =>
  invalidateRedirectCache(doc, req)

export const revalidateRedirectsAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) =>
  invalidateRedirectCache(doc, req)
