import type { Block } from 'payload'

export const MediaBlockConfig: Block = {
  slug: 'media',
  interfaceName: 'MediaBlock',
  labels: {
    singular: 'Media',
    plural: 'Media Blocks',
  },
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'position',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Wide', value: 'wide' },
        { label: 'Fullscreen', value: 'fullscreen' },
      ],
    },
  ],
}

export const MediaBlock = MediaBlockConfig
