import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { QuoteRequestForm } from '@/components/home/QuoteRequestForm'
import { TrackedContactLink } from '@/components/TrackedContactLink'
import { cmsFallbacks } from '@/data/cmsFallbacks'
import { SERVICE_AREA_GROUP_LABELS, SERVICE_AREA_GROUPS } from '@/data/serviceAreas'
import type { Area, Service } from '@/payload-types'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { queryPublicList } from '@/lib/publicQueries'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function generateMetadata(): Promise<Metadata> {
  const [defaults, content] = await Promise.all([
    getSeoDefaults(),
    getCachedGlobal('contact-page', 1)(),
  ])

  return buildMetadata({ seo: content.seo }, {
    ...defaults,
    brandName: null,
    descriptionFallback: cmsFallbacks.contact.metaDescription,
    path: '/contact/',
    titleFallback: cmsFallbacks.contact.metaTitle,
    titlePattern: '{title}',
  })
}

const digitsOnly = (value?: null | string): string => (value ?? '').replace(/\D/g, '')

const formatTime = (value?: null | string): string => {
  if (!value || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return value ?? ''

  const [hours = 0, minutes = 0] = value.split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12

  return `${displayHours}:${String(minutes).padStart(2, '0')} ${suffix}`
}

export default async function ContactPage() {
  const breadcrumbs = buildBreadcrumbs('/contact/')
  const [contact, content, homepage, areas, services, globals] = await Promise.all([
    getCachedGlobal('contact-information', 1)(),
    getCachedGlobal('contact-page', 1)(),
    getCachedGlobal('homepage', 1)(),
    queryPublicList<Area>({ collection: 'areas', depth: 2, limit: 100, sort: 'order' }),
    queryPublicList<Service>({ collection: 'services', depth: 0, limit: 20 }),
    getSchemaGlobals(),
  ])
  const schemas = buildSchemas({
    breadcrumbs,
    globals,
    includeLocalBusiness: true,
    kind: 'page',
    path: '/contact/',
  })

  const address = contact?.address
  const locality = [...new Set([address?.city, address?.emirate].filter(Boolean))].join(', ')
  const addressLines = [
    address?.line1,
    address?.line2,
    locality,
    address?.country,
  ].filter((line): line is string => Boolean(line && line.length > 0))
  const phoneDigits = digitsOnly(contact?.phoneE164)
  const whatsappDigits =
    contact?.whatsappAvailable === false ? '' : digitsOnly(contact?.whatsappE164)
  const openingHours = (contact?.openingHours ?? []).filter((entry) => entry?.day)
  const openDays = openingHours.filter((entry) => !entry.closed && entry.opens && entry.closes)
  const commonHours = openDays[0]
  const hasUniformHours = Boolean(
    commonHours &&
    openDays.every(
      (entry) => entry.opens === commonHours.opens && entry.closes === commonHours.closes,
    ),
  )
  const hoursLabel = hasUniformHours
    ? `${formatTime(commonHours?.opens)} – ${formatTime(commonHours?.closes)}`
    : null

  return (
    <>
      <JsonLd schemas={schemas} />

      <section className="contact-hero">
        <div className="site-container contact-hero-layout">
          <div className="contact-hero-copy">
            <div className="contact-breadcrumbs">
              <Breadcrumbs items={breadcrumbs} />
            </div>
            <p className="eyebrow">{content.hero?.eyebrow || cmsFallbacks.contact.eyebrow}</p>
            <h1>{content.hero?.heading || cmsFallbacks.contact.heading}</h1>
            <p>{content.hero?.introduction || cmsFallbacks.contact.intro}</p>
            <div className="action-row">
              <a className="button button-primary" href="#request-quote">
                {content.hero?.primaryLabel || 'Request a Free Quotation'}
              </a>
              {whatsappDigits && (
                <TrackedContactLink
                  analytics={{ cta_location: 'contact_hero' }}
                  className="button button-whatsapp"
                  eventName="whatsapp_click"
                  href={`https://wa.me/${whatsappDigits}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {content.hero?.whatsAppLabel || 'WhatsApp Us'}
                </TrackedContactLink>
              )}
            </div>
          </div>

          <aside className="contact-hero-card" aria-label="Workshop contact details">
            <p className="eyebrow">{content.workshopCard?.eyebrow || 'Ajman workshop'}</p>
            {phoneDigits && (
              <TrackedContactLink analytics={{ cta_location: 'contact_details' }} className="contact-primary-link" eventName="phone_call_click" href={`tel:+${phoneDigits}`}>
                <span>{content.workshopCard?.callLabel || 'Call the workshop'}</span>
                <strong>{contact?.phoneE164}</strong>
              </TrackedContactLink>
            )}
            {contact?.email && (
              <a className="contact-detail-row" href={`mailto:${contact.email}`}>
                <span>{content.workshopCard?.emailLabel || 'Email'}</span>
                <strong>{contact.email}</strong>
              </a>
            )}
            {addressLines.length > 0 && (
              <address className="contact-detail-row">
                <span>{content.workshopCard?.visitLabel || 'Visit'}</span>
                <strong>{addressLines.join(', ')}</strong>
              </address>
            )}
            <div className="contact-detail-row">
              <span>{content.workshopCard?.hoursLabel || 'Workshop hours'}</span>
              <strong>Saturday–Thursday · Closed Friday</strong>
            </div>
            {contact?.mapURL && (
              <a
                className="text-link contact-map-link"
                href={contact.mapURL}
                rel="noopener noreferrer"
                target="_blank"
              >
                {content.workshopCard?.mapLabel || 'Open workshop in Google Maps'} <span aria-hidden="true">↗</span>
              </a>
            )}
          </aside>
        </div>
      </section>

      <aside aria-label="Ways to contact Al Rukn" className="contact-channel-strip">
        <div className="site-container">
          <span>{content.channelLabels?.call || 'Call'}</span>
          <span>{content.channelLabels?.whatsApp || 'WhatsApp'}</span>
          <span>{content.channelLabels?.email || 'Email'}</span>
          <span>{content.channelLabels?.visit || 'Visit the workshop'}</span>
        </div>
      </aside>

      <section className="home-section contact-quote-section">
        <div className="site-container contact-quote-layout">
          <div className="contact-quote-copy">
            <p className="eyebrow">{content.quoteSection?.eyebrow || 'Start with the details'}</p>
            <h2>{content.quoteSection?.heading || 'Tell Us What You Need Made or Repaired'}</h2>
            <p>{content.quoteSection?.introduction || cmsFallbacks.contact.formDescription}</p>
            <ul>
              {(content.quoteSection?.checklist?.length
                ? content.quoteSection.checklist.map(({ item }) => item).filter(Boolean)
                : cmsFallbacks.contact.quoteChecklist).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="contact-response-note">
              {content.quoteSection?.responseNote || 'Prefer to speak first? Call or WhatsApp the workshop and we will tell you what information will help us prepare the quotation.'}
            </p>
          </div>
          <QuoteRequestForm
            areas={areas.docs.map((area) => area.name)}
            formLocation="contact_quote"
            heading={content.quoteSection?.formHeading || cmsFallbacks.contact.formHeading}
            labels={homepage.quoteForm}
            leadType="contact"
            services={services.docs.map(({ slug, title }) => ({ slug, title }))}
          />
        </div>
      </section>

      <section className="home-section contact-hours-section">
        <div className="site-container contact-hours-layout">
          <header className="section-heading">
            <p className="eyebrow">{content.hoursSection?.eyebrow || 'Plan your visit'}</p>
            <h2>{content.hoursSection?.heading || cmsFallbacks.contact.hoursHeading}</h2>
            <p>{content.hoursSection?.introduction || cmsFallbacks.contact.hoursIntro}</p>
          </header>
          <dl className="contact-hours-card">
            {hoursLabel ? (
              <>
                <div>
                  <dt>{content.hoursSection?.openDaysLabel || 'Saturday–Thursday'}</dt>
                  <dd>{hoursLabel}</dd>
                </div>
                <div>
                  <dt>{content.hoursSection?.closedDayLabel || 'Friday'}</dt>
                  <dd>{content.hoursSection?.closedLabel || 'Closed'}</dd>
                </div>
              </>
            ) : (
              openingHours.map((entry) => (
                <div key={entry.id ?? entry.day}>
                  <dt>{entry.day ? entry.day.charAt(0).toUpperCase() + entry.day.slice(1) : ''}</dt>
                  <dd>
                    {entry.closed
                      ? 'Closed'
                      : `${formatTime(entry.opens)} – ${formatTime(entry.closes)}`}
                  </dd>
                </div>
              ))
            )}
          </dl>
        </div>
      </section>

      {areas.docs.length > 0 && (
        <section className="home-section contact-coverage" id="areas-we-cover">
          <div className="site-container">
            <header className="section-heading">
              <p className="eyebrow">{content.coverageSection?.eyebrow || 'UAE service coverage'}</p>
              <h2>{content.coverageSection?.heading || cmsFallbacks.contact.areasHeading}</h2>
              <p>{content.coverageSection?.introduction || cmsFallbacks.contact.areasIntro}</p>
            </header>
            <div className="contact-area-groups">
              {SERVICE_AREA_GROUPS.map((group) => {
                const groupAreas = areas.docs.filter((area) => area.group === group)
                if (!groupAreas.length) return null

                return (
                  <details className="contact-area-group" key={group} open={group === 'dubai'}>
                    <summary>
                      {SERVICE_AREA_GROUP_LABELS[group]} <span>{groupAreas.length}</span>
                    </summary>
                    <div className="contact-area-chips">
                      {groupAreas.map((area) => (
                        <span key={area.id}>{area.name}</span>
                      ))}
                    </div>
                  </details>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="home-section contact-services-section">
        <div className="site-container contact-services-layout">
          <header className="section-heading">
            <p className="eyebrow">{content.servicesSection?.eyebrow || 'What can we quote?'}</p>
            <h2>{content.servicesSection?.heading || 'Furniture and Upholstery Services'}</h2>
            <p>{content.servicesSection?.introduction || 'Explore the service most relevant to your project, then send the form with your dimensions, location and photos.'}</p>
          </header>
          <nav aria-label="Furniture services" className="contact-service-links">
            {services.docs.map((service) => (
              <Link href={`/${service.slug}/`} key={service.slug}>
                {service.title} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  )
}
