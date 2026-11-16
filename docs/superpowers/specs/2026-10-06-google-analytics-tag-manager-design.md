# Google Analytics 4 and Google Tag Manager Design

## Goal

Install one direct GA4 base tag and one GTM container globally, then publish privacy-safe WhatsApp, telephone, and confirmed-lead events to a shared `window.dataLayer` without changing the site's content or presentation.

## Constraints

- GA4 measurement ID: `G-G3SBEVF77F`.
- GTM container ID: `GTM-TDBXB2JP`.
- Do not configure GA4 inside GTM in application code.
- Do not call `gtag('event', ...)` for conversion events.
- Do not add Google Ads conversion IDs.
- Do not emit customer names, contact details, messages, uploads, or other PII.
- Do not change Payload content, SEO copy, design, navigation, PM2, Nginx, or ERP behavior.
- Analytics scripts execute only in production builds. Public environment variables can override the supplied IDs.

## Installation

The frontend root layout owns all third-party script installation. GTM uses a `beforeInteractive` `next/script` block so Next.js injects it into the document head. The direct GA loader and initialization use `afterInteractive` scripts. The GTM noscript iframe is the first child after the opening body tag. Each script and iframe has one stable ID and appears once per document.

GA4 retains automatic page measurement. No application code emits manual `page_view` events. App Router navigation measurement therefore depends on GA4 Enhanced Measurement with browser-history page changes enabled, avoiding duplicate initial or navigation page views.

## Event architecture

`src/lib/analytics.ts` defines the three exact event names and their allowed contextual parameters:

- `whatsapp_click`
- `phone_call_click`
- `generate_lead`

The helper reads `page_path` and `page_title` in the browser, strips empty values, allows only the documented parameter keys, and safely returns when `window` is unavailable. It never invokes `gtag`.

A reusable client-side tracked contact link wraps genuine WhatsApp and telephone anchors. Server components provide semantic context such as CTA location, service slug, portfolio item, project, or category. The wrapper adds the destination as `link_url` and does not prevent navigation.

## Lead flow

Lead forms call the helper only after the server response has returned with `response.ok === true`:

- Homepage quote: `lead_type: service_quote`, `cta_location: homepage_quote`.
- Service quote: `lead_type: service_quote`, service slug, `cta_location: service_quote`.
- Contact form: `lead_type: contact`, `cta_location: contact_quote`.
- Portfolio request: `lead_type: portfolio_request`, portfolio item, category, service, `cta_location: portfolio`.
- Generic Payload form: `lead_type: form_submission`, `cta_location: payload_form`.

Validation errors, non-2xx responses, malformed responses, and network failures do not emit `generate_lead`. Allowed form context is captured before reset. Customer fields and uploaded-file data are never passed to analytics.

## Coverage

WhatsApp tracking covers the desktop header, mobile navigation, floating action, mobile sticky bar, footer, homepage hero, homepage final CTA, nine service heroes, portfolio lightbox, and contact page. Telephone tracking covers the desktop header, mobile navigation, mobile sticky bar, footer, and contact page. Existing global controls provide tracking on project routes; no project UI is added.

## Consent readiness

The site currently has no analytics-consent implementation. All custom event delivery goes through one helper and all installation goes through one root component, leaving a single future gate for Consent Mode or a cookie-consent decision without rewriting individual CTAs.

## Verification

Automated tests cover single installation, exact IDs, production-only rendering, safe pre-GTM behavior, allowlisting/PII stripping, contact events, success-only lead events, and representative route interactions. Final verification runs lint, TypeScript, unit, integration, E2E, and production build gates. Rendered HTML is inspected for one GA loader, one GA configuration, one GTM loader, and one GTM noscript iframe.
