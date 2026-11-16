import type { Block } from 'payload'

export const ServiceGridBlockConfig: Block = {
  slug: 'serviceGrid',
  interfaceName: 'ServiceGridBlock',
  labels: {
    singular: 'Service Grid',
    plural: 'Service Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
  ],
}

export const ServiceGridBlock = ServiceGridBlockConfig
export const ServiceGrid = ServiceGridBlockConfig
