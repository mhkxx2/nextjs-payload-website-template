# Payload website template provenance

## Source and generation

- **Generator:** `create-payload-app@3.89.0`
- **Template selector:** `website`
- **Database transformation:** PostgreSQL (`--db postgres --db-accept-recommended`)
- **Generation completed:** `2026-09-12T19:09:32.074838Z` (UTC; latest generated-file timestamp)
- **Official template URL reported by the generator:** `https://github.com/payloadcms/payload/templates/website#3.x`
- **Human-readable upstream path:** <https://github.com/payloadcms/payload/tree/3.x/templates/website>
- **Codeload branch reported by the generator:** `3.x`
- **Generated tree:** `/tmp/alrukn-generator-noninteractive/alrukn-payload-website`
- **Generated files validated before import:** `201`

The generator was run non-interactively from an empty parent directory with the exact command below. The generated tree was validated before copying; it contained `package.json`, both `src/app/(frontend)` and `src/app/(payload)`, collections, blocks, Header, Footer, and plugin wiring. Its generated `.env` was deliberately excluded.

```bash
export PATH=/opt/node24/bin:$PATH
cd /tmp/alrukn-generator-noninteractive
npx create-payload-app@3.89.0 -n alrukn-payload-website -t website --db postgres --db-accept-recommended --use-pnpm --no-agent --no-deps --no-git --debug
```

The generator's successful debug output identified the official GitHub template URL above, the `3.x` codeload branch, Payload `3.89.0`, the PostgreSQL adapter transformation, `201` generated files, and successful completion. The repository's existing `.git`, `docs`, and ignore rules were preserved; template ignore rules were merged manually.

## Generated dependency manifest

### Runtime dependencies

| Package | Generated range/version |
| --- | --- |
| `@payloadcms/admin-bar` | `3.89.0` |
| `@payloadcms/live-preview-react` | `3.89.0` |
| `@payloadcms/next` | `3.89.0` |
| `@payloadcms/plugin-form-builder` | `3.89.0` |
| `@payloadcms/plugin-nested-docs` | `3.89.0` |
| `@payloadcms/plugin-redirects` | `3.89.0` |
| `@payloadcms/plugin-search` | `3.89.0` |
| `@payloadcms/plugin-seo` | `3.89.0` |
| `@payloadcms/richtext-lexical` | `3.89.0` |
| `@payloadcms/ui` | `3.89.0` |
| `@radix-ui/react-checkbox` | `^1.0.4` |
| `@radix-ui/react-label` | `^2.0.2` |
| `@radix-ui/react-select` | `^2.0.0` |
| `@radix-ui/react-slot` | `^1.0.2` |
| `class-variance-authority` | `^0.7.0` |
| `clsx` | `^2.1.1` |
| `cross-env` | `^7.0.3` |
| `dotenv` | `16.4.7` |
| `geist` | `^1.3.0` |
| `graphql` | `^16.8.2` |
| `lucide-react` | `0.563.0` |
| `next` | `16.3.3` |
| `next-sitemap` | `^4.2.3` |
| `payload` | `3.89.0` |
| `prism-react-renderer` | `^2.3.1` |
| `react` | `19.2.6` |
| `react-dom` | `19.2.6` |
| `react-hook-form` | `7.71.1` |
| `sharp` | `0.34.2` |
| `tailwind-merge` | `^3.4.0` |
| `@payloadcms/db-postgres` | `3.89.0` |

### Development dependencies

| Package | Generated range/version |
| --- | --- |
| `@eslint/eslintrc` | `^3.2.0` |
| `@playwright/test` | `1.58.2` |
| `@tailwindcss/postcss` | `^4.1.18` |
| `@tailwindcss/typography` | `^0.5.19` |
| `@testing-library/react` | `16.3.0` |
| `@types/escape-html` | `^1.0.2` |
| `@types/node` | `22.19.9` |
| `@types/react` | `19.2.14` |
| `@types/react-dom` | `19.2.3` |
| `@vitejs/plugin-react` | `4.5.2` |
| `autoprefixer` | `^10.4.19` |
| `eslint` | `^9.16.0` |
| `eslint-config-next` | `16.3.3` |
| `jsdom` | `28.0.0` |
| `postcss` | `^8.4.38` |
| `prettier` | `^3.4.2` |
| `tailwindcss` | `^4.1.18` |
| `tsx` | `4.22.4` |
| `tw-animate-css` | `^1.4.0` |
| `typescript` | `5.7.3` |
| `vite-tsconfig-paths` | `6.0.5` |
| `vitest` | `4.0.18` |

No dependency ranges were changed during import. `pnpm-lock.yaml` records the installation resolution produced by pnpm `10.34.5`.

## License

Payload's upstream `3.x` branch is MIT licensed. `LICENSE.template-payload` is a verbatim copy of <https://github.com/payloadcms/payload/blob/3.x/LICENSE.md> fetched during this import. Its SHA-256 is:

```text
f5622f480e4419ef6be7691d4b04521a5f18365ddedb9a160e92a4b365e94ecd
```

## Demo artifacts removed or replaced

- Deleted `src/endpoints/seed/` in full, including demo users, pages, posts, categories, forms, copy, and remote demo-image fetches.
- Deleted the public `/next/seed` route and the Admin dashboard `SeedButton` UI.
- Removed the generated Payload social image `public/website-template-OG.webp` and Payload favicon files.
- Replaced the externally hosted Payload logo with repository-owned `public/al-rukn-logo.svg`.
- Added repository-owned neutral `public/favicon.svg` and `public/al-rukn-social-card.svg` assets.
- Replaced generated Payload Website Template titles/descriptions across metadata, SEO plugin defaults, listing pages, and end-to-end expectations.
- Replaced the generated seeded-home fallback with neutral repository-owned `src/data/home-static.ts`.
- Replaced the template README and its demo-author/seed instructions with project-specific setup notes.

The Payload Admin route group, collection/block structure, Header/Footer globals, PostgreSQL adapter state produced by the generator, and template plugin wiring remain intact.

## Enforcement

`scripts/assert-template-clean.mjs` checks the exact generated demo paths and strings found in the pristine import. `tests/unit/template-provenance.test.ts` exercises the scanner. Run either:

```bash
pnpm vitest run tests/unit/template-provenance.test.ts
pnpm template:check
```
