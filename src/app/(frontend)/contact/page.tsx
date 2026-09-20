import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { LocationCoverageBlockComponent } from '@/blocks/LocationCoverage/Component'
import { QuoteFormBlockComponent } from '@/blocks/QuoteForm/Component'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { contactCopy, homeCopy } from '@/data/launch-copy'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const metadata: Metadata = {
  description: contactCopy.intro,
  title: 'Contact | Al Rukn Furniture',
}

const formatDay = (day?: null | string): string =>
  day ? day.charAt(0).toUpperCase() + day.slice(1) : ''

const digitsOnly = (value?: null | string): string => (value ?? '').replace(/\D/g, '')

export default async function ContactPage() {
  const contact = await getCachedGlobal('contact-information', 1)()

  const address = contact?.address
  const addressLines = [
    address?.line1,
    address?.line2,
    [address?.city, address?.emirate].filter(Boolean).join(', '),
    address?.country,
  ].filter((line): line is string => Boolean(line && line.length > 0))

  const phoneDigits = digitsOnly(contact?.phoneE164)
  const whatsappDigits = contact?.whatsappAvailable === false ? '' : digitsOnly(contact?.whatsappE164)
  const openingHours = (contact?.openingHours ?? []).filter((entry) => entry?.day)
  const areas = (contact?.serviceAreas ?? [])
    .filter((item) => item?.area)
    .map((item) => ({ name: item.area as string }))

  const hasDetails =
    Boolean(phoneDigits) || Boolean(contact?.email) || addressLines.length > 0

  return (
    <>
      <div className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={[{ label: 'Contact' }]} />
          <header className="max-w-3xl py-6">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal mb-4">
              {contactCopy.heading}
            </h1>
            <p className="text-neutral-700">{contactCopy.intro}</p>
          </header>
        </div>
      </div>

      <div className="pb-16">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="p-6 bg-white rounded-xl border border-neutral-200">
            <h2 className="font-serif font-bold text-2xl text-charcoal mb-5">
              {contactCopy.detailsHeading}
            </h2>

            {hasDetails ? (
              <dl className="space-y-4 text-neutral-700">
                {phoneDigits && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">Phone</dt>
                    <dd className="mt-1">
                      <a
                        className="text-amber-800 hover:text-amber-900 font-semibold"
                        href={`tel:+${phoneDigits}`}
                      >
                        {contact?.phoneE164}
                      </a>
                    </dd>
                  </div>
                )}

                {whatsappDigits && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">WhatsApp</dt>
                    <dd className="mt-1">
                      <a
                        className="text-amber-800 hover:text-amber-900 font-semibold"
                        href={`https://wa.me/${whatsappDigits}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Message us on WhatsApp
                      </a>
                    </dd>
                  </div>
                )}

                {contact?.email && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">Email</dt>
                    <dd className="mt-1">
                      <a
                        className="text-amber-800 hover:text-amber-900 font-semibold"
                        href={`mailto:${contact.email}`}
                      >
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                )}

                {addressLines.length > 0 && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">Address</dt>
                    <dd className="mt-1 space-y-1">
                      {addressLines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                      {contact?.mapURL && (
                        <p>
                          <a
                            className="text-amber-800 hover:text-amber-900 font-semibold"
                            href={contact.mapURL}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Open in maps
                          </a>
                        </p>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-neutral-600">{contactCopy.noDetailsMessage}</p>
            )}
          </section>

          <section className="p-6 bg-neutral-50 rounded-xl border border-neutral-200">
            <h2 className="font-serif font-bold text-2xl text-charcoal mb-5">
              {contactCopy.hoursHeading}
            </h2>

            {openingHours.length > 0 ? (
              <dl className="space-y-3 text-neutral-700">
                {openingHours.map((entry) => (
                  <div
                    key={entry.id ?? entry.day}
                    className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-2"
                  >
                    <dt className="font-medium">{formatDay(entry.day)}</dt>
                    <dd className="text-sm text-neutral-600">
                      {entry.closed ? 'Closed' : [entry.opens, entry.closes].filter(Boolean).join(' – ')}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-neutral-600">
                Opening hours have not been published yet. Use the form below and the team will
                confirm the next available slot.
              </p>
            )}
          </section>
        </div>
      </div>

      {areas.length > 0 && (
        <LocationCoverageBlockComponent
          areas={areas}
          heading={contactCopy.areasHeading}
          subheading={homeCopy.coverage.subheading}
        />
      )}

      <QuoteFormBlockComponent
        description={contactCopy.formDescription}
        heading={contactCopy.formHeading}
      />

      <div className="container mx-auto px-4 pb-16">
        <Link className="text-amber-800 hover:text-amber-900 font-semibold" href="/services/">
          See everything we make and repair
        </Link>
      </div>
    </>
  )
}
