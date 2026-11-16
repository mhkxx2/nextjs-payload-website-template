import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { cmsFallbacks } from '@/data/cmsFallbacks'
import type { Area, Media, Service } from '@/payload-types'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { orderFixedServices } from '@/lib/contentLinks'
import { queryPublicList } from '@/lib/publicQueries'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function generateMetadata(): Promise<Metadata> {
  const [defaults, about] = await Promise.all([
    getSeoDefaults(),
    getCachedGlobal('about-page', 1)(),
  ])

  return buildMetadata({ seo: about.seo }, {
    ...defaults,
    descriptionFallback: about.hero?.introduction || cmsFallbacks.about.intro,
    path: '/about-us/',
    titleFallback: 'About',
  })
}

export default async function AboutPage() {
  const breadcrumbs = buildBreadcrumbs('/about-us/')
  const [{ docs }, areas, globals, about] = await Promise.all([
    queryPublicList<Service>({ collection: 'services', depth: 1, limit: 20 }),
    queryPublicList<Area>({ collection: 'areas', depth: 2, limit: 100, sort: 'order' }),
    getSchemaGlobals(),
    getCachedGlobal('about-page', 1)(),
  ])
  const schemas = buildSchemas({ breadcrumbs, globals, kind: 'page', path: '/about-us/' })

  const services = orderFixedServices(docs)
  const customFurniture = services.find((service) => service.slug === 'custom-furniture')
  const serviceWithImage =
    customFurniture ?? services.find((service) => typeof service.hero?.image === 'object')
  const heroImage = typeof about.hero?.image === 'object'
    ? about.hero.image
    : typeof serviceWithImage?.hero?.image === 'object' ? serviceWithImage.hero.image : null
  const workshopImage =
    customFurniture?.gallery
      ?.map(({ image }) => (typeof image === 'object' ? image : null))
      .find((image): image is Media => Boolean(image?.filename?.includes('about-workshop'))) ??
    customFurniture?.gallery?.find(({ image }) => typeof image === 'object')?.image
  const storyImage = typeof about.story?.image === 'object'
    ? about.story.image
    : typeof workshopImage === 'object' ? workshopImage : heroImage
  const proofItems = about.proofItems?.length
    ? about.proofItems
    : cmsFallbacks.about.workingBenefits.slice(0, 4).map(({ title }) => ({ label: title }))
  const process = about.processSection?.steps?.length
    ? about.processSection.steps
    : cmsFallbacks.about.processSteps
  const principles = about.principlesSection?.items?.length
    ? about.principlesSection.items
    : cmsFallbacks.about.workingBenefits
  const storyParagraphs = about.story?.paragraphs?.length
    ? about.story.paragraphs.map(({ text }) => text).filter(Boolean)
    : cmsFallbacks.about.story.body

  return (
    <>
      <JsonLd schemas={schemas} />
      <section className="about-hero">
        <div className="site-container about-hero-layout">
          <div className="about-hero-copy">
            <div className="about-breadcrumbs">
              <Breadcrumbs items={breadcrumbs} />
            </div>
            <p className="eyebrow">{about.hero?.eyebrow || cmsFallbacks.about.eyebrow}</p>
            <h1>{about.hero?.heading || cmsFallbacks.about.heading}</h1>
            <p>{about.hero?.introduction || cmsFallbacks.about.intro}</p>
            <div className="action-row">
              <Link className="button button-primary" href="/contact/">
                {about.hero?.primaryLabel || 'Request a Free Quotation'}
              </Link>
              <Link className="button about-button-light" href="/services/">
                {about.hero?.secondaryLabel || 'Explore Our Services'}
              </Link>
            </div>
          </div>
          {heroImage && (
            <div className="about-hero-image">
              <Image
                alt={heroImage.alt || 'Custom furniture made for a UAE home'}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 48vw"
                src={heroImage.url || ''}
              />
            </div>
          )}
        </div>
      </section>

      <aside aria-label="How Al Rukn works" className="about-proof-strip">
        <div className="site-container">
          {proofItems.map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
        </div>
      </aside>

      <section className="home-section about-story">
        <div className="site-container about-story-layout">
          {storyImage && (
            <div className="about-story-image">
              <Image
                alt={storyImage.alt || 'Workbench inside the Al Rukn furniture workshop'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={storyImage.url || ''}
              />
            </div>
          )}
          <div className="about-story-copy">
            <p className="eyebrow">{about.story?.eyebrow || cmsFallbacks.about.story.eyebrow}</p>
            <h2>{about.story?.heading || cmsFallbacks.about.story.heading}</h2>
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="home-section about-services">
          <div className="site-container">
            <header className="section-heading">
              <p className="eyebrow">{about.servicesSection?.eyebrow || 'Made, repaired and fitted'}</p>
              <h2>{about.servicesSection?.heading || cmsFallbacks.about.servicesHeading}</h2>
              <p>{about.servicesSection?.introduction || cmsFallbacks.about.servicesIntro}</p>
            </header>
            <div className="about-service-grid">
              {services.map((service, index) => (
                <Link href={`/${service.slug}/`} key={service.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.summary}</p>
                  </div>
                  <b aria-hidden="true">↗</b>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="home-section process-section about-process">
        <div className="site-container">
          <header className="section-heading">
            <p className="eyebrow">{about.processSection?.eyebrow || 'A clear four-step approach'}</p>
            <h2>{about.processSection?.heading || cmsFallbacks.about.processHeading}</h2>
          </header>
          <ol className="process-grid">
            {process.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section about-principles">
        <div className="site-container benefits-layout">
          <header className="section-heading">
            <p className="eyebrow">{about.principlesSection?.eyebrow || 'Why the details matter'}</p>
            <h2>{about.principlesSection?.heading || cmsFallbacks.about.principlesHeading}</h2>
            <p>{about.principlesSection?.introduction || cmsFallbacks.about.principlesIntro}</p>
          </header>
          <div className="benefit-list">
            {principles.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {areas.docs.length > 0 && (
        <section className="home-section about-coverage">
          <div className="site-container about-coverage-layout">
            <header className="section-heading">
              <p className="eyebrow">{about.coverageSection?.eyebrow || 'Across the UAE'}</p>
              <h2>{about.coverageSection?.heading || cmsFallbacks.about.coverageHeading}</h2>
              <p>{about.coverageSection?.introduction || cmsFallbacks.about.coverageIntro}</p>
            </header>
            <div className="about-area-list">
              {areas.docs.map((area) => (
                <span key={area.name}>{area.name}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="about-cta">
        <div className="site-container about-cta-layout">
          <div>
            <p className="eyebrow">{about.cta?.eyebrow || 'Start with a photo or idea'}</p>
            <h2>{about.cta?.heading || cmsFallbacks.about.cta.heading}</h2>
          </div>
          <div>
            <p>{about.cta?.description || cmsFallbacks.about.cta.description}</p>
            <Link className="button button-dark" href="/contact/">
              {about.cta?.primaryLabel || cmsFallbacks.about.cta.buttonText}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
