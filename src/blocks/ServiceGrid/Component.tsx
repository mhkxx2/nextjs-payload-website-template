import React from 'react'
import Link from 'next/link'

export type ServiceGridBlockProps = {
  blockType?: 'serviceGrid'
  heading?: string | null
  subheading?: string | null
  services?: unknown[] | null
  limit?: number | null
  columns?: '2' | '3' | '4' | null
}

export const ServiceGridBlockComponent: React.FC<ServiceGridBlockProps> = ({
  heading,
  subheading,
  services = [],
  columns = '3',
}) => {
  const serviceItems = (services || []).map((item) =>
    typeof item === 'object' && item !== null
      ? (item as { title?: string; summary?: string; slug?: string })
      : {}
  )

  const gridCols =
    columns === '2'
      ? 'grid-cols-1 md:grid-cols-2'
      : columns === '4'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section className="py-12 md:py-16 bg-cream">
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center max-w-2xl mx-auto mb-10">
            {heading && <h2 className="text-2xl md:text-4xl font-serif font-bold text-charcoal mb-3">{heading}</h2>}
            {subheading && <p className="text-neutral-600">{subheading}</p>}
          </div>
        )}
        <div className={`grid ${gridCols} gap-6`}>
          {serviceItems.map((service, idx) => (
            <div key={idx} className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-serif font-bold text-xl text-amber-900 mb-2">{service.title || ''}</h3>
              {service.summary && <p className="text-neutral-600 text-sm mb-4">{service.summary}</p>}
              {service.slug && (
                <Link href={`/services/${service.slug}`} className="text-amber-800 hover:text-amber-900 font-bold text-sm inline-flex items-center gap-1">
                  Learn More →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
