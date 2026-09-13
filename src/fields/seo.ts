import type { Field, TextFieldValidation } from 'payload'

const CANONICAL_ORIGIN = 'https://alruknfurniture.ae'

const validateCanonicalURL: TextFieldValidation = (value) => {
  if (typeof value !== 'string') return 'Enter an absolute canonical URL.'

  try {
    const canonical = new URL(value)

    if (
      canonical.origin !== CANONICAL_ORIGIN ||
      canonical.protocol !== 'https:' ||
      canonical.username !== '' ||
      canonical.password !== '' ||
      canonical.hash !== ''
    ) {
      return `Canonical URLs must use ${CANONICAL_ORIGIN} without credentials, ports, or fragments.`
    }

    return true
  } catch {
    return 'Enter a valid absolute canonical URL.'
  }
}

const schemaOptions = [
  { label: 'Organization', value: 'Organization' },
  { label: 'Local Business', value: 'LocalBusiness' },
  { label: 'Service', value: 'Service' },
  { label: 'Breadcrumb List', value: 'BreadcrumbList' },
  { label: 'Article', value: 'Article' },
  { label: 'FAQ Page', value: 'FAQPage' },
]

/** Reusable, bounded SEO data with no arbitrary markup or executable input. */
export function seoFields(): Field[] {
  return [
    {
      name: 'title',
      type: 'text',
      label: 'SEO title',
      localized: true,
      maxLength: 60,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Meta description',
      localized: true,
      maxLength: 160,
    },
    {
      name: 'canonicalURL',
      type: 'text',
      label: 'Canonical URL',
      required: true,
      validate: validateCanonicalURL,
    },
    {
      name: 'openGraphTitle',
      type: 'text',
      label: 'Open Graph title',
      localized: true,
      maxLength: 60,
    },
    {
      name: 'openGraphDescription',
      type: 'textarea',
      label: 'Open Graph description',
      localized: true,
      maxLength: 160,
    },
    {
      name: 'openGraphImage',
      type: 'upload',
      label: 'Open Graph image',
      relationTo: 'media',
    },
    {
      name: 'index',
      type: 'checkbox',
      label: 'Allow search engines to index this page',
      defaultValue: true,
    },
    {
      name: 'follow',
      type: 'checkbox',
      label: 'Allow search engines to follow links',
      defaultValue: true,
    },
    {
      name: 'schemaTypes',
      type: 'select',
      label: 'Structured data types',
      hasMany: true,
      options: schemaOptions,
    },
    {
      name: 'preview',
      type: 'ui',
      label: 'Search and social preview',
      admin: {
        components: {
          Field: {
            path: '@/fields/SEOPreview#SEOPreview',
            clientProps: {
              canonicalPath: 'canonicalURL',
              titlePath: 'openGraphTitle',
              descriptionPath: 'openGraphDescription',
              imagePath: 'openGraphImage',
            },
          },
        },
      },
    },
  ]
}
