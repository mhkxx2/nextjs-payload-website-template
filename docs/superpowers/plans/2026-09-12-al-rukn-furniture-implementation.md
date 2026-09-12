# Al Rukn Furniture Upholstery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, and reversibly deploy a premium, conversion-focused Al Rukn Furniture Upholstery website and Payload CMS that replaces the empty WordPress site only after every approved release gate passes.

**Architecture:** Start from the official Payload Website Template generated into a temporary empty directory, then import that generated tree into the existing staging Git worktree at `/www/wwwroot/alruknfurniture-next`. Keep Payload Admin/API and the Next.js 16 App Router in one strict-TypeScript application; separate typed collections, globals, blocks, access policies, hooks, route utilities, Server Components, and tests, with local PostgreSQL and local Payload uploads. Build a standalone release operated by PM2 behind local-only Nginx, with atomic upstream/release switching, protected backups, restore proof, and a rehearsed WordPress rollback.

**Tech Stack:** Next.js 16 App Router, React Server Components, Payload CMS Website Template, TypeScript strict mode, Tailwind CSS, Lexical rich text, `@payloadcms/db-postgres`, PostgreSQL, Vitest, React Testing Library, Playwright, axe-core, Lighthouse CI, Sharp, pnpm/pnpx, PM2, Nginx, systemd/cron, Bash.

## Global Constraints

- The application must be based on the official Payload Website Template from `payloadcms/payload/templates/website`, imported through Payload's supported template mechanism.
- The template is a technical foundation only. All demonstration identity, records, imagery, and copy must be removed before launch.
- **Framework:** Next.js 16 App Router.
- **CMS:** Payload CMS embedded in the same application and exposed to authorized editors at `/admin`.
- **Language:** TypeScript with strict type checking.
- **Styling:** Tailwind CSS, using a project-specific token system rather than template branding.
- **Database:** Local PostgreSQL database named `alrukn_furniture`, accessed by a dedicated restricted application user.
- **Rendering:** React Server Components by default; Client Components only for behavior that requires browser interactivity.
- **Production output:** Next.js `output: 'standalone'`.
- **Process management:** PM2 with restart-on-failure and restart-on-boot.
- **Edge/web server:** Nginx terminating TLS and reverse proxying to a Node process bound only to `127.0.0.1`.
- **Media:** Payload-managed local uploads in the initial deployment, included in backup and restore procedures.
- **Source control:** Git-managed application source; secrets and generated/runtime assets must not be committed.
- Runtime secrets and deployment-specific values are stored only in a mode-`0600` production `.env`.
- The required application variables are `DATABASE_URI`, `PAYLOAD_SECRET`, and `NEXT_PUBLIC_SERVER_URL=https://alruknfurniture.ae`; the PostgreSQL adapter reads `DATABASE_URI`.
- Any additional operational secrets, including preview, cron, and backup credentials, follow the same protected-file rule and must never use a `NEXT_PUBLIC_` prefix.
- Fixed service URLs are canonical and must not be replaced by generic `/services/[slug]` public URLs.
- English is the only launch locale, but implementation must avoid structural rework when Arabic is introduced.
- Arabic content must not be machine-generated or published as part of the English launch.
- The public site targets WCAG 2.2 AA practices.
- No fake urgency, invented availability, false statistics, fabricated reviews, or unsupported guarantees may be used to increase conversion.
- Royalty-free launch imagery must have a recorded source and license basis.
- Public registration is disabled.
- Leads are never publicly readable, listable, searchable, updateable, or deletable.
- PostgreSQL is bound locally and uses a dedicated application role with only the privileges required for the application schema and migrations.
- The Node service binds to `127.0.0.1`, not a public interface.
- HTTP permanently redirects to HTTPS; `www` permanently redirects to canonical non-`www` without redirect loops or path/query loss.
- Existing certificate paths are preserved during Nginx cutover.
- TLS 1.0 and TLS 1.1 are disabled.
- The new application is built in `/www/wwwroot/alruknfurniture-next`, separate from the live WordPress root.
- The current WordPress site remains served until the new application passes all pre-cutover gates.
- The production deployment uses a Git-managed application in `/www/wwwroot/alruknfurniture.ae`, a standalone Next.js build, a private localhost Node port, PM2, and Nginx.
- Cutover must be atomic at the Nginx/upstream or release-path level rather than an unverified in-place replacement.
- Nginx configuration is backed up before change and tested before reload.
- Backup artifacts live below an access-restricted `/www/backup/alruknfurniture/` hierarchy and are never web-served.
- Database and media/configuration backups run daily, retain 14 daily copies, 8 weekly copies, and 6 monthly copies, and emit a non-zero exit plus an operator-visible alert on failure.
- The final WordPress snapshot is retained for at least 30 days after successful cutover and is not removed until the first new-system restore test and stabilization review pass.
- Backup files containing secrets or personal data are owner-readable only and encrypted before any off-server transfer.
- A failed gate blocks cutover until corrected and re-tested.
- Successful plan completion without runtime evidence does not count as release approval.

---

## File Map

The generated template is the baseline. Record its commit and manifest before changing it; paths below are the intended final responsibilities.

### Foundation and configuration

- `package.json` — generated dependencies plus deterministic lint, typecheck, test, E2E, accessibility, performance, migration, seed, and release-gate scripts.
- `pnpm-lock.yaml` — generated and committed dependency lock.
- `LICENSE.template-payload` — retained MIT license/provenance for `payloadcms/payload/templates/website`.
- `docs/template-provenance.md` — exact import command, generation date, generated package versions, upstream URL/commit when available, and demo-removal inventory.
- `.env.example` — non-secret variable names and safe development examples.
- `.gitignore` — excludes `.env*` except `.env.example`, uploads, backups, test artifacts, and standalone runtime files.
- `next.config.ts` — Payload wrapper, `output: 'standalone'`, image formats, security-conscious production settings.
- `tsconfig.json` — generated aliases with `strict: true` and `noUncheckedIndexedAccess: true`.
- `payload.config.ts` — PostgreSQL adapter, collections, globals, plugins, editor, upload/secret/server URL configuration.
- `src/plugins/index.ts` — only approved template plugins, branded and configured against project collections.
- `src/payload-types.ts` — generated Payload types; never hand-edited.

### Domain model, access, hooks, and utilities

- `src/access/adminOnly.ts`, `src/access/adminOrPublished.ts`, `src/access/leadAccess.ts` — reusable least-privilege access policies.
- `src/fields/seo.ts`, `src/fields/slug.ts`, `src/fields/publication.ts` — shared typed field factories.
- `src/lib/routes.ts` — fixed service slugs, dedicated exact routes, protected prefixes, and canonical path helpers.
- `src/lib/slug.ts` — normalization and collision validation.
- `src/lib/publication.ts` — public publication predicates.
- `src/lib/contact.ts` — phone normalization and safe WhatsApp URL creation.
- `src/lib/attribution.ts` — allowlisted UTM/referrer/source extraction.
- `src/lib/uploadSecurity.ts` — image extension/MIME/signature/size/random-name checks.
- `src/lib/rateLimit.ts` — server-side submission limiter interface and PostgreSQL-backed implementation.
- `src/lib/dedupe.ts` — PostgreSQL-backed short-lived idempotency token/fingerprint protection.
- `src/db/leadProtection.ts` — atomic SQL operations for `lead_rate_limits` and `lead_submission_claims`; both tables are created by the initial migration, not exposed as Payload collections.
- `src/lib/seo.ts`, `src/lib/schema.ts`, `src/lib/breadcrumbs.ts` — metadata, canonical, structured-data, and breadcrumb builders.
- `src/lib/locale.ts` — launch locale and non-public direction-switch contract.
- `src/hooks/revalidateContent.ts` — tag/path revalidation after publication changes.
- `src/hooks/auditLeadStatus.ts` — authenticated lead-status audit metadata.

### Collections and globals

- `src/collections/Users.ts`, `Pages.ts`, `Services.ts`, `Projects.ts`, `Posts.ts`, `Categories.ts`, `Media.ts`, `FAQs.ts`, `Testimonials.ts`, `Leads.ts`, `Redirects.ts` — approved Payload collections.
- `src/globals/SiteSettings.ts`, `Header.ts`, `Footer.ts`, `ContactInformation.ts`, `SEODefaults.ts`, `SocialMedia.ts` — approved editable global data.

### Page-builder blocks

- `src/blocks/Hero/config.ts`, `Component.tsx`; `RichContent/config.ts`, `Component.tsx`; `Media/config.ts`, `Component.tsx`; `SplitContent/config.ts`, `Component.tsx`; `ServiceGrid/config.ts`, `Component.tsx`; `ProjectGallery/config.ts`, `Component.tsx`; `Benefits/config.ts`, `Component.tsx`; `ProcessSteps/config.ts`, `Component.tsx`; `Testimonials/config.ts`, `Component.tsx`; `FAQs/config.ts`, `Component.tsx`; `LocationCoverage/config.ts`, `Component.tsx`; `Statistics/config.ts`, `Component.tsx`; `CallToAction/config.ts`, `Component.tsx`; `QuoteForm/config.ts`, `Component.tsx` — constrained schemas and accessible rendering.
- `src/blocks/RenderBlocks.tsx` — exhaustive block renderer.

### Frontend and routes

- `src/app/(frontend)/layout.tsx`, `globals.css`, `not-found.tsx` — public shell, local fonts/tokens, metadata foundation, and real branded 404.
- `src/app/(frontend)/page.tsx` — homepage composition.
- `src/app/(frontend)/[slug]/page.tsx` — published general page resolver only.
- `src/app/(frontend)/projects/page.tsx`, `projects/[slug]/page.tsx` — published project index/detail.
- `src/app/(frontend)/blog/page.tsx`, `blog/[slug]/page.tsx` — published post index/detail.
- `src/app/(frontend)/about-us/page.tsx`, `contact/page.tsx` — dedicated pages.
- `src/app/(frontend)/(services)/sofa-upholstery/page.tsx`, `custom-furniture/page.tsx`, `custom-sofa/page.tsx`, `majlis-furniture/page.tsx`, `curtains-blinds/page.tsx`, `sofa-repair/page.tsx`, `custom-wardrobes/page.tsx`, `custom-beds-headboards/page.tsx`, and `office-furniture/page.tsx` — nine fixed canonical service pages, each delegating to the service renderer.
- `src/components/Header/index.tsx`, `MobileNav.tsx`; `src/components/Footer/index.tsx`; `src/components/AnnouncementBar.tsx`; `src/components/ServicePage.tsx`; `src/components/QuoteForm.tsx`; `src/components/WhatsAppAction.tsx`; `src/components/Breadcrumbs.tsx`; `src/components/JsonLd.tsx`; `src/components/Media/index.tsx` — shared public rendering.
- `src/app/(frontend)/api/leads/route.ts` — controlled public lead submission endpoint.
- `src/app/(frontend)/api/preview/route.ts`, `exit-preview/route.ts`, `revalidate/route.ts` — secret-protected editorial preview/revalidation.
- `src/app/(frontend)/sitemap.ts`, `robots.ts` — published canonical discovery endpoints.
- `src/middleware.ts` — deterministic internal-path redirect resolution without open redirects.
- `src/app/(payload)/admin/[[...segments]]/page.tsx`, `layout.tsx`; `src/app/(payload)/api/[...slug]/route.ts`; `src/app/(payload)/graphql/route.ts`; `src/app/(payload)/graphql-playground/route.ts` — generated current official Payload Admin/API structure, retained and access-controlled rather than relocated.

### Seed, tests, operations, and evidence

- `src/seed/index.ts`, `content.ts`, `media-manifest.json` — idempotent original English seed and license/source records.
- `tests/unit/*.test.ts`, `tests/integration/*.test.ts`, `tests/e2e/*.spec.ts` — route, access, model, submission, SEO, RTL, admin, accessibility, and browser tests.
- `vitest.config.ts`, `playwright.config.ts`, `lighthouserc.json` — test and quality tooling.
- `scripts/assert-template-clean.mjs`, `assert-production-env.mjs`, `verify-sensitive-denials.sh`, `pre-cutover.sh`, `cutover.sh`, `rollback.sh`, `backup.sh`, `restore-test.sh`, `rotate-backups.py`, `collect-release-evidence.sh` — deterministic operational gates.
- `deploy/ecosystem.config.cjs` — PM2 standalone process on localhost.
- `deploy/nginx/alruknfurniture.conf` — TLS/canonical proxy with sensitive-path denials.
- `deploy/systemd/alruknfurniture-backup.service`, `alruknfurniture-backup.timer` — daily protected backup execution.
- `docs/operations/backup-restore.md`, `cutover-rollback.md`, `release-checklist.md`, `delivery-record.md`, `content-and-media-register.md` — operator runbooks and evidence record.

## Implementation Tasks

### Execution preflight (must pass before Task 1)

This preflight is the first implementation action after explicit approval. It does not alter WordPress, its database, Nginx, or public traffic. The current inventory taken while reviewing this plan is: Node `v26.6.0` (not the required LTS line), Git `2.43.0`, Nginx `1.30.4`, rsync `3.2.7`, curl `8.5.0`, OpenSSL `3.0.13`, jq `1.7`, and Python `3.12.3`; `corepack`, `pnpm`, `psql`, `pm2`, and `bats` are currently missing.

- [ ] Record the inventory again and stop if `/www/wwwroot/alruknfurniture-next` is not clean apart from this plan.
- [ ] Install Node.js 24 LTS (the official template currently requires Node `>=24.15.0`) using the server's approved Node/aaPanel package mechanism; do not use the installed non-LTS Node 26 for the production service.
- [ ] Install local PostgreSQL server/client and Bats from the Ubuntu package repositories: `sudo apt-get update && sudo apt-get install -y postgresql postgresql-client bats`.
- [ ] Before Task 1, install Corepack and a generator-compatible pnpm major: `sudo npm install --global corepack@latest && sudo corepack enable && corepack prepare pnpm@10 --activate`. After Task 1 generates `package.json`, run `corepack prepare "$(node -p "require('./package.json').packageManager || 'pnpm@10')" --activate` from the imported project root and fail if its engine range rejects Node 24 LTS.
- [ ] Install PM2 only after Node 24 LTS is active: `sudo npm install --global pm2@latest`; record the resolved version in `docs/template-provenance.md` and the final delivery record.
- [ ] Verify with `node --version; npm --version; pnpm --version; psql --version; pm2 --version; bats --version; nginx -v; git --version; rsync --version` and stop on any missing command or Node/package-manager engine mismatch.

No application task may proceed until this preflight is recorded as PASS.

### Task 1: Import the official template and prove provenance

**Files:**
- Create: generated project tree under `/www/wwwroot/alruknfurniture-next`
- Create: `LICENSE.template-payload`
- Create: `docs/template-provenance.md`
- Create: `scripts/assert-template-clean.mjs`
- Modify: `.gitignore`
- Test: `tests/unit/template-provenance.test.ts`

**Interfaces:**
- Consumes: empty temporary directory created with `mktemp -d`; existing Git worktree `/www/wwwroot/alruknfurniture-next`.
- Produces: official generated project with `src/app/(frontend)`, `src/app/(payload)`, collections, blocks, Header/Footer, and plugins preserved as the structural baseline; `pnpm template:check` exits `0` only after demo artifacts are absent.

- [ ] **Step 1: Capture the pristine staging state**

Run: `git status --short --branch && git rev-parse HEAD`

Expected: branch `main`, no changes, and the approved-spec commit hash printed. Stop if any unrelated changes exist.

- [ ] **Step 2: Generate into a temporary empty directory with the supported command**

```bash
export TEMP_DIR="$(mktemp -d /tmp/alrukn-payload-website.XXXXXX)"
test -z "$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -print -quit)"
npx create-payload-app@latest "$TEMP_DIR" -t website
```

Expected: generator exits `0`; `$TEMP_DIR/package.json`, `$TEMP_DIR/src/app/(frontend)`, `$TEMP_DIR/src/app/(payload)`, `$TEMP_DIR/src/collections`, `$TEMP_DIR/src/blocks`, `$TEMP_DIR/src/Header`, `$TEMP_DIR/src/Footer`, and `$TEMP_DIR/src/plugins` exist. Do not direct the generator at the non-empty Git worktree.

- [ ] **Step 3: Record and copy the generated baseline without replacing `.git` or `docs`**

```bash
node -p "JSON.stringify(require(process.env.TEMP_DIR + '/package.json').dependencies, null, 2)" > /tmp/alrukn-template-dependencies.json
rsync -a --exclude='.git' --exclude='docs' "$TEMP_DIR"/ /www/wwwroot/alruknfurniture-next/
cd /www/wwwroot/alruknfurniture-next
corepack prepare "$(node -p "require('./package.json').packageManager || 'pnpm@10')" --activate
```

Expected: `git status --short` shows generated application files and retains `docs/superpowers/specs/2026-09-12-al-rukn-furniture-design.md`; `/www/wwwroot/alruknfurniture.ae` is untouched.

- [ ] **Step 4: Add provenance and a failing demo-cleanliness test**

```ts
// tests/unit/template-provenance.test.ts
import { describe, expect, it } from 'vitest'
import { scanTemplateDemoArtifacts } from '../../scripts/assert-template-clean.mjs'

describe('template provenance and cleanup', () => {
  it('contains no template demo identity or records', async () => {
    expect(await scanTemplateDemoArtifacts(process.cwd())).toEqual([])
  })
})
```

Run: `pnpm vitest run tests/unit/template-provenance.test.ts`

Expected: FAIL listing generated demo brand strings, seed records, logos, imagery, or sample copy.

- [ ] **Step 5: Remove demo content while retaining current official structure**

Implement `scanTemplateDemoArtifacts(root: string): Promise<string[]>` to inspect public source and seed content for the exact generated demo strings discovered in Step 4. Delete demo seed data/assets, replace branding entry points with neutral Al Rukn-owned files, retain the Payload Admin route group and template plugin wiring, and write `docs/template-provenance.md` with the exact command, generation timestamp, upstream template URL, generated dependency versions, copied MIT license, and removed artifact list.

Run: `pnpm vitest run tests/unit/template-provenance.test.ts && pnpm template:check`

Expected: both commands exit `0`, with `0 demo artifacts` printed by `template:check`.

- [ ] **Step 6: Commit the independently reviewable baseline**

```bash
git add . ':!docs/superpowers/plans/2026-09-12-al-rukn-furniture-implementation.md'
git commit -m "chore: import official Payload website template"
```

Expected: one commit containing provenance, generated foundation, and demo purge; no runtime secret, upload, build artifact, or change below `/www/wwwroot/alruknfurniture.ae`.

### Task 2: Establish PostgreSQL, environment, standalone output, and quality scripts

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`, `.env.example`, `.gitignore`, `next.config.ts`, `tsconfig.json`, `payload.config.ts`
- Create: `scripts/assert-production-env.mjs`
- Test: `tests/unit/environment.test.ts`, `tests/integration/database.test.ts`

**Interfaces:**
- Consumes: `process.env.DATABASE_URI`, `process.env.PAYLOAD_SECRET`, `process.env.NEXT_PUBLIC_SERVER_URL`.
- Produces: `validateProductionEnv(env): { DATABASE_URI: string; PAYLOAD_SECRET: string; NEXT_PUBLIC_SERVER_URL: URL }`; Payload `postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } })`; standalone build.

- [ ] **Step 1: Add deterministic scripts and test dependencies**

Run `PAYLOAD_VERSION="$(node -p "require('./package.json').dependencies.payload.replace(/^[^0-9]*/, '')")" && pnpm remove @payloadcms/db-mongodb && pnpm add "@payloadcms/db-postgres@${PAYLOAD_VERSION}" && pnpm add -D @axe-core/playwright @lhci/cli`. Retain the template-pinned Vitest, Playwright, and Testing Library dependencies. Add scripts `lint`, `typecheck`, `test:unit`, `test:integration`, `test:e2e`, `test:a11y`, `test:security`, `test:performance`, `template:check`, `env:check`, `payload:generate-types`, `payload:migrate`, `seed`, and `release:gate`; retain the generated package-manager field.

Run: `pnpm install --frozen-lockfile`

Expected: exit `0` with an unchanged lockfile after installation.

- [ ] **Step 2: Write failing environment and database tests**

```ts
it('requires exact production variable names and canonical URL', () => {
  expect(validateProductionEnv({
    DATABASE_URI: 'postgresql://app:secret@127.0.0.1:5432/alrukn_furniture',
    PAYLOAD_SECRET: 'x'.repeat(32),
    NEXT_PUBLIC_SERVER_URL: 'https://alruknfurniture.ae',
  }).NEXT_PUBLIC_SERVER_URL.href).toBe('https://alruknfurniture.ae/')
})

it('uses PostgreSQL database alrukn_furniture', async () => {
  expect((await sql`select current_database() as name`)[0].name).toBe('alrukn_furniture')
})
```

Run: `pnpm vitest run tests/unit/environment.test.ts tests/integration/database.test.ts`

Expected: FAIL because validator and PostgreSQL adapter/database are not configured.

- [ ] **Step 3: Configure strict runtime foundation**

Use `@payloadcms/db-postgres`; set `secret: process.env.PAYLOAD_SECRET`; set `serverURL: process.env.NEXT_PUBLIC_SERVER_URL`; set `output: 'standalone'`; enable AVIF/WebP; retain the generated Payload Next.js wrapper. Set TypeScript `strict` and `noUncheckedIndexedAccess`. `.env.example` must contain only:

```dotenv
DATABASE_URI=postgresql://alrukn_app:replace-me@127.0.0.1:5432/alrukn_furniture
PAYLOAD_SECRET=replace-with-at-least-32-random-characters
NEXT_PUBLIC_SERVER_URL=https://alruknfurniture.ae
PREVIEW_SECRET=replace-with-a-separate-random-secret
REVALIDATION_SECRET=replace-with-a-separate-random-secret
```

Implement production validation that rejects a non-PostgreSQL URI, wrong database name, short secret, or non-canonical production URL.

- [ ] **Step 4: Provision the local database role without embedding credentials**

```bash
set -euo pipefail
umask 077
test "$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='alrukn_app'")" != "1"
test "$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='alrukn_furniture'")" != "1"
APP_DB_PASSWORD="$(openssl rand -hex 32)"
PAYLOAD_SECRET_VALUE="$(openssl rand -hex 32)"
PREVIEW_SECRET_VALUE="$(openssl rand -hex 32)"
REVALIDATION_SECRET_VALUE="$(openssl rand -hex 32)"
SQL_FILE="$(mktemp /tmp/alrukn-postgres.XXXXXX.sql)"
printf "CREATE ROLE alrukn_app LOGIN PASSWORD '%s' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;\nCREATE DATABASE alrukn_furniture OWNER alrukn_app ENCODING 'UTF8';\n" "$APP_DB_PASSWORD" > "$SQL_FILE"
sudo -u postgres psql -v ON_ERROR_STOP=1 --file="$SQL_FILE"
sudo install -d -m 0700 -o root -g root /etc/alruknfurniture
sudo install -m 0600 -o root -g root /dev/null /etc/alruknfurniture/.env
sudo sh -c 'printf "%s\n" \
  "DATABASE_URI=postgresql://alrukn_app:'"$APP_DB_PASSWORD"'@127.0.0.1:5432/alrukn_furniture" \
  "PAYLOAD_SECRET='"$PAYLOAD_SECRET_VALUE"'" \
  "NEXT_PUBLIC_SERVER_URL=https://alruknfurniture.ae" \
  "PREVIEW_SECRET='"$PREVIEW_SECRET_VALUE"'" \
  "REVALIDATION_SECRET='"$REVALIDATION_SECRET_VALUE"'" > /etc/alruknfurniture/.env'
shred --remove "$SQL_FILE"
unset APP_DB_PASSWORD
unset PAYLOAD_SECRET_VALUE PREVIEW_SECRET_VALUE REVALIDATION_SECRET_VALUE
```

Set PostgreSQL `listen_addresses = '127.0.0.1,::1'`, retain only local/loopback host rules for `alrukn_app` in the versioned server's `pg_hba.conf`, restart PostgreSQL, and verify `ss -ltnp | grep ':5432'` contains no `0.0.0.0:5432` or public address. Expected: role has no elevated attributes, database owner is `alrukn_app`, PostgreSQL listens only on loopback, and `/etc/alruknfurniture/.env` is root-owned mode `0600`. Stop rather than overwrite if the role/database already exists; never print or commit generated values.

- [ ] **Step 5: Verify tests, types, and build configuration**

Run: `pnpm env:check && pnpm test:unit -- tests/unit/environment.test.ts && pnpm test:integration -- tests/integration/database.test.ts && pnpm typecheck`

Expected: all exit `0`; environment check prints variable names and redacted validity only.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example .gitignore next.config.ts tsconfig.json payload.config.ts scripts/assert-production-env.mjs tests
git commit -m "build: configure PostgreSQL and standalone runtime"
```

### Task 3: Centralize collision-safe routes, slugs, and publication rules

**Files:**
- Create: `src/lib/routes.ts`, `src/lib/slug.ts`, `src/lib/publication.ts`, `src/fields/slug.ts`, `src/fields/publication.ts`
- Test: `tests/unit/routes.test.ts`, `tests/unit/slug.test.ts`, `tests/unit/publication.test.ts`

**Interfaces:**
- Produces: `FIXED_SERVICE_SLUGS` readonly tuple; `RESERVED_EXACT_ROUTES`, `RESERVED_PREFIXES`; `normalizeSlug(input: string): string`; `validatePageSlug(input: string): true | string`; `canonicalPath(kind, slug): string`; `isPubliclyPublished({ status, publishedAt }, now): boolean`.

- [ ] **Step 1: Write exhaustive failing route tests**

```ts
const services = ['sofa-upholstery','custom-furniture','custom-sofa','majlis-furniture','curtains-blinds','sofa-repair','custom-wardrobes','custom-beds-headboards','office-furniture']
it.each(services)('reserves fixed service slug %s', slug => expect(validatePageSlug(slug)).not.toBe(true))
it.each(['admin','admin/users','api','api/leads','services','projects/a','blog/a','about-us','contact','sitemap.xml','robots.txt','_next','media','health'])('rejects protected %s', slug => expect(validatePageSlug(slug)).not.toBe(true))
it.each([' Custom- Wardrobes/ ','custom%2Fwardrobes','../admin',''])('rejects unsafe/empty %s', slug => expect(validatePageSlug(slug)).not.toBe(true))
```

Run: `pnpm vitest run tests/unit/routes.test.ts tests/unit/slug.test.ts tests/unit/publication.test.ts`

Expected: FAIL because the registry and predicates do not exist.

- [ ] **Step 2: Implement the single registry and validators**

Normalize with Unicode NFKC, trim, lowercase, remove leading/trailing slashes, collapse whitespace/hyphens, and permit only `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Reserve admin, API, `services`, fixed services, projects, blog, about, contact, sitemap, robots, `_next`, static/assets/media/uploads, health, Payload-owned routes, and descendants. Generate fixed service canonical paths as `/${slug}/`, project paths as `/projects/${slug}/`, post paths as `/blog/${slug}/`, and general page paths as `/${slug}/`.

- [ ] **Step 3: Backstop normalization collisions at Payload and database levels**

`slugField({ validateReserved: true })` must normalize in `beforeValidate`, reject a normalized duplicate with an editor-readable message, and set `unique: true`, `index: true`. Publication must require `status === 'published'` and `publishedAt <= now`; missing/future timestamps are private.

- [ ] **Step 4: Verify exhaustive behavior**

Run: `pnpm vitest run tests/unit/routes.test.ts tests/unit/slug.test.ts tests/unit/publication.test.ts`

Expected: PASS for every exact route, protected descendant, case/normalization variant, duplicate form, valid general slug, draft, scheduled, and published fixture.

- [ ] **Step 5: Commit**

```bash
git add src/lib src/fields tests/unit
git commit -m "feat: enforce collision-safe route contract"
```

### Task 4: Implement access control and shared SEO fields

**Files:**
- Create: `src/access/adminOnly.ts`, `src/access/adminOrPublished.ts`, `src/access/leadAccess.ts`, `src/fields/seo.ts`
- Test: `tests/unit/access.test.ts`, `tests/unit/seo-fields.test.ts`

**Interfaces:**
- Produces: `adminOnly: Access`; `adminOrPublished: Access`; `leadAccess: CollectionConfig['access']`; `seoFields(): Field[]`.

- [ ] **Step 1: Write failing access matrix tests**

```ts
it.each([
  ['anonymous','read',false], ['anonymous','create',false], ['editor','read',true], ['editor','update',true],
])('%s lead %s => %s', (role, operation, allowed) => expect(runLeadAccess(role, operation)).toBe(allowed))
```

Also assert anonymous users can read only published public records, no public user registration exists, and SEO fields contain title, description, canonical URL, OG title/description/image, index/follow, schema options, and editor-visible preview data.

Run: `pnpm vitest run tests/unit/access.test.ts tests/unit/seo-fields.test.ts`

Expected: FAIL because policies/fields do not exist.

- [ ] **Step 2: Implement least-privilege policies**

Admins are authenticated Payload users; anonymous public reads return a published-and-not-future query constraint, never a boolean bypass. Lead collection access denies every anonymous operation, including create; only the controlled local server handler may create through Payload Local API with an explicit server capability passed internally. Disable public Users creation and reject privilege-field mutation by non-authorized users.

- [ ] **Step 3: Implement reusable SEO fields**

Constrain title/description lengths, canonical to same-site HTTPS URLs, schema types to the approved set, and image relation to Media. Do not expose arbitrary JSON-LD or script entry. Add an Admin UI preview component that shows canonical and social fields without storing secrets.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run tests/unit/access.test.ts tests/unit/seo-fields.test.ts && pnpm typecheck`

Expected: PASS and no type errors.

```bash
git add src/access src/fields tests/unit
git commit -m "feat: add access and SEO field contracts"
```

### Task 5: Build Users, Media, and Categories collections

**Files:**
- Create/Replace: `src/collections/Users.ts`, `src/collections/Media.ts`, `src/collections/Categories.ts`
- Modify: `payload.config.ts`
- Test: `tests/integration/core-collections.test.ts`, `tests/integration/media.test.ts`

**Interfaces:**
- Produces: Payload slugs `users`, `media`, `categories`; Media requires `{ alt, decorative, caption, sourceURL, license, sourceNotes, focalX, focalY }` with validated upload metadata.

- [ ] **Step 1: Write failing collection tests**

Assert unauthenticated user creation fails; category normalized slugs are unique; informative images require non-empty alt; decorative images require `alt === ''`; source URL and license basis are required for launch media; SVG/executable/polyglot and files over the selected 12 MB cap are rejected; JPEG/PNG/WebP/AVIF signature-matched uploads pass; focal point/dimensions/MIME/timestamps persist.

Run: `pnpm test:integration -- tests/integration/core-collections.test.ts tests/integration/media.test.ts`

Expected: FAIL on missing collection schemas and upload validation.

- [ ] **Step 2: Implement schemas and upload controls**

Use Payload auth hashing for Users, no public registration, admin-only CRUD. Categories use normalized unique slug and title and expose no empty archive route. Media uses local static storage outside Git, image-only allowlist, 12 MB maximum, server-verified signatures, randomized filenames, image sizes, focal point, meaningful-alt/decorative exclusivity, caption, source/license notes, and ownership timestamps.

- [ ] **Step 3: Register collections and regenerate types**

Run: `pnpm payload:generate-types && pnpm typecheck`

Expected: `src/payload-types.ts` contains `User`, `Media`, and `Category` and typecheck exits `0`.

- [ ] **Step 4: Verify and commit**

Run: `pnpm test:integration -- tests/integration/core-collections.test.ts tests/integration/media.test.ts`

Expected: PASS, including unsafe-upload rejection.

```bash
git add src/collections payload.config.ts src/payload-types.ts tests/integration
git commit -m "feat: add secured users media and taxonomy"
```

### Task 6: Build Services, Projects, Posts, and Pages collections

**Files:**
- Create/Replace: `src/collections/Services.ts`, `Projects.ts`, `Posts.ts`, `Pages.ts`
- Create: `src/hooks/revalidateContent.ts`
- Modify: `payload.config.ts`
- Test: `tests/integration/content-collections.test.ts`, `tests/integration/publication.test.ts`

**Interfaces:**
- Produces: Payload slugs `services`, `projects`, `posts`, `pages`; `revalidateContent(args): Promise<void>`; fixed service slug validation against `FIXED_SERVICE_SLUGS`.

- [ ] **Step 1: Write failing schema and publication tests**

Create one test per required field group from the specification. Assert Services accept only the nine fixed slugs; Pages reject every reserved collision; Projects contain title/slug/summary/cover/gallery/service/category/location/completion/narrative/challenge/solution/featured/publication/SEO; Posts contain author/categories/services/content/dates/SEO; public Local API queries omit drafts and future schedules; revisions/drafts/preview are enabled.

Run: `pnpm test:integration -- tests/integration/content-collections.test.ts tests/integration/publication.test.ts`

Expected: FAIL because collection contracts are absent.

- [ ] **Step 2: Implement independently editable service records**

Add title, canonical fixed slug, summary, hero, details, benefits, materials/capabilities, process, FAQ relations, service areas, project/testimonial relations, gallery, quotation context, WhatsApp context, related services, publication state, and SEO fields. Enforce exactly one record per approved fixed slug with application validation plus unique index.

- [ ] **Step 3: Implement Projects, Posts, and Pages**

Use shared slug/publication/SEO contracts. Configure drafts, revisions, preview URLs, ownership/audit timestamps, and scheduled date validation. General Pages use only approved blocks and query publicly only through publication predicates. Post/category relationships do not create a public empty taxonomy archive.

- [ ] **Step 4: Add precise revalidation hooks**

On published changes, invalidate the record path, affected index, homepage when featured, related services/projects/posts, and sitemap tag. On unpublish/delete, invalidate the former canonical path and indexes. Never fetch drafts for cache regeneration.

- [ ] **Step 5: Generate types, test, and commit**

Run: `pnpm payload:generate-types && pnpm test:integration -- tests/integration/content-collections.test.ts tests/integration/publication.test.ts && pnpm typecheck`

Expected: PASS with generated types matching collection field names.

```bash
git add src/collections src/hooks payload.config.ts src/payload-types.ts tests/integration
git commit -m "feat: model pages services projects and posts"
```

### Task 7: Build FAQs, Testimonials, Leads, and Redirects collections

**Files:**
- Create: `src/collections/FAQs.ts`, `Testimonials.ts`, `Leads.ts`, `Redirects.ts`
- Create: `src/hooks/auditLeadStatus.ts`
- Modify: `payload.config.ts`
- Test: `tests/integration/operational-collections.test.ts`, `tests/integration/redirects.test.ts`

**Interfaces:**
- Produces: `LeadStatus = 'new' | 'contacted' | 'quotation-sent' | 'won' | 'lost'`; redirect records `{ source, destination, type: 301 | 302, active, notes }`; `validateRedirect(record, existing): true | string`.

- [ ] **Step 1: Write failing workflow/access tests**

Assert FAQ visibility/schema eligibility, testimonial consent/verification, Lead default `new`, legal transitions `new→contacted→quotation-sent→won|lost`, authenticated accountability, anonymous denial for every Lead operation, and redirect rejection for loops, chains to self, external/protocol-relative targets, admin/API/media/internal targets, and duplicate active sources.

Run: `pnpm test:integration -- tests/integration/operational-collections.test.ts tests/integration/redirects.test.ts`

Expected: FAIL because collections and transition rules are absent.

- [ ] **Step 2: Implement FAQ and testimonial integrity**

FAQs store question, answer, service relations, group, order, publication, and schema-eligibility guidance. Testimonials require approved statement, display name, optional genuinely supplied rating, location/service/project, featured, publication, consent/verification note and date; publication is blocked without verification evidence.

- [ ] **Step 3: Implement private Leads and status audit**

Store all required identity, service, message, optional reference Media, explicit consent/time, source path/title, project context, referrer, five UTM values, status, submission/update timestamps, minimal hashed abuse context, and status audit entries `{ from, to, changedAt, changedBy }`. Only authorized staff can change status; server-created leads always start `new`.

- [ ] **Step 4: Implement deterministic safe Redirects**

Normalize same-origin path-only source/destination, preserve query only when explicitly represented, restrict status to 301/302, reject loops and protected destinations, and resolve one active exact source deterministically. Never accept a host, scheme, `//`, encoded traversal, or backslash.

- [ ] **Step 5: Generate types, verify, and commit**

Run: `pnpm payload:generate-types && pnpm test:integration -- tests/integration/operational-collections.test.ts tests/integration/redirects.test.ts`

Expected: PASS; anonymous Lead requests remain denied.

```bash
git add src/collections src/hooks payload.config.ts src/payload-types.ts tests/integration
git commit -m "feat: add FAQs testimonials private leads and redirects"
```

### Task 8: Build all required globals and template Header/Footer integrations

**Files:**
- Create/Replace: `src/globals/SiteSettings.ts`, `Header.ts`, `Footer.ts`, `ContactInformation.ts`, `SEODefaults.ts`, `SocialMedia.ts`
- Modify: `src/Header/config.ts`, `src/Footer/config.ts`, `src/plugins/index.ts`, `payload.config.ts`
- Test: `tests/integration/globals.test.ts`

**Interfaces:**
- Produces: global slugs `site-settings`, `header`, `footer`, `contact-information`, `seo-defaults`, `social-media`; `ContactInformation.whatsappE164` and `phoneE164` validated before CTA rendering.

- [ ] **Step 1: Write failing global validation tests**

Assert all specified fields exist, anonymous reads expose only public presentation data, writes require authorized users, canonical URL is HTTPS canonical host, contact links are valid, missing/invalid WhatsApp suppresses CTA availability, and no field permits secret storage or arbitrary HTML/color.

Run: `pnpm test:integration -- tests/integration/globals.test.ts`

Expected: FAIL because globals are absent or retain template demo configuration.

- [ ] **Step 2: Implement globals**

Site Settings owns business/brand, identity assets, quotation labels, WhatsApp copy, English launch locale and presentation variants; Header owns constrained navigation/service/conversion/mobile settings; Footer owns groups/services/legal/supporting/conversion content; Contact Information owns phone/WhatsApp/email/address/map/opening hours/service areas; SEO Defaults owns title pattern/fallback/social/index/schema defaults; Social Media owns allowlisted networks with HTTPS URLs.

- [ ] **Step 3: Replace template Header/Footer plugin assumptions**

Wire current generated Header/Footer and plugins to the new global slugs and fields. Retain only search/redirect/SEO/form plugins whose public behavior can satisfy access and route contracts; disable generated demo seed/plugin defaults and generic `/services/[slug]` output.

- [ ] **Step 4: Verify and commit**

Run: `pnpm payload:generate-types && pnpm test:integration -- tests/integration/globals.test.ts && pnpm typecheck`

Expected: PASS with all six globals represented in generated types.

```bash
git add src/globals src/Header src/Footer src/plugins payload.config.ts src/payload-types.ts tests/integration
git commit -m "feat: add editable site globals"
```

### Task 9: Implement the controlled page-builder block contract

**Files:**
- Create/Replace: all `src/blocks/*/config.ts`, all `src/blocks/*/Component.tsx`, `src/blocks/RenderBlocks.tsx`
- Modify: `src/collections/Pages.ts`, `src/collections/Services.ts`, `src/collections/Projects.ts`, `src/collections/Posts.ts`
- Test: `tests/unit/blocks.test.tsx`, `tests/integration/block-schema.test.ts`

**Interfaces:**
- Produces: discriminated Payload block slugs `hero`, `richContent`, `media`, `splitContent`, `serviceGrid`, `projectGallery`, `benefits`, `processSteps`, `testimonials`, `faqs`, `locationCoverage`, `statistics`, `callToAction`, `quoteForm`; `RenderBlocks({ blocks, context }): ReactNode` with exhaustive checking.

- [ ] **Step 1: Write failing schema/render tests**

For each of 14 blocks, assert required fields, constrained variants/alignment/colors, preview labels, accessible defaults, and output landmarks/headings/labels. Assert no arbitrary HTML, CSS, script, URL protocol, custom color, or unconstrained alignment field exists. Assert Statistics cannot publish without `substantiationNote` and FAQs emit schema only when visible and eligible.

Run: `pnpm vitest run tests/unit/blocks.test.tsx && pnpm test:integration -- tests/integration/block-schema.test.ts`

Expected: FAIL naming each absent or generated-template-only block.

- [ ] **Step 2: Implement typed block configs**

Use relationship fields for services/projects/testimonials/FAQs/media, supported Lexical fields for rich content, controlled heading levels/variants, explicit image decorative/alt behavior, process ordering, and quote-form context. Never accept raw HTML or style strings.

- [ ] **Step 3: Implement minimal Server Component renderers**

Each renderer takes generated Payload types, produces semantic HTML, uses CSS classes backed by project tokens, and creates Client Components only for menu/gallery/form interaction. `RenderBlocks` must use a `never` exhaustiveness guard so a new block cannot silently fail rendering.

- [ ] **Step 4: Verify editor ordering and output**

Run: `pnpm payload:generate-types && pnpm vitest run tests/unit/blocks.test.tsx && pnpm test:integration -- tests/integration/block-schema.test.ts && pnpm typecheck`

Expected: all 14 schemas/renderers pass and types are exhaustive.

- [ ] **Step 5: Commit**

```bash
git add src/blocks src/collections src/payload-types.ts tests
git commit -m "feat: add controlled accessible page builder"
```

### Task 10: Implement design tokens, public layout, local fonts, accessibility, and RTL readiness

**Files:**
- Modify: `src/app/(frontend)/globals.css`, `src/app/(frontend)/layout.tsx`, `tailwind.config.mjs`
- Create: `src/lib/locale.ts`, `src/components/SkipLink.tsx`, `src/components/FocusTrap.tsx`, `tests/unit/locale.test.ts`, `tests/e2e/rtl.spec.ts`
- Test: `tests/e2e/layout.spec.ts`, `tests/e2e/keyboard.spec.ts`

**Interfaces:**
- Produces: `getDocumentLocale(locale): { lang: 'en' | 'ar'; dir: 'ltr' | 'rtl' }`; logical token classes; development-only `?dir=rtl` switch forbidden in production.

- [ ] **Step 1: Write failing token and direction tests**

Assert warm ivory/beige, deep charcoal, muted non-yellow gold, serif/sans/Arabic font tokens, logical spacing/border/inset properties, AA focus/contrast, reduced-motion query, no horizontal overflow at 320/768/1440 px, minimum usable touch targets, `lang=en dir=ltr`, and representative Arabic fixture at `dir=rtl` with mirrored directional controls.

Run: `pnpm vitest run tests/unit/locale.test.ts && pnpm playwright test tests/e2e/layout.spec.ts tests/e2e/rtl.spec.ts tests/e2e/keyboard.spec.ts`

Expected: FAIL on missing tokens, switch, landmarks, and interaction support.

- [ ] **Step 2: Implement the project visual system**

Define project-specific CSS variables for `--color-ivory`, `--color-beige`, `--color-charcoal`, `--color-gold-muted`, type scale, spacing, radii, shadows, focus ring, motion duration, and Arabic line height. Load locally optimized display serif and body sans via `next/font/local` with only needed weights/subsets; provide an Arabic-capable token fallback without publishing Arabic.

- [ ] **Step 3: Implement semantic and direction-aware shell**

Render skip link, announcement/header/main/footer landmarks, logical properties, visible focus, reduced-motion override, direction-aware chevrons/breadcrumbs/menu movement, and flexible wrapping. Gate test direction override behind `NODE_ENV !== 'production'`; production derives direction from active locale only.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run tests/unit/locale.test.ts && pnpm playwright test tests/e2e/layout.spec.ts tests/e2e/rtl.spec.ts tests/e2e/keyboard.spec.ts`

Expected: PASS at all viewports; RTL fixture remains non-public and production override test returns LTR English.

```bash
git add src/app/'(frontend)' src/lib/locale.ts src/components tailwind.config.mjs tests
git commit -m "feat: establish premium accessible RTL-ready design system"
```

### Task 11: Build the Header, Footer, announcement, navigation, and persistent actions

**Files:**
- Create/Replace: `src/components/Header/index.tsx`, `MobileNav.tsx`, `src/components/Footer/index.tsx`, `src/components/AnnouncementBar.tsx`, `src/components/WhatsAppAction.tsx`
- Modify: `src/app/(frontend)/layout.tsx`
- Test: `tests/unit/navigation.test.tsx`, `tests/e2e/navigation.spec.ts`

**Interfaces:**
- Consumes: Header/Footer/SiteSettings/ContactInformation globals and an optional prevalidated contact-action `href` supplied by callers.
- Produces: keyboard-operable public navigation and a mobile persistent action that suppresses itself when `href` is `null`; URL construction remains solely Task 14's responsibility.

- [ ] **Step 1: Write failing navigation tests**

Assert ordered service links use all nine fixed URLs, Projects/About/Contact links exist, logo has an accessible name, menu supports Enter/Space/Escape and focus restoration, current page is announced, footer includes contact/hours/areas/social/legal, and sticky WhatsApp does not overlap focused form or consent controls at 320 px.

Run: `pnpm vitest run tests/unit/navigation.test.tsx && pnpm playwright test tests/e2e/navigation.spec.ts`

Expected: FAIL on template navigation and absent collision/overlap behavior.

- [ ] **Step 2: Implement CMS-driven navigation**

Keep navigation data server-rendered. Limit the Client Component to mobile open/close and focus management. Use fixed canonical service helpers rather than editor-entered service URLs. Validate external social protocols and add safe `rel` values.

- [ ] **Step 3: Implement persistent action behavior**

Use a bottom safe-area offset and CSS state that moves/hides the sticky control while a form control or consent surface is active; do not cover content. Accept only a prevalidated HTTPS WhatsApp `href` prop and render nothing when it is `null`. Task 14 wires CMS contact data through the single URL builder, avoiding a temporary duplicate implementation.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run tests/unit/navigation.test.tsx && pnpm playwright test tests/e2e/navigation.spec.ts`

Expected: PASS for mouse, keyboard, touch-sized targets, and missing-contact fallback.

```bash
git add src/components src/app/'(frontend)'/layout.tsx tests
git commit -m "feat: build accessible CMS-driven site chrome"
```

### Task 12: Build homepage, service, project, blog, about, contact, and general routes

**Files:**
- Create/Replace: all route files listed in the File Map under `src/app/(frontend)`
- Create: `src/components/ServicePage.tsx`, `Breadcrumbs.tsx`, `Media/index.tsx`
- Test: `tests/integration/public-routes.test.ts`, `tests/e2e/public-routes.spec.ts`

**Interfaces:**
- Consumes: `canonicalPath`, `isPubliclyPublished`, generated Payload models, `RenderBlocks`.
- Produces: server-rendered route contract with `notFound()` for absent/private records and no public generic service route.

- [ ] **Step 1: Write failing route-table tests**

Test `/`, all nine fixed service paths, `/projects/`, project detail, `/blog/`, post detail, `/about-us/`, `/contact/`, and valid general page. Test unknown, draft, future, unpublished, route collisions, and representative generic paths such as `/services/sofa-upholstery/` and `/services/custom-wardrobes/` all return actual 404 responses. Verify consistent trailing-slash canonical behavior and no horizontal overflow.

Run: `pnpm test:integration -- tests/integration/public-routes.test.ts && pnpm playwright test tests/e2e/public-routes.spec.ts`

Expected: FAIL because dedicated routes and publication filters are incomplete.

- [ ] **Step 2: Implement the ordered homepage**

Render announcement, premium header, hero with quotation/WhatsApp, all signature services, craftsmanship, featured projects, Consultation→Design→Production→Installation, natural Ajman/Sharjah/Dubai/wider-UAE coverage, verified testimonials only, visible FAQs, final CTA, and rich footer. Preserve editorial block control while ensuring required launch composition is present in seeded content.

- [ ] **Step 3: Implement fixed service routes without duplication**

Each exact route exports a thin typed loader calling `ServicePage({ slug })`; `ServicePage` renders independently editable hero, overview, benefits, materials/capabilities, process, projects, service areas, FAQs, verified testimonials, gallery, contextual form/WhatsApp, related services, and metadata. Do not create `src/app/(frontend)/services/[slug]/page.tsx`.

- [ ] **Step 4: Implement projects, blog, about, contact, and dynamic Pages**

Indexes query published records only. Details use breadcrumbs and `notFound()`. Blog excludes drafts/future schedules and renders author/date/content/services/posts. About avoids unverified history/statistics. Contact uses globals and quote form. `[slug]` validates against the centralized registry before querying only published Pages.

- [ ] **Step 5: Verify and commit**

Run: `pnpm test:integration -- tests/integration/public-routes.test.ts && pnpm playwright test tests/e2e/public-routes.spec.ts && pnpm typecheck`

Expected: every route-table case has its expected 200/301/308/404 status, dedicated routes win, and no generic service public URL exists.

```bash
git add src/app/'(frontend)' src/components tests
git commit -m "feat: implement complete public route contract"
```

### Task 13: Secure lead submission, attribution, upload, rate limiting, and deduplication

**Files:**
- Create: `src/app/(frontend)/api/leads/route.ts`, `src/lib/attribution.ts`, `uploadSecurity.ts`, `rateLimit.ts`, `dedupe.ts`, `src/db/leadProtection.ts`, `src/components/QuoteForm.tsx`
- Test: `tests/unit/attribution.test.ts`, `upload-security.test.ts`, `tests/integration/leads-api.test.ts`, `tests/e2e/quote-form.spec.ts`

**Interfaces:**
- Produces: `LeadSubmissionSchema`; `extractAttribution(request, body): Attribution`; `validateReferenceUpload(file): Promise<SafeImage>`; `consumeRateLimit(key): Promise<{ allowed: boolean; retryAfter: number }>`; `claimSubmission(token, fingerprint): Promise<boolean>`; public response `{ ok: true } | { ok: false; code: 'invalid' | 'rate_limited' | 'duplicate' }`.

- [ ] **Step 1: Write failing abuse and privacy tests**

Cover malformed fields, missing consent, honeypot, oversized body/file, forged MIME, extension/signature mismatch, executable payload, too many requests, double click with same token, later legitimate enquiry, spoofed hidden service context, invalid UTM keys, CRLF/referrer abuse, and anonymous Lead GET/PATCH/DELETE. Assert exactly one Lead for repeated button presses and no internal ID, stack, SQL, path, validation library detail, or attribution in responses/log snapshots.

Run: `pnpm vitest run tests/unit/attribution.test.ts tests/unit/upload-security.test.ts && pnpm test:integration -- tests/integration/leads-api.test.ts`

Expected: FAIL because the controlled flow does not exist.

- [ ] **Step 2: Implement server-authoritative validation**

Validate and normalize name, phone, optional/required email by form, emirate, service, message, consent, source path, and optional project. Derive service from the server-resolved source route/record rather than a hidden field. Allowlist source host/path and UTM source/medium/campaign/term/content with length caps. Store only a salted hash/truncated security context needed for abuse handling.

- [ ] **Step 3: Implement upload, limiter, and dedupe controls**

Accept only JPEG/PNG/WebP/AVIF up to 12 MB, verify magic bytes and decoded image through Sharp, strip metadata, re-encode, randomize filename with `crypto.randomUUID`, and create Media through the controlled server path. Use atomic PostgreSQL operations in `src/db/leadProtection.ts` against non-CMS tables `lead_rate_limits` and `lead_submission_claims` so multiple Node workers cannot create duplicates. Register those tables, expiry indexes, and least-privilege grants in `src/migrations/20260912_000001_initial_alrukn.ts`; expire claims after 15 minutes and rate-limit buckets after 24 hours while permitting a later legitimate enquiry.

- [ ] **Step 4: Implement exactly-one Lead transaction and accessible form states**

Within one database transaction, claim token, create optional safe Media, then one private Lead defaulted to `new`; roll back all on failure. UI disables submit in flight, reports field errors with `aria-describedby`, exposes loading/disabled state, announces success with `role=status`, focuses the thank-you heading, and offers optional valid WhatsApp next step.

- [ ] **Step 5: Verify and commit**

Run: `pnpm vitest run tests/unit/attribution.test.ts tests/unit/upload-security.test.ts && pnpm test:integration -- tests/integration/leads-api.test.ts && pnpm playwright test tests/e2e/quote-form.spec.ts`

Expected: all pass; concurrency fixture creates exactly one Lead and unsafe files create neither Media nor Lead.

```bash
git add src/app/'(frontend)'/api/leads src/lib src/components/QuoteForm.tsx tests
git commit -m "feat: secure attributed quotation workflow"
```

### Task 14: Implement safe WhatsApp and telephone actions

**Files:**
- Create: `src/lib/contact.ts`
- Modify: `src/components/WhatsAppAction.tsx`, `src/components/QuoteForm.tsx`, `src/components/ServicePage.tsx`, contact/home/project components
- Test: `tests/unit/contact.test.ts`, `tests/e2e/contact-actions.spec.ts`

**Interfaces:**
- Produces: `normalizeUAETelephone(input: string): string | null`; `buildTelURL(input: string): string | null`; `buildWhatsAppURL({ number, service, pageURL, project, messageTemplate }): string | null`.

- [ ] **Step 1: Write failing encoding/fail-safe tests**

```ts
expect(buildWhatsAppURL({ number: '+971 50 123 4567', service: 'Sofa & Upholstery', pageURL: 'https://alruknfurniture.ae/sofa-upholstery/', project: 'Majlis #2', messageTemplate: 'Hello — {service} {page} {project}' }))
  .toBe('https://wa.me/971501234567?text=Hello%20%E2%80%94%20Sofa%20%26%20Upholstery%20https%3A%2F%2Falruknfurniture.ae%2Fsofa-upholstery%2F%20Majlis%20%232')
expect(buildWhatsAppURL({ number: 'invalid', service: 'Sofa', pageURL: '/', project: null, messageTemplate: '{service}' })).toBeNull()
expect(buildTelURL('055 000 0000')).toBe('tel:+971550000000')
```

Run: `pnpm vitest run tests/unit/contact.test.ts`

Expected: FAIL because safe builders do not exist.

- [ ] **Step 2: Implement contact normalization and templating**

Accept UAE local/mobile and E.164 forms, output digits-only WhatsApp and E.164 `tel:`, reject extensions/letters/short/oversized values. Replace only allowlisted `{service}`, `{page}`, `{project}` tokens, cap message length, and encode once with `URLSearchParams`. Missing number or invalid context returns `null` and callers render no broken CTA.

- [ ] **Step 3: Integrate contextual actions**

Service links include service/current canonical page; project links include project and related service; homepage/contact use page context. Use CMS-managed number/template every time and accessible external-link labels.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run tests/unit/contact.test.ts && pnpm playwright test tests/e2e/contact-actions.spec.ts`

Expected: PASS for encoding, missing data, sticky mobile behavior, and phone links.

```bash
git add src/lib/contact.ts src/components src/app/'(frontend)' tests
git commit -m "feat: add safe contextual contact actions"
```

### Task 15: Seed original launch content and attributed royalty-free imagery

**Files:**
- Create: `src/seed/index.ts`, `src/seed/content.ts`, `src/seed/media-manifest.json`, `docs/operations/content-and-media-register.md`
- Test: `tests/integration/seed.test.ts`, `tests/unit/content-integrity.test.ts`

**Interfaces:**
- Produces: `seedAlRukn(payload): Promise<{ created: number; updated: number }>` idempotently keyed by stable slugs/identifiers; media manifest entries `{ filename, sourceURL, creator, licenseName, licenseURL, downloadedAt, sha256, intendedUse }`.

- [ ] **Step 1: Write failing completeness and integrity tests**

Assert all nine service records exist once, every route has original non-duplicate copy, homepage order is complete, required globals are populated, testimonials remain unpublished without business-supplied verification, Statistics remain unpublished without substantiation, media manifest covers every launch image checksum, no generated-template strings/assets survive, and copy contains no age/award/client-count/guarantee/urgency claims.

Run: `pnpm test:integration -- tests/integration/seed.test.ts && pnpm vitest run tests/unit/content-integrity.test.ts`

Expected: FAIL because launch seed does not exist.

- [ ] **Step 2: Write original English content**

Create distinct UAE-intent copy for Sofa Upholstery, Custom Furniture, Custom Sofa, Majlis Furniture, Curtains & Blinds, Sofa Repair, Custom Wardrobes, Custom Beds & Headboards, and Office Furniture. Include natural Ajman, Sharjah, Dubai, and wider UAE context only where useful. Seed homepage, About, Contact, project/blog scaffolding only with verified facts, visible FAQ answers, and conversion copy; do not invent project outcomes, testimonials, ratings, business history, numbers, or guarantees.

- [ ] **Step 3: Acquire and register launch imagery**

Use only royalty-free sources whose license permits website use. For each downloaded original, record direct source page, creator, license basis/URL, date, SHA-256, and intended placement before import. Import through Media with alt/decorative state, caption, focal point, source and license notes. Do not use hotlinks, template images, or images lacking a traceable source page.

- [ ] **Step 4: Make seed idempotent and reversible**

Upsert by stable slug/key, never duplicate records, never overwrite editor-changed records unless `SEED_FORCE=true` is explicitly set in non-production, and support deleting only records stamped with the seed batch ID.

- [ ] **Step 5: Verify and commit**

Run: `pnpm seed && pnpm seed && pnpm test:integration -- tests/integration/seed.test.ts && pnpm vitest run tests/unit/content-integrity.test.ts && pnpm template:check`

Expected: second seed reports `created: 0`; all integrity tests pass; media checksums match; no template/demo artifact remains.

```bash
git add src/seed docs/operations/content-and-media-register.md tests
git commit -m "content: seed original attributed launch experience"
```

### Task 16: Implement metadata, schema, breadcrumbs, sitemap, robots, redirects, and true 404s

**Files:**
- Create: `src/lib/seo.ts`, `schema.ts`, `breadcrumbs.ts`, `src/components/JsonLd.tsx`, `Breadcrumbs.tsx`, `src/app/(frontend)/sitemap.ts`, `robots.ts`, `not-found.tsx`, `src/middleware.ts`
- Modify: route `page.tsx` metadata exports
- Test: `tests/unit/seo.test.ts`, `schema.test.ts`, `tests/integration/discovery.test.ts`, `tests/e2e/seo.spec.ts`

**Interfaces:**
- Produces: `buildMetadata(record, defaults): Metadata`; `buildSchemas(context): JsonLdObject[]`; `buildBreadcrumbs(path, record): Breadcrumb[]`; `getSitemapEntries(payload): Promise<MetadataRoute.Sitemap>`; deterministic redirect middleware.

- [ ] **Step 1: Write failing SEO contract tests**

Assert title/description/canonical/OG/Twitter/social image/index-follow for every content type; Organization and LocalBusiness from globals; Service only on qualifying service pages; Article only for published posts; FAQPage only for the exact visible eligible FAQ set; BreadcrumbList exactly matches visible breadcrumbs; sitemap contains canonical indexable published URLs only; admin/API/draft/future/private routes are absent; robots is production-sensitive; redirect statuses are exact; unknown routes return status 404 with branded useful content.

Run: `pnpm vitest run tests/unit/seo.test.ts tests/unit/schema.test.ts && pnpm test:integration -- tests/integration/discovery.test.ts`

Expected: FAIL due to missing builders and generated defaults.

- [ ] **Step 2: Implement validated metadata and schema**

Resolve same-origin canonical URLs against `https://alruknfurniture.ae`, reject unsupported schema claims, serialize JSON-LD with `<` escaped, and derive values only from published records/validated globals. Apply defaults without inventing missing facts. Social previews use Media relations and explicit dimensions.

- [ ] **Step 3: Implement sitemap, robots, breadcrumbs, redirects, and 404**

Sitemap includes `/`, nine fixed services, projects/posts/general pages that are published/indexable, with canonical paths only. Production robots permits public pages and disallows admin/API/private paths; non-production disallows all. Middleware resolves only validated same-origin path redirects and never supersedes application-owned routes. Use Next `notFound()` so HTTP status is 404.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run tests/unit/seo.test.ts tests/unit/schema.test.ts && pnpm test:integration -- tests/integration/discovery.test.ts && pnpm playwright test tests/e2e/seo.spec.ts`

Expected: PASS; schema validator reports no unsupported type, redirect tests preserve path/query as configured, and unknown route response status is `404`.

```bash
git add src/lib src/components src/app/'(frontend)' src/middleware.ts tests
git commit -m "feat: implement complete SEO and discovery contract"
```

### Task 17: Complete previews, drafts, scheduled publication, and cache revalidation

**Files:**
- Create/Modify: `src/app/(frontend)/api/preview/route.ts`, `exit-preview/route.ts`, `revalidate/route.ts`, `src/hooks/revalidateContent.ts`
- Modify: collection preview configs and public data loaders
- Test: `tests/integration/preview-revalidation.test.ts`

**Interfaces:**
- Produces: secret-protected preview session; revalidation endpoint accepts signed internal requests only; content hooks revalidate exact paths/tags.

- [ ] **Step 1: Write failing separation tests**

Assert editors with valid preview secret/session can see a named draft, anonymous users cannot, future scheduled records remain hidden, invalid secrets return 401 without detail, publish/unpublish invalidates detail/index/home/sitemap relationships, and cache refresh never leaks draft content.

Run: `pnpm test:integration -- tests/integration/preview-revalidation.test.ts`

Expected: FAIL on generated preview assumptions or incomplete invalidation.

- [ ] **Step 2: Implement protected preview and revalidation**

Use separate non-public `PREVIEW_SECRET` and `REVALIDATION_SECRET`, constant-time comparison, authenticated Payload user check for preview, secure HTTP-only same-site cookie, allowlisted canonical preview paths, and POST-only signed revalidation. Never put secrets in query logs, client bundles, globals, or `NEXT_PUBLIC_` variables.

- [ ] **Step 3: Verify cache behavior**

Run: `pnpm test:integration -- tests/integration/preview-revalidation.test.ts`

Expected: PASS for draft isolation, scheduled timing, publish, update, unpublish, delete, related indexes, homepage, and sitemap.

- [ ] **Step 4: Commit**

```bash
git add src/app/'(frontend)'/api src/hooks src/collections tests/integration
git commit -m "feat: secure preview publication and revalidation"
```

### Task 18: Complete application-level accessibility, security, and responsive verification

**Files:**
- Create: `tests/e2e/accessibility.spec.ts`, `security.spec.ts`, `responsive.spec.ts`, `admin.spec.ts`, `media.spec.ts`
- Modify: components/routes only where a failing test demonstrates a defect
- Test: same files

**Interfaces:**
- Consumes: complete application.
- Produces: automated release evidence for WCAG 2.2 AA practices, admin authorization, upload security, and public privacy boundaries.

- [ ] **Step 1: Add failing axe and manual-keyboard assertions**

Run axe on home, one service, project, post, about, contact, and general page at mobile/desktop. Assert landmarks, logical headings, focus order/visibility, menu/gallery/dialog/form keyboard operation, labels/autocomplete/errors/status, image alt rules, contrast, reduced motion, touch targets, and no horizontal overflow.

Run: `pnpm playwright test tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts`

Expected: FAIL with concrete selectors/rules for any remaining defect; no broad rule disable is allowed.

- [ ] **Step 2: Add failing security and Admin matrices**

Verify anonymous Admin/private CRUD denial, authenticated authorized CRUD/preview for every collection/global, public registration denial, Lead/API privacy, unsafe upload rejection, production error redaction, rich-text sanitization, and protected route denial. Use a disposable test admin created directly through the test setup and removed in teardown; never store credentials in Git.

Run: `pnpm playwright test tests/e2e/security.spec.ts tests/e2e/admin.spec.ts tests/e2e/media.spec.ts`

Expected: FAIL for each unresolved boundary, with no secret values printed.

- [ ] **Step 3: Make minimal targeted fixes**

Correct only demonstrated semantic, focus, contrast, responsive, sanitization, access, or error-boundary defects. Retain Server Components by default and do not add client JavaScript to solve CSS-only behavior.

- [ ] **Step 4: Verify and commit**

Run: `pnpm test:unit && pnpm test:integration && pnpm playwright test tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts tests/e2e/security.spec.ts tests/e2e/admin.spec.ts tests/e2e/media.spec.ts`

Expected: all tests pass with zero serious/critical axe violations and no unresolved release-blocking findings.

```bash
git add tests src
git commit -m "test: enforce accessibility and security gates"
```

### Task 19: Enforce performance, optimized media, and production build quality

**Files:**
- Modify: `next.config.ts`, media components, route loaders
- Create: `lighthouserc.json`, `tests/e2e/performance.spec.ts`
- Test: `tests/e2e/performance.spec.ts`

**Interfaces:**
- Produces: responsive `next/image` sizes/focal crops, local font subsets, lazy below-fold media, immutable static caching, standalone output, Lighthouse budgets.

- [ ] **Step 1: Write failing performance assertions**

Assert all public images have dimensions and `sizes`, hero has intentional priority only when above fold, below-fold images lazy-load, no layout shift from missing media boxes, production client bundles exclude server-only Payload/database modules, and third-party scripts are absent unless approved.

Run: `pnpm playwright test tests/e2e/performance.spec.ts && pnpm build`

Expected: test or build FAIL until all generated/demo media and bundle issues are resolved.

- [ ] **Step 2: Implement minimal optimization**

Use `next/image` with focal-position styles, AVIF/WebP, stable aspect ratios, selective priority, and lazy defaults. Limit local font weights/subsets, use Server Components for data/rendering, use small Client Components for mobile menu/gallery/form only, enable compression and immutable caching for fingerprinted assets.

- [ ] **Step 3: Set measurable Lighthouse budgets**

Configure mobile production budgets on home, one service, project, blog post, and contact: performance score `>=0.85`, accessibility `>=0.95`, best-practices `>=0.95`, SEO `>=0.95`, CLS `<=0.1`, LCP `<=2.5s`, and total blocking time `<=300ms` in the controlled staging run. Record environment variance rather than silently lowering thresholds.

- [ ] **Step 4: Verify standalone output and commit**

Run: `pnpm build && test -f .next/standalone/server.js && pnpm exec lhci autorun`

Expected: build exits `0`, standalone server exists, and every configured budget passes.

```bash
git add next.config.ts src lighthouserc.json tests/e2e/performance.spec.ts
git commit -m "perf: enforce media and production budgets"
```

### Task 20: Create database migrations and prove clean/upgrade paths

**Files:**
- Create: generator-produced `src/migrations/20260912_000001_initial_alrukn.ts` (rename the generated timestamped file to this deterministic migration ID before commit), `src/migrations/index.ts`
- Modify: `payload.config.ts`, `package.json`
- Test: `tests/integration/migrations.test.ts`

**Interfaces:**
- Produces: ordered Payload migrations that create the full schema without seed dependence and upgrade the staged database without data loss.

- [ ] **Step 1: Generate a migration from the final typed schema**

Run: `pnpm payload migrate:create initial_alrukn`

Expected: one timestamped migration and updated migration index; inspect SQL/operations for every collection/global and unique slug constraints.

- [ ] **Step 2: Write failing clean-and-upgrade migration tests**

Test A creates an empty temporary PostgreSQL database, applies all migrations, and queries required tables/indexes. Test B restores a pre-migration staged snapshot, applies migrations, and verifies record counts/content checksums are preserved.

Run: `pnpm test:integration -- tests/integration/migrations.test.ts`

Expected: FAIL until migration registration and fixtures are correct.

- [ ] **Step 3: Correct migration behavior without destructive shortcuts**

Use additive/transforming migrations, explicit transactions where supported, and a documented backup prerequisite for destructive changes. The initial migration must explicitly include the non-CMS `lead_rate_limits` and `lead_submission_claims` tables, expiry indexes, uniqueness required for atomic claims, and grants limited to `alrukn_app`. Never use production schema push as a substitute for migrations.

- [ ] **Step 4: Verify and commit**

Run: `pnpm payload:migrate && pnpm test:integration -- tests/integration/migrations.test.ts`

Expected: clean path and staged upgrade path pass; second migration application reports no pending migrations.

```bash
git add src/migrations payload.config.ts package.json tests/integration/migrations.test.ts
git commit -m "db: add verified Payload migrations"
```

### Task 21: Implement protected automated backups, retention, and restore testing

**Files:**
- Create: `scripts/backup.sh`, `scripts/rotate-backups.py`, `scripts/restore-test.sh`, `deploy/systemd/alruknfurniture-backup.service`, `deploy/systemd/alruknfurniture-backup.timer`, `docs/operations/backup-restore.md`
- Test: `tests/ops/backup.bats`, `tests/ops/restore.bats`

**Interfaces:**
- Produces: `/www/backup/alruknfurniture/{daily,weekly,monthly,wordpress,restore-tests}/`; daily PostgreSQL/media/config/Nginx/PM2 archives; retention 14 daily/8 weekly/6 monthly; non-zero failure and operator-visible systemd failure.

- [ ] **Step 1: Write failing backup/retention tests**

Use temporary fixture directories and a disposable database. Assert owner-only modes, no web-root placement, successful `pg_dump` custom format, media/config checksum manifest, atomic `.partial` rename, 14/8/6 retention, final WordPress snapshot protection for at least 30 days plus stabilization/restore flags, failure cleanup/non-zero exit, and no secrets printed.

Run: `bats tests/ops/backup.bats tests/ops/restore.bats`

Expected: FAIL because scripts/services do not exist.

- [ ] **Step 2: Implement the backup script**

Create date-stamped owner-only staging directory under `/www/backup/alruknfurniture`, run `pg_dump --format=custom --dbname="$DATABASE_URI"`, archive Payload uploads, protected `.env`, release/PM2/Nginx config, create SHA-256 manifest, then atomically rename. Read secrets from root-only environment file; log names/status only. Optional off-server transfer must encrypt before transfer.

- [ ] **Step 3: Implement retention and alerting**

Daily timer invokes backup and promotes weekly/monthly snapshots deterministically, retaining exactly 14 daily, 8 weekly, and 6 monthly completed copies. Configure `OnFailure=` or equivalent operator-visible alert unit and preserve non-zero exit. Never rotate the final WordPress backup before 30 days and successful restore/stabilization markers.

- [ ] **Step 4: Implement non-public restore proof**

Set `RESTORE_ID="$(date -u +%Y%m%dT%H%M%SZ)"`; restore the latest DB into a temporary local-only database and media/config into `/www/backup/alruknfurniture/restore-tests/${RESTORE_ID}`, compare manifest and record/media counts, run Payload health/query smoke tests on localhost only, then destroy the temporary DB and protected files. Do not overwrite production or expose the recovery target.

- [ ] **Step 5: Verify and commit**

Run: `bats tests/ops/backup.bats tests/ops/restore.bats && sudo systemd-analyze verify deploy/systemd/alruknfurniture-backup.service deploy/systemd/alruknfurniture-backup.timer`

Expected: PASS; test failure fixture exits non-zero and alert path is observable.

```bash
git add scripts/backup.sh scripts/rotate-backups.py scripts/restore-test.sh deploy/systemd docs/operations/backup-restore.md tests/ops
git commit -m "ops: add protected backup and restore automation"
```

### Task 22: Build the standalone PM2 release and verify localhost-only runtime

**Files:**
- Create: `deploy/ecosystem.config.cjs`, `scripts/build-release.sh`
- Modify: `.gitignore`, `docs/operations/cutover-rollback.md`
- Test: `tests/ops/pm2.bats`

**Interfaces:**
- Produces: immutable pre-cutover release at `/www/wwwroot/alruknfurniture-releases/${RELEASE_SHA}`, where `RELEASE_SHA="$(git rev-parse HEAD)"`, and candidate symlink `/www/wwwroot/alruknfurniture-candidate`; PM2 process `alruknfurniture`; Node bound to `127.0.0.1:3100`. Neither release assembly nor candidate runtime writes below the live WordPress root `/www/wwwroot/alruknfurniture.ae`.

- [ ] **Step 1: Write failing release/PM2 tests**

Assert standalone server/static/public/uploads layout, release ID equals Git SHA, process cwd points to immutable `/www/wwwroot/alruknfurniture-releases/${RELEASE_SHA}`, host is `127.0.0.1`, port is exactly `3100` and unused, restart-on-failure enabled, secrets are loaded from root-owned mode-0600 `/etc/alruknfurniture/.env`, logs are protected/rotated, and `pm2 save` plus startup service is configured.

Run: `bats tests/ops/pm2.bats`

Expected: FAIL because release builder and PM2 config do not exist.

- [ ] **Step 2: Implement reproducible release assembly**

Run frozen install, all application gates, migrations against approved target, production build, then copy `.next/standalone`, `.next/static`, `public`, required migration metadata, and a `RELEASE.json` containing Git SHA/build time/tool versions into a new release directory. Link uploads to protected persistent local storage; never copy `.git`, tests, source maps intended to remain private, or development env.

- [ ] **Step 3: Configure PM2**

Use process name `alruknfurniture`, script `server.js`, `HOSTNAME=127.0.0.1`, `PORT=3100`, production mode, bounded memory restart, exponential restart delay, timestamped protected logs, and root-owned mode-0600 `/etc/alruknfurniture/.env`. Run `ss -ltn '( sport = :3100 )'` before start and block if another listener owns the port. Run `pm2 save` and generate/enable the supported startup unit.

- [ ] **Step 4: Verify runtime and commit**

Run: `bats tests/ops/pm2.bats && curl --fail --silent http://127.0.0.1:3100/health`

Expected: tests pass; health returns minimal `{"ok":true}`; `ss` shows the Node listener only on `127.0.0.1`, not `0.0.0.0` or `::`.

```bash
git add deploy/ecosystem.config.cjs scripts/build-release.sh .gitignore docs/operations/cutover-rollback.md tests/ops/pm2.bats
git commit -m "ops: package standalone PM2 releases"
```

### Task 23: Configure Nginx, canonical HTTPS, SSL preservation, and sensitive denials

**Files:**
- Create: `deploy/nginx/alruknfurniture.conf`, `scripts/test-nginx-candidate.sh`, `scripts/verify-sensitive-denials.sh`
- Test: `tests/ops/nginx.bats`

**Interfaces:**
- Produces: Nginx upstream to `127.0.0.1:3100`; canonical `https://alruknfurniture.ae`; retained certificate `/www/server/panel/vhost/cert/alruknfurniture.ae/fullchain.pem` and key `/www/server/panel/vhost/cert/alruknfurniture.ae/privkey.pem`; TLS 1.2/1.3 only.

- [ ] **Step 1: Inventory current configuration without modifying it**

Run: `sudo nginx -T > /www/backup/alruknfurniture/nginx-preplan-inventory.txt && sudo stat -c '%a %U:%G %n' /www/server/panel/vhost/cert/alruknfurniture.ae/fullchain.pem /www/server/panel/vhost/cert/alruknfurniture.ae/privkey.pem`

Expected: active server blocks, canonical hosts, document root, and the exact certificate paths are recorded in an owner-readable backup; the inventory confirms the same paths before any candidate is accepted. Do not renew or relocate certificates during cutover.

- [ ] **Step 2: Write failing Nginx behavior tests**

Assert HTTP→HTTPS and `www`→non-`www` permanent redirects preserve path/query in one or bounded non-looping hops; canonical host proxies to localhost; certificate paths equal inventory; TLS 1.0/1.1 fail and TLS 1.2/1.3 succeed; directory listing is off; `.env`, `.git`, backups, SQL/dumps, source maps, package/source files, private/debug endpoints, and unauthorized internal operations are denied; required Payload Admin API/media routes and the controlled public lead endpoint remain reachable through application access control; proxy headers/body/upload/timeouts are explicit.

Run: `bats tests/ops/nginx.bats`

Expected: FAIL because candidate config is absent/not active.

- [ ] **Step 3: Implement candidate Nginx configuration**

Create separate HTTP redirect blocks and TLS canonical/noncanonical blocks using exact existing certificate paths. Proxy to localhost upstream with Host, real IP, forwarded protocol/host; allow required Payload Admin API/media routes, static assets, and the controlled lead upload body size; disable autoindex; return 404/deny sensitive filesystem and debug patterns before proxying without blanket-blocking `/api`; omit public source maps; add immutable asset caching and safe baseline headers compatible with Payload Admin.

- [ ] **Step 4: Validate candidate without switching public traffic**

Create `scripts/test-nginx-candidate.sh` to render the candidate into an isolated temporary Nginx prefix with localhost-only listeners `127.0.0.1:18080` and `127.0.0.1:18443`, separate PID/log/temp paths, the real certificate/key paths, and upstream `127.0.0.1:3100`. The script must run syntax validation, start only that isolated instance, execute `curl --resolve alruknfurniture.ae:18443:127.0.0.1 --cacert /www/server/panel/vhost/cert/alruknfurniture.ae/fullchain.pem https://alruknfurniture.ae:18443/health`, exercise redirect/denial tests, and always stop/remove the isolated instance through a trap.

Run: `sudo scripts/test-nginx-candidate.sh`

Expected: candidate syntax succeeds and isolated local canonical TLS reverse-proxy health/redirect/denial checks pass without changing, reloading, or including the production Nginx configuration. If the certificate chain cannot validate against the supplied chain, verify against the system trust store plus recorded certificate fingerprint; never use `-k` as release evidence.

- [ ] **Step 5: Commit**

```bash
git add deploy/nginx scripts/test-nginx-candidate.sh scripts/verify-sensitive-denials.sh tests/ops/nginx.bats
git commit -m "ops: add hardened canonical Nginx proxy"
```

### Task 24: Build the complete pre-cutover gate and evidence collector

**Files:**
- Create: `scripts/pre-cutover.sh`, `scripts/collect-release-evidence.sh`, `docs/operations/release-checklist.md`, `docs/operations/delivery-record.md`
- Test: `tests/ops/pre-cutover.bats`

**Interfaces:**
- Produces: immutable evidence directory `/www/backup/alruknfurniture/release-evidence/${RELEASE_SHA}/`, where `RELEASE_SHA="$(git rev-parse HEAD)"`; `pre-cutover.sh` exits `0` only when all 26 Section 19 gates have recorded pass artifacts.

- [ ] **Step 1: Write failing gate completeness test**

Represent gates as numbered IDs `01` through `26`; assert every ID has a command, expected predicate, evidence filename, timestamp, release SHA, and pass/fail state. Assert any missing/failing/stale gate blocks exit `0` and cutover invocation.

Run: `bats tests/ops/pre-cutover.bats`

Expected: FAIL because gate matrix/evidence collector is absent.

- [ ] **Step 2: Implement gates 1–9**

Record strict typecheck; ESLint; unit/integration; clean and staged migration paths; `pnpm build` plus standalone file; PM2 start/health/startup; isolated candidate Nginx syntax and reverse-proxy verification through `sudo scripts/test-nginx-candidate.sh`; responsive mobile/tablet/desktop. The active production `nginx -t` is deliberately deferred to the explicitly approved cutover transaction after the prevalidated candidate is installed. Each command must use `set -euo pipefail`, redact secrets, and retain full stdout/stderr in owner-only evidence files.

- [ ] **Step 3: Implement gates 10–18**

Record Admin auth/access/preview/CRUD for every collection/global; safe media behavior; exact-one Lead/status/attribution/privacy; WhatsApp/phone; all routes; all collision/publication cases; full SEO/discovery; true 404; accessibility/manual keyboard evidence.

- [ ] **Step 4: Implement gates 19–26**

Record Lighthouse/Core Web Vitals review; canonical redirect chains; certificate paths/TLS versions; PostgreSQL local role/external denial; sensitive/private denial; completed backup plus non-public restore; rollback rehearsal; reboot persistence for PM2/Nginx/PostgreSQL/backup timer.

- [ ] **Step 5: Populate the delivery record deterministically**

Capture installed software versions, template source/MIT reference, staging/application/release path, release/Git SHA and clean status, Node port/PM2 name, DB name/local-only confirmation without credentials, Admin/production URLs, active Nginx config, redirects, certificate paths/status/protocols, backup location/schedule/retention/last success/restore result, rollback artifact/proof, all gate evidence links, and clearly labeled business-supplied content/contact items awaiting replacement.

- [ ] **Step 6: Verify and commit**

Run: `bats tests/ops/pre-cutover.bats && sudo -E scripts/pre-cutover.sh --release "$(git rev-parse HEAD)" --dry-run`

Expected: fixture suite passes; dry-run enumerates exactly 26 gates and refuses cutover because dry-run evidence is not production approval.

```bash
git add scripts/pre-cutover.sh scripts/collect-release-evidence.sh docs/operations tests/ops/pre-cutover.bats
git commit -m "ops: codify all pre-cutover release gates"
```

### Task 25: Implement snapshot tooling and rehearse atomic cutover/rollback

**Files:**
- Create: `scripts/cutover.sh`, `scripts/rollback.sh`
- Modify: `docs/operations/cutover-rollback.md`
- Test: `tests/ops/cutover-rollback.bats`

**Interfaces:**
- Produces: tested snapshot/cutover/rollback scripts and fixture-only rehearsal evidence. This task does not create the real final WordPress snapshot and does not write to the live WordPress root or active Nginx configuration. In approved Task 26 live mode, the scripts create the timestamped final snapshot under `/www/backup/alruknfurniture/wordpress/${SNAPSHOT_ID}`, where `SNAPSHOT_ID="$(date -u +%Y%m%dT%H%M%SZ)"`, perform the atomic switch, and can restore the exact prior Nginx config/upstream and WordPress state.

- [ ] **Step 1: Write failing cutover safety tests**

Assert cutover refuses without: exact approved release SHA, clean Git state, all 26 fresh passing evidence markers, final WordPress file/DB backup and checksum, Nginx backup, successful restore test, rollback dry-run, healthy local app/admin/lead path, and explicit operator confirmation. Assert an injected post-switch health failure invokes rollback and restores previous upstream/config without path/query redirect breakage.

Run: `bats tests/ops/cutover-rollback.bats`

Expected: FAIL because atomic scripts do not exist.

- [ ] **Step 2: Implement and test the final WordPress snapshot function without touching live data**

Implement a snapshot function that, only in explicitly approved live mode, archives the supplied WordPress root preserving ownership/modes and dumps its configured database with credentials read from protected `wp-config.php` without logging them. It must save checksums, the supplied Nginx config, DB metadata, timestamp, and restore commands under an owner-only backup directory; verify the archive and restore into a supplied non-public temporary database; and mark retention `not-before = cutover + 30 days`, additionally requiring new-system restore and stabilization approval. In this task, execute it only against fixture WordPress files, a disposable fixture database, a copied fixture Nginx config, and a temporary backup root; assert any live production path is rejected unless a valid approval file and live-mode flag are both present.

- [ ] **Step 3: Implement atomic cutover**

Acquire an exclusive lock; re-run time-sensitive health/backup/Nginx checks; record old release/upstream/config. After the verified WordPress snapshot exists and explicit cutover approval is present, atomically rename the live WordPress directory to the snapshot's protected retained-files location and create `/www/wwwroot/alruknfurniture.ae` as a symlink to `/www/wwwroot/alruknfurniture-releases/${RELEASE_SHA}`; then enable the prevalidated Nginx upstream, run `nginx -t`, and reload (not stop/start) Nginx. Test canonical homepage, Admin login page, all route classes, sitemap/robots/404, and a tagged cutover test Lead that authorized staff confirm and remove. Do not delete or modify the retained WordPress snapshot.

- [ ] **Step 4: Implement complete rollback**

On trigger—failed health, admin authentication, lead submission, severe route/SEO failure, DB failure, or unsafe exposure—remove the new application symlink and atomically restore the retained WordPress directory to `/www/wwwroot/alruknfurniture.ae`, restore the prior Nginx config/upstream, validate/reload Nginx, stop or detach the new PM2 process as appropriate, restore the WordPress database only if changed, and verify old homepage/Admin, canonical redirects, DB connectivity, and logs. Record reason, timings, commands, hashes, and post-rollback checks without secrets.

- [ ] **Step 5: Rehearse without public DNS traffic**

Run the scripts against fixture release/upstream/config paths and localhost host resolution, inject each rollback trigger, and verify exact prior state restoration.

Run: `bats tests/ops/cutover-rollback.bats && sudo scripts/cutover.sh --rehearse --release "$(git rev-parse HEAD)"`

Expected: all fixtures pass; rehearsal switches then restores without touching live public traffic or deleting WordPress.

- [ ] **Step 6: Commit**

```bash
git add scripts/cutover.sh scripts/rollback.sh docs/operations/cutover-rollback.md tests/ops/cutover-rollback.bats
git commit -m "ops: add atomic cutover and proven rollback"
```

### Task 26: Run final pre-cutover verification, perform approved cutover, and close the delivery record

**Files:**
- Modify: `docs/operations/release-checklist.md`, `docs/operations/delivery-record.md`
- Create: runtime evidence only under `/www/backup/alruknfurniture/release-evidence/${RELEASE_SHA}/`, where `RELEASE_SHA="$(git rev-parse HEAD)"` (not Git)
- Test: complete suites and operational gates

**Interfaces:**
- Consumes: immutable candidate release, all scripts/runbooks, operator-supplied verified business contact data, active certificate paths, and explicit cutover approval.
- Produces: either a verified production deployment with all 26 gates passed or no traffic change; completed delivery record references evidence without secrets.

- [ ] **Step 1: Confirm content and contact readiness**

In Payload Admin, have the authorized business owner verify brand name, logo, phone, WhatsApp, email, address, hours, service areas, original service copy, project facts, testimonials/consent, statistics/substantiation, legal links, and every image source/license. Keep unverified testimonials/statistics/projects unpublished; list remaining business replacements explicitly in the delivery record.

Expected: signed/dated content checklist; no unsupported public claim.

- [ ] **Step 2: Run the complete application suite from a clean checkout**

Run: `pnpm install --frozen-lockfile && pnpm template:check && pnpm env:check && pnpm lint && pnpm typecheck && pnpm test:unit && pnpm test:integration && pnpm test:e2e && pnpm test:a11y && pnpm test:security && pnpm build && pnpm test:performance`

Expected: every command exits `0`; `.next/standalone/server.js` exists; Git remains clean except the intentionally updated delivery documents.

- [ ] **Step 3: Run migration, runtime, network, backup, restore, and rollback gates**

Run: `sudo -E scripts/pre-cutover.sh --release "$(git rev-parse HEAD)"`

Expected: exactly 26 fresh gate entries all marked PASS, evidence owner-readable only, no credential/internal personal data emitted, and release SHA matches the candidate.

- [ ] **Step 4: Obtain explicit operator cutover approval**

Present the release SHA, all-gates-pass summary, snapshot procedure and expected destination, tested rollback command, expected interruption, and monitoring window. Do not create the real final WordPress snapshot or run any live mode without explicit approval recorded outside the repository.

Expected: approval identifies operator, release SHA, and timestamp.

- [ ] **Step 5: Create and verify the final WordPress snapshot, then execute atomic cutover and monitor**

After approval, run the script's live pre-switch phase to create the actual WordPress files/database snapshot, checksum manifest, active Nginx copy, and non-public restore proof. Confirm the snapshot ID/path/hash and rollback inputs are recorded before permitting the first live rename, active Nginx write, reload, or traffic change.

Run: `sudo scripts/cutover.sh --release "$(git rev-parse HEAD)" --approval-file /root/protected/alrukn-cutover-approval.json`

Expected: atomic switch, `nginx -t` success, reload success, canonical TLS site/Admin/lead/route/SEO health, PM2 stable, PostgreSQL local-only, and no elevated 5xx/security errors during the agreed monitoring window. Any trigger invokes `sudo scripts/rollback.sh --latest` immediately.

- [ ] **Step 6: Run post-cutover backup and non-public restore**

Run: `sudo systemctl start alruknfurniture-backup.service && sudo scripts/restore-test.sh --latest`

Expected: daily backup has a complete checksum manifest, restore test succeeds against a non-public target, timer is enabled, and final WordPress snapshot retention remains locked.

- [ ] **Step 7: Complete and commit the delivery record**

Update `docs/operations/delivery-record.md` with every item required by Section 20 and stable evidence paths/checksums, excluding secrets and personal lead data.

Run: `git diff --check && git status --short && test "$(find /www/backup/alruknfurniture/release-evidence/"$(git rev-parse HEAD)" -name '*.pass' | wc -l)" -eq 26`

Expected: no whitespace errors; only delivery/checklist files intentionally changed; exactly 26 pass markers exist.

```bash
git add docs/operations/release-checklist.md docs/operations/delivery-record.md
git commit -m "docs: record verified Al Rukn production delivery"
```

## Self-Review Record

### Spec coverage

- [x] Sections 1–2 outcomes/scope/non-goals: represented in Goal, Global Constraints, Tasks 12–19, and release gating; no commerce, accounts, Arabic publication, or legacy-content import introduced.
- [x] Section 3 architecture: Tasks 1–2, 20, 22–23 establish official template provenance, one Next/Payload app, strict TypeScript, Tailwind, local PostgreSQL `alrukn_furniture`, Server Components, standalone output, PM2, Nginx, local uploads, Git, and exact environment names.
- [x] Section 4 routes: centralized contract in Task 3 and exhaustive implementation/verification in Task 12, including normalized `custom-wardrobes` and no generic public service route.
- [x] Sections 5–7 visual and page experiences: Tasks 9–12 implement the premium restrained system, ordered homepage, services, projects, blog, About, Contact, dynamic Pages, responsive behavior, and accessible interaction.
- [x] Sections 8–10 CMS model/globals/blocks/editorial controls: Tasks 4–9 define every named collection, global, block, access rule, field group, revision/preview control, and constrained editor option.
- [x] Section 11 conversion: Tasks 13–14 cover validation, honeypot, rate limits, safe uploads, attribution, exactly-one private Lead, deduplication, consent, thank-you state, contextual WhatsApp, phone, and fail-safe missing numbers.
- [x] Sections 12–13 SEO and collision safety: Tasks 3, 12, and 16 cover metadata, schema, sitemap, robots, canonical, breadcrumbs, redirects, real 404, all reserved exact/prefix cases, normalization/duplicates, and publication filtering.
- [x] Section 14 localization/RTL readiness: Tasks 3 and 10 cover locale-capable architecture, lang/dir, logical properties, direction-aware UI, Arabic-capable type token, longer/mixed copy, future locale collision strategy, and non-public representative Arabic fixture.
- [x] Sections 15–17 accessibility/performance/security/privacy: Tasks 5, 9–10, 13–19 and 23 cover WCAG 2.2 AA practices, content truth/licensing, image/font/caching/revalidation performance, private access, local bindings, safe errors, TLS, secrets, uploads, and sensitive denials.
- [x] Section 18 deployment/backups/recovery/rollback: Tasks 21–23 and 25 cover the separate staging/live paths, final WordPress snapshot, atomic release/upstream change, `/www/backup/alruknfurniture/`, daily/weekly/monthly retention, alerting, encryption rule, restore proof, 30-day minimum, and exact rollback mechanics.
- [x] Section 19 all 26 release gates: Task 24 maps and records all 26; Task 26 runs them and requires exactly 26 fresh pass markers before cutover.
- [x] Section 20 acceptance/delivery record: Task 26 requires final software/template/release/Git/port/PM2/DB/Admin/URL/Nginx/SSL/backup/restore/rollback/gate/business-content evidence.

### Consistency review

- [x] Exact production environment names are consistently `DATABASE_URI`, `PAYLOAD_SECRET`, and `NEXT_PUBLIC_SERVER_URL`; the production URL is consistently `https://alruknfurniture.ae`.
- [x] Database is consistently `alrukn_furniture`; application role is consistently `alrukn_app`; credentials are never embedded in a committed file or expected output.
- [x] Fixed service slugs are defined once as `FIXED_SERVICE_SLUGS` and consumed by validation, collection schemas, routes, navigation, seed, sitemap, and tests.
- [x] Lead statuses use one machine representation—`new`, `contacted`, `quotation-sent`, `won`, `lost`—with UI labels `New`, `Contacted`, `Quotation Sent`, `Won`, `Lost`.
- [x] Public lead creation occurs only through `src/app/(frontend)/api/leads/route.ts`; collection access remains anonymous-deny for every operation.
- [x] The official generator writes only to a temporary empty directory, then `rsync` imports into the existing staging Git worktree without touching `/www/wwwroot/alruknfurniture.ae`.
- [x] Current official template structure under `src/app/(frontend)`, `src/app/(payload)`, collections, blocks, Header/Footer, and plugins is explicitly preserved or deliberately replaced by responsibility.
- [x] Every task identifies exact files, typed interfaces, a failing test and expected failure, minimal implementation details/code, verification command and expected result, and a scoped commit.
- [x] No implementation step asks an engineer to infer an undefined function, status, route, variable, backup policy, deployment path, or rollback trigger.
- [x] No production cutover occurs before explicit approval and fresh runtime evidence; a completed plan or green build alone is not release approval.

### Review corrections applied

- [x] Exported `TEMP_DIR` and aligned template import with the supported `create-payload-app` website-template flow.
- [x] Standardized the official template config path as `next.config.ts`, installed Corepack/pnpm before generation, and deferred exact package-manager pinning until `package.json` exists.
- [x] Made Task 11 consume only a prevalidated navigation href and kept Task 14 as the single owner of WhatsApp/telephone URL construction; corrected the telephone test to a valid non-secret UAE example.
- [x] Added PostgreSQL-backed rate-limit and submission-claim tables to the initial migration so multi-process lead deduplication and throttling do not depend on in-memory state.
- [x] Fixed PostgreSQL preexistence checks so absent roles/databases do not terminate the guarded provisioning script under `set -e`.
- [x] Fixed deployment identity to `127.0.0.1:3100`, moved immutable candidate releases outside the live WordPress root, and required an isolated localhost Nginx candidate test before any active-config validation.
- [x] Replaced broad API-denial wording with precise sensitive-path denial while preserving the Payload Admin API, media, and controlled public lead endpoint.
- [x] Moved creation of the actual final WordPress snapshot behind the Task 26 explicit-approval gate; Task 25 only implements and rehearses snapshot/cutover/rollback tooling against fixtures.
- [x] Required the verified final WordPress files/database snapshot and non-public restore proof to exist before the first live rename, active Nginx write/reload, or traffic change.

### Placeholder and safety scan

- [x] Plan contains no unresolved implementation marker or vague delegated step.
- [x] Machine-dependent values are either explicitly fixed by this plan (`127.0.0.1:3100`) or verified by read-only inventory first (including the existing certificate paths); business details require owner verification, and credentials are generated into protected files rather than guessed.
- [x] Commands preserve `/www/wwwroot/alruknfurniture.ae` until the atomic approved cutover and retain the WordPress snapshot for the required period.
- [x] Runtime evidence and backups stay outside Git and outside web-served roots with owner-only access.
- [x] This planning deliverable performs no application installation, database provisioning, WordPress write, active Nginx change, reload, DNS update, certificate change, or traffic switch; implementation remains blocked pending separate user approval.
