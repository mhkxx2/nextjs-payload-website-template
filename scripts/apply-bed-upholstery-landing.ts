/**
 * Production content cutover for /bed-upholstery/ and sofa bed cross-links.
 *
 * - Uploads or reuses bed seed assets from src/seed/assets/bed-upholstery/
 * - Reuses manifest Media for shared service images
 * - Creates bed FAQs and publishes the bed-upholstery Service
 * - Updates sofa-upholstery bed teaser and bed popular card to live links
 *
 * Usage:
 *   pnpm exec tsx scripts/apply-bed-upholstery-landing.ts
 */
import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import { getPayload, type Where } from 'payload'

import config from '../src/payload.config'
import {
  BED_FAQS,
  BED_GALLERY_FILES,
  BED_SERVICE_SEED,
} from '../src/seed/bedUpholsteryContent'
import { SOFA_FAQS, SOFA_LANDING_SEED } from '../src/seed/sofaUpholsteryContent'
import { FAQ_SEEDS } from '../src/seed/site'

type ManifestEntry = {
  key: string
  filename: string
  sourceSite?: string
  sourcePageURL?: string
  licenseName: string
  alt?: string
}

type BedAssetMeta = {
  key: string
  filename: string
  alt: string
  licenseName: string
  creator: string
  caption: string
  sourceURL: string
  sourceSite?: string
}

const BED_ASSET_META: BedAssetMeta[] = [
  {
    key: 'bed-upholstery-dubai-hero',
    filename: 'bed-upholstery-dubai-hero.webp',
    alt: 'Upholstered bed and headboard in a calm bedroom with neutral fabric',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — bedroom inspiration',
    caption: 'Royalty-free bedroom inspiration; not a completed Al Rukn customer project.',
    sourceURL: 'https://unsplash.com/photos/a-bed-sitting-in-a-bedroom-next-to-a-window-dLlg3m-2e6g',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'headboard-upholstery-dubai',
    filename: 'headboard-upholstery-dubai.webp',
    alt: 'Padded headboard with tailored upholstery fabric in a bedroom setting',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — headboard inspiration',
    caption: 'Licensed inspiration photography for headboard upholstery styles.',
    sourceURL: 'https://unsplash.com/photos/a-bedroom-with-a-large-bed-and-a-painting-on-the-wall-mR1CIDduGLc',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'tufted-headboard',
    filename: 'tufted-headboard.webp',
    alt: 'Tufted upholstered headboard with button detail',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — tufted headboard',
    caption: 'Tufted headboard style inspiration.',
    sourceURL: 'https://unsplash.com/photos/white-bed-linen-with-throw-pillows-2d4lAQKubGY',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'wingback-bed-upholstery',
    filename: 'wingback-bed-upholstery.webp',
    alt: 'Wingback upholstered headboard with curved profile',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — wingback bed',
    caption: 'Wingback profile inspiration for reupholstery enquiries.',
    sourceURL: 'https://unsplash.com/photos/brown-wooden-bed-frame-with-white-cover-beside-white-wooden-nightstand-ZVprbBmT8Bg',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'platform-upholstered-bed',
    filename: 'platform-upholstered-bed.webp',
    alt: 'Low platform bed with upholstered surround',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — platform bed',
    caption: 'Platform bed upholstery inspiration.',
    sourceURL: 'https://unsplash.com/photos/white-bed-linen-near-white-wooden-door-2y6c_2bqyzI',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'upholstered-bed-frame',
    filename: 'upholstered-bed-frame.webp',
    alt: 'Bed frame with padded upholstery panels',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — upholstered frame',
    caption: 'Frame upholstery inspiration.',
    sourceURL: 'https://unsplash.com/photos/white-bed-near-white-wooden-door-5i0GnoTTjSE',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'velvet-upholstered-bed',
    filename: 'velvet-upholstered-bed.webp',
    alt: 'Velvet upholstered bed with soft pile finish',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — velvet bed',
    caption: 'Velvet bedroom fabric inspiration.',
    sourceURL: 'https://unsplash.com/photos/brown-wooden-bed-frame-with-white-cover-beside-brown-wooden-nightstand-8sOZJ8JF0S8',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'channel-headboard-detail',
    filename: 'channel-headboard-detail.webp',
    alt: 'Channel stitched headboard detail with vertical padding',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — channel headboard',
    caption: 'Channel headboard detail inspiration.',
    sourceURL: 'https://unsplash.com/photos/white-bed-linen-with-throw-pillows-jTEKhAY2jDI',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'padded-wall-headboard',
    filename: 'padded-wall-headboard.webp',
    alt: 'Wall-to-wall padded headboard panel behind the bed',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — wall headboard',
    caption: 'Wall-padded headboard inspiration.',
    sourceURL: 'https://unsplash.com/photos/white-bed-linen-near-white-wooden-door-gREquCUXQLI',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'bedroom-fabric-detail',
    filename: 'bedroom-fabric-detail.webp',
    alt: 'Close-up of woven bedroom upholstery fabric on a headboard',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — fabric detail',
    caption: 'Bedroom fabric texture inspiration.',
    sourceURL: 'https://unsplash.com/photos/white-and-brown-floral-textile-WNoLnJo7tS8',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'boucle-bedroom-texture',
    filename: 'boucle-bedroom-texture.webp',
    alt: 'Boucle textured upholstery on bedroom furniture',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — boucle texture',
    caption: 'Boucle texture inspiration for bedroom upholstery.',
    sourceURL: 'https://unsplash.com/photos/a-living-room-filled-with-furniture-and-a-large-window-ZVheosSjgTo',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'neutral-fabric-bed',
    filename: 'neutral-fabric-bed.webp',
    alt: 'Neutral linen-blend fabric on an upholstered bed',
    licenseName: 'Unsplash License',
    creator: 'Unsplash contributor — neutral bedroom',
    caption: 'Neutral bedroom fabric inspiration.',
    sourceURL: 'https://unsplash.com/photos/white-bed-linen-with-white-comforter-and-pillows-2d4lAQKubGY',
    sourceSite: 'unsplash.com',
  },
  {
    key: 'bed-upholstery-before-worn',
    filename: 'bed-upholstery-before-worn.webp',
    alt: 'Worn headboard fabric showing fading and flattening — inspiration only',
    licenseName: 'AI-generated original — OpenAI Terms of Use',
    creator: 'AI-generated editorial illustration',
    caption: 'Before renewal inspiration; not a specific client project.',
    sourceURL: 'https://openai.com/index/image-generation-api/',
    sourceSite: 'openai.com',
  },
  {
    key: 'bed-upholstery-after-renewed',
    filename: 'bed-upholstery-after-renewed.webp',
    alt: 'Refreshed headboard upholstery with renewed fabric — inspiration only',
    licenseName: 'AI-generated original — OpenAI Terms of Use',
    creator: 'AI-generated editorial illustration',
    caption: 'After renewal inspiration; not a specific client project.',
    sourceURL: 'https://openai.com/index/image-generation-api/',
    sourceSite: 'openai.com',
  },
]


const readManifest = (): { assets: ManifestEntry[] } =>
  JSON.parse(readFileSync(path.join(root, 'src/seed/media-manifest.json'), 'utf8'))

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const bedAssetsDir = path.join(root, 'src/seed/assets/bed-upholstery')
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
  const payload = await getPayload({ config })
  const manifest = readManifest()
  const mediaByFile = new Map<string, number>()

  const resolveManifestMedia = async (filename: string): Promise<number> => {
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
        `Required Media not found for ${filename}. Import manifest media first or run full seed.`,
      )
    }
    mediaByFile.set(filename, doc.id)
    return doc.id
  }

  const owner = await payload.findByID({
    collection: 'users',
    id: 1,
    depth: 0,
    overrideAccess: true,
  })

  const resolveBedAsset = async (meta: BedAssetMeta): Promise<number> => {
    if (mediaByFile.has(meta.filename)) return mediaByFile.get(meta.filename)!
    const marker = `seed-asset:${meta.key}`
    const filePath = path.join(bedAssetsDir, meta.filename)
    if (!existsSync(filePath)) throw new Error(`Bed asset missing: ${filePath}`)

    const found = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { sourceNotes: { contains: `${marker} ·` } },
    })
    const existing = found.docs[0]
    const buffer = readFileSync(filePath)
    const checksum = createHash('sha256').update(buffer).digest('hex')
    const sourceNotes = [
      marker,
      'Bed upholstery landing cutover',
      `Creator: ${meta.creator}`,
      `Checksum (sha256): ${checksum}`,
      meta.licenseName.includes('AI')
        ? 'AI-generated editorial illustration — replace with own photography when available.'
        : 'Unsplash-licensed bedroom inspiration; not completed Al Rukn customer work.',
    ].join(' · ')

    const data = {
      alt: meta.alt,
      license: meta.licenseName,
      sourceURL: meta.sourceURL,
      sourceSite: meta.sourceSite,
      sourceNotes,
      decorative: false,
      uploadedBy: owner.id,
    }

    if (existing) {
      const updated = await payload.update({
        collection: 'media',
        id: existing.id,
        overrideAccess: true,
        context: { disableRevalidate: true },
        user: owner,
        data,
      })
      mediaByFile.set(meta.filename, updated.id)
      return updated.id
    }

    const created = await payload.create({
      collection: 'media',
      overrideAccess: true,
      context: { disableRevalidate: true },
      user: owner,
      data,
      filePath,
    })
    mediaByFile.set(meta.filename, created.id)
    payload.logger.info(`uploaded bed media: ${meta.filename}`)
    return created.id
  }

  for (const meta of BED_ASSET_META) {
    await resolveBedAsset(meta)
  }

  await resolveManifestMedia('service-custom-beds-headboards-detail-ai.webp')

  const requireMedia = (filename: string) => {
    const id = mediaByFile.get(filename)
    if (!id) throw new Error(`Media unresolved: ${filename}`)
    return id
  }

  const faqIdByQuestion = new Map<string, number>()
  for (const [question, answer] of BED_FAQS) {
    const existing = await payload.find({
      collection: 'faqs',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { question: { equals: question } },
    })
    const current = existing.docs[0]
    if (current) {
      await payload.update({
        collection: 'faqs',
        id: current.id,
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: { answer, status: 'published', _status: 'published' },
      })
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
        order: seedMeta?.order ?? 910,
        schemaEligible: seedMeta?.schemaEligible ?? true,
        status: 'published',
        _status: 'published',
        publishedAt: new Date().toISOString(),
      },
    })
    faqIdByQuestion.set(question, created.id)
  }

  const landing = BED_SERVICE_SEED.bedUpholsteryLanding
  const relatedSlugs = BED_SERVICE_SEED.relatedSlugs
  const services = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 30,
    overrideAccess: true,
    where: { slug: { in: ['bed-upholstery', 'sofa-upholstery', ...relatedSlugs] } },
  })
  const serviceIdBySlug = new Map(services.docs.map((doc) => [doc.slug, doc.id]))
  let bedId = serviceIdBySlug.get('bed-upholstery')
  const related = relatedSlugs.map((slug) => serviceIdBySlug.get(slug)).filter(exists)

  const bedData = {
    title: BED_SERVICE_SEED.title,
    slug: 'bed-upholstery',
    summary: BED_SERVICE_SEED.summary,
    visualVariant: BED_SERVICE_SEED.visualVariant,
    presentationLabels: BED_SERVICE_SEED.presentationLabels,
    bedUpholsteryLanding: {
      upholsteryTypes: landing.upholsteryTypes,
      popularServices: landing.popularServices.map(({ imageFile, ...card }) => ({
        ...card,
        image: requireMedia(imageFile),
      })),
      fabricCards: landing.fabricCards.map(({ imageFile, ...card }) => ({
        ...card,
        image: requireMedia(imageFile),
      })),
      headboardStyles: landing.headboardStyles.map(({ imageFile, ...card }) => ({
        ...card,
        image: requireMedia(imageFile),
      })),
      paddingComfort: {
        ...landing.paddingComfort,
        items: landing.paddingComfort.items?.map((text) =>
          typeof text === 'string' ? { text } : text,
        ),
      },
      beforeAfter: {
        heading: landing.beforeAfter.heading,
        copy: landing.beforeAfter.copy,
        beforeCaption: landing.beforeAfter.beforeCaption,
        afterCaption: landing.beforeAfter.afterCaption,
        beforeImage: requireMedia(landing.beforeAfter.beforeImageFile),
        afterImage: requireMedia(landing.beforeAfter.afterImageFile),
      },
    },
    hero: {
      eyebrow: BED_SERVICE_SEED.hero.eyebrow,
      heading: BED_SERVICE_SEED.hero.heading,
      copy: BED_SERVICE_SEED.hero.copy,
      image: requireMedia(BED_SERVICE_SEED.hero.imageFile),
    },
    trustItems: BED_SERVICE_SEED.trustItems.map((label) => ({ label })),
    details: BED_SERVICE_SEED.details,
    serviceOptions: BED_SERVICE_SEED.serviceOptions,
    benefits: BED_SERVICE_SEED.benefits,
    materialsHeading: BED_SERVICE_SEED.materialsHeading,
    process: BED_SERVICE_SEED.process,
    processHeading: BED_SERVICE_SEED.processHeading,
    comparison: {
      ...BED_SERVICE_SEED.comparison,
      leftItems: BED_SERVICE_SEED.comparison.leftItems.map((text) => ({ text })),
      rightItems: BED_SERVICE_SEED.comparison.rightItems.map((text) => ({ text })),
    },
    faqs: BED_SERVICE_SEED.faqQuestions.map((question) => faqIdByQuestion.get(question)).filter(exists),
    serviceAreas: BED_SERVICE_SEED.serviceAreas.map((area) => ({ area })),
    gallery: BED_GALLERY_FILES.map((filename) => ({ image: requireMedia(filename) })),
    galleryHeading: BED_SERVICE_SEED.galleryHeading,
    galleryIntro: BED_SERVICE_SEED.galleryIntro,
    serviceAreaHeading: BED_SERVICE_SEED.serviceAreaHeading,
    serviceAreaCopy: BED_SERVICE_SEED.serviceAreaCopy,
    areaLinkLabel: BED_SERVICE_SEED.areaLinkLabel,
    quotationContext: BED_SERVICE_SEED.quotationContext,
    whatsAppContext: BED_SERVICE_SEED.whatsAppContext,
    relatedHeading: BED_SERVICE_SEED.relatedHeading,
    relatedServices: related,
    seo: {
      title: BED_SERVICE_SEED.seo.title,
      description: BED_SERVICE_SEED.seo.description,
      canonicalURL: `${CANONICAL_ORIGIN}/bed-upholstery/`,
      openGraphTitle: BED_SERVICE_SEED.seo.title,
      openGraphDescription: BED_SERVICE_SEED.seo.description,
      openGraphImage: requireMedia(BED_SERVICE_SEED.hero.imageFile),
      index: true,
      follow: true,
      schemaTypes: ['Service', 'BreadcrumbList', 'FAQPage'],
    },
    status: 'published' as const,
    _status: 'published' as const,
    publishedAt: new Date().toISOString(),
  }

  const seedContext = { disableRevalidate: true } as const

  if (bedId) {
    await payload.update({
      collection: 'services',
      id: bedId,
      data: bedData as never,
      draft: false,
      overrideAccess: true,
      context: seedContext,
    })
  } else {
    const created = await payload.create({
      collection: 'services',
      data: bedData as never,
      draft: false,
      overrideAccess: true,
      context: seedContext,
    })
    bedId = created.id
    serviceIdBySlug.set('bed-upholstery', bedId)
  }

  const sofaId = serviceIdBySlug.get('sofa-upholstery')
  if (sofaId) {
    const sofaDoc = await payload.findByID({
      collection: 'services',
      id: sofaId,
      depth: 0,
      overrideAccess: true,
    })
    const sofaLanding = sofaDoc.sofaUpholsteryLanding
    const bedPopularSeed = SOFA_LANDING_SEED.popularServices.find(
      (card) => card.title === 'Bed & Headboard Upholstery',
    )
    const popularServices = (sofaLanding?.popularServices ?? []).map((card) => {
      if (card?.title !== 'Bed & Headboard Upholstery') return card
      return {
        ...card,
        comingSoon: false,
        href: '/bed-upholstery/',
        ctaLabel: bedPopularSeed?.ctaLabel || 'Explore Bed Upholstery',
        description: bedPopularSeed?.description || card.description,
      }
    })
    const bedTeaser = {
      ...SOFA_LANDING_SEED.bedTeaser,
      image: requireMedia(SOFA_LANDING_SEED.bedTeaser.imageFile),
    }
    const { imageFile: _bedImage, ...bedTeaserFields } = bedTeaser as typeof bedTeaser & {
      imageFile?: string
    }

    const bedFaqQuestion = 'Do you offer bed upholstery?'
    const bedFaqAnswer = SOFA_FAQS.find(([q]) => q === bedFaqQuestion)?.[1]
    if (bedFaqAnswer) {
      const bedFaq = await payload.find({
        collection: 'faqs',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { question: { equals: bedFaqQuestion } },
      })
      if (bedFaq.docs[0]) {
        await payload.update({
          collection: 'faqs',
          id: bedFaq.docs[0].id,
          overrideAccess: true,
          context: seedContext,
          data: { answer: bedFaqAnswer },
        })
      }
    }

    await payload.update({
      collection: 'services',
      id: sofaId,
      overrideAccess: true,
      context: seedContext,
      data: {
        sofaUpholsteryLanding: {
          ...sofaLanding,
          popularServices,
          bedTeaser: bedTeaserFields,
        },
      },
    })
  }

  for (const [question] of BED_FAQS) {
    const faqId = faqIdByQuestion.get(question)
    if (!faqId || !bedId) continue
    const current = await payload.findByID({
      collection: 'faqs',
      id: faqId,
      depth: 0,
      overrideAccess: true,
    })
    const currentIds = (current.services ?? []).map((value) =>
      typeof value === 'number' ? value : value.id,
    )
    if (currentIds.includes(bedId)) continue
    await payload.update({
      collection: 'faqs',
      id: faqId,
      overrideAccess: true,
      context: seedContext,
      data: { services: [...new Set([...currentIds, bedId])] },
    })
  }

  payload.logger.info(
    `bed landing applied: service #${bedId}, gallery=${BED_GALLERY_FILES.length}, faqs=${BED_FAQS.length}`,
  )
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
