# Al Rukn Furniture

Payload CMS and Next.js foundation for the Al Rukn Furniture website.

## Local development

1. Copy `.env.example` to `.env` and provide local-only values.
2. Run `pnpm install`.
3. Run `pnpm dev` and open `http://localhost:3000`.

The project retains the upstream starter's App Router, collections, blocks, globals, and plugin wiring. Its generated demonstration records, seed route, imagery, and upstream-branded entry points were removed before this baseline was committed. See [`docs/template-provenance.md`](docs/template-provenance.md) for the exact source and cleanup record.

Run `pnpm template:check` to verify that known generated demo artifacts have not returned.
