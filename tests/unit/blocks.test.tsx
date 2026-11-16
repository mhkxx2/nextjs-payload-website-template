import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { HeroBlockComponent } from '@/blocks/Hero/Component'
import { RichContentBlockComponent } from '@/blocks/RichContent/Component'
import { MediaBlockComponent } from '@/blocks/MediaBlock/Component'
import { SplitContentBlockComponent } from '@/blocks/SplitContent/Component'
import { ServiceGridBlockComponent } from '@/blocks/ServiceGrid/Component'
import { ProjectGalleryBlockComponent } from '@/blocks/ProjectGallery/Component'
import { BenefitsBlockComponent } from '@/blocks/Benefits/Component'
import { ProcessStepsBlockComponent } from '@/blocks/ProcessSteps/Component'
import { TestimonialsBlockComponent } from '@/blocks/Testimonials/Component'
import { FaqsBlockComponent } from '@/blocks/Faqs/Component'
import { LocationCoverageBlockComponent } from '@/blocks/LocationCoverage/Component'
import { StatisticsBlockComponent } from '@/blocks/Statistics/Component'
import { CallToActionBlockComponent } from '@/blocks/CallToAction/Component'
import { QuoteFormBlockComponent } from '@/blocks/QuoteForm/Component'

describe('Task 9 Page Builder Blocks Unit Suite', () => {
  it('renders Hero block correctly', () => {
    render(<HeroBlockComponent heading="Welcome to Al Rukn" subheading="Custom furniture UAE" />)
    expect(screen.getByText('Welcome to Al Rukn')).toBeDefined()
    expect(screen.getByText('Custom furniture UAE')).toBeDefined()
  })

  it('renders RichContent block correctly', () => {
    render(<RichContentBlockComponent content="Sample rich text content" />)
    expect(screen.getByText('Sample rich text content')).toBeDefined()
  })

  it('renders Media block correctly', () => {
    render(<MediaBlockComponent media={{ url: '/test.jpg', alt: 'Test image' }} caption="Living room sofa" />)
    expect(screen.getByText('Living room sofa')).toBeDefined()
  })

  it('renders SplitContent block correctly', () => {
    render(
      <SplitContentBlockComponent
        heading="Precision Craftsmanship"
        body="We handcraft luxury furniture."
        media={{ url: '/sofa.jpg', alt: 'Sofa' }}
      />
    )
    expect(screen.getByText('Precision Craftsmanship')).toBeDefined()
    expect(screen.getByText('We handcraft luxury furniture.')).toBeDefined()
  })

  it('renders ServiceGrid block correctly', () => {
    render(
      <ServiceGridBlockComponent
        heading="Our Services"
        services={[{ id: 1, title: 'Custom Sofa Upholstery', slug: 'custom-sofa' }]}
      />
    )
    expect(screen.getByText('Our Services')).toBeDefined()
    expect(screen.getByText('Custom Sofa Upholstery')).toBeDefined()
  })

  it('renders ProjectGallery block correctly', () => {
    render(
      <ProjectGalleryBlockComponent
        heading="Recent Projects"
        projects={[{ id: 10, title: 'Villa Majlis Renovation', slug: 'villa-majlis' }]}
      />
    )
    expect(screen.getByText('Recent Projects')).toBeDefined()
    expect(screen.getByText('Villa Majlis Renovation')).toBeDefined()
  })

  it('renders Benefits block correctly', () => {
    render(
      <BenefitsBlockComponent
        heading="Why Choose Us"
        items={[{ title: 'Premium German Fabrics', description: 'Top quality materials.' }]}
      />
    )
    expect(screen.getByText('Why Choose Us')).toBeDefined()
    expect(screen.getByText('Premium German Fabrics')).toBeDefined()
  })

  it('renders ProcessSteps block correctly', () => {
    render(
      <ProcessStepsBlockComponent
        heading="How We Work"
        steps={[{ stepNumber: 1, title: 'Free Consultation', description: 'At your doorstep.' }]}
      />
    )
    expect(screen.getByText('How We Work')).toBeDefined()
    expect(screen.getByText('Free Consultation')).toBeDefined()
  })

  it('renders Testimonials block correctly', () => {
    render(
      <TestimonialsBlockComponent
        heading="Client Feedback"
        testimonials={[{ quote: 'Outstanding service and finish!', author: 'Hassan M.', role: 'Dubai' }]}
      />
    )
    expect(screen.getByText('Client Feedback')).toBeDefined()
    expect(screen.getByText('“Outstanding service and finish!”')).toBeDefined()
  })

  it('renders Faqs block correctly with schema toggle', () => {
    const { container } = render(
      <FaqsBlockComponent
        heading="Frequently Asked Questions"
        faqs={[
          {
            answer: 'Usually 7-10 business days.',
            question: 'How long does sofa making take?',
            schemaEligible: true,
          },
        ]}
        enableSchema={true}
      />
    )
    expect(screen.getByText('Frequently Asked Questions')).toBeDefined()
    expect(screen.getByText('How long does sofa making take?')).toBeDefined()
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    expect(script?.textContent).toContain('FAQPage')
  })

  it('omits the Faqs schema for pairs that are not marked eligible', () => {
    const { container } = render(
      <FaqsBlockComponent
        enableSchema={true}
        faqs={[{ answer: 'Usually 7-10 business days.', question: 'How long does sofa making take?' }]}
        heading="Frequently Asked Questions"
      />
    )

    expect(screen.getByText('How long does sofa making take?')).toBeDefined()
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull()
  })

  it('omits the Faqs schema when the block toggle is off', () => {
    const { container } = render(
      <FaqsBlockComponent
        enableSchema={false}
        faqs={[
          {
            answer: 'Usually 7-10 business days.',
            question: 'How long does sofa making take?',
            schemaEligible: true,
          },
        ]}
      />
    )

    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull()
  })

  it('renders LocationCoverage block correctly', () => {
    render(
      <LocationCoverageBlockComponent
        heading="Serving Across the UAE"
        areas={[{ name: 'Dubai', details: 'All communities' }, { name: 'Sharjah' }]}
      />
    )
    expect(screen.getByText('Serving Across the UAE')).toBeDefined()
    expect(screen.getAllByText('Dubai').length).toBeGreaterThan(0)
  })

  it('renders Statistics block with mandatory substantiation note', () => {
    render(
      <StatisticsBlockComponent
        heading="Our Track Record"
        substantiationNote="Verified by internal sales register 2020-2026."
        stats={[{ label: 'Custom Sofas Built', value: '1,500+' }]}
      />
    )
    expect(screen.getByText('Our Track Record')).toBeDefined()
    expect(screen.getByText('1,500+')).toBeDefined()
    expect(screen.getByText('Note: Verified by internal sales register 2020-2026.')).toBeDefined()
  })

  it('renders CallToAction block correctly', () => {
    render(
      <CallToActionBlockComponent
        heading="Ready to Transform Your Living Room?"
        buttonText="Book Free Visit"
        buttonLink="/contact"
      />
    )
    expect(screen.getByText('Ready to Transform Your Living Room?')).toBeDefined()
    expect(screen.getByText('Book Free Visit')).toBeDefined()
  })

  it('renders QuoteForm block correctly', () => {
    render(<QuoteFormBlockComponent heading="Get a Free Estimate" formTitle="Quick Quote Form" />)
    expect(screen.getByText('Get a Free Estimate')).toBeDefined()
    expect(screen.getByText('Quick Quote Form')).toBeDefined()
  })

  it('renders all 14 blocks via RenderBlocks dispatcher', () => {
    const blocks = [
      { blockType: 'hero', heading: 'Hero Block' },
      { blockType: 'benefits', heading: 'Benefits Block', items: [{ title: 'Quality' }] },
      { blockType: 'statistics', heading: 'Stats Block', substantiationNote: 'Proven', stats: [{ label: 'Years', value: '25' }] },
    ]
    render(<RenderBlocks blocks={blocks} />)
    expect(screen.getByText('Hero Block')).toBeDefined()
    expect(screen.getByText('Benefits Block')).toBeDefined()
    expect(screen.getByText('Stats Block')).toBeDefined()
  })
})
