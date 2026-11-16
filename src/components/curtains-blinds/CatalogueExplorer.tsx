'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'

import { ProductCard } from '@/components/curtains-blinds/ProductCard'
import type { CatalogueCategoryCard, CatalogueProductCard } from '@/lib/curtainsBlinds'

type Props = {
  categories: CatalogueCategoryCard[]
  initialCategory?: string | null
  initialType?: 'all' | 'blind' | 'curtain'
  pageSize?: number
  products: CatalogueProductCard[]
}

export function CatalogueExplorer({
  categories,
  initialCategory = null,
  initialType = 'all',
  pageSize = 24,
  products,
}: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(pageSize)

  const type = (searchParams.get('type') as 'all' | 'blind' | 'curtain' | null) || initialType || 'all'
  const category = searchParams.get('category') || initialCategory || 'all'

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        if (type !== 'all' && product.productType !== type) return false
        if (category !== 'all' && !product.categories.some((entry) => entry.slug === category)) return false
        return true
      }),
    [category, products, type],
  )

  const visible = filtered.slice(0, visibleCount)
  const typeCategories = categories.filter((entry) => (type === 'all' ? true : entry.type === type))
  const activeCategoryName =
    category === 'all' ? null : categories.find((entry) => entry.slug === category)?.name || category

  const updateQuery = (next: { category?: string; type?: string }) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next.type != null) {
      if (next.type === 'all') params.delete('type')
      else params.set('type', next.type)
    }
    if (next.category != null) {
      if (next.category === 'all') params.delete('category')
      else params.set('category', next.category)
    }
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    setVisibleCount(pageSize)
    setDrawerOpen(false)
  }

  const Filters = (
    <div className="cb-filters">
      <div className="cb-filter-group">
        <p className="cb-filter-label">Type</p>
        <div className="cb-filter-chips">
          {(
            [
              ['all', 'All'],
              ['curtain', 'Curtains'],
              ['blind', 'Blinds'],
            ] as const
          ).map(([value, label]) => (
            <button
              aria-pressed={type === value}
              className={type === value ? 'is-active' : undefined}
              key={value}
              onClick={() => updateQuery({ category: 'all', type: value })}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="cb-filter-group">
        <p className="cb-filter-label">Category</p>
        <div className="cb-filter-list">
          <button
            aria-pressed={category === 'all'}
            className={category === 'all' ? 'is-active' : undefined}
            onClick={() => updateQuery({ category: 'all' })}
            type="button"
          >
            All categories
          </button>
          {typeCategories.map((entry) => (
            <button
              aria-pressed={category === entry.slug}
              className={category === entry.slug ? 'is-active' : undefined}
              key={entry.id}
              onClick={() => updateQuery({ category: entry.slug, type: entry.type })}
              type="button"
            >
              {entry.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <section className="cb-catalogue section-shell" id="catalogue">
      <div className="cb-catalogue-heading">
        <p className="eyebrow">Catalogue</p>
        <h2>Shop curtains & blinds</h2>
        <p>Browse design options, then request a quotation for made-to-measure sizing and installation.</p>
      </div>

      <div className="cb-catalogue-toolbar">
        <div className="cb-active-filters">
          <p>
            Showing <strong>{Math.min(visible.length, filtered.length)}</strong> of{' '}
            <strong>{filtered.length}</strong> designs
          </p>
          {type !== 'all' || category !== 'all' ? (
            <div className="cb-active-chips">
              {type !== 'all' ? <span>{type === 'curtain' ? 'Curtains' : 'Blinds'}</span> : null}
              {activeCategoryName ? <span>{activeCategoryName}</span> : null}
              <button
                className="cb-clear-filters"
                onClick={() => updateQuery({ category: 'all', type: 'all' })}
                type="button"
              >
                Clear filters
              </button>
            </div>
          ) : null}
        </div>
        <button className="button button-secondary cb-filter-toggle" onClick={() => setDrawerOpen(true)} type="button">
          Filters
        </button>
      </div>

      <div className="cb-catalogue-layout">
        <aside className="cb-catalogue-aside">{Filters}</aside>
        <div className="cb-catalogue-main">
          {visible.length === 0 ? (
            <div className="cb-empty">
              <p>No designs match this filter yet.</p>
              <button
                className="button button-secondary"
                onClick={() => updateQuery({ category: 'all', type: 'all' })}
                type="button"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="cb-product-grid">
              {visible.map((product, index) => (
                <ProductCard key={product.id} priority={index < 4} product={product} />
              ))}
            </div>
          )}
          {visibleCount < filtered.length ? (
            <div className="cb-load-more">
              <button
                className="button button-secondary"
                onClick={() => setVisibleCount((count) => count + pageSize)}
                type="button"
              >
                Load more designs
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {drawerOpen ? (
        <div aria-label="Catalogue filters" aria-modal="true" className="cb-filter-drawer" role="dialog">
          <div className="cb-filter-drawer-panel">
            <div className="cb-filter-drawer-head">
              <h3>Filters</h3>
              <button className="button button-secondary button-small" onClick={() => setDrawerOpen(false)} type="button">
                Close
              </button>
            </div>
            {Filters}
          </div>
          <button
            aria-label="Close filters"
            className="cb-filter-drawer-backdrop"
            onClick={() => setDrawerOpen(false)}
            type="button"
          />
        </div>
      ) : null}

      <p className="cb-catalogue-note">
        Images are catalogue / fabric design references for quotation. Dimensions, headings and installation are made to
        measure. Prefer WhatsApp? <Link href="#quick-quote">Use the quick quote form</Link>.
      </p>
    </section>
  )
}
