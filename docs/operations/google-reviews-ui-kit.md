# Google Reviews Places UI Kit operations

## Browser key and Google Cloud setup

`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is a browser-visible Google Maps credential. Keep the example value empty and supply the actual value through the deployment environment. Never put an API key in Payload, a Place ID field, source code, screenshots, logs, or this document. The key will be visible in browser requests, so Cloud restrictions are required.

1. Select the application's Google Cloud project with billing enabled.
2. Enable **Maps JavaScript API** and **Places UI Kit API** in that project. The widget loads the JavaScript `places` library; a library name is not an additional Cloud API. The current UI Kit setup does not require enabling the legacy Places API or a separate Places API (New) for this widget. If another application needs those services, use its own restricted key. Follow Google's [Places UI Kit setup guide](https://developers.google.com/maps/documentation/javascript/places-ui-kit/get-started).
3. Create a dedicated browser key. Under application restrictions select **Websites (HTTP referrers)** and add both:
   - `https://alruknfurniture.ae/*`
   - `https://www.alruknfurniture.ae/*`
4. Under API restrictions select **Restrict key**, allowing only Maps JavaScript API and Places UI Kit API. Save and allow restrictions to propagate. Use a separate key for local or preview origins. See Google's [API security best practices](https://developers.google.com/maps/api-security-best-practices).
5. Supply `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to the production build and runtime environment. Next.js inlines public environment variables at build time: after changing this key, rebuild and deploy the approved artifact; restarting alone does not update a previously built value.
6. Run `pnpm env:check` against the intended production environment. A missing or blank key fails with `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is required`; successful output reports `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=valid (value redacted)`. This checks presence only, not billing, restrictions, Google authorization, or Place ID validity. Do not print the environment or copy credential-bearing request URLs during diagnostics.

## Payload Place ID workflow

Sign in to Payload and open **Site configuration → Google Reviews** (`google-reviews`). Obtain the Al Rukn business's Place ID using Google's [Place ID guidance](https://developers.google.com/maps/documentation/places/web-service/place-id), verify the selected business, and enter it in `placeId`. The Place ID is editable CMS configuration and has no source-code or environment default. Never enter the browser key here.

Set the heading and optional subheading, confirm the HTTPS Maps and write-review URLs, and choose `reviewLimit` from 3 to 5. This controls the visible review viewport; Google chooses the supplied reviews and their count. Set `enabled` and save. The existing global revalidation refreshes these first-party settings across sections that consume the global. Check the page near the reviews viewport and both external review links on the approved deployment.

## Fallback and troubleshooting

When disabled, when the Place ID is empty, or when the key is absent, the section renders links only. Loading, script errors, UI Kit errors, and timeouts retain **View Reviews on Google** and **Write a Review** links. The missing-key fallback protects rendering, but the production environment gate still requires a key. To disable the widget operationally while keeping that gate satisfied, uncheck `enabled` in Payload.

If the widget is unavailable, confirm the Place ID, billing, API enablement, key restrictions, and page origin. Test both allowed hosts; the `www` host may redirect to the canonical host. Verify that the browser sends an origin referrer compatible with the restrictions. Inspect error codes without sharing full request URLs or credentials. The widget loads lazily near the viewport, so absence of an initial Maps request is expected. Keep fallback links available while resolving configuration.

## Review data and attribution

Cache only first-party Payload settings under `global:google-reviews`. **Do not cache, copy, scrape, persist, or log Google review data**, including review text, ratings, reviewer names, photos, and response bodies, in Payload, the database, Next.js caches, local storage, service workers, or application logs. Render that content through Google's official component and preserve its Google and reviewer attribution. Do not create Review or AggregateRating schema from it or send reviewer data to analytics.
