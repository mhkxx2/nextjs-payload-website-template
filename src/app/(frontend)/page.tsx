import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { HomeLaunch } from '@/components/HomeLaunch'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { homeCopy } from '@/data/launch-copy'
import type { Page } from '@/payload-types'
import { RenderHero } from '@/heros/RenderHero'
import { queryPublicDocBySlug } from '@/lib/publicQueries'

export const metadata: Metadata = {
  description: homeCopy.hero.subheading,
  title: 'Al Rukn Furniture',
}

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()

  // The homepage is the published `home` page. Until one exists, the owned launch
  // composition below renders so the route is never empty.
  const home = await queryPublicDocBySlug<Page>('pages', 'home')
  const hasOwnedLayout = Array.isArray(home?.layout) && home.layout.length > 0

  return (
    <>
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
