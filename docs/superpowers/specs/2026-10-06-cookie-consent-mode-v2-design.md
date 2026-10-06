# Cookie Consent and Google Consent Mode v2 Design

## Scope

Add a first-party cookie preference experience and Google Consent Mode v2 to the existing Al Rukn analytics installation. Preserve the single direct GA4 base tag (`G-G3SBEVF77F`), the single GTM container (`GTM-TDBXB2JP`), and the existing `whatsapp_click`, `phone_call_click`, and `generate_lead` event pathway.

The implementation does not block GA4 or GTM. It establishes consent before either tag runs, allowing Google's consent-aware measurement behavior to apply.

## Consent Model

The UI exposes three categories:

- Necessary: always active and not configurable.
- Analytics: controls `analytics_storage`.
- Advertising: controls `ad_storage`, `ad_user_data`, and `ad_personalization` together.

Preferences use one local-storage record:

```json
{
  "version": 1,
  "analytics": false,
  "advertising": false,
  "timestamp": "2026-10-06T18:00:00.000Z"
}
```

The key is `alrukn_cookie_consent_v1`. Only the version, two boolean preferences, and timestamp are stored. Invalid JSON, an unexpected version, invalid fields, or unavailable storage is treated as no saved choice.

## Early Bootstrap

The existing `AnalyticsScripts` component gains one `beforeInteractive` consent script immediately before the existing GTM bootstrap. It initializes `dataLayer` and `gtag`, validates saved consent without depending on React, and pushes:

```js
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
})
```

For a valid returning choice, the same default command reflects the saved granted/denied values before GTM starts. Corrupt or missing state remains denied. GTM then bootstraps once, followed by the existing GA4 loader and base configuration once.

## Central Consent Module

`src/lib/consent.ts` owns:

- constants and strict preference types;
- conversion from category choices to Google consent fields;
- safe stored-preference parsing and validation;
- browser-safe read/write helpers;
- `applyGoogleConsent` for `consent update` commands;
- `openConsentPreferences` using one namespaced DOM event;
- generation of the early initialization script so bootstrap and runtime mappings share one contract.

The existing `src/lib/analytics.ts` remains the only custom analytics-event pathway.

## Consent UI

`CookieConsent` is a client component mounted once in the root layout. Until hydration reads local storage, it renders no banner, avoiding an incorrect returning-visitor flash. With no valid choice it displays a compact bottom banner on desktop and a full-width bottom card on smaller screens.

Actions:

- Accept All: saves both optional categories as enabled, sends one granted update, and closes the UI.
- Reject Optional: saves both optional categories as disabled, sends one denied update, and closes the UI.
- Manage Preferences: opens a dialog with Necessary shown as always active and independent Analytics and Advertising switches.
- Save Preferences: persists the selected combination, sends one exact consent update, and closes the UI.

The preference dialog uses the existing `FocusTrap`, `role="dialog"`, `aria-modal`, labelled controls, Escape handling, a close button, visible focus states, and focus restoration. Closing without saving keeps the banner visible for visitors without a saved choice.

## Footer and Privacy

A small client-side `CookieSettingsButton` is rendered beside the existing legal links. It dispatches the centralized open-preferences event and does not alter CMS navigation data.

The existing privacy seed receives a short disclosure explaining Google Analytics, Google Tag Manager, optional analytics/advertising measurement, and the Cookie Settings control. Unrelated legal content remains unchanged. No separate cookie-policy page is created.

## Styling and Responsive Behavior

Consent styles live with the existing frontend design system in `globals.css`. They reuse ivory, charcoal, muted borders, and the existing gold focus/accent treatment. The banner accounts for the mobile sticky action bar so it does not hide or block call, WhatsApp, or quotation controls. The dialog is scrollable within the viewport and has no horizontal overflow at 375, 430, 768, or 1440 pixels.

## Testing

Tests are written first and observed failing before implementation.

- Unit logic: missing, valid, invalid, and corrupt storage; exact default/update mappings; accept, reject, analytics-only, and advertising states.
- Unit UI: banner visibility, persistence, actions, independent switches, footer reopening, Escape, focus trap, and focus restoration.
- Installation: consent initialization precedes GTM and GA4 without duplicate loaders, configs, containers, page views, or conversion calls.
- Browser: runtime data-layer order and updates, returning visitor behavior, footer reopening, desktop/mobile layouts, overflow, and unchanged single-fire analytics events.
- Repository gates: lint, TypeScript, unit, integration, E2E, accessibility, production build, and `git diff --check`.

## Operational Follow-up

GTM Preview should be used after deployment to confirm all four consent signals before and after each preference combination. Existing custom-event triggers remain required, and no GA4 base tag should be added in GTM. Legal counsel should separately review the final disclosure, retention practices, regional requirements, and whether a dedicated Cookie Policy is needed.
