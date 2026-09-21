import type { Faq } from '@/payload-types'

/**
 * Verified business facts for Al Rukn Furniture Upholstery.
 *
 * Source of truth: the Google Maps listing supplied by the client
 * (https://maps.app.goo.gl/23Hd5ge1jLXcrQZV9) plus the client-provided
 * mailbox. Nothing else may be asserted in seeded copy — no years of
 * trading, no project counts, no ratings beyond the listing, no guarantees.
 */

export const CANONICAL_ORIGIN = 'https://alruknfurniture.ae'

export const BUSINESS = {
  legalName: 'AL RUKN FURNITURE UPHOLSTERY',
  brandName: 'Al Rukn Furniture',
  email: 'info@alruknfurniture.ae',
  phoneE164: '+971551224902',
  phoneDisplay: '+971 55 122 4902',
  whatsappE164: '+971551224902',
  address: {
    line1: 'CGMC+486, Al Jerf 1',
    line2: 'Al Jerf 1',
    city: 'Ajman',
    emirate: 'Ajman',
    country: 'United Arab Emirates',
  },
  /** Verified from the Maps listing: the workshop opens at 8 am. */
  opensAt: '08:00',
  hoursLabel: 'Opens 8 am',
  mapURL: 'https://www.google.com/maps?cid=6740373205854748574&hl=en',
  coordinates: { latitude: 25.432793, longitude: 55.5207684 },
  category: 'Furniture manufacturer',
} as const

export type OpeningDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export const OPENING_HOURS: OpeningDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

/** Districts we can state without inventing coverage outside Ajman. */
export const SERVICE_AREAS = [
  'Ajman',
  'Al Jerf 1',
  'Al Nuaimiya',
  'Al Rashidiya',
] as const

export const FAQ_GROUPS: Faq['group'][] = [
  'general',
  'services',
  'process',
  'materials-care',
  'pricing-quotations',
]

/**
 * Canonical homepage composition. The order below is asserted by
 * `tests/unit/content-integrity.test.ts` and matches the owned launch design.
 */
export const HOMEPAGE_BLOCK_ORDER = [
  'hero',
  'serviceGrid',
  'benefits',
  'processSteps',
  'splitContent',
  'projectGallery',
  'testimonials',
  'faqs',
  'locationCoverage',
  'quoteForm',
  'callToAction',
] as const

export type HomepageBlockType = (typeof HOMEPAGE_BLOCK_ORDER)[number]

/** Intended-use keys in `src/seed/media-manifest.json`. */
export const MEDIA_USAGE = {
  hero: 'hero-living-room.jpg',
  about: 'about-workshop.jpg',
  openGraph: 'og-default.jpg',
  service: (slug: string): string => `service-${slug}.jpg`,
} as const
