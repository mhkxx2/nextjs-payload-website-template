'use client'

import { useEffect } from 'react'

import { pushDataLayerEvent } from '@/lib/analytics'

export function ProductViewTracker({ category, name }: { category?: string; name: string }) {
  useEffect(() => {
    pushDataLayerEvent({
      category: category || null,
      cta_location: 'curtains_product_detail',
      event: 'view_item',
      page_title: name,
      service: 'curtains-blinds',
    })
  }, [category, name])

  return null
}
