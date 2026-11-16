import { BUSINESS, SERVICE_AREAS } from './business'
import { bulletList, heading, paragraph, richText, type SeedRichText } from './richtext'
import { SERVICE_ENHANCEMENTS, SERVICE_FAQ_QUESTIONS, type ServiceEnhancement } from './serviceEnhancements'
import { SOFA_BENEFITS, SOFA_FAQS, SOFA_GALLERY_FILES, SOFA_LANDING_SEED, SOFA_PROCESS, type SofaLandingSeed } from './sofaUpholsteryContent'
import type { Service } from '@/payload-types'

export interface ServiceSeed {
  sofaUpholsteryLanding?: SofaLandingSeed
  presentationLabels?: Service['presentationLabels']
  slug: string
  title: string
  summary: string
  hero: {
    eyebrow: string
    heading: string
    copy: string
    imageFile: string
  }
  details: SeedRichText
  benefits: { title: string; description: string }[]
  materialsCapabilities: { title: string; description: string }[]
  process: { title: string; description: string }[]
  faqQuestions: string[]
  serviceAreas: string[]
  galleryFiles: string[]
  whatsAppContext: { label: string; message: string }
  relatedSlugs: string[]
  visualVariant: ServiceEnhancement['visualVariant']
  trustItems: string[]
  serviceOptions: ServiceEnhancement['serviceOptions']
  featureSections: ServiceEnhancement['featureSections']
  materialsHeading: string
  processHeading: string
  comparison?: ServiceEnhancement['comparison']
  galleryHeading: string
  galleryIntro: string
  serviceAreaHeading: string
  serviceAreaCopy: string
  areaLinkLabel: string
  relatedHeading: string
  seo: ServiceEnhancement['seo']
  quotationContext: ServiceEnhancement['quotationContext']
}

const SHARED_ASSETS = new Set(['about-workshop', 'hero-living-room', 'og-default'])

/** Maps a seed asset name to the filename recorded in `media-manifest.json`. */
const assetFile = (name: string): string =>
  SHARED_ASSETS.has(name) ? `${name}.jpg` : `service-${name}.jpg`

const gallery = (primary: string, supporting: string): string[] => [
  assetFile(primary),
  assetFile(supporting),
]

const areas = [...SERVICE_AREAS]

const BASE_SERVICE_SEEDS = [
  {
    slug: 'sofa-upholstery',
    title: 'Sofa Upholstery',
    summary:
      'Re-cover the sofa you already own. Choose the fabric, we strip the frame, replace tired foam and stitch the covers to fit in our Al Jerf 1 workshop.',
    hero: {
      eyebrow: 'Upholstery workshop in Ajman',
      heading: 'Sofa upholstery measured, stripped and re-covered',
      copy: `${BUSINESS.brandName} re-upholsters three-seaters, corner units, armchairs and majlis benches. Bring the piece to the workshop or send photos on WhatsApp and we will tell you which parts can be saved.`,
      imageFile: 'service-sofa-upholstery.jpg',
    },
    details: richText(
      heading('What re-upholstery actually involves'),
      paragraph(
        'A sofa is a frame, a suspension system and a set of cushions. Re-upholstery works when the frame and springs are still sound, so the first thing we do is inspect the piece on the bench before any fabric is cut.',
      ),
      paragraph(
        'Once we know the frame is worth keeping, the old covers come off, worn foam is measured and replaced, and new covers are cut and stitched to the original panels. Piping, seams and cushion zips are matched to the fabric you pick.',
      ),
      bulletList([
        'Single cushions can be re-covered without touching the rest of the sofa',
        'Foam density is chosen for how the seat is used, not one standard block',
        'Loose covers and fixed covers are handled as separate jobs',
      ]),
      heading('Choosing fabric without guesswork'),
      paragraph(
        'We keep a working range of upholstery fabrics in the workshop, including weaves that hold up in a busy majlis. If you already have fabric, bring it and we will confirm whether it is suitable for the frame before cutting.',
      ),
    ),
    benefits: [
      {
        title: 'Keep a frame that still works',
        description:
          'If the timber and springs are sound, re-covering lets you retain a piece you already know. Compare the quotation with replacement before deciding.',
      },
      {
        title: 'Fabric you choose',
        description:
          'Pick from the workshop range or bring your own roll. We check the fabric weight before cutting so the seams sit flat.',
      },
      {
        title: 'Foam and padding renewed',
        description:
          'Seat and back foam are replaced where they have collapsed, then shaped to the original cushion profile.',
      },
      {
        title: 'Covers stitched to fit',
        description:
          'Covers are cut from the stripped panels, so corners, arms and skirts line up as they did originally.',
      },
    ],
    materialsCapabilities: [
      {
        title: 'Upholstery weaves',
        description:
          'Chenille, linen blends, boucle, velvet and suitable woven fabrics, with current samples confirmed before ordering.',
      },
      {
        title: 'Foam grades',
        description:
          'Seat and back foam, cushion filling and padding discussed according to the existing construction and required firmness.',
      },
      {
        title: 'Trims and fittings',
        description:
          'Piping, contrast seams, zip repairs, studs and replacement legs for frames that need them.',
      },
    ],
    process: [
      {
        title: 'Send photos or bring the sofa in',
        description:
          'Photographs of the frame, cushions and any damage help us say what is worth re-covering before you transport anything.',
      },
      {
        title: 'Choose fabric and foam',
        description:
          'We lay the options out against your piece and agree the fabric, foam grade and finish details.',
      },
      {
        title: 'Strip, repair and stitch',
        description:
          'The sofa is stripped on the bench, minor frame repairs are made, then new covers are cut and stitched.',
      },
      {
        title: 'Reassemble and hand over',
        description:
          'Cushions are refilled, the sofa is reassembled and checked, then handed back or delivered.',
      },
    ],
    faqQuestions: [
      'Can you re-upholster a sofa without replacing the frame?',
      'Can I supply my own fabric?',
      'How do I get a price for upholstery work?',
      'Do you collect and deliver furniture?',
    ],
    serviceAreas: areas,
    galleryFiles: gallery('sofa-upholstery', 'custom-sofa'),
    quotationContext: {
      heading: 'Get a quotation for sofa upholstery',
      message:
        'Share the sofa type, how many pieces and a photo of the frame and cushions. We will reply with what we need to quote.',
    },
    whatsAppContext: {
      label: 'Send sofa photos on WhatsApp',
      message: 'Hello Al Rukn, I would like a quotation for sofa upholstery work.',
    },
    relatedSlugs: ['sofa-repair', 'custom-sofa', 'majlis-furniture'],
  },
  {
    slug: 'custom-furniture',
    title: 'Custom Furniture',
    summary:
      'Furniture built to your dimensions: TV units, dining tables, shelving and media walls made from solid timber in the Al Jerf 1 workshop.',
    hero: {
      eyebrow: 'Made to measure',
      heading: 'Custom furniture built to the space you have',
      copy: `Walls are rarely square and rooms are rarely standard sizes. ${BUSINESS.brandName} builds timber furniture to the measurements taken on site, so the piece fits once and stays fitted.`,
      imageFile: 'service-custom-furniture.jpg',
    },
    details: richText(
      heading('Where custom build makes sense'),
      paragraph(
        'Custom furniture earns its place when a standard unit leaves a gap, blocks a switch, or cannot reach a ceiling height. Alcoves, stair returns, low bulkheads and long living walls usually need something built rather than bought.',
      ),
      paragraph(
        'We work from site measurements, agree the drawing, and build the piece in the workshop. Solid timber and veneered board are used where each is appropriate: solid for edges and load-bearing joints, veneer and board where a stable flat panel matters more.',
      ),
      bulletList([
        'Fixed and freestanding pieces are quoted differently',
        'Finishes are matched to existing joinery where you want continuity',
        'Cut-outs for sockets, cables and lighting are planned before assembly',
      ]),
    ),
    benefits: [
      {
        title: 'Built to your measurements',
        description:
          'Dimensions come from the room, not a catalogue, so alcoves and awkward returns are used rather than ignored.',
      },
      {
        title: 'Timber chosen for the job',
        description:
          'Frames and edges in solid timber, panels in stable board, finished for the room it will live in.',
      },
      {
        title: 'Planning before cutting',
        description:
          'Drawings and cut-outs are agreed first, including sockets, cable routes and opening clearances.',
      },
      {
        title: 'Assembly that suits the site',
        description:
          'Pieces are built as modules where a staircase or lift makes a single carcass impractical.',
      },
    ],
    materialsCapabilities: [
      {
        title: 'Solid timber',
        description: 'Frames, legs, edges and tops in the timber species agreed at drawing stage.',
      },
      {
        title: 'Boards and veneers',
        description: 'Moisture-resistant boards and veneered panels for flat surfaces and cabinet interiors.',
      },
      {
        title: 'Hardware',
        description: 'Soft-close hinges, drawer runners, handles and cable management fitted as part of the build.',
      },
    ],
    process: [
      {
        title: 'Measure and brief',
        description: 'We take the room measurements and agree what the piece needs to hold and hide.',
      },
      {
        title: 'Drawing and finish',
        description: 'Dimensions, layout and finish are confirmed before any material is cut.',
      },
      {
        title: 'Build in the workshop',
        description: 'Carcass, joinery and finish are completed on the bench, away from the room.',
      },
      {
        title: 'Fit on site',
        description: 'Modules are assembled, levelled and fixed, with cut-outs aligned to services.',
      },
    ],
    faqQuestions: [
      'What custom furniture can you build?',
      'How long does a custom furniture project take?',
      'How do I get a price for upholstery work?',
      'Do you collect and deliver furniture?',
    ],
    serviceAreas: areas,
    galleryFiles: gallery('custom-furniture', 'about-workshop'),
    quotationContext: {
      heading: 'Request a custom furniture quotation',
      message:
        'Send the room measurements, a photo of the space and what the piece needs to do. We will confirm what is buildable and quote from there.',
    },
    whatsAppContext: {
      label: 'Discuss your build on WhatsApp',
      message: 'Hello Al Rukn, I would like a quotation for custom furniture.',
    },
    relatedSlugs: ['custom-wardrobes', 'office-furniture', 'custom-beds-headboards'],
  },
  {
    slug: 'custom-sofa',
    title: 'Custom Sofa',
    summary:
      'Sofas built to the length, depth and seat height your room needs, with the fabric and cushion fill you choose.',
    hero: {
      eyebrow: 'Made to measure seating',
      heading: 'A sofa built to your room, not a standard size',
      copy: `When an off-the-shelf sofa is too long for the wall or too low for the people using it, ${BUSINESS.brandName} builds the seating to your own dimensions instead.`,
      imageFile: 'service-custom-sofa.jpg',
    },
    details: richText(
      heading('Sizing a sofa properly'),
      paragraph(
        'Three numbers decide whether a sofa works in a room: overall length against the wall, seat depth for the way people sit, and seat height for getting up easily. We agree those before the frame is built.',
      ),
      paragraph(
        'Frames are built from solid timber, the suspension is chosen for the expected use, and the fill is matched to how firm you want the seat. A single long bench, a corner return or a pair of matching sofas are all built to the same measurement sheet.',
      ),
      bulletList([
        'Seat height can be raised for easier standing and lower settings are available for lounging layouts',
        'Fixed or removable covers are both possible',
        'Delivery access is checked before the frame is glued and fixed',
      ]),
    ),
    benefits: [
      {
        title: 'Dimensions from your room',
        description:
          'Length, depth and seat height are set against the actual wall and doorway you have.',
      },
      {
        title: 'Seat feel you choose',
        description:
          'Firm, medium and soft fills are available, and the seat can be built for daily family use.',
      },
      {
        title: 'Fabric matched to the room',
        description:
          'Choose from the workshop range or bring your own fabric for us to check before cutting.',
      },
      {
        title: 'Built for access',
        description:
          'Modules are planned around stair widths and lift sizes so the sofa reaches the room.',
      },
    ],
    materialsCapabilities: [
      {
        title: 'Solid timber frames',
        description: 'Joints glued and fixed, with corner blocks at the load-bearing points.',
      },
      {
        title: 'Suspension',
        description: 'Sprung or webbed bases selected for the size of the sofa and how it will be used.',
      },
      {
        title: 'Cushion fills',
        description: 'Foam, fibre wrap and layered fills combined to reach the firmness you asked for.',
      },
    ],
    process: [
      {
        title: 'Agree the measurements',
        description: 'Wall length, seat depth, seat height and access route are confirmed first.',
      },
      {
        title: 'Select fabric and fill',
        description: 'Fabric, cushion fill and detailing are chosen against samples in the workshop.',
      },
      {
        title: 'Build the frame and covers',
        description: 'Frame, suspension and covers are built and assembled as one piece.',
      },
      {
        title: 'Check and deliver',
        description: 'The finished sofa is checked for level, alignment and cushion fit before handover.',
      },
    ],
    faqQuestions: [
      'Can you build a sofa to my exact dimensions?',
      'Can I supply my own fabric?',
      'How long does a custom sofa take?',
      'How do I get a price for upholstery work?',
    ],
    serviceAreas: areas,
    galleryFiles: gallery('custom-sofa', 'sofa-upholstery'),
    quotationContext: {
      heading: 'Request a custom sofa quotation',
      message:
        'Tell us the length, seat depth and seat height you need, plus the fabric direction. We will confirm the build and quote it.',
    },
    whatsAppContext: {
      label: 'Share your sofa dimensions',
      message: 'Hello Al Rukn, I would like a quotation for a custom sofa.',
    },
    relatedSlugs: ['sofa-upholstery', 'majlis-furniture', 'sofa-repair'],
  },
  {
    slug: 'majlis-furniture',
    title: 'Majlis Furniture',
    summary:
      'Majlis seating built as low benches and cushion sets, with upholstered bases, loose back cushions and fabric you choose.',
    hero: {
      eyebrow: 'Majlis seating',
      heading: 'Majlis seating built around the room',
      copy: `Majlis rooms are measured wall by wall. ${BUSINESS.brandName} builds the benches and cushions to sit along them, rather than placing standard sofas and hoping the corners work.`,
      imageFile: 'service-majlis-furniture.jpg',
    },
    details: richText(
      heading('How a majlis set is put together'),
      paragraph(
        'The base is usually a low upholstered bench running the length of the wall, sometimes with a corner return. Back cushions lean against the wall or a low back panel, and seat cushions sit on top of the base.',
      ),
      paragraph(
        'Because the bench follows the room, we take the wall run, corners and door clearances as one measurement sheet. Cushions are then cut to that run so the seams land in the same places on every section.',
      ),
      bulletList([
        'Long wall runs are built in sections so they can be brought in through the door',
        'Seat and back cushions can be re-covered later without rebuilding the base',
        'Fabric and foam are matched to how often the room is used',
      ]),
    ),
    benefits: [
      {
        title: 'Built to the wall run',
        description:
          'Bench length follows the measured run, including corners, so the seating lines up with the room.',
      },
      {
        title: 'Cushions that keep their shape',
        description:
          'Foam grades and fibre wraps are selected for the amount of use the majlis gets.',
      },
      {
        title: 'Sections that fit the doorway',
        description:
          'Long runs are built in modules that can be carried in and joined on site.',
      },
      {
        title: 'Fabric you choose',
        description:
          'Pick a hard-wearing weave from the workshop range or bring your own fabric for checking.',
      },
    ],
    materialsCapabilities: [
      {
        title: 'Upholstered bases',
        description: 'Low benches built on timber frames and upholstered to the agreed height.',
      },
      {
        title: 'Back panels',
        description: 'Low padded back panels where the wall or layout needs them.',
      },
      {
        title: 'Cushion sets',
        description: 'Seat and back cushions cut to the bench run, with zip covers for cleaning.',
      },
    ],
    process: [
      {
        title: 'Measure the room',
        description: 'Wall runs, corners, door swings and ceiling heights are recorded together.',
      },
      {
        title: 'Agree layout',
        description: 'Bench height, back panel and cushion sizes are confirmed against the layout.',
      },
      {
        title: 'Build base and cushions',
        description: 'Frames are built, upholstered and the cushion set is stitched to match.',
      },
      {
        title: 'Install on site',
        description: 'Sections are carried in, joined and levelled along the wall.',
      },
    ],
    faqQuestions: [
      'How is majlis seating built and installed?',
      'Can you match the fabric to my existing majlis?',
      'Do you collect and deliver furniture?',
      'How do I get a price for upholstery work?',
    ],
    serviceAreas: areas,
    galleryFiles: gallery('majlis-furniture', 'custom-sofa'),
    quotationContext: {
      heading: 'Request a majlis quotation',
      message:
        'Send the wall measurements and a photo of the room so we can work out the bench run and the number of cushions.',
    },
    whatsAppContext: {
      label: 'Send majlis room photos',
      message: 'Hello Al Rukn, I would like a quotation for majlis seating.',
    },
    relatedSlugs: ['sofa-upholstery', 'custom-sofa', 'curtains-blinds'],
  },
  {
    slug: 'curtains-blinds',
    title: 'Curtains & Blinds',
    summary:
      'Curtains, blackout linings and blinds measured at the window, made to size and fitted with the track or rail the opening needs.',
    hero: {
      eyebrow: 'Window treatments',
      heading: 'Curtains and blinds measured at your windows',
      copy: `Curtain drop and fullness only work when the window has been measured properly. ${BUSINESS.brandName} measures each opening, makes the curtains or blinds to that size, and fits the track or rail.`,
      imageFile: 'service-curtains-blinds.jpg',
    },
    details: richText(
      heading('Measure the opening, then make the curtain'),
      paragraph(
        'A curtain that stops short of the floor or bunches against a balcony door usually starts with a measurement taken too quickly. We measure the opening, the stack space at each side and the drop to where the curtain should finish.',
      ),
      paragraph(
        'Blinds are made for openings where a curtain would take up too much room, including balcony doors and narrow windows. Tracks and rails are fitted with fixings chosen for the wall or ceiling surface in the room.',
      ),
      bulletList([
        'Blackout lining is available for bedrooms and majlis rooms that need a darker finish',
        'Double tracks allow a sheer layer behind a heavier curtain',
        'Blinds are made to the window size where a curtain would block the opening',
      ]),
    ),
    benefits: [
      {
        title: 'Measured at the window',
        description:
          'Drop, width and stack space are taken on site, so the finished curtain hangs correctly.',
      },
      {
        title: 'Made to your windows',
        description: 'Panels and blinds are cut for the opening rather than trimmed from a standard size.',
      },
      {
        title: 'Tracks and rails fitted',
        description: 'Fixings are selected for the wall or ceiling surface and the weight of the curtain.',
      },
      {
        title: 'Linings for the room',
        description: 'Blackout and thermal linings available where light control matters.',
      },
    ],
    materialsCapabilities: [
      {
        title: 'Curtain fabrics',
        description: 'Sheer, mid-weight and heavy weaves, with pleat styles agreed before stitching.',
      },
      {
        title: 'Blinds',
        description: 'Made-to-size blinds for windows and balcony doors where fabric would intrude.',
      },
      {
        title: 'Tracks and rails',
        description: 'Single and double tracks, rails and motor-ready options fitted on site.',
      },
    ],
    process: [
      {
        title: 'Measure at home',
        description: 'Each opening is measured, including drop height and the space the curtain needs to stack.',
      },
      {
        title: 'Choose fabric and heading',
        description: 'Fabric, lining and pleat style are agreed against samples.',
      },
      {
        title: 'Make up the order',
        description: 'Curtains or blinds are cut and stitched to the measured sizes.',
      },
      {
        title: 'Fit track and hang',
        description: 'Track or rail is fixed, curtains are hung and the drop is checked.',
      },
    ],
    faqQuestions: [
      'Do you measure windows before making curtains?',
      'Which curtain linings are available?',
      'Do you collect and deliver furniture?',
      'How do I get a price for upholstery work?',
    ],
    serviceAreas: areas,
    galleryFiles: gallery('curtains-blinds', 'majlis-furniture'),
    quotationContext: {
      heading: 'Request a curtains or blinds quotation',
      message:
        'Send the number of windows, approximate widths and drops, and whether you want curtains or blinds. We will confirm the measuring visit.',
    },
    whatsAppContext: {
      label: 'Send window details',
      message: 'Hello Al Rukn, I would like a quotation for curtains and blinds.',
    },
    relatedSlugs: ['majlis-furniture', 'custom-furniture', 'custom-beds-headboards'],
  },
  {
    slug: 'sofa-repair',
    title: 'Sofa Repair',
    summary:
      'Structural sofa repairs: frames, joints, springs, webbing, recliner mechanisms and sagging seats put right without full re-upholstery.',
    hero: {
      eyebrow: 'Repair before replacement',
      heading: 'Sofa repairs that keep the original covers',
      copy: `Not every sofa needs new fabric. ${BUSINESS.brandName} repairs frames, joints, springs and recliner mechanisms, and replaces only the covers that have actually failed.`,
      imageFile: 'service-sofa-repair.jpg',
    },
    details: richText(
      heading('Find the fault first'),
      paragraph(
        'A creaking sofa, a seat that has dropped or a recliner that will not close are three different repairs. The piece is opened up on the bench so the fault is identified before we quote the work.',
      ),
      paragraph(
        'Where the covers are still serviceable we work under them, replacing broken joints, re-webbing a base or renewing springs. If a cover has torn beyond repair, that panel alone can be replaced instead of the full set.',
      ),
      bulletList([
        'Loose joints are glued, screwed and blocked rather than just tightened',
        'Sagging seats are re-webbed or re-sprung depending on the base type',
        'Recliner and mechanism faults are assessed before any parts are ordered',
      ]),
    ),
    benefits: [
      {
        title: 'Fault identified on the bench',
        description:
          'The frame or base is opened so the repair is based on what has actually failed.',
      },
      {
        title: 'Covers kept where possible',
        description: 'Work is carried out under existing covers if they are still sound.',
      },
      {
        title: 'Structural repairs',
        description: 'Broken joints, cracked rails and failed corner blocks are rebuilt, not patched.',
      },
      {
        title: 'Mechanism work',
        description: 'Recliner and folding mechanisms are checked and adjusted as part of the repair.',
      },
    ],
    materialsCapabilities: [
      {
        title: 'Frame repairs',
        description: 'Joint rebuilding, rail replacement and corner blocking on timber frames.',
      },
      {
        title: 'Suspension repairs',
        description: 'Webbing, springs and base repairs for sagging or noisy seats.',
      },
      {
        title: 'Panel replacement',
        description: 'Individual cover panels replaced where the rest of the upholstery is still usable.',
      },
    ],
    process: [
      {
        title: 'Describe the fault',
        description: 'Tell us what the sofa does — creaks, drops, sticks or leans — and send photos.',
      },
      {
        title: 'Inspect and quote',
        description: 'The piece is inspected and the repair is quoted before work starts.',
      },
      {
        title: 'Carry out the repair',
        description: 'Frame, suspension or mechanism faults are repaired and the piece is reassembled.',
      },
      {
        title: 'Test and return',
        description: 'The repaired area is tested under load before the sofa goes back.',
      },
    ],
    faqQuestions: [
      'Can a sagging sofa seat be repaired?',
      'Can you repair a recliner mechanism?',
      'Does a repair cost less than re-upholstery?',
      'Do you collect and deliver furniture?',
    ],
    serviceAreas: areas,
    galleryFiles: gallery('sofa-repair', 'sofa-upholstery'),
    quotationContext: {
      heading: 'Request a sofa repair quotation',
      message:
        'Describe the fault and send a photo of the affected area. We will say whether it is a repair or a re-upholstery job.',
    },
    whatsAppContext: {
      label: 'Describe the fault on WhatsApp',
      message: 'Hello Al Rukn, I would like a quotation to repair a sofa.',
    },
    relatedSlugs: ['sofa-upholstery', 'custom-sofa', 'office-furniture'],
  },
  {
    slug: 'custom-wardrobes',
    title: 'Custom Wardrobes',
    summary:
      'Fitted wardrobes built to your wall: internal layouts, hanging heights, drawer stacks and sliding or hinged doors.',
    hero: {
      eyebrow: 'Fitted storage',
      heading: 'Wardrobes that use the whole wall',
      copy: `A fitted wardrobe starts with what you actually store. ${BUSINESS.brandName} plans the internal layout around your clothes and then builds the carcass to the wall it has to fit.`,
      imageFile: 'service-custom-wardrobes.jpg',
    },
    details: richText(
      heading('Plan the inside before the outside'),
      paragraph(
        'Hanging height, drawer depth and shelf spacing are decided from what the wardrobe has to hold. Long coats need a taller drop than shirts, and drawers take depth that hanging space cannot spare.',
      ),
      paragraph(
        'The carcass is then built to the measured wall, including any bulkhead or column that has to be worked around. Sliding doors save floor space in narrow rooms; hinged doors give full access where there is room to open them.',
      ),
      bulletList([
        'Internal layouts are drawn before the carcass is cut',
        'Sliding and hinged doors are quoted as separate options',
        'Existing loft or alcove space can be built into the layout',
      ]),
    ),
    benefits: [
      {
        title: 'Layout planned around your clothes',
        description: 'Hanging drops, shelves and drawers are sized for what you actually keep.',
      },
      {
        title: 'Built to the wall',
        description: 'Bulkheads, columns and out-of-square walls are measured and worked around.',
      },
      {
        title: 'Door options',
        description: 'Sliding doors for tight rooms, hinged doors where full opening access matters.',
      },
      {
        title: 'Fitted on site',
        description: 'Carcass and doors are levelled and aligned after installation, not before.',
      },
    ],
    materialsCapabilities: [
      {
        title: 'Carcass materials',
        description: 'Moisture-resistant boards and veneered panels finished to the agreed colour.',
      },
      {
        title: 'Internal fittings',
        description: 'Hanging rails, shoe shelves, drawer stacks, mirrors and pull-out trays.',
      },
      {
        title: 'Doors',
        description: 'Sliding or hinged doors with handles and soft-close hinges where specified.',
      },
    ],
    process: [
      {
        title: 'Measure and plan',
        description: 'Wall dimensions and what you need to store are recorded together.',
      },
      {
        title: 'Confirm layout and finish',
        description: 'Internal layout, door type and finish are agreed before cutting.',
      },
      {
        title: 'Build the carcass',
        description: 'Panels, rails and drawers are made to the layout in the workshop.',
      },
      {
        title: 'Install and align',
        description: 'The wardrobe is fitted, doors are aligned and runners are adjusted on site.',
      },
    ],
    faqQuestions: [
      'How do you plan a fitted wardrobe layout?',
      'Do you build sliding door wardrobes?',
      'How long does a custom furniture project take?',
      'How do I get a price for upholstery work?',
    ],
    serviceAreas: areas,
    galleryFiles: gallery('custom-wardrobes', 'custom-furniture'),
    quotationContext: {
      heading: 'Request a wardrobe quotation',
      message:
        'Send the wall width, height and photos of the space, plus roughly how much hanging and drawer space you need.',
    },
    whatsAppContext: {
      label: 'Send wardrobe wall photos',
      message: 'Hello Al Rukn, I would like a quotation for a fitted wardrobe.',
    },
    relatedSlugs: ['custom-furniture', 'custom-beds-headboards', 'office-furniture'],
  },
  {
    slug: 'custom-beds-headboards',
    title: 'Beds & Headboards',
    summary:
      'Beds and upholstered headboards built to your mattress size, with storage options and fabric matched to the room.',
    hero: {
      eyebrow: 'Bedroom furniture',
      heading: 'Beds and headboards sized around your mattress',
      copy: `Standard bed frames assume a standard mattress. ${BUSINESS.brandName} builds the base to the mattress you have and the headboard to the height you want behind it.`,
      imageFile: 'service-custom-beds-headboards.jpg',
    },
    details: richText(
      heading('Start with the mattress'),
      paragraph(
        'The mattress decides the base. We work from its exact width, length and thickness so the frame holds it properly and the headboard sits at the right height behind your pillows.',
      ),
      paragraph(
        'Headboards are built and upholstered in the fabric you choose, fixed to the wall or mounted on the frame depending on the room. Where storage matters, the base can be built with drawers or a lift-up section.',
      ),
      bulletList([
        'Bases are built for the mattress depth you actually use',
        'Headboard panels are upholstered in your chosen fabric',
        'Drawer or lift-up storage is available on the base',
      ]),
    ),
    benefits: [
      {
        title: 'Built to your mattress',
        description: 'Width, length and depth come from the mattress rather than a standard frame size.',
      },
      {
        title: 'Headboard height measured',
        description: 'The panel is set to the height you want behind the pillows, not a fixed default.',
      },
      {
        title: 'Storage where it fits',
        description: 'Drawers or a lift-up base are planned around the room and the way you use it.',
      },
      {
        title: 'Fabric matched',
        description: 'Headboards are upholstered in a fabric that suits the rest of the bedroom.',
      },
    ],
    materialsCapabilities: [
      {
        title: 'Bed bases',
        description: 'Timber frames and slatted bases built to the mattress dimensions you give us.',
      },
      {
        title: 'Headboards',
        description: 'Upholstered panels in the chosen fabric, wall-fixed or frame-mounted.',
      },
      {
        title: 'Storage',
        description: 'Drawer units and lift-up base sections fitted into the frame where space allows.',
      },
    ],
    process: [
      {
        title: 'Confirm mattress size',
        description: 'Mattress width, length and depth are recorded before the base is built.',
      },
      {
        title: 'Agree headboard and storage',
        description: 'Headboard height, fabric and any storage options are confirmed.',
      },
      {
        title: 'Build the frame',
        description: 'Base, slats and headboard panel are built and upholstered as agreed.',
      },
      {
        title: 'Assemble in the room',
        description: 'The bed is assembled in place and checked for level and mattress fit.',
      },
    ],
    faqQuestions: [
      'Can you build a bed for a non-standard mattress?',
      'Do you make upholstered headboards?',
      'How long does a custom furniture project take?',
      'How do I get a price for upholstery work?',
    ],
    serviceAreas: areas,
    galleryFiles: gallery('custom-beds-headboards', 'custom-wardrobes'),
    quotationContext: {
      heading: 'Request a bed or headboard quotation',
      message:
        'Send the mattress measurements and a photo of the bedroom wall so we can confirm the frame and headboard sizes.',
    },
    whatsAppContext: {
      label: 'Send mattress measurements',
      message: 'Hello Al Rukn, I would like a quotation for a bed and headboard.',
    },
    relatedSlugs: ['custom-wardrobes', 'custom-furniture', 'sofa-upholstery'],
  },
  {
    slug: 'office-furniture',
    title: 'Office Furniture',
    summary:
      'Workstations, reception desks, meeting tables and upholstered office seating made to the dimensions of your floor plan.',
    hero: {
      eyebrow: 'Workplace fit-out',
      heading: 'Office furniture made to the floor plan',
      copy: `Offices are planned around desks, cable routes and meeting space. ${BUSINESS.brandName} builds workstations, reception desks and tables to the plan rather than forcing the plan around standard furniture.`,
      imageFile: 'service-office-furniture.jpg',
    },
    details: richText(
      heading('Built around the plan, not the catalogue'),
      paragraph(
        'Office furniture has to line up with power outlets, partition walls and the number of people at each bank of desks. We work from the floor plan so desk runs, returns and shared tables are sized to the room.',
      ),
      paragraph(
        'Reception desks, meeting tables and storage units are built in the workshop and assembled on site. Upholstered seating for waiting areas and meeting rooms can be made alongside the timber work.',
      ),
      bulletList([
        'Desk runs are sized to the plan and the number of workstations',
        'Cable management and screen positions are planned before manufacture',
        'Reception and meeting seating can be upholstered to match the office finish',
      ]),
    ),
    benefits: [
      {
        title: 'Sized to the floor plan',
        description: 'Workstation runs and tables are built to the measured plan and headcount.',
      },
      {
        title: 'Cable routes planned',
        description: 'Cut-outs, trays and screen positions are decided before the panels are made.',
      },
      {
        title: 'Reception joinery',
        description: 'Reception and service counters built to the space available at the entrance.',
      },
      {
        title: 'Matching seating',
        description: 'Waiting and meeting seating upholstered in fabrics that suit the office interior.',
      },
    ],
    materialsCapabilities: [
      {
        title: 'Desk systems',
        description: 'Workstation panels, returns and shared table frames built to the plan.',
      },
      {
        title: 'Reception joinery',
        description: 'Counters and storage units built and finished for high-traffic entrances.',
      },
      {
        title: 'Office seating',
        description: 'Upholstered benches, tub chairs and meeting seating made to match the fit-out.',
      },
    ],
    process: [
      {
        title: 'Review the plan',
        description: 'Floor plan, headcount and services are reviewed together before quoting.',
      },
      {
        title: 'Agree specification',
        description: 'Materials, finishes and cable management are confirmed in writing.',
      },
      {
        title: 'Manufacture',
        description: 'Desks, counters and seating are built in the workshop to the agreed sizes.',
      },
      {
        title: 'Install on site',
        description: 'Furniture is assembled and levelled on site, with cable routes connected.',
      },
    ],
    faqQuestions: [
      'Can you fit out an office to our floor plan?',
      'Do you make reception desks and meeting tables?',
      'How long does a custom furniture project take?',
      'How do I get a price for upholstery work?',
    ],
    serviceAreas: areas,
    galleryFiles: gallery('office-furniture', 'custom-furniture'),
    quotationContext: {
      heading: 'Request an office furniture quotation',
      message:
        'Send the floor plan, the number of workstations and a photo of the space. We will confirm the specification and quote it.',
    },
    whatsAppContext: {
      label: 'Discuss your office fit-out',
      message: 'Hello Al Rukn, I would like a quotation for office furniture.',
    },
    relatedSlugs: ['custom-furniture', 'custom-wardrobes', 'sofa-repair'],
  },
]

export const SERVICE_SEEDS: ServiceSeed[] = BASE_SERVICE_SEEDS.map((service) => {
  const enhancement = SERVICE_ENHANCEMENTS[service.slug]
  if (!enhancement) throw new Error(`Missing service enhancement for ${service.slug}`)

  return {
    ...service,
    ...enhancement,
    hero: { ...service.hero, ...enhancement.hero, imageFile: `service-${service.slug}-ai.webp` },
    galleryFiles: [
      `service-${service.slug}-detail-ai.webp`,
      service.galleryFiles[0]!,
      `service-${service.slug}-ai.webp`,
    ],
    faqQuestions: SERVICE_FAQ_QUESTIONS[service.slug] || service.faqQuestions,
    quotationContext: enhancement.quotationContext,
    serviceAreas: enhancement.serviceAreas,
    ...(service.slug === 'sofa-upholstery' ? {
      hero: { ...service.hero, ...enhancement.hero, imageFile: 'sofa-eco-nivo.webp' },
      galleryFiles: SOFA_GALLERY_FILES,
      sofaUpholsteryLanding: SOFA_LANDING_SEED,
      process: SOFA_PROCESS,
      benefits: SOFA_BENEFITS,
      faqQuestions: SOFA_FAQS.map(([question]) => question),
      relatedSlugs: ['custom-furniture', 'custom-sofa', 'sofa-repair', 'curtains-blinds'],
      whatsAppContext: { label: 'WhatsApp Your Sofa Photo', message: "Hi Al Rukn, I want a quote for sofa upholstery. Area: ___. I'll send sofa photos and approximate size." },
      presentationLabels: {
        heroQuoteLabel: 'Get Free Quote', processCtaLabel: 'Get Your Sofa Quote', quoteWhatsAppLabel: 'WhatsApp Your Photos',
        workshopNote: 'Serving Dubai from our Ajman workshop.', benefitsHeading: 'Why Choose Al Rukn', benefitsEyebrow: 'Workshop approach',
        materialsEyebrow: 'Fabric guidance · catalogue and AI inspiration', processEyebrow: 'From photos to handover', galleryEyebrow: 'Catalogue inspiration',
        areasEyebrow: 'Local service', faqEyebrow: 'Your questions', faqHeading: 'Sofa Upholstery FAQs', faqIntroduction: 'Practical answers about upholstery, repairs, fabric choices and quotations.',
        relatedEyebrow: 'AI-generated furniture design inspiration', quoteEyebrow: 'Start with your sofa photos',
      },
    } : {}),
  }
})

export const SERVICE_SLUGS = SERVICE_SEEDS.map((service) => service.slug)

export const serviceBySlug = (slug: string): ServiceSeed | undefined =>
  SERVICE_SEEDS.find((service) => service.slug === slug)
