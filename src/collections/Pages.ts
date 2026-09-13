import type { CollectionConfig } from 'payload'

import { adminOrPublished } from '@/access/adminOrPublished'
import { authenticated } from '@/access/authenticated'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { publicationFields } from '@/fields/publication'
import { seoFields } from '@/fields/seo'
import { hero } from '@/heros/config'
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
    path: canonicalPath('page', slug),
    previewSecret: process.env.PREVIEW_SECRET ?? '',
  })
  return `/next/preview?${params.toString()}`
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: adminOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    livePreview: { url: ({ data }) => preview(data?.slug) },
    preview: (data) => preview(data?.slug),
    useAsTitle: 'title',
  },
  defaultPopulate: { title: true, slug: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ validateReserved: true }),
    hero,
    {
      name: 'layout',
      type: 'blocks',
      admin: { initCollapsed: true },
      blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
      required: true,
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
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
