# Reusable Google Reviews UI Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CMS-owned reusable Google Reviews configuration and a lazy, policy-compliant Google Places UI Kit section with a reliable link-only fallback.

**Architecture:** A Payload global stores first-party presentation settings and the editable Place ID. A server component reads those settings; a small client island lazy-loads the official UI Kit using a referrer-restricted public key and never stores Google review content.

**Tech Stack:** Payload CMS 3.89, Next.js 16 App Router, React 19, TypeScript, Vitest, Playwright, Google Maps JavaScript API Places UI Kit.

## Global Constraints

- Never hard-code the Google Place ID.
- Never store the API key in Payload; read only `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
- Never scrape, copy, persist, or schema-mark up Google reviews or ratings.
- Do not add new analytics event names or send reviewer PII.
- Preserve the existing consent, GTM, GA4, Payload cache, and site layout behavior.
- Do not deploy without separate approval.

---

### Task 1: Define and migrate the Google Reviews global

**Files:**
- Create: `src/globals/GoogleReviews.ts`
- Modify: `src/payload.config.ts`
- Modify: `src/payload-types.ts` via `pnpm generate:types`
- Create: `src/migrations/<timestamp>_google_reviews_global.ts`
- Modify: `src/migrations/index.ts`
- Test: `tests/integration/globals.test.ts`
- Test: `tests/unit/google-reviews-settings.test.ts`

**Interfaces:**
- Produces Payload slug `google-reviews` with `enabled`, `placeId`, `heading`, `subheading`, `reviewLimit`, `mapsUrl`, and `writeReviewUrl`.
- Produces `GoogleReview` generated type and a database migration containing configuration only.

- [ ] Write failing collection-contract tests asserting field names, defaults, URL validation, trimmed Place ID, review-limit bounds of 3–5, and authenticated update access.
- [ ] Run `pnpm vitest run tests/unit/google-reviews-settings.test.ts tests/integration/globals.test.ts` and confirm failure because the global is absent.
- [ ] Implement `GoogleReviews` using the existing global access and revalidation patterns; validate only credential-free HTTPS URLs.
- [ ] Register the global, run `pnpm generate:types`, create the migration with `pnpm payload migrate:create google_reviews_global`, and inspect it to ensure no review data or key field exists.
- [ ] Re-run the focused tests and commit only the global, migration, generated type, and tests.

### Task 2: Add a safe settings resolver and cache tag

**Files:**
- Create: `src/lib/googleReviews.ts`
- Modify: `src/lib/cacheTags.ts`
- Modify: `src/utilities/getGlobals.ts`
- Test: `tests/unit/google-reviews-settings.test.ts`
- Test: `tests/unit/cache-tags.test.ts`
- Test: `tests/unit/revalidation.test.ts`

**Interfaces:**
- Produces `resolveGoogleReviewsSettings(value, apiKeyPresent): GoogleReviewsSettings`.
- Produces `GOOGLE_REVIEWS_CACHE_TAG = 'global:google-reviews'` for first-party settings only.
- `GoogleReviewsSettings.mode` is `'fallback' | 'widget'`; widget requires enabled, non-empty Place ID, valid Maps URLs, and a configured public key.

- [ ] Add failing tests for empty Place ID, disabled setting, absent key, unsafe URLs, limit clamping, localized copy, and widget-ready configuration.
- [ ] Run the focused tests and confirm expected failures.
- [ ] Implement the pure resolver and integrate the global with the existing cached-global/revalidation mechanism; do not create a cache for Google Places responses.
- [ ] Re-run focused tests and commit.

### Task 3: Build the lazy official UI Kit component

**Files:**
- Create: `src/components/google-reviews/GooglePlacesWidget.tsx`
- Create: `src/components/google-reviews/google-places.d.ts`
- Create: `src/components/google-reviews/GoogleReviewsSection.tsx`
- Modify: `src/app/(frontend)/globals.css`
- Test: `tests/unit/google-reviews-widget.test.tsx`
- Test: `tests/e2e/google-reviews.spec.ts`

**Interfaces:**
- `GooglePlacesWidget({ apiKey, placeId, reviewLimit, mapsUrl, writeReviewUrl }): JSX.Element`.
- `GoogleReviewsSection({ className? }): Promise<JSX.Element>` reads the reusable global internally.
- The client loader deduplicates a script identified by `data-google-places-ui-kit`, waits for `customElements.whenDefined('gmp-place-details')`, and changes to fallback on script error or timeout.

- [ ] Write failing unit tests proving no script is added before intersection, only one script is added across mounts, the Payload Place ID is passed to the UI Kit request, the API key is never rendered as visible text, and error/timeout retains both fallback links.
- [ ] Write failing browser tests using request interception and a test web-component stub for loading, successful widget, script failure, keyboard navigation to both CTA links, and disabled/empty-Place-ID fallback.
- [ ] Run the focused tests and confirm failure because the components do not exist.
- [ ] Implement the loader with `IntersectionObserver`, a single module-level script promise, cleanup-safe state, a loading skeleton, official `gmp-place-details` content configuration for name/rating/reviews/attribution, and link-only fallback.
- [ ] Add scoped styles for 375–1920 widths, visible focus, Google-content separation, sticky-bar clearance, and review viewport presets derived from `reviewLimit`.
- [ ] Re-run focused tests and commit.

### Task 4: Environment and operational contract

**Files:**
- Modify: `.env.example`
- Modify: `scripts/assert-production-env.mjs`
- Create: `docs/operations/google-reviews-ui-kit.md`
- Test: `tests/unit/environment.test.ts`

**Interfaces:**
- Documents `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` as a browser-visible, HTTP-referrer-restricted key.
- Production environment assertion reports a missing key without printing its value.

- [ ] Add failing tests proving the environment contract names the key, never accepts a Payload key field, and never prints credential values.
- [ ] Run the environment tests and confirm failure.
- [ ] Add the empty example variable, safe validation, Cloud restriction instructions, required API list, Place ID admin workflow, fallback behavior, and a warning that review data must not be cached.
- [ ] Re-run tests, run `git diff --check`, and commit.

### Task 5: Verify the reusable integration

**Files:**
- Test: all files above

- [ ] Run `pnpm lint`.
- [ ] Run `pnpm exec tsc --noEmit --incremental false`.
- [ ] Run `pnpm test:unit` and `pnpm test:integration`.
- [ ] Run the focused Playwright review spec with widget success and failure stubs.
- [ ] Inspect the client build for the literal configured Place ID and confirm none is source-hard-coded; confirm only the public key variable is referenced client-side.
- [ ] Run `git diff --check` and commit any verification-only corrections.

