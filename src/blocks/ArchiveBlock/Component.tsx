import type { Post } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import { CollectionArchive } from '@/components/CollectionArchive'

export type ArchiveBlockProps = {
  id?: string
  categories?: (string | { id: string })[] | null
  introContent?: Record<string, unknown> | null
  limit?: number | null
  populateBy?: string | null
  selectedDocs?: { value: string | Post }[] | null
}

export const ArchiveBlock: React.FC<ArchiveBlockProps> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category: string | { id: string }) => {
      if (typeof category === 'object' && category !== null) return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs
        .map((post: { value: string | Post }) => {
          if (typeof post.value === 'object') return post.value
          return null
        })
        .filter(Boolean) as Post[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-8 font-sans">
          <RichText content={introContent as never} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  )
}
