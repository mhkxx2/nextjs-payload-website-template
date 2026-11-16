import type { Field } from 'payload'

export const archiveCTAFields = (): Field[] => [
  { name: 'eyebrow', type: 'text', localized: true },
  { name: 'heading', type: 'text', localized: true },
  { name: 'description', type: 'textarea', localized: true, maxLength: 420 },
  { name: 'primaryLabel', type: 'text', localized: true },
  { name: 'whatsAppLabel', type: 'text', localized: true },
]

export const archiveSEOFields = (): Field[] => [
  { name: 'title', type: 'text', localized: true, maxLength: 60 },
  { name: 'description', type: 'textarea', localized: true, maxLength: 160 },
  { name: 'image', type: 'upload', relationTo: 'media' },
]

export const baseArchiveFields = (): Field[] => [
  { name: 'heading', type: 'text', localized: true },
  { name: 'introduction', type: 'textarea', localized: true, maxLength: 520 },
  { name: 'emptyState', type: 'textarea', localized: true, maxLength: 420 },
  { name: 'cta', type: 'group', fields: archiveCTAFields() },
  { name: 'seo', type: 'group', fields: archiveSEOFields() },
]
