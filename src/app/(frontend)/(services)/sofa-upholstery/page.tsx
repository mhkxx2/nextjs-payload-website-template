import type { Metadata } from 'next'
import { ServicePage, generateServiceMetadata } from '@/components/ServicePage'

const SLUG = 'sofa-upholstery'

export async function generateMetadata(): Promise<Metadata> {
  return generateServiceMetadata({ slug: SLUG })
}

export default async function Page() {
  return <ServicePage slug={SLUG} />
}
