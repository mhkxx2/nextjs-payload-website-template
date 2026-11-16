import React from 'react'

export interface SkipLinkProps {
  targetId?: string
  label?: string
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Skip to main content',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-charcoal focus:text-ivory focus:ring-2 focus:ring-gold-muted focus:rounded-md focus:shadow-lg focus:outline-none"
    >
      {label}
    </a>
  )
}
