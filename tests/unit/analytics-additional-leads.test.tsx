import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FormBlock, type FormBlockType } from '@/blocks/Form/Component'
import { PortfolioExplorer, type PortfolioCardData } from '@/components/portfolio/PortfolioExplorer'

vi.mock('next/navigation', () => ({
  usePathname: () => '/portfolio/',
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams('design=curved-sofa'),
}))

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

const portfolioItem: PortfolioCardData = {
  furnitureType: 'Sofa',
  id: 42,
  image: { alt: 'Curved sofa', height: 800, url: '/portfolio.jpg', width: 1200 },
  relatedService: { slug: 'custom-sofa', title: 'Custom Sofa' },
  roomCategory: 'living-room',
  slug: 'curved-sofa',
  title: 'Curved Sofa',
  whatsappURL: 'https://wa.me/971551224902',
}

describe('additional successful lead surfaces', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    window.dataLayer = undefined
  })

  it('tracks a portfolio request only after its successful response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ message: 'Saved' }),
      ok: true,
    }))

    render(<PortfolioExplorer activeFilter="all" filters={[]} items={[portfolioItem]} total={1} />)
    fireEvent.click(screen.getByRole('button', { name: 'Request Similar Design' }))
    fireEvent.change(screen.getByLabelText('Area'), { target: { value: 'Jumeirah' } })
    fireEvent.submit(screen.getByRole('button', { name: 'Request a Quotation' }).closest('form')!)

    await waitFor(() => expect(window.dataLayer).toHaveLength(1))
    expect(window.dataLayer?.[0]).toEqual(expect.objectContaining({
      area: 'Jumeirah',
      category: 'living-room',
      event: 'generate_lead',
      lead_type: 'portfolio_request',
      portfolio_item: 'curved-sofa',
      service: 'custom-sofa',
    }))
  })

  it('tracks a generic Payload form only after its successful response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({}),
      status: 200,
    }))
    const form = {
      confirmationType: 'redirect',
      fields: [],
      id: 'generic-lead',
      redirect: { url: '/thank-you/' },
      submitButtonLabel: 'Send enquiry',
    } as unknown as FormBlockType['form']

    render(<FormBlock enableIntro={false} form={form} />)
    fireEvent.click(screen.getByRole('button', { name: 'Send enquiry' }))

    await waitFor(() => expect(window.dataLayer).toHaveLength(1))
    expect(window.dataLayer?.[0]).toEqual(expect.objectContaining({
      cta_location: 'payload_form',
      event: 'generate_lead',
      lead_type: 'form_submission',
    }))
  })
})
