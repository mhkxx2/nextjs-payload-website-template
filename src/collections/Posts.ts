import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { adminOrPublished } from '@/access/adminOrPublished'
import { authenticated } from '@/access/authenticated'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { publicationFields } from '@/fields/publication'
import { seoFields } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import {
  populateContentAudit,
  revalidateContentAfterChange,
  revalidateContentAfterDelete,
  validatePublicationSchedule,
} from '@/hooks/revalidateContent'
import { canonicalPath } from '@/lib/routes'
import { populateAuthors } from '@/collections/Posts/hooks/populateAuthors'

const preview = (slug: unknown): string | null => {
  if (typeof slug !== 'string') return null
  const params = new URLSearchParams({
    path: canonicalPath('post', slug),
    previewSecret: process.env.PREVIEW_SECRET ?? '',
  })
  return `/next/preview?${params.toString()}`
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: adminOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'status', 'publishedAt', 'updatedAt'],
    livePreview: { url: ({ data }) => preview(data?.slug) },
    preview: (data) => preview(data?.slug),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    excerpt: true,
    heroImage: true,
    categories: true,
    services: true,
    meta: {
      description: true,
      image: true,
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'excerpt', type: 'textarea', localized: true, required: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'authors',
      type: 'relationship',
      admin: { position: 'sidebar' },
      hasMany: true,
      relationTo: 'users',
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: { position: 'sidebar' },
      hasMany: true,
      relationTo: 'categories',
    },
    {
      name: 'services',
      type: 'relationship',
      admin: { position: 'sidebar' },
      hasMany: true,
      relationTo: 'services',
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      hasMany: true,
      relationTo: 'posts',
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ],
      }),
      required: true,
    },
    ...publicationFields(),
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'seo', type: 'group', fields: seoFields() },
    { name: 'createdBy', type: 'relationship', relationTo: 'users', admin: { readOnly: true } },
    { name: 'updatedBy', type: 'relationship', relationTo: 'users', admin: { readOnly: true } },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: { update: () => false },
      admin: { disabled: true, readOnly: true },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'name', type: 'text' },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateContentAfterChange],
    afterDelete: [revalidateContentAfterDelete],
    afterRead: [populateAuthors],
    beforeChange: [validatePublicationSchedule, populateContentAudit],
  },
  timestamps: true,
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true },
    maxPerDoc: 50,
  },
}
