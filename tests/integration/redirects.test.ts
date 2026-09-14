// @vitest-environment node

import { randomUUID } from 'node:crypto'

import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  normalizeRedirectPath,
  resolveRedirect,
  type RedirectInput,
  validateRedirect,
} from '@/collections/Redirects'

import { type IsolatedPayload, startIsolatedPayload } from './testPayload'

const valid = (overrides: Partial<RedirectInput> = {}): RedirectInput => ({
  active: true,
  destination: '/new-path/',
  source: '/old-path/',
  type: 301,
  ...overrides,
})

let isolatedPayload: IsolatedPayload
let payload: Payload
let actor: Awaited<ReturnType<Payload['create']>>

beforeAll(async () => {
  isolatedPayload = await startIsolatedPayload('t7_redirects')
  payload = isolatedPayload.payload
  actor = await payload.create({
    collection: 'users',
    data: { email: `redirect-actor-${randomUUID()}@example.invalid`, password: randomUUID() },
    overrideAccess: true,
  })
}, 90_000)

afterAll(async () => {
  await isolatedPayload?.destroy()
}, 90_000)

describe('safe redirect validation', () => {
  it.each([
    ['https://evil.example/path', 'scheme'],
    ['http://alruknfurniture.ae/path', 'scheme'],
    ['evil.example/path', 'host'],
    ['127.0.0.1/path', 'host'],
    ['//evil.example/path', 'protocol-relative'],
    ['/\\evil.example/path', 'backslash'],
    ['/safe\\..\\admin', 'backslash'],
    ['/safe/../admin', 'traversal'],
    ['/safe/%2e%2e/admin', 'traversal'],
    ['/safe/%252e%252e/admin', 'traversal'],
    ['/safe/%25252525252e%25252525252e/admin', 'nested traversal'],
    ['/safe/%2Fadmin', 'encoded separator'],
    ['/safe/%5cadmin', 'encoded separator'],
    ['/safe/%3Fadmin=true', 'encoded query delimiter'],
    ['/safe/%23fragment', 'encoded fragment delimiter'],
  ])('rejects unsafe path input %s (%s)', (path) => {
    expect(validateRedirect(valid({ destination: path }), [])).toMatch(/path|scheme|host|traversal|backslash|encoded/i)
    expect(() => normalizeRedirectPath(path)).toThrow()
  })

  it.each(['/admin/', '/api/leads', '/media/file.jpg', '/uploads/file.jpg', '/_next/data/x', '/internal/preview']) (
    'rejects protected source and destination target %s',
    (path) => {
      expect(validateRedirect(valid({ destination: path }), [])).toMatch(/protected/i)
      expect(validateRedirect(valid({ source: path }), [])).toMatch(/protected/i)
    },
  )

  it('normalizes path-only records and preserves queries only when explicitly supplied', () => {
    expect(normalizeRedirectPath('old//path')).toBe('/old/path/')
    expect(normalizeRedirectPath('/old/path?utm_source=legacy&x=1')).toBe(
      '/old/path/?utm_source=legacy&x=1',
    )
    expect(normalizeRedirectPath('/old/path')).toBe('/old/path/')
    expect(normalizeRedirectPath('/file.pdf')).toBe('/file.pdf')
  })

  it('rejects direct loops, active chains, and duplicate active exact sources', () => {
    expect(validateRedirect(valid({ destination: '/old-path/' }), [])).toMatch(/loop/i)
    expect(
      validateRedirect(valid(), [valid({ destination: '/final/', source: '/new-path/' })]),
    ).toMatch(/chain/i)
    expect(
      validateRedirect(valid({ destination: '/final/', source: '/new-path/' }), [
        valid({ destination: '/new-path/', source: '/first-path/' }),
      ]),
    ).toMatch(/chain/i)
    expect(
      validateRedirect(valid(), [valid({ destination: '/other/', source: '/old-path/' })]),
    ).toMatch(/active redirect.*source/i)
    expect(
      validateRedirect(valid({ active: false }), [valid({ destination: '/other/', source: '/old-path/' })]),
    ).toBe(true)
  })

  it('accepts only 301/302 and resolves one active exact source deterministically', () => {
    expect(validateRedirect(valid({ type: 307 as 301 }), [])).toMatch(/301.*302/i)
    const records = [
      { ...valid({ destination: '/second/' }), id: 12 },
      { ...valid({ destination: '/inactive/', active: false }), id: 1 },
      { ...valid({ destination: '/first/' }), id: 3 },
    ]
    expect(resolveRedirect('/old-path', records)?.destination).toBe('/first/')
    expect(resolveRedirect('/old-path?x=1', records)).toBeUndefined()
  })
})

describe('redirect Payload lifecycle', () => {
  it('invalidates the redirect cache after both writes and deletion', () => {
    const collection = payload.config.collections.find(({ slug }) => slug === 'redirects')
    expect(collection?.hooks?.afterChange).toHaveLength(1)
    expect(collection?.hooks?.afterDelete).toHaveLength(1)
  })

  it('normalizes persisted values, exposes only active redirects publicly, and keeps explicit query matching', async () => {
    const active = await payload.create({
      collection: 'redirects',
      context: { disableRevalidate: true },
      data: { active: true, destination: 'new//place?from=old', source: 'legacy//place?x=1', type: 302 },
      overrideAccess: false,
      user: actor,
    })
    await payload.create({
      collection: 'redirects',
      context: { disableRevalidate: true },
      data: { active: false, destination: '/hidden-new/', source: '/hidden-old/', type: 301 },
      overrideAccess: false,
      user: actor,
    })
    expect(active).toMatchObject({
      destination: '/new/place/?from=old',
      source: '/legacy/place/?x=1',
      type: 302,
    })

    const publicResult = await payload.find({
      collection: 'redirects',
      overrideAccess: false,
      pagination: false,
    })
    expect(publicResult.docs.map(({ source }) => source)).toEqual(['/legacy/place/?x=1'])
  })

  it('denies anonymous writes and deterministically rejects a second active normalized source', async () => {
    const suffix = randomUUID().slice(0, 8)
    await expect(
      payload.create({
        collection: 'redirects',
        data: { active: true, destination: `/anonymous-${suffix}/`, source: `/anon-${suffix}/`, type: 301 },
        overrideAccess: false,
      }),
    ).rejects.toThrow()

    await payload.create({
      collection: 'redirects',
      context: { disableRevalidate: true },
      data: { active: true, destination: `/new-${suffix}/`, source: `duplicate-${suffix}`, type: 301 },
      overrideAccess: false,
      user: actor,
    })
    await expect(
      payload.create({
        collection: 'redirects',
        context: { disableRevalidate: true },
        data: { active: true, destination: `/other-${suffix}/`, source: `/duplicate-${suffix}/`, type: 302 },
        overrideAccess: false,
        user: actor,
      }),
    ).rejects.toThrow(/active redirect.*source/i)
  })

  it('rejects persisted chains regardless of insertion order', async () => {
    const suffix = randomUUID().slice(0, 8)
    await payload.create({
      collection: 'redirects',
      context: { disableRevalidate: true },
      data: { active: true, destination: `/middle-${suffix}/`, source: `/first-${suffix}/`, type: 301 },
      overrideAccess: false,
      user: actor,
    })
    await expect(
      payload.create({
        collection: 'redirects',
        context: { disableRevalidate: true },
        data: { active: true, destination: `/final-${suffix}/`, source: `/middle-${suffix}/`, type: 302 },
        overrideAccess: false,
        user: actor,
      }),
    ).rejects.toThrow(/chain/i)
  })
})
