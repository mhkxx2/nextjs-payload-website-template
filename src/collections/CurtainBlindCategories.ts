import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'
import {
  revalidateCurtainBlindCategoriesAfterChange,
  revalidateCurtainBlindCategoriesAfterDelete,
} from '@/hooks/revalidateCurtainsBlinds'

const activeRead: CollectionConfig['access'] = {
  create: authenticated,
  delete: authenticated,
  read: ({ req: { user } }) => (user ? true : { active: { equals: true } }),
  update: authenticated,
}

export const CurtainBlindCategories: CollectionConfig = {
  slug: 'curtain-blind-categories',
  access: activeRead,
  admin: {
    defaultColumns: ['featuredImage', 'name', 'type', 'parent', 'sortOrder', 'active', 'updatedAt'],
    group: 'Curtains & Blinds',
    useAsTitle: 'name',
  },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField(),
    {
      name: 'type',
      type: 'select',
      index: true,
      options: [
        { label: 'Curtain', value: 'curtain' },
        { label: 'Blind', value: 'blind' },
      ],
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      admin: { description: 'Optional parent category for nested filters.' },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
      relationTo: 'curtain-blind-categories',
    },
    { name: 'shortDescription', type: 'textarea', maxLength: 360 },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'seoTitle', type: 'text', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
    { name: 'sortOrder', type: 'number', defaultValue: 1000, index: true, required: true },
    { name: 'active', type: 'checkbox', defaultValue: true, index: true, required: true },
    {
      name: 'featuredOnShop',
      type: 'checkbox',
      admin: {
        description: 'Show this category in the Shop by Category cards near the top of the page.',
      },
      defaultValue: false,
      index: true,
    },
    {
      name: 'sourceSite',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
      defaultValue: 'curtainsandblind.ae',
    },
    {
      name: 'sourceURL',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
      index: true,
      unique: true,
    },
    {
      name: 'sourceId',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true },
      index: true,
    },
  ],
  hooks: {
    afterChange: [revalidateCurtainBlindCategoriesAfterChange],
    afterDelete: [revalidateCurtainBlindCategoriesAfterDelete],
  },
  timestamps: true,
}
