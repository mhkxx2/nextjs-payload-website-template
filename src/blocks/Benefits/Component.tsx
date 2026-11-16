import React from 'react'

export type BenefitItem = {
  title: string
  description?: string | null
  icon?: string | null
}

export type BenefitsBlockProps = {
  blockType?: 'benefits'
  heading: string
  items: BenefitItem[]
}

export const BenefitsBlockComponent: React.FC<BenefitsBlockProps> = ({
  heading,
  items = [],
}) => {
  return (
    <section className="py-12 md:py-16 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-center mb-10 text-amber-100">{heading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="p-6 rounded-lg bg-neutral-800 border border-neutral-700">
              <div className="text-amber-400 font-serif font-bold text-xl mb-2">{item.title}</div>
              {item.description && <p className="text-neutral-300 text-sm leading-relaxed">{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
