import type { TextField } from 'payload'
import { describe, expect, it } from 'vitest'

import { GoogleReviews } from '@/globals/GoogleReviews'
import { revalidateGlobal } from '@/globals/shared'
import { resolveGoogleReviewsSettings } from '@/lib/googleReviews'

const namedFields = () => new Map(
  GoogleReviews.fields
    .filter((field): field is typeof field & { name: string } => 'name' in field)
    .map((field) => [field.name, field]),
)

describe('Google Reviews CMS settings', () => {
  it('defines the reusable first-party configuration without credentials or review data', () => {
    expect(GoogleReviews.slug).toBe('google-reviews')
    expect([...namedFields().keys()]).toEqual([
      'enabled', 'placeId', 'heading', 'subheading', 'reviewLimit', 'mapsUrl', 'writeReviewUrl',
    ])
    expect([...namedFields().keys()].join(' ')).not.toMatch(/api.?key|reviewText|rating|author/i)
  })

  it('uses the approved defaults and bounds the visual review count', () => {
    const fields = namedFields()
    expect(fields.get('enabled')).toMatchObject({ defaultValue: false })
    expect(fields.get('placeId')).toMatchObject({ type: 'text' })
    expect(fields.get('placeId')).not.toHaveProperty('defaultValue')
    expect(fields.get('heading')).toMatchObject({ localized: true, defaultValue: 'What Our Customers Say' })
    expect(fields.get('subheading')).toMatchObject({ type: 'textarea', localized: true })
    expect(fields.get('reviewLimit')).toMatchObject({ defaultValue: 5, min: 3, max: 5 })
    expect(fields.get('mapsUrl')).toMatchObject({ defaultValue: 'https://maps.app.goo.gl/zUhpC9PNhgwM69qp6' })
    expect(fields.get('writeReviewUrl')).toMatchObject({ defaultValue: 'https://g.page/r/CZ5_iPy3nYpdEBM/review' })
  })

  it('trims the optional administrator Place ID before validation', async () => {
    const field = namedFields().get('placeId')! as TextField
    const trim = field.hooks?.beforeValidate?.[0]
    expect(trim).toBeTypeOf('function')
    expect(await trim!({ value: '  admin-place-id  ' } as never)).toBe('admin-place-id')
    expect(await trim!({ value: '   ' } as never)).toBe('')
    expect(await trim!({ value: null } as never)).toBeNull()
  })

  it('allows public reads, requires authenticated updates, and revalidates settings', async () => {
    expect(await GoogleReviews.access?.read?.({ req: { user: null } } as never)).toBe(true)
    expect(await GoogleReviews.access?.update?.({ req: { user: null } } as never)).toBe(false)
    expect(await GoogleReviews.access?.update?.({ req: { user: { id: 1 } } } as never)).toBe(true)
    expect(GoogleReviews.hooks?.afterChange).toContain(revalidateGlobal)
  })

  it.each([
    ['mapsUrl', 'https://maps.google.com/place/Al+Rukn'],
    ['writeReviewUrl', 'https://g.page/r/example/review'],
  ])('accepts a credential-free HTTPS %s', async (name, url) => {
    const field = namedFields().get(name)! as TextField
    expect('validate' in field && typeof field.validate === 'function').toBe(true)
    const validate = field.validate as (value: string, options: never) => unknown
    expect(await validate(url, {} as never)).toBe(true)
  })

  it.each([
    ['mapsUrl', 'javascript:alert(1)'],
    ['mapsUrl', 'http://maps.google.com/place/example'],
    ['mapsUrl', 'https://user:password@maps.google.com/place/example'],
    ['mapsUrl', 'https://maps.google.com:443/place/example'],
    ['mapsUrl', 'https://maps.google.com/place/example#fragment'],
    ['mapsUrl', 'https://evil.example/place/example'],
    ['writeReviewUrl', 'javascript:alert(1)'],
    ['writeReviewUrl', 'http://g.page/r/example/review'],
    ['writeReviewUrl', 'https://user:password@g.page/r/example/review'],
    ['writeReviewUrl', 'https://g.page:443/r/example/review'],
    ['writeReviewUrl', 'https://g.page:8443/r/example/review'],
    ['writeReviewUrl', 'https://g.page/r/example/review#fragment'],
    ['writeReviewUrl', 'https://g.page.evil.example/r/example/review'],
  ])('rejects unsafe %s input %s', async (name, url) => {
    const field = namedFields().get(name)! as TextField
    const validate = field.validate as (value: string, options: never) => unknown
    expect(await validate(url, {} as never)).not.toBe(true)
  })

  it('falls back unless enabled, keyed, and supplied with an admin Place ID', () => {
    expect(resolveGoogleReviewsSettings({}, false).mode).toBe('fallback')
    expect(resolveGoogleReviewsSettings({ enabled: true, placeId: '' }, true).mode).toBe('fallback')
    expect(resolveGoogleReviewsSettings({ enabled: true, placeId: 'admin-value' }, false).mode).toBe('fallback')
    expect(resolveGoogleReviewsSettings({ enabled: true, placeId: ' admin-value ', reviewLimit: 20 }, true)).toMatchObject({
      mode: 'native',
      placeId: 'admin-value',
      reviewLimit: 5,
    })
  })

  it('rejects unsafe links and retains approved fallback destinations', () => {
    const settings = resolveGoogleReviewsSettings({
      mapsUrl: 'javascript:alert(1)',
      writeReviewUrl: 'https://evil.example/review',
    }, false)
    expect(settings.mapsUrl).toBe('https://maps.app.goo.gl/zUhpC9PNhgwM69qp6')
    expect(settings.writeReviewUrl).toBe('https://g.page/r/CZ5_iPy3nYpdEBM/review')
  })
})

describe('Google Reviews safe settings resolver', () => {
  const ready = {
    enabled: true,
    placeId: ' admin-place-id ',
    mapsUrl: 'https://maps.app.goo.gl/zUhpC9PNhgwM69qp6',
    writeReviewUrl: 'https://g.page/r/CZ5_iPy3nYpdEBM/review',
  }

  it('enables native reviews only for ready settings and preserves localized copy', () => {
    expect(resolveGoogleReviewsSettings({
      ...ready,
      heading: '  آراء عملائنا  ',
      subheading: '  اقرأ تجارب عملائنا  ',
      reviewLimit: 4,
    }, true)).toEqual({
      heading: 'آراء عملائنا',
      subheading: 'اقرأ تجارب عملائنا',
      mode: 'native',
      placeId: 'admin-place-id',
      mapsUrl: ready.mapsUrl,
      writeReviewUrl: ready.writeReviewUrl,
      reviewLimit: 4,
    })
  })

  it.each([
    [{ enabled: false }, true],
    [{ placeId: '   ' }, true],
    [{ placeId: null }, true],
    [{}, false],
  ])('uses fallback when configuration or the Places API key is missing', (override, keyPresent) => {
    expect(resolveGoogleReviewsSettings({ ...ready, ...override }, keyPresent).mode).toBe('fallback')
  })

  it.each([
    ['mapsUrl', 'javascript:alert(1)'],
    ['mapsUrl', 'https://evil.example/place'],
    ['mapsUrl', 'http://maps.google.com/place'],
    ['mapsUrl', 'https://maps.google.com:443/place'],
    ['mapsUrl', 'https://user:password@maps.google.com/place'],
    ['mapsUrl', 'https://maps.google.com/place#fragment'],
    ['mapsUrl', ' https://maps.google.com/place '],
    ['writeReviewUrl', 'https://g.page.evil.example/r/example/review'],
    ['writeReviewUrl', 'https://g.page:443/r/example/review'],
    ['writeReviewUrl', 'https://g.page/r/example/review#fragment'],
    ['writeReviewUrl', 'https://user:password@g.page/r/example/review'],
  ] as const)('disables native mode and retains a safe destination for invalid %s: %s', (field, value) => {
    const resolved = resolveGoogleReviewsSettings({ ...ready, [field]: value }, true)
    expect(resolved.mode).toBe('fallback')
    expect(resolved[field]).toBe(field === 'mapsUrl' ? ready.mapsUrl : ready.writeReviewUrl)
  })

  it.each([
    [0, 3], [3, 3], [4, 4], [4.7, 5], [20, 5],
    [NaN, 5], [Infinity, 5], [-Infinity, 5], ['4', 5], [null, 5],
  ])('normalizes review limit %s to %s', (reviewLimit, expected) => {
    expect(resolveGoogleReviewsSettings({ ...ready, reviewLimit }, true).reviewLimit).toBe(expected)
  })

  it.each([null, undefined, [], 'invalid'])('resolves malformed settings to safe defaults', (value) => {
    expect(resolveGoogleReviewsSettings(value, true)).toEqual({
      heading: 'What Our Customers Say',
      subheading: '',
      mode: 'fallback',
      placeId: '',
      mapsUrl: ready.mapsUrl,
      writeReviewUrl: ready.writeReviewUrl,
      reviewLimit: 5,
    })
  })
})
