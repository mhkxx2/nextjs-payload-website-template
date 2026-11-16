# Next.js + Payload website template (Al Rukn baseline)

Production-hardened **Next.js 16** + **Payload CMS 3.89** (PostgreSQL) template. Built from the official Payload `website` starter, cleaned of demo content, then extended with services, portfolio, leads, SEO, analytics/consent, and landing-page kits.

> Reusing on another brand? Start with [`TEMPLATE.md`](TEMPLATE.md).

## Local development

1. Copy `.env.example` to `.env` and fill local-only values.
2. `pnpm install`
3. `pnpm dev` → `http://localhost:3000` (admin: `/admin`)

## Useful scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Local Next + Payload |
| `pnpm build` / `pnpm start` | Production build & serve |
| `pnpm payload migrate` | Run DB migrations |
| `pnpm seed` | Seed launch content (optional) |
| `pnpm template:check` | Assert demo artifacts stay removed |
| `pnpm release:gate` | Env + lint + types + unit/integration + build |

## Stack

- Next.js `16.3.3` (App Router)
- Payload `3.89.0` + Postgres adapter
- Tailwind CSS 4, Playwright, Vitest

## Docs

- [`TEMPLATE.md`](TEMPLATE.md) — reuse guide for new projects
- [`docs/template-provenance.md`](docs/template-provenance.md) — upstream source record
- `docs/superpowers/plans/` & `docs/superpowers/specs/` — feature plans/designs
