// @vitest-environment node

import type { Field, GlobalConfig } from 'payload'
import { describe, expect, it } from 'vitest'

import { Services } from '@/collections/Services'
import { cmsFallbacks } from '@/data/cmsFallbacks'
import { AboutPage } from '@/globals/AboutPage'
import { ArchiveSettings } from '@/globals/ArchiveSettings'
import { ContactPage } from '@/globals/ContactPage'
import { Homepage } from '@/globals/Homepage'

const named = (fields: Field[]): string[] =>
  fields.flatMap((field) => ('name' in field && typeof field.name === 'string' ? [field.name] : []))

const group = (global: GlobalConfig, name: string): Field[] => {
  const field = global.fields.find(
    (candidate) => 'name' in candidate && candidate.name === name && candidate.type === 'group',
  )
  if (!field || field.type !== 'group') throw new Error(`Missing group ${name}`)
  return field.fields
}

describe('live fixed-route content schemas', () => {
  it('keeps bootstrap SEO titles within the Payload field limit', () => {
    expect(cmsFallbacks.archives.portfolio.seo.title.length).toBeLessThanOrEqual(60)
  })

  it('defines dedicated draft-enabled fixed-route globals', () => {
    const globals = [Homepage, AboutPage, ContactPage, ArchiveSettings]

    expect(globals.map(({ slug }) => slug)).toEqual([
      'homepage',
      'about-page',
      'contact-page',
      'archive-settings',
    ])
    for (const config of globals) {
      expect(config.versions).toMatchObject({ drafts: { schedulePublish: true } })
    }
  })

  it('uses explicit, editor-friendly archive groups', () => {
    expect(named(ArchiveSettings.fields)).toEqual([
      'servicesArchive',
      'projectsArchive',
      'blogArchive',
      'portfolioArchive',
    ])

    for (const archive of ['servicesArchive', 'projectsArchive', 'blogArchive']) {
      expect(named(group(ArchiveSettings, archive))).toEqual(
        expect.arrayContaining(['heading', 'introduction', 'emptyState', 'cta', 'seo']),
      )
    }
    expect(named(group(ArchiveSettings, 'portfolioArchive'))).toEqual(
      expect.arrayContaining([
        'heading',
        'introduction',
        'emptyState',
        'cta',
        'seo',
        'hero',
        'filterLabels',
        'supportingLabels',
      ]),
    )
  })

  it('models every rendered About and Contact section explicitly', () => {
    expect(named(AboutPage.fields)).toEqual(
      expect.arrayContaining([
        'seo',
        'hero',
        'proofItems',
        'story',
        'servicesSection',
        'processSection',
        'principlesSection',
        'coverageSection',
        'cta',
      ]),
    )
    expect(named(ContactPage.fields)).toEqual(
      expect.arrayContaining([
        'seo',
        'hero',
        'workshopCard',
        'channelLabels',
        'quoteSection',
        'hoursSection',
        'coverageSection',
        'servicesSection',
      ]),
    )
  })

  it('adds homepage form/label ownership and service presentation labels', () => {
    expect(named(Homepage.fields)).toEqual(
      expect.arrayContaining(['quoteForm', 'sharedLabels']),
    )
    expect(named(Services.fields)).toEqual(
      expect.arrayContaining(['presentationLabels']),
    )
  })
})
