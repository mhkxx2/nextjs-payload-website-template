import { describe, expect, it, vi } from 'vitest'

import { slugField } from '@/fields/slug'
import { normalizeSlug, validatePageSlug } from '@/lib/slug'

describe('slug normalization and validation', () => {
  it.each([
    [' Custom- Wardrobes/ ', 'custom-wardrobes'],
    ['/My   New---Page/', 'my-new-page'],
    ['ＦＵＬＬ　ＷＩＤＴＨ', 'full-width'],
    ['already-valid', 'already-valid'],
  ])('normalizes %s', (input, expected) => {
    expect(normalizeSlug(input)).toBe(expected)
  })

  it.each([' Custom- Wardrobes/ ', 'custom%2Fwardrobes', '../admin', ''])('rejects unsafe/empty %s', (slug) => {
    expect(validatePageSlug(slug)).not.toBe(true)
  })

  it.each(['our-process', 'furniture-care-101', 'room2room'])('accepts safe general slug %s', (slug) => {
    expect(validatePageSlug(slug)).toBe(true)
  })

  it('rejects case and normalization variants of protected slugs', () => {
    expect(validatePageSlug(' /ADMIN/ ')).not.toBe(true)
    expect(validatePageSlug('Custom   Wardrobes')).not.toBe(true)
  })

  it('configures a normalized, indexed, database-unique Payload field', () => {
    const field = slugField({ validateReserved: true })
    const slug = field.fields.find((candidate) => 'name' in candidate && candidate.name === 'slug')

    expect(slug).toMatchObject({ name: 'slug', type: 'text', index: true, unique: true })
    expect(slug && 'hooks' in slug ? slug.hooks?.beforeValidate : undefined).toHaveLength(1)
  })

  it('normalizes before validation and rejects a normalized duplicate', async () => {
    const field = slugField({ validateReserved: true })
    const slug = field.fields.find((candidate) => 'name' in candidate && candidate.name === 'slug')
    if (!slug || !('hooks' in slug) || !slug.hooks?.beforeValidate?.[0]) {
      throw new Error('Slug beforeValidate hook is missing')
    }

    const find = vi.fn().mockResolvedValue({ docs: [{ id: 41 }], totalDocs: 1 })
    const hook = slug.hooks.beforeValidate[0]
    const args = {
      collection: { slug: 'pages' },
      operation: 'create' as const,
      req: { payload: { find } },
      value: ' My   Page ',
    }

    await expect(hook(args as never)).rejects.toThrow(
      'The slug “my-page” is already in use. Please choose a different slug.',
    )
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'pages',
        limit: 1,
        overrideAccess: true,
        where: { slug: { equals: 'my-page' } },
      }),
    )
  })

  it('excludes the current document when checking an update', async () => {
    const field = slugField()
    const slug = field.fields.find((candidate) => 'name' in candidate && candidate.name === 'slug')
    if (!slug || !('hooks' in slug) || !slug.hooks?.beforeValidate?.[0]) {
      throw new Error('Slug beforeValidate hook is missing')
    }

    const find = vi.fn().mockResolvedValue({ docs: [], totalDocs: 0 })
    await expect(
      slug.hooks.beforeValidate[0](
        {
          collection: { slug: 'posts' },
          originalDoc: { id: 17 },
          operation: 'update',
          req: { payload: { find } },
          value: ' New Post ',
        } as never,
      ),
    ).resolves.toBe('new-post')

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { and: [{ slug: { equals: 'new-post' } }, { id: { not_equals: 17 } }] },
      }),
    )
  })

  it('returns an editor-readable error for a reserved normalized value before querying', async () => {
    const field = slugField({ validateReserved: true })
    const slug = field.fields.find((candidate) => 'name' in candidate && candidate.name === 'slug')
    if (!slug || !('hooks' in slug) || !slug.hooks?.beforeValidate?.[0]) {
      throw new Error('Slug beforeValidate hook is missing')
    }

    const find = vi.fn()
    await expect(
      slug.hooks.beforeValidate[0](
        {
          collection: { slug: 'pages' },
          operation: 'create',
          req: { payload: { find } },
          value: ' Custom   Wardrobes ',
        } as never,
      ),
    ).rejects.toThrow(/reserved/i)
    expect(find).not.toHaveBeenCalled()
  })
})
