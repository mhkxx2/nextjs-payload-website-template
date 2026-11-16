import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'
import {
  revalidateCurtainBlindProductsAfterChange,
  revalidateCurtainBlindProductsAfterDelete,
} from '@/hooks/revalidateCurtainsBlinds'

const activeRead: CollectionConfig['access'] = {
  create: authenticated,
  delete: authenticated,
  read: ({ req: { user } }) => (user ? true : { active: { equals: true } }),
  update: authenticated,
}

export const CurtainBlindProducts: CollectionConfig = {
  slug: 'curtain-blind-products',
  access: activeRead,
  admin: {
    defaultColumns: [
      'featuredImage',
      'name',
      'productType',
      'sku',
      'badge',
      'salePrice',
      'sortOrder',
      'active',
      'updatedAt',
    ],
    group: 'Curtains & Blinds',
    useAsTitle: 'name',
  },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField(),
    {
      name: 'categories',
      type: 'relationship',
      hasMany: true,
      index: true,
      relationTo: 'curtain-blind-categories',
      required: true,
    },
    {
      name: 'productType',
      type: 'select',
      index: true,
      options: [
        { label: 'Curtain', value: 'curtain' },
        { label: 'Blind', value: 'blind' },
      ],
      required: true,
    },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'sku', type: 'text', index: true },
    {
      name: 'regularPrice',
      type: 'number',
      admin: { description: 'Price in AED.' },
      min: 0,
    },
    {
      name: 'salePrice',
      type: 'number',
      admin: { description: 'Sale price in AED when discounted.' },
      min: 0,
    },
    {
      name: 'priceSuffix',
      type: 'text',
      admin: { description: 'Optional unit label such as /sqm.' },
      defaultValue: '',
    },
    {
      name: 'badge',
      type: 'select',
      index: true,
      options: [
        { label: 'None', value: 'none' },
        { label: 'On Sale', value: 'on-sale' },
        { label: 'New In', value: 'new-in' },
        { label: 'Most Selling', value: 'most-selling' },
        { label: 'Hot Selling', value: 'hot-selling' },
      ],
      defaultValue: 'none',
    },
    { name: 'shortDescription', type: 'textarea', maxLength: 500 },
    { name: 'fullDescription', type: 'textarea' },
    {
      name: 'features',
      type: 'array',
      labels: { plural: 'Specifications', singular: 'Specification' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'sortOrder', type: 'number', defaultValue: 1000, index: true, required: true },
    { name: 'featured', type: 'checkbox', defaultValue: false, index: true },
    { name: 'active', type: 'checkbox', defaultValue: true, index: true, required: true },
    { name: 'seoTitle', type: 'text', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
    {
      name: 'sourceSite',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
      defaultValue: 'curtainsandblind.ae',
      required: true,
    },
    {
      name: 'sourceURL',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
      index: true,
      required: true,
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
    afterChange: [revalidateCurtainBlindProductsAfterChange],
    afterDelete: [revalidateCurtainBlindProductsAfterDelete],
  },
  timestamps: true,
}
