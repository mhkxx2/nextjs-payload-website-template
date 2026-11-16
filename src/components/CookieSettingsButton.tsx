'use client'

import React from 'react'

import { openConsentPreferences } from '@/lib/consent'

export function CookieSettingsButton() {
  return (
    <button className="cookie-settings-button" onClick={openConsentPreferences} type="button">
      Cookie Settings
    </button>
  )
}
