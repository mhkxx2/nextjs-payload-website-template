import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Page } from '@/payload-types'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { queryPublicDocBySlug, queryPublicSlugs } from '@/lib/publicQueries'
import { canonicalPath } from '@/lib/routes'
import { isSafeSlug, normalizeSlug } from '@/lib/slug'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'
import { validatePageSlug } from '@/lib/slug'
import PageClient from './page.client'

/** Every URL segment that has its own route and must never be served as a general page. */
const isResolvableGeneralSlug = (slug: string): boolean =>
  slug !== 'home' && validatePageSlug(slug) === true

export async function generateStaticParams() {
  const slugs = await queryPublicSlugs('pages')

  return slugs.filter(isResolvableGeneralSlug).map((slug) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  // A segment that cannot be a slug (for example /robots.txt or /file.name) still
  // gets a redirect lookup, but it must never throw on the way there.
  const url = isSafeSlug(normalizeSlug(decodedSlug))
    ? canonicalPath('page', decodedSlug)
    : `/${decodedSlug}/`

  // Reserved segments (fixed services, /blog, /projects, /about-us, ...) are owned by
  // their own routes. A CMS page must never shadow them, and /home must not become a
  // second copy of the homepage.
  if (!isResolvableGeneralSlug(decodedSlug)) return <PayloadRedirects url={url} />

  const page = await queryPageBySlug({ slug: decodedSlug })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page
  const breadcrumbs = buildBreadcrumbs(url, page)
  const schemas = buildSchemas({
    breadcrumbs,
    globals: await getSchemaGlobals(),
    kind: 'page',
    path: url,
    record: page,
  })

  return (
    <article className="pt-16 pb-24">
      <JsonLd schemas={schemas} />
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {breadcrumbs.length > 0 && (
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)

  if (!isResolvableGeneralSlug(decodedSlug)) return {}

  const [page, defaults] = await Promise.all([
    queryPageBySlug({ slug: decodedSlug }),
    getSeoDefaults(),
  ])

  if (!page) return {}

  return buildMetadata(page, { ...defaults, path: canonicalPath('page', decodedSlug) })
}

/** Published-only, draft-mode aware lookup shared by the page and its metadata. */
const queryPageBySlug = cache(
  async ({ slug }: { slug: string }): Promise<null | Page> =>
    queryPublicDocBySlug<Page>('pages', slug),
)
