import React from 'react'
import Link from 'next/link'

export type CallToActionBlockProps = {
  blockType?: 'callToAction'
  heading: string
  description?: string | null
  buttonText: string
  buttonLink: string
  variant?: 'primary' | 'secondary' | 'accent' | null
}

export const CallToActionBlockComponent: React.FC<CallToActionBlockProps> = ({
  heading,
  description,
  buttonText,
  buttonLink,
  variant = 'primary',
}) => {
  const bgClass =
    variant === 'accent'
      ? 'bg-amber-900 text-white'
      : variant === 'secondary'
      ? 'bg-neutral-800 text-white'
      : 'bg-amber-700 text-white'

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className={`p-8 md:p-12 rounded-xl shadow-md text-center max-w-4xl mx-auto ${bgClass}`}>
          <h2 className="text-2xl md:text-4xl font-serif font-bold mb-4">{heading}</h2>
          {description && <p className="text-neutral-100 max-w-2xl mx-auto mb-8 text-base md:text-lg">{description}</p>}
          <div>
            <Link
              href={buttonLink}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-charcoal font-bold hover:bg-neutral-100 transition-colors shadow"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
