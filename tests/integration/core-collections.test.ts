// @vitest-environment node

import { randomUUID } from 'node:crypto'

import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { type IsolatedPayload, startIsolatedPayload } from './testPayload'

const createdCategoryIDs: Array<number | string> = []
let isolatedPayload: IsolatedPayload
let payload: Payload
let adminID: number | string

beforeAll(async () => {
  isolatedPayload = await startIsolatedPayload('core_collections')
  payload = isolatedPayload.payload

  const admin = await payload.create({
    collection: 'users',
    data: {
      email: `task-5-${randomUUID()}@example.invalid`,
      name: 'Task 5 test administrator',
      password: randomUUID(),
    },
    overrideAccess: true,
  })
  adminID = admin.id
}, 60_000)

afterAll(async () => {
  for (const id of createdCategoryIDs) {
    await payload.delete({ collection: 'categories', id, overrideAccess: true }).catch(() => undefined)
  }
  if (adminID) {
    await payload.delete({ collection: 'users', id: adminID, overrideAccess: true }).catch(() => undefined)
  }
  await isolatedPayload?.destroy()
}, 60_000)

describe('core Payload collections', () => {
  it('registers Task 5 collections without replacing existing collections, globals, or plugins', async () => {
    const collectionSlugs = payload.config.collections.map(({ slug }) => slug)
    const taskCollectionSlugs = collectionSlugs.filter((slug) =>
      ['users', 'media', 'categories'].includes(slug),
    )
    expect(taskCollectionSlugs).toEqual(['users', 'media', 'categories'])
    expect(collectionSlugs).toEqual(
      expect.arrayContaining(['pages', 'posts', 'redirects', 'forms', 'form-submissions', 'search']),
    )
    expect(payload.config.globals.map(({ slug }) => slug)).toEqual([
      'site-settings',
      'header',
      'footer',
      'contact-information',
      'seo-defaults',
      'social-media',
    ])

    await expect(
      payload.create({
        collection: 'users',
        data: {
          email: `anonymous-${randomUUID()}@example.invalid`,
          password: randomUUID(),
        },
        overrideAccess: false,
      }),
    ).rejects.toThrow()

    await expect(
      payload.find({ collection: 'users', overrideAccess: false }),
    ).rejects.toThrow()
    await expect(
      payload.update({
        collection: 'users',
        data: { name: 'Anonymous update' },
        id: adminID,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
    await expect(
      payload.delete({ collection: 'users', id: adminID, overrideAccess: false }),
    ).rejects.toThrow()
  })

  it('uses Payload auth hashing rather than persisting or returning plaintext passwords', async () => {
    const user = (await payload.findByID({
      collection: 'users',
      id: adminID,
      overrideAccess: true,
      showHiddenFields: true,
    })) as unknown as Record<string, unknown>

    expect(user.password).toBeUndefined()
    expect(user.salt).toEqual(expect.any(String))
    expect(user.hash).toEqual(expect.any(String))
  })

  it('normalizes required category slugs, enforces uniqueness, and cannot create empty archives', async () => {
    const token = randomUUID().slice(0, 8)
    const first = await payload.create({
      collection: 'categories',
      data: { slug: `  Living   Room ${token}  `, title: `Living Room ${token}` },
      overrideAccess: true,
    })
    createdCategoryIDs.push(first.id)

    expect(first.slug).toBe(`living-room-${token}`)

    await expect(
      payload.create({
        collection: 'categories',
        data: { slug: `living-room-${token}`, title: 'Duplicate normalized archive' },
        overrideAccess: true,
      }),
    ).rejects.toThrow()

    await expect(
      payload.create({
        collection: 'categories',
        data: { slug: `different-${token}`, title: `  Living Room ${token}  ` },
        overrideAccess: true,
      }),
    ).rejects.toThrow()

    await expect(
      payload.create({
        collection: 'categories',
        data: { slug: '   ', title: '   ' },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })
})
