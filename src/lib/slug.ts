import { RESERVED_EXACT_ROUTES, RESERVED_PREFIXES } from './routes'

const SAFE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isSafeSlug(input: string): boolean {
  return SAFE_SLUG_PATTERN.test(input)
}

export function normalizeSlug(input: string): string {
  return input
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
}

export function validatePageSlug(input: string): true | string {
  const normalized = normalizeSlug(input)

  if (!normalized) {
    return 'A slug is required.'
  }

  if (!isSafeSlug(normalized)) {
    return 'Use only lowercase letters, numbers, and single hyphens.'
  }

  if ((RESERVED_EXACT_ROUTES as readonly string[]).includes(normalized)) {
    return `The slug “${normalized}” is reserved. Please choose a different slug.`
  }

  if (RESERVED_PREFIXES.some((prefix) => normalized.startsWith(`${prefix}/`))) {
    return `The route “${normalized}” is reserved. Please choose a different slug.`
  }

  return true
}
