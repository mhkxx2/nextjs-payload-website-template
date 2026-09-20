import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Service, Project, Faq, Testimonial, Media as MediaType } from '@/payload-types'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { WhatsAppAction } from '@/components/WhatsAppAction'
import { QuoteFormBlockComponent } from '@/blocks/QuoteForm/Component'
import { generateMeta } from '@/utilities/generateMeta'
import { FIXED_SERVICE_SLUGS } from '@/lib/routes'

interface ServicePageProps {
  slug: string
}

export const queryServiceBySlug = cache(async (slug: string): Promise<Service | null> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'services',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return (result.docs?.[0] as Service) || null
})

export async function generateServiceMetadata({ slug }: ServicePageProps): Promise<Metadata> {
  const service = await queryServiceBySlug(slug)
  if (!service) return {}

  return generateMeta({ doc: service })
}

export async function ServicePage({ slug }: ServicePageProps) {
  if (!(FIXED_SERVICE_SLUGS as readonly string[]).includes(slug)) {
    notFound()
  }

  const service = await queryServiceBySlug(slug)
  if (!service) {
    notFound()
  }

  const {
    title,
    summary,
    hero,
    details,
    benefits,
    materialsCapabilities,
    process,
    faqs,
    serviceAreas,
    projects,
    testimonials,
    gallery,
    quotationContext,
    whatsAppContext,
    relatedServices,
  } = service

  const breadcrumbItems = [
    { label: 'Services', href: '/#services' },
    { label: title },
  ]

  const waMessage = whatsAppContext?.message || `Hello Al Rukn, I am inquiring about ${title}.`
  const waHref = `https://wa.me/971501234567?text=${encodeURIComponent(waMessage)}`

  return (
    <article className="min-h-screen bg-cream text-charcoal pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <section className="mt-6 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            {hero?.eyebrow && (
              <span className="inline-block text-xs font-semibold tracking-wider text-amber-800 uppercase bg-amber-100/80 px-3 py-1 rounded-full">
                {hero.eyebrow}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal leading-tight">
              {hero?.heading || title}
            </h1>
            {hero?.copy ? (
              <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl">
                {hero.copy}
              </p>
            ) : summary ? (
              <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl">
                {summary}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#quote-form"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-charcoal rounded-md hover:bg-neutral-800 transition-colors shadow-xs"
              >
                {quotationContext?.heading || 'Request Custom Quote'}
              </a>
              <WhatsAppAction
                href={waHref}
                label={whatsAppContext?.label || 'WhatsApp Expert'}
              />
            </div>
          </div>

          {hero?.image && typeof hero.image === 'object' && (
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-lg border border-neutral-200 aspect-[4/3]">
              <Media resource={hero.image as MediaType} fill className="object-cover" />
            </div>
          )}
        </section>

        {/* Rich Details */}
        {details && (
          <section className="my-12 prose max-w-none">
            <RichText content={details as never} />
          </section>
        )}

        {/* Benefits Section */}
        {benefits && benefits.length > 0 && (
          <section className="my-16 bg-white rounded-2xl p-8 border border-neutral-200 shadow-xs">
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">Why Choose Our {title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((item, idx) => (
                <div key={idx} className="p-6 bg-cream/50 rounded-xl border border-neutral-100 space-y-2">
                  <h3 className="font-semibold text-lg text-charcoal">{item.title}</h3>
                  {item.description && <p className="text-sm text-neutral-600">{item.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Materials & Capabilities */}
        {materialsCapabilities && materialsCapabilities.length > 0 && (
          <section className="my-16">
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">Materials & Craftsmanship</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materialsCapabilities.map((mat, idx) => (
                <div key={idx} className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs">
                  <h3 className="font-semibold text-base text-charcoal mb-1">{mat.title}</h3>
                  {mat.description && <p className="text-sm text-neutral-600">{mat.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Process Steps */}
        {process && process.length > 0 && (
          <section className="my-16">
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">Our Craftsmanship Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {process.map((step, idx) => (
                <div key={idx} className="relative p-6 bg-white rounded-xl border border-neutral-200">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
                    Step 0{idx + 1}
                  </span>
                  <h3 className="font-semibold text-base text-charcoal mb-2">{step.title}</h3>
                  {step.description && <p className="text-xs text-neutral-600">{step.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects */}
        {projects && projects.length > 0 && (
          <section className="my-16">
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">Featured {title} Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((proj) => {
                if (typeof proj !== 'object' || !proj) return null
                const projObj = proj as Project
                return (
                  <Link
                    key={projObj.id}
                    href={`/projects/${projObj.slug}/`}
                    className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-charcoal group-hover:text-amber-800 transition-colors">
                        {projObj.title}
                      </h3>
                      {projObj.summary && <p className="text-xs text-neutral-600 mt-2 line-clamp-2">{projObj.summary}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Gallery */}
        {gallery && gallery.length > 0 && (
          <section className="my-16">
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">Workmanship Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((item, idx) => {
                if (!item.image || typeof item.image !== 'object') return null
                return (
                  <div key={idx} className="relative rounded-xl overflow-hidden aspect-square border border-neutral-200">
                    <Media resource={item.image as MediaType} fill className="object-cover" />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Service Areas */}
        {serviceAreas && serviceAreas.length > 0 && (
          <section className="my-12 py-8 bg-neutral-100 rounded-xl px-8">
            <h3 className="text-lg font-semibold text-charcoal mb-4">Service Availability in UAE</h3>
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white border border-neutral-300 rounded-md text-xs font-medium text-neutral-700"
                >
                  {area.area}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        {faqs && faqs.length > 0 && (
          <section className="my-16 bg-white p-8 rounded-2xl border border-neutral-200">
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6 divide-y divide-neutral-100">
              {faqs.map((faq) => {
                if (typeof faq !== 'object' || !faq) return null
                const faqObj = faq as Faq
                return (
                  <div key={faqObj.id} className="pt-6 first:pt-0">
                    <h3 className="font-semibold text-base text-charcoal mb-2">{faqObj.question}</h3>
                    <p className="text-sm text-neutral-600">{faqObj.answer}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <section className="my-16">
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">Client Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t) => {
                if (typeof t !== 'object' || !t) return null
                const tObj = t as Testimonial
                return (
                  <div key={tObj.id} className="p-6 bg-white rounded-xl border border-neutral-200 shadow-xs space-y-3">
                    <p className="text-sm text-neutral-700 italic">“{tObj.statement}”</p>
                    <div className="text-xs font-semibold text-charcoal">
                      — {tObj.displayName} {tObj.location && `(${tObj.location})`}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Contextual Quote Form Section */}
        <section id="quote-form" className="my-16 bg-white rounded-2xl p-8 border border-neutral-200 shadow-xs">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-charcoal">
              {quotationContext?.heading || `Get a Fast Quote for ${title}`}
            </h2>
            {quotationContext?.message && (
              <p className="text-sm text-neutral-600 mt-2">{quotationContext.message}</p>
            )}
          </div>
          <QuoteFormBlockComponent blockType="quoteForm" heading={null} description={null} />
        </section>

        {/* Related Services */}
        {relatedServices && relatedServices.length > 0 && (
          <section className="my-16 pt-8 border-t border-neutral-200">
            <h2 className="text-xl font-serif font-bold text-charcoal mb-6">Related Furniture Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedServices.map((rel) => {
                if (typeof rel !== 'object' || !rel) return null
                const relService = rel as Service
                return (
                  <Link
                    key={relService.id}
                    href={`/${relService.slug}/`}
                    className="p-4 bg-white rounded-lg border border-neutral-200 hover:border-amber-800 transition-colors group"
                  >
                    <h3 className="font-semibold text-sm text-charcoal group-hover:text-amber-800">
                      {relService.title}
                    </h3>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
