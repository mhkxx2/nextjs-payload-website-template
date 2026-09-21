import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  BUSINESS,
  FAQ_GROUPS,
  HOMEPAGE_BLOCK_ORDER,
  MEDIA_USAGE,
  SERVICE_AREAS,
  type HomepageBlockType,
} from '@/seed/business'
import { SERVICE_SEEDS } from '@/seed/services'
import { FAQ_SEEDS, GLOBAL_SEEDS, PAGE_SEEDS, buildHomepageLayout } from '@/seed/site'

const seedDir = path.join(process.cwd(), 'src/seed')
const manifestPath = path.join(seedDir, 'media-manifest.json')

interface ManifestAsset {
  key: string
  filename: string
  creator: string
  licenseName: string
  alt?: string
  sha256?: string
  placeholder?: boolean
  localPath?: string
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { assets: ManifestAsset[] }
const manifestFiles = new Set(manifest.assets.map((asset) => asset.filename))

const APPROVED_SERVICE_SLUGS = [
  'curtains-blinds',
  'custom-beds-headboards',
  'custom-furniture',
  'custom-sofa',
  'custom-wardrobes',
  'majlis-furniture',
  'office-furniture',
  'sofa-repair',
  'sofa-upholstery',
]

/** Every string stored in a Lexical rich-text value. */
const lexicalText = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(lexicalText)
  if (!value || typeof value !== 'object') return []

  const node = value as Record<string, unknown>
  const collected: string[] = typeof node.text === 'string' ? [node.text] : []

  for (const [key, child] of Object.entries(node)) {
    if (key === 'text') continue
    collected.push(...lexicalText(child))
  }

  return collected
}

/** Copy that must not claim anything the business has not supplied. */
const UNSUPPORTED_CLAIMS = [
  /\bbest\b/i,
  /\bcheapest\b/i,
  /\bguarantee/i,
  /\baward[- ]winning\b/i,
  /\b#1\b/,
  /\bnumber one\b/i,
  /\bworld[- ]class\b/i,
  /\byears of experience\b/i,
  /\b\d+\s*\+?\s*(years|clients|customers|projects|sofas)\b/i,
  /\b100%\b/,
  /\blimited[- ]time\b/i,
  /\bdiscount(ed)?\b/i,
  /★|\bstar rating\b/i,
]

const SEEDED_PROSE: string[] = [
  ...SERVICE_SEEDS.flatMap((service) => [
    service.title,
    service.summary,
    service.hero.eyebrow,
    service.hero.heading,
    service.hero.copy,
    ...service.benefits.flatMap((benefit) => [benefit.title, benefit.description]),
    ...service.materialsCapabilities.flatMap((entry) => [entry.title, entry.description]),
    ...service.process.flatMap((step) => [step.title, step.description]),
    service.quotationContext.heading,
    service.quotationContext.message,
    service.whatsAppContext.label,
    service.whatsAppContext.message,
    ...lexicalText(service.details),
  ]),
  ...FAQ_SEEDS.flatMap((faq) => [faq.question, faq.answer]),
  ...PAGE_SEEDS.flatMap((page) => [
    page.title,
    ...lexicalText(page.hero.richText),
    ...lexicalText(page.layout.filter((block) => block.blockType !== 'faqs')),
  ]),
  GLOBAL_SEEDS.siteSettings.brandName,
  GLOBAL_SEEDS.seoDefaults.fallbackDescription,
  GLOBAL_SEEDS.seoDefaults.organizationSchema.description,
  GLOBAL_SEEDS.footer.supportingCopy,
  GLOBAL_SEEDS.footer.conversionContent.heading,
  GLOBAL_SEEDS.footer.conversionContent.copy,
]

describe('seeded launch content', () => {
  it('publishes exactly the nine approved service slugs', () => {
    const slugs = SERVICE_SEEDS.map((service) => service.slug).sort()
    expect(slugs).toEqual(APPROVED_SERVICE_SLUGS)
  })

  it('gives every service complete, distinct copy', () => {
    const summaries = new Set<string>()
    const details = new Set<string>()

    for (const service of SERVICE_SEEDS) {
      expect(service.title.length, `${service.slug} title`).toBeGreaterThan(3)
      expect(service.summary.length, `${service.slug} summary`).toBeGreaterThan(80)
      expect(service.hero.heading.length, `${service.slug} hero heading`).toBeGreaterThan(3)
      expect(service.hero.copy.length, `${service.slug} hero copy`).toBeGreaterThan(60)
      expect(lexicalText(service.details).join(' ').length, `${service.slug} details`).toBeGreaterThan(
        250,
      )
      expect(service.benefits.length, `${service.slug} benefits`).toBeGreaterThanOrEqual(3)
      expect(
        service.materialsCapabilities.length,
        `${service.slug} materials`,
      ).toBeGreaterThanOrEqual(2)
      expect(service.process.length, `${service.slug} process`).toBeGreaterThanOrEqual(3)
      expect(service.faqQuestions.length, `${service.slug} faqs`).toBeGreaterThanOrEqual(2)
      expect(service.galleryFiles.length, `${service.slug} gallery`).toBeGreaterThanOrEqual(2)
      expect(service.quotationContext.message.length).toBeGreaterThan(40)
      expect(service.whatsAppContext.message.length).toBeGreaterThan(30)

      for (const benefit of service.benefits) {
        expect(benefit.title.length).toBeGreaterThan(3)
        expect(benefit.description.length).toBeGreaterThan(30)
      }

      for (const step of service.process) {
        expect(step.title.length).toBeGreaterThan(3)
        expect(step.description.length).toBeGreaterThan(30)
      }

      summaries.add(service.summary)
      details.add(lexicalText(service.details).join(' '))

      for (const related of service.relatedSlugs) {
        expect(APPROVED_SERVICE_SLUGS, `${service.slug} related`).toContain(related)
        expect(related).not.toBe(service.slug)
      }

      for (const area of service.serviceAreas) {
        expect(SERVICE_AREAS, `${service.slug} area ${area}`).toContain(area)
      }
    }

    expect(summaries.size).toBe(SERVICE_SEEDS.length)
    expect(details.size).toBe(SERVICE_SEEDS.length)
  })

  it('links every service to FAQs and every FAQ back to a service', () => {
    const slugs = new Set(SERVICE_SEEDS.map((service) => service.slug))
    const questions = new Set<string>()
    const referenced = new Set<string>()

    for (const faq of FAQ_SEEDS) {
      expect(questions.has(faq.question), `duplicate FAQ: ${faq.question}`).toBe(false)
      questions.add(faq.question)
      expect(faq.answer.length, `FAQ answer too short: ${faq.question}`).toBeGreaterThan(120)
      expect(FAQ_GROUPS, `FAQ group: ${faq.question}`).toContain(faq.group)
      // Only the general FAQ may stand without a service link; everything else
      // has to belong to at least one service page.
      expect(
        faq.serviceSlugs.length,
        `FAQ without a service: ${faq.question}`,
      ).toBeGreaterThanOrEqual(faq.group === 'general' ? 0 : 1)

      for (const slug of faq.serviceSlugs) {
        expect(slugs, `FAQ references unknown service: ${slug}`).toContain(slug)
        referenced.add(slug)
      }
    }

    for (const service of SERVICE_SEEDS) {
      expect(service.faqQuestions.length).toBeGreaterThanOrEqual(2)

      for (const question of service.faqQuestions) {
        expect(questions, `${service.slug} references unknown FAQ: ${question}`).toContain(question)
      }

      expect(referenced.has(service.slug), `${service.slug} has no published FAQ`).toBe(true)
    }
  })

  it('keeps the homepage block order the owned design expects', () => {
    const layout = buildHomepageLayout({
      faqIds: [1, 2, 3],
      media: { hero: 11, about: 12 },
    })

    const blockTypes = layout.map((block) => block.blockType as HomepageBlockType)
    expect(blockTypes).toEqual([...HOMEPAGE_BLOCK_ORDER])

    const faqsBlock = layout.find((block) => block.blockType === 'faqs')
    expect(faqsBlock?.faqs).toEqual([1, 2, 3])
    expect(faqsBlock?.enableSchema).toBe(true)

    // Nothing may publish reviews or figures the business has not supplied.
    expect(blockTypes).not.toContain('statistics')
    const testimonials = layout.find((block) => block.blockType === 'testimonials')
    expect(testimonials).toBeDefined()
    expect(testimonials?.displayMode).toBe('grid')
    expect(Object.keys(testimonials ?? {})).not.toContain('testimonials')

    const hero = layout.find((block) => block.blockType === 'hero')
    expect(hero?.media).toBe(11)

    const split = layout.find((block) => block.blockType === 'splitContent')
    expect(split?.media).toBe(12)
  })

  it('only references placeholder media that exists on disk with the recorded checksum', () => {
    expect(manifest.assets.length).toBe(12)
    expect(manifestFiles.size).toBe(manifest.assets.length)

    for (const asset of manifest.assets) {
      expect(asset.creator.length, `${asset.filename} creator`).toBeGreaterThan(1)
      expect(asset.licenseName.length, `${asset.filename} license`).toBeGreaterThan(1)
      expect(asset.alt?.length ?? 0, `${asset.filename} alt text`).toBeGreaterThan(10)
      expect(asset.placeholder, `${asset.filename} placeholder flag`).toBe(true)

      const absolute = path.join(process.cwd(), asset.localPath ?? path.join('src/seed/assets', asset.filename))
      expect(existsSync(absolute), `${asset.filename} is missing on disk`).toBe(true)

      const digest = createHash('sha256').update(readFileSync(absolute)).digest('hex')
      expect(digest, `${asset.filename} checksum`).toBe(asset.sha256)
    }

    const required = [
      MEDIA_USAGE.hero,
      MEDIA_USAGE.about,
      MEDIA_USAGE.openGraph,
      ...SERVICE_SEEDS.map((service) => MEDIA_USAGE.service(service.slug)),
    ]

    for (const filename of required) {
      expect(manifestFiles, `${filename} is not in the manifest`).toContain(filename)
    }

    for (const service of SERVICE_SEEDS) {
      expect(service.hero.imageFile).toBe(MEDIA_USAGE.service(service.slug))

      for (const file of service.galleryFiles) {
        expect(manifestFiles, `${service.slug} gallery file ${file}`).toContain(file)
      }
    }
  })

  it('states only the business facts confirmed on the Maps listing', () => {
    const { contactInformation, siteSettings, seoDefaults, socialMedia, footer } = GLOBAL_SEEDS

    expect(contactInformation.phoneE164).toBe(BUSINESS.phoneE164)
    expect(contactInformation.phoneE164).toMatch(/^\+9715\d{8}$/)
    expect(contactInformation.whatsappE164).toBe(BUSINESS.whatsappE164)
    expect(contactInformation.email).toBe('info@alruknfurniture.ae')
    expect(contactInformation.address.city).toBe('Ajman')
    expect(contactInformation.address.line1).toContain('Al Jerf 1')
    expect(contactInformation.mapURL).toContain('6740373205854748574')
    expect(contactInformation.openingHours).toHaveLength(7)
    expect(contactInformation.serviceAreas.map((entry) => entry.area)).toEqual([...SERVICE_AREAS])

    expect(siteSettings.canonicalSiteURL).toBe('https://alruknfurniture.ae')
    expect(siteSettings.businessName).toBe('AL RUKN FURNITURE UPHOLSTERY')
    expect(siteSettings.announcement.enabled).toBe(false)
    expect(siteSettings.locale.direction).toBe('ltr')

    expect(seoDefaults.index).toBe(true)
    expect(seoDefaults.follow).toBe(true)

    // No social profile was supplied by the business, so none is published.
    expect(socialMedia.links).toEqual([])

    expect(footer.supportingCopy.length).toBeLessThanOrEqual(400)
    expect(footer.conversionContent.copy.length).toBeLessThanOrEqual(300)
  })

  it('ships the pages the routes need with canonical URLs', () => {
    const slugs = PAGE_SEEDS.map((page) => page.slug).sort()
    expect(slugs).toEqual(['home', 'privacy', 'terms'])

    const home = PAGE_SEEDS.find((page) => page.slug === 'home')
    expect(home?.canonicalPath).toBe('/')

    const privacy = PAGE_SEEDS.find((page) => page.slug === 'privacy')
    expect(privacy?.canonicalPath).toBe('/privacy/')
    expect(lexicalText(privacy?.layout).join(' ')).toContain(BUSINESS.email)
  })

  it('never claims anything beyond the verified business facts', () => {
    for (const copy of SEEDED_PROSE) {
      for (const pattern of UNSUPPORTED_CLAIMS) {
        expect(pattern.test(copy), `unsupported claim ${pattern} in: ${copy.slice(0, 120)}`).toBe(
          false,
        )
      }
    }
  })

  it('keeps seeded meta copy inside the character caps the schema enforces', () => {
    // `seo.description` and `SEODefaults.fallbackDescription` are capped at 160
    // characters, so over-long seed copy is rejected at create time.
    expect(GLOBAL_SEEDS.seoDefaults.fallbackDescription.length).toBeLessThanOrEqual(160)
    expect(GLOBAL_SEEDS.seoDefaults.titlePattern.length).toBeLessThanOrEqual(80)

    for (const service of SERVICE_SEEDS) {
      expect(service.title.length, `${service.slug} seo title`).toBeLessThanOrEqual(44)
      expect(service.summary.slice(0, 160).length, `${service.slug} meta description`).toBeLessThanOrEqual(
        160,
      )
    }
  })
})
