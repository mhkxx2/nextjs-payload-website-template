import type { Metadata } from 'next'
import { queryServiceBySlug } from '@/components/ServicePage'
import { BedUpholsteryPage } from '@/components/bed-upholstery/BedUpholsteryPage'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'

const SLUG = 'bed-upholstery'

export async function generateMetadata(): Promise<Metadata> {
  const service = await queryServiceBySlug(SLUG)
  if (!service) return {}
  const defaults = await getSeoDefaults()
  const metadata = buildMetadata(service, {
    ...defaults,
    path: `/${SLUG}/`,
    titlePattern: '{title}',
  })
  return {
    ...metadata,
    ...(typeof metadata.title === 'string' ? { title: { absolute: metadata.title } } : {}),
  }
}

export default async function Page() {
  return <BedUpholsteryPage />
}
