import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CatalogueExplorer } from '@/components/curtains-blinds/CatalogueExplorer'
import { CategoryTabs } from '@/components/curtains-blinds/CategoryTabs'
import { CompactQuoteForm } from '@/components/curtains-blinds/CompactQuoteForm'
import { JsonLd } from '@/components/JsonLd'
import { QuoteRequestForm } from '@/components/home/QuoteRequestForm'
import { queryServiceBySlug } from '@/components/ServicePage'
import { TrackedContactLink } from '@/components/TrackedContactLink'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { phoneHref, whatsappHref } from '@/lib/contactLinks'
import {
  categoryCardData,
  HELP_CHOOSING_WHATSAPP_MESSAGE,
  MEASUREMENT_WHATSAPP_MESSAGE,
  mediaData,
  productCardData,
} from '@/lib/curtainsBlinds'
import { getCurtainBlindCategories, getCurtainBlindProducts } from '@/lib/curtainsBlindsQueries'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import type { Faq, Media } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

const SLUG = 'curtains-blinds'

const PROCESS = [
  ['01', 'Share your requirement', 'Send photos, room use and preferred style on WhatsApp or the quote form.'],
  ['02', 'Choose fabric and style', 'Select from blackout, sheer, linen, roller, zebra and more.'],
  ['03', 'Confirm measurement and quotation', 'We measure the openings and confirm a clear quotation.'],
  ['04', 'Manufacturing and installation', 'Made to measure, then professionally fitted at your property.'],
] as const

const WHY = [
  ['Made to measure', 'Each opening is measured before production.'],
  ['Fabric guidance', 'Practical advice for light, privacy and style.'],
  ['Professional fitting', 'Tracks, rails and blinds installed carefully.'],
  ['Dubai & UAE service', 'Homes and workplaces across Dubai, Sharjah and nearby emirates.'],
] as const

const FAQS: Array<[string, string]> = [
  ['What is the difference between blackout and sheer curtains?', 'Sheer curtains soften daylight. Blackout curtains with lining block nearly all light—ideal for bedrooms. Many homes combine both layers.'],
  ['How do you measure windows?', 'We measure width, drop, stack space and how the curtain or blind should finish relative to the floor, sill or ceiling.'],
  ['Do you install curtains and blinds?', 'Yes. Measurement, making and professional installation are part of the Al Rukn Curtains & Blinds service.'],
  ['Can I send a photo for advice?', 'Yes. WhatsApp a clear window photo with your area and preferred look, and we will suggest suitable options.'],
  ['How does quotation work?', 'Your quotation reflects fabric, size, lining, hardware and installation after measurement—not a fixed catalogue checkout price.'],
  ['Do you offer motorized systems?', 'Yes. Quiet motorized tracks and blind motors can be quoted when you want remote or scheduled control.'],
]

type SearchParams = {
  category?: string | string[]
  type?: string | string[]
}

export async function CurtainsBlindsPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const query = (await searchParams) || {}
  const service = await queryServiceBySlug(SLUG)
  if (!service) notFound()

  const [schemaGlobals, contact, categories, products] = await Promise.all([
    getSchemaGlobals(),
    getCachedGlobal('contact-information', 1)(),
    getCurtainBlindCategories(),
    getCurtainBlindProducts(),
  ])

  const productCards = products
    .map((product) => productCardData(product, contact.whatsappE164))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))
  const categoryCards = categories
    .filter((category) => !['curtains', 'blinds', 'curtain-colors'].includes(category.slug))
    .map(categoryCardData)
  const featuredCurtains = categoryCards.filter(
    (category) => category.type === 'curtain' && categories.find((item) => item.id === category.id)?.featuredOnShop,
  )
  const featuredBlinds = categoryCards.filter(
    (category) => category.type === 'blind' && categories.find((item) => item.id === category.id)?.featuredOnShop,
  )
  const curtainCards = featuredCurtains.length
    ? featuredCurtains
    : categoryCards.filter((category) => category.type === 'curtain')
  const blindCards = featuredBlinds.length
    ? featuredBlinds
    : categoryCards.filter((category) => category.type === 'blind')

  const heroMedia =
    mediaData(service.hero?.image as Media | number | null | undefined) || productCards[0]?.image || null

  const breadcrumbs = buildBreadcrumbs(`/${SLUG}/`, service)
  const cmsFaqs = (service.faqs ?? []).filter((faq): faq is Faq => Boolean(faq && typeof faq === 'object'))
  const faqItems = (cmsFaqs.length
    ? cmsFaqs.map((faq) => [faq.question, typeof faq.answer === 'string' ? faq.answer : ''] as [string, string])
    : FAQS
  ).slice(0, 7)
  const areas = (service.serviceAreas ?? [])
    .map((entry) => (typeof entry === 'object' && entry ? entry.area : null))
    .filter((area): area is string => Boolean(area))

  const schemas = buildSchemas({
    breadcrumbs,
    globals: schemaGlobals,
    includeOrganization: false,
    kind: 'service',
    path: `/${SLUG}/`,
    record: service,
    visibleFaqs: cmsFaqs.length
      ? cmsFaqs.slice(0, 7)
      : faqItems.map(([question, answer]) => ({ answer, question, schemaEligible: true })),
  })

  const quoteWhatsApp = whatsappHref(
    contact.whatsappE164,
    service.whatsAppContext?.message ||
      'Hello Al Rukn Furniture, I would like a quotation for custom curtains or blinds in Dubai.',
  )
  const helpWhatsApp = whatsappHref(contact.whatsappE164, HELP_CHOOSING_WHATSAPP_MESSAGE)
  const measurementWhatsApp = whatsappHref(contact.whatsappE164, MEASUREMENT_WHATSAPP_MESSAGE)
  const phone = phoneHref(contact.phoneE164)
  const initialType =
    typeof query.type === 'string' && (query.type === 'curtain' || query.type === 'blind') ? query.type : 'all'
  const initialCategory = typeof query.category === 'string' ? query.category : null

  return (
    <article className="cb-page">
      <JsonLd schemas={schemas} />

      <section className="cb-hero cb-hero-premium">
        <div className="cb-hero-grid section-shell">
          <div className="cb-hero-copy">
            <div className="cb-breadcrumbs">
              <Breadcrumbs items={breadcrumbs} />
            </div>
            <p className="eyebrow">Curtains & Blinds Dubai</p>
            <h1>Custom Curtains & Blinds in Dubai</h1>
            <p>
              Transform your space with elegant, made-to-measure curtains and blinds. Explore premium fabrics, modern
              designs and professional installation for villas, apartments and offices.
            </p>
            <div className="action-row cb-hero-actions">
              {quoteWhatsApp ? (
                <TrackedContactLink
                  analytics={{ cta_location: 'curtains_hero', service: SLUG }}
                  className="button button-primary"
                  eventName="whatsapp_click"
                  href={quoteWhatsApp}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Get Free Quote on WhatsApp
                </TrackedContactLink>
              ) : (
                <Link className="button button-primary" href="#quick-quote">
                  Get Free Quote on WhatsApp
                </Link>
              )}
              {measurementWhatsApp ? (
                <TrackedContactLink
                  analytics={{ cta_location: 'curtains_hero_measurement', service: SLUG }}
                  className="button button-secondary"
                  eventName="whatsapp_click"
                  href={measurementWhatsApp}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Book a Measurement
                </TrackedContactLink>
              ) : (
                <Link className="button button-secondary" href="#quick-quote">
                  Book a Measurement
                </Link>
              )}
            </div>
            <ul className="cb-hero-highlights">
              <li>Made to Measure</li>
              <li>Premium Fabric Options</li>
              <li>Professional Installation</li>
              <li>Dubai & UAE Service</li>
            </ul>
          </div>
          <div className="cb-hero-visual">
            {heroMedia ? (
              <Image
                alt={heroMedia.alt || 'Custom curtains and blinds interior in Dubai'}
                className="cb-hero-image"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 48vw"
                src={heroMedia.url}
              />
            ) : (
              <div className="cb-hero-fallback" />
            )}
          </div>
        </div>
      </section>

      <section className="cb-lead-band section-shell">
        <CompactQuoteForm areas={areas} whatsappURL={quoteWhatsApp} />
      </section>

      <CategoryTabs blinds={blindCards} curtains={curtainCards} />

      {helpWhatsApp ? (
        <section className="cb-help-strip section-shell">
          <div className="cb-help-panel">
            <div>
              <p className="eyebrow">Need advice?</p>
              <h2>Not Sure Which Curtains Will Suit Your Space?</h2>
              <p>Send us a photo of your windows and our team can help you choose a suitable design.</p>
            </div>
            <TrackedContactLink
              analytics={{ cta_location: 'curtains_help_strip', service: SLUG }}
              className="button button-primary"
              eventName="whatsapp_click"
              href={helpWhatsApp}
              rel="noopener noreferrer"
              target="_blank"
            >
              Send Your Window Photo
            </TrackedContactLink>
          </div>
        </section>
      ) : null}

      <Suspense fallback={<div className="section-shell cb-catalogue-loading">Loading catalogue…</div>}>
        <CatalogueExplorer
          categories={categoryCards}
          initialCategory={initialCategory}
          initialType={initialType}
          products={productCards}
        />
      </Suspense>

      <section className="cb-content-section section-shell">
        <div className="cb-section-heading">
          <p className="eyebrow">Why Al Rukn</p>
          <h2>Why Choose Al Rukn?</h2>
        </div>
        <div className="cb-why-grid">
          {WHY.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cb-content-section cb-alt section-shell">
        <div className="cb-section-heading">
          <p className="eyebrow">Process</p>
          <h2>Our Simple Process</h2>
        </div>
        <ol className="cb-process">
          {PROCESS.map(([step, title, copy]) => (
            <li key={step}>
              <span>{step}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="cb-content-section section-shell" id="faq">
        <div className="cb-section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Useful questions</h2>
        </div>
        <div className="cb-faq-list">
          {faqItems.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cb-final-cta section-shell">
        <div className="cb-final-panel">
          <p className="eyebrow">Next step</p>
          <h2>Ready to Upgrade Your Windows?</h2>
          <p>Tell us what you need. Our team can help you choose the right curtains or blinds for your space.</p>
          <div className="action-row">
            {quoteWhatsApp ? (
              <TrackedContactLink
                analytics={{ cta_location: 'curtains_final_cta', service: SLUG }}
                className="button button-primary"
                eventName="whatsapp_click"
                href={quoteWhatsApp}
                rel="noopener noreferrer"
                target="_blank"
              >
                Get Free Quote
              </TrackedContactLink>
            ) : null}
            {measurementWhatsApp ? (
              <TrackedContactLink
                analytics={{ cta_location: 'curtains_final_measurement', service: SLUG }}
                className="button button-secondary"
                eventName="whatsapp_click"
                href={measurementWhatsApp}
                rel="noopener noreferrer"
                target="_blank"
              >
                Book Measurement
              </TrackedContactLink>
            ) : (
              <Link className="button button-secondary" href="#quick-quote">
                Book Measurement
              </Link>
            )}
            {phone ? (
              <TrackedContactLink
                analytics={{ cta_location: 'curtains_final_cta', service: SLUG }}
                className="button button-secondary"
                eventName="phone_call_click"
                href={phone}
              >
                Call
              </TrackedContactLink>
            ) : null}
          </div>
        </div>
      </section>

      <section className="cb-quote section-shell" id="request-quote">
        <div className="cb-quote-copy">
          <p className="eyebrow">Full quotation</p>
          <h2>Request a detailed curtains & blinds quote</h2>
          <p>
            Prefer a written form? Share your rooms and location. Call +971 55 122 4902 or WhatsApp for a faster reply.
          </p>
        </div>
        <QuoteRequestForm
          areas={areas}
          formLocation="curtains_blinds_quote"
          service={SLUG}
          services={[{ slug: SLUG, title: service.title }]}
        />
      </section>
    </article>
  )
}
