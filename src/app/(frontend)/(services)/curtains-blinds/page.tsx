import type { Metadata } from 'next'

import { CurtainsBlindsPage } from '@/components/curtains-blinds/CurtainsBlindsPage'
import { queryServiceBySlug } from '@/components/ServicePage'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'

const SLUG = 'curtains-blinds'

// Catalogue filters are query-driven; render on demand rather than static snapshot.
export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ category?: string | string[]; type?: string | string[] }>

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const query = await searchParams
  const [service, defaults] = await Promise.all([queryServiceBySlug(SLUG), getSeoDefaults()])
  if (!service) return {}

  const title = service.seo?.title || 'Curtains Dubai | Custom Curtains & Blinds'
  const description =
    service.seo?.description ||
    'Custom curtains and blinds in Dubai with made-to-measure sizing, fabric selection and professional installation by Al Rukn Furniture.'
  const metadata = buildMetadata(
    { ...service, seo: { ...service.seo, description, title } },
    {
      ...defaults,
      descriptionFallback: description,
      path: `/${SLUG}/`,
      titleFallback: title,
      titlePattern: '{title}',
    },
  )
  const isFiltered = Boolean(query.category || query.type)
  return {
    ...metadata,
    ...(typeof metadata.title === 'string' ? { title: { absolute: metadata.title } } : {}),
    robots: isFiltered ? { follow: true, index: false } : metadata.robots,
  }
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  return <CurtainsBlindsPage searchParams={searchParams} />
}
