import type { Access, FieldHook, GlobalAfterChangeHook, TextFieldValidation } from 'payload'

import { invalidateGlobalContent } from './hooks/revalidateGlobalContent'

export const CANONICAL_PUBLIC_ORIGIN = 'https://alruknfurniture.ae'

export const publicRead: Access = () => true
export const authenticatedWrite: Access = ({ req: { user } }) => Boolean(user)

export const trimText: FieldHook = ({ value }) =>
  typeof value === 'string' ? value.trim() : value

export const validateCanonicalPublicOrigin: TextFieldValidation = (value) =>
  value === CANONICAL_PUBLIC_ORIGIN ||
  `Canonical public origin must be exactly ${CANONICAL_PUBLIC_ORIGIN}.`

const e164Pattern = /^\+[1-9]\d{7,14}$/

export const isValidE164 = (value: unknown): value is string =>
  typeof value === 'string' && e164Pattern.test(value)

export const validateOptionalE164: TextFieldValidation = (value) =>
  value == null || value === '' || isValidE164(value) || 'Enter a valid E.164 number, for example +971551224902.'

const explicitPort = /^https:\/\/[^/?#]*:\d+(?:[/?#]|$)/i
const mapHosts = new Set(['google.com', 'maps.app.goo.gl', 'maps.google.com', 'www.google.com'])

export const validateMapURL: TextFieldValidation = (value) => {
  if (value == null || value === '') return true
  if (typeof value !== 'string' || value.trim() !== value || explicitPort.test(value)) {
    return 'Map URL must be a clean HTTPS URL on an approved map host without credentials or ports.'
  }
  try {
    const url = new URL(value)
    return (
      (url.protocol === 'https:' &&
        url.username === '' &&
        url.password === '' &&
        url.hash === '' &&
        mapHosts.has(url.hostname)) ||
      'Map URL must use HTTPS and an approved Google Maps host without credentials, ports, or fragments.'
    )
  } catch {
    return 'Enter a valid map URL.'
  }
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global, req }) => {
  invalidateGlobalContent(
    global.slug,
    req as unknown as Parameters<typeof invalidateGlobalContent>[1],
  )
  return doc
}
