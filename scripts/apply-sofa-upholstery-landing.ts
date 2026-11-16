/**
 * Production content cutover for /sofa-upholstery/ only.
 *
 * - Reuses existing Eco catalogue Media by sourceURL
 * - Reuses existing AI Media by seed-asset marker in sourceNotes
 * - Creates any missing sofa FAQs
 * - Updates the published sofa-upholstery Service record
 * - Does not mutate Google Reviews, other services, or force-overwrite unrelated Media
 *
 * Usage (from the deploy tree, with production env loaded):
 *   pnpm exec tsx scripts/apply-sofa-upholstery-landing.ts
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import { getPayload, type Where } from 'payload'

import config from '../src/payload.config'
import { SERVICE_SEEDS } from '../src/seed/services'
import { FAQ_SEEDS } from '../src/seed/site'
import { SOFA_FAQS, SOFA_GALLERY_FILES } from '../src/seed/sofaUpholsteryContent'

type ManifestEntry = {
  key: string
  filename: string
  sourceSite?: string
  sourcePageURL?: string
  licenseName: string
}

const readManifest = (): { assets: ManifestEntry[] } =>
  JSON.parse(readFileSync(path.join(root, 'src/seed/media-manifest.json'), 'utf8'))

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const CANONICAL_ORIGIN = 'https://alruknfurniture.ae'

const envCandidates = [
  process.env.ENV_FILE,
  '/etc/alruknfurniture/.env',
  path.join(root, '.env'),
].filter(Boolean) as string[]

for (const envFile of envCandidates) {
  try {
    Object.assign(process.env, dotenv.parse(readFileSync(envFile)))
    break
  } catch {
    // try next
  }
}

const exists = <T>(value: T | null | undefined): value is T => value != null

async function main() {
  const sofaSeed = SERVICE_SEEDS.find((service) => service.slug === 'sofa-upholstery')
  if (!sofaSeed?.sofaUpholsteryLanding) {
    throw new Error('sofa-upholstery seed content is missing')
  }

  const payload = await getPayload({ config })
  const manifest = readManifest()
  const mediaByFile = new Map<string, number>()

  const resolveMedia = async (filename: string): Promise<number> => {
    if (mediaByFile.has(filename)) return mediaByFile.get(filename)!
    const entry = manifest.assets.find((asset) => asset.filename === filename)
    if (!entry) throw new Error(`Manifest entry missing for ${filename}`)

    const marker = `seed-asset:${entry.key}`
    const where: Where =
      entry.sourceSite === 'eco-furniture.ae'
        ? {
            and: [
              { sourceURL: { equals: entry.sourcePageURL! } },
              { sourceSite: { equals: entry.sourceSite } },
              { license: { equals: 'Company-owned source asset' } },
            ],
          }
        : { sourceNotes: { contains: `${marker} ·` } }

    const found = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where,
    })
    const doc = found.docs[0]
    if (!doc) {
      throw new Error(
        `Required Media not found for ${filename} (${entry.sourcePageURL ?? entry.key}). Import or seed media first.`,
      )
    }
    mediaByFile.set(filename, doc.id)
    return doc.id
  }

  for (const filename of [
    ...SOFA_GALLERY_FILES,
    ...sofaSeed.sofaUpholsteryLanding.popularServices.map((card) => card.imageFile),
    ...sofaSeed.sofaUpholsteryLanding.fabricCards.map((card) => card.imageFile),
    sofaSeed.sofaUpholsteryLanding.bedTeaser.imageFile,
    sofaSeed.hero.imageFile,
  ]) {
    await resolveMedia(filename)
  }

  const faqIdByQuestion = new Map<string, number>()
  for (const [question, answer] of SOFA_FAQS) {
    const existing = await payload.find({
      collection: 'faqs',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { question: { equals: question } },
    })
    const current = existing.docs[0]
    if (current) {
      faqIdByQuestion.set(question, current.id)
      continue
    }

    const seedMeta = FAQ_SEEDS.find((faq) => faq.question === question)
    const created = await payload.create({
      collection: 'faqs',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        question,
        answer,
        group: seedMeta?.group ?? 'services',
        order: seedMeta?.order ?? 900,
        schemaEligible: seedMeta?.schemaEligible ?? true,
        status: 'published',
        _status: 'published',
        publishedAt: new Date().toISOString(),
      },
    })
    faqIdByQuestion.set(question, created.id)
    payload.logger.info(`created FAQ: ${question}`)
  }

  const requireMedia = (filename: string) => {
    const id = mediaByFile.get(filename)
    if (!id) throw new Error(`Media unresolved: ${filename}`)
    return id
  }

  const services = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 20,
    overrideAccess: true,
    where: { slug: { in: ['sofa-upholstery', ...(sofaSeed.relatedSlugs ?? [])] } },
  })
  const serviceIdBySlug = new Map(services.docs.map((doc) => [doc.slug, doc.id]))
  const sofaId = serviceIdBySlug.get('sofa-upholstery')
  if (!sofaId) throw new Error('Published sofa-upholstery service not found')

  const landing = sofaSeed.sofaUpholsteryLanding
  const related = (sofaSeed.relatedSlugs ?? [])
    .map((slug) => serviceIdBySlug.get(slug))
    .filter(exists)

  const data = {
    title: sofaSeed.title,
    summary: sofaSeed.summary,
    visualVariant: sofaSeed.visualVariant,
    presentationLabels: sofaSeed.presentationLabels,
    sofaUpholsteryLanding: {
      popularServices: landing.popularServices.map(({ imageFile, ...card }) => ({
        ...card,
        image: requireMedia(imageFile),
      })),
      fabricCards: landing.fabricCards.map(({ imageFile, ...card }) => ({
        ...card,
        image: requireMedia(imageFile),
      })),
      foamComfort: landing.foamComfort,
      bedTeaser: (({ imageFile, ...card }) => ({
        ...card,
        image: requireMedia(imageFile),
      }))(landing.bedTeaser),
    },
    hero: {
      eyebrow: sofaSeed.hero.eyebrow,
      heading: sofaSeed.hero.heading,
      copy: sofaSeed.hero.copy,
      image: requireMedia(sofaSeed.hero.imageFile),
    },
    trustItems: sofaSeed.trustItems.map((label) => ({ label })),
    details: sofaSeed.details,
    serviceOptions: sofaSeed.serviceOptions,
    featureSections: sofaSeed.featureSections.map((section, index) => ({
      ...section,
      bullets: section.bullets.map((text) => ({ text })),
      image: requireMedia(sofaSeed.galleryFiles[index] ?? sofaSeed.hero.imageFile),
    })),
    benefits: sofaSeed.benefits,
    materialsCapabilities: sofaSeed.materialsCapabilities,
    materialsHeading: sofaSeed.materialsHeading,
    process: sofaSeed.process,
    processHeading: sofaSeed.processHeading,
    comparison: sofaSeed.comparison
      ? {
          ...sofaSeed.comparison,
          leftItems: sofaSeed.comparison.leftItems.map((text) => ({ text })),
          rightItems: sofaSeed.comparison.rightItems.map((text) => ({ text })),
        }
      : undefined,
    faqs: sofaSeed.faqQuestions.map((question) => faqIdByQuestion.get(question)).filter(exists),
    serviceAreas: sofaSeed.serviceAreas.map((area) => ({ area })),
    gallery: sofaSeed.galleryFiles.map((filename) => ({ image: requireMedia(filename) })),
    galleryHeading: sofaSeed.galleryHeading,
    galleryIntro: sofaSeed.galleryIntro,
    serviceAreaHeading: sofaSeed.serviceAreaHeading,
    serviceAreaCopy: sofaSeed.serviceAreaCopy,
    areaLinkLabel: sofaSeed.areaLinkLabel,
    quotationContext: sofaSeed.quotationContext,
    whatsAppContext: sofaSeed.whatsAppContext,
    relatedHeading: sofaSeed.relatedHeading,
    relatedServices: related,
    seo: {
      title: sofaSeed.seo.title,
      description: sofaSeed.seo.description,
      canonicalURL: `${CANONICAL_ORIGIN}/sofa-upholstery/`,
      openGraphTitle: sofaSeed.seo.title,
      openGraphDescription: sofaSeed.seo.description,
      openGraphImage: requireMedia(sofaSeed.hero.imageFile),
      index: true,
      follow: true,
      schemaTypes: ['Service', 'BreadcrumbList', 'FAQPage'],
    },
    status: 'published' as const,
    _status: 'published' as const,
    publishedAt: new Date().toISOString(),
  }

  const seedContext = { disableRevalidate: true } as const

  await payload.update({
    collection: 'services',
    id: sofaId,
    // Seed-shaped payload matches the sofa CMS contract; cast keeps the cutover script focused.
    data: data as never,
    draft: false,
    overrideAccess: true,
    context: seedContext,
  })

  for (const [question] of SOFA_FAQS) {
    const faqId = faqIdByQuestion.get(question)
    if (!faqId) continue
    const current = await payload.findByID({
      collection: 'faqs',
      id: faqId,
      depth: 0,
      overrideAccess: true,
    })
    const currentIds = (current.services ?? []).map((value) =>
      typeof value === 'number' ? value : value.id,
    )
    if (currentIds.includes(sofaId)) continue
    await payload.update({
      collection: 'faqs',
      id: faqId,
      overrideAccess: true,
      context: seedContext,
      data: { services: [...new Set([...currentIds, sofaId])] },
    })
  }

  payload.logger.info(
    `sofa landing applied: service #${sofaId}, gallery=${SOFA_GALLERY_FILES.length}, faqs=${SOFA_FAQS.length}, media=${mediaByFile.size}`,
  )
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
