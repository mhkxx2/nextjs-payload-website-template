// @vitest-environment node

import { randomUUID } from 'node:crypto'

import type { CollectionConfig, Field, Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { FIXED_SERVICE_SLUGS, RESERVED_EXACT_ROUTES } from '@/lib/routes'

import { type IsolatedPayload, startIsolatedPayload } from './testPayload'

type NamedField = Field & { name: string }

const flattenFields = (fields: Field[]): NamedField[] => {
  const flattened: NamedField[] = []

  for (const field of fields) {
    if ('name' in field && typeof field.name === 'string') flattened.push(field as NamedField)
    if (field.type === 'tabs') {
      for (const tab of field.tabs) flattened.push(...flattenFields(tab.fields))
    }
    if (field.type === 'group' || field.type === 'array' || field.type === 'row' || field.type === 'collapsible') {
      flattened.push(...flattenFields(field.fields))
    }
  }

  return flattened
}

const fieldMap = (collection: CollectionConfig) =>
  new Map(flattenFields(collection.fields).map((field) => [field.name, field]))

let isolatedPayload: IsolatedPayload
let payload: Payload

beforeAll(async () => {
  isolatedPayload = await startIsolatedPayload('t6_content')
  payload = isolatedPayload.payload
}, 90_000)

afterAll(async () => {
  await isolatedPayload?.destroy()
}, 90_000)

describe('Task 6 content collection schemas', () => {
  it('registers services, projects, posts, and pages without replacing prior configuration', () => {
    const slugs = payload.config.collections.map(({ slug }) => slug)
    expect(slugs).toEqual(
      expect.arrayContaining([
        'services',
        'projects',
        'posts',
        'pages',
        'users',
        'media',
        'categories',
        'redirects',
        'forms',
        'form-submissions',
        'search',
      ]),
    )
    expect(payload.config.globals.map(({ slug }) => slug)).toEqual(['header', 'footer'])
  })

  it('models every independently editable service field group', () => {
    const fields = fieldMap(payload.config.collections.find(({ slug }) => slug === 'services')!)
    expect([...fields.keys()]).toEqual(
      expect.arrayContaining([
        'title',
        'slug',
        'summary',
        'hero',
        'details',
        'benefits',
        'materialsCapabilities',
        'process',
        'faqs',
        'serviceAreas',
        'projects',
        'testimonials',
        'gallery',
        'quotationContext',
        'whatsAppContext',
        'relatedServices',
        'status',
        'publishedAt',
        'seo',
        'createdBy',
        'updatedBy',
      ]),
    )
    expect(fields.get('slug')).toMatchObject({ index: true, required: true, unique: true })
    expect(fields.get('projects')).toMatchObject({ relationTo: 'projects', type: 'relationship' })
    expect(fields.get('relatedServices')).toMatchObject({ relationTo: 'services', type: 'relationship' })
  })

  it('accepts all and only the authoritative fixed service slugs and enforces uniqueness', async () => {
    const created: Array<number | string> = []
    try {
      for (const slug of FIXED_SERVICE_SLUGS) {
        const service = await payload.create({
          collection: 'services',
          context: { disableRevalidate: true },
          data: {
            seo: { canonicalURL: `https://alruknfurniture.ae/${slug}/` },
            slug: `  ${slug.toUpperCase()}  `,
            status: 'draft',
            title: `Service ${slug}`,
          },
          draft: false,
          overrideAccess: true,
        })
        created.push(service.id)
        expect(service.slug).toBe(slug)
      }

      await expect(
        payload.create({
          collection: 'services',
          context: { disableRevalidate: true },
          data: {
            seo: { canonicalURL: 'https://alruknfurniture.ae/not-an-approved-service/' },
            slug: 'not-an-approved-service',
            status: 'draft',
            title: 'Invalid service',
          },
          draft: false,
          overrideAccess: true,
        }),
      ).rejects.toThrow(/fixed service slug/i)

      await expect(
        payload.create({
          collection: 'services',
          context: { disableRevalidate: true },
          data: {
            seo: { canonicalURL: `https://alruknfurniture.ae/${FIXED_SERVICE_SLUGS[0]}/` },
            slug: FIXED_SERVICE_SLUGS[0],
            status: 'draft',
            title: 'Duplicate service',
          },
          draft: false,
          overrideAccess: true,
        }),
      ).rejects.toThrow()
    } finally {
      for (const id of created) {
        await payload.delete({
          collection: 'services',
          context: { disableRevalidate: true },
          id,
          overrideAccess: true,
        })
      }
    }
  }, 30_000)

  it('models the complete project contract', () => {
    const collection = payload.config.collections.find(({ slug }) => slug === 'projects')!
    const fields = fieldMap(collection)
    expect([...fields.keys()]).toEqual(
      expect.arrayContaining([
        'title',
        'slug',
        'summary',
        'cover',
        'gallery',
        'service',
        'category',
        'location',
        'completion',
        'narrative',
        'challenge',
        'solution',
        'featured',
        'status',
        'publishedAt',
        'seo',
        'createdBy',
        'updatedBy',
      ]),
    )
    expect(fields.get('service')).toMatchObject({ relationTo: 'services', type: 'relationship' })
    expect(fields.get('category')).toMatchObject({ relationTo: 'categories', type: 'relationship' })
    expect(collection.versions).toMatchObject({ drafts: { schedulePublish: true }, maxPerDoc: 50 })
    expect(collection.admin?.preview).toEqual(expect.any(Function))
  })

  it('preserves the approved post rich-text block set and models article fields', () => {
    const collection = payload.config.collections.find(({ slug }) => slug === 'posts')!
    const fields = fieldMap(collection)
    expect([...fields.keys()]).toEqual(
      expect.arrayContaining([
        'title',
        'slug',
        'excerpt',
        'heroImage',
        'authors',
        'categories',
        'services',
        'relatedPosts',
        'content',
        'status',
        'publishedAt',
        'seo',
        'createdBy',
        'updatedBy',
      ]),
    )
    expect(fields.get('authors')).toMatchObject({ hasMany: true, relationTo: 'users' })
    expect(fields.get('categories')).toMatchObject({ hasMany: true, relationTo: 'categories' })
    expect(fields.get('services')).toMatchObject({ hasMany: true, relationTo: 'services' })
    expect(JSON.stringify(fields.get('content'))).toContain('banner')
    expect(JSON.stringify(fields.get('content'))).toContain('code')
    expect(JSON.stringify(fields.get('content'))).toContain('mediaBlock')
    expect(collection.versions).toMatchObject({ drafts: { schedulePublish: true }, maxPerDoc: 50 })
    expect(collection.admin?.preview).toEqual(expect.any(Function))
  })

  it('uses only the approved page blocks and rejects every reserved route collision', async () => {
    const collection = payload.config.collections.find(({ slug }) => slug === 'pages')!
    const fields = fieldMap(collection)
    const layout = fields.get('layout') as NamedField & { blocks?: Array<{ slug: string }> }
    expect(layout.blocks?.map(({ slug }) => slug)).toEqual([
      'cta',
      'content',
      'mediaBlock',
      'archive',
      'formBlock',
    ])
    expect([...fields.keys()]).toEqual(
      expect.arrayContaining([
        'title',
        'slug',
        'layout',
        'status',
        'publishedAt',
        'seo',
        'createdBy',
        'updatedBy',
      ]),
    )
    expect(collection.versions).toMatchObject({ drafts: { schedulePublish: true }, maxPerDoc: 50 })
    expect(collection.admin?.preview).toEqual(expect.any(Function))

    for (const slug of RESERVED_EXACT_ROUTES) {
      await expect(
        payload.create({
          collection: 'pages',
          context: { disableRevalidate: true },
          data: { slug, title: `Reserved ${slug} ${randomUUID()}` } as never,
          draft: false,
          overrideAccess: true,
        }),
      ).rejects.toThrow()
    }

    await expect(
      payload.create({
        collection: 'pages',
        context: { disableRevalidate: true },
        data: {
          slug: 'projects',
          title: `Reserved projects ${randomUUID()}`,
        } as never,
        draft: false,
        overrideAccess: true,
      }),
    ).rejects.toThrow(/reserved/i)
  })
})
