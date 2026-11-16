import type { Block } from 'payload'

export const StatisticsBlockConfig: Block = {
  slug: 'statistics',
  interfaceName: 'StatisticsBlock',
  labels: {
    singular: 'Statistics',
    plural: 'Statistics Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'substantiationNote',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Mandatory source or substantiation details for these metrics (no unverified claims).',
      },
    },
    {
      name: 'stats',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
  ],
}

export const StatisticsBlock = StatisticsBlockConfig
export const Statistics = StatisticsBlockConfig
