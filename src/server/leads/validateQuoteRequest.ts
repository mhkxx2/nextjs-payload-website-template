import { FIXED_SERVICE_SLUGS } from '@/lib/routes'

export const MAX_QUOTE_UPLOAD_BYTES = 12 * 1024 * 1024

export type QuoteRequestValue = {
  area: string
  message: string
  name: string
  phone: string
  portfolioItem?: string
  service: (typeof FIXED_SERVICE_SLUGS)[number]
}

export type QuoteRequestValidation =
  | { ok: true; value: QuoteRequestValue }
  | { errors: Record<string, string>; ok: false }

const text = (value: unknown): string =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''

export function validateQuoteRequest(input: Record<string, unknown>): QuoteRequestValidation {
  const name = text(input.name)
  const phone = text(input.phone)
  const service = text(input.service)
  const area = text(input.area)
  const message = text(input.message)
  const portfolioItem = text(input.portfolioItem)
  const consent = input.consent === true || input.consent === 'true' || input.consent === 'on'
  const errors: Record<string, string> = {}

  if (name.length < 2 || name.length > 120) errors.name = 'Enter your name.'
  if (!/^[+()\d\s-]{7,24}$/.test(phone)) errors.phone = 'Enter a valid phone or WhatsApp number.'
  if (!(FIXED_SERVICE_SLUGS as readonly string[]).includes(service)) {
    errors.service = 'Choose a service.'
  }
  if (area.length < 2 || area.length > 120) errors.area = 'Enter your area.'
  // Message is optional for Ads/landing lead capture; bound length only when provided.
  if (message.length > 0 && (message.length < 10 || message.length > 2000)) {
    errors.message = 'Describe the furniture or work required (at least 10 characters), or leave blank.'
  }
  if (!consent) errors.consent = 'Privacy consent is required.'
  if (portfolioItem && !/^[a-zA-Z0-9_-]{1,80}$/.test(portfolioItem)) {
    errors.portfolioItem = 'The selected portfolio design is invalid.'
  }

  if (Object.keys(errors).length > 0) return { errors, ok: false }

  return {
    ok: true,
    value: {
      area,
      message,
      name,
      phone,
      ...(portfolioItem ? { portfolioItem } : {}),
      service: service as QuoteRequestValue['service'],
    },
  }
}

