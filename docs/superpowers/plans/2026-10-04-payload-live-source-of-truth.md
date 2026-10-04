# Payload Live Source of Truth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make published Payload content update every normal public website surface immediately through tagged caching and targeted revalidation, without a build, restart, or deployment.

**Architecture:** Dedicated Homepage, About Page, Contact Page, and explicit Archive Settings globals own fixed-route copy while existing collections own repeatable content. Public Payload reads use centralized collection/document cache tags outside draft preview; Payload hooks expire those tags immediately and invalidate only affected full-route caches, with deliberately broad on-demand invalidation for Media.

**Tech Stack:** Payload CMS 3.89, Next.js 16.3 App Router, PostgreSQL, React 19, TypeScript, Vitest, Playwright, pnpm.

## Global Constraints

- Do not redesign the site or change any URL.
- Do not modify Nginx, PM2, ERP, or infrastructure.
- Do not rerun broad seeds, rerun the ECO import, delete media, or overwrite existing production content.
- The migration must be additive and production-safe, with no destructive drops or conversions.
- Preserve `_status = published`, `status = published`, and `publishedAt <= now` public filtering.
- Save Draft must not change public output; Publish must update public output.
- Keep current copy as emergency fallback until the corresponding CMS values are populated and verified.
- Use `revalidateTag(tag, { expire: 0 })` for Payload-originated immediate invalidation.
- Preserve all pre-existing dirty-worktree changes not owned by this task.

## File structure

- `src/lib/cacheTags.ts`: the only cache-tag naming API.
- `src/lib/cacheInvalidation.ts`: safe immediate tag/path invalidation helpers.
- `src/lib/publicQueries.ts`: draft-aware cached public collection queries.
- `src/utilities/getGlobals.ts`: draft-aware cached public global queries.
- `src/hooks/revalidateContent.ts`: collection-to-route invalidation map.
- `src/hooks/revalidatePortfolio.ts`: PortfolioItem publication invalidation.
- `src/hooks/revalidateMedia.ts`: broad media dependency invalidation.
- `src/globals/AboutPage.ts`: About route content schema.
- `src/globals/ContactPage.ts`: Contact route presentation schema.
- `src/globals/ArchiveSettings.ts`: explicit archive groups and SEO/CTA schemas.
- `src/globals/Homepage.ts`: expanded homepage labels/fallback fields.
- `src/globals/hooks/revalidateGlobalContent.ts`: global-to-route invalidation map.
- `src/fields/archiveContent.ts`: reusable named CTA and archive SEO field factories.
- `src/data/cmsFallbacks.ts`: emergency-only defaults copied from current production copy.
- `scripts/populate-live-content-globals.ts`: idempotent, new-fields-only population.
- `tests/unit/cache-tags.test.ts`: cache key/tag contract.
- `tests/unit/revalidation.test.ts`: immediate tag/path mapping.
- `tests/integration/live-content-globals.test.ts`: schema and draft coverage.
- `tests/integration/public-query-cache.test.ts`: publication and cache registration.
- `tests/e2e/cms-live-content.spec.ts`: browser-visible CMS ownership checks.

---

### Task 1: Central cache contract and immediate invalidation

**Files:**
- Modify: `src/lib/cacheTags.ts`
- Create: `src/lib/cacheInvalidation.ts`
- Test: `tests/unit/cache-tags.test.ts`
- Test: `tests/unit/revalidation.test.ts`

**Interfaces:**
- Produces: `globalTag(slug)`, `collectionTag(slug)`, `documentTag(collection, slug)`, `LAYOUT_TAG`, `METADATA_TAG`, `HOMEPAGE_TAG`, `MEDIA_DEPENDENCY_TAGS`.
- Produces: `expireTag(req, tag)` and `expirePath(req, path, type?)` that tolerate only the known missing-static-store case.

- [ ] **Step 1: Write failing cache-tag tests**

```ts
expect(globalTag('site-settings')).toBe('global:site-settings')
expect(collectionTag('services')).toBe('collection:services')
expect(documentTag('services', 'sofa-upholstery')).toBe('document:services:sofa-upholstery')
expect(new Set(MEDIA_DEPENDENCY_TAGS)).toContain(collectionTag('portfolio-items'))
```

- [ ] **Step 2: Write failing immediate-invalidation tests**

Mock `next/cache`, call `expireTag(req, 'collection:services')`, and assert:

```ts
expect(revalidateTag).toHaveBeenCalledWith('collection:services', { expire: 0 })
```

Also assert unexpected errors are thrown and only `static generation store missing` is logged and suppressed.

- [ ] **Step 3: Run the focused tests and confirm RED**

Run: `pnpm vitest run tests/unit/cache-tags.test.ts tests/unit/revalidation.test.ts`

Expected: FAIL because the constructors and helpers do not exist.

- [ ] **Step 4: Implement the centralized APIs**

```ts
export const globalTag = (slug: string) => `global:${slug}` as const
export const collectionTag = (slug: string) => `collection:${slug}` as const
export const documentTag = (collection: string, slug: string) =>
  `document:${collection}:${slug}` as const
export const LAYOUT_TAG = 'global:layout'
export const METADATA_TAG = 'global:metadata'
export const HOMEPAGE_TAG = 'global:homepage-route'
```

`expireTag` must call `revalidateTag(tag, { expire: 0 })`; `expirePath` must call `revalidatePath(path, type)` only when a type is supplied.

- [ ] **Step 5: Run focused tests and confirm GREEN**

Run: `pnpm vitest run tests/unit/cache-tags.test.ts tests/unit/revalidation.test.ts`

Expected: PASS.

### Task 2: Cache public Payload reads with preview bypass

**Files:**
- Modify: `src/lib/publicQueries.ts`
- Modify: `src/utilities/getGlobals.ts`
- Modify: `src/lib/homepage.ts`
- Test: `tests/integration/public-query-cache.test.ts`
- Modify: `tests/unit/get-globals.test.ts`

**Interfaces:**
- Consumes: Task 1 tag constructors.
- Produces: unchanged `queryPublicList<T>()`, `queryPublicDocBySlug<T>()`, and `getCachedGlobal()` call signatures.

- [ ] **Step 1: Add failing query-cache tests**

Mock `unstable_cache` as a recording wrapper. Assert a public list registers `collectionTag('services')`, a slug lookup registers both collection and document tags, and draft mode invokes the uncached runner without constructing a persistent cache entry.

```ts
expect(cacheRegistrations).toContainEqual(
  expect.objectContaining({ tags: ['collection:services'] }),
)
expect(cacheRegistrations).toContainEqual(
  expect.objectContaining({ tags: ['collection:services', 'document:services:sofa-upholstery'] }),
)
```

- [ ] **Step 2: Run query tests and confirm RED**

Run: `pnpm vitest run tests/integration/public-query-cache.test.ts tests/unit/get-globals.test.ts`

Expected: FAIL because collection/document reads are not tagged with the centralized tags.

- [ ] **Step 3: Implement normalized cached public runners**

Create stable cache keys from `collection`, `depth`, `limit`, `page`, `sort`, and a recursively key-sorted `where`. Public mode uses `unstable_cache`; preview mode calls `runQuery` directly. Keep the existing publication predicate and post-filter intact.

Global reads use `globalTag(slug)`, plus `collectionTag('services')` for Header/Footer service relationships, and accept a preview bypass without changing current callers.

- [ ] **Step 4: Run query and publication tests**

Run: `pnpm vitest run tests/integration/public-query-cache.test.ts tests/integration/publication.test.ts tests/unit/get-globals.test.ts tests/unit/publication.test.ts`

Expected: PASS, including draft/scheduled exclusions.

### Task 3: Add explicit fixed-route globals and service presentation fields

**Files:**
- Create: `src/fields/archiveContent.ts`
- Create: `src/globals/AboutPage.ts`
- Create: `src/globals/ContactPage.ts`
- Create: `src/globals/ArchiveSettings.ts`
- Modify: `src/globals/Homepage.ts`
- Modify: `src/collections/Services.ts`
- Modify: `src/payload.config.ts`
- Test: `tests/integration/live-content-globals.test.ts`
- Modify: `tests/integration/globals.test.ts`
- Modify: `tests/integration/content-collections.test.ts`

**Interfaces:**
- Produces globals `about-page`, `contact-page`, and `archive-settings`.
- `archive-settings` contains exact groups `servicesArchive`, `projectsArchive`, `blogArchive`, and `portfolioArchive`.
- Each archive group exposes explicit `heading`, `introduction`, `emptyState`, `cta`, and `seo`; Portfolio also exposes `hero`, `filterLabels`, and `supportingLabels`.

- [ ] **Step 1: Write failing schema tests**

Inspect Payload configs and assert the exact slugs and field names:

```ts
expect(globalSlugs).toEqual(expect.arrayContaining(['homepage', 'about-page', 'contact-page', 'archive-settings']))
expect(fieldNames(ArchiveSettings)).toEqual(
  expect.arrayContaining(['servicesArchive', 'projectsArchive', 'blogArchive', 'portfolioArchive']),
)
expect(groupNames(ArchiveSettings, 'portfolioArchive')).toEqual(
  expect.arrayContaining(['heading', 'introduction', 'emptyState', 'cta', 'seo', 'hero', 'filterLabels', 'supportingLabels']),
)
```

Assert all four globals support drafts and all newly populated text fields are optional during the additive rollout.

- [ ] **Step 2: Run schema tests and confirm RED**

Run: `pnpm vitest run tests/integration/live-content-globals.test.ts tests/integration/globals.test.ts tests/integration/content-collections.test.ts`

Expected: FAIL for missing globals and service presentation fields.

- [ ] **Step 3: Implement field factories and globals**

Use editor-facing labels and explicit field names. CTA groups contain `heading`, `description`, `primaryLabel`, `primaryDestination`, `whatsAppLabel`; SEO groups contain `title`, `description`, and `image`. About and Contact schemas mirror the current rendered sections without introducing free-form layout builders.

Expand Homepage with explicit action labels, service card link label, projects link label, area group labels, FAQ labels, final CTA eyebrow, and quote-form labels currently sourced from code.

Add `presentationLabels` to Services for service-options, benefits, materials, process, gallery, areas, related-services, FAQ, and CTA section labels.

- [ ] **Step 4: Register globals and run schema tests**

Run: `pnpm vitest run tests/integration/live-content-globals.test.ts tests/integration/globals.test.ts tests/integration/content-collections.test.ts`

Expected: PASS.

### Task 4: Expand revalidation hooks and collection coverage

**Files:**
- Create: `src/globals/hooks/revalidateGlobalContent.ts`
- Modify: `src/globals/shared.ts`
- Modify: `src/Header/hooks/revalidateHeader.ts`
- Modify: `src/Footer/hooks/revalidateFooter.ts`
- Modify: `src/globals/hooks/revalidateSiteSettings.ts`
- Modify: `src/hooks/revalidateContent.ts`
- Create: `src/hooks/revalidatePortfolio.ts`
- Create: `src/hooks/revalidateMedia.ts`
- Modify: `src/collections/PortfolioItems.ts`
- Modify: `src/collections/Media.ts`
- Test: `tests/unit/revalidation.test.ts`

**Interfaces:**
- Consumes: Task 1 invalidation helpers.
- Produces hooks for globals, public content, PortfolioItems, and Media.

- [ ] **Step 1: Add failing route-mapping tests**

Assert publish/unpublish/delete behavior and these minimum paths:

```ts
expect(pathsFor('homepage')).toContain('/')
expect(pathsFor('about-page')).toContain('/about-us/')
expect(pathsFor('contact-page')).toContain('/contact/')
expect(pathsFor('portfolio-items')).toContain('/portfolio/')
expect(pathsFor('services')).toEqual(expect.arrayContaining(['/', '/services/', '/sofa-upholstery/']))
expect(pathsFor('projects')).toEqual(expect.arrayContaining(['/', '/projects/']))
```

Assert Header/Footer/Site Settings/Contact Information/SEO Defaults invalidate the root layout where required. Assert Areas/FAQs/Testimonials always invalidate `/` when current or previous state is public. Assert draft-only changes do not schedule public route invalidation.

- [ ] **Step 2: Run hook tests and confirm RED**

Run: `pnpm vitest run tests/unit/revalidation.test.ts`

Expected: FAIL for missing Portfolio/Media hooks and incomplete route mappings.

- [ ] **Step 3: Implement global and collection route maps**

Replace raw tag strings with constructors. Preserve old/new slug invalidation. Include archive indexes, sitemap, related records, and homepage consumers. Use immediate expiry for every tag.

- [ ] **Step 4: Implement broad media dependency invalidation**

On Media update/delete, expire `MEDIA_DEPENDENCY_TAGS`, all content collection tags, all content global tags, and invalidate `revalidatePath('/', 'layout')`. This runs on demand only and guarantees populated media relationships refresh.

- [ ] **Step 5: Run hook tests and confirm GREEN**

Run: `pnpm vitest run tests/unit/revalidation.test.ts tests/unit/sitemap-cache.test.ts`

Expected: PASS.

### Task 5: Wire fixed routes to CMS values with emergency fallbacks

**Files:**
- Create: `src/data/cmsFallbacks.ts`
- Modify: `src/components/home/HomepageView.tsx`
- Modify: `src/components/home/QuoteRequestForm.tsx`
- Modify: `src/components/ServicePage.tsx`
- Modify: `src/app/(frontend)/page.tsx`
- Modify: `src/app/(frontend)/about-us/page.tsx`
- Modify: `src/app/(frontend)/contact/page.tsx`
- Modify: `src/app/(frontend)/services/page.tsx`
- Modify: `src/app/(frontend)/projects/page.tsx`
- Modify: `src/app/(frontend)/projects/[slug]/page.tsx`
- Modify: `src/app/(frontend)/blog/page.tsx`
- Modify: `src/app/(frontend)/blog/page/[pageNumber]/page.tsx`
- Modify: `src/app/(frontend)/portfolio/page.tsx`
- Modify: `src/lib/seo.ts`
- Test: `tests/unit/content-integrity.test.ts`
- Test: `tests/unit/site-chrome-cms.test.tsx`
- Test: `tests/e2e/cms-live-content.spec.ts`

**Interfaces:**
- Consumes: new globals and existing collection records.
- Produces unchanged public URLs and visual structure, with CMS value first and `cmsFallbacks` only when a new field is empty.

- [ ] **Step 1: Write failing ownership tests**

Assert production route/component files no longer import `@/data/homepage` or `@/data/launch-copy` for visible runtime copy. Assert About, Contact, archive metadata, CTAs, Homepage labels, and service presentation labels read named CMS properties.

- [ ] **Step 2: Run ownership tests and confirm RED**

Run: `pnpm vitest run tests/unit/content-integrity.test.ts tests/unit/site-chrome-cms.test.tsx`

Expected: FAIL on current runtime constant imports.

- [ ] **Step 3: Add global reads and CMS-first rendering**

Read `about-page`, `contact-page`, and `archive-settings` through `getCachedGlobal`. Pass live Services to quote forms rather than using `SERVICE_LINKS`. Keep fixed route construction in code. Convert current copy constants into one explicitly named emergency fallback module.

- [ ] **Step 4: Move metadata to archive/page globals**

Every affected `generateMetadata()` reads the same CMS global as the page and passes its `seo` group into `buildMetadata`. Keep canonical paths code-owned.

- [ ] **Step 5: Run unit and focused browser tests**

Run: `pnpm vitest run tests/unit/content-integrity.test.ts tests/unit/site-chrome-cms.test.tsx tests/unit/seo.test.ts`

Expected: PASS.

### Task 6: Generate and inspect the additive migration

**Files:**
- Create: `src/migrations/20261004_070000_live_content_globals.ts`
- Create: `src/migrations/20261004_070000_live_content_globals.json`
- Modify: `src/migrations/index.ts`
- Modify: `src/payload-types.ts`
- Create: `scripts/populate-live-content-globals.ts`
- Test: `tests/integration/live-content-globals.test.ts`

**Interfaces:**
- Population script updates only absent values in the new fields and reports skipped existing values.

- [ ] **Step 1: Generate Payload types**

Run: `pnpm generate:types`

Expected: generated types contain `about-page`, `contact-page`, `archive-settings`, expanded Homepage, and Service presentation labels.

- [ ] **Step 2: Generate the migration**

Run: `pnpm payload migrate:create live_content_globals`, then retain the generated SQL under the reviewed name `20261004_070000_live_content_globals` and update its index registration to the same name.

Expected: one new timestamped migration plus index registration.

- [ ] **Step 3: Reject destructive SQL**

Run:

```bash
rg -n -i 'drop table|drop column|truncate|delete from|alter column.*type' src/migrations/20261004_070000_live_content_globals.ts
```

Expected: no matches. Enum additions and new table/column creation are permitted.

- [ ] **Step 4: Implement idempotent population**

The script reads every target global/service first, recursively merges only `null`, `undefined`, empty-string, or missing new fields, and writes with `context: { disableRevalidate: true }`. It must refuse to run unless `NODE_ENV=production` and an explicit `--confirm-new-fields-only` argument are present.

- [ ] **Step 5: Typecheck migration and script**

Run: `pnpm exec tsc --noEmit --incremental false`

Expected: PASS.

### Task 7: Apply migration and populate production safely

**Files:**
- No additional source files.

- [ ] **Step 1: Check migration status**

Run: `pnpm payload migrate:status`

Expected: only the new live-content migration is pending.

- [ ] **Step 2: Apply the additive migration**

Run: `pnpm payload migrate`

Expected: migration succeeds with existing records preserved.

- [ ] **Step 3: Populate new empty fields**

Run: `NODE_ENV=production pnpm exec tsx scripts/populate-live-content-globals.ts --confirm-new-fields-only`

Expected: report distinguishes populated fields from preserved non-empty fields; no broad seed runs.

- [ ] **Step 4: Read back CMS values**

Use Payload local API to compare About, Contact, Archive Settings, Homepage additions, and all nine Service presentation groups with their intended current copy.

Expected: new values are present and pre-existing editor fields are unchanged.

### Task 8: Full automated verification

**Files:**
- Modify only failing tests or owned implementation files when a verified defect is found.

- [ ] **Step 1: Generate derived artifacts**

Run: `pnpm generate:types && pnpm generate:importmap`

- [ ] **Step 2: Run static checks**

Run: `pnpm lint`

Run: `pnpm exec tsc --noEmit --incremental false`

- [ ] **Step 3: Run automated tests**

Run: `pnpm test:unit`

Run: `pnpm test:integration`

Run: `pnpm test:e2e`

- [ ] **Step 4: Build production output**

Run: `pnpm build`

Expected: all commands exit zero.

### Task 9: Reversible no-redeploy production proof

**Files:**
- Create temporary test evidence only under `/tmp`; do not commit credentials or production response bodies.

- [ ] **Step 1: Capture original values and public evidence**

Through authenticated Payload local API, capture exact original values for Homepage text, Header label, Footer label, About text, Contact text, one Service field, one Portfolio title, Projects empty state, Archive SEO, CTA copy, logo, and favicon.

- [ ] **Step 2: Publish reversible text changes one at a time**

For each surface, append a unique harmless marker, publish, refresh the relevant public URL, and assert the marker appears without running build, PM2, or deploy commands.

- [ ] **Step 3: Verify logo and favicon invalidation**

Temporarily select an existing safe Media record, publish Site Settings, and verify Header/Footer image markup and `<link rel="icon">` change. Restore the original relationships immediately and verify restoration.

- [ ] **Step 4: Verify collection behavior**

Publish/restore one Service field and one Portfolio title. Confirm `/sofa-upholstery/` and `/portfolio/` update. Confirm Projects still shows the CMS-controlled empty state when no public projects exist.

- [ ] **Step 5: Verify draft isolation**

Save a draft marker without publishing in a draft-enabled global and Service record. Confirm public HTML does not contain it; confirm preview does; discard or restore the draft.

- [ ] **Step 6: Restore every original value**

Publish the exact captured originals and verify all markers are absent from public HTML.

- [ ] **Step 7: Record timing and process invariants**

Record first-refresh/second-refresh visibility time, PM2 process start time before/after, and confirm no `pnpm build`, `pm2 restart`, or deployment occurred between edit and public verification.

### Task 10: Final safety review and report

**Files:**
- Modify: `docs/operations/payload-live-content-verification-2026-10-04.md`

- [ ] **Step 1: Inspect the final diff**

Run: `git diff --check` and `git status --short`.

Confirm no `.env`, credentials, temporary markers, media deletions, broad seed calls, infrastructure files, or unrelated dirty changes were included.

- [ ] **Step 2: Write the verification report**

Document fields/globals, migration name, removed runtime dependencies, cache tags, hook-to-route mapping, production update evidence, draft behavior, full command results, and remaining non-blocking issues.

- [ ] **Step 3: Run final focused smoke checks**

Request `/`, `/about-us/`, `/contact/`, `/services/`, all nine service routes, `/projects/`, `/portfolio/`, `/blog/`, and representative metadata/icon markup.

Expected: successful responses, original production copy restored, and no stale test markers.
