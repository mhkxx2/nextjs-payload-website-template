import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { validateAndRandomizeMediaUpload } from './media/validateUpload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const validateMediaSemantics: CollectionBeforeValidateHook = ({ data, operation, originalDoc, req }) => {
  const next = { ...data }
  const decorative = next.decorative ?? originalDoc?.decorative ?? false
  const alt = next.alt ?? originalDoc?.alt

  if (decorative === true) {
    if (alt !== '') throw new Error('Decorative images must use an exact empty alt value.')
  } else {
    if (typeof alt !== 'string' || alt.trim().length === 0) {
      throw new Error('Informative images require meaningful alt text.')
    }
    next.alt = alt.trim()
  }

  if (operation === 'create') {
    if (!req.user?.id) throw new Error('An authenticated owner is required for media uploads.')
    next.uploadedBy = req.user.id
  } else if (originalDoc?.uploadedBy) {
    next.uploadedBy =
      typeof originalDoc.uploadedBy === 'object' ? originalDoc.uploadedBy.id : originalDoc.uploadedBy
  }

  return next
}

const trim = ({ value }: { value?: unknown }) =>
  typeof value === 'string' ? value.trim() : value

const requiredTrimmedText = (value: unknown): true | string =>
  typeof value === 'string' && value.trim().length > 0 ? true : 'This field is required.'

export const Media: CollectionConfig = {
  slug: 'media',
  defaultPopulate: {
    alt: true,
    caption: true,
    decorative: true,
    filename: true,
    focalX: true,
    focalY: true,
    height: true,
    mimeType: true,
    sizes: true,
    thumbnailURL: true,
    url: true,
    width: true,
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'decorative', 'uploadedBy', 'updatedAt'],
    useAsTitle: 'filename',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'decorative',
      type: 'checkbox',
      defaultValue: false,
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'sourceURL',
      type: 'text',
      access: { read: ({ req }) => Boolean(req.user) },
      required: true,
      hooks: { beforeValidate: [trim] },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.length === 0) return 'A source URL is required.'
        try {
          const url = new URL(value)
          return url.protocol === 'https:' && !url.username && !url.password
            ? true
            : 'Use a credential-free HTTPS source URL.'
        } catch {
          return 'Enter a valid HTTPS source URL.'
        }
      },
    },
    {
      name: 'license',
      type: 'text',
      access: { read: ({ req }) => Boolean(req.user) },
      required: true,
      hooks: { beforeValidate: [trim] },
      validate: requiredTrimmedText,
    },
    {
      name: 'sourceNotes',
      type: 'textarea',
      access: { read: ({ req }) => Boolean(req.user) },
      hooks: { beforeValidate: [trim] },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      access: { read: ({ req }) => Boolean(req.user) },
      relationTo: 'users',
      required: true,
      admin: { readOnly: true },
    },
  ],
  hooks: {
    beforeOperation: [validateAndRandomizeMediaUpload],
    beforeValidate: [validateMediaSemantics],
  },
  timestamps: true,
  upload: {
    adminThumbnail: 'thumbnail',
    allowRestrictedFileTypes: false,
    bulkUpload: false,
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 300 },
      { height: 500, name: 'square', width: 500 },
      { name: 'small', width: 600 },
      { name: 'medium', width: 900 },
      { name: 'large', width: 1400 },
      { name: 'xlarge', width: 1920 },
      { crop: 'center', height: 630, name: 'og', width: 1200 },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    pasteURL: false,
    staticDir: path.resolve(dirname, '../../storage/media'),
    withMetadata: false,
  },
}
