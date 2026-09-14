import type { Field, GlobalConfig } from 'payload'

import { authenticatedWrite, publicRead } from './shared'
import { revalidateHeader } from '@/Header/hooks/revalidateHeader'

const destinationFields: Field[] = [
  { name: 'label', type: 'text', localized: true, required: true },
  {
    name: 'destination',
    type: 'select',
    options: [
      { label: 'Home', value: 'home' },
      { label: 'Services', value: 'services' },
      { label: 'Projects', value: 'projects' },
      { label: 'Blog', value: 'blog' },
      { label: 'About', value: 'about' },
      { label: 'Contact', value: 'contact' },
    ],
    required: true,
  },
]

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: publicRead, update: authenticatedWrite },
  admin: { group: 'Site configuration' },
  fields: [
    { name: 'navigation', type: 'array', maxRows: 8, fields: destinationFields },
    {
      name: 'serviceLinks',
      type: 'array',
      maxRows: 9,
      fields: [
        { name: 'service', type: 'relationship', relationTo: 'services', required: true },
        { name: 'label', type: 'text', localized: true },
      ],
    },
    {
      name: 'conversionActions',
      type: 'array',
      maxRows: 3,
      fields: [
        {
          name: 'action',
          type: 'select',
          options: [
            { label: 'Request a quotation', value: 'quotation' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Call', value: 'phone' },
          ],
          required: true,
        },
        { name: 'label', type: 'text', localized: true, required: true },
        {
          name: 'appearance',
          type: 'select',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
        },
      ],
    },
    {
      name: 'mobileNavigation',
      type: 'group',
      fields: [
        { name: 'menuLabel', type: 'text', localized: true },
        { name: 'closeLabel', type: 'text', localized: true },
        { name: 'showConversionActions', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
  hooks: { afterChange: [revalidateHeader] },
}
