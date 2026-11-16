import type { Field, FieldHook, GroupField, TextField } from 'payload'
import { describe, expect, it } from 'vitest'

import { Media } from '@/collections/Media'
import { Services } from '@/collections/Services'
import { FIXED_SERVICE_SLUGS } from '@/lib/routes'

const namedField = (fields: Field[], name: string) => {
  const field = fields.find((candidate) => 'name' in candidate && candidate.name === name)
  if (!field) throw new Error(`Missing field ${name}`)
  return field
}

const landing = namedField(Services.fields, 'sofaUpholsteryLanding') as GroupField
const popularServices = namedField(landing.fields, 'popularServices')
if (popularServices.type !== 'array') throw new Error('Expected popular service cards')
const href = namedField(popularServices.fields, 'href') as TextField

const applyHooks = async (hooks: FieldHook[] | undefined, value: unknown, comingSoon: boolean) => {
  let result = value
  for (const hook of hooks ?? []) {
    result = await hook({ value: result, siblingData: { comingSoon } } as never)
  }
  return result
}

describe('sofa upholstery CMS contract', () => {
  it('shows the optional presentation group only for the sofa upholstery editor', () => {
    expect(landing.required).not.toBe(true)
    const condition = landing.admin?.condition
    expect(condition).toBeTypeOf('function')
    for (const slug of FIXED_SERVICE_SLUGS) {
      expect(condition?.({}, { slug }, {} as never)).toBe(slug === 'sofa-upholstery')
    }
    expect(condition?.({}, {}, {} as never)).toBe(false)
  })

  it('keeps the existing localized card, fabric, foam, and unlinked teaser contract', () => {
    const names = (fields: Field[]) => fields.map((field) => 'name' in field && field.name)
    expect(names(landing.fields)).toEqual([
      'popularServices',
      'fabricCards',
      'foamComfort',
      'bedTeaser',
    ])
    expect(names(popularServices.fields)).toEqual([
      'title',
      'description',
      'image',
      'ctaLabel',
      'href',
      'comingSoon',
    ])
    for (const name of ['title', 'description']) {
      expect(namedField(popularServices.fields, name)).toMatchObject({
        localized: true,
        required: true,
      })
    }
    expect(namedField(popularServices.fields, 'ctaLabel')).toMatchObject({ localized: true })
    expect(href.required).not.toBe(true)
    expect(namedField(popularServices.fields, 'comingSoon')).toMatchObject({
      type: 'checkbox',
      defaultValue: false,
    })

    const fabrics = namedField(landing.fields, 'fabricCards')
    if (fabrics.type !== 'array') throw new Error('Expected fabric cards')
    expect(names(fabrics.fields)).toEqual(['title', 'image', 'bestUse', 'comfort', 'durability'])
    for (const name of ['title', 'bestUse', 'comfort', 'durability']) {
      expect(namedField(fabrics.fields, name)).toMatchObject({ localized: true, required: true })
    }
    for (const fields of [popularServices.fields, fabrics.fields]) {
      expect(namedField(fields, 'image')).toMatchObject({
        type: 'upload',
        relationTo: 'media',
        required: true,
      })
    }

    const foam = namedField(landing.fields, 'foamComfort') as GroupField
    expect(names(foam.fields)).toEqual(['heading', 'copy', 'items', 'ctaLabel'])
    const items = namedField(foam.fields, 'items')
    if (items.type !== 'array') throw new Error('Expected foam bullets')
    expect(namedField(items.fields, 'text')).toMatchObject({ localized: true, required: true })

    const teaser = namedField(landing.fields, 'bedTeaser') as GroupField
    expect(names(teaser.fields)).toEqual(['title', 'description', 'label', 'image'])
    expect(namedField(teaser.fields, 'label')).toMatchObject({ defaultValue: 'Coming Soon' })
    expect(namedField(teaser.fields, 'image')).toMatchObject({
      type: 'upload',
      relationTo: 'media',
    })
  })

  it('bounds popular cards to 8–9, fabrics to 5–6, and foam bullets to six', () => {
    expect(popularServices).toMatchObject({ minRows: 8, maxRows: 9 })
    expect(namedField(landing.fields, 'fabricCards')).toMatchObject({ minRows: 5, maxRows: 6 })
    const foam = namedField(landing.fields, 'foamComfort') as GroupField
    expect(namedField(foam.fields, 'items')).toMatchObject({ maxRows: 6 })
  })

  it('requires meaningful alt text through the existing Media validation', async () => {
    const validate = Media.hooks!.beforeValidate![0]!
    for (const alt of [undefined, '', '   ']) {
      await expect(async () =>
        validate({
          data: { alt },
          operation: 'create',
          req: { user: { id: 1 } },
        } as never),
      ).rejects.toThrow(/meaningful alt text/)
    }
    expect(
      await validate({
        data: { alt: '  Upholstered corner sofa  ' },
        operation: 'create',
        req: { user: { id: 1 } },
      } as never),
    ).toMatchObject({ alt: 'Upholstered corner sofa' })
  })

  it('accepts optional internal card links and rejects external or unsafe links', async () => {
    expect(href.validate).toBeTypeOf('function')
    for (const value of [
      null,
      undefined,
      '',
      '/',
      '/sofa-repair/',
      '/projects/?type=sofa#gallery',
    ]) {
      expect(await href.validate?.(value as never, {} as never)).toBe(true)
    }
    for (const value of [
      'https://fixtures.example.test/',
      '//fixtures.example.test/',
      'javascript:alert(1)',
      'sofa-repair/',
      '/\\example.com/',
      ' /sofa-repair/',
      '/sofa-repair/\n',
    ]) {
      expect(await href.validate?.(value as never, {} as never)).toEqual(expect.any(String))
    }
  })

  it('clears links before saving coming-soon cards, including partial updates', async () => {
    expect(await applyHooks(href.hooks?.beforeValidate, '/bed-upholstery/', true)).toBeNull()
    expect(await applyHooks(href.hooks?.beforeValidate, '/sofa-repair/', false)).toBe(
      '/sofa-repair/',
    )
    expect(await applyHooks(href.hooks?.beforeValidate, undefined, true)).toBeNull()
  })

  it.each([
    '/bed-upholstery/',
    '/./bed-upholstery/',
    '/custom-sofa/../bed-upholstery/',
    '/custom-sofa/%2e%2e/bed-upholstery/?source=card#quote',
    '/%2E/bed-upholstery/',
    '/%62ed-upholstery/',
    '/%2562ed-upholstery/',
    '/custom-sofa/..//bed-upholstery/',
    '/BED-UPHOLSTERY',
  ])('rejects forbidden bed destinations after normalization: %s', async (value) => {
    expect(await href.validate?.(value as never, {} as never)).toEqual(expect.any(String))
  })

  it('keeps fixed service destinations usable, including dot-segment navigation to one', async () => {
    for (const slug of FIXED_SERVICE_SLUGS) {
      expect(await href.validate?.(`/${slug}/` as never, {} as never)).toBe(true)
    }
    expect(
      await href.validate?.('/custom-sofa/../sofa-repair/?source=card#quote' as never, {} as never),
    ).toBe(true)
  })

  it('retains the previous coming-soon state when an update omits that checkbox', async () => {
    const hook = href.hooks!.beforeValidate![0]!
    expect(
      await hook({
        value: '/bed-upholstery/',
        siblingData: {},
        previousSiblingDoc: { comingSoon: true },
      } as never),
    ).toBeNull()
    expect(
      await hook({
        value: '/sofa-repair/',
        siblingData: { comingSoon: false },
        previousSiblingDoc: { comingSoon: true },
      } as never),
    ).toBe('/sofa-repair/')
  })

  it('suppresses legacy coming-soon links when reading cards', async () => {
    expect(await applyHooks(href.hooks?.afterRead, '/bed-upholstery/', true)).toBeNull()
    expect(await applyHooks(href.hooks?.afterRead, '/sofa-repair/', false)).toBe('/sofa-repair/')
  })
})
