import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React from 'react'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { PostHero } from '@/heros/PostHero'
import type { Post } from '@/payload-types'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { canonicalPath } from '@/lib/routes'
import { queryPublicDocBySlug, queryPublicSlugs } from '@/lib/publicQueries'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'
import { formatDateTime } from '@/utilities/formatDateTime'
import PageClient from './page.client'

export async function generateStaticParams() {
  const slugs = await queryPublicSlugs('posts')

  return slugs.map((slug) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function BlogPost({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = canonicalPath('post', decodedSlug)
  const post = await queryPublicDocBySlug<Post>('posts', decodedSlug)

  if (!post) return <PayloadRedirects url={url} />

  const breadcrumbs = buildBreadcrumbs(url, post)
  const schemas = buildSchemas({
    breadcrumbs,
    globals: await getSchemaGlobals(),
    kind: 'post',
    path: url,
    record: post,
  })

  return (
    <article className="pt-16 pb-16">
      <JsonLd schemas={schemas} />
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <Breadcrumbs items={breadcrumbs} />

          {post.publishedAt && (
            <p className="text-xs text-neutral-500 mb-4">
              Published <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
            </p>
          )}

          <RichText className="max-w-[48rem]" data={post.content} enableGutter={false} />

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((related) => typeof related === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const [post, defaults] = await Promise.all([
    queryPublicDocBySlug<Post>('posts', decodedSlug),
    getSeoDefaults(),
  ])

  if (!post) return {}

  return buildMetadata(post, {
    ...defaults,
    path: canonicalPath('post', decodedSlug),
    type: 'article',
  })
}
