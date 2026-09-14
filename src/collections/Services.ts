import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig, FieldHook, TextField } from 'payload'

import { adminOrPublished } from '@/access/adminOrPublished'
import { authenticated } from '@/access/authenticated'
import { contentAuditFields } from '@/fields/contentAudit'
import { seoFields } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { publicationFields } from '@/fields/publication'
import {
  populateContentAudit,
  revalidateContentAfterChange,
  revalidateContentAfterDelete,
  validatePublicationSchedule,
} from '@/hooks/revalidateContent'
import { FIXED_SERVICE_SLUGS, canonicalPath } from '@/lib/routes'
import { normalizeSlug } from '@/lib/slug'

const fixedSlug = slugField()
const fixedSlugInput = fixedSlug.fields.find(
  (field): field is TextField => 'name' in field && field.name === 'slug' && field.type === 'text',
)
if (!fixedSlugInput) throw new Error('Unable to configure the service slug field.')
const validateFixedSlug: FieldHook = ({ value }) => {
  if (typeof value !== 'string') return value
  const normalized = normalizeSlug(value)
  if (!(FIXED_SERVICE_SLUGS as readonly string[]).includes(normalized)) {
    throw new Error(`“${normalized}” is not a fixed service slug.`)
  }
  return normalized
}
fixedSlugInput.hooks = {
  ...fixedSlugInput.hooks,
  beforeValidate: [validateFixedSlug, ...(fixedSlugInput.hooks?.beforeValidate ?? [])],
}

const richText = () => ({
  type: 'richText' as const,
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
})

const preview = (slug: unknown): string | null => {
  if (typeof slug !== 'string') return null
  const params = new URLSearchParams({
    path: canonicalPath('service', slug),
    previewSecret: process.env.PREVIEW_SECRET ?? '',
  })
  return `/next/preview?${params.toString()}`
}

export const Services: CollectionConfig = {
  slug: 'services',
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
  fields: [
    { name: 'title', type: 'text', required: true },
    fixedSlug,
    { name: 'summary', type: 'textarea', localized: true },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'copy', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'details', localized: true, ...richText() },
    {
      name: 'benefits',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'materialsCapabilities',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'process',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'faqs',
      type: 'json',
      admin: { description: 'Related FAQ record IDs. Resolved when the FAQ collection is available.' },
    },
    {
      name: 'serviceAreas',
      type: 'array',
      fields: [{ name: 'area', type: 'text', required: true }],
    },
    { name: 'projects', type: 'relationship', hasMany: true, relationTo: 'projects' },
    {
      name: 'testimonials',
      type: 'json',
      admin: {
        description: 'Related testimonial record IDs. Resolved when the testimonial collection is available.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'quotationContext',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'message', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'whatsAppContext',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'message', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      hasMany: true,
      relationTo: 'services',
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
    },
    ...publicationFields(),
    { name: 'seo', type: 'group', fields: seoFields() },
    ...contentAuditFields(),
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
