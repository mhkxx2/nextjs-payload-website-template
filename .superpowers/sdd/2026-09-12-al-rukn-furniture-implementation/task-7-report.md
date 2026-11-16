# Task 7 Report: FAQs, Testimonials, private Leads, and Redirects

## Status

DONE — recovered implementation audited, completed, hardened, fully verified, and committed on the isolated feature branch.

## Recovered state

- Recovery began at baseline `16c1825acebcf9494f9055a9f50bf5c287dfd229` on `feature/al-rukn-implementation` in the prescribed isolated worktree.
- The worktree already contained uncommitted Task 7 production code, generated types, and two integration suites. Correct recovered work was retained only after reviewing the brief, deferred Task 4/6 requirements, shared contracts, and live test behavior.
- No genuine transcript of the original absent-collection RED run survived the interrupted session. Correct recovered code was not deleted merely to manufacture historical RED evidence.
- The first recovery run of the repository integration command was already GREEN: 7 files and 72 tests passed. Regression validity was therefore strengthened with new uncovered redirect cases and fresh behavior-level RED/GREEN evidence described below.

## Implementation

### FAQs and Testimonials

- Added authenticated-write/publication-filtered `faqs` and `testimonials` collections.
- Reused `adminOrPublished`, `publicationFields`, `contentAuditFields`, `validatePublicationSchedule`, trusted audit population, and shared content revalidation hooks.
- Public access therefore requires all three predicates: Payload `_status === 'published'`, custom `status === 'published'`, and elapsed `publishedAt`.
- FAQs include localized question/answer, typed service relationships, grouping, ordering, publication metadata, and explicit schema-eligibility guidance tied to visibly co-present question/answer content.
- Testimonials include only approved statement/display data, optional integer rating from 1–5, location/service/project relationships, featured state, publication metadata, and consent/verification note/date. A before-change hook blocks publication unless both verification fields are valid.
- Audit ownership remains field-level write-denied and hook-controlled; client attempts cannot assign or replace ownership.

### Service relationship migration

- Migrated Task 6 temporary Service `faqs` and `testimonials` JSON ID arrays to real `hasMany` Payload relationships targeting the newly registered collections.
- Regenerated `src/payload-types.ts`; `Service.faqs` is now `(number | Faq)[] | null` and `Service.testimonials` is `(number | Testimonial)[] | null`.
- Added regression assertions against both collection configuration and generated relationship behavior.

### Private Leads and accountable workflow

- Added the private `leads` collection with identity/contact data, typed service and optional Media relations, message, required consent and consent time, source path/title, project context, referrer, all five UTM values, trusted submission/status timestamps, optional SHA-256-only abuse context, and immutable status audit entries.
- Reused the Task 4 `leadAccess` capability contract and `createControlledLead` server-only Local API path with `overrideAccess: false`; the real registered collection was exercised through that path.
- Anonymous direct create/find/findByID/update/delete attempts are rejected. Existing Task 4 unit coverage also proves anonymous denial for create/read/update/delete/readVersions/unlock and denial of forged capability, REST capability, and capability-free Local API bypasses.
- All creates are reset by the trusted hook to `new`, with server timestamps and an empty audit, regardless of caller-supplied status/audit/timestamp values.
- Status changes require an authenticated actor, enforce exactly `new -> contacted -> quotation-sent -> won|lost`, reject skips/reversals/terminal-state changes, preserve prior audit history, and write `{ from, to, changedAt, changedBy }` from trusted hook context.
- `createControlledLead` now has Payload-aware overloads using generated `RequiredDataFromCollectionSlug<'leads'>` and `Lead` types while preserving the narrow mockable contract used by unit tests.

### Deterministic safe Redirects

- Replaced the generic redirects plugin collection with the owned `redirects` collection so exactly one redirect collection is registered.
- Added canonical path normalization, strict runtime validation, authenticated writes, active-only anonymous reads, cache invalidation after change/delete, and deterministic exact-source resolution sorted by stable ID.
- Validation accepts only 301/302 and rejects direct loops, either insertion order of active chains, duplicate active normalized sources, schemes, protocol-relative input, bare host/IPv4 authorities, control characters, fragments, backslashes, traversal, encoded separators/traversal, excessive nested encoding, encoded query/fragment delimiters, and protected admin/API/media/uploads/Next/internal/system route prefixes.
- Query strings are retained only when explicitly present in the original source/destination and are part of exact source matching; queryless requests do not silently match query-specific redirects.
- Existing redirect lookup/render integration now uses the shared deterministic resolver and access-enforced, active-only, ID-sorted query. No Task 8 global or presentation UI was added.

## Interfaces produced

- `LeadStatus = 'new' | 'contacted' | 'quotation-sent' | 'won' | 'lost'`.
- `legalLeadTransitions`, the authoritative transition map.
- `RedirectInput` / persisted redirect shape with `source`, `destination`, `type: 301 | 302`, `active`, optional `notes`, and optional stable `id`.
- `normalizeRedirectPath(input): string`.
- `validateRedirect(record, existing): true | string`.
- `resolveRedirect(requestPath, records): RedirectInput | undefined`.
- Generated Payload `Faq`, `Testimonial`, `Lead`, and `Redirect` interfaces and select types.

## TDD and recovery evidence

- Original strict RED evidence is unavailable because the interrupted worktree already contained implementation and tests.
- Initial recovered-state integration run: exit `0`, 7 files / 72 tests passed.
- Security review identified five uncovered redirect cases. Before production hardening, focused redirects ran RED with **5 failed / 23 passed**: bare hostname, bare IPv4 host, deeply nested encoded traversal, encoded query delimiter, and encoded fragment delimiter were accepted.
- After hardening the shared normalizer, the same suite ran GREEN with **28/28**.
- Additional Lead coverage proves the complete schema, immutable trusted fields, raw abuse-context rejection, the legal lost branch, and terminal-state rejection. A temporary assertion failure was caused by tool-side PII masking copied into a phone assertion, not production behavior; the assertion was rewritten without embedding the full value as one rendered literal. Payload intentionally wraps custom validation text in its field-invalid error, so the integration assertion was aligned to that public error contract.
- Final focused Task 7 run was GREEN: **2 files / 40 tests**.

## Files changed

- `src/collections/FAQs.ts`
- `src/collections/Testimonials.ts`
- `src/collections/Leads.ts`
- `src/collections/Redirects.ts`
- `src/collections/Services.ts`
- `src/hooks/auditLeadStatus.ts`
- `src/hooks/revalidateContent.ts`
- `src/hooks/revalidateRedirects.ts`
- `src/server/leads/createControlledLead.ts`
- `src/components/PayloadRedirects/index.tsx`
- `src/utilities/getRedirects.ts`
- `src/lib/routes.ts`
- `src/plugins/index.ts`
- `src/payload.config.ts`
- `src/payload-types.ts`
- `tests/integration/operational-collections.test.ts`
- `tests/integration/redirects.test.ts`
- `.superpowers/sdd/2026-09-12-al-rukn-furniture-implementation/progress.md`
- `.superpowers/sdd/2026-09-12-al-rukn-furniture-implementation/task-7-report.md`

## Fresh verification evidence

Repository commands used the installed dependencies with `PATH="$PWD/node_modules/.bin:$PATH"` and `npx --yes pnpm@10.34.5` because no standalone `pnpm` executable was on the runner PATH.

- `pnpm payload:generate-types` — exit `0`; Payload collections/globals types compiled.
- `pnpm exec vitest run tests/integration/operational-collections.test.ts tests/integration/redirects.test.ts` — exit `0`: **2 files, 40 tests passed**.
- `pnpm test:integration` — exit `0`: **7 files, 78 tests passed**.
- `pnpm test:unit` — exit `0`: **8 files, 127 tests passed**.
- `pnpm typecheck` — exit `0`, no TypeScript errors.
- Scoped ESLint over every changed production/config/test TypeScript file with `--max-warnings=0 --no-warn-ignored` — exit `0`, no warnings or errors.
- `git diff --check` — exit `0`.
- Disposable PostgreSQL schema query after final test execution returned `[]` for `task5_%`; all per-suite schemas were removed.

## Security and scope self-review

- No anonymous Lead read or mutation path was introduced; access enforcement remains active in the controlled Local API call.
- The capability is a module-identity `Symbol`, checked together with `payloadAPI === 'local'`; remote/forged/direct bypasses remain denied.
- Client-supplied Lead status, timestamps, and audit arrays cannot become authoritative. Field-level write denial plus the trusted hook controls all audit metadata.
- Testimonial public publication cannot bypass verification evidence, and FAQ/testimonial public access shares the complete three-part publication predicate.
- Redirect safety is applied before persistence and again through the exported validator/resolver contract. Deterministic resolution does not make duplicates acceptable; duplicate active normalized sources are rejected.
- The redirect collection is private for writes and exposes only active records publicly. Redirect cache invalidation covers changes and deletions.
- Task 8 globals and new frontend UI were not implemented. The only component adjustment removes dependency on the deleted plugin shape and preserves existing redirect rendering through the new shared resolver.

## Migration note

- This task changes Payload schema: four collections are registered, the old plugin-owned redirects schema is replaced, and Service JSON arrays become typed relationships. Generated types are updated accordingly.
- No persistent migration file was requested by Task 7. Integration verification used disposable fresh schemas and confirmed cleanup. Production schema migration/deployment remains part of the repository’s later deployment/migration stage.

## Concerns

- Non-blocking runner warnings only: npm reports that the project-level `enable-pre-post-scripts` setting will be unsupported in a future npm major, and Payload reports that no email adapter is configured during tests. Neither affects Task 7 behavior.

## Independent-review fix round 1/5

### Status

DONE — every open Important and related Minor finding was addressed in a new fix commit; no Task 8 UI was added.

### Honest RED evidence

The recovered-state Step 1 note above is retained unchanged; this fix round does not claim or manufacture the missing original Task 7 RED.

- Testimonial evidence/access regressions were added first. `pnpm test:integration -- tests/integration/operational-collections.test.ts` exited `1` against reviewed HEAD `b67f238`: explicit-null update cases reached the old nullish fallback instead of rejecting, and the schema/anonymous-read assertions exposed missing field-level read access. The runner invoked the repository-wide integration directory despite the trailing filename, so no narrower count is claimed from that truncated run.
- Redirect validation/privacy/atomicity regressions were then run against reviewed production code with `pnpm exec vitest run tests/integration/redirects.test.ts`: exit `1`, **16 failed / 27 passed**. Thirteen canonical public/service destinations were incorrectly rejected; anonymous `notes` leaked; `redirects_active_source_unique` was absent; and both concurrent creates fulfilled.
- The request-boundary regression was added before its implementation. `pnpm exec vitest run tests/unit/redirect-response.test.ts`: exit `1`; Vitest could not resolve the intentionally absent `@/lib/redirectResponse`, proving there was no response-producing boundary that could assert exact 301/302 status or full query matching.

### Fixes

- Testimonial publication validation now distinguishes omitted fields from explicitly supplied `null` and validates the final merged persisted evidence state. Focused update regressions cover clearing `verificationNote`, `verifiedAt`, and both.
- `verificationNote` and `verifiedAt` now use authenticated-only field-level read access; anonymous Payload reads omit both while authenticated reads retain them.
- Redirect protection now uses a dedicated internal/system denylist (`admin`, API, media/uploads, Next/framework, health, internal, GraphQL, static/assets/system) rather than page-slug reservations. `/about/`, `/contact/`, `/blog/...`, `/projects/...`, and all fixed canonical service destinations are accepted while all prior unsafe/protected cases remain rejected.
- `notes` now has authenticated-only field-level read access.
- Operational redirects moved to `src/proxy.ts`. The proxy has the complete request pathname plus explicit query, delegates exact matching to `createRedirectResponse`, and emits the persisted 301 or 302 through a real `Response`. Non-matches continue through Next; the existing `PayloadRedirects` component now retains only its prior `notFound()`/disabled behavior.
- PostgreSQL schema construction now adds partial unique index `redirects_active_source_unique` on normalized `source` where `active = true`. The adapter constraint map translates races to a Payload `ValidationError` on `source` with the standard unique-value message. The preflight check remains for early descriptive feedback, while the database is the atomic authority.
- The index is schema-managed through Payload's supported `afterSchemaInit` extension. Per the existing sequencing, no persistent migration file was added; later migration generation will include the index, while disposable-schema tests prove its generated DDL and concurrency behavior now.

### GREEN and verification evidence

- `pnpm payload:generate-types` — exit `0`.
- Focused covering command (`operational-collections`, `redirects`, and `redirect-response`) — exit `0`: **3 files / 63 tests passed**.
- `pnpm test:integration` — exit `0`: **7 files / 97 tests passed**.
- `pnpm test:unit` — exit `0`: **10 files / 133 tests passed**.
- `pnpm typecheck` — exit `0`, no TypeScript errors (fresh after the final generated-type compatibility adjustment).
- Scoped ESLint across every changed TypeScript/TSX/config/test file with `--max-warnings=0` — exit `0`, no warnings or errors.
- `git diff --check` — exit `0`.
- Disposable PostgreSQL cleanup query returned `{ "count": 0 }` for schemas matching `task5_%`.

### Security and scope self-review

- External, protocol-relative, host-like, encoded separator/traversal/delimiter, backslash, loop, chain, duplicate-active, and protected internal/system redirect rejections remain covered.
- Query-specific sources match only the same explicit query at the actual proxy boundary; queryless or different-query requests do not match.
- Runtime status handling rejects unexpected persisted numeric values defensively even though collection validation permits only 301/302.
- Public testimonial and redirect reads no longer leak internal evidence/notes; authenticated workflows retain access.
- The unique partial index allows the intended inactive-history model while eliminating active-source races at commit time.
- No Lead access, audit, capability, Task 8 UI, or unrelated route/publication behavior was weakened or expanded.
