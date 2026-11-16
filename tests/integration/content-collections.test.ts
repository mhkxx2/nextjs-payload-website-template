// @vitest-environment node

import { randomUUID } from 'node:crypto'

import type { CollectionConfig, Field, Payload } from 'payload'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { FIXED_SERVICE_SLUGS, RESERVED_EXACT_ROUTES } from '@/lib/routes'
import type { User } from '@/payload-types'

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
let auditActor: Awaited<ReturnType<Payload['create']>>
let auditOtherUser: Awaited<ReturnType<Payload['create']>>

beforeAll(async () => {
  isolatedPayload = await startIsolatedPayload('t6_content')
  payload = isolatedPayload.payload
  auditActor = await payload.create({
    collection: 'users',
    data: { email: `audit-actor-${randomUUID()}@example.invalid`, password: randomUUID() },
    overrideAccess: true,
  })
  auditOtherUser = await payload.create({
    collection: 'users',
    data: { email: `audit-other-${randomUUID()}@example.invalid`, password: randomUUID() },
    overrideAccess: true,
  })
}, 90_000)

afterAll(async () => {
  if (payload && auditActor) {
    await payload.delete({ collection: 'users', id: auditActor.id, overrideAccess: true }).catch(() => undefined)
  }
  if (payload && auditOtherUser) {
    await payload.delete({ collection: 'users', id: auditOtherUser.id, overrideAccess: true }).catch(() => undefined)
  }
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
    expect(payload.config.globals.map(({ slug }) => slug)).toEqual([
      'homepage',
      'about-page',
      'contact-page',
      'archive-settings',
      'site-settings',
      'google-reviews',
      'header',
      'footer',
      'contact-information',
      'seo-defaults',
      'social-media',
    ])
  })

  it('shares field-level audit write denial across all content collections', async () => {
    const policies = []
    for (const slug of ['services', 'projects', 'posts', 'pages']) {
      const fields = fieldMap(payload.config.collections.find((collection) => collection.slug === slug)!)
      for (const name of ['createdBy', 'updatedBy']) {
        const field = fields.get(name)
        const access = field && 'access' in field ? field.access : undefined
        expect(access?.create).toEqual(expect.any(Function))
        expect(access?.update).toEqual(expect.any(Function))
        expect(await access?.create?.({ req: { user: auditActor } } as never)).toBe(false)
        expect(await access?.update?.({ req: { user: auditActor } } as never)).toBe(false)
        policies.push(access?.create, access?.update)
      }
    }
    expect(new Set(policies)).toHaveLength(1)
  })

  it('rejects authenticated audit-field tampering while trusted hooks assign and preserve ownership', async () => {
    const relationID = (value: unknown): number | string | undefined =>
      typeof value === 'object' && value !== null && 'id' in value
        ? (value as { id: number | string }).id
        : typeof value === 'number' || typeof value === 'string'
          ? value
          : undefined

    const slug = `audit-${randomUUID().slice(0, 8)}`
    const created = await payload.create({
      collection: 'projects',
      context: { disableRevalidate: true },
      data: {
        createdBy: auditOtherUser.id,
        seo: { canonicalURL: `https://alruknfurniture.ae/projects/${slug}/` },
        slug,
        status: 'draft',
        title: 'Audit tampering regression',
        updatedBy: auditOtherUser.id,
      },
      draft: false,
      overrideAccess: false,
      user: auditActor,
    })

    expect(relationID(created.createdBy)).toBe(auditActor.id)
    expect(relationID(created.updatedBy)).toBe(auditActor.id)

    const updated = await payload.update({
      collection: 'projects',
      context: { disableRevalidate: true },
      data: { createdBy: auditOtherUser.id, updatedBy: auditActor.id },
      id: created.id,
      overrideAccess: false,
      user: auditOtherUser,
    })

    expect(relationID(updated.createdBy)).toBe(auditActor.id)
    expect(relationID(updated.updatedBy)).toBe(auditOtherUser.id)

    const legacySlug = `audit-legacy-${randomUUID().slice(0, 8)}`
    const legacy = await payload.create({
      collection: 'projects',
      context: { disableRevalidate: true },
      data: {
        seo: { canonicalURL: `https://alruknfurniture.ae/projects/${legacySlug}/` },
        slug: legacySlug,
        status: 'draft',
        title: 'Legacy audit regression',
      },
      draft: false,
      overrideAccess: true,
    })
    const legacyUpdated = await payload.update({
      collection: 'projects',
      context: { disableRevalidate: true },
      data: { createdBy: auditOtherUser.id, updatedBy: auditOtherUser.id },
      id: legacy.id,
      overrideAccess: false,
      user: auditActor,
    })

    expect(relationID(legacyUpdated.createdBy)).toBeUndefined()
    expect(relationID(legacyUpdated.updatedBy)).toBe(auditActor.id)

    for (const id of [created.id, legacy.id]) {
      await payload.delete({
        collection: 'projects',
        context: { disableRevalidate: true },
        id,
        overrideAccess: true,
      })
    }
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

  it('persists the sofa model with informative Media, bounded arrays, and unlinked coming-soon cards', async () => {
    const buffer = await sharp({
      create: { background: '#967259', channels: 3, height: 6, width: 8 },
    }).png().toBuffer()
    const upload = (alt: string) => payload.create({
      collection: 'media',
      context: { disableRevalidate: true },
      data: {
        alt, decorative: false, uploadedBy: auditActor.id,
        license: 'Locally generated test fixture', sourceURL: 'https://example.invalid/sofa-fixture',
      },
      file: { data: buffer, mimetype: 'image/png', name: `sofa-${randomUUID()}.png`, size: buffer.length },
      overrideAccess: true,
      user: auditActor as User,
    })
    await expect(upload('   ')).rejects.toThrow(/meaningful alt text/)
    const image = await upload('Upholstered corner sofa')
    let serviceID: number | undefined
    const popularServices = Array.from({ length: 8 }, (_, index) => ({
      description: 'Replace upholstery fabric', image: image.id, title: `Sofa option ${index + 1}`,
      href: '/sofa-repair/',
    }))
    const fabricCards = Array.from({ length: 5 }, (_, index) => ({
      bestUse: 'Everyday seating', comfort: 'Soft texture', durability: 'Discuss with our team',
      image: image.id, title: `Fabric ${index + 1}`,
    }))
    try {
      const created = await payload.create({
        collection: 'services',
        context: { disableRevalidate: true },
        data: {
          title: 'Sofa CMS contract', slug: 'sofa-upholstery', status: 'draft',
          seo: { canonicalURL: 'https://alruknfurniture.ae/sofa-upholstery/' },
          sofaUpholsteryLanding: {
            popularServices: popularServices.map((card, index) => index === 7
              ? { ...card, comingSoon: true, href: '/bed-upholstery/' }
              : card),
            fabricCards,
            foamComfort: { items: [{ text: 'Renew tired foam' }] },
            bedTeaser: { title: 'Bed Upholstery', image: image.id },
          },
        },
        depth: 1,
        draft: false,
        overrideAccess: true,
      })
      serviceID = created.id
      const cards = created.sofaUpholsteryLanding!.popularServices!
      expect(cards[0]!.href).toBe('/sofa-repair/')
      expect(cards[7]!.href).toBeNull()
      expect(cards[0]!.image).toMatchObject({ alt: 'Upholstered corner sofa' })
      expect(created.sofaUpholsteryLanding!.bedTeaser).toMatchObject({ label: 'Coming Soon' })

      const update = (sofaUpholsteryLanding: Partial<NonNullable<typeof created.sofaUpholsteryLanding>>) =>
        payload.update({
          collection: 'services', context: { disableRevalidate: true }, id: created.id,
          data: { sofaUpholsteryLanding }, overrideAccess: true,
        })
      await expect(update({ popularServices: popularServices.map((card, index) => index === 0
        ? { ...card, href: 'https://fixtures.example.test/' } : card) })).rejects.toThrow()
      for (const count of [7, 10]) {
        await expect(update({ popularServices: Array.from({ length: count }, () => popularServices[0]!) })).rejects.toThrow()
      }
      for (const count of [4, 7]) {
        await expect(update({ fabricCards: Array.from({ length: count }, () => fabricCards[0]!) })).rejects.toThrow()
      }
      await expect(update({ foamComfort: { items: Array.from({ length: 7 }, () => ({ text: 'Foam option' })) } })).rejects.toThrow()
      const upperLimits = await update({
        popularServices: [...popularServices, popularServices[0]!],
        fabricCards: [...fabricCards, fabricCards[0]!],
        foamComfort: { items: Array.from({ length: 6 }, () => ({ text: 'Foam option' })) },
      })
      expect(upperLimits.sofaUpholsteryLanding!.popularServices).toHaveLength(9)
      expect(upperLimits.sofaUpholsteryLanding!.fabricCards).toHaveLength(6)
      const toggled = await update({ popularServices: upperLimits.sofaUpholsteryLanding!.popularServices!.map(
        (card, index) => index === 0 ? { ...card, comingSoon: true } : card,
      ) })
      expect(toggled.sofaUpholsteryLanding!.popularServices![0]!.href).toBeNull()
      const partialUpdate = await update({
        popularServices: toggled.sofaUpholsteryLanding!.popularServices!.map((card, index) => index === 0
          ? { ...card, comingSoon: undefined, href: '/bed-upholstery/' } : card),
      })
      expect(partialUpdate.sofaUpholsteryLanding!.popularServices![0]!.href).toBeNull()
      const read = await payload.findByID({ collection: 'services', id: created.id, overrideAccess: true })
      expect(read.sofaUpholsteryLanding!.popularServices![0]!.href).toBeNull()
    } finally {
      if (serviceID) await payload.delete({
        collection: 'services', context: { disableRevalidate: true }, id: serviceID, overrideAccess: true,
      })
      await payload.delete({ collection: 'media', context: { disableRevalidate: true }, id: image.id, overrideAccess: true })
    }
  }, 30_000)

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
    expect(JSON.stringify(fields.get('content'))).toContain('media')
    expect(collection.versions).toMatchObject({ drafts: { schedulePublish: true }, maxPerDoc: 50 })
    expect(collection.admin?.preview).toEqual(expect.any(Function))
  })

  it('uses only the approved page blocks and rejects every reserved route collision', async () => {
    const collection = payload.config.collections.find(({ slug }) => slug === 'pages')!
    const fields = fieldMap(collection)
    const layout = fields.get('layout') as NamedField & { blocks?: Array<{ slug: string }> }
    expect(layout.blocks?.map(({ slug }) => slug)).toEqual([
      'hero',
      'richContent',
      'media',
      'splitContent',
      'serviceGrid',
      'projectGallery',
      'benefits',
      'processSteps',
      'testimonials',
      'faqs',
      'locationCoverage',
      'statistics',
      'callToAction',
      'quoteForm',
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
