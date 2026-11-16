export const SITEMAP_CACHE_TAG = 'sitemap'

export const PAGES_SITEMAP_CACHE_TAGS = ['pages-sitemap', SITEMAP_CACHE_TAG] as const
export const POSTS_SITEMAP_CACHE_TAGS = ['posts-sitemap', SITEMAP_CACHE_TAG] as const

export const CONTENT_COLLECTIONS = [
  'areas',
  'curtain-blind-categories',
  'curtain-blind-products',
  'faqs',
  'media',
  'pages',
  'portfolio-items',
  'posts',
  'projects',
  'services',
  'testimonials',
] as const

export const CONTENT_GLOBALS = [
  'about-page',
  'archive-settings',
  'contact-information',
  'contact-page',
  'footer',
  'header',
  'homepage',
  'seo-defaults',
  'site-settings',
  'google-reviews',
  'social-media',
] as const

export type ContentCollectionSlug = (typeof CONTENT_COLLECTIONS)[number]
export type ContentGlobalSlug = (typeof CONTENT_GLOBALS)[number]

export const globalTag = (slug: string) => `global:${slug}` as const
export const collectionTag = (slug: string) => `collection:${slug}` as const
export const documentTag = (collection: string, slug: string) =>
  `document:${collection}:${slug}` as const

export const LAYOUT_TAG = 'global:layout'
export const METADATA_TAG = 'global:metadata'
export const HOMEPAGE_TAG = 'global:homepage-route'
export const GOOGLE_REVIEWS_CACHE_TAG = 'global:google-reviews'

export const MEDIA_DEPENDENCY_TAGS = [
  ...CONTENT_COLLECTIONS.map(collectionTag),
  ...CONTENT_GLOBALS.map(globalTag),
  LAYOUT_TAG,
  METADATA_TAG,
] as const
