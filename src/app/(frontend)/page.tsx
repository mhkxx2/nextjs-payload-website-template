import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { HomeLaunch } from '@/components/HomeLaunch'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { homeCopy } from '@/data/launch-copy'
import type { Page } from '@/payload-types'
import { RenderHero } from '@/heros/RenderHero'
import { queryPublicDocBySlug } from '@/lib/publicQueries'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'

/** The published `home` page, shared by the page body and its metadata. */
const queryHomePage = cache(
  async (): Promise<null | Page> => queryPublicDocBySlug<Page>('pages', 'home'),
)

export async function generateMetadata(): Promise<Metadata> {
  const [defaults, homeDoc] = await Promise.all([getSeoDefaults(), queryHomePage()])

  return buildMetadata(homeDoc, {
    ...defaults,
    descriptionFallback: homeCopy.hero.subheading,
    path: '/',
  })
}

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()

  // The homepage is the published `home` page. Until one exists, the owned launch
  // composition below renders so the route is never empty.
  const home = await queryHomePage()
  const hasOwnedLayout = Array.isArray(home?.layout) && home.layout.length > 0
  const schemas = buildSchemas({
    globals: await getSchemaGlobals(),
    includeLocalBusiness: true,
    kind: 'home',
    path: '/',
    record: home,
  })

  return (
    <>
      <JsonLd schemas={schemas} />
      {draft && <LivePreviewListener />}
      {home && hasOwnedLayout ? (
        <article className="pt-16 pb-24">
          <RenderHero {...home.hero} />
          <RenderBlocks blocks={home.layout} />
        </article>
      ) : (
        <HomeLaunch />
      )}
    </>
  )
}
