import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { adminOrPublished } from '@/access/adminOrPublished'
import { authenticated } from '@/access/authenticated'
import { authenticatedField } from '@/access/authenticatedField'
import { contentAuditFields } from '@/fields/contentAudit'
import { publicationFields } from '@/fields/publication'
import {
  populateContentAudit,
  revalidateContentAfterChange,
  revalidateContentAfterDelete,
  validatePublicationSchedule,
} from '@/hooks/revalidateContent'

const requireVerificationForPublication: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const next = { ...data }
  const status = next.status ?? originalDoc?.status
  if (status !== 'published') return next

  const verificationNote = Object.hasOwn(next, 'verificationNote')
    ? next.verificationNote
    : originalDoc?.verificationNote
  const verifiedAt = Object.hasOwn(next, 'verifiedAt') ? next.verifiedAt : originalDoc?.verifiedAt
  const verifiedTimestamp =
    verifiedAt instanceof Date
      ? verifiedAt.getTime()
      : typeof verifiedAt === 'string'
        ? Date.parse(verifiedAt)
        : Number.NaN

  if (typeof verificationNote !== 'string' || !verificationNote.trim() || !Number.isFinite(verifiedTimestamp)) {
    throw new Error('A consent/verification note and date are required before testimonial publication.')
  }

  return next
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: adminOrPublished,
    readVersions: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['displayName', 'rating', 'featured', 'status', 'updatedAt'],
    useAsTitle: 'displayName',
  },
  fields: [
    {
      name: 'statement',
      type: 'textarea',
      admin: { description: 'Store only the customer-approved statement.' },
      localized: true,
      required: true,
    },
    { name: 'displayName', type: 'text', required: true },
    {
      name: 'rating',
      type: 'number',
      admin: { description: 'Optional. Enter only a rating genuinely supplied by the customer.' },
      max: 5,
      min: 1,
      required: false,
      validate: (value: number | null | undefined) =>
        value == null || Number.isInteger(value) || 'Rating must be a whole number from 1 to 5.',
    },
    { name: 'location', type: 'text' },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'project', type: 'relationship', relationTo: 'projects' },
    { name: 'featured', type: 'checkbox', defaultValue: false, index: true },
    {
      name: 'verificationNote',
      type: 'textarea',
      access: { read: authenticatedField },
      admin: {
        description:
          'Internal evidence that the statement, display name, and any rating were approved for publication.',
      },
    },
    {
      name: 'verifiedAt',
      type: 'date',
      access: { read: authenticatedField },
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    ...publicationFields(),
    ...contentAuditFields(),
  ],
  hooks: {
    afterChange: [revalidateContentAfterChange],
    afterDelete: [revalidateContentAfterDelete],
    beforeChange: [validatePublicationSchedule, requireVerificationForPublication, populateContentAudit],
  },
  timestamps: true,
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true },
    maxPerDoc: 50,
  },
}
