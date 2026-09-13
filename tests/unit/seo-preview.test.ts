import { cleanup, render, screen } from '@testing-library/react'
import { createElement, type ComponentProps } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { formState } = vi.hoisted(() => ({
  formState: {
    fields: {} as Record<string, { value: unknown }>,
  },
}))

vi.mock('@payloadcms/ui', () => ({
  useFormFields: (selector: (state: [typeof formState.fields]) => unknown) =>
    selector([formState.fields]),
}))

import { SEOPreview } from '@/fields/SEOPreview'

const defaultProps = {
  canonicalPath: 'canonicalURL',
  descriptionPath: 'openGraphDescription',
  imagePath: 'openGraphImage',
  path: 'preview',
  titlePath: 'openGraphTitle',
} as ComponentProps<typeof SEOPreview>

describe('SEO preview', () => {
  beforeEach(() => {
    formState.fields = {}
  })

  afterEach(cleanup)

  it('renders root SEO values and meaningful populated-media details without leaking unrelated data', () => {
    formState.fields = {
      canonicalURL: { value: 'https://alruknfurniture.ae/custom-sofas/' },
      openGraphDescription: { value: 'Handcrafted furniture in Dubai.' },
      openGraphImage: {
        value: {
          alt: 'Cream sectional in a living room',
          filename: 'cream-sectional.jpg',
          id: 17,
          secretToken: 'must-not-render',
          thumbnailURL: '/media/cream-sectional-300x200.jpg',
        },
      },
      openGraphTitle: { value: 'Custom sofas in Dubai' },
    }

    render(createElement(SEOPreview, defaultProps))

    expect(screen.getByText('https://alruknfurniture.ae/custom-sofas/')).toBeTruthy()
    expect(screen.getByText('Custom sofas in Dubai')).toBeTruthy()
    expect(screen.getByText('Handcrafted furniture in Dubai.')).toBeTruthy()
    expect(
      screen.getByRole('img', { name: 'Cream sectional in a living room' }).getAttribute('src'),
    ).toBe('/media/cream-sectional-300x200.jpg')
    expect(screen.getByText('Cream sectional in a living room — cream-sectional.jpg')).toBeTruthy()
    expect(screen.queryByText('must-not-render')).toBeNull()
  })

  it('resolves nested sibling paths and identifies an ID-only selected image', () => {
    formState.fields = {
      'seo.canonicalURL': { value: 'https://alruknfurniture.ae/services/reupholstery/' },
      'seo.openGraphDescription': { value: 'Restore a favourite piece.' },
      'seo.openGraphImage': { value: 42 },
      'seo.openGraphTitle': { value: 'Furniture reupholstery' },
    }

    render(createElement(SEOPreview, { ...defaultProps, path: 'seo.preview' }))

    expect(screen.getByText('https://alruknfurniture.ae/services/reupholstery/')).toBeTruthy()
    expect(screen.getByText('Furniture reupholstery')).toBeTruthy()
    expect(screen.getByText('Restore a favourite piece.')).toBeTruthy()
    expect(screen.getByText('Selected media ID: 42')).toBeTruthy()
    expect(screen.queryByRole('img')).toBeNull()
  })
})
