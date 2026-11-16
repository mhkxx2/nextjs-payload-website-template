import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedField } from '@/access/authenticatedField'
import { revalidateRedirects, revalidateRedirectsAfterDelete } from '@/hooks/revalidateRedirects'

export type RedirectInput = {
  active: boolean
  destination: string
  id?: number | string
  notes?: null | string
  source: string
  type: 301 | 302
}

type ExistingRedirect = RedirectInput & { id?: number | string }
export type ResolvableRedirect = Pick<RedirectInput, 'active' | 'destination' | 'source'> & {
  id?: number | string
  type: number
}

const dangerousEncoding = /%(?:2e|2f|5c)/i
const scheme = /^[a-z][a-z\d+.-]*:/i
const bareAuthority = /^(?:[^/?#@]+@)?(?:\[[^\]]+\]|localhost|(?:\d{1,3}\.){3}\d{1,3}|[^/?#]+\.[^/?#]+)(?::\d+)?(?:[/?#]|$)/i
const REDIRECT_PROTECTED_PREFIXES = new Set([
  '_next',
  'admin',
  'api',
  'assets',
  'graphql',
  'graphql-playground',
  'health',
  'internal',
  'media',
  'next',
  'static',
  'system',
  'uploads',
])

const decodeFully = (value: string): string => {
  let decoded = value
  for (let count = 0; count < 10; count += 1) {
    if (dangerousEncoding.test(decoded)) {
      throw new Error('Encoded path separators or traversal are not allowed.')
    }
    const next = decodeURIComponent(decoded)
    if (next === decoded) return decoded
    decoded = next
  }
  throw new Error('Redirect path uses excessive nested encoding.')
}

const protectedPath = (pathname: string): boolean => {
  const firstSegment = pathname.split('/').filter(Boolean)[0]?.toLowerCase()
  return Boolean(firstSegment && REDIRECT_PROTECTED_PREFIXES.has(firstSegment))
}

/** Canonicalizes a same-origin path while retaining only an explicitly supplied query string. */
export function normalizeRedirectPath(input: string): string {
  if (typeof input !== 'string' || !input || input !== input.trim()) {
    throw new Error('Redirect path must be a non-empty path without surrounding whitespace.')
  }
  if (/[\u0000-\u001f]/.test(input)) throw new Error('Redirect path contains control characters.')
  if (scheme.test(input)) throw new Error('Redirect schemes and hosts are not allowed.')
  if (!input.startsWith('/') && bareAuthority.test(input)) {
    throw new Error('Redirect hosts are not allowed; enter a path only.')
  }
  if (input.startsWith('//')) throw new Error('Protocol-relative redirect path targets are not allowed.')
  if (input.includes('\\')) throw new Error('Redirect paths cannot contain backslashes.')
  if (input.includes('#')) throw new Error('Redirect fragments are not supported.')

  const queryAt = input.indexOf('?')
  const rawPathname = queryAt === -1 ? input : input.slice(0, queryAt)
  const query = queryAt === -1 ? '' : input.slice(queryAt)
  let decoded: string
  try {
    decoded = decodeFully(rawPathname)
  } catch {
    throw new Error('Redirect path contains malformed encoding.')
  }
  if (decoded.includes('\\')) throw new Error('Redirect paths cannot contain backslashes.')
  if (decoded.includes('?') || decoded.includes('#')) {
    throw new Error('Encoded query or fragment delimiters are not allowed in redirect paths.')
  }
  if (decoded.split('/').some((segment) => segment === '.' || segment === '..')) {
    throw new Error('Redirect path traversal is not allowed.')
  }

  let pathname = decoded.startsWith('/') ? decoded : `/${decoded}`
  pathname = pathname.replace(/\/{2,}/g, '/')
  if (pathname !== '/' && !pathname.endsWith('/') && !/\/[^/]+\.[a-z\d]+$/i.test(pathname)) {
    pathname += '/'
  }
  return `${pathname}${query}`
}

const sameID = (left: ExistingRedirect, right: ExistingRedirect): boolean =>
  left.id != null && right.id != null && String(left.id) === String(right.id)

export function validateRedirect(record: RedirectInput, existing: ExistingRedirect[]): true | string {
  if (record.type !== 301 && record.type !== 302) return 'Redirect type must be either 301 or 302.'

  let source: string
  let destination: string
  try {
    source = normalizeRedirectPath(record.source)
    destination = normalizeRedirectPath(record.destination)
  } catch (error) {
    return error instanceof Error ? error.message : 'Invalid redirect path.'
  }

  const sourcePathname = source.split('?')[0] ?? ''
  const destinationPathname = destination.split('?')[0] ?? ''
  if (protectedPath(sourcePathname) || protectedPath(destinationPathname)) {
    return 'Redirect source and destination cannot target a protected route.'
  }
  if (source === destination) return 'A redirect cannot loop to itself.'
  if (!record.active) return true

  for (const candidate of existing) {
    if (!candidate.active || sameID(record, candidate)) continue
    let existingDestination: string
    let existingSource: string
    try {
      existingDestination = normalizeRedirectPath(candidate.destination)
      existingSource = normalizeRedirectPath(candidate.source)
    } catch {
      continue
    }
    if (existingSource === source) return 'An active redirect already uses this exact source.'
    if (existingSource === destination || existingDestination === source) {
      return 'Redirect chains are not allowed.'
    }
  }
  return true
}

export function resolveRedirect<T extends ResolvableRedirect>(source: string, records: T[]): T | undefined {
  let normalized: string
  try {
    normalized = normalizeRedirectPath(source)
  } catch {
    return undefined
  }
  return records
    .filter((record) => {
      if (!record.active) return false
      try {
        return normalizeRedirectPath(record.source) === normalized
      } catch {
        return false
      }
    })
    .sort((left, right) => String(left.id ?? '').localeCompare(String(right.id ?? ''), 'en', { numeric: true }))[0]
}

const validateAndNormalizeRedirect: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  const merged = { ...originalDoc, ...data } as RedirectInput
  const source = normalizeRedirectPath(merged.source)
  const destination = normalizeRedirectPath(merged.destination)
  const active = merged.active ?? true
  const type = merged.type ?? 301

  const matches = active
    ? await req.payload.find({
        collection: 'redirects',
        depth: 0,
        limit: 100,
        overrideAccess: true,
        pagination: false,
        sort: 'id',
        where: {
          or: [
            { source: { equals: source } },
            { source: { equals: destination } },
            { destination: { equals: source } },
          ],
        },
      })
    : { docs: [] }

  const result = validateRedirect(
    { active, destination, id: merged.id, notes: merged.notes, source, type },
    matches.docs as ExistingRedirect[],
  )
  if (result !== true) throw new Error(result)
  return { ...data, active, destination, source, type }
}

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req }) => (req.user ? true : { active: { equals: true } }),
    update: authenticated,
  },
  admin: {
    defaultColumns: ['source', 'destination', 'type', 'active', 'updatedAt'],
    useAsTitle: 'source',
  },
  fields: [
    { name: 'source', type: 'text', index: true, required: true },
    { name: 'destination', type: 'text', required: true },
    {
      name: 'type',
      type: 'number',
      admin: { description: 'HTTP redirect status. Only 301 or 302 is accepted.' },
      defaultValue: 301,
      required: true,
      validate: (value: number | null | undefined) =>
        value === 301 || value === 302 || 'Redirect type must be either 301 or 302.',
    },
    { name: 'active', type: 'checkbox', defaultValue: true, index: true, required: true },
    { name: 'notes', type: 'textarea', access: { read: authenticatedField } },
  ],
  hooks: {
    afterChange: [revalidateRedirects],
    afterDelete: [revalidateRedirectsAfterDelete],
    beforeValidate: [validateAndNormalizeRedirect],
  },
  timestamps: true,
}
