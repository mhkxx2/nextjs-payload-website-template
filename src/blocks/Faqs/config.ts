import type { Block } from 'payload'

export const FaqsBlockConfig: Block = {
  slug: 'faqs',
  interfaceName: 'FaqsBlock',
  labels: {
    singular: 'FAQs',
    plural: 'FAQ Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
    },
    {
      name: 'enableSchema',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export const FaqsBlock = FaqsBlockConfig
export const Faqs = FaqsBlockConfig
