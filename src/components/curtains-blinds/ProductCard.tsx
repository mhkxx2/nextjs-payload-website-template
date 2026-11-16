'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { TrackedContactLink } from '@/components/TrackedContactLink'
import { pushDataLayerEvent } from '@/lib/analytics'
import {
  badgeLabel,
  formatAed,
  type CatalogueProductCard,
} from '@/lib/curtainsBlinds'

type Props = {
  product: CatalogueProductCard
  priority?: boolean
}

export function ProductCard({ product, priority = false }: Props) {
  const badge = badgeLabel(product.badge)
  const sale = formatAed(product.salePrice)
  const regular = formatAed(product.regularPrice)
  const showStrike = Boolean(
    sale &&
      regular &&
      product.salePrice != null &&
      product.regularPrice != null &&
      product.salePrice < product.regularPrice,
  )
  const category = product.categories[0]?.name

  const trackSelect = () => {
    pushDataLayerEvent({
      category: product.categories[0]?.slug || product.productType,
      cta_location: 'curtains_product_card',
      event: 'select_item',
      service: 'curtains-blinds',
    })
  }

  return (
    <article className="cb-product-card">
      <Link className="cb-product-media" href={product.href} onClick={trackSelect}>
        <Image
          alt={product.image.alt || `${product.name} design option`}
          className="cb-product-image"
          height={product.image.height}
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
          src={product.image.url}
          width={product.image.width}
        />
        {product.secondaryImage ? (
          <Image
            alt=""
            aria-hidden="true"
            className="cb-product-image cb-product-image-secondary"
            height={product.secondaryImage.height}
            sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
            src={product.secondaryImage.url}
            width={product.secondaryImage.width}
          />
        ) : null}
        {badge ? <span className="cb-product-badge">{badge}</span> : null}
      </Link>
      <div className="cb-product-body">
        {category ? <p className="cb-product-category">{category}</p> : null}
        <h3 className="cb-product-title">
          <Link href={product.href} onClick={trackSelect}>
            {product.name}
          </Link>
        </h3>
        <div className="cb-product-price">
          {sale || regular ? (
            <>
              {showStrike ? (
                <span className="cb-price-was">
                  {regular}
                  {product.priceSuffix}
                </span>
              ) : null}
              <span className="cb-price-now">
                {sale || regular}
                {product.priceSuffix}
              </span>
            </>
          ) : (
            <span className="cb-price-now">Request Price</span>
          )}
        </div>
        <div className="cb-product-actions">
          {product.whatsappURL ? (
            <TrackedContactLink
              analytics={{
                category: product.categories[0]?.slug || product.productType,
                cta_location: 'curtains_product_card',
                service: 'curtains-blinds',
              }}
              className="button button-primary button-small"
              eventName="whatsapp_click"
              href={product.whatsappURL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Get Quote
            </TrackedContactLink>
          ) : (
            <Link className="button button-primary button-small" href={product.quoteHref}>
              Get Quote
            </Link>
          )}
          <Link className="button button-secondary button-small" href={product.href} onClick={trackSelect}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
