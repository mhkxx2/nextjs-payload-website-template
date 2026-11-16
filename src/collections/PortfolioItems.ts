import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'
import {
  revalidatePortfolioAfterChange,
  revalidatePortfolioAfterDelete,
} from '@/hooks/revalidatePortfolio'

const publishedRead: CollectionConfig['access'] = {
  create: authenticated,
  delete: authenticated,
  read: ({ req: { user } }) => (user ? true : { published: { equals: true } }),
  update: authenticated,
}

const roomOptions = [
  { label: 'Bedroom', value: 'bedroom' },
  { label: 'Living Room', value: 'living-room' },
  { label: 'Kids Room', value: 'kids-room' },
  { label: 'Dining Room', value: 'dining-room' },
  { label: 'Bathroom', value: 'bathroom' },
  { label: 'Office / Study', value: 'office-study' },
  { label: 'Storage', value: 'storage' },
] as const

const furnitureOptions = [
  'Beds',
  'TV Beds',
  'Bedside Tables',
  'Dressing Tables',
  'Chest of Drawers',
  'Headboards',
  'Wardrobes',
  'Stools',
  'Sectional Sofas',
  'Sofas',
  'TV Units',
  'Coffee Tables',
  'Chairs',
  'Buffet Tables',
  'Chaise Lounges',
  'Daybeds',
  'Dining Tables',
  'Hallway Furniture',
  'Love Seats',
  'Ottoman Benches',
  'Bunk Beds',
  'Single Beds',
  'Baby Cribs',
  'Baby Room Drawers',
  'Bookcases',
  'Study Tables',
  'Storage Furniture',
  'Bathroom Furniture',
].map((label) => ({ label, value: label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))

export const PortfolioItems: CollectionConfig = {
  slug: 'portfolio-items',
  access: publishedRead,
  admin: {
    defaultColumns: [
      'coverImage',
      'title',
      'roomCategory',
      'furnitureType',
      'relatedService',
      'featured',
      'published',
      'sourceSite',
      'updatedAt',
    ],
    group: 'Portfolio',
    useAsTitle: 'title',
  },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'roomCategory',
      type: 'select',
      index: true,
      options: [...roomOptions],
      required: true,
    },
    {
      name: 'furnitureType',
      type: 'select',
      index: true,
      options: furnitureOptions,
      required: true,
    },
    {
      name: 'style',
      type: 'select',
      options: ['Modern', 'Minimal', 'Luxury', 'Classic', 'Contemporary'],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'shortDescription', type: 'textarea', localized: true, maxLength: 360 },
    { name: 'relatedService', type: 'relationship', relationTo: 'services', required: true },
    { name: 'featured', type: 'checkbox', defaultValue: false, index: true },
    { name: 'sortOrder', type: 'number', defaultValue: 1000, index: true, required: true },
    { name: 'published', type: 'checkbox', defaultValue: false, index: true, required: true },
    {
      name: 'sourceSite',
      type: 'text',
      defaultValue: 'eco-furniture.ae',
      admin: { position: 'sidebar', readOnly: true },
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
    { name: 'sourceCategory', type: 'text', admin: { position: 'sidebar' }, required: true },
    { name: 'originalFilename', type: 'text', admin: { position: 'sidebar' }, required: true },
    {
      name: 'isRealAlRuknProject',
      type: 'checkbox',
      admin: {
        description: 'Enable only when this is verified completed Al Rukn customer work.',
        position: 'sidebar',
      },
      defaultValue: false,
      required: true,
    },
    { name: 'seoTitle', type: 'text', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
  ],
  hooks: {
    afterChange: [revalidatePortfolioAfterChange],
    afterDelete: [revalidatePortfolioAfterDelete],
  },
  timestamps: true,
}
