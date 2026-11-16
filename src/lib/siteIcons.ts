import { readFile } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'
import { getPayload } from 'payload'

import configPromise from '@payload-config'
import type { Media } from '@/payload-types'

export { SITE_ICON_PATHS } from '@/lib/siteIconPaths'

const MEDIA_DIR = path.join(process.cwd(), 'storage/media')
const FALLBACK_SVG = path.join(process.cwd(), 'public/favicon.svg')

type IconKind = 'apple' | 'favicon' | 'icon'

const TARGET_SIZE: Record<IconKind, number> = {
  apple: 180,
  favicon: 48,
  icon: 192,
}

const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'filename' in value ? (value as Media) : null

async function loadCmsSource(kind: IconKind): Promise<Buffer | null> {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
    overrideAccess: true,
  })

  const preferred =
    kind === 'apple'
      ? asMedia(settings.appleTouchIcon) || asMedia(settings.favicon)
      : asMedia(settings.favicon) || asMedia(settings.appleTouchIcon)

  if (!preferred?.filename) return null

  try {
    return await readFile(path.join(MEDIA_DIR, preferred.filename))
  } catch {
    return null
  }
}

async function loadFallbackSource(): Promise<Buffer> {
  return readFile(FALLBACK_SVG)
}

/**
 * Crawlable site icons for Google Search / browsers.
 * Served from public paths (not `/api/…`) because robots.txt disallows `/api/`.
 */
export async function buildSiteIcon(kind: IconKind): Promise<{
  body: Buffer
  contentType: 'image/png'
  etag: string
}> {
  const source = (await loadCmsSource(kind)) ?? (await loadFallbackSource())
  const size = TARGET_SIZE[kind]
  const body = await sharp(source)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer()

  const etag = `"${kind}-${size}-${body.length.toString(16)}"`
  return { body, contentType: 'image/png', etag }
}
