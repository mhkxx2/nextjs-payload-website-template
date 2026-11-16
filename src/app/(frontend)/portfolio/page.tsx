import configPromise from '@payload-config'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload, type Where } from 'payload'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { PortfolioExplorer, type PortfolioCardData, type PortfolioFilter } from '@/components/portfolio/PortfolioExplorer'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { whatsappHref } from '@/lib/contactLinks'
import { buildSchemas, getSchemaGlobals, SCHEMA_CONTEXT } from '@/lib/schema'
import { buildMetadata, canonicalURL, getSeoDefaults } from '@/lib/seo'
import type { Media, PortfolioItem, Service } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cmsFallbacks } from '@/data/cmsFallbacks'
import { queryPublicList } from '@/lib/publicQueries'

const PAGE_SIZE = 18
const localMediaURL = (url: string, cacheTag?: null | string) => {
  const resolved = getMediaUrl(url, cacheTag)
  try {
    const parsed = new URL(resolved)
    if (parsed.hostname === 'alruknfurniture.ae' || parsed.hostname === 'www.alruknfurniture.ae') {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch { /* already a local path */ }
  return resolved
}

const filterDefinitions = [
  { labelKey: 'all', value: 'all' },
  { field: 'roomCategory', labelKey: 'bedroom', source: 'bedroom', value: 'bedroom' },
  { field: 'roomCategory', labelKey: 'livingRoom', source: 'living-room', value: 'living-room' },
  { field: 'roomCategory', labelKey: 'kidsRoom', source: 'kids-room', value: 'kids-room' },
  { field: 'roomCategory', labelKey: 'diningRoom', source: 'dining-room', value: 'dining-room' },
  { field: 'roomCategory', labelKey: 'bathroom', source: 'bathroom', value: 'bathroom' },
  { field: 'furnitureType', labelKey: 'sofas', source: ['sofas', 'sectional-sofas'], value: 'sofas' },
  { field: 'furnitureType', labelKey: 'beds', source: ['beds', 'tv-beds', 'single-beds', 'bunk-beds'], value: 'beds' },
  { field: 'furnitureType', labelKey: 'wardrobes', source: 'wardrobes', value: 'wardrobes' },
  { field: 'roomCategory', labelKey: 'officeStudy', source: 'office-study', value: 'office-study' },
  { field: 'roomCategory', labelKey: 'storage', source: 'storage', value: 'storage' },
] as const

const buildFilters = (labels?: Record<string, null | string | undefined>) =>
  filterDefinitions.map((filter) => ({
    ...filter,
    label: labels?.[filter.labelKey] || cmsFallbacks.archives.portfolio.filterLabels[filter.labelKey],
  }))

const filterWhere = (value: string, filters: ReturnType<typeof buildFilters>): Where | undefined => {
  const filter = filters.find((entry) => entry.value === value)
  if (!filter || !('field' in filter)) return undefined
  if (Array.isArray(filter.source)) return { or: filter.source.map((source) => ({ [filter.field]: { equals: source } })) }
  return { [filter.field]: { equals: filter.source } }
}

const mediaData = (media: Media | number | null | undefined) => {
  if (!media || typeof media !== 'object' || !media.url || !media.width || !media.height) return null
  return { alt: media.alt || '', height: media.height, url: localMediaURL(media.url, media.updatedAt), width: media.width }
}

const cardData = (item: PortfolioItem, whatsappNumber?: null | string): PortfolioCardData | null => {
  const image = mediaData(item.coverImage)
  if (!image) return null
  const service = typeof item.relatedService === 'object' ? (item.relatedService as Service) : null
  const url = `${canonicalURL('/portfolio/')}?design=${encodeURIComponent(item.slug)}`
  const message = `Hi, I am interested in a furniture design similar to this:\n${item.title}\n${url}\n\nPlease send me a quotation.`
  return {
    description: item.shortDescription,
    furnitureType: item.furnitureType,
    id: item.id,
    image,
    relatedService: service?.slug ? { slug: service.slug, title: service.title } : null,
    roomCategory: item.roomCategory,
    slug: item.slug,
    title: item.title,
    whatsappURL: whatsappHref(whatsappNumber, message),
  }
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const query = await searchParams
  const [defaults, archives] = await Promise.all([
    getSeoDefaults(),
    getCachedGlobal('archive-settings', 1)(),
  ])
  const archive = archives.portfolioArchive
  const title = archive?.seo?.title || cmsFallbacks.archives.portfolio.seo.title
  const description = archive?.seo?.description || cmsFallbacks.archives.portfolio.seo.description
  const metadata = buildMetadata({ seo: { ...archive?.seo, description, title }, title }, {
    ...defaults,
    descriptionFallback: description,
    path: '/portfolio/',
    titleFallback: title,
  })
  const isFiltered = Boolean(query.category || query.design || query.page)
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, title },
    robots: isFiltered ? { follow: true, index: false } : metadata.robots,
    title: { absolute: title },
    twitter: { ...metadata.twitter, title },
  }
}

type SearchParams = Promise<{ category?: string | string[]; design?: string | string[]; page?: string | string[] }>

export default async function PortfolioPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams
  const archives = await getCachedGlobal('archive-settings', 1)()
  const archive = archives.portfolioArchive
  const filtersConfig = buildFilters(archive?.filterLabels as Record<string, null | string | undefined>)
  const activeFilter = typeof query.category === 'string' && filtersConfig.some((item) => item.value === query.category) ? query.category : 'all'
  const requestedPage = typeof query.page === 'string' ? Number.parseInt(query.page, 10) : 1
  const page = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), 10) : 1
  const design = typeof query.design === 'string' ? query.design : null
  const payload = await getPayload({ config: configPromise })
  const [facetResult, galleryResult, contact, globals, services] = await Promise.all([
    payload.find({ collection: 'portfolio-items', depth: 0, limit: 500, overrideAccess: false, pagination: false, sort: 'sortOrder' }),
    payload.find({ collection: 'portfolio-items', depth: 1, limit: PAGE_SIZE * page, overrideAccess: false, sort: 'sortOrder', where: filterWhere(activeFilter, filtersConfig) }),
    getCachedGlobal('contact-information', 0)(),
    getSchemaGlobals(),
    queryPublicList<Service>({ collection: 'services', depth: 0, limit: 20 }),
  ])

  const facetItems = facetResult.docs as PortfolioItem[]
  const galleryDocs = galleryResult.docs as PortfolioItem[]
  if (design && !galleryDocs.some((item) => item.slug === design)) {
    const selected = await payload.find({ collection: 'portfolio-items', depth: 1, limit: 1, overrideAccess: false, where: { slug: { equals: design } } })
    if (selected.docs[0]) galleryDocs.push(selected.docs[0] as PortfolioItem)
  }
  const items = galleryDocs.map((item) => cardData(item, contact.whatsappE164)).filter((item): item is PortfolioCardData => Boolean(item))

  const filters: PortfolioFilter[] = filtersConfig.map((filter) => {
    const count = filter.value === 'all' ? facetItems.length : facetItems.filter((item) => {
      if (!('field' in filter)) return true
      const actual = item[filter.field]
      return Array.isArray(filter.source) ? filter.source.includes(actual as never) : actual === filter.source
    }).length
    return { count, label: filter.label, value: filter.value }
  }).filter((filter) => filter.value === 'all' || filter.count > 0)

  const featuredRooms = ['bedroom', 'living-room', 'kids-room', 'dining-room', 'office-study', 'storage']
    .map((room) => facetItems.find((item) => item.roomCategory === room && item.featured) ?? facetItems.find((item) => item.roomCategory === room))
    .filter((item): item is PortfolioItem => Boolean(item))
  const featuredCards = await Promise.all(featuredRooms.map(async (item) => {
    const full = galleryDocs.find((entry) => entry.id === item.id) ?? await payload.findByID({ collection: 'portfolio-items', depth: 1, id: item.id, overrideAccess: false })
    return cardData(full as PortfolioItem, contact.whatsappE164)
  })).then((cards) => cards.filter((card): card is PortfolioCardData => Boolean(card)))

  const hero = featuredCards[0] ?? items[0]
  const breadcrumbs = buildBreadcrumbs('/portfolio/')
  const schemas = [
    ...buildSchemas({ breadcrumbs, globals, kind: 'archive', path: '/portfolio/' }),
    { '@context': SCHEMA_CONTEXT, '@type': 'WebPage', description: archive?.introduction || cmsFallbacks.archives.portfolio.introduction, name: archive?.heading || cmsFallbacks.archives.portfolio.heading, url: canonicalURL('/portfolio/') },
  ]
  const nextParams = new URLSearchParams()
  if (activeFilter !== 'all') nextParams.set('category', activeFilter)
  nextParams.set('page', String(page + 1))
  const loadMoreHref = galleryResult.hasNextPage ? `/portfolio/?${nextParams.toString()}#designs` : null

  return (
    <div className="portfolio-page">
      <JsonLd schemas={schemas} />
      <section className="portfolio-hero">
        {hero && <Image alt={hero.image.alt} className="portfolio-hero-image" fill priority sizes="100vw" src={hero.image.url} />}
        <div className="portfolio-hero-shade" />
        <div className="site-container portfolio-hero-content">
          <div className="portfolio-breadcrumbs"><Breadcrumbs items={breadcrumbs} /></div>
          <p className="eyebrow">{archive?.hero?.eyebrow || cmsFallbacks.archives.portfolio.hero.eyebrow}</p>
          <h1>{archive?.hero?.heading || archive?.heading || cmsFallbacks.archives.portfolio.heading}</h1>
          <p>{archive?.hero?.introduction || archive?.introduction || cmsFallbacks.archives.portfolio.introduction}</p>
          <div className="action-row"><Link className="button button-primary" href="#designs">{archive?.hero?.exploreLabel || cmsFallbacks.archives.portfolio.hero.exploreLabel}</Link><Link className="button portfolio-button-light" href="/#request-quote">{archive?.hero?.sendDesignLabel || cmsFallbacks.archives.portfolio.hero.sendDesignLabel}</Link></div>
        </div>
      </section>

      {featuredCards.length > 0 && <section className="portfolio-room-section"><div className="site-container"><div className="portfolio-section-heading"><p className="eyebrow">{archive?.supportingLabels?.roomEyebrow || cmsFallbacks.archives.portfolio.supportingLabels.roomEyebrow}</p><h2>{archive?.supportingLabels?.roomHeading || cmsFallbacks.archives.portfolio.supportingLabels.roomHeading}</h2></div><div className="portfolio-room-grid">{featuredCards.map((card) => <Link className="portfolio-room-card" href={`/portfolio/?category=${card.roomCategory}#designs`} key={card.id}><Image alt={card.image.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" src={card.image.url} /><span /><strong>{card.roomCategory === 'office-study' ? filtersConfig.find(({ value }) => value === 'office-study')?.label : card.roomCategory.replace('-', ' ')}</strong><b aria-hidden="true">↗</b></Link>)}</div></div></section>}

      <PortfolioExplorer activeFilter={activeFilter} filters={filters} initialDesign={design} items={items} loadMoreHref={loadMoreHref} total={galleryResult.totalDocs} />
      <section className="portfolio-service-links"><div className="site-container"><p className="eyebrow">{archive?.supportingLabels?.servicesEyebrow || cmsFallbacks.archives.portfolio.supportingLabels.servicesEyebrow}</p><h2>{archive?.supportingLabels?.servicesHeading || cmsFallbacks.archives.portfolio.supportingLabels.servicesHeading}</h2><div>{services.docs.map((service) => <Link href={`/${service.slug}/`} key={service.id}>{service.title}<span>↗</span></Link>)}</div></div></section>
    </div>
  )
}
