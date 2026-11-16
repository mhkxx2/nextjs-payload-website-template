import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { validateAndRandomizeMediaUpload } from './media/validateUpload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const LeadMedia: CollectionConfig = {
  slug: 'lead-media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['filename', 'originalName', 'createdAt'],
    group: 'Leads',
    useAsTitle: 'originalName',
  },
  fields: [
    { name: 'originalName', type: 'text', required: true },
    {
      name: 'purpose',
      type: 'select',
      defaultValue: 'quotation-reference',
      options: [{ label: 'Quotation reference', value: 'quotation-reference' }],
      required: true,
    },
  ],
  hooks: { beforeOperation: [validateAndRandomizeMediaUpload] },
  timestamps: true,
  upload: {
    allowRestrictedFileTypes: false,
    bulkUpload: false,
    focalPoint: false,
    imageSizes: [{ name: 'preview', width: 1200, withoutEnlargement: true }],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    pasteURL: false,
    staticDir: path.resolve(dirname, '../../storage/lead-media'),
    withMetadata: false,
  },
}

