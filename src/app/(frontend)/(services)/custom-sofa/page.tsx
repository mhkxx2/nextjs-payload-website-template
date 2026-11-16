import type { Metadata } from 'next'
import { ServicePage, generateServiceMetadata } from '@/components/ServicePage'

const SLUG = 'custom-sofa'

export async function generateMetadata(): Promise<Metadata> {
  return generateServiceMetadata({ slug: SLUG })
}

export default async function Page() {
  return <ServicePage slug={SLUG} />
}
