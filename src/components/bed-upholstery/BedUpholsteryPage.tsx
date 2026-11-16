import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Faq, Service } from '@/payload-types'
import { queryServiceBySlug } from '@/components/ServicePage'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import RichText from '@/components/RichText'
import { GoogleReviewsSection } from '@/components/google-reviews/GoogleReviewsSection'
import { QuoteRequestForm } from '@/components/home/QuoteRequestForm'
import { TrackedContactLink } from '@/components/TrackedContactLink'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { phoneHref, whatsappHref } from '@/lib/contactLinks'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { captionText, sofaGalleryItems } from '@/lib/sofaGalleryItems'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { FabricGuide } from '@/components/sofa-upholstery/FabricGuide'
import { FoamComfort } from '@/components/sofa-upholstery/FoamComfort'
import { RelatedServiceCards } from '@/components/sofa-upholstery/RelatedServiceCards'
import { mediaRecord, SofaImage } from '@/components/sofa-upholstery/SofaImage'
import { SofaServiceCards } from '@/components/sofa-upholstery/SofaServiceCards'
import { SofaGallery } from '@/components/sofa-upholstery/SofaGallery'

const SLUG = 'bed-upholstery'
const COMPARISON_LEFT_HREF = '/bed-upholstery/'
const COMPARISON_RIGHT_HREF = '/custom-beds-headboards/'

function ContactActions({
  location,
  whatsapp,
  phone,
  label,
}: {
  location: string
  whatsapp: string | null
  phone: string | null
  label: string | null | undefined
}) {
  return (
    <div className="action-row sofa-contact-actions">
      {whatsapp && (
        <TrackedContactLink
          analytics={{ cta_location: location, service: SLUG }}
          eventName="whatsapp_click"
          className="button sofa-whatsapp-button"
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          {label || 'WhatsApp Your Bed Photo'}
        </TrackedContactLink>
      )}
      {phone && (
        <TrackedContactLink
          analytics={{ cta_location: location, service: SLUG }}
          eventName="phone_call_click"
          className="button button-secondary"
          href={phone}
        >
          Call Now
        </TrackedContactLink>
      )}
    </div>
  )
}

type BedLanding = NonNullable<Service['bedUpholsteryLanding']>

function HeadboardStyleGrid({ cards }: { cards: BedLanding['headboardStyles'] }) {
  if (!cards?.length) return null
  return (
    <section className="service-section service-options-section">
      <div className="site-container">
        <header className="section-heading">
          <p className="eyebrow">Headboard styles</p>
          <h2>Headboard shapes we re-upholster</h2>
          <p>Profiles vary; send photos of your existing headboard so we can confirm the approach.</p>
        </header>
        <div className="sofa-card-grid sofa-popular-grid">
          {cards.map((card) => (
            <article className="sofa-visual-card" key={card.id || card.title}>
              <SofaImage resource={card.image} />
              <div className="sofa-card-copy">
                <h3>{card.title}</h3>
                {card.description && <p>{card.description}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function BeforeAfterSection({ content }: { content: BedLanding['beforeAfter'] }) {
  if (!content?.heading || !content.beforeImage || !content.afterImage) return null
  return (
    <section className="service-section service-feature">
      <div className="site-container">
        <header className="section-heading">
          <h2>{content.heading}</h2>
          {content.copy && <p>{content.copy}</p>}
        </header>
        <div className="service-comparison-grid">
          <figure>
            <SofaImage resource={content.beforeImage} sizes="(max-width: 768px) 100vw, 45vw" />
            {content.beforeCaption && <figcaption>{content.beforeCaption}</figcaption>}
          </figure>
          <figure>
            <SofaImage resource={content.afterImage} sizes="(max-width: 768px) 100vw, 45vw" />
            {content.afterCaption && <figcaption>{content.afterCaption}</figcaption>}
          </figure>
        </div>
      </div>
    </section>
  )
}

export async function BedUpholsteryPage({ gallery }: { gallery?: React.ReactNode } = {}) {
  const service = await queryServiceBySlug(SLUG)
  if (!service) notFound()
  const [schemaGlobals, contact, reviews] = await Promise.all([
    getSchemaGlobals(),
    getCachedGlobal('contact-information', 1)(),
    GoogleReviewsSection({}),
  ])
  const breadcrumbs = buildBreadcrumbs(`/${SLUG}/`, service)
  const visibleFaqs = (service.faqs ?? []).filter((faq): faq is Faq =>
    Boolean(faq && typeof faq === 'object'),
  )
  const schemas = buildSchemas({
    breadcrumbs,
    globals: schemaGlobals,
    includeOrganization: false,
    kind: 'service',
    path: `/${SLUG}/`,
    record: service,
    visibleFaqs,
  })
  const landing = service.bedUpholsteryLanding
  const labels = service.presentationLabels
  const heroCaption =
    captionText(mediaRecord(service.hero?.image)?.caption).trim() || service.galleryIntro?.trim()
  const areas = (service.serviceAreas ?? []).map(({ area }) => area).filter(Boolean)
  const whatsapp =
    contact.whatsappAvailable === false
      ? null
      : whatsappHref(contact.whatsappE164, service.whatsAppContext?.message)
  const phone = phoneHref(contact.phoneE164)
  const quoteLabel = service.quotationContext?.buttonLabel || 'Get Free Quote'
  const contacts = (location: string, label = service.whatsAppContext?.label) => (
    <ContactActions location={location} whatsapp={whatsapp} phone={phone} label={label} />
  )

  return (
    <article className="service-page sofa-page">
      <JsonLd schemas={schemas} />
      <div className="service-breadcrumb-wrap site-container">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <section className="service-hero">
        <div className="site-container service-hero-layout">
          <div className="service-hero-copy">
            {service.hero?.eyebrow && <p className="eyebrow">{service.hero.eyebrow}</p>}
            <h1>{service.hero?.heading || service.title}</h1>
            <p>{service.hero?.copy || service.summary}</p>
            <div className="sofa-hero-actions">
              <a className="button button-primary" href="#request-service-quote">
                {labels?.heroQuoteLabel || quoteLabel}
              </a>
              {contacts('service_hero')}
            </div>
            {labels?.workshopNote && <p className="service-workshop-note">{labels.workshopNote}</p>}
            {Boolean(service.trustItems?.length) && (
              <ul aria-label={`${service.title} service highlights`} className="sofa-hero-trust">
                {(service.trustItems ?? []).slice(0, 3).map((item) => (
                  <li key={item.id || item.label}>{item.label}</li>
                ))}
              </ul>
            )}
          </div>
          {service.hero?.image && (
            <figure className="service-hero-media">
              <SofaImage
                resource={service.hero.image}
                hero
                describedBy={heroCaption ? 'bed-hero-caption' : undefined}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {heroCaption && <figcaption id="bed-hero-caption">{heroCaption}</figcaption>}
            </figure>
          )}
        </div>
      </section>
      {Boolean(service.trustItems?.length) && (
        <aside
          aria-label={`${service.title} service highlights`}
          className="service-trust-strip sofa-trust-strip-secondary"
        >
          <div className="site-container service-trust-grid">
            {service.trustItems?.map((item) => (
              <span key={item.id || item.label}>{item.label}</span>
            ))}
          </div>
        </aside>
      )}

      {service.details && (
        <section className="service-section service-introduction">
          <div className="site-container service-narrow prose">
            <RichText content={service.details as never} />
          </div>
        </section>
      )}

      {Boolean(landing?.upholsteryTypes?.length) && (
        <section className="service-section service-options-section">
          <div className="site-container">
            <header className="section-heading">
              {service.serviceOptions?.eyebrow && (
                <p className="eyebrow">{service.serviceOptions.eyebrow}</p>
              )}
              <h2>{service.serviceOptions?.heading || 'What we upholster'}</h2>
              {service.serviceOptions?.intro && <p>{service.serviceOptions.intro}</p>}
            </header>
            <div className="service-option-grid">
              {landing?.upholsteryTypes?.map((item, index) => (
                <article className="service-option-card" key={item.id || item.title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {Boolean(landing?.popularServices?.length) && (
        <section className="service-section service-options-section">
          <div className="site-container">
            <header className="section-heading">
              <h2>Popular bed upholstery services</h2>
            </header>
            <SofaServiceCards cards={landing?.popularServices} />
          </div>
        </section>
      )}

      {Boolean(landing?.fabricCards?.length) && (
        <section className="service-section service-materials-section">
          <div className="site-container">
            <header className="section-heading">
              {labels?.materialsEyebrow && <p className="eyebrow">{labels.materialsEyebrow}</p>}
              <h2>{service.materialsHeading}</h2>
            </header>
            <FabricGuide cards={landing?.fabricCards} />
          </div>
        </section>
      )}

      <HeadboardStyleGrid cards={landing?.headboardStyles} />

      <FoamComfort content={landing?.paddingComfort} />

      <BeforeAfterSection content={landing?.beforeAfter} />

      {service.comparison?.heading && (
        <section className="service-section service-comparison-section">
          <div className="site-container">
            <header className="section-heading">
              <h2>{service.comparison.heading}</h2>
              {service.comparison.intro && <p>{service.comparison.intro}</p>}
            </header>
            <div className="service-comparison-grid">
              <article>
                <h3>
                  <Link href={COMPARISON_LEFT_HREF}>{service.comparison.leftTitle}</Link>
                </h3>
                <ul>
                  {service.comparison.leftItems?.map((item) => (
                    <li key={item.id || item.text}>{item.text}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>
                  <Link href={COMPARISON_RIGHT_HREF}>{service.comparison.rightTitle}</Link>
                </h3>
                <ul>
                  {service.comparison.rightItems?.map((item) => (
                    <li key={item.id || item.text}>{item.text}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>
      )}

      {Boolean(service.process?.length) && (
        <section className="service-section service-process-section">
          <div className="site-container">
            <header className="section-heading">
              {labels?.processEyebrow && <p className="eyebrow">{labels.processEyebrow}</p>}
              <h2>{service.processHeading}</h2>
            </header>
            <ol className="service-process-grid">
              {service.process?.map((step, index) => (
                <li key={step.id || step.title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  {step.description && <p>{step.description}</p>}
                </li>
              ))}
            </ol>
            <a className="button button-primary sofa-section-action" href="#request-service-quote">
              {labels?.processCtaLabel || quoteLabel}
            </a>
          </div>
        </section>
      )}

      {(gallery !== undefined || Boolean(service.gallery?.length)) && (
        <section className="service-section service-gallery-section">
          <div className="site-container">
            <header className="section-heading">
              {labels?.galleryEyebrow && <p className="eyebrow">{labels.galleryEyebrow}</p>}
              <h2>{service.galleryHeading}</h2>
              {service.galleryIntro && <p>{service.galleryIntro}</p>}
            </header>
            {gallery ?? (
              <SofaGallery
                heading={service.galleryHeading || 'Bed upholstery gallery'}
                intro={service.galleryIntro}
                items={sofaGalleryItems(service.gallery)}
              />
            )}
          </div>
        </section>
      )}

      {reviews}

      {Boolean(service.relatedServices?.length) && (
        <section className="service-section service-related-section">
          <div className="site-container">
            <header className="section-heading">
              {labels?.relatedEyebrow && <p className="eyebrow">{labels.relatedEyebrow}</p>}
              <h2>{service.relatedHeading}</h2>
            </header>
            <RelatedServiceCards services={service.relatedServices} />
          </div>
        </section>
      )}

      {areas.length > 0 && (
        <section className="service-section service-areas-section">
          <div className="site-container service-areas-layout">
            <header className="section-heading">
              {labels?.areasEyebrow && <p className="eyebrow">{labels.areasEyebrow}</p>}
              <h2>{service.serviceAreaHeading}</h2>
              {service.serviceAreaCopy && <p>{service.serviceAreaCopy}</p>}
            </header>
            <div>
              <div className="service-area-chips">
                {areas.map((area) => (
                  <span key={area}>{area}</span>
                ))}
              </div>
              {service.areaLinkLabel && (
                <Link className="text-link" href="/#areas-we-serve">
                  {service.areaLinkLabel} <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {visibleFaqs.length > 0 && (
        <section className="service-section service-faq-section">
          <div className="site-container service-faq-layout">
            <header className="section-heading">
              {labels?.faqEyebrow && <p className="eyebrow">{labels.faqEyebrow}</p>}
              <h2>{labels?.faqHeading}</h2>
              {labels?.faqIntroduction && <p>{labels.faqIntroduction}</p>}
            </header>
            <div className="service-faq-list">
              {visibleFaqs.map((faq) => (
                <details key={faq.id}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="service-quote-section" id="request-service-quote">
        <div className="site-container service-quote-layout">
          <div className="service-quote-copy">
            {labels?.quoteEyebrow && <p className="eyebrow">{labels.quoteEyebrow}</p>}
            <h2>{service.quotationContext?.heading}</h2>
            {service.quotationContext?.message && <p>{service.quotationContext.message}</p>}
            {contacts('service_quote', labels?.quoteWhatsAppLabel || service.whatsAppContext?.label)}
          </div>
          <QuoteRequestForm
            areas={areas}
            heading={quoteLabel}
            labels={{ submitLabel: service.quotationContext?.buttonLabel }}
            formLocation="service_quote"
            service={SLUG}
            services={[{ slug: SLUG, title: service.title }]}
          />
        </div>
      </section>
    </article>
  )
}
