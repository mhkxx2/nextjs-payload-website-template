import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductCard } from '@/components/curtains-blinds/ProductCard'
import { JsonLd } from '@/components/JsonLd'
import { QuoteRequestForm } from '@/components/home/QuoteRequestForm'
import { TrackedContactLink } from '@/components/TrackedContactLink'
import { phoneHref, whatsappHref } from '@/lib/contactLinks'
import {
  badgeLabel,
  buildProductQuoteMessage,
  formatAed,
  MEASUREMENT_WHATSAPP_MESSAGE,
  mediaData,
  productCardData,
  productPath,
  SHOW_CATALOGUE_PRICES,
} from '@/lib/curtainsBlinds'
import { getCurtainBlindProductBySlug, getCurtainBlindProducts } from '@/lib/curtainsBlindsQueries'
import { SCHEMA_CONTEXT } from '@/lib/schema'
import { CANONICAL_ORIGIN } from '@/seed/business'
import type { CurtainBlindCategory, Media } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { ProductViewTracker } from '@/components/curtains-blinds/ProductViewTracker'

const absoluteURL = (path: string) =>
  path.startsWith('http://') || path.startsWith('https://')
    ? path
    : `${CANONICAL_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`

type Props = { slug: string }

export async function ProductDetail({ slug }: Props) {
  const [product, contact, allProducts] = await Promise.all([
    getCurtainBlindProductBySlug(slug),
    getCachedGlobal('contact-information', 1)(),
    getCurtainBlindProducts(),
  ])
  if (!product) notFound()

  const categories = (product.categories || []).filter(
    (category): category is CurtainBlindCategory => Boolean(category && typeof category === 'object'),
  )
  const primaryCategory = categories[0]
  const featured = mediaData(product.featuredImage)
  const gallery = [
    featured,
    ...(product.gallery || [])
      .map((entry) => mediaData(entry.image as Media | number | null | undefined))
      .filter(Boolean),
  ].filter((item, index, list): item is NonNullable<typeof item> => {
    if (!item) return false
    return list.findIndex((candidate) => candidate?.url === item.url) === index
  })

  const href = productPath(product.slug)
  const current = product.salePrice ?? product.regularPrice
  const priceLabel = SHOW_CATALOGUE_PRICES ? formatAed(current) : null
  const message = buildProductQuoteMessage({
    category: primaryCategory?.name,
    name: product.name,
    path: href,
    priceLabel: priceLabel ? `${priceLabel}${product.priceSuffix || ''}` : null,
    sku: product.sku,
  })
  const whatsapp = whatsappHref(contact.whatsappE164, message)
  const measurementWhatsApp = whatsappHref(contact.whatsappE164, MEASUREMENT_WHATSAPP_MESSAGE)
  const phone = phoneHref(contact.phoneE164)
  const badge = badgeLabel(product.badge === 'on-sale' && !SHOW_CATALOGUE_PRICES ? 'none' : product.badge)
  const related = allProducts
    .filter((item) => item.slug !== product.slug)
    .filter((item) => {
      if (!primaryCategory) return item.productType === product.productType
      return (item.categories || []).some((category) =>
        typeof category === 'object' ? category?.id === primaryCategory.id : category === primaryCategory.id,
      )
    })
    .slice(0, 4)
    .map((item) => productCardData(item, contact.whatsappE164))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const schemas = [
    {
      '@context': SCHEMA_CONTEXT,
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', item: absoluteURL('/'), name: 'Home', position: 1 },
        { '@type': 'ListItem', item: absoluteURL('/curtains-blinds/'), name: 'Curtains & Blinds', position: 2 },
        { '@type': 'ListItem', item: absoluteURL(href), name: product.name, position: 3 },
      ],
    },
    {
      '@context': SCHEMA_CONTEXT,
      '@type': 'Product',
      brand: { '@type': 'Brand', name: 'Al Rukn Furniture' },
      category: primaryCategory?.name || product.productType,
      description: product.shortDescription || product.metaDescription || product.name,
      image: gallery.map((item) => absoluteURL(item.url)),
      name: product.name,
      sku: product.sku || undefined,
      url: absoluteURL(href),
      ...(SHOW_CATALOGUE_PRICES && current
        ? {
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              price: String(current),
              priceCurrency: 'AED',
              url: absoluteURL(href),
            },
          }
        : {}),
    },
  ]

  return (
    <article className="cb-page cb-product-page">
      <ProductViewTracker category={primaryCategory?.slug || product.productType} name={product.name} />
      <JsonLd schemas={schemas} />
      <div className="section-shell cb-product-top">
        <Breadcrumbs
          items={[
            { href: '/curtains-blinds/', label: 'Curtains & Blinds' },
            ...(primaryCategory
              ? [{ href: `/curtains-blinds/?category=${primaryCategory.slug}`, label: primaryCategory.name }]
              : []),
            { label: product.name },
          ]}
        />
      </div>

      <section className="section-shell cb-product-layout">
        <div className="cb-product-gallery">
          {gallery[0] ? (
            <div className="cb-product-gallery-main">
              <Image
                alt={gallery[0].alt || `${product.name} design option`}
                height={gallery[0].height}
                priority
                sizes="(max-width: 900px) 100vw, 55vw"
                src={gallery[0].url}
                width={gallery[0].width}
              />
            </div>
          ) : null}
          {gallery.length > 1 ? (
            <div className="cb-product-gallery-thumbs">
              {gallery.slice(1).map((image) => (
                <Image
                  alt={image.alt || `${product.name} detail`}
                  height={image.height}
                  key={image.url}
                  sizes="120px"
                  src={image.url}
                  width={image.width}
                />
              ))}
            </div>
          ) : null}
          <p className="cb-catalogue-note">
            Catalogue / fabric design reference for quotation — not labelled as a completed Al Rukn project photo.
          </p>
        </div>

        <div className="cb-product-summary">
          {badge ? <span className="cb-product-badge">{badge}</span> : null}
          <h1>{product.name}</h1>
          {primaryCategory ? (
            <p className="cb-product-category">
              <Link href={`/curtains-blinds/?category=${primaryCategory.slug}`}>{primaryCategory.name}</Link>
            </p>
          ) : null}
          {product.sku ? <p className="cb-product-sku">SKU: {product.sku}</p> : null}
          <div className="cb-product-price">
            {SHOW_CATALOGUE_PRICES && (formatAed(current) || formatAed(product.regularPrice)) ? (
              <>
                {product.salePrice != null &&
                product.regularPrice != null &&
                product.salePrice < product.regularPrice ? (
                  <span className="cb-price-was">
                    {formatAed(product.regularPrice)}
                    {product.priceSuffix || ''}
                  </span>
                ) : null}
                <span className="cb-price-now">
                  {formatAed(current) || 'Request Price'}
                  {current != null ? product.priceSuffix || '' : ''}
                </span>
              </>
            ) : (
              <span className="cb-price-now">Request Price</span>
            )}
          </div>
          {product.shortDescription ? <p className="cb-product-short">{product.shortDescription}</p> : null}
          <div className="action-row cb-product-cta-row">
            {whatsapp ? (
              <TrackedContactLink
                analytics={{
                  category: primaryCategory?.slug || product.productType,
                  cta_location: 'curtains_product_detail',
                  service: 'curtains-blinds',
                }}
                className="button button-primary"
                eventName="whatsapp_click"
                href={whatsapp}
                rel="noopener noreferrer"
                target="_blank"
              >
                WhatsApp Quote
              </TrackedContactLink>
            ) : null}
            {measurementWhatsApp ? (
              <TrackedContactLink
                analytics={{ cta_location: 'curtains_product_measurement', service: 'curtains-blinds' }}
                className="button button-secondary"
                eventName="whatsapp_click"
                href={measurementWhatsApp}
                rel="noopener noreferrer"
                target="_blank"
              >
                Book Measurement
              </TrackedContactLink>
            ) : null}
            <Link className="button button-secondary" href="#request-quote">
              Request Quote
            </Link>
            {phone ? (
              <TrackedContactLink
                analytics={{ cta_location: 'curtains_product_detail', service: 'curtains-blinds' }}
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

      {(product.fullDescription || (product.features && product.features.length > 0)) && (
        <section className="section-shell cb-product-details">
          {product.fullDescription ? (
            <div>
              <h2>Description</h2>
              <p>{product.fullDescription}</p>
            </div>
          ) : null}
          {product.features && product.features.length > 0 ? (
            <div>
              <h2>Specifications</h2>
              <dl className="cb-specs">
                {product.features.map((feature) => (
                  <div key={`${feature.label}-${feature.value}`}>
                    <dt>{feature.label}</dt>
                    <dd>{feature.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </section>
      )}

      {related.length ? (
        <section className="section-shell cb-related">
          <div className="cb-section-heading">
            <p className="eyebrow">Related</p>
            <h2>Related designs</h2>
          </div>
          <div className="cb-product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="cb-quote section-shell" id="request-quote">
        <div className="cb-quote-copy">
          <p className="eyebrow">Quotation</p>
          <h2>Request a quote for {product.name}</h2>
          <p>We will confirm measurement, fabric options and installation details for your windows.</p>
        </div>
        <QuoteRequestForm
          areas={[]}
          defaultMessage={message}
          formLocation="curtains_product_quote"
          service="curtains-blinds"
          services={[{ slug: 'curtains-blinds', title: 'Curtains & Blinds' }]}
        />
      </section>
    </article>
  )
}
