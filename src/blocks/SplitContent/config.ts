import type { Block } from 'payload'

export const SplitContentBlockConfig: Block = {
  slug: 'splitContent',
  interfaceName: 'SplitContentBlock',
  labels: {
    singular: 'Split Content',
    plural: 'Split Content Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mediaPosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
    },
    {
      name: 'ctaLink',
      type: 'text',
    },
  ],
}

export const SplitContentBlock = SplitContentBlockConfig
export const SplitContent = SplitContentBlockConfig
