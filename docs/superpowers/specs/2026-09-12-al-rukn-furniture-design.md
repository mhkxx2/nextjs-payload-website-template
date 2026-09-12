# Al Rukn Furniture Upholstery — Formal Design Specification

**Status:** Approved  
**Date:** 2026-09-12  
**Product:** Al Rukn Furniture Upholstery public website and content-management platform  
**Canonical production domain:** `https://alruknfurniture.ae`  
**Technical foundation:** Official `payloadcms/payload` Website Template (`templates/website`, MIT License)

## 1. Purpose and Product Outcomes

This specification defines the approved design for replacing the current empty WordPress installation with a production-ready, conversion-focused website for Al Rukn Furniture Upholstery. The product must present a premium modern furniture brand, make quotation and WhatsApp enquiries easy, support independent search optimization for every service, and give authorized staff complete control over content through Payload CMS.

The primary outcomes are:

1. Establish a credible, premium digital presence for custom furniture and upholstery services in the UAE.
2. Convert qualified visitors through free-quotation forms, contextual WhatsApp conversations, and mobile-friendly phone links.
3. Provide an editor-friendly CMS for pages, services, projects, posts, media, SEO, testimonials, FAQs, redirects, contact data, and lead management.
4. Launch in English while making the data model, layout, components, and styling structurally ready for a later Arabic/RTL release.
5. Preserve search-engine integrity with collision-safe routing, editable metadata, structured data, canonical URLs, redirects, sitemap generation, and correct HTTP behavior.
6. Replace WordPress only after the new application has passed all build, runtime, security, data, and deployment verification gates.

Success is defined by a polished public experience, valid and editable CMS content, reliable lead attribution, secure local infrastructure, and a reversible production rollout.

## 2. Scope and Non-Goals

### In scope

- A responsive public website using the approved routes and page types.
- Payload CMS administration at `/admin` in the same Next.js application.
- The approved collections, globals, reusable content blocks, editorial workflow, and role-restricted administration.
- Original English launch content written for Al Rukn Furniture Upholstery.
- Premium royalty-free launch imagery, with licensing/source records retained and all images replaceable in Payload.
- Quotation forms, contextual WhatsApp links, mobile phone links, lead attribution, lead statuses, and thank-you states.
- Technical and local SEO, structured data, sitemaps, robots directives, canonical handling, breadcrumbs, redirects, and real 404 responses.
- Local PostgreSQL, standalone Next.js deployment, PM2 process supervision, Nginx reverse proxying, HTTPS and canonical-host redirects.
- WordPress backup, staged build, controlled cutover, automated backups, documented recovery, and rollback.
- Automated and manual verification of the acceptance criteria in this specification.

### Not in scope for the initial launch

- Arabic translation or an Arabic public locale. The launch must be Arabic/RTL-ready without publishing untranslated Arabic pages.
- E-commerce checkout, online payment, customer accounts, product stock, or order management.
- A native mobile application.
- Importing meaningful legacy content; the inspected WordPress installation contains only default content and no uploaded media.
- Carrying over Payload template demo branding, records, logos, imagery, or sample copy.

## 3. Approved Technical Foundation and Architecture

The application must be based on the official Payload Website Template from `payloadcms/payload/templates/website`, imported through Payload's supported template mechanism. The template is a technical foundation only. All demonstration identity, records, imagery, and copy must be removed before launch.

The approved runtime architecture is:

- **Framework:** Next.js 16 App Router.
- **CMS:** Payload CMS embedded in the same application and exposed to authorized editors at `/admin`.
- **Language:** TypeScript with strict type checking.
- **Styling:** Tailwind CSS, using a project-specific token system rather than template branding.
- **Database:** Local PostgreSQL database named `alrukn_furniture`, accessed by a dedicated restricted application user.
- **Rendering:** React Server Components by default; Client Components only for behavior that requires browser interactivity.
- **Production output:** Next.js `output: 'standalone'`.
- **Process management:** PM2 with restart-on-failure and restart-on-boot.
- **Edge/web server:** Nginx terminating TLS and reverse proxying to a Node process bound only to `127.0.0.1`.
- **Media:** Payload-managed local uploads in the initial deployment, included in backup and restore procedures.
- **Source control:** Git-managed application source; secrets and generated/runtime assets must not be committed.

Runtime secrets and deployment-specific values are stored only in a mode-`0600` production `.env`. The required application variables are `DATABASE_URI`, `PAYLOAD_SECRET`, and `NEXT_PUBLIC_SERVER_URL=https://alruknfurniture.ae`; the PostgreSQL adapter reads `DATABASE_URI`. Any additional operational secrets, including preview, cron, and backup credentials, follow the same protected-file rule and must never use a `NEXT_PUBLIC_` prefix.

The website, Payload Admin, server routes, hooks, migrations, and API must remain one coherent deployable application. Domain-specific code must be separated into typed collections, globals, blocks, utilities, access controls, hooks, route components, and tests so that content logic does not leak into presentation components.

## 4. Information Architecture and Route Contract

The public route contract is:

| Route | Purpose |
|---|---|
| `/` | Premium, conversion-focused homepage |
| `/sofa-upholstery/` | Sofa Upholstery service page |
| `/custom-furniture/` | Custom Furniture service page |
| `/custom-sofa/` | Custom Sofa service page |
| `/majlis-furniture/` | Majlis Furniture service page |
| `/curtains-blinds/` | Curtains & Blinds service page |
| `/sofa-repair/` | Sofa Repair service page |
| `/custom-wardrobes/` | Custom Wardrobes service page |
| `/custom-beds-headboards/` | Custom Beds & Headboards service page |
| `/office-furniture/` | Office Furniture service page |
| `/projects/` | Project index |
| `/projects/[slug]/` | Individual project |
| `/blog/` | Blog index |
| `/blog/[slug]/` | Individual article |
| `/about-us/` | Brand, craftsmanship, and service-area story |
| `/contact/` | Contact details and quotation/contact form |
| `/[slug]/` | Published general CMS page, subject to reserved-route protection |

The malformed source reference `custom- wardrobes` is normalized to `/custom-wardrobes/`. Fixed service URLs are canonical and must not be replaced by generic `/services/[slug]` public URLs. A private or editorial `/services` data concept may exist in Payload, but it must not change these canonical service paths.

Trailing-slash behavior must be consistent across the site. Each index and detail route must provide a real server-rendered response, appropriate metadata, breadcrumb context where applicable, and a useful not-found path when the record does not exist or is unpublished.

## 5. Brand, Visual, and Interaction System

The visual direction is premium modern furniture: warm, tactile, editorial, and restrained rather than ornate or sales-heavy.

### Color and materials

- Warm ivory and soft beige form the primary backgrounds.
- Deep charcoal is the primary text and high-contrast surface color.
- Muted gold is used sparingly for refined emphasis, dividers, icons, or small interactive details; it must not appear as bright yellow.
- Photography should feature warm natural light, premium interiors, and visible fabric, wood, stitching, and upholstery texture.
- Decorative treatments should feel materially grounded and must not overpower service content or calls to action.

### Typography and composition

- Headings use an elegant display serif with a clean, highly readable sans-serif body family.
- Fonts are locally optimized through Next.js font handling.
- Layouts use generous whitespace, strong visual hierarchy, large imagery, and selective asymmetrical editorial compositions.
- Body copy remains concise, informative, and scannable on mobile.
- Buttons have clear primary, secondary, focus, hover, loading, disabled, and success states.

### Motion and interaction

- Motion is limited to subtle reveal, hover, menu, and state transitions.
- Animation must respect reduced-motion preferences and must not delay reading or conversion.
- The mobile WhatsApp action remains persistent but unobtrusive and must not cover form controls, cookie/consent controls, or essential content.
- Navigation, modals, menus, galleries, and forms must be usable by keyboard and assistive technologies.

### Responsive behavior

Every public template must adapt from small mobile screens through large desktop displays without horizontal overflow. Images need deliberate crops and focal points at common breakpoints. Touch targets, type scale, spacing, navigation, forms, galleries, and sticky controls must remain usable at mobile widths.

## 6. Homepage Experience

The homepage must contain the following ordered experience while allowing controlled editorial updates through Payload:

1. **Announcement bar:** concise UAE service coverage statement and quotation action.
2. **Premium header:** brand mark, service navigation, projects, about, contact, and clear conversion actions.
3. **Hero:** aspirational furniture imagery, a focused value proposition, supporting copy, “Request a Free Quotation,” and “Chat on WhatsApp.”
4. **Signature services:** visual cards linking to all key service pages.
5. **Craftsmanship and credibility:** customization, material quality, process discipline, and brand story without unverified claims.
6. **Featured projects:** image-led editorial grid linking to project records.
7. **Process:** Consultation → Design → Production → Installation.
8. **Location coverage:** natural references to Ajman, Sharjah, Dubai, and the wider UAE.
9. **Testimonials:** only verified, editor-approved customer statements.
10. **FAQ:** visible answers suitable for users and, when eligible, matching FAQ structured data.
11. **Final quotation CTA:** focused enquiry invitation with quotation and WhatsApp paths.
12. **Information-rich footer:** services, navigation, contact channels, opening hours, locations, social links, and required legal links.

Homepage blocks may be edited and reordered where the page-builder contract allows, but the published composition must retain clear hierarchy, truthful content, brand consistency, and conversion opportunities at decision points.

## 7. Service, Project, Blog, and General Page Experiences

### Service pages

Each fixed service page is independently editable and SEO-ready. It must support a service-specific hero, overview, benefits, materials or capabilities, process, project examples, relevant locations, FAQs, testimonials, gallery/media, service-specific quotation form, contextual WhatsApp CTA, related services, metadata, canonical URL, and structured data.

Service pages must not be thin duplicates. Each must use original content that accurately describes the service and satisfies the likely intent of customers in the UAE. Location references must read naturally and must not become repeated keyword lists.

### Projects

The project index presents curated work through a premium image-led layout. A project detail record supports a title, slug, summary, gallery, cover image, related service, location, completion information, narrative, optional challenge/solution details, SEO fields, and a contextual enquiry action. Any facts that are not verified must be omitted rather than invented.

### Blog

The blog index supports browsing and category organization. Article pages support author information, publication date, rich content, related services, related posts, featured image, SEO, breadcrumbs, Article structured data, and contextual quotation/WhatsApp actions where relevant. Drafts and scheduled publications must never leak into the public route before their valid publication state.

### About and contact

The About page presents the business, craftsmanship, approach, service coverage, and conversion actions without fabricated age, awards, client counts, or statistics. The Contact page renders CMS-managed phone, WhatsApp, email, address, opening hours, service areas, and a validated contact/quotation form.

### General CMS pages

`Pages` records supply reusable block-based pages at `/[slug]/`. Only published records are publicly resolvable. General pages must use the same controlled design system, metadata contract, accessibility requirements, and collision rules as dedicated routes.

## 8. Payload CMS Content Model

### Users

Authenticated CMS administrators. Public registration is disabled. Access must be least-privilege, passwords must be securely hashed by the supported Payload authentication system, and administrative operations must require an authenticated authorized user.

### Pages

General block-built pages with title, normalized unique slug, publication state, layout blocks, SEO fields, preview support, revisions/drafts, publication timestamps, and ownership/audit timestamps. Validation must enforce the reserved route registry.

### Services

One record per approved service. Fields include title, canonical fixed slug, summary, hero, detailed content, benefits, materials/capabilities, process steps, FAQs, service areas, project relations, testimonial relations, gallery, quotation context, WhatsApp message context, related services, publication state, and full SEO data. Fixed slugs must be restricted to the approved service set unless the route contract is formally changed.

### Projects

Fields include title, unique slug, summary, cover image, gallery, service relation, category relation where used, UAE location, completion details, narrative blocks, featured flag, publication state, dates, and full SEO data.

### Posts

Fields include title, unique slug, excerpt, featured image, author relation, category relations, related service relations, article content, publication state, scheduled/published dates, and full SEO data.

### Categories

Reusable taxonomy for posts and projects. Categories require a unique normalized slug and editor-friendly title; taxonomy must remain intentional and must not generate empty public archives.

### Media

Payload-managed images with file metadata, mandatory meaningful alt text for informative public images, optional empty alt only for explicitly decorative images, caption, focal point, dimensions, MIME type, ownership/source notes, and timestamps. Upload constraints must allow required presentation quality while rejecting unsafe file types and unreasonable file sizes.

### FAQs

Reusable question-and-answer records with optional service relations, grouping/order controls, publication state, and editor-visible schema eligibility guidance. FAQ schema is generated only when the same question and answer are visible on the page.

### Testimonials

Approved customer quotation, customer display name, location, rating where genuinely supplied, related service/project, featured flag, publication state, and consent/verification record. Fabricated testimonials and synthetic ratings are prohibited.

### Leads

Private operational records created by validated quotation/contact submissions or authorized administrators. Public API access must permit creation only through the controlled server-side submission flow and must never expose lead reads, updates, lists, uploads, or attribution data.

Required data includes:

- Name.
- Phone.
- Email when supplied or required by the selected form.
- Emirate/location.
- Required service relation or normalized service context.
- Message.
- Optional reference image subject to upload security policy.
- Explicit consent value and consent timestamp.
- Source page URL/path and page title/context.
- Project/reference context when applicable.
- Referrer.
- UTM source, medium, campaign, term, and content.
- Lead status.
- Submission and update timestamps.
- Server-derived abuse/rate-limit context retained only to the minimum extent necessary for security.

The status workflow is `New → Contacted → Quotation Sent → Won` or `Lost`. New submissions default to `New`. Only authorized staff can advance or change status. Status changes must preserve update timestamps and administrative accountability.

### Redirects

Payload-managed source and destination paths with permanent or temporary status, active state, optional notes, and validation against redirect loops, invalid targets, and protected internal routes. Public redirect resolution must be deterministic and must not allow open redirects.

## 9. Payload Globals

- **Site Settings:** business/brand name, logo and identity assets, default quotation labels, default WhatsApp copy, locale configuration, canonical site URL, announcement settings, and shared presentation options.
- **Header:** navigation tree, service links, conversion actions, and mobile-navigation settings.
- **Footer:** navigation groups, service links, legal links, supporting copy, and footer conversion content.
- **Contact Information:** phone, WhatsApp number, email, physical address, map/location references, opening hours, and service areas.
- **SEO Defaults:** default title pattern, fallback description, default social image, index/follow defaults, and organization/local-business schema defaults.
- **Social Media:** approved network links and labels.

Business details and conversion copy must be editable without code changes. Publishing must validate essential values: a usable WhatsApp number before WhatsApp CTAs are exposed, a valid canonical site URL, and valid contact URLs. Secrets must never be stored in public globals.

## 10. Page Builder and Editorial Controls

The controlled page builder supports these typed blocks:

- Hero.
- Rich Content.
- Media.
- Split Content.
- Service Grid.
- Project Gallery.
- Benefits.
- Process Steps.
- Testimonials.
- FAQs.
- Location Coverage.
- Statistics.
- Call to Action.
- Contact/Quotation Form.

Editors may add, remove, and reorder allowed blocks. Each block has intentional variants, validated required fields, accessible defaults, constrained alignment/color options, preview labels, and frontend rendering owned by the application. Editors must not be given arbitrary HTML, arbitrary color values, or layout controls that can break the brand system or accessibility.

Statistics may be published only when the business can substantiate them. Rich content must be sanitized and rendered through supported Payload rich-text tooling. Drafts, revisions, live preview, scheduled publishing where supported, and on-demand revalidation must preserve the separation between unpublished and public content.

## 11. Conversion and Lead Workflow

The primary site action is **Request a Free Quotation**. The secondary action is **Chat on WhatsApp**. They must appear at useful decision points without making the brand resemble a discount marketplace.

Quotation/contact forms collect the relevant subset of name, phone, email, emirate/location, required service, message, optional reference image, and consent. Service forms preselect or embed the current service context without trusting a user-editable hidden value as authoritative. Project forms include project/reference context where relevant.

A successful submission must:

1. Pass server-side schema validation.
2. Pass honeypot, rate-limit, size, and upload checks.
3. Create exactly one private Payload Lead with source and attribution data.
4. Return a minimal public response that discloses no internal record, validation implementation, stack trace, or sensitive details.
5. Present an accessible thank-you state and an optional next-step WhatsApp action.
6. Prevent accidental duplicate submissions caused by repeated button presses while still allowing a genuine later enquiry.

WhatsApp URLs must be generated from the CMS-managed number and a safely encoded contextual message. The message includes the service name, current page, and project/reference context where available. Invalid or missing numbers must fail safe by withholding the broken CTA, not by producing a malformed external link. Mobile phone links use normalized `tel:` values.

No fake urgency, invented availability, false statistics, fabricated reviews, or unsupported guarantees may be used to increase conversion.

## 12. SEO and Discoverability

Every Service, Project, Post, and Page supports editable:

- SEO title.
- Meta description.
- Canonical URL.
- Open Graph title, description, and image.
- Index/follow controls.
- Structured-data fields appropriate to its content type.
- An editor-visible social sharing preview.

The application generates or renders:

- `/sitemap.xml` containing canonical, indexable, published public URLs only.
- `/robots.txt` with environment-appropriate directives and no exposure of secrets.
- Canonical link tags.
- Open Graph and Twitter metadata.
- Breadcrumb navigation and matching `BreadcrumbList` data where applicable.
- A branded, useful 404 page with a real HTTP 404 status.
- Payload-managed redirects with correct temporary/permanent HTTP statuses.

Supported structured data is:

- `Organization`.
- `LocalBusiness`.
- `Service` on qualifying service pages.
- `BreadcrumbList` where visible breadcrumbs exist.
- `Article` on published blog articles.
- `FAQPage` only where all marked-up FAQs are visibly rendered and eligible.

Structured-data values must come from published content and validated globals; schema must not claim facts absent from the page or business records. Ajman, Sharjah, Dubai, and UAE coverage should be included naturally where relevant and never through keyword stuffing, hidden text, or doorway pages.

Draft, unpublished, admin, API, and private application routes must not enter the sitemap or public metadata graph. Search and redirect features inherited from the template may be retained only after they are branded, access-controlled, and validated against this route and SEO contract.

## 13. Collision-Safe Routing and Publication Rules

Dedicated application routes always take precedence over dynamic `Pages` routes. A single centralized reserved-route registry must be consumed by CMS validation, route helpers, and automated tests.

The protected set includes:

- `admin` and every `/admin` descendant.
- `api` and every `/api` descendant.
- `services` and every protected service prefix.
- Every fixed service slug listed in Section 4.
- `projects` and every `/projects` descendant.
- `blog` and every `/blog` descendant.
- `about-us`.
- `contact`.
- `sitemap.xml`.
- `robots.txt`.
- Next.js/framework, static-asset, media-delivery, health-check, and other application-owned route prefixes.

`Pages.slug` values are stored in normalized form without leading or trailing slashes. Validation must reject empty slugs, reserved exact names, protected prefixes, unsafe path characters, duplicate normalized slugs, and collisions caused by case or normalization differences. Database/CMS uniqueness must backstop application validation.

The `/[slug]` resolver queries only published Pages. An unknown, draft, scheduled-for-future, or unpublished slug produces a real HTTP 404. It must never fall through to an unrelated record or shadow a dedicated route. Automated tests must cover every registered exact route and prefix, case/normalization variants, duplicate slugs, published resolution, and unpublished/unknown 404 behavior.

## 14. Localization and Arabic/RTL Readiness

English is the only launch locale, but implementation must avoid structural rework when Arabic is introduced.

Required readiness includes:

- Locale-capable Payload fields and a documented strategy for enabling localized values.
- No English-only assumptions embedded in component APIs or data relationships.
- HTML language and direction derived from the active locale when localization is enabled.
- CSS logical properties for margins, padding, borders, positioning, and alignment wherever direction matters.
- Direction-aware icons, breadcrumbs, carousels, menus, and motion.
- Typography tokens that can select an Arabic-capable family and suitable Arabic line height.
- Flexible layouts that tolerate longer copy and mixed-script values.
- URL and canonical strategy that can add locale-aware routes without colliding with existing reserved prefixes.

Arabic content must not be machine-generated or published as part of the English launch. RTL readiness is verified through a development/test direction switch and representative Arabic fixture text, not through a public incomplete locale.

## 15. Accessibility and Content Integrity

The public site targets WCAG 2.2 AA practices. At minimum:

- Semantic landmarks and a logical heading hierarchy.
- Keyboard-operable navigation, galleries, dialogs, and forms.
- Visible focus indicators with sufficient contrast.
- Text and interactive-control contrast that meets AA thresholds.
- Accessible names, instructions, field errors, and status announcements.
- Correct labels and autocomplete tokens for form inputs.
- Meaningful alt text for informative imagery and empty alt for intentionally decorative imagery.
- Reduced-motion support.
- No content, action, or validation communicated by color alone.
- Touch targets suitable for mobile use.

Published statements must be truthful and supportable. Template claims, invented customer details, fabricated reviews, unverified statistics, misleading urgency, and unlicensed media are prohibited. Royalty-free launch imagery must have a recorded source and license basis. Content editors must be able to replace media and copy without code changes.

## 16. Performance, Caching, and Revalidation

Performance design requirements are:

- Server Components by default.
- Client JavaScript limited to genuinely interactive behavior.
- `next/image` with explicit dimensions, responsive `sizes`, focal-point-aware crops, and WebP/AVIF delivery where supported.
- Locally optimized fonts and a deliberate subset/weight strategy.
- Lazy loading for below-fold media.
- Stable layout dimensions to prevent cumulative layout shift.
- Lean animation and third-party scripts.
- Production compression and immutable caching for fingerprinted static assets.
- ISR or cached server rendering where appropriate, with on-demand revalidation triggered by Payload publication/update hooks.
- Cache invalidation that updates affected pages, indexes, sitemap data, and related content without exposing drafts.

Core pages must be checked at representative mobile and desktop widths for responsive correctness and Core Web Vitals regressions. Performance optimization must not weaken authentication, preview correctness, lead integrity, or fresh publication behavior.

## 17. Security and Privacy

Security controls include:

- Payload Admin and private collection operations require authenticated, authorized users.
- Public registration is disabled.
- Leads are never publicly readable, listable, searchable, updateable, or deletable.
- All form payloads are validated and normalized server-side; client validation is usability support only.
- Honeypot and server-side rate limiting protect public forms.
- Reference uploads use an allowlist of required image MIME types/extensions, verified file signatures where practical, randomized storage names, strict size limits, and no executable content.
- Rich content is sanitized through supported rendering paths.
- Redirects cannot create open redirects or loops.
- Secrets exist only in protected environment/deployment storage and are never committed, returned to clients, logged, or stored in public CMS fields.
- PostgreSQL is bound locally and uses a dedicated application role with only the privileges required for the application schema and migrations.
- The Node service binds to `127.0.0.1`, not a public interface.
- Nginx disables directory listing and denies access to environment files, repository metadata, backup files, source maps where inappropriate, and other sensitive artifacts.
- Payload internals not intended for public use remain inaccessible.
- HTTP permanently redirects to HTTPS; `www` permanently redirects to canonical non-`www` without redirect loops or path/query loss.
- Existing certificate paths are preserved during Nginx cutover.
- TLS 1.0 and TLS 1.1 are disabled.
- Production errors reveal no stack traces, filesystem paths, SQL details, credentials, or internal IDs.

Consent and attribution data must be retained only for legitimate enquiry handling, analytics, and security purposes. Logs and backups containing personal data must receive the same access protection as the production database.

## 18. Deployment, Backup, Recovery, and Rollback

### Staging and cutover

The new application is built in `/www/wwwroot/alruknfurniture-next`, separate from the live WordPress root. The current WordPress site remains served until the new application passes all pre-cutover gates.

The inspected WordPress installation is effectively empty: it contains the default “Hello World” post, “Sample Page,” a draft Privacy Policy, no uploaded media, and default themes/plugins. Despite this, a timestamped backup of its files and database is mandatory before removal or replacement.

The production deployment uses a Git-managed application in `/www/wwwroot/alruknfurniture.ae`, a standalone Next.js build, a private localhost Node port, PM2, and Nginx. Cutover must be atomic at the Nginx/upstream or release-path level rather than an unverified in-place replacement. Nginx configuration is backed up before change and tested before reload.

### Automated backup scope

Automated, access-restricted backups cover:

- PostgreSQL database `alrukn_furniture`.
- Payload media/uploads.
- Protected copies of `.env` and deployment configuration.
- Nginx and PM2 configuration.
- The final WordPress files/database snapshot retained for the defined rollback window.

Backup artifacts live below an access-restricted `/www/backup/alruknfurniture/` hierarchy and are never web-served. Database and media/configuration backups run daily, retain 14 daily copies, 8 weekly copies, and 6 monthly copies, and emit a non-zero exit plus an operator-visible alert on failure. The final WordPress snapshot is retained for at least 30 days after successful cutover and is not removed until the first new-system restore test and stabilization review pass. Backup files containing secrets or personal data are owner-readable only and encrypted before any off-server transfer. A restore procedure must be documented and tested against a non-public recovery target without exposing secrets.

### Rollback

Before cutover, rollback means leaving WordPress unchanged. After cutover, rollback must restore the prior Nginx configuration/upstream and WordPress file/database state, or switch back to the retained prior release, without requiring reconstruction from memory. The trigger for rollback includes failed health checks, broken admin authentication, inability to submit leads, severe route/SEO failures, database connectivity failures, or unsafe public exposure.

The rollback procedure must identify release artifacts, configuration backups, database/media restore steps, PM2 actions, Nginx validation/reload, and post-rollback verification. The WordPress backup is not deleted until the new production deployment has completed its agreed stabilization and backup verification period.

## 19. Verification and Release Gates

No production traffic may be switched from WordPress until all applicable gates pass with recorded evidence:

1. TypeScript strict type check.
2. ESLint with no unresolved release-blocking findings.
3. Unit and integration test suites.
4. Payload migration application against a clean/test database and upgrade path against the staged database.
5. Production `pnpm build` completing successfully with standalone output.
6. PM2 process starts from the production artifact, remains healthy, and has restart-on-boot configuration.
7. Nginx configuration syntax test.
8. Local reverse-proxy health check through Nginx before public cutover.
9. Responsive checks on representative mobile, tablet, and desktop viewports.
10. Payload Admin authentication, authorization, preview, and CRUD for every required collection/global.
11. Media upload, unsafe-upload rejection, focal point, and alt-text behavior.
12. Lead creation, duplicate-submit protection, attribution, privacy, and the complete status workflow.
13. WhatsApp message context, URL encoding, CMS-managed number, sticky mobile action, and phone links.
14. Every fixed service route, projects, project detail, blog, post detail, about, contact, homepage, and valid dynamic Page.
15. Every reserved-slug collision rule plus duplicate, normalization, unknown, draft, scheduled, and unpublished cases.
16. SEO titles, descriptions, canonicals, Open Graph/Twitter data, social images, breadcrumbs, sitemap, robots, redirects, and eligible structured data.
17. Real 404 status and branded 404 experience.
18. Accessibility checks for keyboard navigation, focus, landmarks, headings, forms, alt text, contrast, and reduced motion.
19. Performance and Core Web Vitals regression review on core page templates.
20. HTTP-to-HTTPS and `www`-to-non-`www` redirect chains with path and query preservation.
21. Active certificate paths and rejection of TLS 1.0/1.1.
22. PostgreSQL local binding, dedicated-role permissions, and external-access denial.
23. Denial of sensitive files, backups, repository metadata, directory listing, private Leads, and protected Payload operations.
24. Automated backup execution and a non-public restore test for database, media, and configuration.
25. Rollback rehearsal or dry run that proves the previous site/upstream can be restored.
26. Reboot-persistence configuration for PM2, Nginx, PostgreSQL, and required backup scheduling.

A failed gate blocks cutover until corrected and re-tested. Successful plan completion without runtime evidence does not count as release approval.

## 20. Acceptance Criteria and Delivery Record

The design is accepted as implemented only when all of the following are true:

- The application uses the official Payload Website Template foundation and contains no public template demo identity, records, imagery, or copy.
- Next.js 16 App Router, Payload in the same application, TypeScript, Tailwind CSS, and local PostgreSQL are demonstrably in use.
- The public visual system is responsive, premium, clean, and recognizably based on warm ivory/beige, deep charcoal, and restrained muted gold.
- All routes in Section 4 resolve correctly, and every fixed service has original, individually editable, individually SEO-ready content.
- `Pages`, `Services`, `Projects`, `Posts`, `Categories`, `Media`, `FAQs`, `Testimonials`, `Leads`, `Redirects`, and `Users` function with the defined access, field, publication, and validation behavior.
- `Site Settings`, `Header`, `Footer`, `Contact Information`, `SEO Defaults`, and `Social Media` globals are editable and drive the public site.
- Page-builder blocks are editable and reorderable without permitting arbitrary styling that breaks brand or accessibility controls.
- Quotation submissions create exactly one private, correctly attributed Lead and support `New`, `Contacted`, `Quotation Sent`, `Won`, and `Lost` states.
- WhatsApp and phone actions use validated CMS-managed contact information and contextual, safely encoded messages.
- No fake urgency, fabricated testimonials, invented statistics, unsupported claims, unlicensed imagery, or residual template content is published.
- SEO metadata, canonical handling, sitemap, robots, breadcrumbs, redirects, social metadata, structured data, and true 404 behavior satisfy Sections 12 and 19.
- Dynamic `Pages` can neither claim nor shadow any dedicated, framework, admin, API, asset, health, sitemap, robots, service, project, blog, about, or contact route.
- The English launch renders correctly, and a non-public test verifies direction-aware RTL layout behavior and locale-capable content architecture.
- The application passes the accessibility, performance, security, privacy, upload, and content-integrity requirements.
- PostgreSQL and Node are local-only, secrets remain protected, TLS redirects are correct, sensitive resources are denied, and PM2/Nginx operate as specified.
- A timestamped WordPress files/database backup exists before replacement, the new application is built and tested before cutover, automated new-system backups are operating, restore is tested, and rollback remains available.
- Every gate in Section 19 has recorded pass evidence before production traffic is switched.

The final delivery record must state:

- Installed software versions.
- Exact template source and MIT license reference.
- Application path, deployed release identifier, and Git status/commit.
- Internal Node port and PM2 process name.
- PostgreSQL database name and confirmation of local-only access, without disclosing credentials.
- Payload Admin and production URLs.
- Active Nginx configuration location and canonical redirect behavior.
- SSL certificate paths/status and supported protocol verification.
- Backup locations, schedule, retention, last successful run, and restore-test result, without exposing secrets.
- Rollback artifact/location and validated rollback procedure.
- Results and evidence references for every release gate.
- Any business-supplied content or contact details still awaiting replacement, clearly distinguished from complete technical functionality.

This specification is the approved source of truth for implementation. Any change to routes, data ownership, public lead access, deployment topology, canonical-host behavior, or the safety-first cutover sequence requires explicit review before implementation.