import type { Block } from 'payload'

export const RichContentBlockConfig: Block = {
  slug: 'richContent',
  interfaceName: 'RichContentBlock',
  labels: {
    singular: 'Rich Content',
    plural: 'Rich Contents',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { label: 'Narrow', value: 'narrow' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full', value: 'full' },
      ],
    },
  ],
}

export const RichContentBlock = RichContentBlockConfig
export const RichContent = RichContentBlockConfig
