import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  pushDataLayerEvent,
  trackGenerateLead,
  trackPhoneCallClick,
  trackWhatsAppClick,
  type AnalyticsEvent,
} from '@/lib/analytics'

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

describe('analytics data-layer contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    window.dataLayer = undefined
    document.title = ''
    window.history.replaceState(null, '', '/')
  })

  it('initializes dataLayer before GTM loads and enriches a WhatsApp click', () => {
    document.title = 'Custom Sofa | Al Rukn'
    window.history.replaceState(null, '', '/custom-sofa/?design=corner')

    trackWhatsAppClick({
      cta_location: 'service_hero',
      link_url: 'https://wa.me/971551224902',
      service: 'custom-sofa',
    })

    expect(window.dataLayer).toEqual([
      {
        event: 'whatsapp_click',
        page_path: '/custom-sofa/',
        page_title: 'Custom Sofa | Al Rukn',
        cta_location: 'service_hero',
        service: 'custom-sofa',
        link_url: 'https://wa.me/971551224902',
      },
    ])
  })

  it('uses exact call and lead event names and removes empty optional values', () => {
    trackPhoneCallClick({ cta_location: 'mobile_sticky', link_url: 'tel:+971551224902' })
    trackGenerateLead({
      area: 'Dubai Marina',
      cta_location: 'service_quote',
      lead_type: 'service_quote',
      service: '',
    })

    expect(window.dataLayer).toEqual([
      expect.objectContaining({
        event: 'phone_call_click',
        cta_location: 'mobile_sticky',
        link_url: 'tel:+971551224902',
      }),
      expect.objectContaining({
        event: 'generate_lead',
        area: 'Dubai Marina',
        cta_location: 'service_quote',
        lead_type: 'service_quote',
      }),
    ])
    expect(window.dataLayer?.[1]).not.toHaveProperty('service')
  })

  it('infers the service slug for shared contact controls on every fixed service route', () => {
    window.history.replaceState(null, '', '/sofa-upholstery/')

    trackWhatsAppClick({ cta_location: 'floating_whatsapp' })
    trackPhoneCallClick({ cta_location: 'header' })

    expect(window.dataLayer).toEqual([
      expect.objectContaining({ event: 'whatsapp_click', service: 'sofa-upholstery' }),
      expect.objectContaining({ event: 'phone_call_click', service: 'sofa-upholstery' }),
    ])
  })

  it('allowlists parameters and strips PII-shaped or unknown values at runtime', () => {
    pushDataLayerEvent({
      event: 'generate_lead',
      lead_type: 'contact',
      cta_location: 'contact_quote',
      // Exercise the runtime boundary against untyped callers and compromised values.
      customer_email: 'customer@example.com',
      customer_name: 'Customer Name',
      customer_phone: '+971500000000',
      message: 'Private request details',
      uploaded_filename: 'passport.jpg',
    } as unknown as AnalyticsEvent)

    expect(window.dataLayer).toEqual([
      expect.objectContaining({
        event: 'generate_lead',
        lead_type: 'contact',
        cta_location: 'contact_quote',
      }),
    ])
    const payload = window.dataLayer?.[0]
    expect(payload).not.toHaveProperty('customer_email')
    expect(payload).not.toHaveProperty('customer_name')
    expect(payload).not.toHaveProperty('customer_phone')
    expect(payload).not.toHaveProperty('message')
    expect(payload).not.toHaveProperty('uploaded_filename')
  })

  it('does not throw during server rendering when window is unavailable', () => {
    vi.stubGlobal('window', undefined)

    expect(() => trackGenerateLead({ lead_type: 'form_submission' })).not.toThrow()
  })
})
