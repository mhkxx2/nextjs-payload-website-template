import type { Service } from '@/payload-types'
import { bulletList, heading, paragraph, richText, type SeedRichText } from './richtext'
import { SERVICE_AREAS } from './business'

/** Approved editorial content; imagery is inspiration, never evidence of customer work. */
export const BED_GALLERY_FILES = [
  'bed-upholstery-dubai-hero.webp',
  'headboard-upholstery-dubai.webp',
  'tufted-headboard.webp',
  'wingback-bed-upholstery.webp',
  'platform-upholstered-bed.webp',
  'upholstered-bed-frame.webp',
  'velvet-upholstered-bed.webp',
  'channel-headboard-detail.webp',
  'padded-wall-headboard.webp',
  'bedroom-fabric-detail.webp',
  'boucle-bedroom-texture.webp',
  'neutral-fabric-bed.webp',
  'bed-upholstery-before-worn.webp',
  'bed-upholstery-after-renewed.webp',
] as const

type Landing = NonNullable<Service['bedUpholsteryLanding']>
type WithFile<T> = Omit<T, 'image'> & { imageFile: string }
type WithOptionalFile<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] extends infer U | null | undefined
    ? U extends { id?: unknown }
      ? Omit<U, never> & { imageFile?: string }
      : U
    : never
}

export type BedLandingSeed = {
  popularServices: WithFile<NonNullable<Landing['popularServices']>[number]>[]
  fabricCards: WithFile<NonNullable<Landing['fabricCards']>[number]>[]
  headboardStyles: WithFile<NonNullable<Landing['headboardStyles']>[number]>[]
  upholsteryTypes: NonNullable<Landing['upholsteryTypes']>
  paddingComfort: NonNullable<Landing['paddingComfort']>
  beforeAfter: WithOptionalFile<NonNullable<Landing['beforeAfter']>, 'beforeImage' | 'afterImage'> & {
    beforeImageFile: string
    afterImageFile: string
  }
}

export const BED_LANDING_SEED: BedLandingSeed = {
  upholsteryTypes: [
    {
      title: 'Upholstered Bed Frames',
      description: 'Existing padded bed frames with upholstered side rails and footboards.',
    },
    {
      title: 'Headboards',
      description: 'Fabric, padded, tufted, channelled and custom-shaped headboards.',
    },
    {
      title: 'Wingback Beds',
      description: 'Tall upholstered beds with wrapped or winged headboards and padded frames.',
    },
    {
      title: 'Wall Panel Headboards',
      description: 'Individual padded wall panels or full-width upholstered headboard systems.',
    },
    {
      title: 'Divan & Platform Beds',
      description: 'Fabric-covered bases and padded platform-style beds.',
    },
    {
      title: 'Bed Benches & Matching Pieces',
      description: 'Upholstered benches, stools or coordinated bedroom seating.',
    },
  ],
  popularServices: [
    {
      title: 'Headboard Reupholstery',
      description: 'Strip the old cover, assess the board and re-upholster with fabric suited to bedroom use.',
      imageFile: 'headboard-upholstery-dubai.webp',
    },
    {
      title: 'Full Bed Frame Re-cover',
      description: 'Renew fabric on padded frames and footboards while retaining a sound existing structure.',
      imageFile: 'upholstered-bed-frame.webp',
    },
    {
      title: 'Tufted Headboard Refresh',
      description: 'Replace tufted fabric and discuss button layout on existing tufted headboards.',
      imageFile: 'tufted-headboard.webp',
    },
    {
      title: 'Wingback Bed Upholstery',
      description: 'Re-cover shaped wings and rolled edges on wingback beds and headboards.',
      imageFile: 'wingback-bed-upholstery.webp',
    },
    {
      title: 'Platform Bed Upholstery',
      description: 'Refresh padded platform surrounds and low-profile headboard sections.',
      imageFile: 'platform-upholstered-bed.webp',
    },
    {
      title: 'Wall Headboard Panels',
      description: 'Re-upholster padded wall panels and channel headboards fixed behind the bed.',
      imageFile: 'padded-wall-headboard.webp',
      href: '/custom-beds-headboards/',
      ctaLabel: 'Compare Custom Beds',
    },
    {
      title: 'Velvet & Textured Fabrics',
      description: 'Discuss velvet, boucle and woven bedroom fabrics using current samples.',
      imageFile: 'velvet-upholstered-bed.webp',
    },
    {
      title: 'Fabric & Padding Assessment',
      description: 'Send photos of worn areas so we can assess fabric, padding and fixings before quoting.',
      imageFile: 'bedroom-fabric-detail.webp',
    },
  ].map((card) => ({ ctaLabel: 'Get Free Quote', ...card })),
  fabricCards: [
    {
      title: 'Bedroom Linen Blends',
      imageFile: 'neutral-fabric-bed.webp',
      bestUse: 'Headboards and bed frames where a relaxed woven finish is preferred.',
      comfort: 'Blend and weave affect the hand-feel; compare samples in daylight.',
      durability: 'Creasing and cleaning depend on the chosen blend. Follow the sample care guidance.',
    },
    {
      title: 'Velvet',
      imageFile: 'velvet-upholstered-bed.webp',
      bestUse: 'Statement headboards and padded panels where a pile finish suits the room.',
      comfort: 'Smooth pile that shifts with light; feel a sample before ordering.',
      durability: 'Pressure marks can show on pile. Confirm care instructions for the selected velvet.',
    },
    {
      title: 'Boucle',
      imageFile: 'boucle-bedroom-texture.webp',
      bestUse: 'Soft, textured headboards and accent panels in calmer bedrooms.',
      comfort: 'Loop texture is tactile; compare samples against bedding colours.',
      durability: 'Loops can catch on sharp objects. Discuss household use before choosing.',
    },
    {
      title: 'Chenille & Woven Textures',
      imageFile: 'bedroom-fabric-detail.webp',
      bestUse: 'Everyday headboards and bed surrounds subject to the chosen specification.',
      comfort: 'Woven textures range from smooth to pronounced; choose with a sample.',
      durability: 'Wear depends on weave and fibre. No stain-proof performance is assumed.',
    },
    {
      title: 'Channel & Panel Fabrics',
      imageFile: 'channel-headboard-detail.webp',
      bestUse: 'Channel headboards and wall panels where consistent width and repeat matter.',
      comfort: 'Firmer wovens often suit channel work; confirm with a sample on the profile.',
      durability: 'Discuss expected use at the padded edges and seams.',
    },
  ],
  headboardStyles: [
    {
      title: 'Tufted headboard',
      description: 'Buttoned depth and spacing planned from the existing profile. AI-generated bedroom inspiration.',
      imageFile: 'tufted-headboard.webp',
    },
    {
      title: 'Wingback profile',
      description: 'Curved wings and rolled edges re-covered to follow the original shape.',
      imageFile: 'wingback-bed-upholstery.webp',
    },
    {
      title: 'Channel headboard',
      description: 'Vertical or horizontal channels re-upholstered with even spacing across the panel.',
      imageFile: 'channel-headboard-detail.webp',
    },
    {
      title: 'Wall-padded headboard',
      description: 'Full-width padded sections behind the mattress, including plain or channel layouts.',
      imageFile: 'padded-wall-headboard.webp',
    },
    {
      title: 'Platform bed',
      description: 'Low upholstered surrounds with integrated or separate headboard panels.',
      imageFile: 'platform-upholstered-bed.webp',
    },
    {
      title: 'Upholstered frame',
      description: 'Padded side rails and footboards on existing framed beds.',
      imageFile: 'upholstered-bed-frame.webp',
    },
  ],
  paddingComfort: {
    heading: 'Refresh Padding, Not Just the Fabric',
    copy: 'Bed upholstery fails when collapsed padding or loose fixings sit underneath a new cover. We assess the board, foam and attachments and quote the work your bed actually needs.',
    items: [
      { text: 'Headboard boards and fixings checked before fabric is ordered' },
      { text: 'Padding and foam discussed where dips or hardness show in photos' },
      { text: 'Wall panels and frame rails assessed for movement or damage' },
      { text: 'Existing structure retained where it is still sound' },
    ],
    ctaLabel: 'Send Bed Photos for Assessment',
  },
  beforeAfter: {
    heading: 'Before & After Inspiration',
    copy: 'These staged examples show the kind of renewal possible when an existing upholstered bed or headboard is re-covered. They are design inspiration, not a record of a specific client project.',
    beforeImageFile: 'bed-upholstery-before-worn.webp',
    afterImageFile: 'bed-upholstery-after-renewed.webp',
    beforeCaption: 'Worn fabric and flattened padding on an existing headboard — inspiration only.',
    afterCaption: 'Renewed cover and refreshed padding on the same profile — inspiration only.',
  },
}

export const BED_FAQS = [
  [
    'Can you reupholster an existing bed?',
    'Yes. We assess existing upholstered beds and headboards for fabric replacement and padding renewal when the structure is still sound. Send photos of the full bed, headboard and worn areas to begin a quotation.',
  ],
  [
    'Can you change only the headboard fabric?',
    'Yes. Many projects are headboard-only. Share photos of the full headboard, edges and fixings so we can assess the board and padding before quoting.',
  ],
  [
    'Can you reupholster a wingback bed?',
    'Yes. Wingback and shaped headboards can be re-covered when the existing profile is sound. Photos of both wings, the centre panel and any worn edges help us plan the fabric cutting.',
  ],
  [
    'Can the padding inside a headboard be replaced?',
    'Padding is assessed from photos and during inspection. Flattened or uneven areas are discussed and any replacement foam or fibre layers are agreed before the new cover is fitted.',
  ],
  [
    'Can I choose a different fabric and colour?',
    'Yes. Compare current bedroom fabric samples for colour, texture and care guidance. Availability is confirmed for your quotation before fabric is ordered or cut.',
  ],
  [
    'Can I provide my own upholstery fabric?',
    'Yes. Send fabric details or bring a sample before buying the full quantity. We check suitability, width and pattern repeat against your bed or headboard and confirm the amount needed.',
  ],
  [
    'Can you upholster bed side rails and the footboard?',
    'Yes, when the frame already has upholstered panels. Share photos of the side rails, footboard and any storage base so we can confirm what can be re-covered.',
  ],
  [
    'Can you reupholster wall-mounted headboard panels?',
    'Yes. Padded wall panels and channel headboards are assessed for fixings before fabric is removed. Photos of the full wall run and panel edges help us plan the work.',
  ],
  [
    'Do you make new custom beds as well?',
    'Yes. New made-to-measure beds and headboards are a separate service. See Custom Beds & Headboards when you need a new size, shape or storage build rather than reupholstery.',
  ],
  [
    'How do I get a bed upholstery quotation?',
    'Send clear photos of the full bed, headboard, side rails, worn areas and approximate dimensions, plus your location and fabric preferences. We reply with any follow-up questions needed for a quotation.',
  ],
  [
    'Do you provide bed upholstery in Dubai?',
    'Yes. Serving Dubai and the UAE from our Ajman workshop. Share your area when requesting a quotation so assessment and handover arrangements can be confirmed.',
  ],
  [
    'Can I send photos on WhatsApp?',
    'Yes. Use the WhatsApp action to send photos of the full bed, headboard, worn areas and approximate measurements. Add your location and any fabric preferences.',
  ],
] as const

export const BED_PROCESS = [
  {
    title: 'Send Bed Photos',
    description:
      'Share the full bed, headboard, side rails, footboard, damaged or worn areas and approximate dimensions.',
  },
  {
    title: 'Choose Fabric & Finish',
    description: 'Discuss fabric, colour, texture, piping, stitching and tufting or panel details using current samples.',
  },
  {
    title: 'Strip & Reupholster',
    description:
      'Existing upholstery is removed and required padding or repairs are assessed before new fabric is fitted in our Ajman workshop.',
  },
  {
    title: 'Final Fitting & Handover',
    description: 'Panels and upholstered sections are checked for alignment, finish and fit before the agreed handover.',
  },
] as const

export const BED_BENEFITS = [
  {
    title: 'Made in our Ajman workshop',
    description: 'Bed and headboard upholstery is carried out from our workshop in Al Jerf 1, Ajman.',
  },
  {
    title: 'Bedroom fabric guidance',
    description: 'Compare current samples suited to headboards, panels and padded frames.',
  },
  {
    title: 'Photo quotation available',
    description: 'Send bed photos and measurements to begin assessment and request a quotation.',
  },
  {
    title: 'Structure assessed first',
    description: 'Boards, fixings and padding are reviewed before fabric is cut.',
  },
  {
    title: 'Renew what you own',
    description: 'Keep a sound bed frame or headboard profile while updating fabric and comfort.',
  },
  {
    title: 'Serving Dubai, Sharjah and UAE',
    description: 'Share your location so assessment and transport arrangements can be confirmed.',
  },
] as const

export const BED_METADATA = {
  title: 'Bed Upholstery Dubai | Headboard Reupholstery | Al Rukn',
  description:
    'Bed upholstery in Dubai for fabric replacement, headboard reupholstery, padding renewal and bed restoration. Serving Dubai from our Ajman workshop. Send photos for a quote.',
} as const

export const BED_SERVICE_SEED = {
  slug: 'bed-upholstery',
  title: 'Bed Upholstery',
  summary:
    'Renew an existing upholstered bed with new fabric, fresh padding and carefully finished detailing — bed frames, headboards, wingbacks and padded wall panels.',
  hero: {
    eyebrow: 'Bed & Headboard Reupholstery',
    heading: 'Bed Upholstery in Dubai',
    copy: 'Renew an existing upholstered bed with new fabric, fresh padding and carefully finished detailing. We reupholster bed frames, headboards, wingback beds and padded wall panels for customers across Dubai, Sharjah and the UAE from our Ajman workshop.',
    imageFile: 'bed-upholstery-dubai-hero.webp',
  },
  details: richText(
    heading('What Bed Reupholstery Actually Involves'),
    paragraph(
      'An upholstered bed is more than the visible fabric. Depending on construction it can include a timber frame, padding, foam, fabric, piping, stitching, tufting, headboard panels, side rails and a footboard.',
    ),
    paragraph(
      'The existing bed should be assessed before fabric is removed. Typical work includes removing worn upholstery, inspecting the bed or headboard structure, renewing damaged padding, replacing fabric, recreating seams or piping, refitting upholstered panels and restoring the finished shape.',
    ),
    paragraph(
      'Need a new custom-made bed instead? See Custom Beds & Headboards. Want to renew an existing upholstered bed? This page is for reupholstery, fabric replacement and padding renewal — not new-build bedroom furniture.',
    ),
    bulletList([
      'Existing bed frames, headboards and wall panels assessed before stripping',
      'Fabric, padding and finish planned around the piece you already own',
      'Custom beds and headboards remain a separate new-build service',
    ]),
  ) satisfies SeedRichText,
  trustItems: [
    'Bed Frame Reupholstery',
    'Headboard Fabric Replacement',
    'Padding & Foam Renewal',
    'Photo Quotation Available',
  ],
  serviceOptions: {
    eyebrow: 'What We Upholster',
    heading: 'Beds & Headboards We Can Reupholster',
    intro: 'Existing upholstered beds and headboards assessed for fabric replacement, padding renewal and carefully finished detailing.',
  },
  materialsHeading: 'Choose a Fabric That Fits the Bedroom',
  processHeading: 'Our Bed Upholstery Process',
  comparison: {
    heading: 'Reupholstery vs New Custom Bed',
    intro:
      'Choose reupholstery when the existing frame still suits the room. Choose a new custom bed when size, shape or storage need to change.',
    leftTitle: 'Reupholster Your Existing Bed',
    leftItems: [
      'Existing frame is sound',
      'Current size still works',
      'Fabric is worn or outdated',
      'Padding needs renewing',
      'You want a new colour or texture',
    ],
    rightTitle: 'New Custom Bed',
    rightItems: [
      'Dimensions need changing',
      'Completely different shape required',
      'Integrated wall panels required',
      'Storage or new construction required',
      'Existing frame is not suitable',
    ],
  },
  galleryHeading: 'Bed Upholstery Design Inspiration',
  galleryIntro:
    'Explore upholstered bed styles, headboard shapes, fabric textures and finishing details from our curated design collection for inspiration.',
  serviceAreaHeading: 'Bed Upholstery Across Dubai, Sharjah & UAE',
  serviceAreaCopy: 'Serving Dubai and the UAE from our Ajman workshop. Share your area when requesting a quotation.',
  areaLinkLabel: 'View areas we serve',
  relatedHeading: 'Related Furniture Services',
  relatedSlugs: ['custom-beds-headboards', 'sofa-upholstery', 'custom-furniture', 'custom-sofa', 'curtains-blinds'],
  faqQuestions: BED_FAQS.map(([question]) => question),
  serviceAreas: [...SERVICE_AREAS],
  galleryFiles: [...BED_GALLERY_FILES],
  bedUpholsteryLanding: BED_LANDING_SEED,
  presentationLabels: {
    heroQuoteLabel: 'Get Free Quote',
    processCtaLabel: 'Get Bed Upholstery Quote',
    quoteWhatsAppLabel: 'WhatsApp Your Photos',
    workshopNote: 'Serving Dubai and the UAE from our Ajman workshop.',
    benefitsEyebrow: 'Is Your Bed Worth Reupholstering?',
    benefitsHeading: 'Is Your Existing Bed Worth Reupholstering?',
    materialsEyebrow: 'Fabric & Finish',
    processEyebrow: 'From Enquiry to Handover',
    galleryEyebrow: 'Design Inspiration',
    areasEyebrow: 'Local Service Coverage',
    faqEyebrow: 'FAQs',
    faqHeading: 'Bed Upholstery FAQs',
    faqIntroduction: 'Practical answers about reupholstering beds and headboards in Dubai.',
    relatedEyebrow: 'Related Services',
    quoteEyebrow: 'Start With a Photo',
  },
  quotationContext: {
    heading: 'Send Your Bed or Headboard Photo',
    message:
      'Include the full bed, headboard, side rails, approximate size and close photos of worn fabric or damaged padding.',
    buttonLabel: 'Request a Bed Upholstery Quote',
  },
  whatsAppContext: {
    label: 'WhatsApp Your Bed Photo',
    message: 'Hello Al Rukn, I would like a quotation for bed or headboard upholstery. I can share photos.',
  },
  seo: {
    title: BED_METADATA.title,
    description: BED_METADATA.description,
  },
  visualVariant: 'image-right' as const,
  benefits: [...BED_BENEFITS],
  process: [...BED_PROCESS],
  materialsCapabilities: [],
  featureSections: [],
}
