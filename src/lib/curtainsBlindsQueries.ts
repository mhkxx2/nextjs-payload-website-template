import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { collectionTag } from '@/lib/cacheTags'
import type { CurtainBlindCategory, CurtainBlindProduct } from '@/payload-types'

export const getCurtainBlindCategories = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'curtain-blind-categories',
      depth: 1,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: 'sortOrder',
      where: { active: { equals: true } },
    })
    return result.docs as CurtainBlindCategory[]
  },
  ['curtain-blind-categories-public'],
  { tags: [collectionTag('curtain-blind-categories')] },
)

export const getCurtainBlindProducts = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'curtain-blind-products',
      depth: 2,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      sort: 'sortOrder',
      where: { active: { equals: true } },
    })
    return result.docs as CurtainBlindProduct[]
  },
  ['curtain-blind-products-public'],
  { tags: [collectionTag('curtain-blind-products')] },
)

export const getCurtainBlindProductBySlug = async (slug: string) => {
  const cached = unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'curtain-blind-products',
        depth: 2,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        where: {
          and: [{ active: { equals: true } }, { slug: { equals: slug } }],
        },
      })
      return (result.docs[0] as CurtainBlindProduct | undefined) ?? null
    },
    ['curtain-blind-product', slug],
    { tags: [collectionTag('curtain-blind-products'), `document:curtain-blind-products:${slug}`] },
  )
  return cached()
}
