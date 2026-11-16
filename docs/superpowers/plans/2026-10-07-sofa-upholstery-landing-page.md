# Sofa Upholstery Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, truthful, CMS-managed Sofa Upholstery landing page optimized for Google Ads, organic search, accessibility, and mobile conversion.

**Architecture:** Preserve the shared Service record and generic service renderer for all other routes. Add a sofa-only optional CMS group and dedicated renderer composed from focused server sections plus two client islands: the gallery lightbox and approved reusable Google Reviews UI Kit section.

**Tech Stack:** Next.js 16 App Router, React 19, Payload CMS 3.89, TypeScript, Tailwind/global CSS, Vitest, Playwright.

## Global Constraints

- Use the approved design document at `docs/superpowers/specs/2026-10-07-sofa-upholstery-google-reviews-design.md`.
- Do not copy competitor text, design, claims, images, ratings, or reviews.
- Do not publish `/bed-upholstery/`; its cards are non-link coming-soon elements.
- Do not invent prices, discounts, counts, years, warranties, turnaround times, delivery claims, or a Dubai workshop.
- Preserve `whatsapp_click`, `phone_call_click`, and `generate_lead` with `service = sofa-upholstery`.
- Do not emit AggregateRating or Review schema.
- Do not deploy without separate approval.

---

### Task 1: Add the sofa-only CMS presentation model

**Files:**
- Modify: `src/collections/Services.ts`
- Modify: `src/payload-types.ts` via `pnpm generate:types`
- Create: `src/migrations/<timestamp>_sofa_upholstery_landing.ts`
- Modify: `src/migrations/index.ts`
- Test: `tests/integration/content-collections.test.ts`
- Test: `tests/unit/sofa-upholstery-content.test.ts`

**Interfaces:**
- Produces optional `service.sofaUpholsteryLanding` with `popularServices`, `fabricCards`, `foamComfort`, and `bedUpholsteryTeaser`.
- Service cards accept optional internal `href`; coming-soon items must have no href.

- [ ] Write failing tests for the sofa-only admin condition, exact field contract, required image alt through Media, coming-soon link suppression, and array limits.
- [ ] Run focused tests and confirm failure.
- [ ] Add the optional group without changing existing field semantics, generate types, create/inspect the migration, and re-run tests.
- [ ] Commit the schema, migration, types, and tests.

### Task 2: Build the route-specific server renderer

**Files:**
- Create: `src/components/sofa-upholstery/SofaUpholsteryPage.tsx`
- Create: `src/components/sofa-upholstery/SofaServiceCards.tsx`
- Create: `src/components/sofa-upholstery/FabricGuide.tsx`
- Create: `src/components/sofa-upholstery/FoamComfort.tsx`
- Create: `src/components/sofa-upholstery/RelatedServiceCards.tsx`
- Modify: `src/app/(frontend)/(services)/sofa-upholstery/page.tsx`
- Modify: `src/app/(frontend)/globals.css`
- Test: `tests/unit/sofa-upholstery-page.test.tsx`

**Interfaces:**
- `SofaUpholsteryPage()` queries the existing published service once and renders the approved section sequence.
- Generic `ServicePage` remains untouched for every other fixed service route.

- [ ] Write failing renderer tests for one H1, three hero contact actions, four trust items, nine service cards, unlinked bed teaser, six fabric cards, foam CTA, repair link, four process steps, verified benefits, reusable review section, five related cards, thirteen FAQs, and quote form.
- [ ] Run focused tests and confirm failure.
- [ ] Implement semantic server sections from Payload data, reuse existing tracked contact components and quote form, and add only scoped sofa-page styles.
- [ ] Re-run tests and commit.

### Task 3: Add an accessible gallery lightbox

**Files:**
- Create: `src/components/sofa-upholstery/SofaGallery.tsx`
- Modify: `src/app/(frontend)/globals.css`
- Test: `tests/unit/sofa-gallery.test.tsx`
- Test: `tests/e2e/sofa-upholstery.spec.ts`

**Interfaces:**
- `SofaGallery({ heading, intro, items }): JSX.Element`, where every item has stable id, Media URL, width, height, alt, and optional caption.

- [ ] Write failing tests for 8–16 rendered images, non-empty alt text, reserved dimensions, button triggers, dialog semantics, Escape, arrow keys, focus trap, focus restoration, swipe navigation, and body-overflow cleanup.
- [ ] Run focused tests and confirm failure.
- [ ] Implement the client island by adapting the existing portfolio interaction pattern without importing a carousel library.
- [ ] Add responsive masonry-like grid geometry that preserves aspect ratios and does not preload below-fold images.
- [ ] Re-run tests and commit.

### Task 4: Populate truthful content and owned media references

**Files:**
- Modify: `src/seed/serviceEnhancements.ts`
- Modify: `src/seed/services.ts`
- Modify: `src/seed/media-manifest.json` only if new local derivatives are required
- Create: `docs/operations/sofa-upholstery-media-register.md`
- Test: `tests/unit/content-integrity.test.ts`
- Test: `tests/integration/seed.test.ts`

**Interfaces:**
- Produces the approved copy, card content, 8–16 gallery relations, six fabric entries, thirteen FAQs, four real related routes, and one unlinked bed teaser.

- [ ] Write failing integrity tests for exact hero intent, Ajman workshop wording, prohibited-claim absence, gallery count and alt text, image provenance, no before/after section, no `/bed-upholstery/` href, related routes, FAQ coverage, and quote instructions.
- [ ] Run focused tests and confirm failure.
- [ ] Select suitable existing Al Rukn/Payload assets first and approved Eco-owned catalogue assets second; document each chosen source and label catalogue/inspiration imagery honestly.
- [ ] Populate the seed/bootstrap contract without mutating production Payload during development.
- [ ] Re-run tests and commit.

### Task 5: Lock SEO, canonical, schema, and analytics

**Files:**
- Modify: `src/app/(frontend)/(services)/sofa-upholstery/page.tsx`
- Modify: `src/lib/schema.ts` only if current helpers cannot express the visible content
- Test: `tests/unit/seo.test.ts`
- Test: `tests/unit/schema.test.ts`
- Test: `tests/e2e/seo.spec.ts`
- Test: `tests/e2e/analytics.spec.ts`

**Interfaces:**
- Produces absolute title `Sofa Upholstery Dubai | Reupholstery & Sofa Repair | Al Rukn` and the approved description/canonical.
- Emits Service, BreadcrumbList, and FAQPage only.

- [ ] Write failing tests for title, description, canonical, one H1, heading hierarchy, matching visible FAQ schema, absence of rating/review/product/offer schema, and analytics context.
- [ ] Run focused tests and confirm failure.
- [ ] Implement an absolute route metadata title sourced through the Sofa Upholstery CMS record, retain shared canonical validation, and keep schema limited to truthful visible entities.
- [ ] Re-run tests and commit.

### Task 6: Full responsive, accessibility, performance, and build verification

**Files:**
- Modify tests or scoped styles only for defects found during verification.

- [ ] Work from an isolated copy/worktree; confirm the production PM2 process does not use its `.next` directory.
- [ ] Run `pnpm lint`.
- [ ] Run `pnpm exec tsc --noEmit --incremental false`.
- [ ] Run `pnpm test:unit`.
- [ ] Run `pnpm test:integration`.
- [ ] Run `pnpm test:e2e`.
- [ ] Run `pnpm test:a11y`.
- [ ] Run `pnpm build`.
- [ ] Run `git diff --check`.
- [ ] Run live-equivalent Playwright QA at 375, 430, 768, 1024, 1440, and 1920 pixels for hero, service cards, gallery/lightbox, fabrics, foam, comparison, process, reviews success/fallback, related services, areas, FAQs, quote form, header, mobile navigation, sticky CTA, footer, and cookie consent.
- [ ] Verify no overflow, broken assets, console errors, hydration errors, duplicate GA4/GTM loads, duplicate events, review-data persistence, leaked unrestricted key, or published Bed Upholstery route.
- [ ] Capture representative screenshots and a machine-readable QA report; commit verification corrections only.

