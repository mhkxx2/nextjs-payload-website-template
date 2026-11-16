import { describe, expect, it } from 'vitest'

import {
  ALL_PAGE_BUILDER_BLOCKS,
  BenefitsBlock,
  CallToActionBlock,
  HeroBlock,
  LocationCoverageBlock,
  ProcessStepsBlock,
  SplitContentBlock,
  StatisticsBlock,
} from '@/blocks'

describe('Task 9 Page Builder Blocks Integration & Schema Suite', () => {
  it('exports all 14 required block configurations with correct slugs', () => {
    expect(ALL_PAGE_BUILDER_BLOCKS.length).toBe(14)

    const slugs = ALL_PAGE_BUILDER_BLOCKS.map((b) => b.slug)
    expect(slugs).toEqual([
      'hero',
      'richContent',
      'media',
      'splitContent',
      'serviceGrid',
      'projectGallery',
      'benefits',
      'processSteps',
      'testimonials',
      'faqs',
      'locationCoverage',
      'statistics',
      'callToAction',
      'quoteForm',
    ])
  })

  it('enforces required substantiationNote field on Statistics block', () => {
    const fields = StatisticsBlock.fields as Array<Record<string, unknown>>
    const noteField = fields.find((f) => f.name === 'substantiationNote')
    expect(noteField).toBeDefined()
    expect(noteField?.required).toBe(true)
  })

  it('enforces required heading fields on critical content blocks', () => {
    const getHeadingRequired = (block: { fields: unknown[] }) => {
      const fields = block.fields as Array<Record<string, unknown>>
      return fields.find((f) => f.name === 'heading')?.required
    }

    expect(getHeadingRequired(HeroBlock)).toBe(true)
    expect(getHeadingRequired(SplitContentBlock)).toBe(true)
    expect(getHeadingRequired(BenefitsBlock)).toBe(true)
    expect(getHeadingRequired(ProcessStepsBlock)).toBe(true)
    expect(getHeadingRequired(LocationCoverageBlock)).toBe(true)
    expect(getHeadingRequired(CallToActionBlock)).toBe(true)
  })
})
