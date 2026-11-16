import type { GlobalConfig } from 'payload'

import { authenticatedWrite, publicRead, revalidateGlobal } from './shared'

export const SEODefaults: GlobalConfig = {
  slug: 'seo-defaults',
  access: { read: publicRead, update: authenticatedWrite },
  admin: { group: 'Site configuration' },
  fields: [
    {
      name: 'titlePattern',
      type: 'text',
      localized: true,
      maxLength: 80,
      admin: { description: 'Use {title} and {brand}; no markup is accepted.' },
    },
    { name: 'fallbackDescription', type: 'textarea', localized: true, maxLength: 160 },
    { name: 'socialImage', type: 'upload', relationTo: 'media' },
    { name: 'index', type: 'checkbox', defaultValue: true },
    { name: 'follow', type: 'checkbox', defaultValue: true },
    {
      name: 'organizationSchema',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true, maxLength: 500 },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'localBusinessSchema',
      type: 'group',
      fields: [
        {
          name: 'businessType',
          type: 'select',
          defaultValue: 'LocalBusiness',
          options: [{ label: 'Local business', value: 'LocalBusiness' }],
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobal] },
}
