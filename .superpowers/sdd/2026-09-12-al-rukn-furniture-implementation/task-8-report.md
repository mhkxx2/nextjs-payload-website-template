# Task 8 Implementation Report — Editable Site Globals

## Status and baseline

**Status:** Complete and verified.

- Worktree: `/www/wwwroot/alruknfurniture-next/.worktrees/al-rukn-implementation`
- Branch: `feature/al-rukn-implementation`
- Recovered/baseline HEAD: `2b23064e056a6a380d5a4b55180f965242da6f92` (`docs: record Task 7 review completion`)
- The worktree was clean before Task 8.
- Existing Header/Footer globals were the Payload website-template `navItems` schemas. The plugin list retained nested-doc category behavior and template-style SEO URL generation. Task 7's hardened `Redirects` collection already owned redirects; no stock redirects plugin was registered.
- Production WordPress, production PostgreSQL schemas/data, Nginx, deployment configuration, and traffic were not touched. Integration tests used disposable PostgreSQL schemas only.

## TDD evidence

### RED

1. After creating `tests/integration/globals.test.ts`, the prescribed command initially could not run because `pnpm` was absent:
   - Command: `pnpm test:integration -- tests/integration/globals.test.ts`
   - Result: exit 127, `pnpm: command not found`.
   - Recovery: installed the repository-declared package-manager version with `npm install --global pnpm@10.18.3`.
2. Re-running the prescribed command reached genuine schema failures but, because the package script targets the whole integration directory and forwards the filename as an additional argument, it also ran other integration suites and hit the 180-second harness timeout:
   - Command: `pnpm test:integration -- tests/integration/globals.test.ts`
   - Result: exit 124; at cutoff 5 files failed/2 passed, 32 tests failed/102 passed. Task 8 failures were caused by the four missing globals and template Header/Footer field contracts.
3. The truly focused invocation gave stable RED evidence:
   - Command: `pnpm exec vitest run tests/integration/globals.test.ts`
   - Result: exit 1; 34 tests collected, 32 failed/2 passed.
   - Primary reason: expected globals `site-settings`, `contact-information`, `seo-defaults`, and `social-media` were absent and Header/Footer still exposed template `navItems`.
4. Render-time CTA boundary was also added test-first:
   - Command: `pnpm exec vitest run tests/integration/globals.test.ts`
   - Result: exit 1 before collection; missing `@/lib/contactLinks`, proving the render guard had not yet been implemented.

### GREEN

- Focused schema/validation suite after implementation: `pnpm exec vitest run tests/integration/globals.test.ts` → 35/35 tests passed, 1 file passed, exit 0.
- An earlier schema-only GREEN was 34/34 before the render-time CTA boundary test was added.

## Files changed and interfaces produced

### Globals and shared contracts

- `src/globals/SiteSettings.ts` — global slug `site-settings`
- `src/globals/Header.ts` — global slug `header`
- `src/globals/Footer.ts` — global slug `footer`
- `src/globals/ContactInformation.ts` — global slug `contact-information`
- `src/globals/SEODefaults.ts` — global slug `seo-defaults`
- `src/globals/SocialMedia.ts` — global slug `social-media`
- `src/globals/shared.ts` — shared authenticated-write/public-read policy, exact canonical-origin validator, E.164 normalization/validation, HTTPS map allowlist validation, and global cache revalidation
- `src/lib/contactLinks.ts` — render-time E.164 guard producing safe `tel:` and `https://wa.me/` links or `null`
- `src/lib/presentationRoutes.ts` — exhaustive allowlisted presentation destination mapping

### Wiring and rendering

- `src/payload.config.ts` — registers all six globals and English localization configuration (`en`, fallback enabled), preserving field-level localization for later locale additions without schema restructuring
- `src/Header/config.ts`, `src/Footer/config.ts` — compatibility re-exports of the canonical globals
- `src/Header/Component.tsx`, `Component.client.tsx`, `Nav/index.tsx`, `RowLabel.tsx` — consume new Header, Site Settings, and Contact Information interfaces; render only bounded routes; suppress invalid phone/WhatsApp CTAs
- `src/Footer/Component.tsx`, `RowLabel.tsx` — consume navigation groups, fixed service relationships, legal destinations, supporting/conversion content, and guarded contact CTAs
- `src/plugins/index.ts` — retains SEO, form builder, and search plugins; removes nested-doc demo/category URL assumptions; produces canonical, route-aware SEO URLs; reads editable site/SEO global values for generated titles; does not install generic service output
- `src/payload-types.ts` — regenerated, not hand-edited
- `tests/integration/globals.test.ts` — Task 8 integration coverage
- `tests/integration/core-collections.test.ts`, `content-collections.test.ts` — updated additive-global baseline expectations

## Field/access/validation matrix

| Global | Public presentation fields | Read access | Write access | Validation and safety boundary |
|---|---|---|---|---|
| Site Settings | business/brand names, logo/dark logo/favicon, quotation labels, WhatsApp label/message copy, launch locale/direction, announcement destination, bounded presentation variants, canonical origin | Anonymous allowed | Authenticated user required | `canonicalSiteURL` accepts only the exact literal `https://alruknfurniture.ae`; rejects HTTP, www, credentials, ports (including explicit 443), paths, trailing slash, and lookalike hosts. Locale/direction and variants are selects, not arbitrary values/colors/CSS. |
| Header | bounded primary destinations, fixed Service relationships, quotation/WhatsApp/phone conversion actions, mobile labels/settings | Anonymous allowed | Authenticated user required | Destinations and CTA actions are allowlisted selects; services are relationships to the fixed Services collection; no custom URL or arbitrary markup field. Renderer revalidates E.164 and suppresses unavailable CTAs. |
| Footer | navigation groups, fixed Service relationships, legal destinations, supporting copy, conversion copy/labels | Anonymous allowed | Authenticated user required | Destinations/legal routes are allowlisted selects; services are relationships; content uses escaped text/textarea only. Phone/WhatsApp links are emitted only through render-time E.164 guards. |
| Contact Information | phone/WhatsApp, derived WhatsApp availability, email, address, map URL, opening hours, service areas | Anonymous allowed | Authenticated user required | Phone/WhatsApp are trimmed before validation and must be valid E.164 when present. `whatsappAvailable` is virtual and derived from validated data. Map URL must be HTTPS, credential-free, fragment-free, without an explicit port, and on approved Google Maps hosts. Email uses Payload's email field. |
| SEO Defaults | title pattern, fallback title/description/social image, robots index/follow, organization/local-business defaults | Anonymous allowed | Authenticated user required | Presentation-only text/select/checkbox/upload/group fields; schema types are allowlisted; no raw JSON/schema, HTML, CSS, color, script, secret, or internal-note field. |
| Social Media | ordered social links with network, label, HTTPS profile URL | Anonymous allowed | Authenticated user required | Network select is allowlisted. URL must be HTTPS, credential-free, fragment-free, without explicit ports, and host-match the selected provider (Facebook, Instagram, LinkedIn, YouTube, Pinterest, TikTok, or X). |

All user-facing text fields that may later need translation are marked `localized`; launch config exposes only English and LTR. No Arabic content was generated or published.

## Header/Footer and plugin integration notes

- Template `navItems` and generic custom-link assumptions are gone.
- Header/Footer resolve fixed presentation destinations through one allowlisted mapper and fixed services through `canonicalPath('service', slug)`, preserving the nine canonical service URLs and introducing no generic `/services/[slug]` page.
- Header/Footer read Contact Information and Site Settings through `getCachedGlobal`. A missing or malformed E.164 number yields `null`; WhatsApp additionally requires the derived `whatsappAvailable` flag, so no broken CTA is rendered.
- SEO generated titles read editable `site-settings.brandName` and `seo-defaults.titlePattern`; generated URLs use the exact canonical public origin plus the established route helper.
- The SEO plugin remains registered without injecting duplicate `meta` fields because Pages/Posts already own hardened SEO fields. Form builder and search remain. The nested-doc plugin was removed to eliminate template/category hierarchy URL assumptions. Task 7's owned `Redirects` collection and hooks remain unchanged and its 43 integration tests pass.

## Generated types

`pnpm payload:generate-types` exited 0 and regenerated `src/payload-types.ts`. It includes interfaces and select maps for all six slugs: `SiteSetting`, `Header`, `Footer`, `ContactInformation`, `SeoDefault`, and `SocialMedia`.

During implementation, generation honestly exposed two integration mistakes before GREEN:

- Injecting SEO fields into Projects/Services duplicated existing `meta`; fixed by retaining the plugin for its generators without injecting fields into owned schemas.
- A temporary stock redirects-plugin registration collided with Task 7's owned `redirects` slug; removed, preserving the existing hardened collection.

## Full verification evidence

Fresh final commands after all implementation changes:

| Command | Result |
|---|---|
| `pnpm payload:generate-types` | PASS, exit 0 |
| `pnpm exec vitest run tests/integration/globals.test.ts` | PASS, 35/35 |
| `pnpm test:integration` | PASS, 8 files, 132/132 tests |
| `pnpm test:unit` | PASS, 10 files, 133/133 tests |
| `pnpm typecheck` | PASS, exit 0 |
| `pnpm exec eslint src/globals src/Header src/Footer src/plugins/index.ts src/payload.config.ts src/lib/contactLinks.ts src/lib/presentationRoutes.ts tests/integration/globals.test.ts tests/integration/core-collections.test.ts tests/integration/content-collections.test.ts --max-warnings=0` | PASS, exit 0, no warnings |
| `git diff --check` | PASS, exit 0 |

The first full integration run after implementing Task 8 had 129/131 passing; only two predecessor assertions still expected exactly `['header', 'footer']`. Those tests were updated to the additive six-global contract, then the full suite passed 132/132.

### Disposable PostgreSQL cleanup

After all integration processes exited, a direct query against `information_schema.schemata` for escaped prefix `task5\_%` returned:

```json
{"count":0,"schemas":[]}
```

No disposable test schemas remain.

## Security, privacy, regression, and scope self-review

- **Anonymous exposure:** all six globals are presentation-only; anonymous reads are explicitly allowed and tested, while every update requires `req.user` and is tested with `overrideAccess:false`.
- **Secrets/private data:** no secret, API key, password, private/admin-note, arbitrary HTML, rich-text, raw schema, CSS, or color fields were introduced. URL parsing explicitly rejects URL credentials.
- **Unsafe links:** canonical origin uses exact-string validation; map/social URLs use HTTPS plus shape/host restrictions; Header/Footer navigation is enum/relationship based; contact CTAs have schema-time and render-time E.164 boundaries.
- **Template/demo assumptions:** template `navItems`, nested category URL generation, and hardcoded SEO title generation were removed. No demo records, imagery, seed defaults, or invented claims/availability/reviews were introduced.
- **Locale extensibility:** localized presentation fields plus Payload's English-only localization config permit later Arabic/RTL addition without reshaping the six global schemas. No Arabic was machine-generated.
- **Route/plugin regressions:** established route helpers remain authoritative; fixed services have no generic route output; Redirects (43/43), publication, operational collection, search-related, SEO unit, and route unit suites pass.
- **Scope:** no Task 9 page blocks/redesign, seed content, migration, deployment, or production changes were made. Header/Footer changes are limited to adapting the existing components to Task 8 data and safe links.

## Concerns

- No blocking concerns.
- The schema is intentionally content-empty: required business/brand/canonical-origin values must be entered by an authorized editor or later approved seed/migration work; Task 8 does not seed production data.
- `pnpm test:integration -- tests/integration/globals.test.ts` is not focused with the current package script because that script hardcodes `tests/integration`; the stable focused command used for evidence is `pnpm exec vitest run tests/integration/globals.test.ts`.
