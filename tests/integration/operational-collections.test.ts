// @vitest-environment node

import { randomUUID } from 'node:crypto'
import path from 'node:path'

import type { CollectionConfig, Field, Payload, RequiredDataFromCollectionSlug } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { denyAuditFieldWrite } from '@/fields/contentAudit'
import { createControlledLead } from '@/server/leads/createControlledLead'

import { type IsolatedPayload, startIsolatedPayload } from './testPayload'

type NamedField = Field & { name: string }

const flattenFields = (fields: Field[]): NamedField[] => {
  const result: NamedField[] = []
  for (const field of fields) {
    if ('name' in field && typeof field.name === 'string') result.push(field as NamedField)
    if (field.type === 'array' || field.type === 'collapsible' || field.type === 'group' || field.type === 'row') {
      result.push(...flattenFields(field.fields))
    }
    if (field.type === 'tabs') {
      for (const tab of field.tabs) result.push(...flattenFields(tab.fields))
    }
  }
  return result
}

const fieldsFor = (collection: CollectionConfig) =>
  new Map(flattenFields(collection.fields).map((field) => [field.name, field]))

const relationID = (value: unknown): number | string | undefined =>
  typeof value === 'object' && value !== null && 'id' in value
    ? (value as { id: number | string }).id
    : typeof value === 'number' || typeof value === 'string'
      ? value
      : undefined

let isolatedPayload: IsolatedPayload
let payload: Payload
let actor: Awaited<ReturnType<Payload['create']>>
let otherActor: Awaited<ReturnType<Payload['create']>>
let serviceID: number

const leadData = (overrides: Record<string, unknown> = {}): RequiredDataFromCollectionSlug<'leads'> =>
  ({
    abuseContextHash: 'sha256:14b9555ebdf9375668e347216f44e31cd27417bdf4d61bb396275cf6425ed140',
    area: 'Dubai Marina',
    consent: true,
    consentAt: '2026-09-14T09:00:00.000Z',
    email: 'lead@example.invalid',
    fullName: 'Private Lead',
    message: 'Please contact me about a custom project.',
    phone: '+971551224902',
    service: serviceID,
    sourcePath: '/custom-furniture/?campaign=fall',
    sourceTitle: 'Custom Furniture',
    ...overrides,
  }) as RequiredDataFromCollectionSlug<'leads'>

beforeAll(async () => {
  isolatedPayload = await startIsolatedPayload('t7_ops')
  payload = isolatedPayload.payload
  actor = await payload.create({
    collection: 'users',
    data: { email: `t7-actor-${randomUUID()}@example.invalid`, password: randomUUID() },
    overrideAccess: true,
  })
  otherActor = await payload.create({
    collection: 'users',
    data: { email: `t7-other-${randomUUID()}@example.invalid`, password: randomUUID() },
    overrideAccess: true,
  })
  const service = await payload.create({
    collection: 'services',
    context: { disableRevalidate: true },
    data: {
      seo: { canonicalURL: 'https://alruknfurniture.ae/custom-furniture/' },
      slug: 'custom-furniture',
      status: 'draft',
      title: 'Custom Furniture',
    },
    draft: false,
    overrideAccess: true,
  })
  serviceID = Number(service.id)
}, 90_000)

afterAll(async () => {
  await isolatedPayload?.destroy()
}, 90_000)

describe('Task 7 operational collection schemas', () => {
  it('registers FAQs, testimonials, private leads, portfolio items, and the owned redirects collection', () => {
    const slugs = payload.config.collections.map(({ slug }) => slug)
    expect(slugs).toEqual(expect.arrayContaining([
      'faqs',
      'testimonials',
      'leads',
      'portfolio-items',
      'redirects',
    ]))
    expect(slugs.filter((slug) => slug === 'redirects')).toHaveLength(1)
  })

  it('models FAQ publication and schema-eligibility guidance with typed service relations', () => {
    const collection = payload.config.collections.find(({ slug }) => slug === 'faqs')!
    const fields = fieldsFor(collection)
    expect([...fields.keys()]).toEqual(
      expect.arrayContaining([
        'question',
        'answer',
        'services',
        'group',
        'order',
        'schemaEligible',
        'status',
        'publishedAt',
        'createdBy',
        'updatedBy',
      ]),
    )
    expect(fields.get('services')).toMatchObject({ hasMany: true, relationTo: 'services', type: 'relationship' })
    expect(fields.get('schemaEligible')).toMatchObject({ defaultValue: false, type: 'checkbox' })
    expect((fields.get('schemaEligible')?.admin as { description?: unknown })?.description).toMatch(
      /visible.*page.*question.*answer/i,
    )
  })

  it('models testimonial evidence, optional genuine rating, and content relationships', () => {
    const collection = payload.config.collections.find(({ slug }) => slug === 'testimonials')!
    const fields = fieldsFor(collection)
    expect([...fields.keys()]).toEqual(
      expect.arrayContaining([
        'statement',
        'displayName',
        'rating',
        'location',
        'service',
        'project',
        'featured',
        'verificationNote',
        'verifiedAt',
        'status',
        'publishedAt',
      ]),
    )
    expect(fields.get('rating')).toMatchObject({ max: 5, min: 1, required: false })
    expect(fields.get('service')).toMatchObject({ relationTo: 'services', type: 'relationship' })
    expect(fields.get('project')).toMatchObject({ relationTo: 'projects', type: 'relationship' })
    const verificationNote = fields.get('verificationNote')
    const verifiedAt = fields.get('verifiedAt')
    expect(verificationNote && 'access' in verificationNote && verificationNote.access?.read).toBeTypeOf(
      'function',
    )
    expect(verifiedAt && 'access' in verifiedAt && verifiedAt.access?.read).toBeTypeOf('function')
  })

  it('migrates Task 6 Service FAQ/testimonial JSON IDs to typed relationships', () => {
    const fields = fieldsFor(payload.config.collections.find(({ slug }) => slug === 'services')!)
    expect(fields.get('faqs')).toMatchObject({ hasMany: true, relationTo: 'faqs', type: 'relationship' })
    expect(fields.get('testimonials')).toMatchObject({
      hasMany: true,
      relationTo: 'testimonials',
      type: 'relationship',
    })
  })

  it('models the complete private Lead context with immutable trusted audit fields', () => {
    const fields = fieldsFor(payload.config.collections.find(({ slug }) => slug === 'leads')!)
    expect([...fields.keys()]).toEqual(
      expect.arrayContaining([
        'fullName',
        'phone',
        'area',
        'email',
        'service',
        'message',
        'referenceMedia',
        'portfolioItem',
        'portfolioDesignTitle',
        'consent',
        'consentAt',
        'sourcePath',
        'sourceTitle',
        'projectContext',
        'referrer',
        'utmSource',
        'utmMedium',
        'utmCampaign',
        'utmTerm',
        'utmContent',
        'status',
        'submittedAt',
        'statusUpdatedAt',
        'statusAudit',
        'changedBy',
        'abuseContextHash',
      ]),
    )
    expect(fields.get('service')).toMatchObject({ relationTo: 'services', type: 'relationship' })
    expect(fields.get('referenceMedia')).toMatchObject({ relationTo: 'lead-media', type: 'upload' })
    expect(fields.get('portfolioItem')).toMatchObject({ relationTo: 'portfolio-items', type: 'relationship' })
    expect(fields.get('changedBy')).toMatchObject({ relationTo: 'users', required: true, type: 'relationship' })
    for (const name of ['submittedAt', 'statusUpdatedAt', 'statusAudit']) {
      const field = fields.get(name)
      const access = field && 'access' in field ? field.access : undefined
      expect(access?.create).toBe(denyAuditFieldWrite)
      expect(access?.update).toBe(denyAuditFieldWrite)
    }
  })

  it('publishes editable portfolio inspiration without treating it as project work', async () => {
    const source = path.resolve(process.cwd(), 'src/seed/assets/service-custom-furniture.jpg')
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: 'Neutral custom furniture arrangement in a modern interior',
        decorative: false,
        license: 'Company-owned source asset',
        sourceSite: 'eco-furniture.ae',
        sourceURL: 'https://eco-furniture.ae/wp-content/uploads/test/portfolio-sample.jpg',
        uploadedBy: actor.id,
      },
      filePath: source,
      overrideAccess: true,
      user: actor,
    })
    const published = await payload.create({
      collection: 'portfolio-items',
      data: {
        coverImage: media.id,
        furnitureType: 'sofas',
        isRealAlRuknProject: false,
        originalFilename: 'portfolio-sample.jpg',
        published: true,
        relatedService: serviceID,
        roomCategory: 'living-room',
        sortOrder: 1,
        slug: `portfolio-published-${randomUUID().slice(0, 8)}`,
        sourceCategory: 'Sofa',
        sourceSite: 'eco-furniture.ae',
        sourceURL: `https://eco-furniture.ae/product/${randomUUID()}/`,
        title: 'Modern Neutral Sofa',
      },
      draft: false,
      overrideAccess: true,
    })
    const unpublished = await payload.create({
      collection: 'portfolio-items',
      data: {
        coverImage: media.id,
        furnitureType: 'sofas',
        isRealAlRuknProject: false,
        originalFilename: 'portfolio-sample.jpg',
        published: false,
        relatedService: serviceID,
        roomCategory: 'living-room',
        sortOrder: 2,
        slug: `portfolio-draft-${randomUUID().slice(0, 8)}`,
        sourceCategory: 'Sofa',
        sourceSite: 'eco-furniture.ae',
        sourceURL: `https://eco-furniture.ae/product/${randomUUID()}/`,
        title: 'Unpublished Sofa Inspiration',
      },
      draft: false,
      overrideAccess: true,
    })

    const publicItems = await payload.find({ collection: 'portfolio-items', depth: 0, limit: 10, overrideAccess: false })
    expect(publicItems.docs.map((item) => item.id)).toContain(published.id)
    expect(publicItems.docs.map((item) => item.id)).not.toContain(unpublished.id)
    expect(published.isRealAlRuknProject).toBe(false)

    await payload.delete({ collection: 'portfolio-items', id: published.id, overrideAccess: true })
    await payload.delete({ collection: 'portfolio-items', id: unpublished.id, overrideAccess: true })
    await payload.delete({ collection: 'media', id: media.id, overrideAccess: true })
  })

  it('reuses shared audit write denial for FAQ and testimonial ownership', async () => {
    for (const slug of ['faqs', 'testimonials']) {
      const fields = fieldsFor(payload.config.collections.find(({ slug: candidate }) => candidate === slug)!)
      for (const name of ['createdBy', 'updatedBy']) {
        const field = fields.get(name)
        const access = field && 'access' in field ? field.access : undefined
        expect(access?.create).toBe(denyAuditFieldWrite)
        expect(access?.update).toBe(denyAuditFieldWrite)
        expect(await access?.create?.({ req: { user: actor } } as never)).toBe(false)
      }
    }
  })
})

describe('FAQ and testimonial publication integrity', () => {
  it('enforces all three public publication predicates for FAQs', async () => {
    const token = randomUUID().slice(0, 8)
    const past = '2026-01-01T00:00:00.000Z'
    const future = '2099-01-01T00:00:00.000Z'
    await payload.create({
      collection: 'faqs',
      context: { disableRevalidate: true },
      data: { _status: 'published', answer: 'Live answer', group: 'general', order: 0, publishedAt: past, question: `Live ${token}`, status: 'published' },
      draft: false,
      overrideAccess: true,
    })
    await payload.create({
      collection: 'faqs',
      context: { disableRevalidate: true },
      data: { _status: 'published', answer: 'Domain draft', group: 'general', order: 0, publishedAt: past, question: `Domain draft ${token}`, status: 'draft' },
      draft: false,
      overrideAccess: true,
    })
    await payload.create({
      collection: 'faqs',
      context: { disableRevalidate: true },
      data: { _status: 'published', answer: 'Future answer', group: 'general', order: 0, publishedAt: future, question: `Future ${token}`, status: 'published' },
      draft: false,
      overrideAccess: true,
    })
    await payload.create({
      collection: 'faqs',
      context: { disableRevalidate: true },
      data: { _status: 'draft', answer: 'Payload draft', group: 'general', order: 0, publishedAt: past, question: `Payload draft ${token}`, status: 'published' },
      draft: true,
      overrideAccess: true,
    })

    const result = await payload.find({
      collection: 'faqs',
      overrideAccess: false,
      pagination: false,
      where: { question: { contains: token } },
    })
    expect(result.docs.map(({ question }) => question)).toEqual([`Live ${token}`])
  })

  it('blocks testimonial publication without both consent/verification note and date', async () => {
    const base = {
      _status: 'published' as const,
      displayName: 'Verified Customer',
      featured: false,
      location: null,
      publishedAt: '2026-01-01T00:00:00.000Z',
      project: null,
      rating: null,
      service: null,
      statement: 'Approved statement',
      status: 'published' as const,
    }
    await expect(
      payload.create({ collection: 'testimonials', data: base, draft: false, overrideAccess: true }),
    ).rejects.toThrow(/verification note.*date/i)
    await expect(
      payload.create({
        collection: 'testimonials',
        data: { ...base, verificationNote: 'Written consent retained.' },
        draft: false,
        overrideAccess: true,
      }),
    ).rejects.toThrow(/verification note.*date/i)

    const published = await payload.create({
      collection: 'testimonials',
      context: { disableRevalidate: true },
      data: {
        ...base,
        verificationNote: 'Written consent retained in the approved source record.',
        verifiedAt: '2026-01-02T00:00:00.000Z',
      },
      draft: false,
      overrideAccess: true,
    })
    expect(published.status).toBe('published')
  })

  it.each([
    ['verificationNote', { verificationNote: null }],
    ['verifiedAt', { verifiedAt: null }],
    ['both evidence fields', { verificationNote: null, verifiedAt: null }],
  ])('rejects clearing %s from an already-published testimonial', async (_label, data) => {
    const published = await payload.create({
      collection: 'testimonials',
      context: { disableRevalidate: true },
      data: {
        _status: 'published',
        displayName: 'Evidence retained',
        featured: false,
        publishedAt: '2026-01-01T00:00:00.000Z',
        statement: 'Approved statement',
        status: 'published',
        verificationNote: 'Written consent retained.',
        verifiedAt: '2026-01-02T00:00:00.000Z',
      },
      draft: false,
      overrideAccess: true,
    })

    await expect(
      payload.update({
        collection: 'testimonials',
        context: { disableRevalidate: true },
        data,
        draft: false,
        id: published.id,
        overrideAccess: true,
      }),
    ).rejects.toThrow(/verification note.*date/i)
  })

  it('omits internal testimonial evidence from anonymous reads', async () => {
    const testimonial = await payload.create({
      collection: 'testimonials',
      context: { disableRevalidate: true },
      data: {
        _status: 'published',
        displayName: 'Public Customer',
        featured: false,
        publishedAt: '2026-01-01T00:00:00.000Z',
        statement: 'Public approved statement',
        status: 'published',
        verificationNote: 'Private evidence reference.',
        verifiedAt: '2026-01-02T00:00:00.000Z',
      },
      draft: false,
      overrideAccess: true,
    })

    const anonymous = await payload.findByID({
      collection: 'testimonials',
      id: testimonial.id,
      overrideAccess: false,
    })
    expect(anonymous).not.toHaveProperty('verificationNote')
    expect(anonymous).not.toHaveProperty('verifiedAt')

    const authenticated = await payload.findByID({
      collection: 'testimonials',
      id: testimonial.id,
      overrideAccess: false,
      user: actor,
    })
    expect(authenticated).toMatchObject({
      verificationNote: 'Private evidence reference.',
      verifiedAt: expect.any(String),
    })
  })
})

describe('private controlled Leads and audited status workflow', () => {
  it('stores the complete private submission context and always starts server submissions at new', async () => {
    const lead = await createControlledLead(payload, leadData({
      projectContext: 'Villa living room',
      referrer: 'https://example.invalid/referral',
      status: 'won',
      statusAudit: [{ changedAt: '2000-01-01T00:00:00.000Z', from: 'new', to: 'won' }],
      utmCampaign: 'autumn',
      utmContent: 'hero',
      utmMedium: 'paid-social',
      utmSource: 'instagram',
      utmTerm: 'custom-sofa',
    }))

    expect(lead).toMatchObject({
      abuseContextHash: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
      consent: true,
      consentAt: expect.any(String),
      email: 'lead@example.invalid',
      fullName: 'Private Lead',
      message: expect.any(String),
      projectContext: 'Villa living room',
      sourcePath: '/custom-furniture/?campaign=fall',
      sourceTitle: 'Custom Furniture',
      status: 'new',
      submittedAt: expect.any(String),
      statusUpdatedAt: expect.any(String),
      utmCampaign: 'autumn',
      utmContent: 'hero',
      utmMedium: 'paid-social',
      utmSource: 'instagram',
      utmTerm: 'custom-sofa',
    })
    expect(relationID(lead.service)).toBe(serviceID)
    expect(lead.phone).toBe('+971551224902')
    expect(lead.referrer).toBe('https://example.invalid/referral')
    expect(lead.statusAudit).toEqual([])

    await expect(
      createControlledLead(payload, leadData({ abuseContextHash: '203.0.113.10' })),
    ).rejects.toThrow(/invalid: Abuse Context Hash/i)
  })

  it('denies every anonymous operation and rejects direct/bypass Local API creation', async () => {
    const controlled = await createControlledLead(payload, leadData({ email: 'private@example.invalid' }))

    await expect(payload.find({ collection: 'leads', overrideAccess: false })).rejects.toThrow()
    await expect(payload.findByID({ collection: 'leads', id: controlled.id, overrideAccess: false })).rejects.toThrow()
    await expect(
      payload.create({ collection: 'leads', data: leadData(), overrideAccess: false }),
    ).rejects.toThrow()
    await expect(
      payload.create({
        collection: 'leads',
        context: { internalLeadCreateCapability: 'internal-lead-create' },
        data: leadData(),
        overrideAccess: false,
      }),
    ).rejects.toThrow()
    await expect(
      payload.update({ collection: 'leads', data: { status: 'contacted' }, id: controlled.id, overrideAccess: false }),
    ).rejects.toThrow()
    await expect(payload.delete({ collection: 'leads', id: controlled.id, overrideAccess: false })).rejects.toThrow()
  })

  it('enforces the exact legal graph and records authenticated accountability', async () => {
    const lead = await createControlledLead(payload, leadData({ email: 'workflow@example.invalid' }))

    const contacted = await payload.update({
      collection: 'leads',
      data: { status: 'contacted', statusAudit: [{ from: 'new', to: 'won' }] },
      id: lead.id,
      overrideAccess: false,
      user: actor,
    })
    expect(contacted.status).toBe('contacted')
    expect(contacted.statusAudit).toHaveLength(1)
    expect(contacted.statusAudit?.[0]).toMatchObject({
      changedAt: expect.any(String),
      changedBy: expect.objectContaining({ id: actor.id }),
      from: 'new',
      to: 'contacted',
    })

    await expect(
      payload.update({
        collection: 'leads',
        data: { status: 'won' },
        id: lead.id,
        overrideAccess: false,
        user: actor,
      }),
    ).rejects.toThrow(/illegal lead status transition/i)

    const quoted = await payload.update({
      collection: 'leads',
      data: { status: 'quotation-sent' },
      id: lead.id,
      overrideAccess: false,
      user: otherActor,
    })
    expect(quoted.statusAudit).toHaveLength(2)
    expect(quoted.statusAudit?.[1]).toMatchObject({
      changedBy: expect.objectContaining({ id: otherActor.id }),
      from: 'contacted',
      to: 'quotation-sent',
    })

    const won = await payload.update({
      collection: 'leads',
      data: { status: 'won' },
      id: lead.id,
      overrideAccess: false,
      user: actor,
    })
    expect(won.statusAudit).toHaveLength(3)
    await expect(
      payload.update({
        collection: 'leads',
        data: { status: 'lost' },
        id: lead.id,
        overrideAccess: false,
        user: actor,
      }),
    ).rejects.toThrow(/illegal lead status transition/i)

    const losingLead = await createControlledLead(payload, leadData({ email: 'lost-workflow@example.invalid' }))
    for (const status of ['contacted', 'quotation-sent', 'lost'] as const) {
      await payload.update({
        collection: 'leads',
        data: { status },
        id: losingLead.id,
        overrideAccess: false,
        user: actor,
      })
    }
    const lost = await payload.findByID({
      collection: 'leads',
      id: losingLead.id,
      overrideAccess: false,
      user: actor,
    })
    expect(lost.status).toBe('lost')
    expect(lost.statusAudit?.map(({ from, to }) => `${from}->${to}`)).toEqual([
      'new->contacted',
      'contacted->quotation-sent',
      'quotation-sent->lost',
    ])
    await expect(
      payload.update({
        collection: 'leads',
        data: { status: 'won' },
        id: losingLead.id,
        overrideAccess: false,
        user: actor,
      }),
    ).rejects.toThrow(/illegal lead status transition/i)
  })

  it('requires an authenticated actor for any status change even under elevated Local API access', async () => {
    const lead = await createControlledLead(payload, leadData({ email: 'accountability@example.invalid' }))
    await expect(
      payload.update({
        collection: 'leads',
        data: { status: 'contacted' },
        id: lead.id,
        overrideAccess: true,
      }),
    ).rejects.toThrow(/authenticated staff actor/i)
  })
})
