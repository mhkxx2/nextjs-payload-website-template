import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { Plugin } from 'payload'

import { canonicalPath } from '@/lib/routes'
import { CANONICAL_PUBLIC_ORIGIN } from '@/globals/shared'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

const generateTitle: GenerateTitle = async ({ doc, req }) => {
  const documentTitle = typeof doc?.title === 'string' ? doc.title.trim() : ''
  const [settings, defaults] = await Promise.all([
    req.payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false, req }),
    req.payload.findGlobal({ slug: 'seo-defaults', depth: 0, overrideAccess: false, req }),
  ])
  const brand = typeof settings.brandName === 'string' ? settings.brandName.trim() : ''
  const pattern = typeof defaults.titlePattern === 'string' ? defaults.titlePattern.trim() : ''

  if (pattern && documentTitle) {
    return pattern.replaceAll('{title}', documentTitle).replaceAll('{brand}', brand)
  }
  return [documentTitle, brand].filter(Boolean).join(' | ')
}

const generateURL: GenerateURL = ({ collectionConfig, doc }) => {
  if (typeof doc?.slug !== 'string') return CANONICAL_PUBLIC_ORIGIN

  const kind =
    collectionConfig?.slug === 'services'
      ? 'service'
      : collectionConfig?.slug === 'projects'
        ? 'project'
        : collectionConfig?.slug === 'posts'
          ? 'post'
          : 'page'

  return `${CANONICAL_PUBLIC_ORIGIN}${canonicalPath(kind, doc.slug)}`
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
    uploadsCollection: 'media',
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  FixedToolbarFeature(),
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                ],
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => [...defaultFields, ...searchFields],
    },
  }),
]
