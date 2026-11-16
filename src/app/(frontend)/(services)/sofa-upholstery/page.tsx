import type { Metadata } from 'next'
import { queryServiceBySlug } from '@/components/ServicePage'
import { SofaUpholsteryPage } from '@/components/sofa-upholstery/SofaUpholsteryPage'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'

const SLUG = 'sofa-upholstery'

export async function generateMetadata(): Promise<Metadata> {
  const service = await queryServiceBySlug(SLUG)
  if (!service) return {}
  const defaults = await getSeoDefaults()
  const metadata = buildMetadata(service, {
    ...defaults,
    path: `/${SLUG}/`,
    titlePattern: '{title}',
  })
  // The CMS owns the complete title; bypass any parent layout title template.
  return {
    ...metadata,
    ...(typeof metadata.title === 'string' ? { title: { absolute: metadata.title } } : {}),
  }
}

export default async function Page() {
  return <SofaUpholsteryPage />
}
