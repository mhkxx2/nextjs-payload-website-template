/**
 * Repository-owned launch copy.
 *
 * Everything in this file describes *what the business does* — services, process,
 * workshop practice, what a customer receives. It deliberately contains no
 * business history, client counts, awards, certifications, years in business or
 * delivery promises, because none of those can be verified from this repository.
 *
 * Anything that must come from the business is read from Payload instead
 * (services, projects, testimonials, FAQs, pages, contact-information), so the
 * CMS stays the single source of truth once it is populated.
 */

export const POSTS_PER_PAGE = 9

export const archiveCopy = {
  blog: {
    emptyMessage:
      'No articles have been published yet. Care guides appear here as our team publishes them.',
    heading: 'Furniture Care Journal',
    intro:
      'Care guides, material notes and project write-ups about upholstery, curtains, wardrobes and made-to-measure furniture.',
  },
  projects: {
    emptyMessage:
      'Project case studies are being prepared and will appear here once they are published.',
    heading: 'Projects',
    intro:
      'Made-to-measure furniture, upholstery, curtains, wardrobes and joinery work from our workshop.',
  },
  services: {
    emptyMessage:
      'Service details are being published by our team. Contact us and we will confirm what can be made for your space.',
    heading: 'Services',
    intro:
      'Made-to-measure furniture, upholstery, curtains, blinds and fittings — measured, quoted, built and installed by our team.',
  },
} as const

export const processSteps = [
  {
    description:
      'We measure the space itself, including doorways, stairs and lift dimensions that decide whether a piece can be delivered.',
    stepNumber: 1,
    title: 'Measure',
  },
  {
    description:
      'You receive the price, the materials, the scope of work and the lead time in writing before anything is scheduled.',
    stepNumber: 2,
    title: 'Quote',
  },
  {
    description:
      'The piece is cut, framed, upholstered and finished for the measurements and materials you approved.',
    stepNumber: 3,
    title: 'Build',
  },
  {
    description:
      'We deliver, fit and check the work on site, then explain how to care for the finish and covers.',
    stepNumber: 4,
    title: 'Install',
  },
]

export const workingBenefits = [
  {
    description:
      'Pieces are built to the measurements and layout of your space instead of being adapted from a standard size.',
    title: 'Made to measure',
  },
  {
    description:
      'Fabric, leather, foam, timber, hardware and finish are agreed with you before the workshop starts.',
    title: 'Materials agreed first',
  },
  {
    description:
      'The price, scope of work and lead time are confirmed in writing before a job is scheduled.',
    title: 'Written quotation',
  },
  {
    description:
      'Existing sofas, majlis seating and dining chairs can be refilled, re-covered and repaired rather than replaced.',
    title: 'Repair and re-cover',
  },
  {
    description:
      'Orders are delivered and fitted on site, with access and lift requirements checked at quotation stage.',
    title: 'Delivery and installation',
  },
  {
    description:
      'The same team that measures and quotes your job stays with it through finishing and installation.',
    title: 'One point of contact',
  },
]

export const homeCopy = {
  benefits: {
    heading: 'How We Work With You',
  },
  coverage: {
    heading: 'Where We Work',
    subheading: 'Delivery and installation areas are configured by our team.',
  },
  faqs: {
    heading: 'Common Questions',
  },
  finalCta: {
    buttonLink: '/contact/',
    buttonText: 'Contact Us',
    description:
      'Send your measurements, a photo of the space, or the piece you would like repaired or re-covered.',
    heading: 'Ready to Start?',
  },
  hero: {
    ctaLink: '/contact/',
    ctaText: 'Request a Free Quotation',
    heading: 'Made-to-Measure Furniture and Upholstery',
    subheading:
      'Sofas, majlis seating, wardrobes, beds, curtains, blinds and office furniture — quoted from your measurements and built for your space.',
  },
  process: {
    heading: 'From Measurement to Installation',
  },
  projects: {
    heading: 'Selected Work',
    subheading: 'Case studies published by our team.',
  },
  quote: {
    description:
      'Tell us what you need, where it will go and roughly what you would like to spend, and we will come back with options.',
    heading: 'Request a Free Quotation',
  },
  services: {
    heading: 'What We Make and Repair',
    subheading: 'Choose a specialism to see how the work is measured, built and finished.',
  },
  testimonials: {
    heading: 'Client Feedback',
  },
} as const

export const aboutCopy = {
  coverageHeading: 'Where We Work',
  cta: {
    buttonLink: '/contact/',
    buttonText: 'Contact Us',
    description:
      'Send measurements, a photo of the space, or the piece you want repaired and we will quote the work.',
    heading: 'Talk to Us About Your Space',
  },
  heading: 'About Al Rukn Furniture',
  intro:
    'Al Rukn Furniture makes and repairs upholstered and wooden furniture. Sofas, majlis seating, wardrobes, beds, curtains, blinds and office furniture are measured, quoted, built and installed by the same team.',
  processHeading: 'How a Job Runs',
  servicesHeading: 'What We Do',
} as const

export const contactCopy = {
  areasHeading: 'Areas We Cover',
  detailsHeading: 'Contact Details',
  formDescription:
    'Share a few details about the job and the team will respond with the next step.',
  formHeading: 'Request a Free Quotation',
  heading: 'Contact Al Rukn Furniture',
  hoursHeading: 'Opening Hours',
  intro:
    'Call, message or send the form below. For quotations, measurements or a photo of the piece help us price the work accurately.',
  noDetailsMessage:
    'Contact details have not been published yet. Send the form below and the team will respond.',
} as const
