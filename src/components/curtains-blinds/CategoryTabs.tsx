'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'

import { pushDataLayerEvent } from '@/lib/analytics'
import type { CatalogueCategoryCard } from '@/lib/curtainsBlinds'

type Props = {
  blinds: CatalogueCategoryCard[]
  curtains: CatalogueCategoryCard[]
}

const PREVIEW = 8

export function CategoryTabs({ blinds, curtains }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'blinds' | 'curtains'>('curtains')
  const [showAll, setShowAll] = useState(false)
  const items = tab === 'curtains' ? curtains : blinds
  const visible = useMemo(() => (showAll ? items : items.slice(0, PREVIEW)), [items, showAll])

  return (
    <section className="cb-categories section-shell" id="shop-by-category">
      <div className="cb-section-heading">
        <p className="eyebrow">Browse by style</p>
        <h2>Find the Perfect Curtains & Blinds</h2>
        <p>Explore designs for every window, room and interior style.</p>
      </div>
      <div aria-label="Curtains or blinds" className="cb-category-tabs" role="tablist">
        <button
          aria-selected={tab === 'curtains'}
          className={tab === 'curtains' ? 'is-active' : undefined}
          onClick={() => {
            setTab('curtains')
            setShowAll(false)
          }}
          role="tab"
          type="button"
        >
          Curtains
        </button>
        <button
          aria-selected={tab === 'blinds'}
          className={tab === 'blinds' ? 'is-active' : undefined}
          onClick={() => {
            setTab('blinds')
            setShowAll(false)
          }}
          role="tab"
          type="button"
        >
          Blinds
        </button>
      </div>
      <div className="cb-category-grid" role="tabpanel">
        {visible.map((category) => (
          <button
            className="cb-category-card"
            key={category.id}
            onClick={() => {
              pushDataLayerEvent({
                category: category.slug,
                cta_location: 'curtains_category_card',
                event: 'select_item',
                service: 'curtains-blinds',
              })
              const params = new URLSearchParams({ category: category.slug, type: category.type })
              router.push(`/curtains-blinds/?${params.toString()}#catalogue`, { scroll: true })
            }}
            type="button"
          >
            <span className="cb-category-media">
              {category.image ? (
                <Image
                  alt={category.image.alt || `${category.name} category`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1100px) 25vw, 20vw"
                  src={category.image.url}
                />
              ) : (
                <span className="cb-category-fallback" />
              )}
            </span>
            <span className="cb-category-copy">
              <strong>{category.name}</strong>
              {category.description ? <span>{category.description}</span> : null}
            </span>
          </button>
        ))}
      </div>
      {items.length > PREVIEW ? (
        <div className="cb-category-more">
          <button
            className="button button-secondary"
            onClick={() => setShowAll((value) => !value)}
            type="button"
          >
            {showAll ? 'Show Popular Categories' : 'View All Categories'}
          </button>
        </div>
      ) : null}
    </section>
  )
}
