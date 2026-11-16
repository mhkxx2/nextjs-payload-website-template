import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  CONSENT_STORAGE_KEY,
  applyGoogleConsent,
  buildConsentInitializationScript,
  getStoredConsent,
  parseStoredConsent,
  saveConsent,
  toGoogleConsentState,
} from '@/lib/consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const denied = {
  ad_personalization: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  analytics_storage: 'denied',
}

class MemoryStorage implements Storage {
  private values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

describe('cookie consent domain', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    })
  })

  afterEach(() => {
    window.localStorage.clear()
    window.dataLayer = undefined
    window.gtag = undefined
  })

  it('defaults every optional Google consent signal to denied without a saved choice', () => {
    expect(getStoredConsent()).toBeNull()
    expect(toGoogleConsentState(null)).toEqual(denied)
  })

  it('maps accept all to all granted values and persists only versioned preferences', () => {
    const saved = saveConsent(
      { advertising: true, analytics: true },
      new Date('2026-10-06T18:00:00.000Z'),
    )

    expect(saved).toEqual({
      advertising: true,
      analytics: true,
      timestamp: '2026-10-06T18:00:00.000Z',
      version: 1,
    })
    expect(JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? '')).toEqual(saved)
    expect(toGoogleConsentState(saved)).toEqual({
      ad_personalization: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      analytics_storage: 'granted',
    })
  })

  it('maps reject optional to all denied values', () => {
    expect(toGoogleConsentState({ advertising: false, analytics: false })).toEqual(denied)
  })

  it('grants analytics independently while advertising remains denied', () => {
    expect(toGoogleConsentState({ advertising: false, analytics: true })).toEqual({
      ...denied,
      analytics_storage: 'granted',
    })
  })

  it('grants all advertising fields independently from analytics', () => {
    expect(toGoogleConsentState({ advertising: true, analytics: false })).toEqual({
      ad_personalization: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      analytics_storage: 'denied',
    })
  })

  it('restores a valid versioned stored preference', () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        advertising: false,
        analytics: true,
        timestamp: '2026-10-06T18:00:00.000Z',
        version: 1,
      }),
    )

    expect(getStoredConsent()).toEqual({
      advertising: false,
      analytics: true,
      timestamp: '2026-10-06T18:00:00.000Z',
      version: 1,
    })
  })

  it.each([
    ['corrupt JSON', '{not-json'],
    ['wrong version', JSON.stringify({ advertising: false, analytics: true, timestamp: '2026-10-06T18:00:00.000Z', version: 2 })],
    ['non-boolean category', JSON.stringify({ advertising: 'yes', analytics: true, timestamp: '2026-10-06T18:00:00.000Z', version: 1 })],
    ['invalid timestamp', JSON.stringify({ advertising: false, analytics: true, timestamp: 'later', version: 1 })],
  ])('treats %s as no saved choice and therefore denied', (_label, raw) => {
    expect(parseStoredConsent(raw)).toBeNull()
    window.localStorage.setItem(CONSENT_STORAGE_KEY, raw)
    expect(getStoredConsent()).toBeNull()
    expect(toGoogleConsentState(getStoredConsent())).toEqual(denied)
  })

  it('pushes one standard Google consent update without changing analytics events', () => {
    applyGoogleConsent({ advertising: false, analytics: true })

    expect(window.dataLayer).toHaveLength(1)
    expect(Array.from(window.dataLayer?.[0] as ArrayLike<unknown>)).toEqual([
      'consent',
      'update',
      { ...denied, analytics_storage: 'granted' },
    ])
  })

  it('builds an early bootstrap that restores valid storage before tags execute', () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        advertising: true,
        analytics: false,
        timestamp: '2026-10-06T18:00:00.000Z',
        version: 1,
      }),
    )

    window.eval(buildConsentInitializationScript())

    expect(window.dataLayer).toHaveLength(1)
    expect(Array.from(window.dataLayer?.[0] as ArrayLike<unknown>)).toEqual([
      'consent',
      'default',
      {
        ad_personalization: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        analytics_storage: 'denied',
        wait_for_update: 500,
      },
    ])
  })
})
