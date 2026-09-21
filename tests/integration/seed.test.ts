// @vitest-environment node

import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { removeSeedBatch, seedAlRukn, type SeedResult } from '@/seed'
import { HOMEPAGE_BLOCK_ORDER } from '@/seed/business'
import { startIsolatedPayload, type IsolatedPayload } from './testPayload'

let isolated: IsolatedPayload
let registryPath: string
let uploaderId: number
let firstRun: SeedResult

const EDITOR_SUMMARY = 'Editor-written summary kept for the upholstery service.'

/** A full seed run uploads 12 images, so the default 5s budget is far too small. */
const SEED_TIMEOUT = 180_000

beforeAll(async () => {
  isolated = await startIsolatedPayload('seed')

  const uploader = await isolated.payload.create({
    collection: 'users',
    data: {
      email: 'seed-integration@alruknfurniture.ae',
      password: 'seed-integration-password-1',
      name: 'Seed Test',
    },
    overrideAccess: true,
  })

  uploaderId = uploader.id
  registryPath = path.join(mkdtempSync(path.join(tmpdir(), 'alrukn-seed-')), 'seed-batches.json')
}, 180_000)

afterAll(async () => {
  await isolated?.destroy()
  if (registryPath) rmSync(path.dirname(registryPath), { recursive: true, force: true })
})

describe('seedAlRukn', () => {
  it('creates the launch content on the first run', async () => {
    firstRun = await seedAlRukn(isolated.payload, {
      uploadedBy: uploaderId,
      batchId: 'batch-1',
      registryPath,
    })

    expect(firstRun.created).toBeGreaterThan(0)
    expect(Object.keys(firstRun.services)).toHaveLength(9)
    expect(firstRun.pages.home).toBeDefined()
    expect(firstRun.faqs.length).toBeGreaterThan(0)

    const services = await isolated.payload.find({
      collection: 'services',
      depth: 0,
      limit: 20,
      overrideAccess: true,
    })

    expect(services.totalDocs).toBe(9)

    for (const service of services.docs) {
      expect(service.status, `${service.slug} status`).toBe('published')
      expect(service._status, `${service.slug} _status`).toBe('published')
      expect(service.hero?.image, `${service.slug} hero image`).toBeTruthy()
      expect(service.seo?.title, `${service.slug} seo title`).toBeTruthy()
    }
  }, SEED_TIMEOUT)

  it('is idempotent on a second run', async () => {
    const second = await seedAlRukn(isolated.payload, {
      uploadedBy: uploaderId,
      batchId: 'batch-2',
      registryPath,
    })

    expect(second.created).toBe(0)
    expect(second.pages.home).toBe(firstRun.pages.home)
    expect(second.services['sofa-upholstery']).toBe(firstRun.services['sofa-upholstery'])

    const media = await isolated.payload.find({ collection: 'media', limit: 30, overrideAccess: true })
    expect(media.totalDocs).toBe(12)
  }, SEED_TIMEOUT)

  it('publishes the homepage layout in the owned order', async () => {
    const home = await isolated.payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: 'home' } },
    })

    const layout = home.docs[0]?.layout ?? []
    expect(layout.map((block) => block.blockType)).toEqual([...HOMEPAGE_BLOCK_ORDER])
  }, SEED_TIMEOUT)

  it('fills the business globals a visitor can see', async () => {
    const contact = await isolated.payload.findGlobal({ slug: 'contact-information' })
    expect(contact.phoneE164).toBe('+971551224902')
    expect(contact.whatsappE164).toBe('+971551224902')
    expect(contact.email).toBe('info@alruknfurniture.ae')
    expect(contact.address?.city).toBe('Ajman')

    const settings = await isolated.payload.findGlobal({ slug: 'site-settings' })
    expect(settings.canonicalSiteURL).toBe('https://alruknfurniture.ae')
    expect(settings.businessName).toBe('AL RUKN FURNITURE UPHOLSTERY')

    const header = await isolated.payload.findGlobal({ slug: 'header' })
    expect(header.serviceLinks).toHaveLength(9)

    const footer = await isolated.payload.findGlobal({ slug: 'footer' })
    expect(footer.serviceLinks).toHaveLength(9)
    expect(footer.legalLinks).toHaveLength(2)
  }, SEED_TIMEOUT)

  it('keeps an editor change when the seed runs again', async () => {
    await isolated.payload.update({
      collection: 'services',
      id: firstRun.services['sofa-upholstery']!,
      data: { summary: EDITOR_SUMMARY },
      overrideAccess: true,
    })

    const third = await seedAlRukn(isolated.payload, {
      uploadedBy: uploaderId,
      batchId: 'batch-3',
      registryPath,
    })

    expect(third.skipped).toBeGreaterThan(0)

    const service = await isolated.payload.findByID({
      collection: 'services',
      id: firstRun.services['sofa-upholstery']!,
      depth: 0,
      overrideAccess: true,
    })

    expect(service.summary).toBe(EDITOR_SUMMARY)
  }, SEED_TIMEOUT)

  it('restores seed copy only when force is set', async () => {
    const forced = await seedAlRukn(isolated.payload, {
      uploadedBy: uploaderId,
      batchId: 'batch-4',
      force: true,
      registryPath,
    })

    expect(forced.updated).toBeGreaterThan(0)
    expect(forced.skipped).toBe(0)

    const service = await isolated.payload.findByID({
      collection: 'services',
      id: firstRun.services['sofa-upholstery']!,
      depth: 0,
      overrideAccess: true,
    })

    expect(service.summary).not.toBe(EDITOR_SUMMARY)
    expect(service.summary?.length ?? 0).toBeGreaterThan(80)
  }, SEED_TIMEOUT)

  it('refuses to roll back records that moved on since their batch', async () => {
    const outcome = await removeSeedBatch(isolated.payload, 'batch-1', registryPath)

    expect(outcome.deleted).toBe(0)
    expect(outcome.retained).toBeGreaterThan(0)
  }, SEED_TIMEOUT)

  it('rolls back the untouched records of the latest batch', async () => {
    const outcome = await removeSeedBatch(isolated.payload, 'batch-4', registryPath)

    expect(outcome.deleted).toBeGreaterThan(0)
    expect(outcome.retained).toBe(0)

    const services = await isolated.payload.find({
      collection: 'services',
      depth: 0,
      limit: 20,
      overrideAccess: true,
    })

    expect(services.totalDocs).toBe(0)
  }, SEED_TIMEOUT)
})
