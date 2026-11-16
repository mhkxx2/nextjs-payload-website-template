import { describe, expect, it } from 'vitest'

import { MAX_QUOTE_UPLOAD_BYTES, validateQuoteRequest } from '@/server/leads/validateQuoteRequest'

const valid = {
  area: 'Dubai Marina',
  consent: 'true',
  message: 'I would like this sofa reupholstered in a neutral fabric.',
  name: 'A Customer',
  phone: '+971 50 123 4567',
  service: 'sofa-upholstery',
}

describe('public quote request validation', () => {
  it('accepts every required public field and normalizes copy', () => {
    expect(validateQuoteRequest(valid)).toEqual({
      ok: true,
      value: {
        area: 'Dubai Marina',
        message: valid.message,
        name: 'A Customer',
        phone: '+971 50 123 4567',
        service: 'sofa-upholstery',
      },
    })
  })

  it.each(['name', 'phone', 'service', 'area', 'message', 'consent'] as const)(
    'rejects a request without %s',
    (field) => {
      expect(validateQuoteRequest({ ...valid, [field]: '' })).toMatchObject({ ok: false })
    },
  )

  it('rejects an unknown service and limits public upload size', () => {
    expect(validateQuoteRequest({ ...valid, service: 'not-a-service' })).toMatchObject({ ok: false })
    expect(MAX_QUOTE_UPLOAD_BYTES).toBe(12 * 1024 * 1024)
  })

  it('accepts a safe portfolio item reference and rejects malformed values', () => {
    expect(validateQuoteRequest({ ...valid, portfolioItem: '42' })).toMatchObject({
      ok: true,
      value: { portfolioItem: '42' },
    })
    expect(validateQuoteRequest({ ...valid, portfolioItem: '../admin' })).toMatchObject({ ok: false })
  })
})

