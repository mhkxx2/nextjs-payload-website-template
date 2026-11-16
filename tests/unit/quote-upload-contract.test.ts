import { describe, expect, it, vi } from 'vitest'

import { LeadMedia } from '@/collections/LeadMedia'
import { quoteRequestEndpoint } from '@/endpoints/quoteRequest'

describe('private quotation photo flow', () => {
  it('keeps customer reference photos in a private upload collection', async () => {
    expect(LeadMedia.slug).toBe('lead-media')
    expect(await LeadMedia.access?.read?.({ req: { user: null } } as never)).toBe(false)
    expect(await LeadMedia.access?.read?.({ req: { user: { id: 1 } } } as never)).toBe(true)
    expect(LeadMedia.upload).toMatchObject({
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    })
  })

  it('exposes one POST-only controlled quote endpoint', () => {
    expect(quoteRequestEndpoint).toMatchObject({ method: 'post', path: '/quote-request' })
  })

  it('keeps the saved enquiry when its notification email fails', async () => {
    vi.stubEnv('SMTP_TO_EMAIL', 'sales@example.com')
    const events: string[] = []
    const form = new FormData()
    form.set('area', 'Dubai Marina')
    form.set('consent', 'true')
    form.set('message', 'Please quote this portfolio sofa in a neutral fabric.')
    form.set('name', 'A Customer')
    form.set('phone', '+971 50 123 4567')
    form.set('portfolioItem', 'portfolio-1')
    form.set('service', 'sofa-upholstery')

    const response = await quoteRequestEndpoint.handler({
      formData: async () => form,
      payload: {
        create: vi.fn(async ({ collection }: { collection: string }) => {
          if (collection === 'leads') events.push('lead-saved')
          return { id: 'lead-1' }
        }),
        find: vi.fn(async () => ({
          docs: [{ id: 'service-1', slug: 'sofa-upholstery', title: 'Sofa Upholstery' }],
        })),
        findByID: vi.fn(async () => ({
          id: 'portfolio-1',
          relatedService: { id: 'service-1', slug: 'sofa-upholstery', title: 'Sofa Upholstery' },
          slug: 'neutral-sofa',
          title: 'Neutral Sofa',
        })),
        logger: {
          error: vi.fn(() => events.push('email-error-logged')),
        },
        sendEmail: vi.fn(async () => {
          events.push('email-attempted')
          throw new Error('SMTP unavailable')
        }),
      },
    } as never)

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({
      message: 'Thank you. Your quotation request has been received.',
    })
    expect(events).toEqual(['lead-saved', 'email-attempted', 'email-error-logged'])
    vi.unstubAllEnvs()
  })
})
