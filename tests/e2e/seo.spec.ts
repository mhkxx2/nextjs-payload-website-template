import { expect, test } from '@playwright/test'

const BASE = 'http://localhost:3000'
const CANONICAL_ORIGIN = 'https://alruknfurniture.ae'

/** Order and spelling must match the fixed service routes exactly. */
const SERVICE_SLUGS = [
  'sofa-upholstery',
  'custom-furniture',
  'custom-sofa',
  'majlis-furniture',
  'curtains-blinds',
  'sofa-repair',
  'custom-wardrobes',
  'custom-beds-headboards',
  'office-furniture',
] as const

const STRUCTURAL_ROUTES = ['/', '/services/', '/projects/', '/blog/', '/about-us/', '/contact/'] as const

type JsonLd = Record<string, unknown>

const structuredData = async (page: import('@playwright/test').Page): Promise<JsonLd[]> => {
  const blocks = await page.locator('script[type="application/ld+json"]').allInnerTexts()

  return blocks.flatMap((block) => {
    const parsed: unknown = JSON.parse(block)

    return Array.isArray(parsed) ? (parsed as JsonLd[]) : [parsed as JsonLd]
  })
}

test.describe('Task 16 metadata contract', () => {
  test('every public route publishes canonical, open graph, twitter and robots metadata', async ({
    page,
  }) => {
    for (const route of [...STRUCTURAL_ROUTES, ...SERVICE_SLUGS.map((slug) => `/${slug}/`)]) {
      const response = await page.goto(`${BASE}${route}`)

      expect(response?.status(), route).toBe(200)

      const canonical = page.locator('link[rel="canonical"]')

      await expect(canonical, route).toHaveCount(1)

      const href = await canonical.getAttribute('href')

      expect(href, route).toMatch(new RegExp(`^${CANONICAL_ORIGIN}/`))

      const title = await page.title()

      expect(title.length, route).toBeGreaterThan(0)
      expect(await page.locator('meta[property="og:title"]').getAttribute('content'), route).toBe(
        title,
      )
      expect(await page.locator('meta[property="og:url"]').getAttribute('content'), route).toBe(href)
      expect(await page.locator('meta[property="og:image"]').count(), route).toBe(1)
      expect(await page.locator('meta[name="twitter:card"]').getAttribute('content'), route).toBe(
        'summary_large_image',
      )

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')

      expect((description ?? '').length, route).toBeGreaterThan(0)

      const robots = await page.locator('meta[name="robots"]').getAttribute('content')

      expect(robots ?? '', route).toContain('index')
      expect(robots ?? '', route).toContain('follow')
    }
  })

  test('structured data parses and claims nothing beyond the visible page', async ({ page }) => {
    for (const route of ['/', '/contact/', '/custom-sofa/', '/blog/']) {
      await page.goto(`${BASE}${route}`)

      const schemas = await structuredData(page)

      expect(schemas.length, route).toBeGreaterThan(0)

      for (const schema of schemas) {
        expect(schema['@context'], route).toBe('https://schema.org')
        expect(
          [
            'Organization',
            'LocalBusiness',
            'FurnitureStore',
            'Service',
            'Article',
            'FAQPage',
            'BreadcrumbList',
          ],
          route,
        ).toContain(schema['@type'])
      }

      // No rating, review or price claims exist anywhere on the site.
      const serialised = JSON.stringify(schemas)

      expect(serialised, route).not.toMatch(/aggregateRating|"review"|ratingValue|priceValidUntil/i)
      expect(serialised, route).not.toContain('</script')
      expect(schemas.some((schema) => schema['@type'] === 'Organization'), route).toBe(true)
    }

    await page.goto(`${BASE}/contact/`)

    const contactSchemas = await structuredData(page)

    expect(contactSchemas.map((schema) => schema['@type'])).toContain('FurnitureStore')
  })

  test('breadcrumb markup matches the visible breadcrumb trail', async ({ page }) => {
    await page.goto(`${BASE}/custom-sofa/`)

    const visible = (await page.locator('nav[aria-label="Breadcrumbs"] a, nav[aria-label="Breadcrumbs"] span').allInnerTexts())
      .map((label) => label.trim())
      .filter((label) => label.length > 0)

    const list = (await structuredData(page)).find((schema) => schema['@type'] === 'BreadcrumbList')

    expect(list, 'BreadcrumbList must be present').toBeTruthy()

    const names = (list?.itemListElement as { name: string }[]).map((item) => item.name)

    expect(names).toEqual(visible)
    expect(names[0]).toBe('Home')
  })
})

test.describe('Task 16 discovery surfaces', () => {
  test('the sitemap lists canonical published URLs only', async ({ request }) => {
    const response = await request.get(`${BASE}/sitemap.xml`)

    expect(response.status()).toBe(200)

    const body = await response.text()

    expect(body).toContain('<urlset')
    expect(body).toContain(`<loc>${CANONICAL_ORIGIN}/</loc>`)

    for (const slug of SERVICE_SLUGS) {
      expect(body, slug).toContain(`<loc>${CANONICAL_ORIGIN}/${slug}/</loc>`)
    }

    for (const forbidden of [
      '/admin',
      '/api/',
      '/search/',
      '/next/',
      '/services/sofa-upholstery/',
      '/home/',
    ]) {
      expect(body, forbidden).not.toContain(forbidden)
    }

    const locations = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? '')

    expect(locations.length).toBeGreaterThanOrEqual(16)
    expect(new Set(locations).size).toBe(locations.length)
    for (const location of locations) {
      expect(location).toMatch(new RegExp(`^${CANONICAL_ORIGIN}/`))
      expect(location).not.toMatch(/[?#]/)
    }
  })

  test('robots is production-sensitive', async ({ request }) => {
    const response = await request.get(`${BASE}/robots.txt`)

    expect(response.status()).toBe(200)

    const body = await response.text()

    // Field names in robots.txt are case insensitive; Next.js writes `User-Agent`.
    expect(body).toMatch(/User-Agent: \*/i)

    if (body.includes('Disallow: /') && !body.includes('Allow: /')) {
      // Working outside production (or away from the production origin): the only
      // safe answer is to keep crawlers out entirely.
      expect(body).not.toContain('Allow: /')
      expect(body).not.toContain('Sitemap:')
    } else {
      expect(body).toContain('Allow: /')

      for (const privatePath of ['/admin/', '/api/', '/next/', '/search/', '/graphql/']) {
        expect(body, privatePath).toContain(privatePath)
      }

      expect(body).toContain(`Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`)
      expect(body).not.toContain('Disallow: /services/')
    }
  })

  test('unknown routes answer 404 with useful, crawlable content', async ({ page, request }) => {
    const response = await page.goto(`${BASE}/this-page-does-not-exist-${Date.now().toString(36)}/`)

    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('404')
    expect(await page.getByText(/could not be found/i).count()).toBeGreaterThan(0)
    expect(await page.getByRole('link', { name: /services/i }).count()).toBeGreaterThan(0)

    const response404 = await request.get(`${BASE}/blog/not-a-post-${Date.now().toString(36)}/`)

    expect(response404.status()).toBe(404)
  })

  test('redirects keep their status and never take over an application route', async ({ request }) => {
    for (const route of ['/services/', '/contact/', '/custom-sofa/', '/blog/']) {
      const response = await request.get(`${BASE}${route}`, { maxRedirects: 0 })

      expect(response.status(), route).toBe(200)
    }

    const legacy = await request.get(`${BASE}/legacy-${Date.now().toString(36)}/`, {
      maxRedirects: 0,
    })

    if (legacy.status() === 301 || legacy.status() === 302) {
      const location = legacy.headers()['location'] ?? ''

      expect(location).toMatch(new RegExp(`^${CANONICAL_ORIGIN}/`))
    } else {
      expect(legacy.status()).toBe(404)
    }
  })
})
