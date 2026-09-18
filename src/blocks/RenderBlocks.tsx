import React, { Fragment } from 'react'

import { HeroBlockComponent, HeroBlockProps } from '@/blocks/Hero/Component'
import { RichContentBlockComponent, RichContentBlockProps } from '@/blocks/RichContent/Component'
import { MediaBlockComponent, MediaBlockProps } from '@/blocks/MediaBlock/Component'
import { SplitContentBlockComponent, SplitContentBlockProps } from '@/blocks/SplitContent/Component'
import { ServiceGridBlockComponent, ServiceGridBlockProps } from '@/blocks/ServiceGrid/Component'
import { ProjectGalleryBlockComponent, ProjectGalleryBlockProps } from '@/blocks/ProjectGallery/Component'
import { BenefitsBlockComponent, BenefitsBlockProps } from '@/blocks/Benefits/Component'
import { ProcessStepsBlockComponent, ProcessStepsBlockProps } from '@/blocks/ProcessSteps/Component'
import { TestimonialsBlockComponent, TestimonialsBlockProps } from '@/blocks/Testimonials/Component'
import { FaqsBlockComponent, FaqsBlockProps } from '@/blocks/Faqs/Component'
import { LocationCoverageBlockComponent, LocationCoverageBlockProps } from '@/blocks/LocationCoverage/Component'
import { StatisticsBlockComponent, StatisticsBlockProps } from '@/blocks/Statistics/Component'
import { CallToActionBlockComponent, CallToActionBlockProps } from '@/blocks/CallToAction/Component'
import { QuoteFormBlockComponent, QuoteFormBlockProps } from '@/blocks/QuoteForm/Component'

export type BlockTypeSlug =
  | 'hero'
  | 'richContent'
  | 'media'
  | 'splitContent'
  | 'serviceGrid'
  | 'projectGallery'
  | 'benefits'
  | 'processSteps'
  | 'testimonials'
  | 'faqs'
  | 'locationCoverage'
  | 'statistics'
  | 'callToAction'
  | 'quoteForm'

export const RenderBlocks: React.FC<{
  blocks?: unknown[] | null
  context?: Record<string, unknown>
}> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        if (!block || typeof block !== 'object' || !('blockType' in block)) return null

        const blockType = (block as { blockType: BlockTypeSlug }).blockType

        switch (blockType) {
          case 'hero':
            return <HeroBlockComponent key={index} {...(block as unknown as HeroBlockProps)} />
          case 'richContent':
            return <RichContentBlockComponent key={index} {...(block as unknown as RichContentBlockProps)} />
          case 'media':
            return <MediaBlockComponent key={index} {...(block as unknown as MediaBlockProps)} />
          case 'splitContent':
            return <SplitContentBlockComponent key={index} {...(block as unknown as SplitContentBlockProps)} />
          case 'serviceGrid':
            return <ServiceGridBlockComponent key={index} {...(block as unknown as ServiceGridBlockProps)} />
          case 'projectGallery':
            return <ProjectGalleryBlockComponent key={index} {...(block as unknown as ProjectGalleryBlockProps)} />
          case 'benefits':
            return <BenefitsBlockComponent key={index} {...(block as unknown as BenefitsBlockProps)} />
          case 'processSteps':
            return <ProcessStepsBlockComponent key={index} {...(block as unknown as ProcessStepsBlockProps)} />
          case 'testimonials':
            return <TestimonialsBlockComponent key={index} {...(block as unknown as TestimonialsBlockProps)} />
          case 'faqs':
            return <FaqsBlockComponent key={index} {...(block as unknown as FaqsBlockProps)} />
          case 'locationCoverage':
            return <LocationCoverageBlockComponent key={index} {...(block as unknown as LocationCoverageBlockProps)} />
          case 'statistics':
            return <StatisticsBlockComponent key={index} {...(block as unknown as StatisticsBlockProps)} />
          case 'callToAction':
            return <CallToActionBlockComponent key={index} {...(block as unknown as CallToActionBlockProps)} />
          case 'quoteForm':
            return <QuoteFormBlockComponent key={index} {...(block as unknown as QuoteFormBlockProps)} />
          default: {
            const _exhaustiveCheck: never = blockType
            return null
          }
        }
      })}
    </Fragment>
  )
}
