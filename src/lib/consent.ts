export const CONSENT_STORAGE_KEY = 'alrukn_cookie_consent_v1'
export const CONSENT_VERSION = 1
export const CONSENT_PREFERENCES_EVENT = 'alrukn:open-consent-preferences'

export type ConsentChoice = {
  advertising: boolean
  analytics: boolean
}

export type ConsentPreferences = ConsentChoice & {
  timestamp: string
  version: typeof CONSENT_VERSION
}

export type GoogleConsentValue = 'denied' | 'granted'

export type GoogleConsentState = {
  ad_personalization: GoogleConsentValue
  ad_storage: GoogleConsentValue
  ad_user_data: GoogleConsentValue
  analytics_storage: GoogleConsentValue
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export function parseStoredConsent(raw: null | string): ConsentPreferences | null {
  if (!raw) return null

  try {
    const value: unknown = JSON.parse(raw)
    if (
      !isRecord(value) ||
      value.version !== CONSENT_VERSION ||
      typeof value.analytics !== 'boolean' ||
      typeof value.advertising !== 'boolean' ||
      typeof value.timestamp !== 'string' ||
      !Number.isFinite(Date.parse(value.timestamp))
    ) {
      return null
    }

    return {
      advertising: value.advertising,
      analytics: value.analytics,
      timestamp: value.timestamp,
      version: CONSENT_VERSION,
    }
  } catch {
    return null
  }
}

export function getStoredConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null

  try {
    return parseStoredConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY))
  } catch {
    return null
  }
}

export function saveConsent(
  choice: ConsentChoice,
  now: Date = new Date(),
): ConsentPreferences {
  const preferences: ConsentPreferences = {
    advertising: choice.advertising,
    analytics: choice.analytics,
    timestamp: now.toISOString(),
    version: CONSENT_VERSION,
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences))
    } catch {
      // Consent still applies for this page view when storage is unavailable.
    }
  }

  return preferences
}

export function toGoogleConsentState(choice: ConsentChoice | null): GoogleConsentState {
  return {
    ad_personalization: choice?.advertising ? 'granted' : 'denied',
    ad_storage: choice?.advertising ? 'granted' : 'denied',
    ad_user_data: choice?.advertising ? 'granted' : 'denied',
    analytics_storage: choice?.analytics ? 'granted' : 'denied',
  }
}

export function applyGoogleConsent(choice: ConsentChoice): void {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer ?? []
  window.gtag = window.gtag ?? function gtag(..._args: unknown[]) {
    window.dataLayer?.push(arguments)
  }
  window.gtag('consent', 'update', toGoogleConsentState(choice))
}

export function openConsentPreferences(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(CONSENT_PREFERENCES_EVENT))
}

export function buildConsentInitializationScript(): string {
  return `(function(w){w.dataLayer=w.dataLayer||[];w.gtag=w.gtag||function(){w.dataLayer.push(arguments);};var consent={analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};try{var raw=w.localStorage.getItem('${CONSENT_STORAGE_KEY}');var saved=raw?JSON.parse(raw):null;var valid=saved&&saved.version===${CONSENT_VERSION}&&typeof saved.analytics==='boolean'&&typeof saved.advertising==='boolean'&&typeof saved.timestamp==='string'&&Number.isFinite(Date.parse(saved.timestamp));if(valid){consent.analytics_storage=saved.analytics?'granted':'denied';consent.ad_storage=saved.advertising?'granted':'denied';consent.ad_user_data=saved.advertising?'granted':'denied';consent.ad_personalization=saved.advertising?'granted':'denied';}}catch(e){}consent.wait_for_update=500;w.gtag('consent', 'default', consent);})(window);`
}
