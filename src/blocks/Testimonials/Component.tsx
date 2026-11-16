import React from 'react'

export type TestimonialsBlockProps = {
  blockType?: 'testimonials'
  heading?: string | null
  testimonials?: unknown[] | null
  displayMode?: 'grid' | 'carousel' | null
}

export const TestimonialsBlockComponent: React.FC<TestimonialsBlockProps> = ({
  heading,
  testimonials = [],
}) => {
  const items = (testimonials || []).map((item) =>
    typeof item === 'object' && item !== null
      ? (item as { quote?: string; content?: string; author?: string; clientName?: string; role?: string; location?: string })
      : {}
  )

  return (
    <section className="py-12 md:py-16 bg-amber-900/10">
      <div className="container mx-auto px-4">
        {heading && <h2 className="text-2xl md:text-4xl font-serif font-bold text-center text-charcoal mb-10">{heading}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="p-6 bg-white rounded-lg shadow-sm border border-amber-900/20 flex flex-col justify-between">
              <p className="text-neutral-700 italic mb-4">“{item.quote || item.content || ''}”</p>
              <div>
                <div className="font-serif font-bold text-amber-900">{item.author || item.clientName || ''}</div>
                {(item.role || item.location) && <div className="text-xs text-neutral-500">{item.role || item.location || ''}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
