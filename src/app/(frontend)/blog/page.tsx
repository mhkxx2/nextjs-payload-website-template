import type { Metadata } from 'next'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import type { Post } from '@/payload-types'
import { archiveCopy, POSTS_PER_PAGE } from '@/data/launch-copy'
import { queryPublicList } from '@/lib/publicQueries'

export const metadata: Metadata = {
  description: archiveCopy.blog.intro,
  title: `${archiveCopy.blog.heading} | Al Rukn Furniture`,
}

export default async function BlogIndex() {
  const { docs, page, totalDocs, totalPages } = await queryPublicList<Post>({
    collection: 'posts',
    depth: 1,
    limit: POSTS_PER_PAGE,
    page: 1,
    sort: '-publishedAt',
  })

  return (
    <div className="pt-16 pb-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Blog' }]} />
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
