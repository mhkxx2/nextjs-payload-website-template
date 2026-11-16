import type { GlobalConfig } from 'payload'

import { archiveCTAFields, archiveSEOFields } from '@/fields/archiveContent'
import { authenticatedWrite, publicRead, revalidateGlobal } from './shared'

const sectionHeadingFields = [
  { name: 'eyebrow', type: 'text' as const, localized: true },
  { name: 'heading', type: 'text' as const, localized: true },
  { name: 'introduction', type: 'textarea' as const, localized: true, maxLength: 520 },
]

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  access: { read: publicRead, update: authenticatedWrite },
  admin: {
    group: 'Website content',
    livePreview: { url: () => '/about-us/' },
    preview: () => '/about-us/',
  },
  fields: [
    { name: 'seo', type: 'group', fields: archiveSEOFields() },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'introduction', type: 'textarea', localized: true, maxLength: 650 },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'primaryLabel', type: 'text', localized: true },
        { name: 'secondaryLabel', type: 'text', localized: true },
      ],
    },
    {
      name: 'proofItems',
      type: 'array',
      maxRows: 6,
      fields: [{ name: 'label', type: 'text', localized: true }],
    },
    {
      name: 'story',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        {
          name: 'paragraphs',
          type: 'array',
          maxRows: 6,
          fields: [{ name: 'text', type: 'textarea', localized: true, maxLength: 850 }],
        },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'servicesSection', type: 'group', fields: sectionHeadingFields },
    {
      name: 'processSection',
      type: 'group',
      fields: [
        ...sectionHeadingFields,
        {
          name: 'steps',
          type: 'array',
          maxRows: 6,
          fields: [
            { name: 'title', type: 'text', localized: true },
            { name: 'description', type: 'textarea', localized: true },
          ],
        },
      ],
    },
    {
      name: 'principlesSection',
      type: 'group',
      fields: [
        ...sectionHeadingFields,
        {
          name: 'items',
          type: 'array',
          maxRows: 8,
          fields: [
            { name: 'title', type: 'text', localized: true },
            { name: 'description', type: 'textarea', localized: true },
          ],
        },
      ],
    },
    { name: 'coverageSection', type: 'group', fields: sectionHeadingFields },
    { name: 'cta', type: 'group', fields: archiveCTAFields() },
  ],
  hooks: { afterChange: [revalidateGlobal] },
  versions: { drafts: { autosave: { interval: 100 }, schedulePublish: true } },
}
