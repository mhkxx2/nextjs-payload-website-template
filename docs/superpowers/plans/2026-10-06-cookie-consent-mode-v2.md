# Cookie Consent and Google Consent Mode v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add accessible, persistent cookie preferences and Google Consent Mode v2 without changing or duplicating the existing analytics architecture.

**Architecture:** A pure consent module owns validation, storage, Google mappings, runtime updates, and the early bootstrap string. One root client component owns all consent UI, while the existing analytics component emits the consent default immediately before GTM and the footer exposes a small reopen control.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Testing Library, Playwright, Google Consent Mode v2.

## Global Constraints

- Keep GA4 `G-G3SBEVF77F` exactly once.
- Keep GTM `GTM-TDBXB2JP` exactly once.
- Preserve `whatsapp_click`, `phone_call_click`, and `generate_lead` unchanged and single-fire.
- Keep `src/lib/analytics.ts` as the only custom analytics-event pathway.
- Store preferences only under `alrukn_cookie_consent_v1`, version `1`, with no PII.
- Default all optional Google consent fields to `denied`.
- Do not block GA4/GTM, add a CMP, add a cookie-policy page, deploy, or touch PM2/Nginx/ERP.

---

### Task 1: Consent Domain and Early Bootstrap

**Files:**
- Create: `tests/unit/consent.test.ts`
- Create: `src/lib/consent.ts`
- Modify: `tests/unit/analytics-installation.test.tsx`
- Modify: `src/components/AnalyticsScripts.tsx`

**Interfaces:**
- Produces: `ConsentPreferences`, `GoogleConsentState`, `getStoredConsent()`, `saveConsent()`, `applyGoogleConsent()`, `openConsentPreferences()`, `buildConsentInitializationScript()`.
- Preserves: existing analytics component props, IDs, tag counts, and event pathway.

- [ ] Write tests with literal expected mappings for missing, accepted, rejected, analytics-only, advertising-enabled, valid saved, corrupt, and invalid-version states.
- [ ] Add an installation test that executes or inspects the rendered ordered scripts and proves consent default precedes the existing GTM bootstrap.
- [ ] Run `pnpm vitest run tests/unit/consent.test.ts tests/unit/analytics-installation.test.tsx` and confirm failures are caused by the missing consent module/bootstrap.
- [ ] Implement strict parsing, storage guards, exact Google mappings, update dispatch, preference-open event, and the early bootstrap builder.
- [ ] Insert one `beforeInteractive` consent script before the existing GTM script without changing GA4/GTM identifiers or configuration.
- [ ] Re-run the focused tests and confirm they pass.

### Task 2: Consent UI and Footer Reopen Control

**Files:**
- Create: `tests/unit/cookie-consent.test.tsx`
- Create: `src/components/CookieConsent.tsx`
- Create: `src/components/CookieSettingsButton.tsx`
- Modify: `src/components/Footer/index.tsx`
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `src/app/(frontend)/globals.css`

**Interfaces:**
- Consumes: consent module storage/update/open APIs and existing `FocusTrap`.
- Produces: one root consent UI and one footer reopen button.

- [ ] Write UI tests for first-visit visibility, valid returning-visitor suppression, accept, reject, manage, independent switches, save, footer reopen, Escape, tab containment, and focus restoration.
- [ ] Run `pnpm vitest run tests/unit/cookie-consent.test.tsx` and confirm the missing components produce the expected RED state.
- [ ] Implement the minimal client components and mount `CookieConsent` once in the root providers tree.
- [ ] Add compact responsive styles using existing colors and mobile sticky-bar clearance.
- [ ] Re-run the focused UI tests and the existing navigation/analytics unit tests.

### Task 3: Privacy Disclosure

**Files:**
- Modify: `tests/unit/content-integrity.test.ts`
- Modify: `src/seed/site.ts`

**Interfaces:**
- Preserves: `/privacy/`, existing legal content, CMS structure, and unrelated seed records.
- Produces: a minimal analytics/cookie-preference disclosure in the privacy seed.

- [ ] Add a failing content-integrity assertion for Google Analytics, Google Tag Manager, optional measurement, and changing choices through Cookie Settings.
- [ ] Run the focused test and verify it fails on the missing disclosure.
- [ ] Add the minimal disclosure paragraphs to the existing privacy rich-content block.
- [ ] Re-run the focused test and confirm it passes.

### Task 4: Browser Consent and Analytics Regression Coverage

**Files:**
- Create: `tests/e2e/consent.spec.ts`
- Modify: `playwright.config.ts`
- Modify if necessary: `tests/e2e/analytics.spec.ts`
- Modify: `tests/a11y/homepage.a11y.spec.ts`

**Interfaces:**
- Consumes: rendered consent UI, storage key, `dataLayer`, footer control, existing analytics controls.
- Produces: runtime order/update, responsive, accessibility, and event-regression evidence.

- [ ] Add Playwright storage state for ordinary existing tests so the new first-visit banner cannot obscure unrelated controls; consent-specific tests clear the key before navigation.
- [ ] Add failing browser tests for default-denied-before-GTM, accept/reject/custom updates, restoration, footer reopening, Escape/focus restoration, and one-event analytics behavior after consent changes.
- [ ] Add responsive assertions at 375, 430, 768, and 1440 pixels for visibility, viewport fit, no overflow, and unblocked mobile CTA after a saved choice.
- [ ] Add an axe scan and keyboard test for the preference dialog.
- [ ] Run the focused E2E and accessibility files, address only implementation defects, and retain all existing analytics assertions.

### Task 5: Full Verification and Hygiene

**Files:**
- Inspect all changed files and generated artifacts; do not add reports, screenshots, logs, or temporary scripts.

**Interfaces:**
- Produces: evidence for every acceptance criterion and repository gate.

- [ ] Run `pnpm lint`.
- [ ] Run `pnpm exec tsc --noEmit --incremental false`.
- [ ] Run `pnpm test:unit`.
- [ ] Run `pnpm test:integration`.
- [ ] Run `pnpm test:e2e`.
- [ ] Run `pnpm test:a11y`.
- [ ] Run `pnpm build`.
- [ ] Inspect a production-rendered page and prove the runtime order is dataLayer/consent default, GTM bootstrap, then GA4 initialization, with each installation counted once.
- [ ] Recheck 375, 430, 768, and 1440 pixel browser layouts and unchanged analytics events.
- [ ] Run `git diff --check` and `git status --short`, confirming no accidental artifacts.
