import type { Block } from 'payload'

export const ProcessStepsBlockConfig: Block = {
  slug: 'processSteps',
  interfaceName: 'ProcessStepsBlock',
  labels: {
    singular: 'Process Steps',
    plural: 'Process Steps Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'stepNumber',
          type: 'number',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}

export const ProcessStepsBlock = ProcessStepsBlockConfig
export const ProcessSteps = ProcessStepsBlockConfig
