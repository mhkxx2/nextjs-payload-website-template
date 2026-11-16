import React from 'react'

import { QuoteRequestForm } from '@/components/home/QuoteRequestForm'

export type QuoteFormBlockProps = {
  areas?: string[]
  blockType?: 'quoteForm'
  description?: string | null
  formTitle?: string | null
  heading?: string | null
  serviceContext?: unknown | null
}

/** Shared public quotation flow. Area suggestions are populated on the homepage. */
export const QuoteFormBlockComponent: React.FC<QuoteFormBlockProps> = ({
  areas = [],
  description,
  formTitle,
  heading,
  serviceContext,
}) => (
  <section className="home-section quote-block-section">
    <div className="site-container quote-block-layout">
      {(heading || description) && (
        <div className="section-heading">
          {heading && <h2>{heading}</h2>}
          {description && <p>{description}</p>}
        </div>
      )}
      <QuoteRequestForm
        areas={areas}
        formLocation="service_quote"
        heading={formTitle}
        leadType="service_quote"
        service={typeof serviceContext === 'string' ? serviceContext : null}
      />
    </div>
  </section>
)
