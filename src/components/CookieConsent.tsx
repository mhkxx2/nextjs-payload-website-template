'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

import { FocusTrap } from '@/components/FocusTrap'
import {
  CONSENT_PREFERENCES_EVENT,
  applyGoogleConsent,
  getStoredConsent,
  saveConsent,
  type ConsentChoice,
} from '@/lib/consent'

const deniedChoice: ConsentChoice = { advertising: false, analytics: false }
const grantedChoice: ConsentChoice = { advertising: true, analytics: true }
const subscribeToHydration = () => () => undefined

export function CookieConsent() {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false)
  return hydrated ? <HydratedCookieConsent /> : null
}

function HydratedCookieConsent() {
  const [storedChoice] = useState(getStoredConsent)
  const [bannerOpen, setBannerOpen] = useState(!storedChoice)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [choice, setChoice] = useState<ConsentChoice>(storedChoice
    ? { advertising: storedChoice.advertising, analytics: storedChoice.analytics }
    : deniedChoice)

  const openPreferences = useCallback(() => {
    const stored = getStoredConsent()
    setChoice(stored
      ? { advertising: stored.advertising, analytics: stored.analytics }
      : deniedChoice)
    setDialogOpen(true)
  }, [])

  useEffect(() => {
    window.addEventListener(CONSENT_PREFERENCES_EVENT, openPreferences)
    return () => window.removeEventListener(CONSENT_PREFERENCES_EVENT, openPreferences)
  }, [openPreferences])

  useEffect(() => {
    if (!dialogOpen) return
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = previousOverflow
    }
  }, [dialogOpen])

  const commit = (nextChoice: ConsentChoice) => {
    saveConsent(nextChoice)
    applyGoogleConsent(nextChoice)
    setChoice(nextChoice)
    setBannerOpen(false)
    setDialogOpen(false)
  }

  const dialog = dialogOpen ? createPortal(
    <div className="cookie-preferences-backdrop">
      <FocusTrap active onEscape={() => setDialogOpen(false)}>
        <section
          aria-describedby="cookie-preferences-description"
          aria-labelledby="cookie-preferences-title"
          aria-modal="true"
          className="cookie-preferences-dialog"
          role="dialog"
        >
          <header className="cookie-preferences-header">
            <div>
              <p className="cookie-consent-eyebrow">Your privacy choices</p>
              <h2 id="cookie-preferences-title">Cookie preferences</h2>
            </div>
            <button
              aria-label="Close cookie preferences"
              className="cookie-preferences-close"
              onClick={() => setDialogOpen(false)}
              type="button"
            >
              ×
            </button>
          </header>

          <p id="cookie-preferences-description">
            Choose which optional cookies may be used. Necessary cookies remain active so the website can work.
          </p>

          <div className="cookie-preference-list">
            <section className="cookie-preference-row">
              <div>
                <h3>Necessary Cookies</h3>
                <p>Required for essential website functionality.</p>
              </div>
              <span className="cookie-always-active">Always Active</span>
            </section>

            <section className="cookie-preference-row">
              <div>
                <label htmlFor="analytics-cookies">Analytics Cookies</label>
                <p id="analytics-cookies-description">Help us understand website usage and improve the experience.</p>
              </div>
              <input
                aria-describedby="analytics-cookies-description"
                checked={choice.analytics}
                id="analytics-cookies"
                onChange={(event) => setChoice((current) => ({
                  ...current,
                  analytics: event.target.checked,
                }))}
                role="switch"
                type="checkbox"
              />
            </section>

            <section className="cookie-preference-row">
              <div>
                <label htmlFor="advertising-cookies">Advertising Cookies</label>
                <p id="advertising-cookies-description">Allow advertising measurement and personalization signals.</p>
              </div>
              <input
                aria-describedby="advertising-cookies-description"
                checked={choice.advertising}
                id="advertising-cookies"
                onChange={(event) => setChoice((current) => ({
                  ...current,
                  advertising: event.target.checked,
                }))}
                role="switch"
                type="checkbox"
              />
            </section>
          </div>

          <div className="cookie-preferences-actions">
            <button className="button button-primary" onClick={() => commit(choice)} type="button">
              Save Preferences
            </button>
            <button className="button cookie-button-secondary" onClick={() => commit(grantedChoice)} type="button">
              Accept All
            </button>
          </div>
        </section>
      </FocusTrap>
    </div>,
    document.body,
  ) : null

  return (
    <>
      {bannerOpen && (
        <aside
          aria-hidden={dialogOpen || undefined}
          aria-label="Cookie consent"
          className="cookie-consent-banner"
          role="region"
        >
          <div className="cookie-consent-copy">
            <p className="cookie-consent-eyebrow">Cookie preferences</p>
            <p>
              We use cookies to improve your experience, understand website usage and measure advertising performance. You can accept all cookies, reject optional cookies, or manage your preferences.
            </p>
            <Link href="/privacy/">Privacy Policy</Link>
          </div>
          <div className="cookie-consent-actions">
            <button className="button button-primary" onClick={() => commit(grantedChoice)} type="button">
              Accept All
            </button>
            <button className="button cookie-button-secondary" onClick={() => commit(deniedChoice)} type="button">
              Reject Optional
            </button>
            <button className="cookie-manage-button" onClick={openPreferences} type="button">
              Manage Preferences
            </button>
          </div>
        </aside>
      )}
      {dialog}
    </>
  )
}
