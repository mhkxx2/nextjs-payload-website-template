import type { GlobalConfig, TextFieldValidation } from 'payload'

import { authenticatedWrite, publicRead, revalidateGlobal, trimText } from './shared'

const socialHosts = {
  facebook: ['facebook.com', 'www.facebook.com'],
  instagram: ['instagram.com', 'www.instagram.com'],
  linkedin: ['linkedin.com', 'www.linkedin.com'],
  pinterest: ['pinterest.com', 'www.pinterest.com'],
  tiktok: ['tiktok.com', 'www.tiktok.com'],
  x: ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'],
  youtube: ['youtube.com', 'www.youtube.com', 'youtu.be'],
} as const

type SocialNetwork = keyof typeof socialHosts
const explicitPort = /^https:\/\/[^/?#]*:\d+(?:[/?#]|$)/i

const validateSocialURL: TextFieldValidation = (value, { siblingData }) => {
  const network = (siblingData as { network?: SocialNetwork } | undefined)?.network
  if (typeof value !== 'string' || !network || !(network in socialHosts)) {
    return 'Choose an approved social network and enter its HTTPS profile URL.'
  }
  if (value.trim() !== value || explicitPort.test(value)) {
    return 'Social URLs must use HTTPS without whitespace, credentials, or ports.'
  }
  try {
    const url = new URL(value)
    const approvedHosts = socialHosts[network] as readonly string[]
    return (
      (url.protocol === 'https:' &&
        url.username === '' &&
        url.password === '' &&
        url.hash === '' &&
        approvedHosts.includes(url.hostname)) ||
      'Social URL must use HTTPS and match the selected network.'
    )
  } catch {
    return 'Enter a valid social network URL.'
  }
}

export const SocialMedia: GlobalConfig = {
  slug: 'social-media',
  access: { read: publicRead, update: authenticatedWrite },
  admin: { group: 'Site configuration' },
  fields: [
    {
      name: 'links',
      type: 'array',
      maxRows: 7,
      fields: [
        {
          name: 'network',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Pinterest', value: 'pinterest' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'X', value: 'x' },
            { label: 'YouTube', value: 'youtube' },
          ],
          required: true,
        },
        { name: 'label', type: 'text', localized: true, required: true },
        {
          name: 'url',
          type: 'text',
          hooks: { beforeValidate: [trimText] },
          required: true,
          validate: validateSocialURL,
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobal] },
}
