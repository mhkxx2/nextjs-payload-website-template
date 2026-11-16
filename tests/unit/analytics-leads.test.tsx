import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { QuoteRequestForm } from '@/components/home/QuoteRequestForm'

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

const submitQuote = () => {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Private Customer' } })
  fireEvent.change(screen.getByLabelText('Phone / WhatsApp'), { target: { value: '+971500000000' } })
  fireEvent.change(screen.getByLabelText('Service'), { target: { value: 'custom-sofa' } })
  fireEvent.change(screen.getByLabelText('Area'), { target: { value: 'Dubai Marina' } })
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Private message' } })
  fireEvent.submit(screen.getByRole('button', { name: 'Request a Quote' }).closest('form')!)
}

describe('lead conversion tracking', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    window.dataLayer = undefined
  })

  it('emits generate_lead only after a successful quote response and excludes PII', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ message: 'Saved' }),
      ok: true,
    }))

    render(
      <QuoteRequestForm
        areas={['Dubai Marina']}
        formLocation="service_quote"
        leadType="service_quote"
        service="custom-sofa"
        services={[{ slug: 'custom-sofa', title: 'Custom Sofa' }]}
      />,
    )

    submitQuote()

    await waitFor(() => expect(window.dataLayer).toHaveLength(1))
    expect(window.dataLayer?.[0]).toEqual(expect.objectContaining({
      area: 'Dubai Marina',
      cta_location: 'service_quote',
      event: 'generate_lead',
      lead_type: 'service_quote',
      service: 'custom-sofa',
    }))
    expect(JSON.stringify(window.dataLayer?.[0])).not.toContain('Private Customer')
    expect(JSON.stringify(window.dataLayer?.[0])).not.toContain('+971500000000')
    expect(JSON.stringify(window.dataLayer?.[0])).not.toContain('Private message')
  })

  it('does not emit generate_lead when the server rejects the quote', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ message: 'Rejected' }),
      ok: false,
    }))

    render(
      <QuoteRequestForm
        areas={['Dubai Marina']}
        formLocation="homepage_quote"
        leadType="service_quote"
        services={[{ slug: 'custom-sofa', title: 'Custom Sofa' }]}
      />,
    )

    submitQuote()

    await screen.findByText('Rejected')
    expect(window.dataLayer).toBeUndefined()
  })

  it('does not emit generate_lead on a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    render(
      <QuoteRequestForm
        areas={['Dubai Marina']}
        formLocation="contact_quote"
        leadType="contact"
        services={[{ slug: 'custom-sofa', title: 'Custom Sofa' }]}
      />,
    )

    submitQuote()

    await screen.findByText(/could not be sent/i)
    expect(window.dataLayer).toBeUndefined()
  })
})
