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
import { resolveSofaCardHref } from '@/lib/sofaCardHref'

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

const suppressComingSoonHref: FieldHook = ({ previousSiblingDoc, siblingData, value }) =>
  (siblingData?.comingSoon ?? previousSiblingDoc?.comingSoon) === true ? null : value

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
      name: 'visualVariant',
      type: 'select',
      defaultValue: 'image-right',
      options: [
        { label: 'Image right', value: 'image-right' },
        { label: 'Full bleed', value: 'full-bleed' },
        { label: 'Editorial split', value: 'editorial' },
        { label: 'Product focus', value: 'product' },
      ],
    },
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
    {
      name: 'trustItems',
      type: 'array',
      maxRows: 5,
      fields: [{ name: 'label', type: 'text', localized: true, required: true }],
    },
    { name: 'details', localized: true, ...richText() },
    {
      name: 'serviceOptions',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'intro', type: 'textarea', localized: true },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'description', type: 'textarea', localized: true, required: true },
            { name: 'image', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    {
      name: 'featureSections',
      type: 'array',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'copy', type: 'textarea', localized: true, required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'imagePosition',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'Right', value: 'right' },
            { label: 'Left', value: 'left' },
          ],
        },
        {
          name: 'bullets',
          type: 'array',
          fields: [{ name: 'text', type: 'text', localized: true, required: true }],
        },
      ],
    },
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
    { name: 'materialsHeading', type: 'text', localized: true },
    {
      name: 'process',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    { name: 'processHeading', type: 'text', localized: true },
    {
      name: 'comparison',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'intro', type: 'textarea', localized: true },
        { name: 'leftTitle', type: 'text', localized: true },
        {
          name: 'leftItems',
          type: 'array',
          fields: [{ name: 'text', type: 'text', localized: true, required: true }],
        },
        { name: 'rightTitle', type: 'text', localized: true },
        {
          name: 'rightItems',
          type: 'array',
          fields: [{ name: 'text', type: 'text', localized: true, required: true }],
        },
      ],
    },
    {
      name: 'faqs',
      type: 'relationship',
      hasMany: true,
      relationTo: 'faqs',
    },
    {
      name: 'serviceAreas',
      type: 'array',
      fields: [{ name: 'area', type: 'text', required: true }],
    },
    { name: 'projects', type: 'relationship', hasMany: true, relationTo: 'projects' },
    {
      name: 'testimonials',
      type: 'relationship',
      hasMany: true,
      relationTo: 'testimonials',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'galleryHeading', type: 'text', localized: true },
    { name: 'galleryIntro', type: 'textarea', localized: true },
    { name: 'serviceAreaHeading', type: 'text', localized: true },
    { name: 'serviceAreaCopy', type: 'textarea', localized: true },
    { name: 'areaLinkLabel', type: 'text', localized: true },
    {
      name: 'quotationContext',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'message', type: 'textarea', localized: true },
        { name: 'buttonLabel', type: 'text', localized: true },
      ],
    },
    { name: 'relatedHeading', type: 'text', localized: true },
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
      filterOptions: ({ id }) =>
        id === undefined || id === null ? true : { id: { not_equals: id } },
    },
    {
      name: 'sofaUpholsteryLanding',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.slug === 'sofa-upholstery',
        description: 'Conversion-focused sections used only by the Sofa Upholstery landing page.',
      },
      fields: [
        {
          name: 'popularServices',
          type: 'array',
          dbName: 'services_sofa_popular',
          minRows: 8,
          maxRows: 9,
          fields: [
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'description', type: 'textarea', localized: true, required: true },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'ctaLabel', type: 'text', localized: true },
            {
              name: 'href',
              type: 'text',
              admin: { description: 'Optional internal route. Leave empty for Coming Soon cards.' },
              hooks: {
                beforeValidate: [suppressComingSoonHref],
                afterRead: [suppressComingSoonHref],
              },
              validate: (value: unknown) =>
                value == null || value === '' ||
                resolveSofaCardHref(value) !== null
                  ? true
                  : 'Use a valid internal route.',
            },
            { name: 'comingSoon', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'fabricCards',
          type: 'array',
          dbName: 'services_sofa_fabrics',
          minRows: 5,
          maxRows: 6,
          fields: [
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'bestUse', type: 'text', localized: true, required: true },
            { name: 'comfort', type: 'text', localized: true, required: true },
            { name: 'durability', type: 'text', localized: true, required: true },
          ],
        },
        {
          name: 'foamComfort',
          type: 'group',
          fields: [
            { name: 'heading', type: 'text', localized: true },
            { name: 'copy', type: 'textarea', localized: true },
            { name: 'items', type: 'array', dbName: 'services_sofa_foam_items', maxRows: 6, fields: [{ name: 'text', type: 'text', localized: true, required: true }] },
            { name: 'ctaLabel', type: 'text', localized: true },
          ],
        },
        {
          name: 'bedTeaser',
          label: 'Bed Upholstery Teaser',
          type: 'group',
          fields: [
            { name: 'title', type: 'text', localized: true },
            { name: 'description', type: 'textarea', localized: true },
            { name: 'label', type: 'text', localized: true, defaultValue: 'Coming Soon' },
            {
              name: 'href',
              type: 'text',
              admin: { description: 'Optional internal route when the bed service is live.' },
              validate: (value: unknown) =>
                value == null || value === '' || resolveSofaCardHref(value) !== null
                  ? true
                  : 'Use a valid internal route.',
            },
            { name: 'image', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    {
      name: 'bedUpholsteryLanding',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.slug === 'bed-upholstery',
        description: 'Conversion-focused sections used only by the Bed Upholstery landing page.',
      },
      fields: [
        {
          name: 'popularServices',
          type: 'array',
          dbName: 'services_bed_popular',
          minRows: 8,
          maxRows: 9,
          fields: [
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'description', type: 'textarea', localized: true, required: true },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'ctaLabel', type: 'text', localized: true },
            {
              name: 'href',
              type: 'text',
              admin: { description: 'Optional internal route. Leave empty for Coming Soon cards.' },
              hooks: {
                beforeValidate: [suppressComingSoonHref],
                afterRead: [suppressComingSoonHref],
              },
              validate: (value: unknown) =>
                value == null || value === '' || resolveSofaCardHref(value) !== null
                  ? true
                  : 'Use a valid internal route.',
            },
            { name: 'comingSoon', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'fabricCards',
          type: 'array',
          dbName: 'services_bed_fabrics',
          minRows: 5,
          maxRows: 6,
          fields: [
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'bestUse', type: 'text', localized: true, required: true },
            { name: 'comfort', type: 'text', localized: true, required: true },
            { name: 'durability', type: 'text', localized: true, required: true },
          ],
        },
        {
          name: 'headboardStyles',
          type: 'array',
          dbName: 'services_bed_headboards',
          minRows: 6,
          maxRows: 8,
          fields: [
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'description', type: 'textarea', localized: true, required: true },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
          ],
        },
        {
          name: 'upholsteryTypes',
          type: 'array',
          dbName: 'services_bed_types',
          minRows: 6,
          maxRows: 6,
          fields: [
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'description', type: 'textarea', localized: true, required: true },
          ],
        },
        {
          name: 'paddingComfort',
          type: 'group',
          fields: [
            { name: 'heading', type: 'text', localized: true },
            { name: 'copy', type: 'textarea', localized: true },
            {
              name: 'items',
              type: 'array',
              dbName: 'services_bed_pad_items',
              maxRows: 6,
              fields: [{ name: 'text', type: 'text', localized: true, required: true }],
            },
            { name: 'ctaLabel', type: 'text', localized: true },
          ],
        },
        {
          name: 'beforeAfter',
          type: 'group',
          fields: [
            { name: 'heading', type: 'text', localized: true },
            { name: 'copy', type: 'textarea', localized: true },
            { name: 'beforeImage', type: 'upload', relationTo: 'media' },
            { name: 'afterImage', type: 'upload', relationTo: 'media' },
            { name: 'beforeCaption', type: 'text', localized: true },
            { name: 'afterCaption', type: 'text', localized: true },
          ],
        },
      ],
    },
    {
      name: 'presentationLabels',
      type: 'group',
      fields: [
        { name: 'heroQuoteLabel', type: 'text', localized: true },
        { name: 'processCtaLabel', type: 'text', localized: true },
        { name: 'quoteWhatsAppLabel', type: 'text', localized: true },
        { name: 'workshopNote', type: 'text', localized: true },
        { name: 'benefitsEyebrow', type: 'text', localized: true },
        { name: 'benefitsHeading', type: 'text', localized: true },
        { name: 'materialsEyebrow', type: 'text', localized: true },
        { name: 'processEyebrow', type: 'text', localized: true },
        { name: 'galleryEyebrow', type: 'text', localized: true },
        { name: 'areasEyebrow', type: 'text', localized: true },
        { name: 'faqEyebrow', type: 'text', localized: true },
        { name: 'faqHeading', type: 'text', localized: true },
        { name: 'faqIntroduction', type: 'textarea', localized: true },
        { name: 'relatedEyebrow', type: 'text', localized: true },
        { name: 'quoteEyebrow', type: 'text', localized: true },
      ],
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
