import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { isSafeSlug, normalizeSlug } from '../lib/slug'

const requiredTrimmedText = (value: unknown): true | string =>
  typeof value === 'string' && value.trim().length > 0 ? true : 'This field is required.'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim() : value)],
      },
      validate: requiredTrimmedText,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [({ siblingData, value }) => {
          const source = typeof value === 'string' && value.trim() ? value : siblingData.title
          return typeof source === 'string' ? normalizeSlug(source) : source
        }],
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.length === 0) return 'A category slug is required.'
        return isSafeSlug(value)
          ? true
          : 'Use only lowercase letters, numbers, and single hyphens.'
      },
    },
  ],
  timestamps: true,
}
