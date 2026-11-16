# Reusable Next.js + Payload CMS template

This repository is a cleaned, production-proven **Next.js 16 + Payload CMS 3.89** website template. It started from the official Payload `website` starter (PostgreSQL), then was hardened and extended for a live multi-service furniture site. Use it as the baseline for new brand sites.

## What you get

- **App Router** frontend + **Payload admin** at `/admin`
- **PostgreSQL** via `@payloadcms/db-postgres`
- **Standalone-ready** Next config, Docker / Compose files
- **CMS collections:** Pages, Posts, Projects, Services, PortfolioItems, Media, Users, FAQs, Testimonials, Leads, LeadMedia, Redirects, Areas, Categories, CurtainBlindCategories, CurtainBlindProducts
- **Globals:** Header, Footer, Homepage, AboutPage, ContactPage, ContactInformation, SiteSettings, SEODefaults, SocialMedia, ArchiveSettings, GoogleReviews
- **Page-builder blocks:** Hero, Content, Media, CTA, Form, QuoteForm, FAQs, Testimonials, ServiceGrid, ProcessSteps, Benefits, Statistics, LocationCoverage, ProjectGallery, SplitContent, RichContent, Archive, Banner, RelatedPosts, Code
- **SEO:** metadata helpers, JSON-LD schema, sitemap/robots, redirects, 404
- **Ops:** GA4 + GTM hooks, Cookie Consent Mode v2, SMTP leads, Google Places reviews (server-only key), catalogue import scripts
- **Quality gates:** `pnpm template:check`, lint, typecheck, unit/integration/e2e/a11y scripts

## Quick start for a new project

1. Clone this repo (or unzip the release archive).
2. Rename `package.json` `name` and brand strings (logo, SiteSettings defaults, `.env.example`).
3. Copy `.env.example` → `.env` and set:
   - `DATABASE_URI`
   - `PAYLOAD_SECRET` (≥32 chars)
   - `NEXT_PUBLIC_SERVER_URL`
   - `PREVIEW_SECRET` / `REVALIDATION_SECRET`
   - Optional: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GTM_ID`, SMTP_*, `GOOGLE_PLACES_API_KEY`
4. `pnpm install`
5. `pnpm payload migrate` (or first-run migrate as documented)
6. `pnpm dev` → `http://localhost:3000` and `/admin`
7. Run `pnpm template:check` before first commit to ensure demo artifacts stay gone.

## Safe reuse checklist

- [ ] Replace brand logo / favicon / `public/` assets
- [ ] Clear or re-seed CMS content for the new brand
- [ ] Rotate all secrets (never copy production `.env`)
- [ ] Point DNS / `NEXT_PUBLIC_SERVER_URL` at the new domain
- [ ] Confirm Postgres DB name/user are project-specific
- [ ] Re-run `pnpm release:gate` before production

## Intentionally excluded from this clean package

- `node_modules/`, `.next/`, upload `storage/` / `public/media/`
- Production `.env` and real analytics/API credentials
- Old deploy snapshots and agent worktrees

## Provenance

See `docs/template-provenance.md` for the upstream Payload generator record and cleanup notes. Implementation plans/specs live under `docs/superpowers/`.
