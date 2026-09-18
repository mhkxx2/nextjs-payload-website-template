import type { Block } from 'payload'

export const BenefitsBlockConfig: Block = {
  slug: 'benefits',
  interfaceName: 'BenefitsBlock',
  labels: {
    singular: 'Benefits',
    plural: 'Benefits Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'icon',
          type: 'text',
        },
      ],
    },
  ],
}

export const BenefitsBlock = BenefitsBlockConfig
export const Benefits = BenefitsBlockConfig
