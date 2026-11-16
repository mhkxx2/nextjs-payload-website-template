import type { Field, GlobalConfig } from 'payload'

import { authenticatedWrite, publicRead } from './shared'
import { revalidateFooter } from '@/Footer/hooks/revalidateFooter'

const boundedDestination: Field = {
  name: 'destination',
  type: 'select',
  options: [
    { label: 'Home', value: 'home' },
    { label: 'Services', value: 'services' },
    { label: 'Projects', value: 'projects' },
    { label: 'Areas We Serve', value: 'areas' },
    { label: 'Collection', value: 'portfolio' },
    { label: 'Blog', value: 'blog' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' },
    { label: 'Privacy policy', value: 'privacy' },
    { label: 'Terms', value: 'terms' },
  ],
  required: true,
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: publicRead, update: authenticatedWrite },
  admin: { group: 'Site configuration' },
  fields: [
    {
      name: 'navigationGroups',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        {
          name: 'items',
          type: 'array',
          maxRows: 8,
          fields: [
            { name: 'label', type: 'text', localized: true, required: true },
            boundedDestination,
          ],
        },
      ],
    },
    {
      name: 'serviceLinks',
      type: 'array',
      maxRows: 9,
      fields: [
        // Optional on purpose: Payload nulls this column when the linked service is
        // deleted, and NOT NULL would block that delete. Empty links are filtered out.
        { name: 'service', type: 'relationship', relationTo: 'services' },
        { name: 'label', type: 'text', localized: true },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        {
          name: 'legalDestination',
          type: 'select',
          options: [
            { label: 'Privacy policy', value: 'privacy' },
            { label: 'Terms', value: 'terms' },
          ],
          required: true,
        },
      ],
    },
    { name: 'supportingCopy', type: 'textarea', localized: true, maxLength: 400 },
    {
      name: 'conversionContent',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'copy', type: 'textarea', localized: true, maxLength: 300 },
        { name: 'quotationLabel', type: 'text', localized: true },
        { name: 'whatsAppLabel', type: 'text', localized: true },
      ],
    },
  ],
  hooks: { afterChange: [revalidateFooter] },
}
