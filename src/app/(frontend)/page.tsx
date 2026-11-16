import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React from 'react'

import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { HomepageView } from '@/components/home/HomepageView'
import { cmsFallbacks } from '@/data/cmsFallbacks'
import type { Area, Faq, Project, Service, Testimonial } from '@/payload-types'
import { getHomepageGlobal } from '@/lib/homepage'
import { queryPublicList } from '@/lib/publicQueries'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function generateMetadata(): Promise<Metadata> {
  const [defaults, homepage] = await Promise.all([getSeoDefaults(), getHomepageGlobal()])

  return buildMetadata(
    {
      seo: {
        description: homepage.seo?.description || cmsFallbacks.homepage.meta.description,
        openGraphImage: homepage.seo?.image,
        title: homepage.seo?.title || cmsFallbacks.homepage.meta.title,
      },
    },
    {
      ...defaults,
      brandName: null,
      descriptionFallback: cmsFallbacks.homepage.meta.description,
      path: '/',
      titleFallback: cmsFallbacks.homepage.meta.title,
      titlePattern: '{title}',
    },
  )
}

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const [homepage, services, projects, testimonials, faqs, areas, contact, settings, globals] =
    await Promise.all([
      getHomepageGlobal(),
      queryPublicList<Service>({ collection: 'services', depth: 1, limit: 20 }),
      queryPublicList<Project>({ collection: 'projects', depth: 2, limit: 12, sort: '-publishedAt' }),
      queryPublicList<Testimonial>({ collection: 'testimonials', depth: 2, limit: 6, sort: '-publishedAt' }),
      queryPublicList<Faq>({ collection: 'faqs', depth: 1, limit: 12, sort: 'order' }),
      queryPublicList<Area>({ collection: 'areas', depth: 2, limit: 100, sort: 'order' }),
      getCachedGlobal('contact-information', 1)(),
      getCachedGlobal('site-settings', 1)(),
      getSchemaGlobals(),
    ])

  const visibleFaqs = faqs.docs.filter((faq) =>
    (homepage.sections ?? []).some(
      (section) =>
        section.blockType === 'faqs' &&
        section.enabled !== false &&
        (section.faqs ?? []).some((selected) =>
          typeof selected === 'object' ? selected.id === faq.id : selected === faq.id,
        ),
    ),
  )
  const schemas = buildSchemas({
    globals,
    includeLocalBusiness: true,
    kind: 'home',
    path: '/',
    visibleFaqs,
  })

  return (
    <>
      <JsonLd schemas={schemas} />
      {draft && <LivePreviewListener />}
      <HomepageView
        areas={areas.docs}
        contact={contact}
        faqs={faqs.docs}
        homepage={homepage}
        projects={projects.docs}
        services={services.docs}
        settings={settings}
        testimonials={testimonials.docs}
      />
    </>
  )
}
