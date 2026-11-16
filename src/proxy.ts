import { isApplicationOwnedPath } from '@/lib/routes'
import { createRedirectResponse } from '@/lib/redirectResponse'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Deterministic redirect resolution: a request either matches exactly one stored
 * redirect (and gets its persisted 301/302 status) or is handed straight to the
 * application.
 *
 * The fixed storefront routes are owned by the app (see APPLICATION_OWNED_PATHS
 * in `routes.ts`), so a stored redirect only answers paths the app itself does
 * not serve. CMS-backed detail paths are not in that static list: add redirects
 * for retired paths only, never as a source over a slug that is still in use.
 */
export async function proxy(request: NextRequest): Promise<NextResponse | Response> {
  // A plain Request (as used by the proxy contract tests) has no `nextUrl`.
  if (isApplicationOwnedPath(new URL(request.url).pathname)) {
    return NextResponse.next()
  }

  const redirects = await getCachedRedirects()()
  return createRedirectResponse(request, redirects) ?? NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!admin(?:/|$)|api(?:/|$)|assets(?:/|$)|graphql(?:/|$)|health(?:/|$)|internal(?:/|$)|media(?:/|$)|next(?:/|$)|static(?:/|$)|system(?:/|$)|uploads(?:/|$)|_next(?:/|$)|favicon\\.ico$|icon\\.png$|apple-touch-icon\\.png$|robots\\.txt$|sitemap\\.xml$).*)',
  ],
}
