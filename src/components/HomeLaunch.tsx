import Link from 'next/link'
import React from 'react'

import { BenefitsBlockComponent } from '@/blocks/Benefits/Component'
import { CallToActionBlockComponent } from '@/blocks/CallToAction/Component'
import { FaqsBlockComponent } from '@/blocks/Faqs/Component'
import { LocationCoverageBlockComponent } from '@/blocks/LocationCoverage/Component'
import { ProcessStepsBlockComponent } from '@/blocks/ProcessSteps/Component'
import { ProjectGalleryBlockComponent } from '@/blocks/ProjectGallery/Component'
import { QuoteFormBlockComponent } from '@/blocks/QuoteForm/Component'
import { ServiceGridBlockComponent } from '@/blocks/ServiceGrid/Component'
import { TestimonialsBlockComponent } from '@/blocks/Testimonials/Component'
import { homeCopy, processSteps, workingBenefits } from '@/data/launch-copy'
import type { Faq, Project, Service, Testimonial } from '@/payload-types'
import { orderFixedServices } from '@/lib/contentLinks'
import { queryPublicList } from '@/lib/publicQueries'
import { getCachedGlobal } from '@/utilities/getGlobals'

/**
 * The ordered homepage composition.
 *
 * Order is owned by this file (not by the database): hero → services → how we work
 * → process → selected work → client feedback → coverage → FAQs → quote form → CTA.
 * Sections that depend on CMS content render only when that content is actually
 * published, so a half-populated CMS never produces empty headings or invented copy.
 */
export const HomeLaunch: React.FC = async () => {
  const [servicesResult, projectsResult, testimonialsResult, faqsResult, contact] =
    await Promise.all([
      queryPublicList<Service>({ collection: 'services', depth: 1, limit: 20 }),
      queryPublicList<Project>({ collection: 'projects', depth: 1, limit: 12, sort: '-publishedAt' }),
      queryPublicList<Testimonial>({
        collection: 'testimonials',
        depth: 1,
        limit: 6,
        sort: '-publishedAt',
      }),
      queryPublicList<Faq>({ collection: 'faqs', depth: 1, limit: 6 }),
      getCachedGlobal('contact-information', 1)(),
    ])

  const services = orderFixedServices(servicesResult.docs)

  // Featured projects lead the gallery, then newest first.
  const projects = [...projectsResult.docs]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 6)

  const testimonials = testimonialsResult.docs
    .filter((testimonial) => testimonial.verifiedAt)
    .map((testimonial) => ({
      clientName: testimonial.displayName,
      content: testimonial.statement,
      location: testimonial.location ?? undefined,
      quote: testimonial.statement,
    }))

  const faqs = faqsResult.docs
    .filter((faq) => faq.question && faq.answer)
    .map((faq) => ({ answer: faq.answer, question: faq.question }))

  const areas = (contact?.serviceAreas ?? [])
    .filter((item) => item?.area)
    .map((item) => ({ name: item.area as string }))

  return (
    <>
      <section className="pt-20 pb-14 md:pt-28 md:pb-20 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400 mb-5">
            Al Rukn Furniture
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            {homeCopy.hero.heading}
          </h1>
          <p className="text-base md:text-lg text-neutral-200 mb-8">{homeCopy.hero.subheading}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={homeCopy.hero.ctaLink}
              className="inline-flex items-center rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold px-6 py-3"
            >
              {homeCopy.hero.ctaText}
            </Link>
            <Link
              href="/projects/"
              className="inline-flex items-center rounded-lg border border-neutral-400 hover:border-white text-white font-semibold px-6 py-3"
            >
              See our work
            </Link>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <ServiceGridBlockComponent
          heading={homeCopy.services.heading}
          services={services}
          subheading={homeCopy.services.subheading}
        />
      )}

      <BenefitsBlockComponent heading={homeCopy.benefits.heading} items={workingBenefits} />

      <ProcessStepsBlockComponent heading={homeCopy.process.heading} steps={processSteps} />

      {projects.length > 0 && (
        <ProjectGalleryBlockComponent
          heading={homeCopy.projects.heading}
          projects={projects}
          subheading={homeCopy.projects.subheading}
        />
      )}

      {testimonials.length > 0 && (
        <TestimonialsBlockComponent
          heading={homeCopy.testimonials.heading}
          testimonials={testimonials}
        />
      )}

      {areas.length > 0 && (
        <LocationCoverageBlockComponent
          areas={areas}
          heading={homeCopy.coverage.heading}
          subheading={homeCopy.coverage.subheading}
        />
      )}

      {faqs.length > 0 && (
        <FaqsBlockComponent faqs={faqs} heading={homeCopy.faqs.heading} />
      )}

      <QuoteFormBlockComponent
        description={homeCopy.quote.description}
        heading={homeCopy.quote.heading}
      />

      <CallToActionBlockComponent
        buttonLink={homeCopy.finalCta.buttonLink}
        buttonText={homeCopy.finalCta.buttonText}
        description={homeCopy.finalCta.description}
        heading={homeCopy.finalCta.heading}
      />
    </>
  )
}
