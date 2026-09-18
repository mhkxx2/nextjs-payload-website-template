import React from 'react'

export type StatItem = {
  label: string
  value: string
  description?: string | null
}

export type StatisticsBlockProps = {
  blockType?: 'statistics'
  heading?: string | null
  substantiationNote: string
  stats: StatItem[]
}

export const StatisticsBlockComponent: React.FC<StatisticsBlockProps> = ({
  heading,
  substantiationNote,
  stats = [],
}) => {
  return (
    <section className="py-12 md:py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        {heading && <h2 className="text-2xl md:text-4xl font-serif font-bold text-center text-charcoal mb-10">{heading}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 bg-white rounded-lg shadow-sm border border-neutral-200">
              <div className="text-3xl md:text-5xl font-serif font-bold text-amber-800 mb-2">{stat.value}</div>
              <div className="font-bold text-charcoal mb-1">{stat.label}</div>
              {stat.description && <div className="text-xs text-neutral-500">{stat.description}</div>}
            </div>
          ))}
        </div>
        {substantiationNote && (
          <div className="mt-8 text-center text-xs text-neutral-500 max-w-xl mx-auto italic">
            Note: {substantiationNote}
          </div>
        )}
      </div>
    </section>
  )
}
