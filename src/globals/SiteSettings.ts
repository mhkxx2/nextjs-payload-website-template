import type { GlobalConfig } from 'payload'

import {
  authenticatedWrite,
  publicRead,
  validateCanonicalPublicOrigin,
} from './shared'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: publicRead, update: authenticatedWrite },
  admin: { group: 'Site configuration' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Used in the website header and footer.',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Browser / Google Search site icon. Use a square PNG at least 48×48 (192×192 preferred). Served publicly at /favicon.ico and /icon.png so crawlers are not blocked by /api/ robots rules.',
              },
            },
            {
              name: 'appleTouchIcon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Optional Apple touch icon (recommended 180×180 PNG). Served publicly at /apple-touch-icon.png.',
              },
            },
            {
              name: 'logoDark',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Optional dark mode / alternate logo variant.',
              },
            },
          ],
        },
        {
          label: 'General',
          fields: [
            { name: 'businessName', type: 'text', localized: true, required: true },
            { name: 'brandName', type: 'text', localized: true, required: true },
            {
              name: 'quotationLabels',
              type: 'group',
              fields: [
                { name: 'primaryLabel', type: 'text', localized: true },
                { name: 'formHeading', type: 'text', localized: true },
                { name: 'submitLabel', type: 'text', localized: true },
              ],
            },
            {
              name: 'whatsAppCopy',
              type: 'group',
              fields: [
                { name: 'defaultLabel', type: 'text', localized: true },
                { name: 'defaultMessage', type: 'textarea', localized: true, maxLength: 500 },
              ],
            },
            {
              name: 'locale',
              type: 'group',
              fields: [
                {
                  name: 'defaultLocale',
                  type: 'select',
                  defaultValue: 'en',
                  options: [{ label: 'English', value: 'en' }],
                  required: true,
                },
                {
                  name: 'direction',
                  type: 'select',
                  defaultValue: 'ltr',
                  options: [{ label: 'Left to right', value: 'ltr' }],
                  required: true,
                },
              ],
            },
            {
              name: 'canonicalSiteURL',
              type: 'text',
              required: true,
              validate: validateCanonicalPublicOrigin,
            },
            {
              name: 'announcement',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                { name: 'message', type: 'text', localized: true, maxLength: 180 },
                { name: 'linkLabel', type: 'text', localized: true, maxLength: 60 },
                {
                  name: 'destination',
                  type: 'select',
                  options: [
                    { label: 'Quotation', value: 'quotation' },
                    { label: 'Contact', value: 'contact' },
                    { label: 'Projects', value: 'projects' },
                  ],
                },
              ],
            },
            {
              name: 'presentation',
              type: 'group',
              fields: [
                {
                  name: 'buttonStyle',
                  type: 'select',
                  defaultValue: 'solid',
                  options: [
                    { label: 'Solid', value: 'solid' },
                    { label: 'Outline', value: 'outline' },
                  ],
                },
                {
                  name: 'imageShape',
                  type: 'select',
                  defaultValue: 'soft',
                  options: [
                    { label: 'Square', value: 'square' },
                    { label: 'Soft corners', value: 'soft' },
                    { label: 'Rounded', value: 'rounded' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateSiteSettings] },
}
