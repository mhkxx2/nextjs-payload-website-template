# Google Analytics 4 and Google Tag Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install one production-only direct GA4 tag and one GTM container, and emit privacy-safe WhatsApp, call, and confirmed-lead events through a shared data layer.

**Architecture:** The root layout renders a focused analytics-script component once. A typed analytics helper owns event normalization and PII-safe allowlisting, while one tracked contact-link client component instruments anchors without blocking navigation. Lead forms call the helper only in their confirmed-success branch.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Payload CMS, Vitest, Testing Library, Playwright.

## Global Constraints

- Direct GA4 ID is `G-G3SBEVF77F`; GTM ID is `GTM-TDBXB2JP`.
- Never configure the GA4 ID inside GTM application code.
- Conversion events use `window.dataLayer.push()` only; never `gtag('event', ...)`.
- Never emit customer PII, messages, or uploaded-file information.
- Emit `generate_lead` only after a successful server response.
- Do not add manual page-view tracking; rely on GA4 Enhanced Measurement history events.
- Do not modify content, design, navigation, Nginx, PM2, or ERP.

---

### Task 1: Typed data-layer contract

**Files:**
- Create: `src/lib/analytics.ts`
- Test: `tests/unit/analytics.test.ts`

**Interfaces:**
- Produces: `pushDataLayerEvent(event: AnalyticsEvent): void`, `trackWhatsAppClick(context)`, `trackPhoneCallClick(context)`, and `trackGenerateLead(context)`.
- Event context accepts only `page_path`, `page_title`, `cta_location`, `service`, `lead_type`, `area`, `portfolio_item`, `project`, `category`, and `link_url`.

- [ ] Write tests that establish a browser `dataLayer`, assert exact normalized event objects, prove empty fields are removed, prove unexpected PII-shaped keys are discarded, and prove server/pre-bootstrap calls do not throw.
- [ ] Run `pnpm vitest run tests/unit/analytics.test.ts` and verify the tests fail because the module does not exist.
- [ ] Implement the smallest typed helper and global Window declaration that satisfies the contract without calling `gtag`.
- [ ] Re-run the focused unit test and verify it passes.

### Task 2: Single production-only script installation

**Files:**
- Create: `src/components/AnalyticsScripts.tsx`
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `.env.example`
- Test: `tests/unit/analytics-installation.test.tsx`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GTM_ID`, with supplied IDs as defaults.
- Produces: one GTM head bootstrap, one direct GA loader/configuration, and one body-first noscript iframe when enabled.

- [ ] Write rendering tests for exact IDs, one occurrence of each integration, body-first noscript placement, and disabled/non-production output.
- [ ] Run the focused test and verify it fails because the component/integration does not exist.
- [ ] Implement the `next/script` component and insert it once in the root layout, with the noscript iframe immediately after `<body>`.
- [ ] Re-run the focused test and verify it passes.

### Task 3: Reusable tracked contact links

**Files:**
- Create: `src/components/TrackedContactLink.tsx`
- Modify: `src/components/WhatsAppAction.tsx`
- Modify: `src/components/Header/index.tsx`
- Modify: `src/components/Header/MobileNav.tsx`
- Modify: `src/components/MobileStickyBar.tsx`
- Modify: `src/components/Footer/index.tsx`
- Modify: `src/components/home/HomepageView.tsx`
- Modify: `src/components/ServicePage.tsx`
- Modify: `src/components/portfolio/PortfolioExplorer.tsx`
- Modify: `src/app/(frontend)/contact/page.tsx`
- Test: `tests/unit/analytics-links.test.tsx`

**Interfaces:**
- Consumes: `eventName`, `href`, and optional allowlisted analytics context.
- Produces: an anchor with unchanged visual/navigation behavior that emits exactly one contact event on click.

- [ ] Write tests for WhatsApp and telephone clicks, link navigation preservation, service/portfolio context, and absence of PII.
- [ ] Run the focused test and verify it fails because the tracked-link component does not exist.
- [ ] Implement the reusable client anchor and replace active genuine WhatsApp/telephone anchors with explicit CTA locations.
- [ ] Re-run focused analytics/link and existing navigation/site-chrome tests.

### Task 4: Success-confirmed lead events

**Files:**
- Modify: `src/components/home/QuoteRequestForm.tsx`
- Modify: `src/blocks/QuoteForm/Component.tsx`
- Modify: `src/components/home/HomepageView.tsx`
- Modify: `src/app/(frontend)/contact/page.tsx`
- Modify: `src/components/ServicePage.tsx`
- Modify: `src/components/portfolio/PortfolioExplorer.tsx`
- Modify: `src/blocks/Form/Component.tsx`
- Test: `tests/unit/analytics-leads.test.tsx`

**Interfaces:**
- `QuoteRequestForm` accepts `leadType` and `formLocation`, plus optional service context.
- Successful quote requests emit one allowlisted `generate_lead`; every failure branch emits none.

- [ ] Write tests for homepage/service/contact success, failed and network responses, portfolio success/failure, generic form success/failure, and PII exclusion.
- [ ] Run focused tests and verify expected failures because success branches are not instrumented.
- [ ] Add one helper call after each successful response and before/reset independent of customer fields.
- [ ] Re-run focused tests and existing quote-request tests.

### Task 5: Route-level and rendered-output verification

**Files:**
- Modify: `tests/e2e/frontend.e2e.spec.ts`
- Modify: `tests/e2e/navigation.spec.ts`
- Modify: `tests/e2e/portfolio.spec.ts`
- Create or modify: `tests/e2e/analytics.spec.ts`

**Interfaces:**
- Consumes: live browser `window.dataLayer` and production-rendered HTML.
- Produces: regression coverage for representative homepage, service, portfolio, projects, contact, and mobile controls.

- [ ] Add Playwright initialization that observes data-layer objects without contacting Google endpoints.
- [ ] Assert one event per representative WhatsApp/call action and success-only lead behavior.
- [ ] Build and inspect rendered production HTML for one GA loader/config, one GTM bootstrap, and one noscript iframe.
- [ ] Confirm no `gtag('event', ...)`, Ads IDs, or PII keys exist in production analytics code.

### Task 6: Complete verification gates

**Files:**
- Verify only; no unrelated changes.

- [ ] Run `pnpm lint`.
- [ ] Run `pnpm exec tsc --noEmit --incremental false`.
- [ ] Run `pnpm test:unit`.
- [ ] Run `pnpm test:integration`.
- [ ] Run `pnpm test:e2e`.
- [ ] Run `pnpm build`.
- [ ] Audit Git status for generated artifacts and confirm PM2 was not restarted.
- [ ] Record remaining GTM custom-event triggers/tags, GA4 Enhanced Measurement verification, Tag Assistant/DebugView work, and future consent/privacy configuration.
