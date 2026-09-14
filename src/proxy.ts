import { createRedirectResponse } from '@/lib/redirectResponse'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest): Promise<NextResponse | Response> {
  const redirects = await getCachedRedirects()()
  return createRedirectResponse(request, redirects) ?? NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!admin(?:/|$)|api(?:/|$)|assets(?:/|$)|graphql(?:/|$)|health(?:/|$)|internal(?:/|$)|media(?:/|$)|next(?:/|$)|static(?:/|$)|system(?:/|$)|uploads(?:/|$)|_next(?:/|$)|favicon\\.ico$|robots\\.txt$|sitemap\\.xml$).*)',
  ],
}
