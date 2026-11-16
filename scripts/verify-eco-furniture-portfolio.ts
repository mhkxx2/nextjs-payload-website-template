import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import dotenv from 'dotenv'
import { getPayload } from 'payload'

async function main() {
  const envFile = process.env.ENV_FILE || '/etc/alruknfurniture/.env'
  try { Object.assign(process.env, dotenv.parse(readFileSync(envFile))) } catch { /* environment may already be exported */ }
  if (!process.env.DATABASE_URI) throw new Error(`DATABASE_URI is not set; expected ${envFile} or exported environment.`)

  const { default: config } = await import('@/payload.config')
  const payload = await getPayload({ config })

  try {
    const [items, media, header] = await Promise.all([
      payload.find({ collection: 'portfolio-items', depth: 1, limit: 250, overrideAccess: true, where: { sourceSite: { equals: 'eco-furniture.ae' } } }),
      payload.find({ collection: 'media', depth: 0, limit: 1000, overrideAccess: true, where: { sourceSite: { equals: 'eco-furniture.ae' } } }),
      payload.findGlobal({ depth: 0, overrideAccess: true, slug: 'header' }),
    ])

    const missingFiles = media.docs
      .filter((asset) => !asset.filename || !existsSync(resolve(process.cwd(), 'storage/media', asset.filename)))
      .map((asset) => ({ filename: asset.filename, id: asset.id }))
    const invalidMedia = media.docs.filter((asset) =>
      !asset.alt || !asset.sourceURL || !asset.sourceHash || !asset.sourceCategory || !asset.sourceFilename ||
      asset.license !== 'Company-owned source asset' || asset.importNote !== 'Imported from company-owned eco-furniture.ae for Al Rukn portfolio.',
    )
    const invalidItems = items.docs.filter((item) =>
      !item.coverImage || !item.relatedService || item.isRealAlRuknProject !== false || !item.sourceURL ||
      /&(?:#\d+|#x[0-9a-f]+|[a-z]+);/i.test(item.title),
    )
    const portfolioInNavigation = Array.isArray(header.navigation) && header.navigation.some((item) => item.destination === 'portfolio')
    const countBy = (key: 'furnitureType' | 'roomCategory' | 'sourceCategory') => Object.fromEntries(
      [...new Set(items.docs.map((item) => String(item[key])))].sort().map((value) => [
        value,
        items.docs.filter((item) => String(item[key]) === value).length,
      ]),
    )

    console.log(JSON.stringify({
      invalidItems: invalidItems.map((item) => item.id),
      invalidMedia: invalidMedia.map((asset) => asset.id),
      items: items.totalDocs,
      media: media.totalDocs,
      missingFiles,
      portfolioInNavigation,
      roomCounts: countBy('roomCategory'),
      sourceCategoryCounts: countBy('sourceCategory'),
      typeCounts: countBy('furnitureType'),
      sample: items.docs.slice(0, 3).map((item) => ({
        galleryImages: Array.isArray(item.gallery) ? item.gallery.length : 0,
        roomCategory: item.roomCategory,
        sourceURL: item.sourceURL,
        title: item.title,
      })),
    }, null, 2))

    if (missingFiles.length || invalidMedia.length || invalidItems.length || !portfolioInNavigation) process.exitCode = 1
  } finally {
    await payload.destroy()
  }
}

main()
  .then(() => process.exit(process.exitCode || 0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
