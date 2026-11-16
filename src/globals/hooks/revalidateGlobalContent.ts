import type { GlobalAfterChangeHook } from 'payload'

import {
  HOMEPAGE_TAG,
  LAYOUT_TAG,
  METADATA_TAG,
  globalTag,
} from '@/lib/cacheTags'
import {
  expirePath,
  expireTag,
  type CacheInvalidationRequest,
} from '@/lib/cacheInvalidation'

type PathTarget = { path: string; type?: 'layout' | 'page' }
type InvalidationTargets = { paths: PathTarget[]; tags: string[] }

const globalRoutes: Record<string, PathTarget[]> = {
  'about-page': [{ path: '/about-us/' }],
  'archive-settings': [
    { path: '/services/' },
    { path: '/projects/' },
    { path: '/blog/' },
    { path: '/blog/page/[pageNumber]', type: 'page' },
    { path: '/portfolio/' },
  ],
  'contact-information': [
    { path: '/', type: 'layout' },
    { path: '/' },
    { path: '/contact/' },
    { path: '/services/' },
    { path: '/portfolio/' },
  ],
  'contact-page': [{ path: '/contact/' }],
  'google-reviews': [{ path: '/sofa-upholstery/' }],
  footer: [{ path: '/', type: 'layout' }],
  header: [{ path: '/', type: 'layout' }],
  homepage: [{ path: '/' }],
  'seo-defaults': [{ path: '/', type: 'layout' }],
  'site-settings': [
    { path: '/', type: 'layout' },
    { path: '/' },
    { path: '/favicon.ico' },
    { path: '/icon.png' },
    { path: '/apple-touch-icon.png' },
  ],
  'social-media': [{ path: '/', type: 'layout' }],
}

const globalDependencies: Record<string, string[]> = {
  'contact-information': [LAYOUT_TAG, HOMEPAGE_TAG],
  footer: [LAYOUT_TAG],
  header: [LAYOUT_TAG],
  homepage: [HOMEPAGE_TAG],
  'seo-defaults': [METADATA_TAG, LAYOUT_TAG],
  'site-settings': [
    globalTag('header'),
    globalTag('footer'),
    LAYOUT_TAG,
    METADATA_TAG,
    HOMEPAGE_TAG,
  ],
  'social-media': [LAYOUT_TAG],
}

export const globalInvalidationTargets = (slug: string): InvalidationTargets => ({
  paths: globalRoutes[slug] ?? [],
  tags: [globalTag(slug), ...(globalDependencies[slug] ?? [])],
})

export const invalidateGlobalContent = (
  slug: string,
  req: CacheInvalidationRequest & { context?: Record<string, unknown> },
): void => {
  if (req.context?.disableRevalidate === true) return

  const targets = globalInvalidationTargets(slug)
  req.payload.logger.info?.(`Revalidating global content: ${slug}`)
  for (const tag of new Set(targets.tags)) expireTag(req, tag)
  for (const target of targets.paths) expirePath(req, target.path, target.type)
}

export const revalidateGlobalContent: GlobalAfterChangeHook = ({ doc, global, req }) => {
  invalidateGlobalContent(global.slug, req as unknown as Parameters<typeof invalidateGlobalContent>[1])
  return doc
}
