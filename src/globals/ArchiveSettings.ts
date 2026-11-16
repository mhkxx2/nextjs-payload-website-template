import type { Field, GlobalConfig } from 'payload'

import { baseArchiveFields } from '@/fields/archiveContent'
import { authenticatedWrite, publicRead, revalidateGlobal } from './shared'

const archiveGroup = (name: string, extraFields: Field[] = []): Field => ({
  name,
  type: 'group',
  fields: [...baseArchiveFields(), ...extraFields],
})

export const ArchiveSettings: GlobalConfig = {
  slug: 'archive-settings',
  access: { read: publicRead, update: authenticatedWrite },
  admin: { group: 'Website content' },
  fields: [
    archiveGroup('servicesArchive'),
    archiveGroup('projectsArchive'),
    archiveGroup('blogArchive'),
    archiveGroup('portfolioArchive', [
      {
        name: 'hero',
        type: 'group',
        fields: [
          { name: 'eyebrow', type: 'text', localized: true },
          { name: 'heading', type: 'text', localized: true },
          { name: 'introduction', type: 'textarea', localized: true, maxLength: 650 },
          { name: 'exploreLabel', type: 'text', localized: true },
          { name: 'sendDesignLabel', type: 'text', localized: true },
        ],
      },
      {
        name: 'filterLabels',
        type: 'group',
        fields: [
          { name: 'all', type: 'text', localized: true },
          { name: 'bedroom', type: 'text', localized: true },
          { name: 'livingRoom', type: 'text', localized: true },
          { name: 'kidsRoom', type: 'text', localized: true },
          { name: 'diningRoom', type: 'text', localized: true },
          { name: 'bathroom', type: 'text', localized: true },
          { name: 'sofas', type: 'text', localized: true },
          { name: 'beds', type: 'text', localized: true },
          { name: 'wardrobes', type: 'text', localized: true },
          { name: 'officeStudy', type: 'text', localized: true },
          { name: 'storage', type: 'text', localized: true },
        ],
      },
      {
        name: 'supportingLabels',
        type: 'group',
        fields: [
          { name: 'roomEyebrow', type: 'text', localized: true },
          { name: 'roomHeading', type: 'text', localized: true },
          { name: 'servicesEyebrow', type: 'text', localized: true },
          { name: 'servicesHeading', type: 'text', localized: true },
          { name: 'resultsHeading', type: 'text', localized: true },
          { name: 'loadMoreLabel', type: 'text', localized: true },
        ],
      },
    ]),
  ],
  hooks: { afterChange: [revalidateGlobal] },
  versions: { drafts: { autosave: { interval: 100 }, schedulePublish: true } },
}
