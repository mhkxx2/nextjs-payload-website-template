import {
  HOME_BENEFITS,
  HOME_META,
  HOME_PROCESS,
  HOME_TRUST_ITEMS,
} from './homepage'
import {
  aboutCopy,
  archiveCopy,
  contactCopy,
  homeCopy,
  processSteps,
  workingBenefits,
} from './launch-copy'

export const POSTS_PER_PAGE = 9

export const cmsFallbacks = {
  homepage: {
    benefits: HOME_BENEFITS,
    meta: HOME_META,
    process: HOME_PROCESS,
    trustItems: HOME_TRUST_ITEMS,
    sharedLabels: {
      serviceCardLinkLabel: 'Learn more',
      projectCardLinkLabel: 'View project',
      projectsArchiveLabel: 'View All Projects',
      finalCtaEyebrow: 'Start with a photo or idea',
      dubaiAreaLabel: 'Dubai',
      sharjahAreaLabel: 'Sharjah',
      ajmanAreaLabel: 'Ajman',
      otherEmiratesAreaLabel: 'Other Emirates',
    },
    quoteForm: {
      heading: 'Request a Free Quote',
      nameLabel: 'Name',
      phoneLabel: 'Phone / WhatsApp',
      serviceLabel: 'Service',
      servicePlaceholder: 'Choose a service',
      areaLabel: 'Area',
      messageLabel: 'Message',
      portfolioReferenceLabel: 'Furniture / design photo',
      photoHelp: 'JPEG, PNG, WebP or AVIF, up to 12 MB.',
      consentLabel: 'I agree that Al Rukn may use these details to respond to my request.',
      privacyLabel: 'privacy policy',
      submitLabel: 'Request a Quote',
      pendingLabel: 'Sending…',
      successMessage: 'Thank you. Your quotation request has been received.',
      errorMessage: 'Please check the form and try again.',
      networkErrorMessage: 'The request could not be sent. Please call or use WhatsApp.',
    },
  },
  about: {
    ...aboutCopy,
    processSteps,
    workingBenefits,
  },
  contact: contactCopy,
  archives: {
    services: { ...archiveCopy.services, cta: homeCopy.finalCta },
    projects: { ...archiveCopy.projects, cta: homeCopy.finalCta },
    blog: { ...archiveCopy.blog, cta: homeCopy.finalCta },
    portfolio: {
      heading: 'Furniture Designs for Every Room',
      introduction: 'Browse furniture designs for bedrooms, living rooms, kids rooms, dining areas and more. Choose a design you like and contact Al Rukn to discuss custom sizing, materials and finishes.',
      emptyState: 'No furniture designs are currently published.',
      seo: {
        title: 'Furniture Portfolio Dubai | Custom Designs | Al Rukn',
        description: 'Browse bedroom, living room, sofa, wardrobe, kids room and custom furniture designs. Choose a style and request a custom furniture quote in the UAE.',
      },
      hero: {
        eyebrow: 'Furniture Portfolio',
        exploreLabel: 'Explore Designs',
        sendDesignLabel: 'Send Your Design',
      },
      supportingLabels: {
        roomEyebrow: 'Browse by room',
        roomHeading: 'Find a starting point for your space',
        servicesEyebrow: 'Made to measure',
        servicesHeading: 'Explore the service behind each design',
      },
      filterLabels: {
        all: 'All', bedroom: 'Bedroom', livingRoom: 'Living Room', kidsRoom: 'Kids Room',
        diningRoom: 'Dining Room', bathroom: 'Bathroom', sofas: 'Sofas', beds: 'Beds',
        wardrobes: 'Wardrobes', officeStudy: 'Office / Study', storage: 'Storage',
      },
      cta: homeCopy.finalCta,
    },
  },
  serviceLabels: {
    workshopNote: 'Serving Dubai and the UAE from our Ajman workshop.',
    benefitsEyebrow: 'Built around the brief',
    benefitsHeading: 'Why made-to-order work is different',
    materialsEyebrow: 'Specification',
    processEyebrow: 'From enquiry to handover',
    galleryEyebrow: 'Visual references',
    areasEyebrow: 'Local service coverage',
    faqEyebrow: 'Before you request a quote',
    faqIntroduction: 'Practical answers about measurements, materials and the quotation process.',
    relatedEyebrow: 'Continue planning',
    quoteEyebrow: 'Start with a photo or drawing',
  },
} as const
