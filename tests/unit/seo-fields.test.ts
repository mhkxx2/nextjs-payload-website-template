import type { Field, Validate } from 'payload'
import { describe, expect, it } from 'vitest'

import { seoFields } from '@/fields/seo'

type NamedField = Field & { name: string }

const fields = seoFields()

function byName(items: Field[], name: string): NamedField {
  const field = items.find((candidate) => 'name' in candidate && candidate.name === name)
  if (!field) throw new Error(`Missing SEO field: ${name}`)
  return field as NamedField
}

function runValidation(field: NamedField, value: unknown): unknown {
  if (!('validate' in field) || typeof field.validate !== 'function') {
    throw new Error(`Missing validator for ${field.name}`)
  }
  return (field.validate as Validate)(value, {} as never)
}

describe('reusable SEO fields', () => {
  it('provides the complete typed editor contract with bounded metadata', () => {
    expect(byName(fields, 'title')).toMatchObject({ type: 'text', maxLength: 60 })
    expect(byName(fields, 'description')).toMatchObject({ type: 'textarea', maxLength: 160 })
    expect(byName(fields, 'canonicalURL')).toMatchObject({ type: 'text', required: true })
    expect(byName(fields, 'openGraphTitle')).toMatchObject({ type: 'text', maxLength: 60 })
    expect(byName(fields, 'openGraphDescription')).toMatchObject({
      type: 'textarea',
      maxLength: 160,
    })
    expect(byName(fields, 'openGraphImage')).toMatchObject({
      type: 'upload',
      relationTo: 'media',
    })
    expect(byName(fields, 'index')).toMatchObject({ type: 'checkbox', defaultValue: true })
    expect(byName(fields, 'follow')).toMatchObject({ type: 'checkbox', defaultValue: true })
  })

  it.each([
    ['https://alruknfurniture.ae/', true],
    ['https://alruknfurniture.ae/custom-sofas/', true],
    ['http://alruknfurniture.ae/custom-sofas/', false],
    ['https://www.alruknfurniture.ae/custom-sofas/', false],
    ['https://alruknfurniture.ae.evil.example/custom-sofas/', false],
    ['https://alruknfurniture.ae:444/custom-sofas/', false],
    ['https://alruknfurniture.ae:443/custom-sofas/', false],
    ['HTTPS://alruknfurniture.ae:443/custom-sofas/', false],
    ['HtTpS://alruknfurniture.ae:443/custom-sofas/', false],
    ['https://user:pass@alruknfurniture.ae/custom-sofas/', false],
    ['https://alruknfurniture.ae/custom-sofas/#details', false],
    [' https://alruknfurniture.ae/custom-sofas/ ', false],
    ['https://alrukn\nfurniture.ae/custom-sofas/', false],
    ['https://alrukn\tfurniture.ae/custom-sofas/', false],
    ['https://alruknfurniture.ae/custom-sofas/\n', false],
    ['https://alruknfurniture.ae/custom\u0000sofas/', false],
    ['https://alruknfurniture.ae/custom\u007fsofas/', false],
    ['/custom-sofas/', false],
    ['not a URL', false],
  ] as const)('validates canonical URL %s', (canonicalURL, valid) => {
    expect(runValidation(byName(fields, 'canonicalURL'), canonicalURL) === true).toBe(valid)
  })

  it('restricts schema selection to the approved structured-data set', () => {
    const schemaTypes = byName(fields, 'schemaTypes')
    expect(schemaTypes).toMatchObject({ type: 'select', hasMany: true })
    if (schemaTypes.type !== 'select') throw new Error('schemaTypes must be a select field')

    expect(schemaTypes.options).toEqual([
      { label: 'Organization', value: 'Organization' },
      { label: 'Local Business', value: 'LocalBusiness' },
      { label: 'Service', value: 'Service' },
      { label: 'Breadcrumb List', value: 'BreadcrumbList' },
      { label: 'Article', value: 'Article' },
      { label: 'FAQ Page', value: 'FAQPage' },
    ])
  })

  it('uses an editor-visible preview component with only canonical and social field paths', () => {
    const preview = byName(fields, 'preview')
    expect(preview).toMatchObject({
      type: 'ui',
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
    })
    const component = preview.admin?.components?.Field
    expect(JSON.stringify(component).toLowerCase()).not.toMatch(/secret|token|password/)
  })

  it('does not permit arbitrary JSON-LD, code, or script entry', () => {
    expect(fields.some((field) => field.type === 'json' || field.type === 'code')).toBe(false)
    expect(fields.map((field) => ('name' in field ? field.name : ''))).not.toContain('jsonLd')
    expect(fields.map((field) => ('name' in field ? field.name : ''))).not.toContain('script')
  })
})
