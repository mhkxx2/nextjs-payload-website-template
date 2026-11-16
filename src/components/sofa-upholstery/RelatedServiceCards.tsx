import Link from 'next/link'
import type { Service } from '@/payload-types'
import { FIXED_SERVICE_SLUGS } from '@/lib/routes'
import { resolveSofaCardHref } from '@/lib/sofaCardHref'
import { SofaImage } from './SofaImage'
import type { SofaLanding } from './SofaServiceCards'

export function RelatedServiceCards({
  services,
  bedTeaser,
}: {
  services: Service['relatedServices']
  bedTeaser?: SofaLanding['bedTeaser']
}) {
  return (
    <div className="sofa-card-grid sofa-related-grid">
      {services?.map((service) => {
        if (
          !service ||
          typeof service !== 'object' ||
          !(FIXED_SERVICE_SLUGS as readonly string[]).includes(service.slug)
        )
          return null
        return (
          <article className="sofa-visual-card" key={service.id}>
            <SofaImage resource={service.hero?.image} />
            <div className="sofa-card-copy">
              <h3>
                <Link href={`/${service.slug}/`}>{service.title}</Link>
              </h3>
              {service.summary && <p>{service.summary}</p>}
            </div>
          </article>
        )
      })}
      {bedTeaser?.title && (() => {
        const href = resolveSofaCardHref(bedTeaser.href)
        const comingSoon =
          !href &&
          (!bedTeaser.href || bedTeaser.href === '') &&
          (bedTeaser.label?.trim().toLowerCase() === 'coming soon' || !bedTeaser.label)
        return (
          <article className="sofa-visual-card">
            <SofaImage resource={bedTeaser.image} />
            <div className="sofa-card-copy">
              <h3>
                {href ? (
                  <Link href={href}>{bedTeaser.title}</Link>
                ) : (
                  bedTeaser.title
                )}
              </h3>
              {bedTeaser.description && <p>{bedTeaser.description}</p>}
              {href ? (
                <Link className="text-link" href={href}>
                  {bedTeaser.label || 'View Service'} <span aria-hidden="true">→</span>
                </Link>
              ) : comingSoon ? (
                <span className="sofa-coming-soon">{bedTeaser.label || 'Coming Soon'}</span>
              ) : bedTeaser.label ? (
                <span className="sofa-coming-soon">{bedTeaser.label}</span>
              ) : null}
            </div>
          </article>
        )
      })()}
    </div>
  )
}
