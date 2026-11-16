import Link from 'next/link'
import type { Service } from '@/payload-types'
import { resolveSofaCardHref } from '@/lib/sofaCardHref'
import { SofaImage } from './SofaImage'

export type SofaLanding = NonNullable<Service['sofaUpholsteryLanding']>

export function SofaServiceCards({ cards }: { cards: SofaLanding['popularServices'] }) {
  return (
    <div className="sofa-card-grid sofa-popular-grid">
      {cards?.map((card) => {
        const href = resolveSofaCardHref(card.href) || '#request-service-quote'
        return (
          <article className="sofa-visual-card" key={card.id || card.title}>
            <SofaImage resource={card.image} />
            <div className="sofa-card-copy">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              {card.comingSoon ? (
                <span className="sofa-coming-soon">{card.ctaLabel || 'Coming Soon'}</span>
              ) : (
                <Link className="text-link" href={href}>
                  {card.ctaLabel || 'Get Free Quote'} <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
