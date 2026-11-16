import type { Service } from '@/payload-types'

/** Approved editorial content; imagery is inspiration, never evidence of customer work. */
export const SOFA_GALLERY_FILES = [
  'sofa-eco-nivo.webp',
  'sofa-eco-elvio.webp',
  'sofa-eco-elvio-detail.webp',
  'sofa-eco-averon.webp',
  'sofa-eco-aura.webp',
  'sofa-eco-aura-detail.webp',
  'sofa-eco-arco.webp',
  'sofa-eco-two-tone.webp',
]

type Landing = NonNullable<Service['sofaUpholsteryLanding']>
type WithFile<T> = Omit<T, 'image'> & { imageFile: string }
export type SofaLandingSeed = {
  popularServices: WithFile<NonNullable<Landing['popularServices']>[number]>[]
  fabricCards: WithFile<NonNullable<Landing['fabricCards']>[number]>[]
  foamComfort: NonNullable<Landing['foamComfort']>
  bedTeaser: WithFile<NonNullable<Landing['bedTeaser']>>
}

export const SOFA_LANDING_SEED: SofaLandingSeed = {
  popularServices: [
    { title: 'Full Sofa Reupholstery', description: 'Replace worn covers and assess the frame, suspension and padding before agreeing the work.', imageFile: 'sofa-eco-two-tone.webp' },
    { title: 'Fabric Replacement', description: 'Refresh the colour and texture with upholstery fabric selected for your sofa and daily use.', imageFile: 'sofa-eco-aura-detail.webp' },
    { title: 'Foam & Cushion Replacement', description: 'Assess flattened seat and back cushions and discuss replacement foam and support.', imageFile: 'sofa-eco-elvio-detail.webp' },
    { title: 'Sofa Repair & Frame Support', description: 'Assess loose joints, frame faults, springs and webbing before replacing usable upholstery. AI-generated repair illustration.', imageFile: 'service-sofa-repair-detail-ai.webp', href: '/sofa-repair/' },
    { title: 'L-Shaped Sofa Upholstery', description: 'Re-cover chaise and sectional seating with panels and cushion joins planned together.', imageFile: 'sofa-eco-elvio.webp' },
    { title: 'Corner Sofa Upholstery', description: 'Renew the covers and padding around corner sections, arms and individual seating units.', imageFile: 'sofa-eco-nivo.webp' },
    { title: 'Chair Upholstery', description: 'Discuss new covers and padding for armchairs, accent chairs and dining chairs.', imageFile: 'sofa-eco-arco.webp' },
    { title: 'Majlis Cushion Upholstery', description: 'Refresh Majlis seat cushions, backs and bolsters while retaining suitable existing bases. AI-generated cushion inspiration.', imageFile: 'service-majlis-furniture-detail-ai.webp' },
    { title: 'Bed & Headboard Upholstery', description: 'Renew fabric and padding on existing beds and headboards. AI-generated headboard inspiration.', imageFile: 'service-custom-beds-headboards-detail-ai.webp', href: '/bed-upholstery/', ctaLabel: 'Explore Bed Upholstery' },
  ].map((card) => ({ ctaLabel: 'Get Free Quote', ...card })),
  fabricCards: [
    { title: 'Chenille', imageFile: 'service-sofa-upholstery-detail-ai.webp', bestUse: 'Everyday sofas and Majlis cushions; confirm a suitable sample for the intended use.', comfort: 'A soft, textured surface; compare samples by touch.', durability: 'Wear and cleaning depend on the selected weave and fibre blend. Check the sample care guidance.' },
    { title: 'Velvet', imageFile: 'sofa-eco-aura-detail.webp', bestUse: 'Sofas and accent seating where a pile finish suits the room.', comfort: 'A smooth pile that changes appearance with light and brushing.', durability: 'Pile can show pressure marks. Confirm the selected fabric care instructions before use.' },
    { title: 'Boucle', imageFile: 'sofa-eco-arco.webp', bestUse: 'Accent chairs and softly shaped seating with a looped texture.', comfort: 'A pronounced, tactile surface; feel a sample before choosing.', durability: 'Loops can catch on sharp objects or claws. Discuss the household and intended use.' },
    { title: 'Linen Blends', imageFile: 'service-custom-sofa-detail-ai.webp', bestUse: 'Sofas and loose cushions where a woven, relaxed finish is preferred.', comfort: 'Blend and weave affect the feel; compare the available samples.', durability: 'Creasing and cleaning requirements vary by blend. Follow the selected fabric care guidance.' },
    { title: 'Durable Woven Fabrics', imageFile: 'sofa-eco-elvio-detail.webp', bestUse: 'Regularly used sofas and family seating, subject to the chosen fabric specification.', comfort: 'Woven textures range from smooth to more pronounced; choose with a sample.', durability: 'Discuss expected wear and cleaning needs. No stain-proof or pet-proof performance is assumed.' },
  ],
  foamComfort: {
    heading: 'Restore Comfort, Not Just the Fabric',
    copy: 'A fresh cover cannot correct collapsed foam or failed support underneath. We assess the cushions, frame and suspension and quote the changes your sofa needs.',
    items: [
      { text: 'Seat and back cushions assessed for shape and support' },
      { text: 'Replacement foam and padding discussed around your preferred firmness' },
      { text: 'Springs, webbing and frame checked where the fault requires access' },
      { text: 'Usable parts retained where suitable' },
    ],
    ctaLabel: 'Send Sofa Photos for Assessment',
  },
  bedTeaser: { title: 'Bed Upholstery', description: 'Renew fabric and padding on existing beds and headboards you already own. AI-generated headboard inspiration.', label: 'Explore Bed Upholstery', href: '/bed-upholstery/', imageFile: 'service-custom-beds-headboards-detail-ai.webp' },
}

export const SOFA_FAQS = [
  ['Is sofa reupholstery cheaper than buying a new sofa?', 'It depends on the condition and construction of your sofa, the fabric selected and the repairs needed. We assess the existing frame and quote the work so you can compare reupholstery with buying a replacement.'],
  ['Can you replace sofa foam?', 'Yes. We assess flattened or uneven seat and back cushions and discuss replacement foam, padding and firmness. Send photos of the sofa and cushions so the required work can be considered before quotation.'],
  ['Can you upholster L-shaped sofas?', 'Yes. We assess L-shaped sofas and sectional seating, including chaise sections and removable cushions. Share photos of the full layout, each section and any worn areas so we can discuss the upholstery scope.'],
  ['Can you upholster corner sofas?', 'Yes. Corner sofas can be assessed for fabric replacement and cushion renewal. Photos of the corner, arms, backs and individual sections help us understand the construction and prepare an appropriate quotation.'],
  ['Can I provide my own fabric?', 'Yes. Send the fabric details or bring a sample before buying the full quantity. We check suitability, width and pattern repeat against your sofa and confirm the amount needed before the fabric is cut.'],
  ['Which upholstery fabrics do you offer?', 'The upholstery options include chenille, velvet, boucle, linen blends and suitable durable woven fabrics. Ask to compare current samples and care guidance; colours and availability are confirmed for your quotation.'],
  ['Can you repair the frame during upholstery?', 'The frame and support can be assessed when the covers are removed. Loose joints, springs or webbing are discussed and any additional repair work is agreed before proceeding; suitability depends on the existing structure.'],
  ['How can I get a quotation?', 'Send clear sofa photos, approximate measurements and your preferred fabric or style. Include the number of sections, cushion condition and your location so the team can ask any follow-up questions needed for a quotation.'],
  ['Do you upholster chairs?', 'Yes. Armchairs, accent chairs and dining chairs can be assessed for replacement covers and padding. Share the chair quantity, photos and approximate dimensions so the construction and required work can be reviewed.'],
  ['Do you upholster Majlis seating?', 'Yes. Majlis seating, cushion sets, backs and bolsters can be assessed for new upholstery. Send photos of the full layout and the existing cushions so we can discuss fabric, foam and any base repairs separately.'],
  ['Do you offer bed upholstery?', 'Yes. Bed and headboard reupholstery is available at /bed-upholstery/ for existing upholstered beds. Send photos of the headboard or frame for assessment. Custom new beds are handled separately under custom beds and headboards.'],
  ['Do you serve Dubai from Ajman?', 'Yes. Serving Dubai from our Ajman workshop. We also handle enquiries from Sharjah and other UAE locations. Share your area when requesting a quotation so assessment, collection and delivery arrangements can be confirmed.'],
  ['Can I send sofa photos on WhatsApp?', 'Yes. Use the WhatsApp action to send clear photos of the full sofa, cushions, arms and damaged areas. Add approximate measurements, your location and any fabric or comfort preferences so we can assess the enquiry.'],
] as const

export const SOFA_PROCESS = [
  { title: 'Send Sofa Photos', description: 'Share the full sofa, worn areas, approximate measurements and location so we can assess the enquiry.' },
  { title: 'Choose Fabric & Foam', description: 'Compare suitable fabric samples and discuss foam, firmness and the work included in the quotation.' },
  { title: 'Strip, Repair & Upholster', description: 'Covers are removed, agreed repairs completed and new upholstery cut, stitched and fitted in our Ajman workshop.' },
  { title: 'Final Check & Handover', description: 'The upholstery and cushions are checked and the agreed handover or delivery arrangements confirmed.' },
]

export const SOFA_BENEFITS = [
  { title: 'Made in our Ajman workshop', description: 'Upholstery work is carried out from our workshop in Al Jerf 1, Ajman.' },
  { title: 'Fabric and foam options', description: 'Discuss current fabric samples and replacement foam suited to your seating and preferences.' },
  { title: 'Photo quotation available', description: 'Send sofa photos and measurements to begin assessment and request a quotation.' },
  { title: 'Frame assessment', description: 'The existing structure and support are assessed before additional repair work is agreed.' },
  { title: 'Custom workmanship', description: 'Covers and cushions are prepared around the existing sofa construction and agreed finish.' },
  { title: 'Serving Dubai, Sharjah and UAE', description: 'Share your location so the assessment and transport arrangements can be confirmed.' },
]
