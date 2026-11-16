# Task 6 Report — Services, Projects, Posts, and Pages

Date: 2026-09-13
Worktree: `/www/wwwroot/alruknfurniture-next/.worktrees/al-rukn-implementation`
Branch: `feature/al-rukn-implementation`
Starting commit: `ab6bcae9fdb681ecdf038fbf1efa5e26009353c4`
Task 6 commit: `908f03a`

## Scope delivered

- Added first-class Payload collections for `services` and `projects`.
- Replaced the template-resolved Pages and Posts configuration with Task 6 collection contracts while retaining the existing approved page and post block sets and frontend compatibility fields.
- Registered Services and Projects without replacing Users, Media, Categories, plugin collections, or Header/Footer globals.
- Added shared publication-state access, schedule validation, drafts/revisions, preview URLs, audit ownership, timestamps, and shared SEO fields across all four content collections.
- Added centralized `revalidateContent(args): Promise<void>` handling published changes, slug changes, unpublishes, deletes, listing routes, featured homepage changes, related public records, and the `sitemap` tag.
- Regenerated `src/payload-types.ts` and updated the repository-owned homepage fallback for the new required Page publication/SEO contract.

## Strict TDD evidence

### Baseline

Before Task 6 production changes:

- `pnpm test:unit` — PASS, 8 files / 127 tests.
- `pnpm test:integration -- tests/integration/core-collections.test.ts tests/integration/media.test.ts` — PASS, 3 files / 17 tests.

### RED

The two Task 6 integration suites were created and run before Task 6 collection/hook implementation.

Initial RED command:

```bash
pnpm test:integration -- tests/integration/content-collections.test.ts tests/integration/publication.test.ts
```

Observed failures:

- `tests/integration/publication.test.ts` could not import the intentionally absent `@/hooks/revalidateContent` module.
- The content suite exposed PostgreSQL's 63-byte identifier truncation because its initial suite label made the generated isolated schema name collide; the suite labels were shortened while retaining the disposable-schema harness.
- Result: 2 failed / 3 passed files; 17 passed and 6 skipped tests.

A later hardening test changed the published-delete relationship expectation to require public-predicate lookups even for populated relationship objects. It failed as expected with `find` called 0 rather than 2 times. The hook was then changed to resolve populated IDs through filtered lookups.

### GREEN

Required command:

```bash
pnpm payload:generate-types && pnpm test:integration -- tests/integration/content-collections.test.ts tests/integration/publication.test.ts && pnpm typecheck
```

Result: PASS.

- Generated Payload types successfully.
- Integration: 5 files / 30 tests passed. The repository script runs the entire integration directory in addition to the named Task 6 files.
- TypeScript: PASS (`tsc --noEmit`).

Focused Task 6 runs also passed:

- `pnpm exec vitest run tests/integration/content-collections.test.ts` — 1 file / 6 tests.
- `pnpm exec vitest run tests/integration/publication.test.ts` — 1 file / 7 tests.

## Collection contracts

### Services

- Uses the authoritative nine `FIXED_SERVICE_SLUGS` only.
- Normalizes fixed slugs and retains the shared application's duplicate check plus indexed unique database column.
- Models summary, hero, details, benefits, materials/capabilities, process, service areas, gallery, quotation/WhatsApp context, project and related-service relationships, publication, SEO, and audit fields.
- FAQ and testimonial IDs are held in explicit JSON reference fields until Task 7 introduces and registers those target collections; declaring an unregistered Payload `relationship` target would make Task 6 configuration invalid.

### Projects

- Models title/slug/summary, cover/gallery, service/category, UAE location, completion details, narrative blocks, challenge/solution, featured state, publication, SEO, preview, revisions, and audit ownership.

### Posts

- Models excerpt, existing `heroImage`, authors, categories, services, related posts, article content, publication, SEO, preview, revisions, and audit ownership.
- Preserves the approved Lexical block set exactly: `banner`, `code`, and `mediaBlock`.
- Retains the existing `meta` and `populatedAuthors` compatibility shape used by the current frontend; Task 6 shared SEO is stored in `seo`.
- A relationship alone creates no public category archive; existing category controls remain intact.

### Pages

- Rejects every route in `RESERVED_EXACT_ROUTES` via shared reserved-slug validation.
- Preserves the approved layout block set exactly: `cta`, `content`, `mediaBlock`, `archive`, and `formBlock`.
- Retains the existing hero/meta frontend shape while adding Task 6 publication and shared SEO contracts.

## Revalidation review

- Current and previous public canonical paths are invalidated, covering slug changes and unpublishes.
- Posts/projects/services invalidate `/blog/`, `/projects/`, and `/services/` respectively.
- A transition involving a featured public project/service invalidates `/`.
- Related service/project/post IDs are always queried with explicit `status = published` and `publishedAt <= now`, even though the hook operates internally with `overrideAccess: true`; draft/future records therefore are never loaded for cache regeneration.
- Published deletes invalidate the deleted canonical path, listing route, related public records, featured homepage where applicable, and sitemap tag.
- Draft-only changes short-circuit without cache work.
- `context.disableRevalidate` is honored.

## Access and security self-review

- Anonymous/public integration calls use `overrideAccess: false` with no user and prove live-only results; drafts and future schedules are omitted.
- Writes remain authenticated-only through the existing `authenticated` access function.
- Caller-supplied audit ownership is overwritten for authenticated requests; `createdBy` is preserved on updates and `updatedBy` follows the current authenticated user.
- Internal relation lookups explicitly repeat the publication predicate instead of relying on elevated Local API defaults.
- No secrets are persisted; preview URLs use the existing environment-provided preview secret pattern.
- No Task 7 collection or unrelated global/plugin behavior was implemented or replaced.

## Final verification

- Full unit suite: PASS — 8 files / 127 tests.
- Full integration suite: PASS — 5 files / 30 tests.
- Task 6 focused integration: PASS — 13 tests.
- Generated types: PASS.
- Full typecheck: PASS.
- Scoped ESLint with `--max-warnings=0`: PASS. Generated `src/payload-types.ts` was excluded because repository ESLint intentionally ignores generated output; the first invocation including it correctly failed on the ignored-file warning, then the source/test scope passed with zero output.
- `git diff --check`: PASS.
- Disposable database schema query after tests: `[]` for `task5_%` and `task6_%`; no test schemas remain.

## Self-review disposition

No blocking defect remains in Task 6 scope. The only sequencing note is that FAQ/testimonial JSON references must be migrated to typed Payload relationships when Task 7 registers those collections; doing so in Task 6 would require prematurely implementing or registering Task 7 targets.

# Fix Round 1 — Independent Review Findings

Date: 2026-09-14
Reviewed base: `908f03aa0b29ed92baa30820773a0b04945c13ff`

## Finding 1 — Payload draft revisions in public reads and cache invalidation

### RED

Command:

```bash
pnpm exec vitest run tests/unit/access.test.ts tests/integration/publication.test.ts
```

Result: **FAIL**, 2 files failed; 3 tests failed and 25 passed.

The regressions demonstrated all three missing guards:

- an anonymous Local API read returned a record created with `draft: true` even though only its custom `status` and `publishedAt` looked public;
- `revalidateContent` emitted three public path invalidations for a document with `_status: 'draft'`;
- the anonymous `adminOrPublished` query lacked the expected `_status = published` clause.

### GREEN

The anonymous access query now requires Payload `_status = published` in addition to the retained custom `status = published` and `publishedAt <= now` rules. `PublicationState`, `isPubliclyPublished`, revalidation documents, and elevated related-record lookups now apply the same three-part publication contract. Existing public test fixtures explicitly identify real Payload-published revisions.

Command:

```bash
pnpm exec vitest run tests/unit/access.test.ts tests/integration/publication.test.ts
```

Result: **PASS**, 2 files / 28 tests.

The integration regression also verifies a Payload draft with apparently public custom fields causes no `revalidatePath` or `revalidateTag` call.

## Finding 2 — Sitemap invalidation producer/consumer tag mismatch

### RED

Command:

```bash
pnpm exec vitest run tests/unit/sitemap-cache.test.ts
```

Result: **FAIL** because `@/lib/cacheTags` and the shared sitemap-tag contract did not exist. The real pages/posts sitemap caches only carried their private tags while the revalidation producer emitted `sitemap`.

### GREEN

Added a single exported `SITEMAP_CACHE_TAG = 'sitemap'` contract. Both real `unstable_cache` declarations now carry that shared tag while retaining `pages-sitemap` and `posts-sitemap`. `revalidateContent` imports the same producer constant, preventing string drift.

Command:

```bash
pnpm exec vitest run tests/unit/sitemap-cache.test.ts
```

Result: **PASS**, 1 file / 2 tests. Each consumer tag list is asserted to contain the exact producer tag and its existing private tag.

## Finding 3 — `home` page canonical revalidation

### RED

Command:

```bash
pnpm exec vitest run tests/integration/publication.test.ts -t 'invalidates the real homepage'
```

Result: **FAIL**. The four table cases (change, rename, unpublish, and delete) received `/home/` instead of the storefront’s real homepage path `/`.

### GREEN

The page canonical-path collector now maps the reserved content slug `home` directly to `/` and returns without adding the non-route `/home/`. Current and previous documents use the same collector, covering slug changes and unpublishes; deletes use it as well.

Command:

```bash
pnpm exec vitest run tests/integration/publication.test.ts -t 'invalidates the real homepage'
```

Result: **PASS**, all 4 parametrized homepage transitions.

## Finding 4 — Audit-field API tampering

### Payload semantics inspected before implementation

Payload `3.89.0` field processing was inspected in the installed `beforeValidate`/`beforeChange` implementation and type declarations. A false field `create`/`update` access result removes caller-provided sibling data when `overrideAccess` is false, while collection `beforeChange` hooks execute afterward and may assign trusted values. Local API operations default to elevated access, so the regression deliberately uses `overrideAccess: false` plus authenticated users.

### RED

Command:

```bash
pnpm exec vitest run tests/integration/content-collections.test.ts -t 'audit-field|audit write denial'
```

Result: **FAIL**. The four-collection configuration contract found no field-level `create`/`update` access denial on `createdBy` or `updatedBy`. The accompanying authenticated lifecycle test exercised caller-supplied ownership data rather than relying only on admin UI `readOnly` metadata.

### GREEN

Added `contentAuditFields()` with one shared `denyAuditFieldWrite` function for both fields and both write operations, and used that helper in Pages, Posts, Projects, and Services. The existing trusted `populateContentAudit` collection hook remains the sole writer: it explicitly copies `originalDoc.createdBy` on updates and assigns the authenticated actor to `updatedBy` (and to `createdBy` on creates). Regression coverage proves:

- all four collections use the exact same denial function for both audit fields;
- authenticated create/update attempts cannot forge either field;
- a second authenticated updater cannot replace the original creator;
- even a legacy record with no creator cannot be backfilled by client input;
- trusted hook assignments still persist under `overrideAccess: false`.

Command:

```bash
pnpm exec vitest run tests/integration/content-collections.test.ts -t 'audit-field|audit write denial'
```

Result: **PASS**, 2 selected tests (6 skipped).

## Fix Round 1 comprehensive verification

Focused amended scope:

```bash
pnpm payload:generate-types && pnpm exec vitest run tests/unit/access.test.ts tests/unit/sitemap-cache.test.ts tests/integration/content-collections.test.ts tests/integration/publication.test.ts
```

Result: **PASS**, type generation plus 4 files / 42 tests.

Required Task 6 command, rerun on the final tree:

```bash
pnpm payload:generate-types && pnpm test:integration -- tests/integration/content-collections.test.ts tests/integration/publication.test.ts && pnpm typecheck
```

Result: **PASS**. Type generation completed; the repository integration script ran 5 files / 38 tests; `tsc --noEmit` passed.

Additional gates:

- `pnpm test:unit`: **PASS**, 9 files / 129 tests.
- Scoped ESLint across every changed TypeScript source/test file with `--max-warnings=0`: **PASS**, zero output.
- `git diff --check`: **PASS**.
- Payload type generation produced no uncommitted `src/payload-types.ts` delta, confirming no generated type shape drift.
- Post-test PostgreSQL query for `task5_%` and `task6_%` schemas returned `[]`; all disposable schemas were dropped.

## Fix Round 1 self-review

- **Security:** anonymous access, public-state calculations, and elevated related lookups now agree on Payload revision status plus the existing domain publication schedule. Audit denial is enforced at the API field-access layer, not only in the admin UI.
- **Cache correctness:** the invalidated sitemap tag is attached to both real cache consumers; existing private tags remain available to other callers. Payload drafts short-circuit before any public cache invalidation.
- **Routing:** only the special Pages document slug `home` is mapped to `/`; other canonical page paths and all existing collection index behavior are unchanged.
- **Compatibility:** custom `status`/`publishedAt`, drafts/revisions, SEO fields, previews, and frontend route shapes are preserved. No database fields were removed or renamed.
- **Scope:** changes are limited to the four findings, shared helpers, the two sitemap producers, and focused regressions. No Task 7 collection/global/plugin behavior was introduced.

Disposition: no blocking finding or known regression remains in Task 6 Fix Round 1.
