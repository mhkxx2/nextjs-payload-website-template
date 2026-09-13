import { describe, expect, it } from 'vitest'

import {
  FIXED_SERVICE_SLUGS,
  RESERVED_EXACT_ROUTES,
  RESERVED_PREFIXES,
  canonicalPath,
} from '@/lib/routes'
import { validatePageSlug } from '@/lib/slug'

const services = [
  'sofa-upholstery',
  'custom-furniture',
  'custom-sofa',
  'majlis-furniture',
  'curtains-blinds',
  'sofa-repair',
  'custom-wardrobes',
  'custom-beds-headboards',
  'office-furniture',
] as const

describe('route registry', () => {
  it('defines the complete fixed service registry once', () => {
    expect(FIXED_SERVICE_SLUGS).toEqual(services)
  })

  it.each(services)('reserves fixed service slug %s', (slug) => {
    expect(validatePageSlug(slug)).not.toBe(true)
  })

  it.each([
    'admin',
    'admin/users',
    'api',
    'api/leads',
    'services',
    'projects/a',
    'blog/a',
    'about-us',
    'contact',
    'sitemap.xml',
    'robots.txt',
    '_next',
    'static/a',
    'assets/a',
    'media',
    'uploads/a',
    'health',
    'graphql',
    'graphql-playground',
  ])('rejects protected %s', (slug) => {
    expect(validatePageSlug(slug)).not.toBe(true)
  })

  it('exports exact and descendant route protection', () => {
    expect(RESERVED_EXACT_ROUTES).toEqual(
      expect.arrayContaining([
        'admin',
        'api',
        'services',
        'projects',
        'blog',
        'about',
        'about-us',
        'contact',
        'sitemap.xml',
        'robots.txt',
        '_next',
        'static',
        'assets',
        'media',
        'uploads',
        'health',
        'graphql',
        'graphql-playground',
      ]),
    )
    expect(RESERVED_PREFIXES).toEqual(expect.arrayContaining([...RESERVED_EXACT_ROUTES]))
  })

  it.each(services)('builds the fixed service canonical path for %s', (slug) => {
    expect(canonicalPath('service', slug)).toBe(`/${slug}/`)
  })

  it.each([
    ['project', 'Luxury Majlis', '/projects/luxury-majlis/'],
    ['post', 'Furniture Care', '/blog/furniture-care/'],
    ['page', 'Our Process', '/our-process/'],
  ] as const)('builds the %s canonical path', (kind, slug, expected) => {
    expect(canonicalPath(kind, slug)).toBe(expected)
  })

  it('rejects unsafe canonical slugs', () => {
    expect(() => canonicalPath('project', '../admin')).toThrow(/valid slug/i)
    expect(() => canonicalPath('post', 'custom%2Fwardrobes')).toThrow(/valid slug/i)
  })

  it('rejects non-fixed service canonical paths', () => {
    expect(() => canonicalPath('service', 'not-a-service')).toThrow(/fixed service/i)
  })
})
