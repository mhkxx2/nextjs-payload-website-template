# Next.js + Payload CMS Website Template

> Built on the official [Payload Website Template](https://github.com/payloadcms/payload/tree/main/templates/website) (Payload `3.89` + Next.js `16`), then production-hardened for real service businesses.

A reusable **Next.js 16 + Payload CMS 3** starter with PostgreSQL, layout builder, **SEO / AEO / GEO**, **Google Tag Manager + GA4**, Cookie Consent Mode v2, Google Reviews, Google Maps, leads, service landings, and portfolio — already proven on live sites.

### Live production sites

| Site | URL |
| --- | --- |
| Al Rukn Furniture | [https://alruknfurniture.ae/](https://alruknfurniture.ae/) |
| Al Mustajid Aluminium & Glasses | [https://almustajid.ae/](https://almustajid.ae/) |

### Developer

Built and maintained by **[Mudassar](https://mudassar.net/)** — [mudassar.net](https://mudassar.net/)

### Why use this template

- **Battle-tested in production** — Same codebase family powers [alruknfurniture.ae](https://alruknfurniture.ae/) and [almustajid.ae](https://almustajid.ae/), not a demo-only starter.
- **Next.js 16 App Router + Payload 3.89** — Admin at `/admin`, frontend App Router, React Server Components, standalone Docker-ready output.
- **PostgreSQL first** — `@payloadcms/db-postgres` with migrations and production env checks.
- **Service-business CMS** — Pages, Posts, Projects, Services, Portfolio, FAQs, Testimonials, private Leads, Redirects, Areas, Categories, plus catalogue collections for product-style service lines.
- **Rich layout builder** — 20 blocks (Hero, Content, CTA, Forms, Quote, FAQs, Testimonials, Service Grid, Process, Stats, Location Coverage, Project Gallery, and more).
- **SEO + AEO + GEO** — Full metadata/canonical/OG stack, JSON-LD entities, FAQ answer schema, LocalBusiness / area coverage, sitemap & robots, redirects — built for classic search, answer engines, and generative/local discovery.
- **Google Tag Manager (integrated)** — Production GTM container + GA4 gtag, Consent Mode v2 defaults before tags fire, shared `dataLayer` conversion events.
- **Google Reviews + Maps** — Places API (New) native reviews, Maps / write-review links, Contact `mapURL`, Place ID via Payload global.
- **Quality gates** — `template:check`, lint, typecheck, Vitest unit/integration, Playwright e2e/a11y, optional LHCI.
- **Clean reuse** — Demo Payload artifacts removed; follow [`TEMPLATE.md`](TEMPLATE.md) to rebrand for a new project.

### Who this is for

- Agencies, studios, and freelancers shipping CMS websites for service brands
- Teams that need **SEO/AEO/GEO**, GTM analytics, Google Reviews/Maps, leads, and portfolio/service pages out of the box
- Anyone who wants a production Payload + Next baseline stronger than the stock website template

---

## Quick start

### Requirements

- Node.js 22+ (Docker image uses Node 22; local Node 24+ also works)
- [pnpm](https://pnpm.io/) (via Corepack)
- PostgreSQL 16+

### Clone

```bash
git clone https://github.com/mhkxx2/nextjs-payload-website-template.git
cd nextjs-payload-website-template
```

Or use **[Use this template](https://github.com/mhkxx2/nextjs-payload-website-template/generate)** on GitHub.

### Development

```bash
cp .env.example .env
# edit DATABASE_URI, PAYLOAD_SECRET (>=32 chars), NEXT_PUBLIC_SERVER_URL, PREVIEW_SECRET, REVALIDATION_SECRET

pnpm install
pnpm payload migrate    # apply DB migrations
pnpm dev                # http://localhost:3000  |  admin: /admin
```

First admin user is created through the Payload onboarding flow at `/admin`.

### Optional: Docker Compose (app + Postgres)

```bash
docker compose up
```

Compose starts Postgres 16 and the Next/Payload app on port `3000` with local-only defaults. **Replace every secret before any shared or production use.**

---

## SEO, AEO & GEO (detailed)

This template ships a production **search + answer + generative/local** discovery stack — not just a meta title field.

### SEO (classic search engines)

| Capability | What ships |
| --- | --- |
| **CMS SEO fields** | Per-document SEO title (≤60), meta description (≤180), required canonical URL, index/follow toggles |
| **Open Graph & Twitter** | OG title/description/image + Twitter card metadata via Next `Metadata` helpers |
| **Admin SEO preview** | In-admin search/social preview UI (`SEOPreview`) |
| **Site-wide defaults** | `SEODefaults` global + `@payloadcms/plugin-seo` |
| **Canonical policy** | Trailing-slash canonical URLs, origin-safe resolution, drafts/utility paths excluded |
| **robots.txt** | App Router `robots` route; disallows `/admin/`, `/api/`, `/graphql/`, `/internal/`, `/next/`, `/search/` |
| **sitemap.xml** | Dynamic sitemap of published, indexable pages/posts/projects/services (+ structural routes & catalogue products) |
| **Redirects** | Payload redirects plugin + collision-safe public route contract |
| **404 / soft 404 hygiene** | Dedicated not-found handling; filtered catalogue views can force `noindex` when appropriate |
| **Site icons for crawlers** | Favicon / apple-touch / icon routes served outside `/api/` so robots are not blocked |
| **On-demand revalidation** | Cache tags + revalidation hooks so SEO URLs stay fresh after CMS edits |

### AEO (Answer Engine Optimization)

Built so assistants and answer surfaces can extract clear entities and Q&A:

- **JSON-LD schema.org** graph with allowlisted types only: `Organization`, `LocalBusiness`, `Service`, `Article`, `FAQPage`, `BreadcrumbList`
- **FAQPage** emitted only for FAQs editors mark `schemaEligible` (and that are publicly published)
- **Service / Article / Breadcrumb** entities for service landings, posts, and navigation trails
- **Safe serialization** (escaped JSON-LD) so markup cannot break out of the script tag
- **Structured contact & organization** fields from globals (brand, business name, logo, social) for entity clarity
- **CMS-controlled schema type selection** on records (`schemaTypes` multi-select)

### GEO (Generative + geographic / local discovery)

- **LocalBusiness** schema with opening hours, contact, and **`areaServed`** when service areas exist
- **Areas** collection + **Location Coverage** layout block for city/emirate service geography
- **Google Maps** business URL on Contact (`mapURL`) and Google Reviews (`mapsUrl`) — validated HTTPS Maps hosts only
- **Google Place ID** (Payload `google-reviews` global) ties the site to the real Maps listing
- **Write-a-review** + **View on Google** deep links for local trust signals
- Entity-rich service/portfolio pages that generative engines can cite with NAP-style business context

---

## Analytics & Google Tag Manager (integrated)

Production frontends load a full measurement stack from the root layout:

1. **Consent Mode v2 defaults** (`beforeInteractive`) — storage defaults queued **before** tags
2. **Google Tag Manager** — container snippet + `<noscript>` iframe (`NEXT_PUBLIC_GTM_ID`)
3. **Google Analytics 4** — gtag.js loader + config (`NEXT_PUBLIC_GA_ID`)
4. **Shared `dataLayer`** — typed helper pushes privacy-safe events (allowlisted params only; no raw PII)

### Conversion / engagement events

| Event | Typical trigger |
| --- | --- |
| `whatsapp_click` | Tracked WhatsApp CTAs (hero, sticky bar, service landings, catalogue) |
| `phone_call_click` | Click-to-call CTAs |
| `generate_lead` | Confirmed quote/lead form success |
| `select_item` / `view_item` | Catalogue / product exploration |
| `reviews_view_google_click` / `review_write_click` | Google Reviews CTAs |

Cookie UI: **Cookie Consent** banner + settings button; consent updates align with GTM/GA4 Consent Mode v2. Analytics scripts are intended for **production** (`NODE_ENV=production`).

Configure per brand:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

---

## Google Reviews & Google Maps

| Piece | Details |
| --- | --- |
| **Payload global** | `Google Reviews` (`google-reviews`): enable flag, Place ID, heading/subheading, review limit (3–5), Maps URL, write-review URL |
| **Native reviews** | Server fetch via **Places API (New)** using **server-only** `GOOGLE_PLACES_API_KEY` (never `NEXT_PUBLIC_*`, never stored in Payload) |
| **UI** | Stars, carousel/scroller, review text, attribution links; tracked view/write CTAs |
| **Fallback** | If disabled / missing key / missing Place ID → still shows “View on Google” + “Write a Review” Maps links |
| **Contact Maps** | `ContactInformation.mapURL` for the business listing (validated Google Maps hosts) |
| **Caching** | Reviews payload revalidated periodically; graceful last-good fallback while the process is warm |

Production gate: `pnpm env:check` requires a non-empty `GOOGLE_PLACES_API_KEY` for production-shaped environments.

---

## Features (detailed)

### Collections

| Collection | Purpose |
| --- | --- |
| **Users** | Auth-enabled admins for Payload |
| **Pages** | Draft-enabled layout-builder pages |
| **Posts** | Blog / news with layout builder |
| **Projects** | Case-style project pages |
| **Services** | Service catalogue + landing data |
| **PortfolioItems** | Portfolio gallery / explorer |
| **Media** / **LeadMedia** | Uploads + lead attachment media |
| **FAQs** / **Testimonials** | Reusable trust content (FAQs support schema-eligible AEO) |
| **Leads** | Private inbound quote/contact leads |
| **Redirects** | Managed URL redirects (SEO migrations) |
| **Areas** / **Categories** | Location + taxonomy (GEO / local coverage) |
| **CurtainBlindCategories** / **CurtainBlindProducts** | Catalogue-style product lines |

### Globals

Header, Footer, Homepage, AboutPage, ContactPage, ContactInformation (incl. **Google Maps URL**), SiteSettings, **SEODefaults**, SocialMedia, ArchiveSettings, **GoogleReviews**.

### Layout builder blocks

`Hero`, `Content`, `RichContent`, `SplitContent`, `MediaBlock`, `Banner`, `CallToAction`, `Form`, `QuoteForm`, `Faqs`, `Testimonials`, `ServiceGrid`, `ProcessSteps`, `Benefits`, `Statistics`, `LocationCoverage`, `ProjectGallery`, `RelatedPosts`, `ArchiveBlock`, `Code`.

### Frontend / growth

- Service landings (sofa upholstery, bed upholstery, curtains & blinds)
- Portfolio explorer
- Quote request endpoint + SMTP notifications (`@payloadcms/email-nodemailer`)
- Mobile sticky contact bar + GTM-tracked contact links
- **GTM + GA4 + Consent Mode v2** analytics scripts
- **Google Reviews** section (Places API New) + Maps deep links
- Import/verify scripts for catalogue and portfolio batches

### Plugins & platform

- `@payloadcms/plugin-seo`, `form-builder`, `nested-docs`, `redirects`, `search`
- `@payloadcms/richtext-lexical`, `live-preview-react`, `admin-bar`
- `next-sitemap`, Tailwind CSS v4, Radix/shadcn-style primitives
- Access control for published vs authenticated content
- On-demand revalidation hooks + cache tags
- Draft / live preview secrets

### Inherited from Payload Website Template

Pre-configured Payload config, authentication, access control, layout builder, draft preview, live preview, on-demand revalidation, SEO, search, redirects, and website App Router — then extended for service-business production use. See [Payload Website Template](https://github.com/payloadcms/payload/tree/main/templates/website).

---

## Environment variables

Copy `.env.example` → `.env`. Required for a healthy local/prod boot:

| Variable | Notes |
| --- | --- |
| `DATABASE_URI` | PostgreSQL connection string (project-specific DB — never reuse another brand’s DB) |
| `PAYLOAD_SECRET` | ≥ 32 random characters |
| `NEXT_PUBLIC_SERVER_URL` | Public site origin, e.g. `https://example.com` |
| `PREVIEW_SECRET` | Draft preview |
| `REVALIDATION_SECRET` | On-demand revalidation |

Analytics, Maps & Reviews:

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_GTM_ID` | **Google Tag Manager** container ID (integrated in root layout) |
| `NEXT_PUBLIC_GA_ID` | **Google Analytics 4** measurement ID |
| `GOOGLE_PLACES_API_KEY` | **Server-only** Places API (New) for native Google Reviews — never expose as `NEXT_PUBLIC_*` |
| `SMTP_*` | Lead email delivery |

Run `pnpm env:check` before production builds.

---

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Local development |
| `pnpm build` / `pnpm start` | Production build & serve |
| `pnpm payload migrate` | Run migrations |
| `pnpm seed` | Optional seed content |
| `pnpm template:check` | Ensure demo artifacts stay removed |
| `pnpm release:gate` | Env + template check + lint + types + tests + build |
| `pnpm test:unit` / `test:integration` / `test:e2e` / `test:a11y` | Quality suites |

---

## Production build (VPS / bare metal)

Typical flow used for the live UAE sites (Node process behind Nginx / reverse proxy):

```bash
cp .env.example .env
# set production DATABASE_URI, secrets, NEXT_PUBLIC_SERVER_URL=https://your-domain.com

pnpm install --frozen-lockfile
pnpm payload migrate
pnpm env:check
pnpm build
pnpm start
# or: node .next/standalone/server.js  when using Next standalone output
```

### Reverse proxy checklist

1. Point DNS `A`/`AAAA` (and `www`) to the server.
2. Terminate TLS on Nginx / Caddy / aaPanel.
3. Proxy to the Node listen address (e.g. `127.0.0.1:3000` or your chosen port).
4. Forward `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`.
5. Allow Payload media routes (`/api/media/...`) and admin (`/admin`).
6. Persist upload storage (`storage/` or your configured media path) across deploys.
7. Keep `.env` outside the public web root; never commit it.

### Standalone / process manager

`next.config.ts` sets `output: 'standalone'`. After `pnpm build` you can run the standalone server under **pm2**, **systemd**, or Docker.

Example pm2:

```bash
pnpm build
pm2 start pnpm --name my-site -- start
# or point pm2 at .next/standalone/server.js with HOSTNAME=0.0.0.0 PORT=3000
```

### Docker production image

```bash
docker build -t nextjs-payload-website .
docker run --env-file .env -p 3000:3000 nextjs-payload-website
```

Ensure Postgres is reachable from the container (`DATABASE_URI` host must work inside the network).

### Deploy updates

```bash
git pull
pnpm install --frozen-lockfile
pnpm payload migrate
pnpm build
# restart process manager / container
```

Always backup Postgres + media storage before migrate/deploy.

---

## Reuse on a new brand

1. Clone this repo (or use **Use this template** on GitHub).
2. Follow [`TEMPLATE.md`](TEMPLATE.md): rename package/brand, swap logo/favicon, new DB + secrets.
3. Update `NEXT_PUBLIC_SERVER_URL` and any hardcoded image host allowlists in `next.config.ts`.
4. `pnpm install` → `pnpm payload migrate` → `pnpm template:check` → `pnpm dev`.
5. Do **not** copy another site’s `.env`, database, or upload storage.

Isolation tip (as used for Al Mustajid vs Al Rukn): each brand gets its own database, secrets, deploy directory, and env file.

---

## Project structure (high level)

```text
src/
  app/(frontend)/     # Public Next.js routes
  app/(payload)/      # Payload admin + API
  blocks/             # Layout builder blocks
  collections/        # CMS collections
  globals/            # Site-wide globals
  components/         # UI + landing kits
  endpoints/          # Custom API (e.g. quote request)
  migrations/         # Payload DB migrations
  lib/                # SEO, analytics, cache, queries
docs/                 # Provenance, plans, ops notes
scripts/              # Seed, import, verify, env checks
tests/                # Unit, integration, e2e, a11y
```

---

## Provenance & license

- Upstream: official Payload `website` template via `create-payload-app@3.89.0` (PostgreSQL). See [`docs/template-provenance.md`](docs/template-provenance.md).
- Template license file: [`LICENSE.template-payload`](LICENSE.template-payload) (upstream attribution).
- Production engineering & extensions: [Mudassar](https://mudassar.net/).

---

## Support

- Developer site: [https://mudassar.net/](https://mudassar.net/)
- Live references: [alruknfurniture.ae](https://alruknfurniture.ae/) · [almustajid.ae](https://almustajid.ae/)
- Issues: use this GitHub repository’s Issues tab
