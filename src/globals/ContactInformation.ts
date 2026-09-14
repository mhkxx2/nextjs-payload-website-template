import type { GlobalConfig } from 'payload'

import {
  authenticatedWrite,
  isValidE164,
  publicRead,
  revalidateGlobal,
  trimText,
  validateMapURL,
  validateOptionalE164,
} from './shared'

const dayOptions = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
]

export const ContactInformation: GlobalConfig = {
  slug: 'contact-information',
  access: { read: publicRead, update: authenticatedWrite },
  admin: { group: 'Site configuration' },
  fields: [
    {
      name: 'phoneE164',
      type: 'text',
      hooks: { beforeValidate: [trimText] },
      validate: validateOptionalE164,
    },
    {
      name: 'whatsappE164',
      type: 'text',
      hooks: { beforeValidate: [trimText] },
      validate: validateOptionalE164,
    },
    {
      name: 'whatsappAvailable',
      type: 'checkbox',
      virtual: true,
      hooks: {
        afterRead: [({ data }) => isValidE164(data?.whatsappE164)],
      },
      admin: { readOnly: true },
    },
    { name: 'email', type: 'email' },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text', localized: true },
        { name: 'line2', type: 'text', localized: true },
        { name: 'city', type: 'text', localized: true },
        { name: 'emirate', type: 'text', localized: true },
        { name: 'country', type: 'text', localized: true },
      ],
    },
    {
      name: 'mapURL',
      type: 'text',
      hooks: { beforeValidate: [trimText] },
      validate: validateMapURL,
    },
    {
      name: 'openingHours',
      type: 'array',
      maxRows: 7,
      fields: [
        { name: 'day', type: 'select', options: dayOptions, required: true },
        { name: 'closed', type: 'checkbox', defaultValue: false },
        { name: 'opens', type: 'text', admin: { description: '24-hour time, for example 09:00.' } },
        { name: 'closes', type: 'text', admin: { description: '24-hour time, for example 18:00.' } },
        { name: 'displayLabel', type: 'text', localized: true },
      ],
    },
    {
      name: 'serviceAreas',
      type: 'array',
      fields: [{ name: 'area', type: 'text', localized: true, required: true }],
    },
  ],
  hooks: { afterChange: [revalidateGlobal] },
}
