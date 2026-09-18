import React from 'react'

export type LocationArea = {
  name: string
  details?: string | null
}

export type LocationCoverageBlockProps = {
  blockType?: 'locationCoverage'
  heading: string
  subheading?: string | null
  areas?: LocationArea[] | null
}

export const LocationCoverageBlockComponent: React.FC<LocationCoverageBlockProps> = ({
  heading,
  subheading,
  areas = [],
}) => {
  return (
    <section className="py-12 md:py-16 bg-amber-950 text-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-4xl font-serif font-bold mb-3 text-amber-100">{heading}</h2>
          {subheading && <p className="text-amber-200/80">{subheading}</p>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(areas || []).map((area, idx) => (
            <div key={idx} className="p-4 bg-amber-900/50 rounded border border-amber-800 text-center">
              <div className="font-serif font-bold text-amber-100">{area.name}</div>
              {area.details && <div className="text-xs text-amber-300/70 mt-1">{area.details}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
