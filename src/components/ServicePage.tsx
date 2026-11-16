import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import type { Faq, Media as MediaType, Service } from '@/payload-types'
import { QuoteFormBlockComponent } from '@/blocks/QuoteForm/Component'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { GoogleReviewsSection } from '@/components/google-reviews/GoogleReviewsSection'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { WhatsAppAction } from '@/components/WhatsAppAction'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { whatsappHref } from '@/lib/contactLinks'
import { canonicalPath, FIXED_SERVICE_SLUGS } from '@/lib/routes'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { queryPublicDocBySlug } from '@/lib/publicQueries'
import { cmsFallbacks } from '@/data/cmsFallbacks'

interface ServicePageProps { slug: string }

export const queryServiceBySlug = cache(async (slug: string): Promise<Service | null> => {
  return queryPublicDocBySlug<Service>('services', slug, 2)
})

export async function generateServiceMetadata({ slug }: ServicePageProps): Promise<Metadata> {
  const service = await queryServiceBySlug(slug)
  if (!service) return {}
  const defaults = await getSeoDefaults()
  return buildMetadata(service, { ...defaults, path: canonicalPath('service', slug) })
}

const mediaRecord = (value: unknown): MediaType | null => value && typeof value === 'object' && 'url' in value ? value as MediaType : null

export async function ServicePage({ slug }: ServicePageProps) {
  if (!(FIXED_SERVICE_SLUGS as readonly string[]).includes(slug)) notFound()
  const service = await queryServiceBySlug(slug)
  if (!service) notFound()

  const breadcrumbItems = buildBreadcrumbs(`/${slug}/`, service)
  const visibleFaqs = (service.faqs ?? []).filter((faq): faq is Faq => typeof faq === 'object' && faq !== null)
  const [schemaGlobals, contact] = await Promise.all([getSchemaGlobals(), getCachedGlobal('contact-information', 1)()])
  const schemas = buildSchemas({ breadcrumbs: breadcrumbItems, globals: schemaGlobals, kind: 'service', path: `/${slug}/`, record: service, visibleFaqs })
  const heroImage = mediaRecord(service.hero?.image)
  const variant = service.visualVariant || 'image-right'
  const areaNames = (service.serviceAreas ?? []).map(({ area }) => area).filter(Boolean)
  const waMessage = service.whatsAppContext?.message || `Hello Al Rukn, I am enquiring about ${service.title}.`
  const waHref = contact.whatsappAvailable === false ? null : whatsappHref(contact.whatsappE164, waMessage)
  const labels = { ...cmsFallbacks.serviceLabels, ...(service.presentationLabels ?? {}) }

  return (
    <article className={`service-page service-variant-${variant}`}>
      <JsonLd schemas={schemas} />
      <div className="service-breadcrumb-wrap site-container"><Breadcrumbs items={breadcrumbItems} /></div>

      <section className="service-hero">
        {heroImage && variant === 'full-bleed' && <Media resource={heroImage} priority className="service-hero-backdrop" imgClassName="service-hero-image" size="100vw" />}
        {variant === 'full-bleed' && <div className="service-hero-overlay" />}
        <div className="site-container service-hero-layout">
          <div className="service-hero-copy">
            {service.hero?.eyebrow && <p className="eyebrow">{service.hero.eyebrow}</p>}
            <h1>{service.hero?.heading || service.title}</h1>
            <p>{service.hero?.copy || service.summary}</p>
            <div className="action-row"><a className="button button-primary" href="#request-service-quote">{service.quotationContext?.buttonLabel || service.quotationContext?.heading || 'Request a Quote'}</a><WhatsAppAction analytics={{ cta_location: 'service_hero', service: slug }} href={waHref} label={service.whatsAppContext?.label || 'Message on WhatsApp'} /></div>
            <p className="service-workshop-note">{labels.workshopNote}</p>
          </div>
          {heroImage && variant !== 'full-bleed' && <div className="service-hero-media"><Media resource={heroImage} priority imgClassName="service-hero-image" size="(max-width: 1024px) 100vw, 50vw" /></div>}
        </div>
      </section>

      {(service.trustItems?.length ?? 0) > 0 && <aside aria-label={`${service.title} service highlights`} className="service-trust-strip"><div className="site-container service-trust-grid">{service.trustItems?.map((item) => <span key={item.id || item.label}>{item.label}</span>)}</div></aside>}

      {service.details && <section className="service-section service-introduction"><div className="site-container service-narrow prose"><RichText content={service.details as never} /></div></section>}

      {(service.serviceOptions?.items?.length ?? 0) > 0 && <section className="service-section service-options-section"><div className="site-container"><header className="section-heading">{service.serviceOptions?.eyebrow && <p className="eyebrow">{service.serviceOptions.eyebrow}</p>}<h2>{service.serviceOptions?.heading}</h2>{service.serviceOptions?.intro && <p>{service.serviceOptions.intro}</p>}</header><div className="service-option-grid">{service.serviceOptions?.items?.map((item, index) => <article className="service-option-card" key={item.id || item.title}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div></section>}

      {service.featureSections?.map((section) => {
        const image = mediaRecord(section.image)
        return <section className="service-section service-feature" key={section.id || section.heading}><div className={`site-container service-feature-layout ${section.imagePosition === 'left' ? 'image-left' : ''}`}><div className="service-feature-copy">{section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}<h2>{section.heading}</h2><p>{section.copy}</p>{(section.bullets?.length ?? 0) > 0 && <ul>{section.bullets?.map((bullet) => <li key={bullet.id || bullet.text}>{bullet.text}</li>)}</ul>}</div>{image && <div className="service-feature-media"><Media resource={image} imgClassName="service-feature-image" size="(max-width: 768px) 100vw, 50vw" /><span className="service-image-label">Design inspiration</span></div>}</div></section>
      })}

      {(service.benefits?.length ?? 0) > 0 && <section className="service-section service-benefits-section"><div className="site-container service-benefits-layout"><header className="section-heading"><p className="eyebrow">{labels.benefitsEyebrow}</p><h2>{labels.benefitsHeading}</h2></header><div className="service-benefit-list">{service.benefits?.map((item, index) => <article key={item.id || item.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div></article>)}</div></div></section>}

      {(service.materialsCapabilities?.length ?? 0) > 0 && <section className="service-section service-materials-section"><div className="site-container"><header className="section-heading"><p className="eyebrow">{labels.materialsEyebrow}</p><h2>{service.materialsHeading || 'Materials and options'}</h2></header><div className="service-material-grid">{service.materialsCapabilities?.map((item) => <article key={item.id || item.title}><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</article>)}</div></div></section>}

      {service.comparison?.heading && <section className="service-section service-comparison-section"><div className="site-container"><header className="section-heading"><p className="eyebrow">Choose the right scope</p><h2>{service.comparison.heading}</h2>{service.comparison.intro && <p>{service.comparison.intro}</p>}</header><div className="service-comparison-grid"><article><h3>{service.comparison.leftTitle}</h3><ul>{service.comparison.leftItems?.map((item) => <li key={item.id || item.text}>{item.text}</li>)}</ul></article><article><h3>{service.comparison.rightTitle}</h3><ul>{service.comparison.rightItems?.map((item) => <li key={item.id || item.text}>{item.text}</li>)}</ul></article></div></div></section>}

      {(service.process?.length ?? 0) > 0 && <section className="service-section service-process-section"><div className="site-container"><header className="section-heading"><p className="eyebrow">{labels.processEyebrow}</p><h2>{service.processHeading || 'How the work is completed'}</h2></header><ol className="service-process-grid">{service.process?.map((step, index) => <li key={step.id || step.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3>{step.description && <p>{step.description}</p>}</li>)}</ol></div></section>}

      {(service.gallery?.length ?? 0) > 0 && <section className="service-section service-gallery-section"><div className="site-container"><header className="section-heading"><p className="eyebrow">{labels.galleryEyebrow}</p><h2>{service.galleryHeading || `${service.title} inspiration`}</h2>{service.galleryIntro && <p>{service.galleryIntro}</p>}</header><div className="service-gallery-grid">{service.gallery?.map((item, index) => { const image = mediaRecord(item.image); return image ? <figure key={item.id || index}><Media resource={image} imgClassName="service-gallery-image" size="(max-width: 640px) 100vw, 50vw" /><figcaption>Design inspiration</figcaption></figure> : null })}</div></div></section>}

      {areaNames.length > 0 && <section className="service-section service-areas-section"><div className="site-container service-areas-layout"><header className="section-heading"><p className="eyebrow">{labels.areasEyebrow}</p><h2>{service.serviceAreaHeading || 'Serving Dubai communities'}</h2>{service.serviceAreaCopy && <p>{service.serviceAreaCopy}</p>}</header><div><div className="service-area-chips">{areaNames.map((area) => <span key={area}>{area}</span>)}</div><Link className="text-link" href="/#areas-we-serve">{service.areaLinkLabel || 'See all areas we serve'} <span aria-hidden="true">→</span></Link></div></div></section>}

      {visibleFaqs.length > 0 && <section className="service-section service-faq-section"><div className="site-container service-faq-layout"><header className="section-heading"><p className="eyebrow">{labels.faqEyebrow}</p><h2>{labels.faqHeading || `${service.title} questions`}</h2><p>{labels.faqIntroduction}</p></header><div className="service-faq-list">{visibleFaqs.map((faq) => <details key={faq.id}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></div></section>}

      {slug === 'sofa-upholstery' && <GoogleReviewsSection />}

      {(service.relatedServices?.length ?? 0) > 0 && <section className="service-section service-related-section"><div className="site-container"><header className="section-heading"><p className="eyebrow">{labels.relatedEyebrow}</p><h2>{service.relatedHeading || 'Related furniture services'}</h2></header><div className="service-related-grid">{service.relatedServices?.map((related) => { if (!related || typeof related !== 'object') return null; return <Link href={`/${related.slug}/`} key={related.id}><span>Explore service</span><h3>{related.title}</h3>{related.summary && <p>{related.summary}</p>}<strong aria-hidden="true">→</strong></Link> })}</div></div></section>}

      <section className="service-quote-section" id="request-service-quote"><div className="site-container service-quote-layout"><div className="service-quote-copy"><p className="eyebrow">{labels.quoteEyebrow}</p><h2>{service.quotationContext?.heading || `Request a ${service.title} quote`}</h2>{service.quotationContext?.message && <p>{service.quotationContext.message}</p>}<p className="service-workshop-note">Your enquiry goes to the same verified Al Rukn contact used across this website.</p></div><QuoteFormBlockComponent areas={areaNames} blockType="quoteForm" formTitle={service.quotationContext?.buttonLabel} serviceContext={slug} /></div></section>
    </article>
  )
}
