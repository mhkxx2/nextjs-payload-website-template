import type { Metadata } from 'next'
import React from 'react'

import { CallToActionBlockComponent } from '@/blocks/CallToAction/Component'
import { LocationCoverageBlockComponent } from '@/blocks/LocationCoverage/Component'
import { ServiceGridBlockComponent } from '@/blocks/ServiceGrid/Component'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { archiveCopy, homeCopy } from '@/data/launch-copy'
import type { Service } from '@/payload-types'
import { orderFixedServices } from '@/lib/contentLinks'
import { queryPublicList } from '@/lib/publicQueries'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const metadata: Metadata = {
  description: archiveCopy.services.intro,
  title: `${archiveCopy.services.heading} | Al Rukn Furniture`,
}

export default async function ServicesIndex() {
  const [{ docs }, contact] = await Promise.all([
    queryPublicList<Service>({ collection: 'services', depth: 1, limit: 20 }),
    getCachedGlobal('contact-information', 1)(),
  ])

  const services = orderFixedServices(docs)
  const areas = (contact?.serviceAreas ?? [])
    .filter((item) => item?.area)
    .map((item) => ({ name: item.area as string }))

  return (
    <div className="pt-16 pb-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Services' }]} />
        <header className="max-w-3xl py-6">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal mb-4">
            {archiveCopy.services.heading}
          </h1>
          <p className="text-neutral-600">{archiveCopy.services.intro}</p>
        </header>
      </div>

      {services.length > 0 ? (
        <ServiceGridBlockComponent services={services} />
      ) : (
        <div className="container mx-auto px-4 py-10">
          <p className="text-neutral-600">{archiveCopy.services.emptyMessage}</p>
        </div>
      )}

      {areas.length > 0 && (
        <LocationCoverageBlockComponent
          areas={areas}
          heading={homeCopy.coverage.heading}
          subheading={homeCopy.coverage.subheading}
        />
      )}

      <CallToActionBlockComponent
        buttonLink={homeCopy.finalCta.buttonLink}
        buttonText={homeCopy.finalCta.buttonText}
        description={homeCopy.finalCta.description}
        heading={homeCopy.finalCta.heading}
      />
    </div>
  )
}
