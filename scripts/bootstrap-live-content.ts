import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { cmsFallbacks } from '@/data/cmsFallbacks'
import { fillEmptyFields } from '@/lib/fillEmptyFields'
import type { AboutPage, ArchiveSetting, ContactPage, Homepage, Service } from '@/payload-types'

const context = { disableRevalidate: true } as const
const locale = 'en' as const

const changed = (before: unknown, after: unknown): boolean =>
  JSON.stringify(before) !== JSON.stringify(after)

const mediaID = (value: unknown): number | undefined => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value && typeof value.id === 'number') {
    return value.id
  }
  return undefined
}

const archiveCTA = {
  description: cmsFallbacks.archives.services.cta.description,
  eyebrow: 'Start with a photo or idea',
  heading: cmsFallbacks.archives.services.cta.heading,
  primaryLabel: cmsFallbacks.archives.services.cta.buttonText,
  whatsAppLabel: 'WhatsApp Us',
}

const archiveGroup = (
  archive: (typeof cmsFallbacks.archives)['blog' | 'projects' | 'services'],
  seoTitle: string,
) => ({
  cta: archiveCTA,
  emptyState: archive.emptyMessage,
  heading: archive.heading,
  introduction: archive.intro,
  seo: { description: archive.intro, title: seoTitle },
})

async function main() {
  const payload = await getPayload({ config: configPromise })

  try {
    const [homepage, about, contact, archives, servicesResult] = await Promise.all([
      payload.findGlobal({ slug: 'homepage', depth: 0, draft: false, locale, overrideAccess: true }),
      payload.findGlobal({ slug: 'about-page', depth: 0, draft: false, locale, overrideAccess: true }),
      payload.findGlobal({ slug: 'contact-page', depth: 0, draft: false, locale, overrideAccess: true }),
      payload.findGlobal({ slug: 'archive-settings', depth: 0, draft: false, locale, overrideAccess: true }),
      payload.find({
        collection: 'services',
        depth: 1,
        draft: false,
        limit: 100,
        locale,
        overrideAccess: true,
        pagination: false,
        where: { _status: { equals: 'published' } },
      }),
    ])

    const services = servicesResult.docs as Service[]
    const customFurniture = services.find(({ slug }) => slug === 'custom-furniture')
    const heroImage = mediaID(customFurniture?.hero?.image)
    const workshopImage = mediaID(
      customFurniture?.gallery?.find(({ image }) =>
        typeof image === 'object' && image.filename?.includes('about-workshop'),
      )?.image ?? customFurniture?.gallery?.[0]?.image ?? customFurniture?.hero?.image,
    )

    const { heading: _quoteFormHeading, ...quoteFormLabels } = cmsFallbacks.homepage.quoteForm
    const homepageBootstrap = {
      quoteForm: {
        ...quoteFormLabels,
        emailLabel: 'Email (optional)',
      },
      sharedLabels: cmsFallbacks.homepage.sharedLabels,
    }
    const nextHomepage = {
      quoteForm: fillEmptyFields(homepage.quoteForm ?? {}, homepageBootstrap.quoteForm),
      sharedLabels: fillEmptyFields(homepage.sharedLabels ?? {}, homepageBootstrap.sharedLabels),
    } satisfies Partial<Homepage>

    const aboutBootstrap = {
      _status: 'published',
      coverageSection: {
        eyebrow: 'Across the UAE',
        heading: cmsFallbacks.about.coverageHeading,
        introduction: cmsFallbacks.about.coverageIntro,
      },
      cta: {
        description: cmsFallbacks.about.cta.description,
        eyebrow: 'Start with a photo or idea',
        heading: cmsFallbacks.about.cta.heading,
        primaryLabel: cmsFallbacks.about.cta.buttonText,
        whatsAppLabel: 'WhatsApp Us',
      },
      hero: {
        eyebrow: cmsFallbacks.about.eyebrow,
        heading: cmsFallbacks.about.heading,
        introduction: cmsFallbacks.about.intro,
        ...(heroImage ? { image: heroImage } : {}),
        primaryLabel: 'Request a Free Quotation',
        secondaryLabel: 'Explore Our Services',
      },
      principlesSection: {
        eyebrow: 'Why the details matter',
        heading: cmsFallbacks.about.principlesHeading,
        introduction: cmsFallbacks.about.principlesIntro,
        items: cmsFallbacks.about.workingBenefits,
      },
      processSection: {
        eyebrow: 'A clear four-step approach',
        heading: cmsFallbacks.about.processHeading,
        steps: cmsFallbacks.about.processSteps.map(({ description, title }) => ({ description, title })),
      },
      proofItems: cmsFallbacks.about.workingBenefits.slice(0, 4).map(({ title }) => ({ label: title })),
      seo: {
        description: 'Learn how Al Rukn makes, repairs and installs custom furniture and upholstery for homes and workplaces across the UAE.',
        title: 'About Al Rukn Furniture UAE',
      },
      servicesSection: {
        eyebrow: 'Made, repaired and fitted',
        heading: cmsFallbacks.about.servicesHeading,
        introduction: cmsFallbacks.about.servicesIntro,
      },
      story: {
        eyebrow: cmsFallbacks.about.story.eyebrow,
        heading: cmsFallbacks.about.story.heading,
        ...(workshopImage ? { image: workshopImage } : {}),
        paragraphs: cmsFallbacks.about.story.body.map((text) => ({ text })),
      },
    } satisfies Partial<AboutPage>
    const nextAbout = fillEmptyFields(about, aboutBootstrap)

    const contactBootstrap = {
      _status: 'published',
      channelLabels: { call: 'Call', email: 'Email', visit: 'Visit the workshop', whatsApp: 'WhatsApp' },
      coverageSection: {
        eyebrow: 'UAE service coverage',
        heading: cmsFallbacks.contact.areasHeading,
        introduction: cmsFallbacks.contact.areasIntro,
      },
      hero: {
        eyebrow: cmsFallbacks.contact.eyebrow,
        heading: cmsFallbacks.contact.heading,
        introduction: cmsFallbacks.contact.intro,
        primaryLabel: 'Request a Free Quotation',
        whatsAppLabel: 'WhatsApp Us',
      },
      hoursSection: {
        closedDayLabel: 'Friday',
        closedLabel: 'Closed',
        eyebrow: 'Plan your visit',
        heading: cmsFallbacks.contact.hoursHeading,
        introduction: cmsFallbacks.contact.hoursIntro,
        openDaysLabel: 'Saturday–Thursday',
      },
      quoteSection: {
        checklist: cmsFallbacks.contact.quoteChecklist.map((item) => ({ item })),
        eyebrow: 'Start with the details',
        formHeading: cmsFallbacks.contact.formHeading,
        heading: 'Tell Us What You Need Made or Repaired',
        introduction: cmsFallbacks.contact.formDescription,
        responseNote: 'Prefer to speak first? Call or WhatsApp the workshop and we will tell you what information will help us prepare the quotation.',
      },
      seo: {
        description: cmsFallbacks.contact.metaDescription,
        title: cmsFallbacks.contact.metaTitle,
      },
      servicesSection: {
        eyebrow: 'What can we quote?',
        heading: 'Furniture and Upholstery Services',
        introduction: 'Explore the service most relevant to your project, then send the form with your dimensions, location and photos.',
      },
      workshopCard: {
        callLabel: 'Call the workshop',
        emailLabel: 'Email',
        eyebrow: 'Ajman workshop',
        hoursLabel: 'Workshop hours',
        mapLabel: 'Open workshop in Google Maps',
        visitLabel: 'Visit',
      },
    } satisfies Partial<ContactPage>
    const nextContact = fillEmptyFields(contact, contactBootstrap)

    const portfolio = cmsFallbacks.archives.portfolio
    const archiveBootstrap = {
      _status: 'published',
      blogArchive: archiveGroup(cmsFallbacks.archives.blog, 'Furniture Care Journal | Al Rukn Furniture'),
      portfolioArchive: {
        cta: archiveCTA,
        emptyState: portfolio.emptyState,
        filterLabels: portfolio.filterLabels,
        heading: portfolio.heading,
        hero: {
          ...portfolio.hero,
          heading: portfolio.heading,
          introduction: portfolio.introduction,
        },
        introduction: portfolio.introduction,
        seo: portfolio.seo,
        supportingLabels: {
          ...portfolio.supportingLabels,
          loadMoreLabel: 'Load more designs',
          resultsHeading: 'Furniture designs',
        },
      },
      projectsArchive: archiveGroup(cmsFallbacks.archives.projects, 'Furniture Projects | Al Rukn Furniture'),
      servicesArchive: archiveGroup(cmsFallbacks.archives.services, 'Furniture Services | Al Rukn Furniture'),
    } satisfies Partial<ArchiveSetting>
    const nextArchives = fillEmptyFields(archives, archiveBootstrap)

    const globalWrites = [
      {
        changed: changed(
          { quoteForm: homepage.quoteForm, sharedLabels: homepage.sharedLabels },
          nextHomepage,
        ),
        data: nextHomepage,
        slug: 'homepage' as const,
      },
      { changed: changed(about, nextAbout), data: nextAbout, slug: 'about-page' as const },
      { changed: changed(contact, nextContact), data: nextContact, slug: 'contact-page' as const },
      { changed: changed(archives, nextArchives), data: nextArchives, slug: 'archive-settings' as const },
    ]

    for (const write of globalWrites) {
      if (!write.changed) continue
      await payload.updateGlobal({
        context,
        data: write.data,
        draft: false,
        locale,
        overrideAccess: true,
        slug: write.slug,
      } as never)
    }

    let updatedServices = 0
    for (const service of services) {
      const labels = fillEmptyFields(service.presentationLabels ?? {}, {
        ...cmsFallbacks.serviceLabels,
        faqHeading: `${service.title} questions`,
      })
      if (!changed(service.presentationLabels ?? {}, labels)) continue

      await payload.update({
        collection: 'services',
        context,
        data: { presentationLabels: labels },
        draft: false,
        id: service.id,
        locale,
        overrideAccess: true,
      })
      updatedServices += 1
    }

    console.log(
      JSON.stringify(
        {
          globalsUpdated: globalWrites.filter((write) => write.changed).map(({ slug }) => slug),
          servicesExamined: services.length,
          servicesUpdated: updatedServices,
        },
        null,
        2,
      ),
    )
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
