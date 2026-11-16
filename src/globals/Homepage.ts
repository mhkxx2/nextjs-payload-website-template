import type { Block, Field, GlobalConfig } from 'payload'

import { HOME_SECTIONS } from '@/data/homepage'
import { authenticatedWrite, publicRead, revalidateGlobal } from './shared'

const enabled: Field = { name: 'enabled', type: 'checkbox', defaultValue: true }
const heading: Field = { name: 'heading', type: 'text', localized: true, required: true }
const intro: Field = { name: 'intro', type: 'textarea', localized: true, maxLength: 420 }
const media: Field = { name: 'image', type: 'upload', relationTo: 'media' }

const featureBlock = (slug: 'customFurniture' | 'upholstery' | 'majlis'): Block => ({
  slug,
  fields: [
    enabled,
    { name: 'eyebrow', type: 'text', localized: true },
    heading,
    { name: 'body', type: 'textarea', localized: true, required: true, maxLength: 850 },
    media,
    { name: 'imagePosition', type: 'select', defaultValue: 'right', options: ['left', 'right'] },
    { name: 'ctaLabel', type: 'text', localized: true },
  ],
})

const blocks: Record<(typeof HOME_SECTIONS)[number], Block> = {
  services: {
    slug: 'services',
    fields: [
      enabled,
      heading,
      intro,
      { name: 'services', type: 'relationship', hasMany: true, relationTo: 'services', maxRows: 9 },
    ],
  },
  customFurniture: featureBlock('customFurniture'),
  upholstery: featureBlock('upholstery'),
  majlis: featureBlock('majlis'),
  projects: {
    slug: 'projects',
    fields: [
      enabled,
      heading,
      intro,
      { name: 'projects', type: 'relationship', hasMany: true, relationTo: 'projects', maxRows: 9 },
    ],
  },
  process: {
    slug: 'process',
    fields: [
      enabled,
      heading,
      {
        name: 'steps',
        type: 'array',
        minRows: 4,
        maxRows: 4,
        fields: [
          { name: 'title', type: 'text', localized: true, required: true },
          { name: 'description', type: 'textarea', localized: true, required: true },
        ],
      },
    ],
  },
  whyChoose: {
    slug: 'whyChoose',
    fields: [
      enabled,
      heading,
      intro,
      {
        name: 'items',
        type: 'array',
        maxRows: 8,
        fields: [
          { name: 'title', type: 'text', localized: true, required: true },
          { name: 'description', type: 'textarea', localized: true },
        ],
      },
    ],
  },
  areas: {
    slug: 'areas',
    fields: [
      enabled,
      heading,
      intro,
      { name: 'areas', type: 'relationship', hasMany: true, relationTo: 'areas' },
    ],
  },
  localContent: {
    slug: 'localContent',
    fields: [
      enabled,
      heading,
      { name: 'paragraphs', type: 'array', minRows: 2, maxRows: 3, fields: [
        { name: 'text', type: 'textarea', localized: true, required: true, maxLength: 650 },
      ] },
    ],
  },
  testimonials: {
    slug: 'testimonials',
    fields: [
      enabled,
      heading,
      { name: 'testimonials', type: 'relationship', hasMany: true, relationTo: 'testimonials', maxRows: 6 },
    ],
  },
  faqs: {
    slug: 'faqs',
    fields: [
      enabled,
      heading,
      { name: 'faqs', type: 'relationship', hasMany: true, relationTo: 'faqs', maxRows: 10 },
      { name: 'enableSchema', type: 'checkbox', defaultValue: true },
    ],
  },
  finalCta: {
    slug: 'finalCta',
    fields: [
      enabled,
      heading,
      { name: 'description', type: 'textarea', localized: true, maxLength: 420 },
      { name: 'whatsAppLabel', type: 'text', localized: true },
      { name: 'quoteHeading', type: 'text', localized: true },
    ],
  },
}

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: { read: publicRead, update: authenticatedWrite },
  admin: {
    group: 'Website content',
    livePreview: { url: () => '/' },
    preview: () => '/',
  },
  fields: [
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true, maxLength: 60, required: true },
        { name: 'description', type: 'textarea', localized: true, maxLength: 160, required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'copy', type: 'textarea', localized: true, required: true, maxLength: 520 },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'primaryLabel', type: 'text', localized: true },
        { name: 'whatsAppLabel', type: 'text', localized: true },
        { name: 'trustLine', type: 'text', localized: true },
        { name: 'note', type: 'text', localized: true },
      ],
    },
    {
      name: 'trustItems',
      type: 'array',
      maxRows: 6,
      fields: [{ name: 'label', type: 'text', localized: true, required: true }],
    },
    {
      name: 'sharedLabels',
      type: 'group',
      fields: [
        { name: 'serviceCardLinkLabel', type: 'text', localized: true },
        { name: 'projectCardLinkLabel', type: 'text', localized: true },
        { name: 'projectsArchiveLabel', type: 'text', localized: true },
        { name: 'finalCtaEyebrow', type: 'text', localized: true },
        { name: 'dubaiAreaLabel', type: 'text', localized: true },
        { name: 'sharjahAreaLabel', type: 'text', localized: true },
        { name: 'ajmanAreaLabel', type: 'text', localized: true },
        { name: 'otherEmiratesAreaLabel', type: 'text', localized: true },
      ],
    },
    {
      name: 'quoteForm',
      type: 'group',
      fields: [
        { name: 'nameLabel', type: 'text', localized: true },
        { name: 'phoneLabel', type: 'text', localized: true },
        { name: 'emailLabel', type: 'text', localized: true },
        { name: 'serviceLabel', type: 'text', localized: true },
        { name: 'servicePlaceholder', type: 'text', localized: true },
        { name: 'areaLabel', type: 'text', localized: true },
        { name: 'messageLabel', type: 'text', localized: true },
        { name: 'portfolioReferenceLabel', type: 'text', localized: true },
        { name: 'photoHelp', type: 'text', localized: true },
        { name: 'consentLabel', type: 'text', localized: true },
        { name: 'privacyLabel', type: 'text', localized: true },
        { name: 'submitLabel', type: 'text', localized: true },
        { name: 'pendingLabel', type: 'text', localized: true },
        { name: 'successMessage', type: 'textarea', localized: true },
        { name: 'errorMessage', type: 'textarea', localized: true },
        { name: 'networkErrorMessage', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'sections',
      type: 'blocks',
      admin: { initCollapsed: true },
      blocks: HOME_SECTIONS.map((slug) => blocks[slug]),
      required: true,
    },
  ],
  hooks: { afterChange: [revalidateGlobal] },
  versions: { drafts: { autosave: { interval: 100 }, schedulePublish: true } },
}
