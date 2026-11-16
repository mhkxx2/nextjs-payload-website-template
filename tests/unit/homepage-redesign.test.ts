import { describe, expect, it } from 'vitest'

import { Areas } from '@/collections/Areas'
import { Homepage } from '@/globals/Homepage'
import {
  DUBAI_AREAS,
  RAS_AL_KHAIMAH_AREAS,
  SERVICE_AREA_GROUPS,
  SHARJAH_AREAS,
} from '@/data/serviceAreas'
import { HOME_META, HOME_SECTIONS } from '@/data/homepage'
import { SEODefaults } from '@/globals/SEODefaults'

describe('premium homepage contract', () => {
  it('keeps the approved primary SEO positioning', () => {
    expect(HOME_META).toEqual({
      canonical: 'https://alruknfurniture.ae/',
      description:
        'Custom-made furniture, sofa upholstery, Majlis, wardrobes, beds, curtains and furniture repair in Dubai, Sharjah and across the UAE. Get a free quotation.',
      h1: 'Custom Furniture & Sofa Upholstery in Dubai',
      title: 'Custom Furniture & Sofa Upholstery Dubai | Al Rukn',
    })
  })

  it('uses the approved section order without testimonials or projects as unconditional claims', () => {
    expect(HOME_SECTIONS).toEqual([
      'services',
      'customFurniture',
      'upholstery',
      'majlis',
      'projects',
      'process',
      'whyChoose',
      'areas',
      'localContent',
      'testimonials',
      'faqs',
      'finalCta',
    ])
  })

  it('models the Homepage global as ordered editable sections', () => {
    expect(Homepage.slug).toBe('homepage')
    const fieldNames = Homepage.fields.flatMap((field) => ('name' in field ? [field.name] : []))
    expect(fieldNames).toEqual(expect.arrayContaining(['seo', 'hero', 'trustItems', 'sections']))
    const sections = Homepage.fields.find(
      (field) => 'name' in field && field.name === 'sections' && field.type === 'blocks',
    )
    expect(sections && 'blocks' in sections ? sections.blocks.map((block) => block.slug) : []).toEqual(
      HOME_SECTIONS,
    )
  })

  it('registers a bounded Areas collection and corrected region groups', () => {
    expect(Areas.slug).toBe('areas')
    expect(SERVICE_AREA_GROUPS).toEqual(['dubai', 'sharjah', 'ras-al-khaimah', 'other-uae'])
    expect(DUBAI_AREAS).toContain('Bluewaters Island')
    expect(DUBAI_AREAS).toContain('Saih Shuaib 1')
    expect(DUBAI_AREAS).toContain('Saih Shuaib 2')
    expect(DUBAI_AREAS).not.toContain('Ain Dubai')
    expect(RAS_AL_KHAIMAH_AREAS).toEqual([
      'Ras Al Khaimah',
      'Al Marjan Island',
      'Mina Al Arab',
      'Al Hamra Village',
      'Al Jazirah Al Hamra',
    ])
    expect(SHARJAH_AREAS).toEqual(['Sharjah'])
    const allNames = [...DUBAI_AREAS, ...SHARJAH_AREAS, ...RAS_AL_KHAIMAH_AREAS]
    expect(allNames).not.toEqual(
      expect.arrayContaining(['DIB', 'Dubai Investments Park', 'Ghadeer Al Tair', 'Hazar Villa']),
    )
  })

  it('defaults structured data to LocalBusiness and exposes no price range field', () => {
    const localBusiness = SEODefaults.fields.find(
      (field) => 'name' in field && field.name === 'localBusinessSchema' && field.type === 'group',
    )
    const fields = localBusiness && 'fields' in localBusiness ? localBusiness.fields : []
    const businessType = fields.find((field) => 'name' in field && field.name === 'businessType')
    expect(businessType).toMatchObject({ defaultValue: 'LocalBusiness' })
    expect(fields.some((field) => 'name' in field && field.name === 'priceRange')).toBe(false)
  })
})
