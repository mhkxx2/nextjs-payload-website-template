export type ServiceVisualVariant = 'editorial' | 'full-bleed' | 'image-right' | 'product'

export interface ServiceEnhancement {
  hero: { eyebrow: string; heading: string; copy: string }
  summary: string
  visualVariant: ServiceVisualVariant
  trustItems: string[]
  serviceOptions: {
    eyebrow: string
    heading: string
    intro: string
    items: { title: string; description: string }[]
  }
  featureSections: {
    eyebrow: string
    heading: string
    copy: string
    bullets: string[]
    imagePosition: 'left' | 'right'
  }[]
  materialsHeading: string
  processHeading: string
  comparison?: {
    heading: string
    intro: string
    leftTitle: string
    leftItems: string[]
    rightTitle: string
    rightItems: string[]
  }
  galleryHeading: string
  galleryIntro: string
  serviceAreaHeading: string
  serviceAreaCopy: string
  areaLinkLabel: string
  serviceAreas: string[]
  quotationContext: { heading: string; message: string; buttonLabel: string }
  relatedHeading: string
  seo: { title: string; description: string }
}

const DUBAI_COMMUNITIES = [
  'Palm Jumeirah',
  'Dubai Marina',
  'Jumeirah Beach Residence (JBR)',
  'Emirates Hills',
  'Dubai Hills Estate',
  'Jumeirah Village Circle (JVC)',
  'Arabian Ranches',
  'Business Bay',
  'Downtown Dubai',
  'Jumeirah Lakes Towers (JLT)',
  'Mirdif',
  'Meydan',
]

const coverage = [...DUBAI_COMMUNITIES, 'Sharjah', 'Ajman']

export const SERVICE_ENHANCEMENTS: Record<string, ServiceEnhancement> = {
  'sofa-upholstery': {
    hero: {
      eyebrow: 'Reupholstery from our Ajman workshop',
      heading: 'Sofa Upholstery in Dubai',
      copy: 'Renew worn sofas with new fabric, foam and finishing. We reupholster sofas, L-shaped seating, corner sofas, chairs and Majlis furniture for customers across Dubai, Sharjah and the UAE from our Ajman workshop.',
    },
    summary: 'Professional sofa reupholstery, furniture upholstery, fabric replacement and foam renewal for Dubai and Sharjah homes, carried out in our Ajman workshop.',
    visualVariant: 'editorial',
    trustItems: ['Fabric & Foam Replacement', 'L-Shaped & Corner Sofas', 'Sofa Repair Available', 'Photo Quotation Available'],
    serviceOptions: {
      eyebrow: 'What we upholster',
      heading: 'Popular Sofa Upholstery Services',
      intro: 'The construction and condition of the piece decide the work. Catalogue and AI-generated images below are design inspiration, not completed Al Rukn projects.',
      items: [
        { title: 'Straight sofas', description: 'Two- and three-seat sofas with fixed or loose seat and back cushions.' },
        { title: 'L-shaped and corner sofas', description: 'Sectional seating measured panel by panel so seams and joins align after fitting.' },
        { title: 'Armchairs and dining chairs', description: 'Single chairs, matching sets and accent seating with worn covers or compressed padding.' },
        { title: 'Majlis benches and cushions', description: 'Long bench runs and removable cushion sets re-covered without rebuilding sound bases.' },
      ],
    },
    featureSections: [
      { eyebrow: 'Inside the job', heading: 'What sofa reupholstery includes', copy: 'We remove the old cover to inspect the frame, suspension and padding. Sound parts stay; failed webbing, springs, foam or stitching are quoted separately before new fabric is cut.', bullets: ['Strip and label existing panels', 'Repair minor frame or suspension faults where agreed', 'Cut, stitch and fit new covers', 'Refill and align loose cushions'], imagePosition: 'right' },
      { eyebrow: 'Fabric and comfort', heading: 'Choose the surface and renew the seat underneath', copy: 'Fabric is selected for the room, pattern scale and expected use. Seat foam can be renewed at the same time, with density and wrap chosen for the required firmness.', bullets: ['Chenille, velvet, boucle, linen blends and durable woven fabrics', 'Customer-supplied fabric checked before cutting', 'Foam replacement only where required'], imagePosition: 'left' },
    ],
    materialsHeading: 'Choose the Right Upholstery Fabric',
    processHeading: 'Our sofa upholstery process',
    comparison: { heading: 'Sofa Repair vs Reupholstery', intro: 'The right scope depends on whether the problem is structural, cosmetic or both.', leftTitle: 'Choose repair when', leftItems: ['The existing fabric is still usable', 'A joint, spring, webbing or cushion has failed', 'Only one functional part needs attention'], rightTitle: 'Choose reupholstery when', rightItems: ['Fabric is worn, torn or no longer suits the room', 'Several cushions need foam and cover renewal', 'You want a complete colour or texture change'] },
    galleryHeading: 'Sofa Upholstery Gallery',
    galleryIntro: 'Company-owned Eco Furniture catalogue inspiration showing sofa shapes, upholstery textures and cushion details. These are design references, not completed Al Rukn customer projects.',
    serviceAreaHeading: 'Sofa Upholstery Across Dubai, Sharjah & UAE',
    serviceAreaCopy: 'Serving Dubai from our Ajman workshop. Share your location and sofa photos so assessment, collection and delivery arrangements can be confirmed.',
    areaLinkLabel: 'See all areas we serve', serviceAreas: ['Palm Jumeirah', 'Dubai Marina', 'JBR', 'Emirates Hills', 'Dubai Hills Estate', 'JVC', 'Arabian Ranches', 'Business Bay', 'Downtown Dubai', 'JLT', 'Mirdif', 'Meydan', 'Sharjah', 'Ajman'],
    quotationContext: { heading: 'Get a Sofa Upholstery Quote', message: 'Send clear sofa photos, approximate measurements and your preferred fabric/style.', buttonLabel: 'Request My Sofa Quote' },
    relatedHeading: 'Related Furniture Services',
    seo: { title: 'Sofa Upholstery Dubai | Reupholstery & Sofa Repair | Al Rukn', description: 'Professional sofa upholstery in Dubai for fabric replacement, foam renewal, corner sofas, chairs and Majlis seating. Serving Dubai from our Ajman workshop. Send photos for a quote.' },
  },
  'custom-furniture': {
    hero: { eyebrow: 'Made to measure in our Ajman workshop', heading: 'Custom Made Furniture in Dubai & UAE', copy: 'Furniture designed around your room, dimensions and storage needs. We build for Dubai homes and businesses from our Ajman workshop, then deliver and fit as agreed.' },
    summary: 'Custom made furniture for Dubai villas, apartments and commercial spaces, including media units, dining furniture, shelving, storage and reception counters.',
    visualVariant: 'image-right',
    trustItems: ['Exact room dimensions', 'Residential and commercial', 'Material and finish selection', 'Delivery and fitting'],
    serviceOptions: { eyebrow: 'Made for the space', heading: 'What we custom-build', intro: 'Each piece starts with its use, measurements and access—not a standard catalogue size.', items: [
      { title: 'TV and media units', description: 'Wall-length consoles, media walls, display shelving and cable-aware storage.' },
      { title: 'Dining and living furniture', description: 'Dining tables, benches, sideboards, coffee tables and room-specific storage.' },
      { title: 'Shelving and fitted storage', description: 'Alcove units, wall shelving and cabinets planned around sockets, doors and bulkheads.' },
      { title: 'Reception and service counters', description: 'Customer-facing counters and back storage sized to a commercial floor plan.' },
      { title: 'Villa furniture', description: 'Larger pieces and coordinated room sets planned for circulation, scale and delivery access.' },
      { title: 'Apartment furniture', description: 'Space-efficient storage and modular pieces designed around lifts, corridors and smaller rooms.' },
    ] },
    featureSections: [
      { eyebrow: 'Residential', heading: 'Furniture designed around how the room is used', copy: 'A useful brief covers what must be stored, which equipment needs ventilation or cable access, and where doors and drawers can open comfortably.', bullets: ['Reference photos are welcome', 'Dimensions and clearances agreed before cutting', 'Freestanding or fitted construction where appropriate'], imagePosition: 'right' },
      { eyebrow: 'Commercial', heading: 'Custom furniture for offices and customer spaces', copy: 'Reception counters, meeting tables, storage and display units are planned against the floor plan, user numbers and daily wear.', bullets: ['Module sizes planned for site access', 'Hardware selected for expected use', 'Installation sequence agreed before manufacture'], imagePosition: 'left' },
    ],
    materialsHeading: 'Materials, finishes and practical hardware', processHeading: 'From room measurements to installation',
    galleryHeading: 'Custom furniture design inspiration', galleryIntro: 'Ideas for media units, storage, dining pieces and fitted furniture; final proportions and finishes are developed for your room.',
    serviceAreaHeading: 'Custom furniture for Dubai homes and businesses', serviceAreaCopy: 'We serve Dubai and Sharjah from our Ajman furniture workshop, with site measurement, delivery and fitting arranged by project.', areaLinkLabel: 'Browse all UAE service areas', serviceAreas: coverage,
    quotationContext: { heading: 'Send Your Furniture Design', message: 'Share a reference image, room photo, approximate dimensions and what the piece needs to store or support.', buttonLabel: 'Request a Custom Furniture Quote' },
    relatedHeading: 'More made-to-measure furniture services',
    seo: { title: 'Custom Made Furniture Dubai | Bespoke Furniture | Al Rukn', description: 'Custom made furniture in Dubai and the UAE: media units, dining furniture, storage and commercial joinery. Built in Ajman. Request a quote.' },
  },
  'custom-sofa': {
    hero: { eyebrow: 'A new sofa built to your specification', heading: 'Custom Sofas Made to Measure in Dubai', copy: 'Choose the shape, dimensions, seat firmness, fabric and details for a completely new sofa. Built in our Ajman workshop for delivery across Dubai, Sharjah and the UAE.' },
    summary: 'Custom sofas built new to your dimensions and design for Dubai homes, with frame construction, seat firmness, fabric and detailing selected before manufacture.',
    visualVariant: 'product', trustItems: ['New sofa construction', 'Custom dimensions', 'Firmness selected by you', 'Fabric and detailing choices'],
    serviceOptions: { eyebrow: 'Choose the configuration', heading: 'Sofa shapes built around your room', intro: 'Room dimensions, circulation and how many people need a seat determine the right configuration.', items: [
      { title: 'Straight sofas', description: 'Compact two-seaters, generous three-seaters and long bench-style sofas made to length.' },
      { title: 'L-shaped sofas', description: 'Left- or right-hand returns sized for the wall, doorway and walking space.' },
      { title: 'Corner sofas', description: 'Seating that uses two wall runs with corner depth and cushion joins planned together.' },
      { title: 'Modular sofas', description: 'Separate units for flexible layouts or easier delivery through lifts and stairways.' },
    ] },
    featureSections: [
      { eyebrow: 'Construction', heading: 'Frame, suspension and seat firmness', copy: 'The timber frame is built for the agreed footprint. Suspension and layered foam are then selected for daily use and the seat feel you prefer.', bullets: ['Overall length, depth and seat height agreed', 'Access route checked before final assembly', 'Firm, medium or softer cushion specification'], imagePosition: 'right' },
      { eyebrow: 'Finishing', heading: 'Fabric and custom details', copy: 'Fabric, piping, seams, feet, arm profile and cushion layout are specified together so the finished sofa reads as one design.', bullets: ['Plain or contrast piping', 'Loose or fixed cushion layouts', 'Customer fabric checked for width and durability'], imagePosition: 'left' },
    ],
    materialsHeading: 'Frame, cushion and upholstery specification', processHeading: 'From sofa design to delivery',
    comparison: { heading: 'Custom sofa or sofa upholstery?', intro: 'These are different services and start from different furniture.', leftTitle: 'Custom sofa', leftItems: ['A new frame is built', 'Shape and dimensions start from your room', 'Every finish is selected before manufacture'], rightTitle: 'Sofa upholstery', rightItems: ['Your existing frame is retained', 'Fabric and worn padding are renewed', 'The original sofa proportions remain'] },
    galleryHeading: 'Custom sofa inspiration', galleryIntro: 'Shape, proportion and upholstery references for a new made-to-measure sofa.',
    serviceAreaHeading: 'Custom sofas for Dubai and UAE interiors', serviceAreaCopy: 'Made in our Ajman workshop and delivered to homes across Dubai, Sharjah and other configured UAE areas.', areaLinkLabel: 'See our full service coverage', serviceAreas: coverage,
    quotationContext: { heading: 'Request a Custom Sofa Quote', message: 'Send your sofa design or reference photo, room dimensions, preferred configuration and approximate seating capacity.', buttonLabel: 'Send Us Your Sofa Design' }, relatedHeading: 'Compare seating services',
    seo: { title: 'Custom Sofa Dubai | Custom Made Sofas | Al Rukn', description: 'Custom sofas in Dubai built to your shape, dimensions, firmness and fabric. Made in our Ajman workshop for UAE delivery. Send your design for a quote.' },
  },
  'majlis-furniture': {
    hero: { eyebrow: 'Modern and traditional seating layouts', heading: 'Custom Arabic Majlis Furniture in Dubai', copy: 'Majlis benches, raised or floor-level seating and cushion sets made to the measured wall runs of your room. Built in Ajman for Dubai and UAE homes.' },
    summary: 'Custom Arabic majlis furniture for Dubai and UAE homes, including wall-to-wall benches, floor seating, raised seating and made-to-measure cushion sets.',
    visualVariant: 'full-bleed', trustItems: ['Wall-to-wall measurements', 'Floor or raised seating', 'Custom cushion sets', 'On-site installation'],
    serviceOptions: { eyebrow: 'Plan the room', heading: 'Modern and traditional Majlis seating styles', intro: 'The layout can be restrained and modern or richly detailed; the construction still begins with accurate wall and corner measurements.', items: [
      { title: 'Modern Majlis seating', description: 'Clean upholstered bases, tailored cushions and simplified detailing for contemporary rooms.' },
      { title: 'Traditional Majlis seating', description: 'Low seating, patterned textiles and coordinated bolsters based on your chosen reference.' },
      { title: 'Floor seating', description: 'Low cushion arrangements planned around wall lengths, corners and access points.' },
      { title: 'Raised bench seating', description: 'Timber-framed upholstered bases with specified seat height and removable cushions.' },
    ] },
    featureSections: [
      { eyebrow: 'Measurements', heading: 'Wall runs, corners and door clearances measured together', copy: 'A Majlis is treated as one continuous layout. Sections are sized so corners meet cleanly and long benches still pass through the doorway.', bullets: ['Straight and angled corners recorded', 'Door swings and circulation protected', 'Sections joined and levelled on site'], imagePosition: 'right' },
      { eyebrow: 'Comfort and colour', heading: 'Cushions, fabric and coordinated details', copy: 'Seat foam, loose backs, bolsters, piping and colour combinations are agreed as one set. Existing sound Majlis bases can also be assessed for reupholstery.', bullets: ['Removable zipped cushion covers', 'Fabric selected for expected use', 'Existing seating assessed separately'], imagePosition: 'left' },
    ],
    materialsHeading: 'Majlis bases, cushions and fabric choices', processHeading: 'Measurement, workshop build and installation',
    galleryHeading: 'Arabic Majlis design inspiration', galleryIntro: 'Modern and traditional seating references shown as inspiration, not as completed customer projects.',
    serviceAreaHeading: 'Majlis furniture across Dubai and the UAE', serviceAreaCopy: 'We measure and install across Dubai and Sharjah while manufacturing takes place at our Ajman workshop.', areaLinkLabel: 'View all service areas', serviceAreas: coverage,
    quotationContext: { heading: 'Send Your Room Measurements', message: 'Share photos of every wall, approximate wall lengths, corner details and the seating height you prefer.', buttonLabel: 'Request a Majlis Quote' }, relatedHeading: 'Related seating and furniture services',
    seo: { title: 'Majlis Furniture Dubai | Custom Arabic Majlis Seating', description: 'Custom Majlis furniture in Dubai: modern or traditional wall-to-wall seating, cushions and fabrics. Made in Ajman. Send room measurements for a quote.' },
  },
  'curtains-blinds': {
    hero: { eyebrow: 'Made-to-measure window treatments', heading: 'Custom Curtains & Blinds in Dubai', copy: 'Blackout curtains, sheer curtains, layered combinations and blinds measured at your windows, made to size and installed across Dubai from our Ajman workshop.' },
    summary: 'Made-to-measure curtains and blinds for Dubai villas and apartments, including blackout curtains, sheer curtains, double-layer combinations and roller blinds.',
    visualVariant: 'full-bleed', trustItems: ['On-site window measurement', 'Sheer and blackout layers', 'Tracks and rails where specified', 'Professional installation'],
    serviceOptions: { eyebrow: 'Light, privacy and finish', heading: 'Curtain and blind options for each room', intro: 'The right treatment depends on the opening, daylight, privacy and how the door or window is used.', items: [
      { title: 'Blackout curtains', description: 'Lined curtains for bedrooms and rooms that need stronger light control.' },
      { title: 'Sheer curtains', description: 'Light-filtering layers that soften daylight while retaining daytime privacy.' },
      { title: 'Sheer + blackout combinations', description: 'Two layers on a double track for daytime filtering and night-time coverage.' },
      { title: 'Roller blinds', description: 'A compact option for smaller windows and openings where curtain stack would obstruct access.' },
      { title: 'Villa curtains', description: 'Full-height treatments measured for larger glazing, double-height rooms and multiple coordinated windows.' },
      { title: 'Apartment curtains', description: 'Ceiling-height curtains and blinds planned around balcony doors, AC details and limited stack space.' },
    ] },
    featureSections: [
      { eyebrow: 'Fabric selection', heading: 'Choose how much light the room should keep', copy: 'Sheers soften daylight; blackout lining reduces light more strongly. Combining both layers gives different settings without changing the treatment.', bullets: ['View samples in the room light where possible', 'Check colour against walls and flooring', 'Agree fullness, heading and finished drop'], imagePosition: 'right' },
      { eyebrow: 'Measure and install', heading: 'Tracks, rails and finished drops planned on site', copy: 'We measure the opening, ceiling or wall fixing position, curtain stack and floor clearance before manufacture. The track or rail is specified only where it is part of the agreed work.', bullets: ['Window width and height', 'Stack space beside the opening', 'Balcony-door and furniture clearance'], imagePosition: 'left' },
    ],
    materialsHeading: 'Curtain fabrics, linings, blinds and fittings', processHeading: 'How curtain measurement and installation works',
    galleryHeading: 'Curtain and blind inspiration', galleryIntro: 'Floor-to-ceiling curtains, sheer and blackout combinations, villa windows and roller-blind details.',
    serviceAreaHeading: 'Curtains and blinds across Dubai', serviceAreaCopy: 'Measurement and installation are available across Dubai, Sharjah and selected UAE areas from our Ajman base.', areaLinkLabel: 'See all areas we cover', serviceAreas: coverage,
    quotationContext: { heading: 'Book Measurement / Request a Curtain Quote', message: 'Tell us the number of windows, your area, approximate sizes and whether you need sheer, blackout, both layers or blinds.', buttonLabel: 'Request a Curtain Quote' }, relatedHeading: 'Coordinate curtains with your interior',
    seo: { title: 'Curtains Dubai | Blackout, Sheer Curtains & Blinds', description: 'Custom curtains in Dubai: blackout, sheer, layered curtains and blinds measured and installed. Serving Dubai from Ajman. Book measurement or request a quote.' },
  },
  'sofa-repair': {
    hero: { eyebrow: 'Photo assessment available', heading: 'Sofa Repair & Furniture Restoration in Dubai', copy: 'We assess sagging seats, broken frames, failed webbing or springs, loose joints, worn foam and damaged cushions without assuming the whole sofa needs reupholstery.' },
    summary: 'Sofa repair in Dubai and Sharjah for sagging seats, damaged foam, frames, joints, springs, webbing, cushions, stitching and sofa legs, assessed in Ajman.',
    visualVariant: 'editorial', trustItems: ['Repair before replacement', 'Frame and suspension checks', 'Foam and cushion work', 'Send photos for assessment'],
    serviceOptions: { eyebrow: 'Common faults', heading: 'Sofa problems we assess and repair', intro: 'A visible symptom can come from foam, suspension or the timber frame, so inspection comes before the repair scope.', items: [
      { title: 'Sagging seats', description: 'Collapsed foam, stretched webbing or failed springs identified by opening the base.' },
      { title: 'Frame and joint damage', description: 'Loose or broken timber rails and joints assessed for safe reinforcement or replacement.' },
      { title: 'Cushion and foam problems', description: 'Flat, uneven or misshapen seat and back cushions measured for refill or replacement.' },
      { title: 'Stitching, legs and fittings', description: 'Local seam failures, unstable legs and accessible fittings repaired where the surrounding material is sound.' },
    ] },
    featureSections: [
      { eyebrow: 'Structural work', heading: 'Frame, spring and webbing repairs', copy: 'The underside or affected area is opened to find the failed part. Repair is limited to what can be made structurally sound; unsupported cosmetic promises are avoided.', bullets: ['Loose joints and rails', 'Broken or detached springs', 'Stretched or failed webbing'], imagePosition: 'right' },
      { eyebrow: 'Comfort work', heading: 'Cushion and foam renewal', copy: 'When the frame is sound but the seat has softened or changed shape, foam and cushion fill can be renewed without replacing all upholstery.', bullets: ['Seat foam cut to the cushion profile', 'Back filling adjusted for shape', 'Covers checked before reuse'], imagePosition: 'left' },
    ],
    materialsHeading: 'Repair materials and workshop capabilities', processHeading: 'Inspection and repair process',
    comparison: { heading: 'Sofa repair or reupholstery?', intro: 'Repair keeps usable covers; reupholstery replaces them.', leftTitle: 'Repair is usually enough when', leftItems: ['Fabric remains in usable condition', 'The fault is in the frame, suspension or one cushion', 'The sofa design and colour can stay'], rightTitle: 'Consider reupholstery when', rightItems: ['Fabric is torn, heavily worn or needs changing', 'Padding has failed across most of the sofa', 'Repair access would require removing most covers'] },
    galleryHeading: 'Sofa repair workshop details', galleryIntro: 'Illustrations of frames, suspension and cushion work. No generated image is labelled as an Al Rukn customer project.',
    serviceAreaHeading: 'Sofa repair across Dubai and Sharjah', serviceAreaCopy: 'Send photos or a short video first. Repairs are carried out from our Ajman workshop, with transport discussed at quotation.', areaLinkLabel: 'Check our UAE coverage', serviceAreas: coverage,
    quotationContext: { heading: 'Send a Photo for Assessment', message: 'Show the full sofa and the problem area. Add a short description of what moves, sags, makes noise or no longer works.', buttonLabel: 'Request a Repair Assessment' }, relatedHeading: 'When repair is not the only option',
    seo: { title: 'Sofa Repair Dubai | Furniture & Cushion Repair | Al Rukn', description: 'Sofa repair in Dubai for sagging seats, frames, springs, webbing, foam and cushions. Assessed from our Ajman workshop. Send a photo for a quote.' },
  },
  'custom-wardrobes': {
    hero: { eyebrow: 'Storage planned around your room', heading: 'Custom Wardrobes in Dubai', copy: 'Sliding, hinged and corner wardrobes designed around your wall, ceiling height, columns and storage requirements. Built in Ajman and fitted across Dubai and the UAE.' },
    summary: 'Custom wardrobes for Dubai bedrooms and dressing areas, with sliding or hinged doors, tailored shelves, drawers, hanging sections and awkward-space solutions.',
    visualVariant: 'image-right', trustItems: ['Room measured on site', 'Sliding or hinged doors', 'Custom internal layout', 'Built and fitted to plan'],
    serviceOptions: { eyebrow: 'Door and room options', heading: 'Wardrobes designed for the room you have', intro: 'Door type, internal layout and clearances are decided together so the wardrobe works when it is full.', items: [
      { title: 'Sliding-door wardrobes', description: 'Doors that do not project into the room, useful where beds or circulation sit close to the wardrobe.' },
      { title: 'Hinged wardrobes', description: 'Full compartment access with door widths and opening arcs planned around nearby furniture.' },
      { title: 'Corner wardrobes', description: 'Joined storage runs that use two walls while keeping the corner reachable.' },
      { title: 'Awkward-space storage', description: 'Layouts shaped around columns, bulkheads, sloped ceilings and non-standard wall returns.' },
    ] },
    featureSections: [
      { eyebrow: 'Inside the wardrobe', heading: 'Plan drawers, shelves and hanging space around your clothes', copy: 'Long hanging, double hanging, folded storage, drawers and accessory spaces are allocated before the carcass is cut.', bullets: ['Long and short hanging heights', 'Adjustable or fixed shelving', 'Drawer stacks and upper storage'], imagePosition: 'right' },
      { eyebrow: 'Outside finish', heading: 'Finishes and hardware selected for daily use', copy: 'Door finish, handles, tracks, hinges and drawer runners are chosen with the room style and expected use in mind.', bullets: ['Sliding tracks or soft-close hinges where specified', 'Handle profiles and finish samples', 'Mirror panels only where agreed'], imagePosition: 'left' },
    ],
    materialsHeading: 'Wardrobe finishes, doors and hardware', processHeading: 'Wardrobe measurement and design process',
    galleryHeading: 'Custom wardrobe inspiration', galleryIntro: 'Floor-to-ceiling, sliding, hinged and internally organised wardrobe references.',
    serviceAreaHeading: 'Custom wardrobes across Dubai', serviceAreaCopy: 'Site measurement and fitting are arranged across Dubai, Sharjah and selected UAE areas from our Ajman workshop.', areaLinkLabel: 'See all areas we serve', serviceAreas: coverage,
    quotationContext: { heading: 'Request Wardrobe Measurement', message: 'Send a straight-on room photo, wall width, ceiling height and a note about your preferred doors and internal storage.', buttonLabel: 'Request a Wardrobe Quote' }, relatedHeading: 'Complete the bedroom storage plan',
    seo: { title: 'Custom Wardrobes Dubai | Sliding & Built-In Wardrobes', description: 'Custom wardrobes in Dubai with sliding or hinged doors and tailored internal storage. Built in Ajman and fitted to your room. Request measurement.' },
  },
  'custom-beds-headboards': {
    hero: { eyebrow: 'Bedroom furniture made to size', heading: 'Custom Beds & Upholstered Headboards in Dubai', copy: 'Bed frames and upholstered headboards made around your mattress size, room proportions, fabric choice and storage requirements in our Ajman workshop.' },
    summary: 'Custom beds and upholstered headboards for Dubai bedrooms, including wall-mounted panels, made-to-size frames, fabric choices and coordinated bedroom furniture.',
    visualVariant: 'product', trustItems: ['Built to mattress size', 'Upholstered bed options', 'Wall or bed-mounted headboards', 'Fabric samples available'],
    serviceOptions: { eyebrow: 'Bed and headboard options', heading: 'A bedroom centrepiece sized correctly', intro: 'Mattress measurements, bedside clearance and headboard scale are agreed before the frame and upholstery are made.', items: [
      { title: 'Upholstered beds', description: 'Padded bed frames with coordinated headboards and fabric selected for the room.' },
      { title: 'Custom headboards', description: 'Single-panel, divided-panel, plain or detailed headboards sized to the mattress and wall.' },
      { title: 'Wall-mounted headboards', description: 'Wider upholstered panels positioned against sockets, switches and bedside tables.' },
      { title: 'Custom bed frames', description: 'Frames made for standard or non-standard mattresses with the agreed base and finished height.' },
    ] },
    featureSections: [
      { eyebrow: 'Scale and fit', heading: 'Custom sizing for the mattress and room', copy: 'We use the actual mattress width, length and depth, then check circulation, bedside positions and delivery access.', bullets: ['Mattress dimensions verified', 'Finished bed height agreed', 'Headboard width and height balanced to the wall'], imagePosition: 'right' },
      { eyebrow: 'Integrated bedroom', heading: 'Coordinate the bed with storage and window treatments', copy: 'Bed fabric and finish can be considered alongside bedside units, wardrobes and curtains without forcing every item to match exactly.', bullets: ['Bedside furniture dimensions', 'Wardrobe door clearance', 'Curtain and headboard colour samples'], imagePosition: 'left' },
    ],
    materialsHeading: 'Bed frames, padding and upholstery fabrics', processHeading: 'Design, measure and manufacture',
    galleryHeading: 'Custom bed and headboard inspiration', galleryIntro: 'Upholstered beds, tall headboards and wall-panel arrangements for reference during your brief.',
    serviceAreaHeading: 'Custom beds for Dubai bedrooms', serviceAreaCopy: 'Beds and headboards are made in Ajman for delivery across Dubai, Sharjah and other configured UAE areas.', areaLinkLabel: 'Explore all service areas', serviceAreas: coverage,
    quotationContext: { heading: 'Send Your Bed Design', message: 'Share your mattress dimensions, a room photo, headboard reference and preferred fabric or colour direction.', buttonLabel: 'Request a Custom Bed Quote' }, relatedHeading: 'Plan the rest of the bedroom',
    seo: { title: 'Custom Beds Dubai | Upholstered Headboards | Al Rukn', description: 'Custom beds in Dubai with upholstered frames and made-to-size headboards. Built around your mattress in our Ajman workshop. Send your design.' },
  },
  'office-furniture': {
    hero: { eyebrow: 'Furniture built to the floor plan', heading: 'Custom Office Furniture in Dubai', copy: 'Desks, workstations, reception counters, meeting tables and office storage made to your dimensions and workflow—not sold as an online catalogue range.' },
    summary: 'Custom office furniture for Dubai workplaces, including desks, workstations, reception counters, meeting tables, storage and floor-plan-based furniture.',
    visualVariant: 'image-right', trustItems: ['Floor-plan-based layouts', 'Custom desk dimensions', 'Cable management planned', 'Phased delivery and installation'],
    serviceOptions: { eyebrow: 'Commercial furniture', heading: 'Furniture for offices and customer-facing spaces', intro: 'Headcount, circulation, technology and storage requirements shape the specification.', items: [
      { title: 'Workstations', description: 'Single desks, bench runs and team layouts sized to headcount and available floor area.' },
      { title: 'Executive and custom desks', description: 'Desks, returns and credenzas planned around working style, storage and room position.' },
      { title: 'Reception furniture', description: 'Front counters, transaction surfaces and back storage designed for the entrance and daily workflow.' },
      { title: 'Meeting tables', description: 'Tables made to room size and seating capacity with cable access considered before manufacture.' },
      { title: 'Office storage', description: 'Cabinets, shelving and printer or utility storage coordinated with desk finishes.' },
      { title: 'Home office furniture', description: 'Compact desks and wall storage designed for a dedicated room or shared residential space.' },
    ] },
    featureSections: [
      { eyebrow: 'Planning', heading: 'Start with people, equipment and the floor plan', copy: 'We review workstation count, screen positions, storage, cable routes and circulation before setting desk sizes.', bullets: ['Headcount and desk arrangement', 'Power and data access', 'Chair movement and walkway clearances'], imagePosition: 'right' },
      { eyebrow: 'Commercial workflow', heading: 'Manufacture and installation planned around the workplace', copy: 'Modules are built in the workshop and installation is sequenced to suit access and site readiness. Larger scopes can be discussed in phases.', bullets: ['Module sizes checked against lifts and doors', 'Finish samples agreed before production', 'Installation areas prepared and cleared'], imagePosition: 'left' },
    ],
    materialsHeading: 'Office finishes, hardware and cable details', processHeading: 'Commercial design-to-install workflow',
    galleryHeading: 'Office furniture design inspiration', galleryIntro: 'Workstation, reception, meeting and storage references for planning a custom brief.',
    serviceAreaHeading: 'Custom office furniture across Dubai', serviceAreaCopy: 'We serve offices and commercial spaces across Dubai and Sharjah from our Ajman workshop.', areaLinkLabel: 'View commercial service coverage', serviceAreas: coverage,
    quotationContext: { heading: 'Request an Office Furniture Quote', message: 'Send the floor plan, headcount, required furniture list, finish direction and target installation area.', buttonLabel: 'Request an Office Quote' }, relatedHeading: 'Related commercial and storage services',
    seo: { title: 'Custom Office Furniture Dubai | Desks & Fit-Out Furniture', description: 'Custom office furniture in Dubai: workstations, desks, reception counters, meeting tables and storage built to plan. Request a commercial quote.' },
  },
}

export const SERVICE_FAQ_QUESTIONS: Record<string, string[]> = {
  'sofa-upholstery': [
    'Can you upholster an L-shaped sofa?',
    'Can the sofa foam be replaced during upholstery?',
    'Can I supply my own fabric?',
    'How do I get a price for upholstery work?',
  ],
  'custom-furniture': [
    'Can you build custom furniture from a reference photo?',
    'Can furniture be made to exact room dimensions?',
    'What custom furniture can you build?',
    'What information is required for a custom furniture quote?',
  ],
  'custom-sofa': [
    'Can you build a sofa to my exact dimensions?',
    'How is a custom sofa different from sofa upholstery?',
    'Can I choose the sofa firmness?',
    'How long does a custom sofa take?',
  ],
  'majlis-furniture': [
    'Can Majlis seating follow an entire wall?',
    'Can an existing Majlis be reupholstered?',
    'How are Majlis corners measured?',
    'How is majlis seating built and installed?',
  ],
  'curtains-blinds': [
    'Do you measure windows before making curtains?',
    'What is the difference between sheer and blackout curtains?',
    'Can sheer and blackout curtain layers be combined?',
    'Do you supply and fit roller blinds?',
  ],
  'sofa-repair': [
    'Can a sagging sofa seat be repaired?',
    'Can a sofa be repaired without replacing the fabric?',
    'How do you assess a sofa repair from photos?',
    'Does a repair cost less than re-upholstery?',
  ],
  'custom-wardrobes': [
    'Should I choose sliding or hinged wardrobe doors?',
    'Can the internal wardrobe layout be customized?',
    'Can a wardrobe fit around columns or bulkheads?',
    'How do you plan a fitted wardrobe layout?',
  ],
  'custom-beds-headboards': [
    'Can you build a bed for a non-standard mattress?',
    'Do you make upholstered headboards?',
    'Can a headboard be mounted to the wall?',
    'What measurements are needed for a custom bed quote?',
  ],
  'office-furniture': [
    'Can you fit out an office to our floor plan?',
    'Do you make reception desks and meeting tables?',
    'Can cable management be built into office desks?',
    'What do you need to quote custom office furniture?',
  ],
}
