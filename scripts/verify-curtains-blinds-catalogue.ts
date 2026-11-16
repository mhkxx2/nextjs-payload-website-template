import { readFileSync } from 'node:fs'

import dotenv from 'dotenv'
import { getPayload } from 'payload'

const SOURCE_SITE = 'curtainsandblind.ae'
const FORBIDDEN = [
  'curtainsandblind.ae',
  '+971502136026',
  'info@curtainsandblind.ae',
  'Al Ameed Plaza',
]

async function main() {
  const envFile = process.env.ENV_FILE || '/etc/alruknfurniture/.env'
  try {
    Object.assign(process.env, dotenv.parse(readFileSync(envFile)))
  } catch {
    /* already exported */
  }
  const { default: config } = await import('@/payload.config')
  const payload = await getPayload({ config })
  try {
    const [categories, products, media, missingImage, samples] = await Promise.all([
      payload.find({ collection: 'curtain-blind-categories', depth: 0, limit: 1, overrideAccess: true, where: { sourceSite: { equals: SOURCE_SITE } } }),
      payload.find({ collection: 'curtain-blind-products', depth: 0, limit: 1, overrideAccess: true, where: { sourceSite: { equals: SOURCE_SITE } } }),
      payload.find({ collection: 'media', depth: 0, limit: 1, overrideAccess: true, where: { sourceSite: { equals: SOURCE_SITE } } }),
      payload.find({
        collection: 'curtain-blind-products',
        depth: 0,
        limit: 20,
        overrideAccess: true,
        where: { and: [{ sourceSite: { equals: SOURCE_SITE } }, { featuredImage: { exists: false } }] },
      }),
      payload.find({
        collection: 'curtain-blind-products',
        depth: 0,
        limit: 100,
        overrideAccess: true,
        where: { sourceSite: { equals: SOURCE_SITE } },
      }),
    ])

    const forbiddenHits: { id: number | string; field: string; slug: string }[] = []
    for (const product of samples.docs) {
      for (const field of ['shortDescription', 'fullDescription', 'name'] as const) {
        const value = String(product[field] || '')
        for (const needle of FORBIDDEN) {
          if (value.includes(needle)) forbiddenHits.push({ field, id: product.id, slug: product.slug })
        }
      }
    }

    console.log(
      JSON.stringify(
        {
          categories: categories.totalDocs,
          forbiddenHits,
          media: media.totalDocs,
          products: products.totalDocs,
          productsMissingFeaturedImage: missingImage.totalDocs,
          sampleForbiddenChecked: samples.docs.length,
        },
        null,
        2,
      ),
    )
  } finally {
    await payload.destroy()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
