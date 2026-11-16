import type { GlobalConfig } from 'payload'

import { archiveSEOFields } from '@/fields/archiveContent'
import { authenticatedWrite, publicRead, revalidateGlobal } from './shared'

const sectionHeadingFields = [
  { name: 'eyebrow', type: 'text' as const, localized: true },
  { name: 'heading', type: 'text' as const, localized: true },
  { name: 'introduction', type: 'textarea' as const, localized: true, maxLength: 520 },
]

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  access: { read: publicRead, update: authenticatedWrite },
  admin: {
    group: 'Website content',
    livePreview: { url: () => '/contact/' },
    preview: () => '/contact/',
  },
  fields: [
    { name: 'seo', type: 'group', fields: archiveSEOFields() },
    {
      name: 'hero',
      type: 'group',
      fields: [
        ...sectionHeadingFields,
        { name: 'primaryLabel', type: 'text', localized: true },
        { name: 'whatsAppLabel', type: 'text', localized: true },
      ],
    },
    {
      name: 'workshopCard',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'callLabel', type: 'text', localized: true },
        { name: 'emailLabel', type: 'text', localized: true },
        { name: 'visitLabel', type: 'text', localized: true },
        { name: 'hoursLabel', type: 'text', localized: true },
        { name: 'mapLabel', type: 'text', localized: true },
      ],
    },
    {
      name: 'channelLabels',
      type: 'group',
      fields: [
        { name: 'call', type: 'text', localized: true },
        { name: 'whatsApp', type: 'text', localized: true },
        { name: 'email', type: 'text', localized: true },
        { name: 'visit', type: 'text', localized: true },
      ],
    },
    {
      name: 'quoteSection',
      type: 'group',
      fields: [
        ...sectionHeadingFields,
        {
          name: 'checklist',
          type: 'array',
          maxRows: 8,
          fields: [{ name: 'item', type: 'text', localized: true }],
        },
        { name: 'responseNote', type: 'textarea', localized: true },
        { name: 'formHeading', type: 'text', localized: true },
      ],
    },
    {
      name: 'hoursSection',
      type: 'group',
      fields: [
        ...sectionHeadingFields,
        { name: 'openDaysLabel', type: 'text', localized: true },
        { name: 'closedDayLabel', type: 'text', localized: true },
        { name: 'closedLabel', type: 'text', localized: true },
      ],
    },
    { name: 'coverageSection', type: 'group', fields: sectionHeadingFields },
    { name: 'servicesSection', type: 'group', fields: sectionHeadingFields },
  ],
  hooks: { afterChange: [revalidateGlobal] },
  versions: { drafts: { autosave: { interval: 100 }, schedulePublish: true } },
}
