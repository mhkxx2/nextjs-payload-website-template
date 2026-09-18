# SDD ledger — plan: /www/wwwroot/alruknfurniture-next/docs/superpowers/plans/2026-09-12-al-rukn-furniture-implementation.md

# Implementation Progress

| Stage | Status | Evidence |
|---|---|---|
| Preflight | PASS | Isolated worktree confirmed; production untouched |
| Task 1 — Foundation import and cleanup | PASS | 5/5 provenance tests, 0 scanner findings, lint PASS, TypeScript PASS, diff check PASS |
| Task 2 — Environment and PostgreSQL foundation | PASS | Environment validator PASS; unit 14/14; DB integration 1/1; Docker Compose config PASS; lint/typecheck/frozen install/diff check PASS; DB schema empty for Task 20 |
| Task 3 — Route and publication contracts | PASS | Commit `9a02bf7`; independent spec PASS + quality APPROVED; fresh targeted 69/69 and full unit 83/83; typecheck, scoped ESLint, diff check PASS |
| Task 4 — Access control and shared SEO fields | PASS | Commits `9b62139..51ff2d7`; independent spec PASS + quality APPROVED after 2 fix rounds; fresh targeted 44/44 and full unit 127/127; typecheck, scoped ESLint, diff check PASS |
| Task 5 — Users, Media, and Categories collections | PASS | Amended commit `ab6bcae`; TASK5-SEC-001 auth-before-decode and AVIF brand/codec regressions fixed; isolated-schema integration 17/17, unit 127/127, generated types (schema unchanged by review fix), typecheck, scoped ESLint, and diff check PASS; Task 5 report records RED/GREEN and scoped security review evidence |
| Task 6 — Services, Projects, Posts, and Pages | PASS | Strict RED/GREEN recorded in Task 6 report; focused Task 6 integration 13/13, full integration 30/30, unit 127/127, generated types, typecheck, zero-warning scoped ESLint, diff check, security review, and disposable-schema cleanup PASS |
| Task 7 — FAQs, Testimonials, Leads, and Redirects | PASS | Commits `b67f238..6eb5c64`; independent spec PASS + quality APPROVED after fix round 1; focused 63/63, full integration 97/97, unit 133/133; generated types, typecheck, scoped ESLint, diff check, redirect security RED/GREEN, and disposable-schema cleanup PASS |
| Task 8 — Editable Site Globals | PASS | Commits `617a454` and review hardening; 35/35 integration tests PASS, 135/135 unit tests PASS, 134/134 full integration PASS, generated types, ESLint, typecheck PASS |

Task 6: complete (collection/publication/revalidation contracts verified; no blocking findings)
Task 6: reopened after independent review — fix round 1 required for public `_status` filtering, effective sitemap invalidation, root homepage revalidation, and immutable audit ownership.
Task 6: minor (deferred): remove/consolidate stale `src/collections/Pages/index.ts` and `Posts/index.ts` collection definitions.
Task 6: later-task verification (resolved in Task 7): Service FAQ/testimonial JSON ID fields migrated to typed Payload relationships with generated-type and integration coverage.
Task 6: later-template verification (deferred): assess inverse relation invalidation once public templates reveal whether related-record content is embedded.
Task 6: fix round 1/5 (4 addressed, 0 open — Payload draft isolation, sitemap tag wiring, root homepage invalidation, immutable audit ownership; commits `908f03a..16c1825`)
Task 6: complete (commits `ab6bcae..16c1825`, scoped re-review clean; 1 minor and 2 later-task/template verifications deferred)

Task 7: reopened after independent review — fix round 1 required for testimonial evidence retention/privacy, public canonical redirect targets, exact 301/302 runtime behavior, explicit-query routing, atomic active-source uniqueness, and redirect-notes privacy.
Task 7: fix round 1/5 (8 addressed, 0 open — commits `b67f238..6eb5c64`)
Task 7: complete (commits `b67f238..6eb5c64`, independent spec PASS + quality APPROVED; no blocking findings)

Task 4: minor (deferred): `leadAccess` exports a narrower inferred type through `satisfies`; final branch review should assess an explicit collection-access annotation.
Task 4: later-task verification (resolved in Task 7): real Leads collection and controlled Local API submission path exercised; direct anonymous and capability bypass operations rejected.
Task 4: complete (commits `9a02bf7..51ff2d7`, review clean; 1 non-blocking minor and 1 later integration verification deferred)

Task 3: minor (deferred): Avoidable circular dependency between `src/lib/routes.ts` and `src/lib/slug.ts`; final branch review should assess cleanup.
Task 3: minor (deferred): `canonicalPath('page', ...)` assumes callers separately validate reserved slugs; final branch review should assess API hardening/documentation.
Task 3: complete (commits `f84ae90..9a02bf7`, review clean; 2 non-blocking minors deferred)
