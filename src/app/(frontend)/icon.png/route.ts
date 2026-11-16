import { NextResponse } from 'next/server'

import { buildSiteIcon } from '@/lib/siteIcons'

export const dynamic = 'force-dynamic'

/** 192×192 PNG for Google Search favicon guidelines (multiples of 48px). */
export async function GET(request: Request): Promise<Response> {
  const { body, contentType, etag } = await buildSiteIcon('icon')
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
