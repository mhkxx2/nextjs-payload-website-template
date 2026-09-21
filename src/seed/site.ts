import type { Faq } from '@/payload-types'

import {
  BUSINESS,
  CANONICAL_ORIGIN,
  HOMEPAGE_BLOCK_ORDER,
  MEDIA_USAGE,
  OPENING_HOURS,
  SERVICE_AREAS,
} from './business'
import { bulletList, heading, paragraph, richText, type SeedRichText } from './richtext'
import { SERVICE_SEEDS } from './services'

/** Pages that must exist once the launch content is seeded. */
export interface PageSeed {
  slug: string
  title: string
  hero: {
    type: 'none' | 'lowImpact'
    richText?: SeedRichText
    mediaFile?: string
    links?: { link: { type: 'custom'; url: string; label: string; newTab?: boolean } }[]
  }
  layout: Record<string, unknown>[]
  canonicalPath: string
}

export interface FaqSeed {
  question: string
  answer: string
  group: Faq['group']
  order: number
  schemaEligible: boolean
  serviceSlugs: string[]
}

export const FAQ_SEEDS: FaqSeed[] = [
  {
    question: 'How do I get a price for upholstery work?',
    answer:
      'Send photographs of the piece and its measurements on WhatsApp, or bring it to the workshop in Al Jerf 1. Upholstery is quoted from the frame, the fabric and the amount of foam being replaced, so the price follows what the piece actually needs.',
    group: 'pricing-quotations',
    order: 1,
    schemaEligible: true,
    serviceSlugs: [
      'sofa-upholstery',
      'custom-sofa',
      'majlis-furniture',
      'sofa-repair',
      'office-furniture',
    ],
  },
  {
    question: 'Do you collect and deliver furniture?',
    answer:
      'Pieces are usually brought to the workshop or collected by arrangement. Once the work is finished the piece can be delivered back, and majlis or fitted items are installed on site. Ask when you request the quotation so transport can be included.',
    group: 'process',
    order: 2,
    schemaEligible: true,
    serviceSlugs: [
      'sofa-upholstery',
      'custom-sofa',
      'majlis-furniture',
      'sofa-repair',
      'custom-furniture',
    ],
  },
  {
    question: 'Can I supply my own fabric?',
    answer:
      'Yes. Bring the roll or send the fabric details and we will check the weight and width before it is cut. If the fabric is too light for the frame or the pattern repeat is too large for the panels, we will say so first rather than working around it afterwards.',
    group: 'materials-care',
    order: 3,
    schemaEligible: true,
    serviceSlugs: ['sofa-upholstery', 'custom-sofa', 'custom-furniture'],
  },
  {
    question: 'Can you re-upholster a sofa without replacing the frame?',
    answer:
      'That depends on the frame and the suspension. If the timber, joints and springs are sound, the sofa is re-covered and the frame stays. If a rail or joint has failed it is repaired first, or replaced if it cannot carry load again.',
    group: 'services',
    order: 4,
    schemaEligible: true,
    serviceSlugs: ['sofa-upholstery', 'sofa-repair'],
  },
  {
    question: 'Can a sagging sofa seat be repaired?',
    answer:
      'Usually yes. A seat that has dropped is generally a failed webbing, spring or foam problem rather than a broken frame. The base is opened up so the fault is identified, then the webbing, springs or seat foam are renewed as needed.',
    group: 'services',
    order: 5,
    schemaEligible: true,
    serviceSlugs: ['sofa-repair', 'sofa-upholstery'],
  },
  {
    question: 'Can you repair a recliner mechanism?',
    answer:
      'Recliner faults are inspected before any parts are ordered, because the cause can be the mechanism, the frame around it or an adjustment. Bring the piece in or send a short video showing what it does when you operate it.',
    group: 'services',
    order: 6,
    schemaEligible: true,
    serviceSlugs: ['sofa-repair'],
  },
  {
    question: 'Does a repair cost less than re-upholstery?',
    answer:
      'A repair normally costs less than full re-upholstery because the covers stay in place. The two are quoted separately, and if the existing fabric has failed as well we will tell you what the repair alone would and would not fix.',
    group: 'pricing-quotations',
    order: 7,
    schemaEligible: true,
    serviceSlugs: ['sofa-repair'],
  },
  {
    question: 'Can you build a sofa to my exact dimensions?',
    answer:
      'Yes. Length, seat depth and seat height are taken from your room rather than a standard size. The doorway or stair access is checked at the same time so the finished sofa can actually be carried into the room.',
    group: 'services',
    order: 8,
    schemaEligible: true,
    serviceSlugs: ['custom-sofa', 'majlis-furniture'],
  },
  {
    question: 'What custom furniture can you build?',
    answer:
      'Fixed and freestanding timber furniture: media walls and TV units, dining tables, shelving, alcove storage, reception counters and desk runs. Work starts from the room measurements and a brief of what the piece has to hold.',
    group: 'services',
    order: 9,
    schemaEligible: true,
    serviceSlugs: ['custom-furniture', 'office-furniture', 'custom-wardrobes'],
  },
  {
    question: 'How long does a custom furniture project take?',
    answer:
      'Timing follows the size of the piece, the finish and the material availability. A single unit and a full fitted run do not take the same time, so the schedule is confirmed with the quotation once the drawing and finish are agreed.',
    group: 'process',
    order: 10,
    schemaEligible: true,
    serviceSlugs: ['custom-furniture', 'custom-wardrobes', 'custom-beds-headboards', 'office-furniture'],
  },
  {
    question: 'How long does a custom sofa take?',
    answer:
      'A made-to-measure sofa depends on the frame size, the fill chosen and the fabric. If the fabric is in the workshop range the build can start once the measurements and fill are confirmed; if you supply fabric, we allow for checking it first.',
    group: 'process',
    order: 11,
    schemaEligible: true,
    serviceSlugs: ['custom-sofa'],
  },
  {
    question: 'How is majlis seating built and installed?',
    answer:
      'The bench base is built in sections so it can be carried through the door, upholstered, then joined and levelled along the wall on site. Seat and back cushions are cut to the same wall run so the seams line up across the sections.',
    group: 'services',
    order: 12,
    schemaEligible: true,
    serviceSlugs: ['majlis-furniture'],
  },
  {
    question: 'Can you match the fabric to my existing majlis?',
    answer:
      'We match as closely as the available range allows. Send a photograph of the existing seating in daylight and, if you can, the name or code of the fabric; exact matches depend on whether the original fabric is still produced.',
    group: 'materials-care',
    order: 13,
    schemaEligible: true,
    serviceSlugs: ['majlis-furniture', 'sofa-upholstery'],
  },
  {
    question: 'Do you measure windows before making curtains?',
    answer:
      'Yes. Each opening is measured for width, drop and the space needed to stack the curtain, and the track or rail position is agreed at the same visit. Curtains are then made to those measurements instead of being trimmed down from a standard size.',
    group: 'process',
    order: 14,
    schemaEligible: true,
    serviceSlugs: ['curtains-blinds'],
  },
  {
    question: 'Which curtain linings are available?',
    answer:
      'Sheer, standard and blackout linings are available, and a lining can be combined with a heavier face fabric where the room needs both light control and weight. The lining choice is agreed with the fabric at sample stage.',
    group: 'materials-care',
    order: 15,
    schemaEligible: true,
    serviceSlugs: ['curtains-blinds'],
  },
  {
    question: 'How do you plan a fitted wardrobe layout?',
    answer:
      'The internal layout follows what you store: hanging drops for long and short garments, drawer depths and shelf spacing. Sizes are drawn up before the carcass is cut, and any bulkhead or column in the wall is measured into the plan.',
    group: 'process',
    order: 16,
    schemaEligible: true,
    serviceSlugs: ['custom-wardrobes'],
  },
  {
    question: 'Do you build sliding door wardrobes?',
    answer:
      'Both sliding and hinged doors are built. Sliding doors suit narrow rooms where door swing would block the floor, and hinged doors give full access to the whole compartment where there is space to open them.',
    group: 'services',
    order: 17,
    schemaEligible: true,
    serviceSlugs: ['custom-wardrobes'],
  },
  {
    question: 'Can you build a bed for a non-standard mattress?',
    answer:
      'Yes. Bring or send the mattress width, length and depth and the base is built to those figures, with the headboard set to the height you want behind the pillows.',
    group: 'services',
    order: 18,
    schemaEligible: true,
    serviceSlugs: ['custom-beds-headboards'],
  },
  {
    question: 'Do you make upholstered headboards?',
    answer:
      'Headboards are built as upholstered panels in the fabric you choose, then fixed to the wall or mounted on the bed frame depending on the room and the wall type.',
    group: 'services',
    order: 19,
    schemaEligible: true,
    serviceSlugs: ['custom-beds-headboards', 'sofa-upholstery'],
  },
  {
    question: 'Can you fit out an office to our floor plan?',
    answer:
      'Yes. Send the floor plan and the number of workstations. Desk runs, returns and shared tables are sized to the plan, with cable routes and screen positions agreed before the panels are made.',
    group: 'services',
    order: 20,
    schemaEligible: true,
    serviceSlugs: ['office-furniture', 'custom-furniture'],
  },
  {
    question: 'Do you make reception desks and meeting tables?',
    answer:
      'Reception and service counters, meeting tables and storage units are built in the workshop and assembled on site. Upholstered waiting and meeting seating can be made in the same order so the finishes match.',
    group: 'services',
    order: 21,
    schemaEligible: true,
    serviceSlugs: ['office-furniture'],
  },
  {
    question: 'Where is the workshop and when is it open?',
    answer: `${BUSINESS.brandName} is based in ${BUSINESS.address.line1}, ${BUSINESS.address.city}. The workshop opens at 8 am, and ${BUSINESS.hoursLabel.toLowerCase()} applies from Sunday to Saturday. Call or message ${BUSINESS.phoneDisplay} before travelling so someone is free to look at your piece.`,
    group: 'general',
    order: 22,
    schemaEligible: true,
    serviceSlugs: [],
  },
]

export interface HomepageBlockContext {
  faqIds: number[]
  media: { hero: number; about: number }
}

/** Homepage block composition, mirroring `HOMEPAGE_BLOCK_ORDER`. */
export const buildHomepageLayout = ({
  faqIds,
  media,
}: HomepageBlockContext): Record<string, unknown>[] => {
  const blocks: Record<string, Record<string, unknown>> = {
    hero: {
      blockType: 'hero',
      heading: 'Upholstery and furniture made in Ajman',
      subheading: `${BUSINESS.brandName} re-covers sofas, builds majlis seating and makes fitted furniture to measure from our workshop in ${BUSINESS.address.line1}.`,
      ctaText: 'Request a quotation',
      ctaLink: '/contact',
      media: media.hero,
      variant: 'split',
      alignment: 'left',
    },
    serviceGrid: {
      blockType: 'serviceGrid',
      heading: 'What we make and repair',
      subheading: 'Nine workshop services, each quoted from the piece in front of us.',
      limit: 9,
      columns: '3',
    },
    benefits: {
      blockType: 'benefits',
      heading: 'Why customers bring furniture to the workshop',
      items: [
        {
          title: 'Measured before cutting',
          description:
            'Furniture and curtains are made from measurements taken on site, not from standard sizes.',
        },
        {
          title: 'Fabric and foam you choose',
          description:
            'Pick from the workshop range or supply your own fabric, with the foam grade agreed first.',
        },
        {
          title: 'Repair where repair is enough',
          description:
            'Frames and mechanisms are repaired where the covers can be kept, and re-covered where they cannot.',
        },
        {
          title: 'Built and fitted in Ajman',
          description: `Work is carried out at the ${BUSINESS.address.line1} workshop, with installation on site for fitted pieces.`,
        },
      ],
    },
    processSteps: {
      blockType: 'processSteps',
      heading: 'How a job runs',
      steps: [
        {
          stepNumber: 1,
          title: 'Send photos and sizes',
          description: 'Photographs and measurements are enough for us to say what the job needs.',
        },
        {
          stepNumber: 2,
          title: 'Agree the specification',
          description: 'Fabric, foam, finish and dimensions are confirmed before work starts.',
        },
        {
          stepNumber: 3,
          title: 'Workshop build',
          description: 'The piece is stripped, repaired or built on the bench at Al Jerf 1.',
        },
        {
          stepNumber: 4,
          title: 'Delivery and fitting',
          description: 'Finished items are handed over, delivered or installed on site.',
        },
      ],
    },
    splitContent: {
      blockType: 'splitContent',
      heading: 'A workshop, not a showroom floor',
      body: `${BUSINESS.brandName} works from a furniture workshop in ${BUSINESS.address.line1}, ${BUSINESS.address.city}. Sofas are stripped on the bench, timber is cut to the measured drawings and cushions are stitched for the piece they belong to.`,
      mediaPosition: 'right',
      media: media.about,
      ctaText: 'Ask a question',
      ctaLink: '/contact',
    },
    projectGallery: {
      blockType: 'projectGallery',
      heading: 'Workshop work',
      subheading: 'Project write-ups are published here once the customer has approved them.',
      limit: 6,
    },
    testimonials: {
      blockType: 'testimonials',
      heading: 'Customer feedback',
      displayMode: 'grid',
    },
    faqs: {
      blockType: 'faqs',
      heading: 'Questions we are asked before a quotation',
      faqs: faqIds,
      enableSchema: true,
    },
    locationCoverage: {
      blockType: 'locationCoverage',
      heading: `Based in ${BUSINESS.address.city}, working across the emirate`,
      subheading:
        'Tell us where the piece is and we will confirm whether it is collected, delivered or fitted on site.',
      areas: SERVICE_AREAS.map((area) => ({
        name: area,
        details:
          area === 'Ajman'
            ? `Workshop location: ${BUSINESS.address.line1}, ${BUSINESS.address.city}.`
            : `Work delivered in ${area} by arrangement.`,
      })),
    },
    quoteForm: {
      blockType: 'quoteForm',
      heading: 'Request a quotation',
      description:
        'Send the piece, sizes and finish you have in mind. Photos of the item or the room help us answer with a usable price.',
      formTitle: 'Quotation request',
    },
    callToAction: {
      blockType: 'callToAction',
      heading: 'Talk to the workshop before you decide',
      description: `Call or message ${BUSINESS.phoneDisplay} with a photo of the piece. We will tell you what is repairable, what needs re-covering and what is worth building new.`,
      buttonText: 'Message on WhatsApp',
      buttonLink: '/contact',
      variant: 'primary',
    },
  }

  return HOMEPAGE_BLOCK_ORDER.flatMap((type) => (blocks[type] ? [blocks[type]] : []))
}

export const PAGE_SEEDS: PageSeed[] = [
  {
    slug: 'home',
    title: 'Home',
    hero: { type: 'none' },
    layout: [],
    canonicalPath: '/',
  },
  {
    slug: 'privacy',
    title: 'Privacy',
    hero: {
      type: 'lowImpact',
      richText: richText(
        heading('Privacy', 'h2'),
        paragraph(
          `${BUSINESS.brandName} collects only the information needed to answer an enquiry and carry out the work you ask for.`,
        ),
      ),
    },
    layout: [
      {
        blockType: 'richContent',
        width: 'narrow',
        content: richText(
          heading('What is collected'),
          paragraph(
            'When you send a quotation request, call or message the workshop, we receive the details you provide: your name, the number you contacted us from, and the description, photographs and measurements of the piece you want made or repaired.',
          ),
          heading('How it is used'),
          paragraph(
            'Those details are used to answer the enquiry, prepare a quotation and carry out the work if you go ahead. Photographs of your furniture are used to assess the piece and are not published without your agreement.',
          ),
          bulletList([
            'Enquiry details are kept only as long as they are needed for the job and any follow-up',
            'We do not sell or rent contact details to other businesses',
            'Measurements and photographs are used for the quoted work only',
          ]),
          heading('Contact about your information'),
          paragraph(
            `To ask what we hold about you, or to have it corrected or deleted, email ${BUSINESS.email} or call ${BUSINESS.phoneDisplay}.`,
          ),
        ),
      },
    ],
    canonicalPath: '/privacy/',
  },
  {
    slug: 'terms',
    title: 'Terms',
    hero: {
      type: 'lowImpact',
      richText: richText(
        heading('Terms', 'h2'),
        paragraph(
          'These terms describe how quotations, materials and workshop work are handled. Job-specific details are confirmed in writing with your quotation.',
        ),
      ),
    },
    layout: [
      {
        blockType: 'richContent',
        width: 'narrow',
        content: richText(
          heading('Quotations'),
          paragraph(
            'A quotation is prepared from the photographs, measurements and specification you provide. If a piece turns out to differ from what was described once it is on the bench, we will contact you with any change before continuing.',
          ),
          heading('Materials and customer-supplied fabric'),
          paragraph(
            'Fabric, foam and timber are ordered against the agreed specification. Customer-supplied fabric is checked before cutting; we are not responsible for faults in fabric supplied to us, but we will tell you about anything we notice before work starts.',
          ),
          heading('Work carried out'),
          paragraph(
            'Work is scheduled once the specification and any deposit are agreed. Collection, delivery and installation are quoted as separate items where they apply, and timing is confirmed with the quotation.',
          ),
          heading('Questions'),
          paragraph(
            `Any question about a quotation or a job in progress can go to ${BUSINESS.email} or ${BUSINESS.phoneDisplay}.`,
          ),
        ),
      },
    ],
    canonicalPath: '/terms/',
  },
]

const quotationLink = (label: string, url: string) => ({ type: 'custom' as const, label, url })

export const HOME_HERO_LINKS = [
  quotationLink('Request a quotation', '/contact'),
  quotationLink('See all services', '/services'),
]

export const GLOBAL_SEEDS = {
  siteSettings: {
    businessName: BUSINESS.legalName,
    brandName: BUSINESS.brandName,
    quotationLabels: {
      primaryLabel: 'Request a quotation',
      formHeading: 'Request a quotation',
      submitLabel: 'Send request',
    },
    whatsAppCopy: {
      defaultLabel: 'Message on WhatsApp',
      defaultMessage: `Hello ${BUSINESS.brandName}, I would like a quotation.`,
    },
    locale: { defaultLocale: 'en' as const, direction: 'ltr' as const },
    canonicalSiteURL: CANONICAL_ORIGIN,
    announcement: { enabled: false },
    presentation: { buttonStyle: 'solid' as const, imageShape: 'soft' as const },
  },
  contactInformation: {
    phoneE164: BUSINESS.phoneE164,
    whatsappE164: BUSINESS.whatsappE164,
    whatsappAvailable: true,
    email: BUSINESS.email,
    address: BUSINESS.address,
    mapURL: BUSINESS.mapURL,
    openingHours: OPENING_HOURS.map((day) => ({
      day,
      closed: false,
      opens: BUSINESS.opensAt,
      displayLabel: BUSINESS.hoursLabel,
    })),
    serviceAreas: SERVICE_AREAS.map((area) => ({ area })),
  },
  header: {
    navigation: [
      { label: 'Home', destination: 'home' as const },
      { label: 'Services', destination: 'services' as const },
      { label: 'Projects', destination: 'projects' as const },
      { label: 'Blog', destination: 'blog' as const },
      { label: 'About', destination: 'about' as const },
      { label: 'Contact', destination: 'contact' as const },
    ],
    conversionActions: [
      { action: 'quotation' as const, label: 'Request a quotation', appearance: 'primary' as const },
      { action: 'whatsapp' as const, label: 'WhatsApp', appearance: 'secondary' as const },
      { action: 'phone' as const, label: 'Call the workshop', appearance: 'secondary' as const },
    ],
    mobileNavigation: {
      menuLabel: 'Menu',
      closeLabel: 'Close',
      showConversionActions: true,
    },
  },
  footer: {
    navigationGroups: [
      {
        heading: 'Company',
        items: [
          { label: 'About the workshop', destination: 'about' as const },
          { label: 'Contact', destination: 'contact' as const },
        ],
      },
      {
        heading: 'Browse',
        items: [
          { label: 'All services', destination: 'services' as const },
          { label: 'Workshop work', destination: 'projects' as const },
          { label: 'Notes', destination: 'blog' as const },
        ],
      },
    ],
    legalLinks: [
      { label: 'Privacy', legalDestination: 'privacy' as const },
      { label: 'Terms', legalDestination: 'terms' as const },
    ],
    supportingCopy: `${BUSINESS.brandName} — ${BUSINESS.category.toLowerCase()} in ${BUSINESS.address.line1}, ${BUSINESS.address.city}. Upholstery, majlis seating, fitted furniture, curtains and office joinery made to measure.`,
    conversionContent: {
      heading: 'Send a photo, get a straight answer',
      copy: `Message ${BUSINESS.phoneDisplay} or email ${BUSINESS.email} with what you need made or repaired.`,
      quotationLabel: 'Request a quotation',
      whatsAppLabel: 'WhatsApp',
    },
  },
  seoDefaults: {
    titlePattern: '{title} | {brand}',
    fallbackDescription: `${BUSINESS.brandName}: ${BUSINESS.category.toLowerCase()} and upholstery workshop in ${BUSINESS.address.line1}, ${BUSINESS.address.city}. Sofas, majlis seating and fitted furniture made to measure.`,
    index: true,
    follow: true,
    organizationSchema: {
      name: BUSINESS.legalName,
      description: `${BUSINESS.category} and upholstery workshop in ${BUSINESS.address.city}, ${BUSINESS.address.country}.`,
    },
    localBusinessSchema: {
      businessType: 'FurnitureStore' as const,
      priceRange: 'moderate' as const,
    },
  },
  socialMedia: {
    links: [] as {
      network: 'instagram' | 'facebook' | 'x' | 'linkedin' | 'tiktok' | 'youtube' | 'pinterest'
      label?: string
      url: string
    }[],
  },
}

export const SERVICE_LINK_LABELS = SERVICE_SEEDS.map((service) => ({
  slug: service.slug,
  label: service.title,
}))

export const MEDIA_FILES = MEDIA_USAGE
