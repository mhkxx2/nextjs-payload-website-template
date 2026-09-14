import type { ResolvableRedirect } from '@/collections/Redirects'
import { resolveRedirect } from '@/collections/Redirects'

/**
 * Resolve redirects at the request boundary, where the complete pathname and
 * query are available, and emit the exact persisted HTTP status.
 */
export function createRedirectResponse(
  request: Pick<Request, 'url'>,
  records: ResolvableRedirect[],
): Response | undefined {
  const requestURL = new URL(request.url)
  const source = `${requestURL.pathname}${requestURL.search}`
  const redirectItem = resolveRedirect(source, records)

  if (!redirectItem) return undefined
  if (redirectItem.type !== 301 && redirectItem.type !== 302) return undefined

  return Response.redirect(new URL(redirectItem.destination, requestURL), redirectItem.type)
}
