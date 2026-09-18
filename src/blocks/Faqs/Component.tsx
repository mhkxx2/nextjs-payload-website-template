import React from 'react'

export type FaqsBlockProps = {
  blockType?: 'faqs'
  heading?: string | null
  faqs?: unknown[] | null
  enableSchema?: boolean | null
}

export const FaqsBlockComponent: React.FC<FaqsBlockProps> = ({
  heading,
  faqs = [],
  enableSchema = true,
}) => {
  const faqItems = (faqs || []).map((item) =>
    typeof item === 'object' && item !== null
      ? (item as { question?: string; answer?: string })
      : { question: '', answer: '' }
  )

  const jsonLd =
    enableSchema && faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((faq) => ({
            '@type': 'Question',
            name: faq.question || '',
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer || '',
            },
          })),
        }
      : null

  return (
    <section className="py-12 md:py-16 bg-cream text-charcoal">
      <div className="container mx-auto px-4 max-w-4xl">
        {heading && <h2 className="text-2xl md:text-4xl font-serif font-bold text-center mb-10 text-amber-950">{heading}</h2>}
        <div className="space-y-4">
          {faqItems.map((faq, idx) => (
            <details key={idx} className="p-4 bg-white rounded-lg border border-neutral-200 shadow-sm group">
              <summary className="font-serif font-bold text-lg text-charcoal cursor-pointer flex justify-between items-center list-none">
                <span>{faq.question || ''}</span>
                <span className="text-amber-800 transition-transform group-open:rotate-180">↓</span>
              </summary>
              <div className="mt-3 text-neutral-600 border-t pt-3 text-sm md:text-base">{faq.answer || ''}</div>
            </details>
          ))}
        </div>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </div>
    </section>
  )
}
