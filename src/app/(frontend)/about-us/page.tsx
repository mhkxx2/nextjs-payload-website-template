import type { Metadata } from 'next'
import React from 'react'

import { BenefitsBlockComponent } from '@/blocks/Benefits/Component'
import { CallToActionBlockComponent } from '@/blocks/CallToAction/Component'
import { LocationCoverageBlockComponent } from '@/blocks/LocationCoverage/Component'
import { ProcessStepsBlockComponent } from '@/blocks/ProcessSteps/Component'
import { ServiceGridBlockComponent } from '@/blocks/ServiceGrid/Component'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { aboutCopy, homeCopy, processSteps, workingBenefits } from '@/data/launch-copy'
import type { Service } from '@/payload-types'
import { orderFixedServices } from '@/lib/contentLinks'
import { queryPublicList } from '@/lib/publicQueries'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const metadata: Metadata = {
  description: aboutCopy.intro,
  title: 'About | Al Rukn Furniture',
}

export default async function AboutPage() {
  const [{ docs }, contact] = await Promise.all([
    queryPublicList<Service>({ collection: 'services', depth: 1, limit: 20 }),
    getCachedGlobal('contact-information', 1)(),
  ])

  const services = orderFixedServices(docs)
  const areas = (contact?.serviceAreas ?? [])
    .filter((item) => item?.area)
    .map((item) => ({ name: item.area as string }))

  return (
    <>
      <div className="pt-16">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={[{ label: 'About' }]} />
          <header className="max-w-3xl py-6">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal mb-4">
              {aboutCopy.heading}
            </h1>
            <p className="text-neutral-700">{aboutCopy.intro}</p>
          </header>
        </div>
      </div>

      {services.length > 0 && (
        <ServiceGridBlockComponent
          heading={aboutCopy.servicesHeading}
          services={services}
        />
      )}

      <ProcessStepsBlockComponent heading={aboutCopy.processHeading} steps={processSteps} />

      <BenefitsBlockComponent heading={homeCopy.benefits.heading} items={workingBenefits} />

      {areas.length > 0 && (
        <LocationCoverageBlockComponent
          areas={areas}
          heading={aboutCopy.coverageHeading}
          subheading={homeCopy.coverage.subheading}
        />
      )}

      <CallToActionBlockComponent
        buttonLink={aboutCopy.cta.buttonLink}
        buttonText={aboutCopy.cta.buttonText}
        description={aboutCopy.cta.description}
        heading={aboutCopy.cta.heading}
      />
    </>
  )
}
