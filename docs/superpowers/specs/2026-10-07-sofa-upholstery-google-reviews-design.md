# Sofa Upholstery Landing Page and Google Reviews Design

## Objective

Upgrade `/sofa-upholstery/` into a premium, mobile-first paid-search and organic-search landing page while preserving Al Rukn's established visual system, truthful Ajman workshop positioning, existing conversion analytics, Payload ownership, and production performance.

The page must not copy competitor wording or layouts. Competitor research contributes only proven information patterns: immediate contact actions, visual service choices, material education, process explanation, proof, related services, local coverage, FAQs, and repeated but restrained conversion opportunities.

## Baseline findings

- The live route is healthy at 375, 430, 768, 1024, 1440, and 1920 pixels: HTTP 200, one H1, no horizontal overflow, no broken images, and no application or hydration errors.
- The current page contains four service cards, three gallery images, three related-service links, and four FAQs.
- The existing generic `ServicePage` already supports hero content, trust points, editorial sections, benefits, materials, comparison, process, gallery, areas, FAQs, related services, quote context, SEO, and schema.
- The current sofa imagery is a mixture of clearly labelled AI-generated inspiration and licensed photography. The imported Eco Furniture media inventory provides suitable owned catalogue imagery for visual variety. No verified matched Al Rukn before/after pair was found, so no before/after section will be published.
- The provided Maps URL resolves to `AL RUKN FURNITURE UPHOLSTERY` in Ajman. The Place ID remains an administrator-supplied value and is never inferred or hard-coded.
- No Google Maps key or Place ID is currently configured.

## Approved architecture

### CMS-owned Google Reviews settings

Add a reusable Payload global named `Google Reviews` with slug `google-reviews` and these fields:

- `enabled`: checkbox, default `false`
- `placeId`: trimmed text, optional
- `heading`: localized text, default `What Our Customers Say`
- `subheading`: localized textarea
- `reviewLimit`: number, default `5`, minimum `3`, maximum `5`
- `mapsUrl`: validated HTTPS URL, default `https://maps.app.goo.gl/zUhpC9PNhgwM69qp6`
- `writeReviewUrl`: validated HTTPS URL, default `https://g.page/r/CZ5_iPy3nYpdEBM/review`

The global is reusable by the homepage, any service page, and the contact page. It contains configuration only—never review text, ratings, reviewer data, or API credentials. Payload's existing global cache may cache these settings because they are first-party configuration, not Google Places content.

### Official Google Places UI Kit

The review section is a reusable server/client composition:

- The server component reads the cached `google-reviews` global and emits headings, safe external links, and either the widget boundary or fallback.
- A small client island uses `IntersectionObserver` to load the Google Maps JavaScript API only as the section approaches the viewport.
- The public browser credential comes only from `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
- The UI Kit request receives `placeId` from Payload at render time. No Place ID appears as a source constant or environment default.
- The official `gmp-place-details` element is configured to display the place name, rating, and reviews with Google-controlled author and Maps attribution.
- No Google review response is written to Payload, the database, Next cache, local storage, or application logs.
- Loading, unavailable, and failed states retain working `View Reviews on Google` and `Write a Review` actions.

Google controls which reviews the UI Kit supplies and how many are available. `reviewLimit` controls the visual review viewport preset (three to five card-equivalent rows) rather than filtering or rewriting Google's response. The admin field description will state this clearly.

The browser key must be restricted in Google Cloud to:

- `https://alruknfurniture.ae/*`
- `https://www.alruknfurniture.ae/*`

Only the Maps JavaScript API and Places API/UI Kit capabilities required by the widget should be enabled. The site must fail closed to the link-only fallback when the key, Place ID, or widget load is unavailable.

### Sofa-specific presentation without redesigning every service

Keep `ServicePage` as the shared service route foundation. Add an optional `sofaUpholsteryLanding` group to the existing Service collection, displayed in Payload only for the `sofa-upholstery` record. A dedicated `SofaUpholsteryPage` renderer consumes the normal Service record plus this optional group. Other service routes remain unchanged.

The group owns:

- visual service cards with image, title, short explanation, CTA label, optional internal route, and coming-soon state;
- fabric cards with image, best-use, comfort, and durability notes;
- foam-and-comfort heading, copy, bullet points, and CTA label;
- optional future-service teaser for Bed Upholstery with no link;
- optional section CTA labels where the generic schema cannot express the approved copy.

Existing Service fields remain the source for hero, trust row, long-form technical copy, repair comparison, process, benefits, gallery, areas, FAQs, related services, quote content, SEO, and schema. This minimizes schema expansion and preserves editor familiarity.

## Page structure

1. Breadcrumbs.
2. Conversion hero: eyebrow, `Sofa Upholstery in Dubai` H1, short service/location copy, Quote, WhatsApp, and Call actions, plus four trust points.
3. Popular Sofa Upholstery Services: nine image-led cards, with Bed & Headboard Upholstery visibly marked `Coming Soon` and no anchor.
4. Existing technical introduction retained and edited for scanning.
5. Sofa Upholstery Gallery: 8–16 Payload Media items, responsive reserved ratios, lazy loading, captions, and accessible lightbox.
6. Choose the Right Upholstery Fabric: Chenille, Velvet, Boucle, Linen Blends, Durable Woven Fabrics, and Performance Fabrics only if confirmed.
7. Restore Comfort, Not Just the Fabric.
8. Sofa Repair vs Reupholstery, with the repair side linked to `/sofa-repair/`.
9. Four-step process.
10. Why Choose Al Rukn using only verified statements.
11. What Our Customers Say: reusable Google Reviews section and fallback actions.
12. Related Furniture Services: image cards for Custom Furniture, Custom Sofa, Sofa Repair, Curtains & Blinds, and an unlinked Bed Upholstery coming-soon card.
13. Sofa Upholstery Across Dubai, Sharjah & UAE.
14. Thirteen visible FAQs matching FAQPage output.
15. Get a Sofa Upholstery Quote with photo upload, consent, WhatsApp, and Call alternatives.

The before/after section is omitted until matched genuine project images are available.

## Gallery and lightbox

Use existing Payload Media and approved Eco Furniture-owned assets before adding licensed or generated support imagery. Inspiration/catalogue images are labelled as inspiration and never represented as completed Al Rukn projects.

The lightbox is a focused client island and reuses the proven portfolio interaction model: button triggers, dialog semantics, initial focus, focus containment, Escape close, ArrowLeft/ArrowRight navigation, swipe threshold, focus restoration, body-overflow cleanup, descriptive alt text, caption, and fixed image geometry. No carousel dependency is added.

## SEO and schema

- Absolute title: `Sofa Upholstery Dubai | Reupholstery & Sofa Repair | Al Rukn`
- H1: `Sofa Upholstery in Dubai`
- Description: `Professional sofa upholstery in Dubai for fabric replacement, foam renewal, corner sofas, chairs and Majlis seating. Serving Dubai from our Ajman workshop. Send photos for a quote.`
- Canonical: `https://alruknfurniture.ae/sofa-upholstery/`
- Exactly one H1; section headings follow the approved H2 structure.
- Emit Service, BreadcrumbList, and FAQPage only. FAQPage uses exactly the visible schema-eligible FAQs.
- Do not emit AggregateRating, Review, Product, Offer, prices, discounts, turnaround promises, warranties, branch claims, or project counts.

## Analytics

Preserve the existing GA4 and GTM installation and event names:

- `whatsapp_click`
- `phone_call_click`
- `generate_lead`

Every relevant event on this route retains `service = sofa-upholstery`. Google review actions use ordinary external links in this iteration; no new GA4 event names are introduced and no review/customer PII is sent.

## Accessibility and performance

- Server-render all editorial content; client JavaScript is limited to gallery lightbox and lazy UI Kit loader.
- Load the Maps JavaScript API only near the reviews viewport and only when enabled, a Place ID exists, and a browser key exists.
- Reserve all image dimensions and use responsive `sizes`; only the hero is priority-loaded.
- Maintain 48px mobile targets, visible focus, reduced-motion compatibility, sticky-CTA clearance, cookie-consent clearance, and no horizontal overflow.
- A failed Google script must never produce an empty or broken section.

## Content and deployment boundaries

- Content remains Payload-managed; no competitor content or imagery is reused.
- No `/bed-upholstery/` route is created.
- No production deployment is part of implementation unless separately approved.
- Build and browser verification must run from an isolated copy/worktree so the live PM2 process never sees a partially replaced `.next` directory.

