// @vitest-environment node

import { randomUUID } from 'node:crypto'

import type { Field, GlobalConfig, Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { phoneHref, whatsappHref } from '@/lib/contactLinks'
import { FIXED_SERVICE_SLUGS } from '@/lib/routes'

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

const configFor = (slug: string): GlobalConfig => {
  const config = payload.config.globals.find((candidate) => candidate.slug === slug)
  if (!config) throw new Error(`Missing global ${slug}`)
  return config
}

const fieldMap = (slug: string) =>
  new Map(flattenFields(configFor(slug).fields).map((field) => [field.name, field]))

const siteSettingsData = (canonicalSiteURL: string) => ({
  brandName: 'Al Rukn Furniture',
  businessName: 'Al Rukn Furniture',
  canonicalSiteURL,
})

let isolatedPayload: IsolatedPayload
let payload: Payload
let actor: Awaited<ReturnType<Payload['create']>>

beforeAll(async () => {
  isolatedPayload = await startIsolatedPayload('t8_globals')
  payload = isolatedPayload.payload
  actor = await payload.create({
    collection: 'users',
    data: { email: `globals-${randomUUID()}@example.invalid`, password: randomUUID() },
    overrideAccess: true,
  })
}, 90_000)

afterAll(async () => {
  await isolatedPayload?.destroy()
}, 90_000)

describe('Task 8 editable site globals', () => {
  it('registers exactly the six public presentation globals', () => {
    expect(payload.config.globals.map(({ slug }) => slug)).toEqual([
      'site-settings',
      'header',
      'footer',
      'contact-information',
      'seo-defaults',
      'social-media',
    ])
  })

  it.each([
    ['site-settings', ['businessName', 'brandName', 'logo', 'logoDark', 'favicon', 'quotationLabels', 'whatsAppCopy', 'locale', 'canonicalSiteURL', 'announcement', 'presentation']],
    ['header', ['navigation', 'serviceLinks', 'conversionActions', 'mobileNavigation']],
    ['footer', ['navigationGroups', 'serviceLinks', 'legalLinks', 'supportingCopy', 'conversionContent']],
    ['contact-information', ['phoneE164', 'whatsappE164', 'whatsappAvailable', 'email', 'address', 'mapURL', 'openingHours', 'serviceAreas']],
    ['seo-defaults', ['titlePattern', 'fallbackDescription', 'socialImage', 'index', 'follow', 'organizationSchema', 'localBusinessSchema']],
    ['social-media', ['links', 'network', 'label', 'url']],
  ] as const)('models the complete bounded %s contract', (slug, expectedFields) => {
    const fields = fieldMap(slug)
    expect([...fields.keys()]).toEqual(expect.arrayContaining([...expectedFields]))
  })

  it('allows anonymous reads but requires authentication for every global write', async () => {
    for (const config of payload.config.globals) {
      expect(await config.access?.read?.({ req: { user: null } } as never)).toBe(true)
      expect(await config.access?.update?.({ req: { user: null } } as never)).toBe(false)
      expect(await config.access?.update?.({ req: { user: actor } } as never)).toBe(true)
      await expect(
        payload.updateGlobal({
          slug: config.slug,
          data: {},
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    }
  })

  it('keeps public globals presentation-only and excludes arbitrary markup, styling, and secret fields', () => {
    for (const config of payload.config.globals) {
      const fields = flattenFields(config.fields)
      expect(fields.some(({ type }) => type === 'code' || type === 'richText')).toBe(false)
      expect(fields.map(({ name }) => name)).not.toEqual(
        expect.arrayContaining([
          expect.stringMatching(/secret|password|token|api.?key|internal|private|notes?|html|css|colou?r/i),
        ]),
      )
    }
  })

  it('supports later locales structurally while launching with English and LTR only', () => {
    const localizedFields = payload.config.globals
      .flatMap(({ fields }) => flattenFields(fields))
      .filter((field) => 'localized' in field && field.localized)
    expect(localizedFields.length).toBeGreaterThan(10)
    const locale = fieldMap('site-settings').get('defaultLocale')
    const direction = fieldMap('site-settings').get('direction')
    expect(locale).toMatchObject({ defaultValue: 'en', options: [{ label: 'English', value: 'en' }] })
    expect(direction).toMatchObject({ defaultValue: 'ltr', options: [{ label: 'Left to right', value: 'ltr' }] })
  })

  it.each([
    'http://alruknfurniture.ae',
    'https://www.alruknfurniture.ae',
    'https://alruknfurniture.ae.evil.example',
    'https://user@alruknfurniture.ae',
    'https://alruknfurniture.ae:443',
    'https://alruknfurniture.ae/path',
    'https://alruknfurniture.ae/',
  ])('rejects non-canonical site origin %s', async (canonicalSiteURL) => {
    await expect(
      payload.updateGlobal({
        slug: 'site-settings',
        data: siteSettingsData(canonicalSiteURL),
        context: { disableRevalidate: true },
        overrideAccess: false,
        user: actor,
      }),
    ).rejects.toThrow()
  })

  it('accepts only the exact canonical HTTPS origin', async () => {
    const result = await payload.updateGlobal({
      slug: 'site-settings',
      data: siteSettingsData('https://alruknfurniture.ae'),
      context: { disableRevalidate: true },
      overrideAccess: false,
      user: actor,
    })
    expect(result.canonicalSiteURL).toBe('https://alruknfurniture.ae')
  })

  it('normalizes valid contact numbers and suppresses WhatsApp availability when absent', async () => {
    const phoneE164 = [' +1', '000', '000', '0000 '].join('')
    const whatsappE164 = [' +1', '000', '000', '0001 '].join('')
    const withWhatsApp = await payload.updateGlobal({
      slug: 'contact-information',
      data: { phoneE164, whatsappE164 },
      context: { disableRevalidate: true },
      overrideAccess: false,
      user: actor,
    })
    expect(withWhatsApp).toMatchObject({
      phoneE164: phoneE164.trim(),
      whatsappAvailable: true,
      whatsappE164: whatsappE164.trim(),
    })

    const withoutWhatsApp = await payload.updateGlobal({
      slug: 'contact-information',
      data: { whatsappE164: null },
      context: { disableRevalidate: true },
      overrideAccess: false,
      user: actor,
    })
    expect(withoutWhatsApp.whatsappAvailable).toBe(false)
  })

  it.each(['0501234567', '+0123456789', '+971 50 123 4567', '+971-50-123-4567', 'javascript:alert(1)'])(
    'rejects invalid E.164 contact input %s',
    async (value) => {
      await expect(
        payload.updateGlobal({
          slug: 'contact-information',
          data: { whatsappE164: value },
          context: { disableRevalidate: true },
          overrideAccess: false,
          user: actor,
        }),
      ).rejects.toThrow()
    },
  )

  it.each([
    'javascript:alert(1)',
    'http://maps.google.com/place/example',
    '//maps.google.com/place/example',
    'https://user@maps.google.com/place/example',
    'https://maps.google.com:443/place/example',
    'https://evil.example/place/example',
  ])('rejects unsafe or invalid map URL %s', async (mapURL) => {
    await expect(
      payload.updateGlobal({
        slug: 'contact-information',
        data: { mapURL },
        context: { disableRevalidate: true },
        overrideAccess: false,
        user: actor,
      }),
    ).rejects.toThrow()
  })

  it('accepts HTTPS map URLs on the approved map hosts', async () => {
    const result = await payload.updateGlobal({
      slug: 'contact-information',
      data: { mapURL: 'https://maps.google.com/place/Al+Rukn' },
      context: { disableRevalidate: true },
      overrideAccess: false,
      user: actor,
    })
    expect(result.mapURL).toBe('https://maps.google.com/place/Al+Rukn')
  })

  it('allows only declared social networks and matching HTTPS provider URLs', async () => {
    const accepted = await payload.updateGlobal({
      slug: 'social-media',
      data: {
        links: [
          { label: 'Instagram', network: 'instagram', url: 'https://www.instagram.com/alrukn' },
          { label: 'Facebook', network: 'facebook', url: 'https://facebook.com/alrukn' },
        ],
      },
      context: { disableRevalidate: true },
      overrideAccess: false,
      user: actor,
    })
    expect(accepted.links).toHaveLength(2)

    for (const links of [
      [{ label: 'Bad scheme', network: 'instagram', url: 'http://instagram.com/alrukn' }],
      [{ label: 'Wrong provider', network: 'instagram', url: 'https://facebook.com/alrukn' }],
      [{ label: 'Unknown', network: 'telegram', url: 'https://telegram.org/alrukn' }],
    ]) {
      await expect(
        payload.updateGlobal({
          slug: 'social-media',
          data: { links },
          context: { disableRevalidate: true },
          overrideAccess: false,
          user: actor,
        } as never),
      ).rejects.toThrow()
    }
  })

  it('suppresses invalid contact CTA hrefs at render time', () => {
    expect(phoneHref('+10000000000')).toBe('tel:+10000000000')
    expect(whatsappHref('+10000000001', 'Hello & welcome')).toBe(
      'https://wa.me/10000000001?text=Hello+%26+welcome',
    )
    for (const invalid of [undefined, '', '0501234567', '+971 50 123 4567', 'javascript:alert(1)']) {
      expect(phoneHref(invalid)).toBeNull()
      expect(whatsappHref(invalid)).toBeNull()
    }
  })

  it('constrains service navigation to the fixed service records and conversion actions to safe actions', () => {
    for (const slug of ['header', 'footer']) {
      const fields = fieldMap(slug)
      expect(fields.get('service')).toMatchObject({ relationTo: 'services', type: 'relationship' })
    }
    expect(fieldMap('header').get('action')).toMatchObject({
      options: expect.arrayContaining([
        { label: 'Request a quotation', value: 'quotation' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Call', value: 'phone' },
      ]),
    })
    expect(FIXED_SERVICE_SLUGS).toHaveLength(9)
  })

  it('keeps route-aware SEO metadata and removes nested template navigation assumptions', () => {
    const services = payload.config.collections.find(({ slug }) => slug === 'services')
    const projects = payload.config.collections.find(({ slug }) => slug === 'projects')
    const posts = payload.config.collections.find(({ slug }) => slug === 'posts')
    expect(services?.fields.some((field) => 'name' in field && field.name === 'parent')).toBe(false)
    expect(projects?.fields.some((field) => 'name' in field && field.name === 'parent')).toBe(false)
    expect(posts?.fields.some((field) => 'name' in field && field.name === 'parent')).toBe(false)
    expect(JSON.stringify(payload.config.globals)).not.toContain('navItems')
  })
})
