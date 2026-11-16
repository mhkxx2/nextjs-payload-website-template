import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ProductDetail } from '@/components/curtains-blinds/ProductDetail'
import { getCurtainBlindProductBySlug } from '@/lib/curtainsBlindsQueries'
import { productPath } from '@/lib/curtainsBlinds'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'

type Params = Promise<{ slug: string }>

// Keep product pages on-demand to avoid prerendering hundreds of catalogue
// entries during low-memory production builds.
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const [product, defaults] = await Promise.all([getCurtainBlindProductBySlug(slug), getSeoDefaults()])
  if (!product) return {}
  const title = product.seoTitle || `${product.name} | Curtains & Blinds Dubai`
  const description =
    product.metaDescription ||
    product.shortDescription ||
    `Request a made-to-measure quotation for ${product.name} from Al Rukn Furniture in Dubai.`
  const metadata = buildMetadata(
    {
      seo: {
        description,
        title,
      },
      title: product.name,
    },
    {
      ...defaults,
      descriptionFallback: description,
      path: productPath(product.slug),
      titleFallback: title,
      titlePattern: '{title}',
    },
  )
  return {
    ...metadata,
    ...(typeof metadata.title === 'string' ? { title: { absolute: metadata.title } } : {}),
  }
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getCurtainBlindProductBySlug(slug)
  if (!product) notFound()
  return <ProductDetail slug={slug} />
}
