import type { CollectionConfig } from 'payload'

import { adminOrPublished } from '@/access/adminOrPublished'
import { authenticated } from '@/access/authenticated'
import { contentAuditFields } from '@/fields/contentAudit'
import { publicationFields } from '@/fields/publication'
import {
  populateContentAudit,
  revalidateContentAfterChange,
  revalidateContentAfterDelete,
  validatePublicationSchedule,
} from '@/hooks/revalidateContent'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  access: {
    create: authenticated,
    delete: authenticated,
    read: adminOrPublished,
    readVersions: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['question', 'group', 'status', 'order', 'updatedAt'],
    useAsTitle: 'question',
  },
  fields: [
    { name: 'question', type: 'text', localized: true, required: true },
    { name: 'answer', type: 'textarea', localized: true, required: true },
    {
      name: 'services',
      type: 'relationship',
      hasMany: true,
      relationTo: 'services',
    },
    {
      name: 'group',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Services', value: 'services' },
        { label: 'Process', value: 'process' },
        { label: 'Materials and care', value: 'materials-care' },
        { label: 'Pricing and quotations', value: 'pricing-quotations' },
      ],
      required: true,
    },
    { name: 'order', type: 'number', defaultValue: 0, index: true, min: 0, required: true },
    {
      name: 'schemaEligible',
      type: 'checkbox',
      admin: {
        description:
          'Enable only when the visible public page presents this exact question and answer together; this is guidance, not automatic schema output.',
      },
      defaultValue: false,
    },
    ...publicationFields(),
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
