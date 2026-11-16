import type { Block } from 'payload'

export const LocationCoverageBlockConfig: Block = {
  slug: 'locationCoverage',
  interfaceName: 'LocationCoverageBlock',
  labels: {
    singular: 'Location Coverage',
    plural: 'Location Coverage Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'areas',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'details',
          type: 'text',
        },
      ],
    },
  ],
}

export const LocationCoverageBlock = LocationCoverageBlockConfig
export const LocationCoverage = LocationCoverageBlockConfig
