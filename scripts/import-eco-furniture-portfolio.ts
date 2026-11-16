import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

import dotenv from 'dotenv'
import { getPayload, type Document, type Payload, type RequiredDataFromCollectionSlug } from 'payload'
import sharp from 'sharp'

const SOURCE_SITE = 'eco-furniture.ae'
const STORE_API = 'https://eco-furniture.ae/wp-json/wc/store/v1'
const SOURCE_NOTE = 'Imported from company-owned eco-furniture.ae for Al Rukn portfolio.'
const IMPORT_DIR = resolve(process.cwd(), 'storage/imports/eco-furniture')
const INVENTORY_PATH = resolve(process.cwd(), 'docs/operations/eco-furniture-portfolio-inventory.json')
const REPORT_PATH = resolve(process.cwd(), 'docs/operations/eco-furniture-portfolio-import-report.json')
const USER_AGENT = 'alrukn-portfolio-migration/1.0 (+https://alruknfurniture.ae)'

type EcoImage = { alt?: string; id: number; name?: string; src: string; srcset?: string }
type EcoCategory = { id: number; link: string; name: string; slug: string }
type EcoProduct = { categories: EcoCategory[]; id: number; images: EcoImage[]; name: string; permalink: string }

type Mapping = {
  furnitureType: string
  relatedService: string
  roomCategory: string
}

const CATEGORY_MAP: Record<string, Mapping> = {
  'baby-crib': { furnitureType: 'baby-cribs', relatedService: 'custom-beds-headboards', roomCategory: 'kids-room' },
  'baby-room-drawers': { furnitureType: 'baby-room-drawers', relatedService: 'custom-furniture', roomCategory: 'kids-room' },
  bathroom: { furnitureType: 'bathroom-furniture', relatedService: 'custom-furniture', roomCategory: 'bathroom' },
  beds: { furnitureType: 'beds', relatedService: 'custom-beds-headboards', roomCategory: 'bedroom' },
  'bedside-table': { furnitureType: 'bedside-tables', relatedService: 'custom-furniture', roomCategory: 'bedroom' },
  bookcase: { furnitureType: 'bookcases', relatedService: 'custom-furniture', roomCategory: 'kids-room' },
  'buffet-table': { furnitureType: 'buffet-tables', relatedService: 'custom-furniture', roomCategory: 'dining-room' },
  'bunk-bed': { furnitureType: 'bunk-beds', relatedService: 'custom-beds-headboards', roomCategory: 'kids-room' },
  chair: { furnitureType: 'chairs', relatedService: 'custom-furniture', roomCategory: 'living-room' },
  'chaise-lounge': { furnitureType: 'chaise-lounges', relatedService: 'custom-sofa', roomCategory: 'living-room' },
  'chest-of-drawer': { furnitureType: 'chest-of-drawers', relatedService: 'custom-furniture', roomCategory: 'bedroom' },
  'coffee-table': { furnitureType: 'coffee-tables', relatedService: 'custom-furniture', roomCategory: 'living-room' },
  daybed: { furnitureType: 'daybeds', relatedService: 'custom-sofa', roomCategory: 'living-room' },
  'dining-table': { furnitureType: 'dining-tables', relatedService: 'custom-furniture', roomCategory: 'dining-room' },
  'dressing-table': { furnitureType: 'dressing-tables', relatedService: 'custom-furniture', roomCategory: 'bedroom' },
  'hallway-furniture': { furnitureType: 'hallway-furniture', relatedService: 'custom-furniture', roomCategory: 'living-room' },
  'head-board': { furnitureType: 'headboards', relatedService: 'custom-beds-headboards', roomCategory: 'bedroom' },
  'love-seat': { furnitureType: 'love-seats', relatedService: 'custom-sofa', roomCategory: 'living-room' },
  'ottoman-bench': { furnitureType: 'ottoman-benches', relatedService: 'custom-sofa', roomCategory: 'living-room' },
  'sectional-sofa': { furnitureType: 'sectional-sofas', relatedService: 'custom-sofa', roomCategory: 'living-room' },
  'single-bed': { furnitureType: 'single-beds', relatedService: 'custom-beds-headboards', roomCategory: 'kids-room' },
  sofa: { furnitureType: 'sofas', relatedService: 'custom-sofa', roomCategory: 'living-room' },
  stools: { furnitureType: 'stools', relatedService: 'custom-furniture', roomCategory: 'bedroom' },
  'storage-furniture': { furnitureType: 'storage-furniture', relatedService: 'custom-furniture', roomCategory: 'storage' },
  'study-table': { furnitureType: 'study-tables', relatedService: 'office-furniture', roomCategory: 'office-study' },
  'tv-bed': { furnitureType: 'tv-beds', relatedService: 'custom-beds-headboards', roomCategory: 'bedroom' },
  'tv-unit': { furnitureType: 'tv-units', relatedService: 'custom-furniture', roomCategory: 'living-room' },
  wardrobe: { furnitureType: 'wardrobes', relatedService: 'custom-wardrobes', roomCategory: 'bedroom' },
}

const REJECTED_FILENAMES = new Set(['all.jpg', 'lifter.png', 'tv-1.png'])
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

const decodeEntities = (value: string) => value
  .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)))
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&apos;|&#39;/gi, "'")
  .replace(/&ndash;/gi, '–')
  .replace(/&mdash;/gi, '—')
const slugify = (value: string) => decodeEntities(value).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const cleanText = (value: string) => decodeEntities(value).replace(/[_|]+/g, ' ').replace(/\s+/g, ' ').trim()
const truncate = (value: string, maxLength: number) => value.length <= maxLength
  ? value
  : `${value.slice(0, Math.max(0, maxLength - 1)).replace(/\s+\S*$/, '')}…`
const urlHash = (value: string) => createHash('sha256').update(value).digest('hex').slice(0, 10)
const imageFilename = (product: EcoProduct, image: EcoImage, index: number) => `${slugify(product.name).slice(0, 70)}-${index + 1}-${urlHash(image.src)}.webp`
const sourceFilename = (url: string) => decodeURIComponent(basename(new URL(url).pathname))

const imageAllowed = (image: EcoImage) => {
  try {
    const url = new URL(image.src)
    return url.protocol === 'https:' && url.hostname === SOURCE_SITE && !REJECTED_FILENAMES.has(sourceFilename(image.src).toLowerCase())
  } catch {
    return false
  }
}

const productMapping = (product: EcoProduct) => {
  for (const category of product.categories) {
    const mapping = CATEGORY_MAP[category.slug]
    if (mapping) return { category, mapping }
  }
  return null
}

async function fetchJSON<T>(url: string): Promise<{ data: T; headers: Headers }> {
  const response = await fetch(url, { headers: { 'user-agent': USER_AGENT } })
  if (!response.ok) throw new Error(`Source request failed (${response.status}) for ${url}`)
  return { data: await response.json() as T, headers: response.headers }
}

async function crawlProducts() {
  const first = await fetchJSON<EcoProduct[]>(`${STORE_API}/products?per_page=100&page=1`)
  const pages = Number.parseInt(first.headers.get('x-wp-totalpages') || '1', 10)
  const products = [...first.data]
  for (let page = 2; page <= pages; page += 1) {
    products.push(...(await fetchJSON<EcoProduct[]>(`${STORE_API}/products?per_page=100&page=${page}`)).data)
  }
  return { pages, products }
}

function buildInventory(products: EcoProduct[], pages: number) {
  const seen = new Map<string, number>()
  const categories = new Map<string, {
    imageURLs: string[]
    mappedFurnitureType: string
    mappedRoomCategory: string
    products: number
    sourceCategory: string
    sourceURL: string
  }>()
  const ignored: { product: string; reason: string; url?: string }[] = []
  let imageReferences = 0
  let duplicates = 0

  for (const product of products) {
    const resolved = productMapping(product)
    if (!resolved) {
      ignored.push({ product: product.name, reason: 'No approved furniture category mapping' })
      continue
    }
    const entry = categories.get(resolved.category.slug) ?? {
      imageURLs: [],
      mappedFurnitureType: resolved.mapping.furnitureType,
      mappedRoomCategory: resolved.mapping.roomCategory,
      products: 0,
      sourceCategory: resolved.category.name,
      sourceURL: resolved.category.link,
    }
    entry.products += 1
    for (const image of product.images) {
      imageReferences += 1
      if (!imageAllowed(image)) {
        ignored.push({ product: product.name, reason: 'Known technical/duplicate asset or invalid source URL', url: image.src })
        continue
      }
      if (seen.has(image.src)) {
        duplicates += 1
        seen.set(image.src, (seen.get(image.src) ?? 1) + 1)
        continue
      }
      seen.set(image.src, 1)
      entry.imageURLs.push(image.src)
    }
    categories.set(resolved.category.slug, entry)
  }

  return {
    generatedAt: new Date().toISOString(),
    sourceSite: SOURCE_SITE,
    sourceAPI: STORE_API,
    pagesCrawled: pages,
    productsDiscovered: products.length,
    imageReferences,
    uniqueUsableImageURLs: seen.size,
    duplicateReferencesRemoved: duplicates,
    ignoredAssets: ignored,
    categories: [...categories.entries()].map(([slug, entry]) => ({ slug, usefulImages: entry.imageURLs.length, ...entry })).sort((a, b) => b.usefulImages - a.usefulImages),
  }
}

async function resolveOwner(payload: Payload): Promise<Document> {
  const result = await payload.find({ collection: 'users', depth: 0, limit: 1, overrideAccess: true, sort: 'createdAt' })
  if (!result.docs[0]) throw new Error('No Payload user exists to own imported media.')
  return result.docs[0]
}

async function downloadAndOptimize(product: EcoProduct, image: EcoImage, index: number) {
  mkdirSync(IMPORT_DIR, { recursive: true })
  const filename = imageFilename(product, image, index)
  const path = join(IMPORT_DIR, filename)
  if (existsSync(path)) {
    const existing = readFileSync(path)
    const metadata = await sharp(existing).metadata()
    return { buffer: existing, filename, height: metadata.height ?? 0, path, width: metadata.width ?? 0 }
  }

  const response = await fetch(image.src, { headers: { 'user-agent': USER_AGENT } })
  if (!response.ok) throw new Error(`Image download failed (${response.status}) for ${image.src}`)
  const original = Buffer.from(await response.arrayBuffer())
  if (original.length < 20_000) throw new Error(`Image is suspiciously small (${original.length} bytes)`)
  const decoded = sharp(original, { failOn: 'error', limitInputPixels: 45_000_000 }).rotate()
  const metadata = await decoded.metadata()
  if (!metadata.width || !metadata.height || metadata.width < 600 || metadata.height < 600) {
    throw new Error(`Image dimensions are below 600px (${metadata.width ?? 0}x${metadata.height ?? 0})`)
  }
  const buffer = await decoded.resize({ fit: 'inside', height: 1920, width: 1920, withoutEnlargement: true }).webp({ effort: 4, quality: 86 }).toBuffer()
  writeFileSync(path, buffer)
  const optimized = await sharp(buffer).metadata()
  return { buffer, filename, height: optimized.height ?? 0, path, width: optimized.width ?? 0 }
}

const altText = (product: EcoProduct, image: EcoImage, index: number) => {
  const sourceAlt = cleanText(image.alt || '')
  if (sourceAlt.length >= 12 && sourceAlt.length <= 180) return sourceAlt
  const category = productMapping(product)?.category.name || 'furniture'
  return `${cleanText(product.name)} ${index === 0 ? 'furniture design' : `detail view ${index + 1}`} in the ${cleanText(category).toLowerCase()} collection`
}

const styleFor = (title: string) => {
  const value = title.toLowerCase()
  if (/luxury|premium|velvet|boucl/.test(value)) return 'Luxury'
  if (/minimal|low-profile|simple/.test(value)) return 'Minimal'
  if (/classic|chester|tufted/.test(value)) return 'Classic'
  if (/modern|modular|contemporary/.test(value)) return 'Modern'
  return 'Contemporary'
}

async function ensureMedia(payload: Payload, owner: Document, product: EcoProduct, image: EcoImage, index: number) {
  const existing = await payload.find({ collection: 'media', depth: 0, limit: 1, overrideAccess: true, where: { sourceURL: { equals: image.src } } })
  if (existing.docs[0]) return { created: false, id: existing.docs[0].id }

  const optimized = await downloadAndOptimize(product, image, index)
  const category = productMapping(product)!.category.name
  const checksum = createHash('sha256').update(optimized.buffer).digest('hex')
  const hashMatch = await payload.find({ collection: 'media', depth: 0, limit: 1, overrideAccess: true, where: { sourceHash: { equals: `sha256:${checksum}` } } })
  if (hashMatch.docs[0]) return { created: false, hashDuplicate: true, id: hashMatch.docs[0].id }
  const created = await payload.create({
    collection: 'media',
    context: { disableRevalidate: true },
    data: {
      alt: altText(product, image, index),
      decorative: false,
      importNote: SOURCE_NOTE,
      license: 'Company-owned source asset',
      sourceCategory: category,
      sourceFilename: sourceFilename(image.src),
      sourceHash: `sha256:${checksum}`,
      sourceNotes: `${SOURCE_NOTE} Source product: ${product.permalink} · Optimized WebP SHA-256: ${checksum}`,
      sourceSite: SOURCE_SITE,
      sourceURL: image.src,
      uploadedBy: owner.id,
    },
    file: { data: optimized.buffer, mimetype: 'image/webp', name: optimized.filename, size: optimized.buffer.length },
    overrideAccess: true,
    user: owner,
  })
  return { created: true, hashDuplicate: false, id: created.id }
}

async function ensurePortfolioNavigation(payload: Payload) {
  const header = await payload.findGlobal({ depth: 0, overrideAccess: true, slug: 'header' })
  const navigation = Array.isArray(header.navigation) ? [...header.navigation] : []
  if (navigation.some((item) => item.destination === 'portfolio')) return false
  const servicesIndex = navigation.findIndex((item) => item.destination === 'services')
  navigation.splice(servicesIndex >= 0 ? servicesIndex + 1 : 0, 0, { destination: 'portfolio', label: 'Portfolio' })
  await payload.updateGlobal({ context: { disableRevalidate: true }, data: { navigation }, overrideAccess: true, slug: 'header' })
  return true
}

async function runImport(products: EcoProduct[]) {
  const envFile = process.env.ENV_FILE || '/etc/alruknfurniture/.env'
  try { Object.assign(process.env, dotenv.parse(readFileSync(envFile))) } catch { /* environment may already be exported */ }
  if (!process.env.DATABASE_URI) throw new Error(`DATABASE_URI is not set; expected ${envFile} or exported environment.`)
  const { default: config } = await import('@/payload.config')
  const payload = await getPayload({ config })
  const owner = await resolveOwner(payload)
  const serviceResults = await payload.find({ collection: 'services', depth: 0, limit: 20, overrideAccess: true })
  const services = new Map(serviceResults.docs.map((service) => [service.slug, service.id]))
  const report = { createdItems: 0, createdMedia: 0, failedImages: [] as { product: string; reason: string; url: string }[], hashDuplicatesRemoved: 0, navigationUpdated: false, reusedMedia: 0, skippedExistingItems: 0, skippedProducts: 0, totalImportedMedia: 0, totalPortfolioItems: 0 }
  const featuredRooms = new Set<string>()
  let attemptedImages = 0

  try {
    const selected = Number.isFinite(limit) ? products.slice(0, limit) : products
    for (const [productIndex, product] of selected.entries()) {
      const resolved = productMapping(product)
      if (!resolved) { report.skippedProducts += 1; continue }
      const existing = await payload.find({ collection: 'portfolio-items', depth: 0, limit: 1, overrideAccess: true, where: { sourceURL: { equals: product.permalink } } })
      if (existing.docs[0] && !refresh) { report.skippedExistingItems += 1; continue }

      const usableImages = [...new Map(product.images.filter(imageAllowed).map((image) => [image.src, image])).values()]
      const mediaIDs: (number | string)[] = []
      for (const [imageIndex, image] of usableImages.entries()) {
        if (Number.isFinite(maxImages) && attemptedImages >= maxImages!) break
        attemptedImages += 1
        try {
          const media = await ensureMedia(payload, owner, product, image, imageIndex)
          mediaIDs.push(media.id)
          if (media.created) report.createdMedia += 1
          else {
            report.reusedMedia += 1
            if (media.hashDuplicate) report.hashDuplicatesRemoved += 1
          }
        } catch (error) {
          report.failedImages.push({ product: product.name, reason: error instanceof Error ? error.message : String(error), url: image.src })
        }
      }
      if (mediaIDs.length === 0) { report.skippedProducts += 1; continue }
      const service = services.get(resolved.mapping.relatedService)
      if (!service) throw new Error(`Required service ${resolved.mapping.relatedService} does not exist.`)
      const data = {
        coverImage: mediaIDs[0]!,
        featured: !featuredRooms.has(resolved.mapping.roomCategory),
        furnitureType: resolved.mapping.furnitureType,
        gallery: mediaIDs.slice(1).map((image) => ({ image })),
        isRealAlRuknProject: false,
        metaDescription: truncate(`Browse ${cleanText(product.name)} design inspiration and request custom sizing, materials and finishes from Al Rukn Furniture.`, 160),
        originalFilename: sourceFilename(usableImages[0]!.src),
        published: true,
        relatedService: service,
        roomCategory: resolved.mapping.roomCategory,
        seoTitle: cleanText(product.name).slice(0, 60),
        shortDescription: `Design inspiration for a made-to-measure ${resolved.category.name.toLowerCase()}. Dimensions, materials, upholstery and finishes can be tailored to your space.`,
        slug: slugify(new URL(product.permalink).pathname.split('/').filter(Boolean).pop() || product.name),
        sortOrder: productIndex + 1,
        sourceCategory: resolved.category.name,
        sourceSite: SOURCE_SITE,
        sourceURL: product.permalink,
        style: styleFor(product.name),
        title: cleanText(product.name),
      } as RequiredDataFromCollectionSlug<'portfolio-items'>
      featuredRooms.add(resolved.mapping.roomCategory)
      if (existing.docs[0]) await payload.update({ collection: 'portfolio-items', context: { disableRevalidate: true }, data, id: existing.docs[0].id, overrideAccess: true })
      else { await payload.create({ collection: 'portfolio-items', context: { disableRevalidate: true }, data, overrideAccess: true }); report.createdItems += 1 }
      payload.logger.info(`eco portfolio: ${productIndex + 1}/${selected.length} ${product.name}`)
    }
    report.navigationUpdated = await ensurePortfolioNavigation(payload)
    const [finalItems, finalMedia] = await Promise.all([
      payload.find({ collection: 'portfolio-items', depth: 0, limit: 1, overrideAccess: true, where: { sourceSite: { equals: SOURCE_SITE } } }),
      payload.find({ collection: 'media', depth: 0, limit: 1, overrideAccess: true, where: { sourceSite: { equals: SOURCE_SITE } } }),
    ])
    report.totalPortfolioItems = finalItems.totalDocs
    report.totalImportedMedia = finalMedia.totalDocs
    writeFileSync(REPORT_PATH, `${JSON.stringify({ completedAt: new Date().toISOString(), ...report }, null, 2)}\n`)
    payload.logger.info(`eco portfolio import: ${JSON.stringify(report)}`)
  } finally {
    await payload.destroy()
  }
}

async function main() {
  const { pages, products } = await crawlProducts()
  const inventory = buildInventory(products, pages)
  mkdirSync(resolve(process.cwd(), 'docs/operations'), { recursive: true })
  writeFileSync(INVENTORY_PATH, `${JSON.stringify(inventory, null, 2)}\n`)
  console.log(JSON.stringify({
    categoriesFound: inventory.categories.length,
    duplicateReferencesRemoved: inventory.duplicateReferencesRemoved,
    estimatedItemsToCreate: products.filter(productMapping).length,
    ignoredAssets: inventory.ignoredAssets.length,
    imageReferences: inventory.imageReferences,
    inventoryPath: INVENTORY_PATH,
    pagesCrawled: inventory.pagesCrawled,
    productsDiscovered: inventory.productsDiscovered,
    uniqueUsableImages: inventory.uniqueUsableImageURLs,
  }, null, 2))
  if (!execute) {
    console.log('Dry run complete. Re-run with --execute and optionally --limit=10 for a sample import.')
    return
  }
  await runImport(products)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`eco portfolio import failed: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  })
