import type { CollectionConfig } from 'payload'

import { adminOrPublished } from '@/access/adminOrPublished'
import { authenticated } from '@/access/authenticated'
import { contentAuditFields } from '@/fields/contentAudit'
import { publicationFields } from '@/fields/publication'
import { slugField } from '@/fields/slug'
import {
  populateContentAudit,
  revalidateContentAfterChange,
  revalidateContentAfterDelete,
  validatePublicationSchedule,
} from '@/hooks/revalidateContent'
import { SERVICE_AREA_GROUPS, SERVICE_AREA_GROUP_LABELS } from '@/data/serviceAreas'

export const Areas: CollectionConfig = {
  slug: 'areas',
  access: {
    create: authenticated,
    delete: authenticated,
    read: adminOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'group', 'featured', 'status', 'order'],
    useAsTitle: 'name',
  },
  defaultPopulate: {
    name: true,
    slug: true,
    group: true,
    featured: true,
    order: true,
    landingPage: true,
    status: true,
    publishedAt: true,
    _status: true,
  },
  fields: [
    { name: 'name', type: 'text', localized: true, required: true },
    slugField({ useAsSlug: 'name' }),
    {
      name: 'group',
      type: 'select',
      options: SERVICE_AREA_GROUPS.map((value) => ({
        label: SERVICE_AREA_GROUP_LABELS[value],
        value,
      })),
      required: true,
    },
    { name: 'summary', type: 'textarea', localized: true, maxLength: 320 },
    { name: 'featured', type: 'checkbox', defaultValue: false, index: true },
    { name: 'order', type: 'number', defaultValue: 0, index: true, min: 0, required: true },
    {
      name: 'landingPage',
      type: 'relationship',
      admin: {
        description:
          'Optional. The homepage links this area only when the related page is genuinely published.',
      },
      relationTo: 'pages',
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

