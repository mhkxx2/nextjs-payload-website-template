import { NextResponse } from 'next/server'

import { buildSiteIcon } from '@/lib/siteIcons'

export const dynamic = 'force-dynamic'

/** Public favicon — crawlable (not under `/api/`, which robots.txt disallows). */
export async function GET(request: Request): Promise<Response> {
  const { body, contentType, etag } = await buildSiteIcon('favicon')
  if (request.headers.get('if-none-match') === etag) {
    return new NextResponse(null, { status: 304 })
  }

  return new NextResponse(new Uint8Array(body), {
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'Content-Type': contentType,
      ETag: etag,
    },
  })
}
