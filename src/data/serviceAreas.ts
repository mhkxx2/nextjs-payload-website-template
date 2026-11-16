export const SERVICE_AREA_GROUPS = [
  'dubai',
  'sharjah',
  'ras-al-khaimah',
  'other-uae',
] as const

export type ServiceAreaGroup = (typeof SERVICE_AREA_GROUPS)[number]

export const SERVICE_AREA_GROUP_LABELS: Record<ServiceAreaGroup, string> = {
  dubai: 'Dubai',
  sharjah: 'Sharjah',
  'ras-al-khaimah': 'Ras Al Khaimah',
  'other-uae': 'Other UAE Areas',
}

export const DUBAI_AREAS = [
  'Palm Jumeirah',
  'Dubai Marina',
  'Jumeirah Beach Residence (JBR)',
  'Emirates Hills',
  'Jumeirah Village Circle (JVC)',
  'Dubai Hills Estate',
  'Arabian Ranches',
  'Business Bay',
  'Arjan',
  'Murjan, JBR',
  'Al Barsha',
  'Downtown Dubai',
  'Jumeirah Lakes Towers (JLT)',
  'Mirdif',
  'Nad Al Hamar',
  'Nad Al Sheba',
  'The Greens',
  'Meydan',
  'Palm Jebel Ali',
  'DIFC',
  'DAMAC Hills',
  'DAMAC Hills 2',
  'Al Yalayis 2',
  'Remraam',
  'Zabeel',
  'Mudon',
  'Al Waha',
  'Dubai Sports City',
  'Jumeirah Golf Estates',
  'The Springs',
  'Al Furjan',
  'Dubai Internet City',
  'Bluewaters Island',
  'Old Dubai',
  'Dubailand Residence Complex',
  'The Villa',
  'Wadi Al Safa',
  'Dubai Creek Harbour',
  'Al Aweer',
  'Al Khawaneej',
  'Dubai Harbour',
  'Dubai Festival City',
  'Dubai Silicon Oasis',
  'Saih Shuaib 1',
  'Saih Shuaib 2',
] as const

export const SHARJAH_AREAS = ['Sharjah'] as const

export const RAS_AL_KHAIMAH_AREAS = [
  'Ras Al Khaimah',
  'Al Marjan Island',
  'Mina Al Arab',
  'Al Hamra Village',
  'Al Jazirah Al Hamra',
] as const

// Ajman is already verified in src/seed/business.ts and is the workshop base.
export const OTHER_UAE_AREAS = ['Ajman'] as const

export const AREA_SEEDS = [
  ...DUBAI_AREAS.map((name, order) => ({ group: 'dubai' as const, name, order })),
  ...SHARJAH_AREAS.map((name, order) => ({ group: 'sharjah' as const, name, order })),
  ...RAS_AL_KHAIMAH_AREAS.map((name, order) => ({
    group: 'ras-al-khaimah' as const,
    name,
    order,
  })),
  ...OTHER_UAE_AREAS.map((name, order) => ({ group: 'other-uae' as const, name, order })),
] as const

