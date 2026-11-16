import type { Block } from 'payload'

export const ProjectGalleryBlockConfig: Block = {
  slug: 'projectGallery',
  interfaceName: 'ProjectGalleryBlock',
  labels: {
    singular: 'Project Gallery',
    plural: 'Project Galleries',
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
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
    },
  ],
}

export const ProjectGalleryBlock = ProjectGalleryBlockConfig
export const ProjectGallery = ProjectGalleryBlockConfig
