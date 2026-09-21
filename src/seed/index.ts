import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Document, Payload } from 'payload'

import type { Faq, Media, Page, Service } from '@/payload-types'

import { BUSINESS, CANONICAL_ORIGIN, MEDIA_USAGE } from './business'
import { heading, paragraph, richText } from './richtext'
import { SERVICE_SEEDS, type ServiceSeed } from './services'
import { FAQ_SEEDS, GLOBAL_SEEDS, PAGE_SEEDS, buildHomepageLayout } from './site'

/**
 * Revalidation hooks call `next/cache`, which only works inside a Next request.
 * A seed run has no request scope, so every write opts out of revalidation
 * explicitly — the site rebuilds its cache on the next render anyway.
 */
const SEED_CONTEXT = { disableRevalidate: true } as const

/** Local API writes that carry the seed's request context. */
const writeApi = (payload: Payload) => ({
  create: (async (options: object) =>
    payload.create({ ...options, context: SEED_CONTEXT } as never)) as unknown as Payload['create'],
  update: (async (options: object) =>
    payload.update({ ...options, context: SEED_CONTEXT } as never)) as unknown as Payload['update'],
  updateGlobal: (async (options: object) =>
    payload.updateGlobal({ ...options, context: SEED_CONTEXT } as never)) as unknown as Payload['updateGlobal'],
  delete: (async (options: object) =>
    payload.delete({ ...options, context: SEED_CONTEXT } as never)) as unknown as Payload['delete'],
})

/**
 * Seeds the owned Al Rukn launch experience.
 *
 * Contract (see `docs/superpowers/plans/2026-09-12-al-rukn-furniture-implementation.md`,
 * Task 15):
 *  - idempotent: records are matched by stable slug / filename / question
 *  - editor-safe: a record that changed since this seed last wrote it is never
 *    overwritten unless `force` is set (and force is rejected in production)
 *  - reversible: every run writes a registry entry so only the records created
 *    by that batch can be removed again
 *  - launch copy only: no reviews, project outcomes, statistics or ratings that
 *    the business has not supplied. Testimonials and Statistics blocks stay
 *    unpublished until verified material is provided.
 */

export interface SeedOptions {
  /** User id recorded as the uploader/author of seeded records. */
  uploadedBy: number
  /** Overwrite records that changed since the last seed run (non-production only). */
  force?: boolean
  /** Stable identifier for this batch, used for rollback. Defaults to a timestamp. */
  batchId?: string
  /** Where the batch registry is written. Defaults to `docs/operations/seed-batches.json`. */
  registryPath?: string
  log?: (message: string) => void
}

export interface SeedResult {
  batchId: string
  created: number
  updated: number
  skipped: number
  media: Record<string, number>
  services: Record<string, number>
  faqs: number[]
  pages: Record<string, number>
}

interface ManifestEntry {
  key: string
  filename: string
  localPath: string
  creator: string
  sourcePageURL?: string
  downloadURL?: string
  licenseName: string
  licenseURL?: string
  alt?: string
  caption?: string
  decorative?: boolean
  focalPoint?: { x?: number; y?: number }
  intendedUse?: string
  sha256?: string
  downloadedAt?: string
}

interface Manifest {
  assets: ManifestEntry[]
}

interface RegistryRecord {
  collection: string
  id: number
  identifier: string
  updatedAt: string
}

interface Registry {
  batches: { batchId: string; createdAt: string; records: RegistryRecord[] }[]
}

const here = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_REGISTRY_PATH = path.join(process.cwd(), 'docs/operations/seed-batches.json')

const readManifest = (): Manifest => {
  const manifestPath = path.join(here, 'media-manifest.json')
  return JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest
}

const readRegistry = (registryPath: string): Registry => {
  try {
    return JSON.parse(readFileSync(registryPath, 'utf8')) as Registry
  } catch {
    return { batches: [] }
  }
}

const exists = <T>(value: T | undefined | null): value is T =>
  value !== undefined && value !== null

/** Drops undefined keys so Payload never receives an explicit undefined value. */
const compact = <T extends Record<string, unknown>>(input: T): T => {
  const output: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) output[key] = value
  }
  return output as T
}

export const seedAlRukn = async (
  payload: Payload,
  options: SeedOptions,
): Promise<SeedResult> => {
  const log = options.log ?? ((message: string) => payload.logger.info(message))
  const batchId = options.batchId ?? `seed-${new Date().toISOString().replace(/[:.]/g, '-')}`
  const registryPath = options.registryPath ?? DEFAULT_REGISTRY_PATH
  const registry = readRegistry(registryPath)
  const previous = new Map<string, string>()

  // The Media collection refuses uploads without an authenticated owner, and a
  // local API call carries no session by itself. Resolve the recorded uploader
  // once and hand it to every media write so the real hook contract still runs.
  const owner = (await payload.findByID({
    collection: 'users',
    id: options.uploadedBy,
    depth: 0,
    overrideAccess: true,
  })) as Document

  const write = writeApi(payload)

  for (const batch of registry.batches) {
    for (const record of batch.records) {
      previous.set(`${record.collection}:${record.id}`, record.updatedAt)
    }
  }

  const force = Boolean(options.force)
  if (force && process.env.NODE_ENV === 'production') {
    throw new Error('SEED_FORCE is not permitted in production — seeded records stay editor-owned.')
  }

  const result: SeedResult = {
    batchId,
    created: 0,
    updated: 0,
    skipped: 0,
    media: {},
    services: {},
    faqs: [],
    pages: {},
  }
  const batchRecords: RegistryRecord[] = []

  /** True when a record may be written: new, seeded-and-untouched, or forced. */
  const writable = (collection: string, id: number, updatedAt: string): boolean => {
    const recorded = previous.get(`${collection}:${id}`)
    if (recorded === undefined) return force
    return recorded === updatedAt || force
  }

  const record = (collection: string, id: number, identifier: string, updatedAt: string): void => {
    batchRecords.push({ collection, id, identifier, updatedAt })
    previous.set(`${collection}:${id}`, updatedAt)
  }

  /** Rewrites a batch entry after a follow-up write, so rollback sees the latest stamps. */
  const replaceRecord = (
    collection: string,
    id: number,
    identifier: string,
    updatedAt: string,
  ): void => {
    const index = batchRecords.findIndex((entry) => entry.collection === collection && entry.id === id)
    if (index === -1) {
      record(collection, id, identifier, updatedAt)
      return
    }
    batchRecords[index] = { collection, id, identifier, updatedAt }
    previous.set(`${collection}:${id}`, updatedAt)
  }

  const findOne = async (
    collection: 'services' | 'pages' | 'media' | 'faqs',
    where: Record<string, unknown>,
  ) => {
    const found = await payload.find({
      collection,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      draft: true,
      where,
    } as Parameters<typeof payload.find>[0])

    return found.docs[0]
  }

  // ---------------------------------------------------------------- media ---
  const manifest = readManifest()
  const mediaByFile = new Map<string, ManifestEntry>()
  for (const entry of manifest.assets) {
    mediaByFile.set(entry.filename, entry)
  }

  log(`seed: ${manifest.assets.length} launch assets in the manifest`)

  for (const entry of manifest.assets) {
    const filePath = path.join(here, 'assets', entry.filename)
    // Match on the seed marker rather than the filename: Payload may add a
    // suffix when a file of the same name already exists in the uploads folder.
    const marker = `seed-asset:${entry.key}`
    const existing = (await findOne('media', { sourceNotes: { contains: marker } })) as
      | { id: number; updatedAt: string }
      | undefined

    if (existing && !force) {
      result.media[entry.filename] = existing.id
      result.skipped += 1
      record('media', existing.id, entry.filename, existing.updatedAt)
      continue
    }

    const data = compact({
      alt: entry.alt ?? `Placeholder photograph: ${entry.filename}`,
      caption: entry.caption,
      decorative: entry.decorative ?? false,
      focalX: entry.focalPoint?.x,
      focalY: entry.focalPoint?.y,
      license: entry.licenseName,
      licenseURL: entry.licenseURL,
      sourceURL: entry.sourcePageURL ?? entry.downloadURL,
      sourceNotes: [
        `${marker}`,
        `Seed batch ${batchId}`,
        `Creator: ${entry.creator}`,
        `Checksum (sha256): ${entry.sha256 ?? 'recorded in media-manifest.json'}`,
        'Royalty-free placeholder imagery — replace with own photography through the Media collection.',
      ].join(' · '),
      uploadedBy: options.uploadedBy,
    }) as unknown as Media

    if (existing) {
      const updated = await write.update({
        collection: 'media',
        id: existing.id,
        data,
        overrideAccess: true,
        user: owner,
      })
      result.media[entry.filename] = updated.id
      result.updated += 1
      record('media', updated.id, entry.filename, updated.updatedAt)
      continue
    }

    const created = await write.create({
      collection: 'media',
      data,
      filePath,
      overrideAccess: true,
      user: owner,
    })
    result.media[entry.filename] = created.id
    result.created += 1
    record('media', created.id, entry.filename, created.updatedAt)
    log(`seed: media ${entry.filename} → #${created.id}`)
  }

  const requireMedia = (filename: string): number => {
    const id = result.media[filename]
    if (!exists(id)) {
      throw new Error(
        `Seed media "${filename}" was not uploaded — check the manifest and src/seed/assets.`,
      )
    }
    return id
  }

  // ----------------------------------------------------------------- faqs ---
  const faqIdByQuestion = new Map<string, number>()

  for (const faq of FAQ_SEEDS) {
    const existing = (await findOne('faqs', { question: { equals: faq.question } })) as
      | { id: number; updatedAt: string }
      | undefined

    const data = compact({
      question: faq.question,
      answer: faq.answer,
      group: faq.group,
      order: faq.order,
      schemaEligible: faq.schemaEligible,
      status: 'published' as const,
      // Payload leaves `_status` at its field default ("draft") unless the
      // collection enables localized status, so a local-API publish must set it.
      _status: 'published' as const,
      publishedAt: new Date().toISOString(),
    }) as unknown as Faq

    if (existing && !writable('faqs', existing.id, existing.updatedAt)) {
      faqIdByQuestion.set(faq.question, existing.id)
      result.faqs.push(existing.id)
      result.skipped += 1
      continue
    }

    if (existing) {
      const updated = await write.update({
        collection: 'faqs',
        id: existing.id,
        data,
        overrideAccess: true,
      })
      faqIdByQuestion.set(faq.question, updated.id)
      result.faqs.push(updated.id)
      result.updated += 1
      record('faqs', updated.id, faq.question, updated.updatedAt)
      continue
    }

    const created = await write.create({
      collection: 'faqs',
      data,
      overrideAccess: true,
    })
    faqIdByQuestion.set(faq.question, created.id)
    result.faqs.push(created.id)
    result.created += 1
    record('faqs', created.id, faq.question, created.updatedAt)
  }

  log(`seed: ${faqIdByQuestion.size} published FAQs`)

  // ------------------------------------------------------------- services ---
  const serviceIdBySlug = new Map<string, number>()
  const writtenServices: { slug: string; id: number }[] = []

  const serviceData = (service: ServiceSeed): Service =>
    compact({
      title: service.title,
    slug: service.slug,
    summary: service.summary,
    hero: {
      eyebrow: service.hero.eyebrow,
      heading: service.hero.heading,
      copy: service.hero.copy,
      image: service.hero.imageFile ? requireMedia(service.hero.imageFile) : undefined,
    },
    details: service.details,
    benefits: service.benefits,
    materialsCapabilities: service.materialsCapabilities,
    process: service.process,
    faqs: service.faqQuestions
      .map((question) => faqIdByQuestion.get(question))
      .filter(exists),
    serviceAreas: service.serviceAreas.map((area) => ({ area })),
    gallery: service.galleryFiles
      .filter((filename) => exists(result.media[filename]))
      .map((filename) => ({ image: requireMedia(filename) })),
    quotationContext: service.quotationContext,
    whatsAppContext: service.whatsAppContext,
    seo: {
      title: `${service.title} in ${BUSINESS.address.city}`,
      description: service.summary.slice(0, 160),
      canonicalURL: `${CANONICAL_ORIGIN}/${service.slug}/`,
      index: true,
      follow: true,
    },
    status: 'published' as const,
    // See the FAQ note above: publishing through the local API needs `_status`.
    _status: 'published' as const,
    publishedAt: new Date().toISOString(),
  }) as unknown as Service

  for (const service of SERVICE_SEEDS) {
    const existing = (await findOne('services', { slug: { equals: service.slug } })) as
      | { id: number; updatedAt: string }
      | undefined

    // `relatedServices` is filled in by a second pass once the whole set exists:
    // a forward reference has no id yet and Payload validates relationship ids.
    const data = serviceData(service)

    if (existing && !writable('services', existing.id, existing.updatedAt)) {
      serviceIdBySlug.set(service.slug, existing.id)
      result.services[service.slug] = existing.id
      result.skipped += 1
      continue
    }

    if (existing) {
      const updated = await write.update({
        collection: 'services',
        id: existing.id,
        data,
        draft: false,
        overrideAccess: true,
      })
      serviceIdBySlug.set(service.slug, updated.id)
      result.services[service.slug] = updated.id
      result.updated += 1
      writtenServices.push({ slug: service.slug, id: updated.id })
      record('services', updated.id, service.slug, updated.updatedAt)
      continue
    }

    const created = await write.create({
      collection: 'services',
      data,
      draft: false,
      overrideAccess: true,
    })
    serviceIdBySlug.set(service.slug, created.id)
    result.services[service.slug] = created.id
    result.created += 1
    record('services', created.id, service.slug, created.updatedAt)
    writtenServices.push({ slug: service.slug, id: created.id })
    log(`seed: service ${service.slug} → #${created.id}`)
  }

  // Second pass: every service now has an id, so the related-service graph
  // resolves correctly regardless of the order the seeds are declared in.
  for (const { slug, id } of writtenServices) {
    const seed = SERVICE_SEEDS.find((candidate) => candidate.slug === slug)
    const related = (seed?.relatedSlugs ?? [])
      .map((relatedSlug) => serviceIdBySlug.get(relatedSlug))
      .filter(exists)

    if (related.length === 0) continue

    const updated = await write.update({
      collection: 'services',
      id,
      data: { relatedServices: related },
      draft: false,
      overrideAccess: true,
    })

    replaceRecord('services', updated.id, slug, updated.updatedAt)
  }

  // Second pass: link every service back from the FAQs it answers.
  for (const faq of FAQ_SEEDS) {
    const faqId = faqIdByQuestion.get(faq.question)
    if (!faqId || faq.serviceSlugs.length === 0) continue

    const serviceIds = faq.serviceSlugs.map((slug) => serviceIdBySlug.get(slug)).filter(exists)
    if (serviceIds.length === 0) continue

    const current = (await payload.findByID({
      collection: 'faqs',
      id: faqId,
      depth: 0,
      overrideAccess: true,
    })) as { services?: (number | { id: number })[] | null }

    const currentIds = (current.services ?? []).map((value) =>
      typeof value === 'number' ? value : value.id,
    )
    const sameSet =
      currentIds.length === serviceIds.length &&
      currentIds.every((id) => serviceIds.includes(id))

    if (sameSet) continue

    await write.update({
      collection: 'faqs',
      id: faqId,
      data: { services: serviceIds },
      overrideAccess: true,
    })
  }

  // ---------------------------------------------------------------- pages ---
  const mediaForBlocks = {
    hero: requireMedia(MEDIA_USAGE.hero),
    about: requireMedia(MEDIA_USAGE.about),
  }

  for (const page of PAGE_SEEDS) {
    const isHome = page.slug === 'home'
    const existing = (await findOne('pages', { slug: { equals: page.slug } })) as
      | { id: number; updatedAt: string }
      | undefined

    const data = compact({
      title: page.title,
      slug: page.slug,
      hero: isHome
        ? {
            type: 'lowImpact' as const,
            richText: richText(
              heading('Upholstery and furniture made to measure in Ajman', 'h2'),
              paragraph(
                `${BUSINESS.brandName} re-covers sofas, builds majlis seating and makes fitted furniture from the workshop in ${BUSINESS.address.line1}, ${BUSINESS.address.city}.`,
              ),
            ),
            media: mediaForBlocks.hero,
            links: [
              {
                link: {
                  type: 'custom' as const,
                  url: '/contact',
                  label: 'Request a quotation',
                },
              },
              {
                link: { type: 'custom' as const, url: '/services', label: 'See all services' },
              },
            ],
          }
        : {
            type: page.hero.type,
            richText: page.hero.richText,
            ...(page.hero.mediaFile ? { media: requireMedia(page.hero.mediaFile) } : {}),
            ...(page.hero.links ? { links: page.hero.links } : {}),
          },
      layout: isHome
        ? buildHomepageLayout({ faqIds: result.faqs, media: mediaForBlocks })
        : (page.layout as unknown as Page['layout']),
      seo: {
        title:
          page.slug === 'home'
            ? `${BUSINESS.brandName} | ${BUSINESS.category} in ${BUSINESS.address.city}`
            : `${page.title} | ${BUSINESS.brandName}`,
        description:
          page.slug === 'home'
            ? GLOBAL_SEEDS.seoDefaults.fallbackDescription
            : `${page.title} information for customers of ${BUSINESS.brandName}, ${BUSINESS.address.city}.`,
        canonicalURL: `${CANONICAL_ORIGIN}${page.canonicalPath}`,
        index: true,
        follow: true,
      },
      status: 'published' as const,
      // See the FAQ note above: publishing through the local API needs `_status`.
      _status: 'published' as const,
      publishedAt: new Date().toISOString(),
    }) as unknown as Page

    if (existing && !writable('pages', existing.id, existing.updatedAt)) {
      result.pages[page.slug] = existing.id
      result.skipped += 1
      continue
    }

    if (existing) {
      const updated = await write.update({
        collection: 'pages',
        id: existing.id,
        data,
        draft: false,
        overrideAccess: true,
      })
      result.pages[page.slug] = updated.id
      result.updated += 1
      record('pages', updated.id, page.slug, updated.updatedAt)
      continue
    }

    const created = await write.create({
      collection: 'pages',
      data,
      draft: false,
      overrideAccess: true,
    })
    result.pages[page.slug] = created.id
    result.created += 1
    record('pages', created.id, page.slug, created.updatedAt)
    log(`seed: page ${page.slug} → #${created.id}`)
  }

  // -------------------------------------------------------------- globals ---
  const serviceLinks = SERVICE_SEEDS.map((service) => ({
    service: serviceIdBySlug.get(service.slug),
    label: service.title,
  })).filter((link) => exists(link.service))

  await write.updateGlobal({
    slug: 'site-settings',
    data: GLOBAL_SEEDS.siteSettings,
    overrideAccess: true,
  })

  await write.updateGlobal({
    slug: 'contact-information',
    data: GLOBAL_SEEDS.contactInformation,
    overrideAccess: true,
  })

  await write.updateGlobal({
    slug: 'header',
    data: { ...GLOBAL_SEEDS.header, serviceLinks },
    overrideAccess: true,
  })

  await write.updateGlobal({
    slug: 'footer',
    data: { ...GLOBAL_SEEDS.footer, serviceLinks },
    overrideAccess: true,
  })

  await write.updateGlobal({
    slug: 'seo-defaults',
    data: {
      ...GLOBAL_SEEDS.seoDefaults,
      socialImage: requireMedia(MEDIA_USAGE.openGraph),
    },
    overrideAccess: true,
  })

  // No social profiles were supplied by the business, so the global stays empty
  // rather than listing accounts that cannot be verified.
  await write.updateGlobal({
    slug: 'social-media',
    data: GLOBAL_SEEDS.socialMedia,
    overrideAccess: true,
  })

  log('seed: globals updated (site-settings, contact-information, header, footer, seo-defaults, social-media)')

  registry.batches = registry.batches.filter((batch) => batch.batchId !== batchId)
  registry.batches.push({ batchId, createdAt: new Date().toISOString(), records: batchRecords })

  const { mkdirSync, writeFileSync } = await import('node:fs')
  mkdirSync(path.dirname(registryPath), { recursive: true })
  writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8')

  log(
    `seed: batch ${batchId} → created ${result.created}, updated ${result.updated}, skipped ${result.skipped}`,
  )

  return result
}

/**
 * Removes only the records a batch created, and only while they are still
 * untouched. Anything an editor has since changed is left in place.
 */
export const removeSeedBatch = async (
  payload: Payload,
  batchId: string,
  registryPath = DEFAULT_REGISTRY_PATH,
): Promise<{ deleted: number; retained: number }> => {
  const registry = readRegistry(registryPath)
  const batch = registry.batches.find((candidate) => candidate.batchId === batchId)

  if (!batch) {
    throw new Error(`No seed batch "${batchId}" was found in ${registryPath}.`)
  }

  let deleted = 0
  let retained = 0

  const write = writeApi(payload)

  for (const record of batch.records) {
    const collection = record.collection as 'services' | 'pages' | 'media' | 'faqs'
    try {
      const current = (await payload.findByID({
        collection,
        id: record.id,
        depth: 0,
        overrideAccess: true,
      })) as { updatedAt: string }

      if (current.updatedAt !== record.updatedAt) {
        retained += 1
        continue
      }

      await write.delete({ collection, id: record.id, overrideAccess: true })
      deleted += 1
    } catch (error) {
      // Never counted as deleted: the record stays in the registry so a later rollback
      // can retry it, and the reason is reported rather than silently swallowed.
      const err = error as Error
      payload.logger.warn(
        `seed: could not delete ${collection} #${record.id} (${record.identifier}): ${err.message}`,
      )
    }
  }

  registry.batches = registry.batches.filter((candidate) => candidate.batchId !== batchId)
  const { writeFileSync } = await import('node:fs')
  writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8')

  return { deleted, retained }
}
