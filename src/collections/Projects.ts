import type { CollectionConfig } from 'payload'

import { adminOrPublished } from '@/access/adminOrPublished'
import { authenticated } from '@/access/authenticated'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
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

const preview = (slug: unknown): string | null => {
  if (typeof slug !== 'string') return null
  const params = new URLSearchParams({
    path: canonicalPath('project', slug),
    previewSecret: process.env.PREVIEW_SECRET ?? '',
  })
  return `/next/preview?${params.toString()}`
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: adminOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'service', 'featured', 'status', 'updatedAt'],
    livePreview: { url: ({ data }) => preview(data?.slug) },
    preview: (data) => preview(data?.slug),
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    { name: 'location', type: 'text' },
    {
      name: 'completion',
      type: 'group',
      fields: [
        { name: 'date', type: 'date' },
        { name: 'details', type: 'text', localized: true },
      ],
    },
    {
      name: 'narrative',
      type: 'blocks',
      blocks: [Content, MediaBlock, CallToAction],
      admin: { initCollapsed: true },
    },
    { name: 'challenge', type: 'textarea', localized: true },
    { name: 'solution', type: 'textarea', localized: true },
    { name: 'featured', type: 'checkbox', defaultValue: false, index: true },
    ...publicationFields(),
    { name: 'seo', type: 'group', fields: seoFields() },
    { name: 'createdBy', type: 'relationship', relationTo: 'users', admin: { readOnly: true } },
    { name: 'updatedBy', type: 'relationship', relationTo: 'users', admin: { readOnly: true } },
  ],
  hooks: {
    afterChange: [revalidateContentAfterChange],
    afterDelete: [revalidateContentAfterDelete],
    beforeChange: [validatePublicationSchedule, populateContentAudit],
  },
  timestamps: true,
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true },
    maxPerDoc: 50,
  },
}
