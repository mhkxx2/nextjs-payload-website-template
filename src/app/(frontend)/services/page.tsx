import type { Metadata } from 'next'
import React from 'react'

import { CallToActionBlockComponent } from '@/blocks/CallToAction/Component'
import { LocationCoverageBlockComponent } from '@/blocks/LocationCoverage/Component'
import { ServiceGridBlockComponent } from '@/blocks/ServiceGrid/Component'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { cmsFallbacks } from '@/data/cmsFallbacks'
import type { Service } from '@/payload-types'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { orderFixedServices } from '@/lib/contentLinks'
import { queryPublicList } from '@/lib/publicQueries'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function generateMetadata(): Promise<Metadata> {
  const [defaults, archives] = await Promise.all([
    getSeoDefaults(),
    getCachedGlobal('archive-settings', 1)(),
  ])
  const archive = archives.servicesArchive

  return buildMetadata({ seo: archive?.seo }, {
    ...defaults,
    descriptionFallback: archive?.introduction || cmsFallbacks.archives.services.intro,
    path: '/services/',
    titleFallback: archive?.heading || cmsFallbacks.archives.services.heading,
  })
}

export default async function ServicesIndex() {
  const breadcrumbs = buildBreadcrumbs('/services/')
  const [{ docs }, contact, globals, archives] = await Promise.all([
    queryPublicList<Service>({ collection: 'services', depth: 1, limit: 20 }),
    getCachedGlobal('contact-information', 1)(),
    getSchemaGlobals(),
    getCachedGlobal('archive-settings', 1)(),
  ])
  const archive = archives.servicesArchive
  const schemas = buildSchemas({ breadcrumbs, globals, kind: 'archive', path: '/services/' })

  const services = orderFixedServices(docs)
  const areas = (contact?.serviceAreas ?? [])
    .filter((item) => item?.area)
    .map((item) => ({ name: item.area as string }))

  return (
    <div className="pt-16 pb-16">
      <JsonLd schemas={schemas} />
      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbs} />
        <header className="max-w-3xl py-6">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal mb-4">
            {archive?.heading || cmsFallbacks.archives.services.heading}
          </h1>
          <p className="text-neutral-600">{archive?.introduction || cmsFallbacks.archives.services.intro}</p>
        </header>
      </div>

      {services.length > 0 ? (
        <ServiceGridBlockComponent services={services} />
      ) : (
        <div className="container mx-auto px-4 py-10">
          <p className="text-neutral-600">{archive?.emptyState || cmsFallbacks.archives.services.emptyMessage}</p>
        </div>
      )}

      {areas.length > 0 && (
        <LocationCoverageBlockComponent
          areas={areas}
          heading="Where We Work"
          subheading="Delivery and installation areas are configured by our team."
        />
      )}

      <CallToActionBlockComponent
        buttonLink="/contact/"
        buttonText={archive?.cta?.primaryLabel || cmsFallbacks.archives.services.cta.buttonText}
        description={archive?.cta?.description || cmsFallbacks.archives.services.cta.description}
        heading={archive?.cta?.heading || cmsFallbacks.archives.services.cta.heading}
      />
    </div>
  )
}
