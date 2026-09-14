import type { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createRedirectResponse } from '@/lib/redirectResponse'

const records = [
  { active: true, destination: '/permanent-target/', id: 1, source: '/permanent/', type: 301 as const },
  { active: true, destination: '/temporary-target/', id: 2, source: '/temporary/', type: 302 as const },
  {
    active: true,
    destination: '/campaign-target/',
    id: 3,
    source: '/legacy/?campaign=fall',
    type: 302 as const,
  },
]

vi.mock('@/utilities/getRedirects', () => ({
  getCachedRedirects: () => async () => records,
}))

describe('redirect response boundary', () => {
  beforeEach(() => vi.resetModules())

  it.each([
    ['/permanent/', 301, 'https://alruknfurniture.ae/permanent-target/'],
    ['/temporary/', 302, 'https://alruknfurniture.ae/temporary-target/'],
  ])('emits the persisted status for %s', (pathname, status, location) => {
    const response = createRedirectResponse(new Request(`https://alruknfurniture.ae${pathname}`), records)
    expect(response?.status).toBe(status)
    expect(response?.headers.get('location')).toBe(location)
  })

  it('matches the full pathname and explicit query at the request boundary only when exact', () => {
    const matching = createRedirectResponse(
      new Request('https://alruknfurniture.ae/legacy/?campaign=fall'),
      records,
    )
    expect(matching?.status).toBe(302)
    expect(matching?.headers.get('location')).toBe('https://alruknfurniture.ae/campaign-target/')

    expect(
      createRedirectResponse(new Request('https://alruknfurniture.ae/legacy/'), records),
    ).toBeUndefined()
    expect(
      createRedirectResponse(
        new Request('https://alruknfurniture.ae/legacy/?campaign=summer'),
        records,
      ),
    ).toBeUndefined()
  })

  it('propagates the full request URL through the actual Next proxy boundary', async () => {
    const { proxy } = await import('@/proxy')

    const matching = await proxy(
      new Request('https://alruknfurniture.ae/legacy/?campaign=fall') as NextRequest,
    )
    expect(matching.status).toBe(302)
    expect(matching.headers.get('location')).toBe('https://alruknfurniture.ae/campaign-target/')

    const queryless = await proxy(new Request('https://alruknfurniture.ae/legacy/') as NextRequest)
    expect(queryless.status).toBe(200)
    expect(queryless.headers.get('location')).toBeNull()
  })
})
