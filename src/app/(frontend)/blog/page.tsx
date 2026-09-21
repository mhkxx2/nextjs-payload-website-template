import type { Metadata } from 'next'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { JsonLd } from '@/components/JsonLd'
import type { Post } from '@/payload-types'
import { archiveCopy, POSTS_PER_PAGE } from '@/data/launch-copy'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { queryPublicList } from '@/lib/publicQueries'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const defaults = await getSeoDefaults()

  return buildMetadata(null, {
    ...defaults,
    descriptionFallback: archiveCopy.blog.intro,
    path: '/blog/',
    titleFallback: archiveCopy.blog.heading,
  })
}

export default async function BlogIndex() {
  const [{ docs, page, totalDocs, totalPages }, globals] = await Promise.all([
    queryPublicList<Post>({
      collection: 'posts',
      depth: 1,
      limit: POSTS_PER_PAGE,
      page: 1,
      sort: '-publishedAt',
    }),
    getSchemaGlobals(),
  ])
  const breadcrumbs = buildBreadcrumbs('/blog/')
  const schemas = buildSchemas({ breadcrumbs, globals, kind: 'archive', path: '/blog/' })

  return (
    <div className="pt-16 pb-16">
      <JsonLd schemas={schemas} />
      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbs} />
        <header className="max-w-3xl py-6">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal mb-4">
            {archiveCopy.blog.heading}
          </h1>
          <p className="text-neutral-600">{archiveCopy.blog.intro}</p>
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
          <p className="text-neutral-600">{archiveCopy.blog.emptyMessage}</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="container mx-auto px-4" page={page} totalPages={totalPages} />
      )}
    </div>
  )
}
