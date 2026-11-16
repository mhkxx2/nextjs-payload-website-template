import clsx from 'clsx'
import React from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

export interface LogoProps {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  logo?: MediaType | Record<string, unknown> | number | string | null
  brandName?: string | null
}

export const Logo: React.FC<LogoProps> = (props) => {
  const {
    className,
    loading: loadingFromProps,
    priority: priorityFromProps,
    logo,
    brandName = 'Al Rukn Furniture',
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  const mediaResource =
    typeof logo === 'object' &&
    logo !== null &&
    'url' in logo &&
    typeof (logo as { url?: unknown }).url === 'string' &&
    Boolean((logo as { url: string }).url.trim())
      ? (logo as MediaType)
      : null

  if (mediaResource) {
    const isSvg =
      mediaResource.mimeType?.includes('svg') ||
      mediaResource.url?.endsWith('.svg')

    return (
      <Media
        htmlElement={null}
        imgClassName={clsx('max-w-[13rem] w-full h-auto object-contain', className)}
        loading={loading}
        priority={priority === 'high'}
        resource={{
          ...mediaResource,
          alt: mediaResource.alt || brandName || 'Al Rukn Furniture',
          width: mediaResource.width || 260,
          height: mediaResource.height || 48,
        }}
        unoptimized={isSvg}
      />
    )
  }

  // Safe brand text fallback when no CMS logo is configured
  return (
    <span className={clsx('brand-text-logo font-serif font-bold text-xl tracking-tight text-charcoal', className)}>
      {brandName || 'Al Rukn Furniture'}
    </span>
  )
}
