# Payload Live Source of Truth Design

## Objective

Make Payload CMS the single source of truth for normal editable content on
alruknfurniture.ae while retaining the current Next.js routes, components,
visual design, publication rules, and production infrastructure.

Published CMS changes must become visible through on-demand cache
invalidation. Draft and future-scheduled content must remain private.

## Content ownership

The existing globals retain their current responsibilities:

- Homepage: homepage SEO, hero, trust strip, ordered sections, section labels,
  homepage CTAs, and quote-form presentation copy.
- Header: primary navigation, service navigation, conversion actions, and
  mobile navigation.
- Footer: navigation groups, service links, legal links, supporting copy, and
  footer conversion content.
- Site Settings: business branding, logo, favicon, Apple icon, announcement,
  and shared WhatsApp presentation.
- Contact Information: phone, WhatsApp number, email, address, opening hours,
  map URL, and service-area contact data.
- SEO Defaults: site-wide metadata and organization/local-business schema
  defaults.

Three dedicated globals are added:

- About Page: hero, proof strip, story, service-section labels, process,
  principles, coverage, CTA, and page SEO.
- Contact Page: hero, workshop-card labels, channel labels, quote section,
  opening-hours presentation, coverage labels, service-section labels, CTAs,
  and page SEO. Business coordinates remain in Contact Information.
- Archive Settings: explicit `servicesArchive`, `projectsArchive`,
  `blogArchive`, and `portfolioArchive` groups. Each group owns named heading,
  introduction, empty-state, CTA, and SEO fields where relevant. Portfolio
  additionally owns its hero, filter labels, and supporting labels.

The Services collection gains an optional presentation-label group for the
headings and labels that are currently fixed in the service-page renderer.
Service content, media, relationships, CTA context, and SEO remain on each
Service record.

Code remains responsible for layout, rendering, canonical route construction,
publication validation, safe emergency fallbacks, and fixed structural choices
such as the nine supported service routes.

## Data migration

The Payload migration is additive only. It creates the new global storage and
new optional columns/tables required by the expanded fields. It must contain no
drop operations, destructive type conversions, or changes to existing editor
content.

After applying the migration, a narrowly scoped population step writes the
current production copy only into empty newly introduced fields. It does not
run the broad seed process and does not update existing editor-managed fields.
Runtime imports from repository content constants are removed only after the
new CMS values have been read back and verified.

## Public query and cache model

Cache identifiers are centralized in `src/lib/cacheTags.ts` through reusable
constructors for globals, collections, documents, layout, metadata, homepage,
and media dependencies.

Public list and document queries use persistent Next.js data caching and attach
the same collection/document tags that Payload hooks invalidate. Query cache
keys include normalized query arguments. Preview mode bypasses persistent
caching and reads draft content directly.

Every public read continues applying the shared publication predicate:

- Payload `_status` equals `published`
- business `status` equals `published`
- `publishedAt` is not in the future

## Revalidation model

Payload-originated invalidation uses `revalidateTag(tag, { expire: 0 })` for
immediate Next.js 16 expiry, with targeted `revalidatePath()` calls for the
full-route cache.

- Homepage invalidates `/`.
- Header and Footer invalidate their global tags and the root layout tree.
- Site Settings invalidates branding/global dependencies, Header/Footer, `/`,
  and the root layout tree so logo, favicon, metadata, and chrome refresh.
- Contact Information invalidates its tag, the layout tree, homepage, Contact,
  Services, and Portfolio routes.
- SEO Defaults invalidates metadata/global tags and the layout tree.
- About Page invalidates `/about-us/`.
- Contact Page invalidates `/contact/`.
- Archive Settings invalidates Services, Projects, Blog (including pagination),
  and Portfolio archives.
- Services invalidate the collection tag, old/new detail paths, Services
  archive, homepage, related records, and sitemap.
- Projects invalidate the collection tag, old/new detail paths, Projects
  archive, homepage, related records, and sitemap.
- PortfolioItems invalidate the collection tag and `/portfolio/` for create,
  update, publication changes, image/category changes, and deletion.
- Areas, FAQs, and Testimonials invalidate their collection tags, related
  detail routes, and homepage whenever the changed record is public or was
  previously public.
- Media changes invalidate media-dependent collection/global tags and the root
  layout tree. This deliberately broad on-demand invalidation ensures deeply
  populated media relationships, logo changes, and favicon changes cannot stay
  stale.

Draft-only saves may invalidate a cache entry but public regeneration always
reads the published version. Therefore draft values never enter public output.

## Verification

Tests cover global ownership, collection cache tags, document tags, immediate
invalidation, route mapping, publication filtering, metadata, navigation,
logo/favicon sourcing, media invalidation, and Homepage relationship
invalidation.

After migration and population, reversible production edits prove the required
flow:

`Payload edit/publish -> public refresh -> updated output`

The test values are then restored through Payload and their restoration is
verified. No build, PM2 restart, or redeployment occurs between the publish and
public-page checks.

## Constraints

- No visual redesign or URL changes.
- No Nginx, PM2, ERP, or infrastructure changes.
- No broad seed or ECO import.
- No deletion or overwrite of existing production content.
- No exposure of drafts or scheduled content.
- Existing hard-coded copy remains as an emergency fallback until equivalent
  CMS fields are populated and verified.
