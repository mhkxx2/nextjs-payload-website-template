import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

import dotenv from 'dotenv'
import { getPayload, type Document, type Payload, type RequiredDataFromCollectionSlug } from 'payload'
import sharp from 'sharp'

const SOURCE_SITE = 'curtainsandblind.ae'
const STORE_API = 'https://curtainsandblind.ae/wp-json/wc/store/v1'
const SOURCE_NOTE = 'Imported catalogue asset from curtainsandblind.ae with permission for Al Rukn Furniture Curtains & Blinds catalogue.'
const IMPORT_DIR = resolve(process.cwd(), 'storage/imports/curtains-blinds')
const INVENTORY_PATH = resolve(process.cwd(), 'docs/operations/curtains-blinds-catalogue-inventory.json')
const REPORT_PATH = resolve(process.cwd(), 'docs/operations/curtains-blinds-catalogue-import-report.json')
const USER_AGENT = 'alrukn-curtains-blinds-migration/1.0 (+https://alruknfurniture.ae)'

const FEATURED_SHOP_SLUGS = new Set([
  'sheer',
  'blackout-curtains',
  'wave-curtains',
  'linen-curtains',
  'silk-curtains',
  'pencil-pleat-curtains',
  'eyelet-curtains',
  'motorized-curtains',
  'velvet',
  'chiffon-curtains',
  'roller-blinds',
  'zebra-blinds',
  'wooden-bliends',
  'roman-blinds',
  'venetian-blinds',
  'vertical-blinds',
  'motorized-blinds',
  'blackout-blinds',
  'honeycomb-blinds',
])

const SKIP_CATEGORY_SLUGS = new Set([
  'uncategorized',
  'roman-blinds-blinds',
  'roman-blinds-blinds-2',
])

const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  'wooden-bliends': 'Wooden Blinds',
  'soundproof-crutains': 'Soundproof Curtains',
  sheer: 'Sheer Curtains',
  velvet: 'Velvet Curtains',
}

const FORBIDDEN_PATTERNS = [
  /curtainsandblind\.ae/gi,
  /\bCurtains\s+and\s+Blind\b/gi,
  /\+971\s*50\s*213\s*6026/gi,
  /\+971502136026/gi,
  /info@curtainsandblind\.ae/gi,
  /Al\s*Ameed\s*Plaza/gi,
  /Al\s*Asayel\s*St[^.]*/gi,
  /Al\s*Quoz\s*4[^.]*/gi,
]

type StoreImage = { alt?: string; id?: number; name?: string; src: string; thumbnail?: string }
type StoreCategory = {
  count?: number
  id: number
  image?: StoreImage | null
  name: string
  parent: number
  permalink?: string
  slug: string
}
type StoreAttribute = { name: string; terms?: { name: string }[] }
type StorePrices = {
  currency_code?: string
  currency_minor_unit?: number
  on_sale?: boolean
  price?: string
  regular_price?: string
  sale_price?: string
}
type StoreProduct = {
  attributes?: StoreAttribute[]
  categories: { id: number; name: string; slug: string }[]
  description?: string
  id: number
  images: StoreImage[]
  name: string
  on_sale?: boolean
  permalink: string
  prices?: StorePrices
  short_description?: string
  sku?: string
  slug: string
}

type Badge = 'none' | 'on-sale' | 'new-in' | 'most-selling' | 'hot-selling'

const args = process.argv.slice(2)
const execute = args.includes('--execute')
const refresh = args.includes('--refresh')
const option = (name: string) => {
  const inline = args.find((argument) => argument.startsWith(`--${name}=`))
  if (inline) return inline.slice(name.length + 3)
  const index = args.indexOf(`--${name}`)
  return index >= 0 ? args[index + 1] : undefined
}
const limit = option('limit') ? Number.parseInt(option('limit')!, 10) : undefined
const maxImages = option('max-images') ? Number.parseInt(option('max-images')!, 10) : undefined

const decodeEntities = (value: string) =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')

const slugify = (value: string) =>
  decodeEntities(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const cleanText = (value: string) => decodeEntities(value).replace(/[_|]+/g, ' ').replace(/\s+/g, ' ').trim()

const stripHtml = (value: string) =>
  cleanText(
    decodeEntities(value)
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\n{3,}/g, '\n\n'),
  )

const sanitizeCopy = (value: string) => {
  let next = stripHtml(value)
  for (const pattern of FORBIDDEN_PATTERNS) next = next.replace(pattern, ' ')
  return next.replace(/\s+/g, ' ').trim()
}

const truncate = (value: string, maxLength: number) =>
  value.length <= maxLength
    ? value
    : `${value.slice(0, Math.max(0, maxLength - 1)).replace(/\s+\S*$/, '')}…`

const urlHash = (value: string) => createHash('sha256').update(value).digest('hex').slice(0, 10)
const sourceFilename = (url: string) => decodeURIComponent(basename(new URL(url).pathname))

const money = (raw: string | undefined, minorUnit = 2) => {
  if (!raw) return undefined
  const cents = Number.parseInt(raw, 10)
  if (!Number.isFinite(cents)) return undefined
  return Number((cents / 10 ** minorUnit).toFixed(2))
}

async function fetchJSON<T>(url: string): Promise<{ data: T; headers: Headers }> {
  const response = await fetch(url, { headers: { 'user-agent': USER_AGENT } })
  if (!response.ok) throw new Error(`Source request failed (${response.status}) for ${url}`)
  return { data: (await response.json()) as T, headers: response.headers }
}

async function crawlCategories() {
  const { data } = await fetchJSON<StoreCategory[]>(`${STORE_API}/products/categories?per_page=100`)
  return data.filter((category) => !SKIP_CATEGORY_SLUGS.has(category.slug))
}

async function crawlProducts() {
  const first = await fetchJSON<StoreProduct[]>(`${STORE_API}/products?per_page=100&page=1`)
  const pages = Number.parseInt(first.headers.get('x-wp-totalpages') || '1', 10)
  const products = [...first.data]
  for (let page = 2; page <= pages; page += 1) {
    products.push(...(await fetchJSON<StoreProduct[]>(`${STORE_API}/products?per_page=100&page=${page}`)).data)
  }
  return { pages, products }
}

function resolveType(
  category: StoreCategory,
  byId: Map<number, StoreCategory>,
): 'curtain' | 'blind' | null {
  let current: StoreCategory | undefined = category
  const seen = new Set<number>()
  while (current) {
    if (seen.has(current.id)) break
    seen.add(current.id)
    if (current.slug === 'curtains' || current.parent === 0 && /curtain/i.test(current.name)) return 'curtain'
    if (current.slug === 'blinds' || current.parent === 0 && /blind/i.test(current.name)) return 'blind'
    if (current.slug.includes('curtain')) return 'curtain'
    if (current.slug.includes('blind')) return 'blind'
    current = current.parent ? byId.get(current.parent) : undefined
  }
  return null
}

function categorySourceURL(category: StoreCategory) {
  return category.permalink || `https://curtainsandblind.ae/product-category/${category.slug}/`
}

function imageAllowed(image: StoreImage) {
  try {
    const url = new URL(image.src)
    return url.protocol === 'https:' && url.hostname === SOURCE_SITE && !/-300x300\./i.test(url.pathname)
  } catch {
    return false
  }
}

function preferFullImage(src: string) {
  return src.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1')
}

function extractFeatures(product: StoreProduct) {
  const features: { label: string; value: string }[] = []
  for (const attribute of product.attributes || []) {
    const label = cleanText(attribute.name).replace(/:$/, '')
    const value = (attribute.terms || []).map((term) => cleanText(term.name)).filter(Boolean).join(', ')
    if (label && value) features.push({ label, value })
  }
  const table = product.short_description || ''
  const rowMatches = [...table.matchAll(/<tr[^>]*>\s*<t[dh][^>]*>([\s\S]*?)<\/t[dh]>\s*<t[dh][^>]*>([\s\S]*?)<\/t[dh]>\s*<\/tr>/gi)]
  for (const match of rowMatches) {
    const label = sanitizeCopy(match[1] || '')
    const value = sanitizeCopy(match[2] || '')
    if (label && value && !features.some((feature) => feature.label === label)) {
      features.push({ label, value })
    }
  }
  return features.slice(0, 12)
}

function resolveBadge(product: StoreProduct): Badge {
  if (product.on_sale || product.prices?.price !== product.prices?.regular_price) return 'on-sale'
  return 'none'
}

function productTypeFromCategories(
  product: StoreProduct,
  categoryTypeBySlug: Map<string, 'curtain' | 'blind'>,
): 'curtain' | 'blind' {
  for (const category of product.categories) {
    const type = categoryTypeBySlug.get(category.slug)
    if (type) return type
    if (category.slug.includes('curtain') || /curtain/i.test(category.name)) return 'curtain'
    if (category.slug.includes('blind') || /blind/i.test(category.name)) return 'blind'
  }
  return 'curtain'
}

function buildInventory(categories: StoreCategory[], products: StoreProduct[], pages: number) {
  const byId = new Map(categories.map((category) => [category.id, category]))
  const imageURLs = new Set<string>()
  let imageReferences = 0
  for (const product of products) {
    for (const image of product.images || []) {
      imageReferences += 1
      if (imageAllowed(image)) imageURLs.add(preferFullImage(image.src))
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    sourceSite: SOURCE_SITE,
    sourceAPI: STORE_API,
    pagesCrawled: pages,
    categoriesDiscovered: categories.length,
    productsDiscovered: products.length,
    imageReferences,
    uniqueUsableImageURLs: imageURLs.size,
    categories: categories.map((category) => ({
      id: category.id,
      name: DISPLAY_NAME_OVERRIDES[category.slug] || category.name,
      parent: category.parent,
      slug: category.slug,
      type: resolveType(category, byId),
      count: category.count ?? 0,
      featuredOnShop: FEATURED_SHOP_SLUGS.has(category.slug),
    })),
  }
}

async function resolveOwner(payload: Payload): Promise<Document> {
  const result = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    sort: 'createdAt',
  })
  if (!result.docs[0]) throw new Error('No Payload user exists to own imported media.')
  return result.docs[0]
}

async function downloadAndOptimize(productSlug: string, image: StoreImage, index: number) {
  mkdirSync(IMPORT_DIR, { recursive: true })
  const fullSrc = preferFullImage(image.src)
  const filename = `${slugify(productSlug).slice(0, 60)}-${index + 1}-${urlHash(fullSrc)}.webp`
  const path = join(IMPORT_DIR, filename)
  if (existsSync(path)) {
    const existing = readFileSync(path)
    const metadata = await sharp(existing).metadata()
    return { buffer: existing, filename, height: metadata.height ?? 0, path, source: fullSrc, width: metadata.width ?? 0 }
  }

  let response = await fetch(fullSrc, { headers: { 'user-agent': USER_AGENT } })
  if (!response.ok && fullSrc !== image.src) {
    response = await fetch(image.src, { headers: { 'user-agent': USER_AGENT } })
  }
  if (!response.ok) throw new Error(`Image download failed (${response.status}) for ${fullSrc}`)
  const original = Buffer.from(await response.arrayBuffer())
  if (original.length < 8_000) throw new Error(`Image is suspiciously small (${original.length} bytes)`)
  const decoded = sharp(original, { failOn: 'error', limitInputPixels: 45_000_000 }).rotate()
  const metadata = await decoded.metadata()
  if (!metadata.width || !metadata.height || metadata.width < 400 || metadata.height < 400) {
    throw new Error(`Image dimensions are below 400px (${metadata.width ?? 0}x${metadata.height ?? 0})`)
  }
  const buffer = await decoded
    .resize({ fit: 'inside', height: 1920, width: 1920, withoutEnlargement: true })
    .webp({ effort: 4, quality: 86 })
    .toBuffer()
  writeFileSync(path, buffer)
  const optimized = await sharp(buffer).metadata()
  return {
    buffer,
    filename,
    height: optimized.height ?? 0,
    path,
    source: fullSrc,
    width: optimized.width ?? 0,
  }
}

const altText = (name: string, categoryName: string, index: number) => {
  const base = `${cleanText(name)} ${index === 0 ? 'catalogue design' : `detail view ${index + 1}`}`
  return truncate(`${base} — ${cleanText(categoryName)} available from Al Rukn Furniture`, 160)
}

async function ensureMedia(
  payload: Payload,
  owner: Document,
  productName: string,
  productSlug: string,
  categoryName: string,
  image: StoreImage,
  index: number,
) {
  const fullSrc = preferFullImage(image.src)
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { sourceURL: { equals: fullSrc } },
  })
  if (existing.docs[0]) return { created: false, id: existing.docs[0].id, source: fullSrc }

  const optimized = await downloadAndOptimize(productSlug, image, index)
  const checksum = createHash('sha256').update(optimized.buffer).digest('hex')
  const hashMatch = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { sourceHash: { equals: `sha256:${checksum}` } },
  })
  if (hashMatch.docs[0]) return { created: false, hashDuplicate: true, id: hashMatch.docs[0].id, source: fullSrc }

  const created = await payload.create({
    collection: 'media',
    context: { disableRevalidate: true },
    data: {
      alt: altText(productName, categoryName, index),
      decorative: false,
      importNote: SOURCE_NOTE,
      license: 'Permission granted catalogue asset',
      sourceCategory: categoryName,
      sourceFilename: sourceFilename(optimized.source),
      sourceHash: `sha256:${checksum}`,
      sourceNotes: `${SOURCE_NOTE} Optimized WebP SHA-256: ${checksum}`,
      sourceSite: SOURCE_SITE,
      sourceURL: optimized.source,
      uploadedBy: owner.id,
    },
    file: {
      data: optimized.buffer,
      mimetype: 'image/webp',
      name: optimized.filename,
      size: optimized.buffer.length,
    },
    overrideAccess: true,
    user: owner,
  })
  return { created: true, hashDuplicate: false, id: created.id, source: optimized.source }
}

async function runImport(categories: StoreCategory[], products: StoreProduct[]) {
  const envFile = process.env.ENV_FILE || '/etc/alruknfurniture/.env'
  try {
    Object.assign(process.env, dotenv.parse(readFileSync(envFile)))
  } catch {
    /* environment may already be exported */
  }
  if (!process.env.DATABASE_URI) {
    throw new Error(`DATABASE_URI is not set; expected ${envFile} or exported environment.`)
  }

  const { default: config } = await import('@/payload.config')
  const payload = await getPayload({ config })
  const owner = await resolveOwner(payload)
  const byId = new Map(categories.map((category) => [category.id, category]))
  const categoryTypeBySlug = new Map<string, 'curtain' | 'blind'>()
  const categoryIdBySourceId = new Map<number, number | string>()
  const report = {
    createdCategories: 0,
    createdMedia: 0,
    createdProducts: 0,
    failedImages: [] as { product: string; reason: string; url: string }[],
    hashDuplicatesRemoved: 0,
    reusedMedia: 0,
    skippedExistingCategories: 0,
    skippedExistingProducts: 0,
    skippedProducts: 0,
    totalCategories: 0,
    totalImportedMedia: 0,
    totalProducts: 0,
    updatedCategories: 0,
    updatedProducts: 0,
  }
  let attemptedImages = 0

  try {
    const ordered = [...categories].sort((a, b) => {
      if (a.parent === 0 && b.parent !== 0) return -1
      if (b.parent === 0 && a.parent !== 0) return 1
      return (a.id || 0) - (b.id || 0)
    })

    for (const [index, category] of ordered.entries()) {
      const type = resolveType(category, byId)
      if (!type) continue
      categoryTypeBySlug.set(category.slug, type)
      const sourceURL = categorySourceURL(category)
      const existing = await payload.find({
        collection: 'curtain-blind-categories',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { sourceURL: { equals: sourceURL } },
      })
      const parentId = category.parent ? categoryIdBySourceId.get(category.parent) : undefined
      const name = DISPLAY_NAME_OVERRIDES[category.slug] || cleanText(category.name)
      const data = {
        active: true,
        featuredOnShop: FEATURED_SHOP_SLUGS.has(category.slug),
        metaDescription: truncate(
          `${name} made to measure in Dubai by Al Rukn Furniture. Browse designs and request a quotation.`,
          160,
        ),
        name,
        parent: parentId,
        seoTitle: truncate(`${name} Dubai | Al Rukn Furniture`, 60),
        shortDescription: truncate(
          `Made-to-measure ${name.toLowerCase()} with fabric selection, measurement and professional installation across Dubai, Sharjah and the UAE.`,
          360,
        ),
        slug: category.slug,
        sortOrder: index + 1,
        sourceId: category.id,
        sourceSite: SOURCE_SITE,
        sourceURL,
        type,
      } as RequiredDataFromCollectionSlug<'curtain-blind-categories'>

      let docId: number | string
      if (existing.docs[0] && !refresh) {
        report.skippedExistingCategories += 1
        docId = existing.docs[0].id
      } else if (existing.docs[0]) {
        const updated = await payload.update({
          collection: 'curtain-blind-categories',
          context: { disableRevalidate: true },
          data,
          id: existing.docs[0].id,
          overrideAccess: true,
        })
        docId = updated.id
        report.updatedCategories += 1
      } else {
        const created = await payload.create({
          collection: 'curtain-blind-categories',
          context: { disableRevalidate: true },
          data,
          overrideAccess: true,
        })
        docId = created.id
        report.createdCategories += 1
      }
      categoryIdBySourceId.set(category.id, docId)
    }

    const selected = Number.isFinite(limit) ? products.slice(0, limit) : products
    for (const [productIndex, product] of selected.entries()) {
      const usableCategories = (product.categories || []).filter((category) => !SKIP_CATEGORY_SLUGS.has(category.slug))
      if (usableCategories.length === 0) {
        report.skippedProducts += 1
        continue
      }

      const categoryIDs = usableCategories
        .map((category) => categoryIdBySourceId.get(category.id))
        .filter((id): id is number | string => id != null)
      if (categoryIDs.length === 0) {
        report.skippedProducts += 1
        continue
      }

      const existing = await payload.find({
        collection: 'curtain-blind-products',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { sourceURL: { equals: product.permalink } },
      })
      if (existing.docs[0] && !refresh) {
        report.skippedExistingProducts += 1
        continue
      }

      const usableImages = [
        ...new Map(
          (product.images || [])
            .filter(imageAllowed)
            .map((image) => [preferFullImage(image.src), { ...image, src: preferFullImage(image.src) }]),
        ).values(),
      ]
      const mediaIDs: (number | string)[] = []
      const primaryCategoryName = usableCategories[0]?.name || 'Curtains & Blinds'
      for (const [imageIndex, image] of usableImages.entries()) {
        if (Number.isFinite(maxImages) && attemptedImages >= maxImages!) break
        attemptedImages += 1
        try {
          const media = await ensureMedia(
            payload,
            owner,
            product.name,
            product.slug,
            primaryCategoryName,
            image,
            imageIndex,
          )
          mediaIDs.push(media.id)
          if (media.created) report.createdMedia += 1
          else {
            report.reusedMedia += 1
            if (media.hashDuplicate) report.hashDuplicatesRemoved += 1
          }
        } catch (error) {
          report.failedImages.push({
            product: product.name,
            reason: error instanceof Error ? error.message : String(error),
            url: image.src,
          })
        }
      }
      if (mediaIDs.length === 0) {
        report.skippedProducts += 1
        continue
      }

      const minor = product.prices?.currency_minor_unit ?? 2
      const regularPrice = money(product.prices?.regular_price, minor)
      const salePrice = money(product.prices?.sale_price || product.prices?.price, minor)
      const productType = productTypeFromCategories(product, categoryTypeBySlug)
      const shortDescription = truncate(sanitizeCopy(product.short_description || product.description || ''), 500)
      const fullDescription = truncate(sanitizeCopy(product.description || product.short_description || ''), 5000)
      const data = {
        active: true,
        badge: resolveBadge(product),
        categories: categoryIDs,
        featured: productIndex < 12,
        featuredImage: mediaIDs[0]!,
        features: extractFeatures(product),
        fullDescription,
        gallery: mediaIDs.slice(1).map((image) => ({ image })),
        metaDescription: truncate(
          `${cleanText(product.name)} made to measure in Dubai. Request a quotation from Al Rukn Furniture for measurement and installation.`,
          160,
        ),
        name: cleanText(product.name),
        priceSuffix: '',
        productType,
        regularPrice,
        salePrice: salePrice !== regularPrice ? salePrice : undefined,
        seoTitle: truncate(`${cleanText(product.name)} | Curtains & Blinds Dubai`, 60),
        shortDescription:
          shortDescription ||
          `Catalogue design for made-to-measure ${productType === 'blind' ? 'blinds' : 'curtains'} from Al Rukn Furniture.`,
        sku: cleanText(product.sku || ''),
        slug: product.slug || slugify(product.name),
        sortOrder: productIndex + 1,
        sourceId: product.id,
        sourceSite: SOURCE_SITE,
        sourceURL: product.permalink,
      } as RequiredDataFromCollectionSlug<'curtain-blind-products'>

      if (existing.docs[0]) {
        await payload.update({
          collection: 'curtain-blind-products',
          context: { disableRevalidate: true },
          data,
          id: existing.docs[0].id,
          overrideAccess: true,
        })
        report.updatedProducts += 1
      } else {
        await payload.create({
          collection: 'curtain-blind-products',
          context: { disableRevalidate: true },
          data,
          overrideAccess: true,
        })
        report.createdProducts += 1
      }
      payload.logger.info(`curtains catalogue: ${productIndex + 1}/${selected.length} ${product.name}`)
    }

    // Backfill category featured images from first related product.
    const allCategories = await payload.find({
      collection: 'curtain-blind-categories',
      depth: 0,
      limit: 200,
      overrideAccess: true,
      where: { sourceSite: { equals: SOURCE_SITE } },
    })
    for (const category of allCategories.docs) {
      if (category.featuredImage) continue
      const related = await payload.find({
        collection: 'curtain-blind-products',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        sort: 'sortOrder',
        where: {
          and: [
            { active: { equals: true } },
            { categories: { contains: category.id } },
          ],
        },
      })
      const image = related.docs[0]?.featuredImage
      if (!image) continue
      await payload.update({
        collection: 'curtain-blind-categories',
        context: { disableRevalidate: true },
        data: { featuredImage: typeof image === 'object' ? image.id : image },
        id: category.id,
        overrideAccess: true,
      })
    }

    const [finalCategories, finalProducts, finalMedia] = await Promise.all([
      payload.find({
        collection: 'curtain-blind-categories',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { sourceSite: { equals: SOURCE_SITE } },
      }),
      payload.find({
        collection: 'curtain-blind-products',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { sourceSite: { equals: SOURCE_SITE } },
      }),
      payload.find({
        collection: 'media',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { sourceSite: { equals: SOURCE_SITE } },
      }),
    ])
    report.totalCategories = finalCategories.totalDocs
    report.totalProducts = finalProducts.totalDocs
    report.totalImportedMedia = finalMedia.totalDocs
    mkdirSync(resolve(process.cwd(), 'docs/operations'), { recursive: true })
    writeFileSync(REPORT_PATH, `${JSON.stringify({ completedAt: new Date().toISOString(), ...report }, null, 2)}\n`)
    payload.logger.info(`curtains catalogue import: ${JSON.stringify(report)}`)
  } finally {
    await payload.destroy()
  }
}

async function main() {
  const categories = await crawlCategories()
  const { pages, products } = await crawlProducts()
  const inventory = buildInventory(categories, products, pages)
  mkdirSync(resolve(process.cwd(), 'docs/operations'), { recursive: true })
  writeFileSync(INVENTORY_PATH, `${JSON.stringify(inventory, null, 2)}\n`)
  console.log(
    JSON.stringify(
      {
        categoriesFound: inventory.categoriesDiscovered,
        imageReferences: inventory.imageReferences,
        inventoryPath: INVENTORY_PATH,
        pagesCrawled: inventory.pagesCrawled,
        productsDiscovered: inventory.productsDiscovered,
        uniqueUsableImages: inventory.uniqueUsableImageURLs,
      },
      null,
      2,
    ),
  )
  if (!execute) {
    console.log('Dry run complete. Re-run with --execute and optionally --limit=10 for a sample import.')
    return
  }
  await runImport(categories, products)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`curtains catalogue import failed: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  })
