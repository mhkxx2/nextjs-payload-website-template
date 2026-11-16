import type { GlobalConfig, TextFieldValidation } from 'payload'

import { authenticatedWrite, publicRead, revalidateGlobal, trimText, validateMapURL } from './shared'

const validateWriteReviewURL: TextFieldValidation = (value) => {
  if (value == null || value === '') return true
  if (
    typeof value !== 'string' ||
    value.trim() !== value ||
    /^https:\/\/[^/?#]*:\d+(?:[/?#]|$)/i.test(value)
  ) return 'Use a clean Google review HTTPS URL without credentials or ports.'
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.port &&
      !url.hash &&
      ['g.page', 'www.google.com', 'google.com'].includes(url.hostname)
    ) || 'Use a Google review HTTPS URL without credentials, ports, or fragments.'
  } catch {
    return 'Enter a valid Google review URL.'
  }
}

export const GoogleReviews: GlobalConfig = {
  slug: 'google-reviews',
  label: 'Google Reviews',
  access: { read: publicRead, update: authenticatedWrite },
  admin: { group: 'Site configuration' },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false },
    {
      name: 'placeId',
      type: 'text',
      hooks: { beforeValidate: [trimText] },
      admin: { description: 'Google Place ID for server-side Places API (New) reviews. Never enter an API key here.' },
    },
    { name: 'heading', type: 'text', localized: true, defaultValue: 'What Our Customers Say' },
    { name: 'subheading', type: 'textarea', localized: true },
    {
      name: 'reviewLimit',
      type: 'number',
      defaultValue: 5,
      min: 3,
      max: 5,
      admin: { description: 'Max review cards to show (Google Places returns up to 5).' },
    },
    {
      name: 'mapsUrl',
      type: 'text',
      defaultValue: 'https://maps.app.goo.gl/zUhpC9PNhgwM69qp6',
      hooks: { beforeValidate: [trimText] },
      validate: validateMapURL,
    },
    {
      name: 'writeReviewUrl',
      type: 'text',
      defaultValue: 'https://g.page/r/CZ5_iPy3nYpdEBM/review',
      hooks: { beforeValidate: [trimText] },
      validate: validateWriteReviewURL,
    },
  ],
  hooks: { afterChange: [revalidateGlobal] },
}
