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
import { AREA_SEEDS } from '@/data/serviceAreas'

const seedDir = path.join(process.cwd(), 'src/seed')
const manifestPath = path.join(seedDir, 'media-manifest.json')

interface ManifestAsset {
  sourcePageURL?: string
  sourceSite?: string
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
  describe('approved sofa upholstery landing content', () => {
    const sofa = SERVICE_SEEDS.find(({ slug }) => slug === 'sofa-upholstery')!
    const landing = () => (sofa as typeof sofa & { sofaUpholsteryLanding?: { popularServices: { title: string; imageFile: string; comingSoon?: boolean; href?: string }[]; fabricCards: { title: string; imageFile: string; bestUse: string; comfort: string; durability: string }[]; foamComfort: { heading: string; ctaLabel: string }; bedTeaser: { label: string; href?: string } } }).sofaUpholsteryLanding

    it('supplies the approved hero, trust points and Ajman coverage', () => {
      expect(sofa.hero.heading).toBe('Sofa Upholstery in Dubai')
      expect(sofa.hero.copy).toBe('Renew worn sofas with new fabric, foam and finishing. We reupholster sofas, L-shaped seating, corner sofas, chairs and Majlis furniture for customers across Dubai, Sharjah and the UAE from our Ajman workshop.')
      expect(sofa.trustItems).toEqual(['Fabric & Foam Replacement', 'L-Shaped & Corner Sofas', 'Sofa Repair Available', 'Photo Quotation Available'])
      expect(sofa.serviceAreas).toEqual(['Palm Jumeirah', 'Dubai Marina', 'JBR', 'Emirates Hills', 'Dubai Hills Estate', 'JVC', 'Arabian Ranches', 'Business Bay', 'Downtown Dubai', 'JLT', 'Mirdif', 'Meydan', 'Sharjah', 'Ajman'])
      expect(sofa.serviceAreaCopy).toContain('Serving Dubai from our Ajman workshop.')
    })

    it('provides nine visual choices and five verified fabric options without a linked bed service', () => {
      expect(landing()?.popularServices.map(({ title }) => title)).toEqual(['Full Sofa Reupholstery', 'Fabric Replacement', 'Foam & Cushion Replacement', 'Sofa Repair & Frame Support', 'L-Shaped Sofa Upholstery', 'Corner Sofa Upholstery', 'Chair Upholstery', 'Majlis Cushion Upholstery', 'Bed & Headboard Upholstery'])
      expect(landing()?.popularServices.at(-1)).toMatchObject({ comingSoon: true })
      expect(landing()?.popularServices.at(-1)?.href).toBeUndefined()
      expect(landing()?.bedTeaser.label).toBe('Coming Soon')
      expect(landing()?.bedTeaser.href).toBeUndefined()
      expect(landing()?.fabricCards.map(({ title }) => title)).toEqual(['Chenille', 'Velvet', 'Boucle', 'Linen Blends', 'Durable Woven Fabrics'])
      for (const card of [...(landing()?.popularServices ?? []), ...(landing()?.fabricCards ?? [])]) expect(manifestFiles.has(card.imageFile)).toBe(true)
      expect(JSON.stringify(sofa)).not.toMatch(/\/bed-upholstery\//)
    })

    it('provides 8–16 relevant, licensed gallery assets with honest inspiration captions', () => {
      expect(sofa.galleryFiles.length).toBeGreaterThanOrEqual(8)
      expect(sofa.galleryFiles.length).toBeLessThanOrEqual(16)
      expect(new Set(sofa.galleryFiles).size).toBe(sofa.galleryFiles.length)
      for (const filename of sofa.galleryFiles) {
        const asset = manifest.assets.find((entry) => entry.filename === filename) as ManifestAsset & { caption: string; sourcePageURL: string; width: number; height: number }
        expect(asset).toBeDefined()
        expect(asset.alt?.length).toBeGreaterThan(20)
        expect(asset.licenseName).toBeTruthy()
        expect(asset.licenseName).toBe('Company-owned source asset')
        expect(asset.sourceSite).toBe('eco-furniture.ae')
        const inventory = JSON.parse(readFileSync(path.join(process.cwd(), 'docs/operations/eco-furniture-portfolio-inventory.json'), 'utf8')) as { categories: { imageURLs: string[] }[] }
        expect(inventory.categories.flatMap(({ imageURLs }) => imageURLs)).toContain(asset.sourcePageURL)
        expect(asset.caption).toMatch(/inspiration/i)
        expect(asset.width).toBeGreaterThan(0)
        expect(asset.height).toBeGreaterThan(0)
      }
      expect(sofa.galleryHeading).toBe('Sofa Upholstery Gallery')
      expect(JSON.stringify(sofa)).not.toMatch(/before.?after|Dubai workshop|performance fabrics|outdoor-rated|memory layers|costs less/i)
    })

    it('covers commercial FAQs with original scoped answers and exact process and quote intent', () => {
      expect(sofa.faqQuestions).toEqual(['Is sofa reupholstery cheaper than buying a new sofa?', 'Can you replace sofa foam?', 'Can you upholster L-shaped sofas?', 'Can you upholster corner sofas?', 'Can I provide my own fabric?', 'Which upholstery fabrics do you offer?', 'Can you repair the frame during upholstery?', 'How can I get a quotation?', 'Do you upholster chairs?', 'Do you upholster Majlis seating?', 'Do you offer bed upholstery?', 'Do you serve Dubai from Ajman?', 'Can I send sofa photos on WhatsApp?'])
      for (const question of sofa.faqQuestions) {
        const faq = FAQ_SEEDS.find((entry) => entry.question === question)
        expect(faq?.schemaEligible).toBe(true)
        expect(faq?.answer).not.toMatch(/AED|\d+\s*(days|hours)|guarantee|always cheaper/i)
      }
      expect(FAQ_SEEDS.find(({ question }) => question === 'Do you offer bed upholstery?')?.answer).toMatch(/coming soon/i)
      expect(sofa.process.map(({ title }) => title)).toEqual(['Send Sofa Photos', 'Choose Fabric & Foam', 'Strip, Repair & Upholster', 'Final Check & Handover'])
      expect(landing()?.foamComfort).toMatchObject({ heading: 'Restore Comfort, Not Just the Fabric', ctaLabel: 'Send Sofa Photos for Assessment' })
      expect(sofa.relatedSlugs).toEqual(['custom-furniture', 'custom-sofa', 'sofa-repair', 'curtains-blinds'])
      expect(sofa.relatedHeading).toBe('Related Furniture Services')
      expect(sofa.benefits.map(({ title }) => title)).toEqual(['Made in our Ajman workshop', 'Fabric and foam options', 'Photo quotation available', 'Frame assessment', 'Custom workmanship', 'Serving Dubai, Sharjah and UAE'])
      expect(sofa.presentationLabels).toMatchObject({ heroQuoteLabel: 'Get Free Quote', processCtaLabel: 'Get Your Sofa Quote', quoteWhatsAppLabel: 'WhatsApp Your Photos' })
      expect(sofa.quotationContext).toMatchObject({ heading: 'Get a Sofa Upholstery Quote', message: 'Send clear sofa photos, approximate measurements and your preferred fabric/style.', buttonLabel: 'Request My Sofa Quote' })
    })
  })
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
      expect(
        lexicalText(service.details).join(' ').length,
        `${service.slug} details`,
      ).toBeGreaterThan(250)
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

      const configuredAreas = [...AREA_SEEDS.map((area) => area.name), 'JBR', 'JVC', 'JLT']
      for (const area of service.serviceAreas) {
        expect(configuredAreas, `${service.slug} area ${area}`).toContain(area)
      }

      expect(service.hero.heading.toLowerCase()).toContain('dubai')
      expect(service.seo.title.toLowerCase()).toContain('dubai')
      expect(service.seo.description.length).toBeGreaterThan(120)
      expect(service.trustItems.length).toBeGreaterThanOrEqual(4)
      expect(service.serviceOptions.items.length).toBeGreaterThanOrEqual(4)
      expect(service.featureSections.length).toBeGreaterThanOrEqual(2)
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

  it('only references licensed media that exists on disk with the recorded checksum', () => {
    expect(manifest.assets.length).toBe(38)
    expect(manifestFiles.size).toBe(manifest.assets.length)

    for (const asset of manifest.assets) {
      expect(asset.creator.length, `${asset.filename} creator`).toBeGreaterThan(1)
      expect(asset.licenseName.length, `${asset.filename} license`).toBeGreaterThan(1)
      expect(asset.alt?.length ?? 0, `${asset.filename} alt text`).toBeGreaterThan(10)
      expect(asset.placeholder, `${asset.filename} placeholder flag`).toBe(!asset.filename.startsWith('sofa-eco-'))

      const absolute = path.join(
        process.cwd(),
        asset.localPath ?? path.join('src/seed/assets', asset.filename),
      )
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
      expect(service.hero.imageFile).toBe(service.slug === 'sofa-upholstery' ? 'sofa-eco-nivo.webp' : `service-${service.slug}-ai.webp`)

      for (const file of service.galleryFiles) {
        expect(manifestFiles, `${service.slug} gallery file ${file}`).toContain(file)
      }
    }
  })

  it('keeps every service gallery specific to that service', () => {
    for (const service of SERVICE_SEEDS) {
      if (service.slug === 'sofa-upholstery') continue // Dedicated gallery is covered above against the owned-media inventory.
      expect(service.galleryFiles, `${service.slug} gallery count`).toHaveLength(3)

      for (const filename of service.galleryFiles) {
        expect(filename, `${service.slug} should not show another service`).toContain(
          `service-${service.slug}`,
        )
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
    expect(contactInformation.openingHours.find(({ day }) => day === 'monday')).toMatchObject({
      closed: false,
      closes: '23:00',
      opens: '09:00',
    })
    expect(contactInformation.openingHours.find(({ day }) => day === 'friday')).toMatchObject({
      closed: true,
    })
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
    const privacyCopy = lexicalText(privacy?.layout).join(' ')
    expect(privacyCopy).toContain(BUSINESS.email)
    expect(privacyCopy).toContain('Google Analytics')
    expect(privacyCopy).toContain('Google Tag Manager')
    expect(privacyCopy.toLowerCase()).toContain('optional analytics and advertising measurement')
    expect(privacyCopy).toContain('Cookie Settings')
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
    // Global fallback copy stays at 160; record search/social descriptions
    // accept up to 180 so the approved sofa record seeds without truncation.
    expect(GLOBAL_SEEDS.seoDefaults.fallbackDescription.length).toBeLessThanOrEqual(160)
    expect(GLOBAL_SEEDS.seoDefaults.titlePattern.length).toBeLessThanOrEqual(80)

    for (const service of SERVICE_SEEDS) {
      expect(service.seo.title.length, `${service.slug} seo title`).toBeLessThanOrEqual(60)
      expect(service.seo.description.length, `${service.slug} meta description`).toBeLessThanOrEqual(180)
      expect(service.hero.heading.length, `${service.slug} H1`).toBeGreaterThan(10)
      expect(service.galleryFiles.length, `${service.slug} supporting images`).toBeGreaterThanOrEqual(3)
    }
  })
})
