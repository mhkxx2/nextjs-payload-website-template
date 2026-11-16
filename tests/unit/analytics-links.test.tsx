import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { TrackedContactLink } from '@/components/TrackedContactLink'

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

describe('TrackedContactLink', () => {
  afterEach(() => {
    window.dataLayer = undefined
  })

  const clickWithoutNavigation = (link: HTMLElement) => {
    let preventedByComponent = true
    document.addEventListener(
      'click',
      (event) => {
        preventedByComponent = event.defaultPrevented
        event.preventDefault()
      },
      { once: true },
    )
    fireEvent.click(link)
    return preventedByComponent
  }

  it('emits one WhatsApp event without changing or preventing the destination', () => {
    render(
      <TrackedContactLink
        analytics={{ cta_location: 'service_hero', service: 'sofa-upholstery' }}
        eventName="whatsapp_click"
        href="https://wa.me/971551224902"
        target="_blank"
      >
        Message on WhatsApp
      </TrackedContactLink>,
    )

    const link = screen.getByRole('link', { name: 'Message on WhatsApp' })
    const preventedByComponent = clickWithoutNavigation(link)

    expect(preventedByComponent).toBe(false)
    expect(link.getAttribute('href')).toBe('https://wa.me/971551224902')
    expect(window.dataLayer).toEqual([
      expect.objectContaining({
        event: 'whatsapp_click',
        cta_location: 'service_hero',
        service: 'sofa-upholstery',
        link_url: 'https://wa.me/971551224902',
      }),
    ])
  })

  it('emits one telephone event with the CTA location', () => {
    render(
      <TrackedContactLink
        analytics={{ cta_location: 'mobile_sticky' }}
        eventName="phone_call_click"
        href="tel:+971551224902"
      >
        Call
      </TrackedContactLink>,
    )

    clickWithoutNavigation(screen.getByRole('link', { name: 'Call' }))

    expect(window.dataLayer).toEqual([
      expect.objectContaining({
        event: 'phone_call_click',
        cta_location: 'mobile_sticky',
        link_url: 'tel:+971551224902',
      }),
    ])
  })

  it('preserves portfolio context without accepting customer fields', () => {
    render(
      <TrackedContactLink
        analytics={{
          category: 'living-room',
          cta_location: 'portfolio',
          portfolio_item: 'curved-sofa-01',
          service: 'custom-sofa',
        }}
        eventName="whatsapp_click"
        href="https://wa.me/971551224902?text=portfolio"
      >
        Send on WhatsApp
      </TrackedContactLink>,
    )

    clickWithoutNavigation(screen.getByRole('link', { name: 'Send on WhatsApp' }))

    expect(window.dataLayer?.[0]).toEqual(
      expect.objectContaining({
        event: 'whatsapp_click',
        category: 'living-room',
        portfolio_item: 'curved-sofa-01',
        service: 'custom-sofa',
      }),
    )
  })
})
