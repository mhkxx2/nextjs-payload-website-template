import { describe, expect, it } from 'vitest'

import { publicationFields } from '@/fields/publication'
import { isPubliclyPublished } from '@/lib/publication'

const now = new Date('2026-09-12T12:00:00.000Z')

describe('publication rules', () => {
  it.each([
    [{ status: 'draft', publishedAt: '2026-09-12T11:00:00.000Z' }, false],
    [{ status: 'published', publishedAt: undefined }, false],
    [{ status: 'published', publishedAt: null }, false],
    [{ status: 'published', publishedAt: '2026-09-12T12:00:00.001Z' }, false],
    [{ status: 'published', publishedAt: 'not-a-date' }, false],
    [{ status: 'published', publishedAt: '2026-09-12T12:00:00.000Z' }, true],
    [{ status: 'published', publishedAt: '2026-09-12T11:59:59.999Z' }, true],
  ] as const)('evaluates fixture %#', (publication, expected) => {
    expect(isPubliclyPublished(publication, now)).toBe(expected)
  })

  it('accepts Date timestamps without mutating the supplied clock', () => {
    const publishedAt = new Date('2026-09-12T11:00:00.000Z')
    expect(isPubliclyPublished({ status: 'published', publishedAt }, now)).toBe(true)
    expect(now.toISOString()).toBe('2026-09-12T12:00:00.000Z')
  })

  it('provides reusable status and timestamp Payload fields', () => {
    expect(publicationFields()).toMatchObject([
      {
        name: 'status',
        type: 'select',
        defaultValue: 'draft',
        index: true,
        required: true,
      },
      {
        name: 'publishedAt',
        type: 'date',
        index: true,
      },
    ])
  })
})
