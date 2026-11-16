import type { Block } from 'payload'

export const QuoteFormBlockConfig: Block = {
  slug: 'quoteForm',
  interfaceName: 'QuoteFormBlock',
  labels: {
    singular: 'Quote Form',
    plural: 'Quote Forms',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'serviceContext',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'formTitle',
      type: 'text',
    },
  ],
}

export const QuoteFormBlock = QuoteFormBlockConfig
export const QuoteForm = QuoteFormBlockConfig
