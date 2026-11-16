# Reusing this template on another project

Production-proven **Next.js 16 + Payload CMS 3.89** baseline. Live references:

- [alruknfurniture.ae](https://alruknfurniture.ae/)
- [almustajid.ae](https://almustajid.ae/)

Developer: [Mudassar — mudassar.net](https://mudassar.net/)

## Checklist

1. **Clone or “Use this template”** on GitHub (public template repo).
2. Rename `package.json` `name` / `description` and brand strings (logo, SiteSettings, SMTP from-name).
3. Copy `.env.example` → `.env` with **new** secrets and a **new** Postgres database.
4. Set `NEXT_PUBLIC_SERVER_URL` to the new domain.
5. Update image remote allowlist hosts in `next.config.ts` for the new domain.
6. `pnpm install` → `pnpm payload migrate` → `pnpm template:check` → `pnpm dev`.
7. Clear or re-seed CMS content; replace `public/` brand assets.
8. Configure optional GA/GTM, SMTP, and `GOOGLE_PLACES_API_KEY` (server-only).
9. Deploy behind TLS reverse proxy; persist media storage; run `pnpm release:gate` before go-live.

## Never copy between brands

- Production `.env`
- Another brand’s `DATABASE_URI`
- Upload `storage/` / media libraries from a different site

## Deploy (short)

See the full **Production build** and **Deploy updates** sections in [`README.md`](README.md).
