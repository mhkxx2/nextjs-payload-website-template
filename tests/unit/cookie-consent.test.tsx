import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { CookieConsent } from '@/components/CookieConsent'
import { CookieSettingsButton } from '@/components/CookieSettingsButton'
import { CONSENT_STORAGE_KEY } from '@/lib/consent'

class MemoryStorage implements Storage {
  private values = new Map<string, string>()
  get length() { return this.values.size }
  clear() { this.values.clear() }
  getItem(key: string) { return this.values.get(key) ?? null }
  key(index: number) { return [...this.values.keys()][index] ?? null }
  removeItem(key: string) { this.values.delete(key) }
  setItem(key: string, value: string) { this.values.set(key, value) }
}

const readSaved = () => JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? '')
const consentCommands = () => (window.dataLayer ?? []).map((item) =>
  Array.from(item as ArrayLike<unknown>),
)

describe('cookie consent UI', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    })
    window.dataLayer = []
    window.gtag = undefined
  })

  afterEach(() => {
    window.dataLayer = undefined
    window.gtag = undefined
  })

  it('shows the banner for a visitor without a saved choice', async () => {
    render(<CookieConsent />)

    expect(await screen.findByRole('region', { name: 'Cookie consent' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Privacy Policy' }).getAttribute('href')).toBe('/privacy')
  })

  it('keeps the banner hidden for a returning visitor with valid preferences', async () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
      advertising: false,
      analytics: true,
      timestamp: '2026-10-06T18:00:00.000Z',
      version: 1,
    }))

    render(<CookieConsent />)
    await act(async () => undefined)

    expect(screen.queryByRole('region', { name: 'Cookie consent' })).toBeNull()
  })

  it('accepts all, persists both categories, sends one update, and closes the banner', async () => {
    render(<CookieConsent />)
    fireEvent.click(await screen.findByRole('button', { name: 'Accept All' }))

    expect(readSaved()).toEqual(expect.objectContaining({ advertising: true, analytics: true, version: 1 }))
    expect(consentCommands()).toEqual([[
      'consent',
      'update',
      {
        ad_personalization: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        analytics_storage: 'granted',
      },
    ]])
    expect(screen.queryByRole('region', { name: 'Cookie consent' })).toBeNull()
  })

  it('rejects optional cookies, persists denied categories, and closes the banner', async () => {
    render(<CookieConsent />)
    fireEvent.click(await screen.findByRole('button', { name: 'Reject Optional' }))

    expect(readSaved()).toEqual(expect.objectContaining({ advertising: false, analytics: false, version: 1 }))
    expect(consentCommands()[0]).toEqual([
      'consent',
      'update',
      {
        ad_personalization: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        analytics_storage: 'denied',
      },
    ])
    expect(screen.queryByRole('region', { name: 'Cookie consent' })).toBeNull()
  })

  it('opens preferences and saves analytics independently from advertising', async () => {
    render(<CookieConsent />)
    const manage = await screen.findByRole('button', { name: 'Manage Preferences' })
    fireEvent.click(manage)

    expect(screen.getByRole('dialog', { name: 'Cookie preferences' })).toBeDefined()
    expect(screen.getByText('Always Active')).toBeDefined()
    fireEvent.click(screen.getByRole('switch', { name: 'Analytics Cookies' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save Preferences' }))

    expect(readSaved()).toEqual(expect.objectContaining({ advertising: false, analytics: true }))
    expect(consentCommands()[0]).toEqual([
      'consent',
      'update',
      {
        ad_personalization: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        analytics_storage: 'granted',
      },
    ])
  })

  it('allows advertising to be enabled independently and grants every advertising field', async () => {
    render(<CookieConsent />)
    fireEvent.click(await screen.findByRole('button', { name: 'Manage Preferences' }))
    fireEvent.click(screen.getByRole('switch', { name: 'Advertising Cookies' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save Preferences' }))

    expect(readSaved()).toEqual(expect.objectContaining({ advertising: true, analytics: false }))
    expect(consentCommands()[0]).toEqual([
      'consent',
      'update',
      {
        ad_personalization: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        analytics_storage: 'denied',
      },
    ])
  })

  it('reopens stored settings from the footer control', async () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
      advertising: true,
      analytics: false,
      timestamp: '2026-10-06T18:00:00.000Z',
      version: 1,
    }))
    render(<><CookieConsent /><CookieSettingsButton /></>)
    await act(async () => undefined)

    const footerControl = screen.getByRole('button', { name: 'Cookie Settings' })
    fireEvent.click(footerControl)

    expect(screen.getByRole('dialog', { name: 'Cookie preferences' })).toBeDefined()
    expect((screen.getByRole('switch', { name: 'Analytics Cookies' }) as HTMLInputElement).checked).toBe(false)
    expect((screen.getByRole('switch', { name: 'Advertising Cookies' }) as HTMLInputElement).checked).toBe(true)
  })

  it('closes preferences with Escape and restores focus to its trigger', async () => {
    render(<CookieConsent />)
    const manage = await screen.findByRole('button', { name: 'Manage Preferences' })
    manage.focus()
    fireEvent.click(manage)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close cookie preferences' })).toBe(document.activeElement))

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('dialog', { name: 'Cookie preferences' })).toBeNull()
    await waitFor(() => expect(manage).toBe(document.activeElement))
    expect(screen.getByRole('region', { name: 'Cookie consent' })).toBeDefined()
  })
})
