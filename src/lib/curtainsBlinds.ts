import { CANONICAL_ORIGIN } from '@/seed/business'
import { whatsappHref } from '@/lib/contactLinks'
import type { CurtainBlindCategory, CurtainBlindProduct, Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

/** Imported reference prices are not confirmed Al Rukn selling prices. */
export const SHOW_CATALOGUE_PRICES = false

const absoluteURL = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${CANONICAL_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

export type CatalogueMedia = {
  alt: string
  height: number
  url: string
  width: number
}

export type CatalogueCategoryCard = {
  description?: null | string
  id: number | string
  image: CatalogueMedia | null
  name: string
  slug: string
  type: 'blind' | 'curtain'
}

export type CatalogueProductCard = {
  badge: CurtainBlindProduct['badge']
  categories: Array<{ name: string; slug: string }>
  href: string
  id: number | string
  image: CatalogueMedia
  name: string
  priceSuffix: string
  productType: 'blind' | 'curtain'
  quoteHref: string
  regularPrice?: null | number
  salePrice?: null | number
  secondaryImage?: CatalogueMedia | null
  sku?: null | string
  slug: string
  whatsappURL: string | null
}

const localMediaURL = (url: string, cacheTag?: null | string) => {
  const resolved = getMediaUrl(url, cacheTag)
  try {
    const parsed = new URL(resolved)
    if (parsed.hostname === 'alruknfurniture.ae' || parsed.hostname === 'www.alruknfurniture.ae') {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    /* already a local path */
  }
  return resolved
}

export const mediaData = (media: Media | number | null | undefined): CatalogueMedia | null => {
  if (!media || typeof media !== 'object' || !media.url || !media.width || !media.height) return null
  return {
    alt: media.alt || '',
    height: media.height,
    url: localMediaURL(media.url, media.updatedAt),
    width: media.width,
  }
}

export const formatAed = (value?: null | number) => {
  if (value == null || !Number.isFinite(value)) return null
  return `AED ${value.toLocaleString('en-AE', { maximumFractionDigits: 2, minimumFractionDigits: 0 })}`
}

export const badgeLabel = (badge?: CurtainBlindProduct['badge'] | null) => {
  switch (badge) {
    case 'hot-selling':
      return 'Hot Selling'
    case 'most-selling':
      return 'Most Selling'
    case 'new-in':
      return 'New In'
    case 'on-sale':
      return 'Popular'
    default:
      return null
  }
}

export const productPath = (slug: string) => `/curtains-blinds/product/${slug}/`

export const HELP_CHOOSING_WHATSAPP_MESSAGE =
  'Hello Al Rukn Furniture, I need help choosing curtains or blinds for my windows. I would like to share photos and get a quotation.'

export const MEASUREMENT_WHATSAPP_MESSAGE =
  'Hello Al Rukn Furniture, I would like to book a window measurement for curtains or blinds. Area: ___'

export const buildProductQuoteMessage = (input: {
  category?: null | string
  name: string
  path: string
  priceLabel?: null | string
  sku?: null | string
}) =>
  [
    'Hello Al Rukn Furniture,',
    'I would like a quotation for:',
    '',
    `Product: ${input.name}`,
    input.category ? `Category: ${input.category}` : null,
    input.sku ? `SKU: ${input.sku}` : null,
    input.priceLabel ? `Price shown: ${input.priceLabel}` : null,
    `Page: ${absoluteURL(input.path)}`,
    '',
    'Please send me more details and measurement/installation information.',
  ]
    .filter(Boolean)
    .join('\n')

export const productCardData = (
  product: CurtainBlindProduct,
  whatsappNumber?: null | string,
): CatalogueProductCard | null => {
  const image = mediaData(product.featuredImage)
  if (!image) return null
  const secondary = mediaData(
    Array.isArray(product.gallery) && product.gallery[0] && typeof product.gallery[0].image === 'object'
      ? product.gallery[0].image
      : null,
  )
  const categories = (product.categories || [])
    .filter((category): category is CurtainBlindCategory => Boolean(category && typeof category === 'object'))
    .map((category) => ({ name: category.name, slug: category.slug }))
  const href = productPath(product.slug)
  const current = product.salePrice ?? product.regularPrice
  const priceLabel = SHOW_CATALOGUE_PRICES ? formatAed(current) : null
  const message = buildProductQuoteMessage({
    category: categories[0]?.name,
    name: product.name,
    path: href,
    priceLabel: priceLabel ? `${priceLabel}${product.priceSuffix || ''}` : null,
    sku: product.sku,
  })
  return {
    badge: product.badge === 'on-sale' && !SHOW_CATALOGUE_PRICES ? 'none' : product.badge,
    categories,
    href,
    id: product.id,
    image,
    name: product.name,
    priceSuffix: product.priceSuffix || '',
    productType: product.productType,
    quoteHref: `${href}#request-quote`,
    regularPrice: SHOW_CATALOGUE_PRICES ? product.regularPrice : null,
    salePrice: SHOW_CATALOGUE_PRICES ? product.salePrice : null,
    secondaryImage: secondary,
    sku: product.sku,
    slug: product.slug,
    whatsappURL: whatsappHref(whatsappNumber, message),
  }
}

export const categoryCardData = (category: CurtainBlindCategory): CatalogueCategoryCard => ({
  description: category.shortDescription,
  id: category.id,
  image: mediaData(category.featuredImage),
  name: category.name,
  slug: category.slug,
  type: category.type,
})
