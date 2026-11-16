import type { Metadata } from 'next'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { JsonLd } from '@/components/JsonLd'
import type { Post } from '@/payload-types'
import { cmsFallbacks, POSTS_PER_PAGE } from '@/data/cmsFallbacks'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { queryPublicList } from '@/lib/publicQueries'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function generateMetadata(): Promise<Metadata> {
  const [defaults, archives] = await Promise.all([
    getSeoDefaults(),
    getCachedGlobal('archive-settings', 1)(),
  ])
  const archive = archives.blogArchive

  return buildMetadata({ seo: archive?.seo }, {
    ...defaults,
    descriptionFallback: archive?.introduction || cmsFallbacks.archives.blog.intro,
    path: '/blog/',
    titleFallback: archive?.heading || cmsFallbacks.archives.blog.heading,
  })
}

export default async function BlogIndex() {
  const [{ docs, page, totalDocs, totalPages }, globals, archives] = await Promise.all([
    queryPublicList<Post>({
      collection: 'posts',
      depth: 1,
      limit: POSTS_PER_PAGE,
      page: 1,
      sort: '-publishedAt',
    }),
    getSchemaGlobals(),
    getCachedGlobal('archive-settings', 1)(),
  ])
  const archive = archives.blogArchive
  const breadcrumbs = buildBreadcrumbs('/blog/')
  const schemas = buildSchemas({ breadcrumbs, globals, kind: 'archive', path: '/blog/' })

  return (
    <div className="pt-16 pb-16">
      <JsonLd schemas={schemas} />
      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbs} />
        <header className="max-w-3xl py-6">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal mb-4">
            {archive?.heading || cmsFallbacks.archives.blog.heading}
          </h1>
          <p className="text-neutral-600">{archive?.introduction || cmsFallbacks.archives.blog.intro}</p>
        </header>
        <PageRange
          collection="posts"
          currentPage={page}
          limit={POSTS_PER_PAGE}
          totalDocs={totalDocs}
        />
      </div>

      {docs.length > 0 ? (
        <CollectionArchive posts={docs} />
      ) : (
        <div className="container mx-auto px-4 py-10">
          <p className="text-neutral-600">{archive?.emptyState || cmsFallbacks.archives.blog.emptyMessage}</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="container mx-auto px-4" page={page} totalPages={totalPages} />
      )}
    </div>
  )
}
