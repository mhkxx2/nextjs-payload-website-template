import { expect, test } from '@playwright/test'

// Resolve against Playwright's configured isolated server.
const BASE = ''
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

const SERVICE_H1: Record<(typeof SERVICE_SLUGS)[number], string> = {
  'sofa-upholstery': 'Sofa Upholstery in Dubai',
  'custom-furniture': 'Custom Made Furniture in Dubai & UAE',
  'custom-sofa': 'Custom Sofas Made to Measure in Dubai',
  'majlis-furniture': 'Custom Arabic Majlis Furniture in Dubai',
  'curtains-blinds': 'Custom Curtains & Blinds in Dubai',
  'sofa-repair': 'Sofa Repair & Furniture Restoration in Dubai',
  'custom-wardrobes': 'Custom Wardrobes in Dubai',
  'custom-beds-headboards': 'Custom Beds & Upholstered Headboards in Dubai',
  'office-furniture': 'Custom Office Furniture in Dubai',
}

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
  test('sofa landing publishes the approved SEO, heading hierarchy and visible FAQ schema', async ({ page }) => {
    await page.goto('/sofa-upholstery/')
    const title = 'Sofa Upholstery Dubai | Reupholstery & Sofa Repair | Al Rukn'
    const description = 'Professional sofa upholstery in Dubai for fabric replacement, foam renewal, corner sofas, chairs and Majlis seating. Serving Dubai from our Ajman workshop. Send photos for a quote.'
    await expect(page).toHaveTitle(title)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description)
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title)
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title)
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description)
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description)
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://alruknfurniture.ae/sofa-upholstery/')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText('Sofa Upholstery in Dubai')
    const headings = await page.locator('.sofa-page h2').allTextContents()
    const expected = ['Popular Sofa Upholstery Services', 'Sofa Upholstery Gallery', 'Choose the Right Upholstery Fabric', 'Restore Comfort, Not Just the Fabric', 'Sofa Repair vs Reupholstery', 'Our sofa upholstery process', 'Why Choose Al Rukn', 'What Our Customers Say', 'Related Furniture Services', 'Sofa Upholstery Across Dubai, Sharjah & UAE', 'Sofa Upholstery FAQs', 'Get a Sofa Upholstery Quote']
    let previous = -1
    for (const heading of expected) {
      expect(headings.indexOf(heading)).toBeGreaterThan(previous)
      previous = headings.indexOf(heading)
    }
    const levels = await page.locator('.sofa-page :is(h1,h2,h3,h4,h5,h6)').evaluateAll((items) => items.map((item) => Number(item.tagName.slice(1))))
    for (let index = 1; index < levels.length; index += 1) expect(levels[index]! - levels[index - 1]!).toBeLessThanOrEqual(1)
    const schemas = await structuredData(page)
    expect(schemas.map((schema) => schema['@type']).sort()).toEqual(['BreadcrumbList', 'FAQPage', 'Service'])
    const faqs = page.locator('.service-faq-list details')
    await expect(faqs).toHaveCount(13)
    const visible = await faqs.evaluateAll((items) => items.map((item) => ({ '@type': 'Question', name: item.querySelector('summary')!.textContent, acceptedAnswer: { '@type': 'Answer', text: item.querySelector('p')!.textContent } })))
    expect(schemas.find((schema) => schema['@type'] === 'FAQPage')?.mainEntity).toEqual(visible)
    expect(JSON.stringify(schemas)).not.toMatch(/"(?:Review|AggregateRating|Product|Offer)"|"(?:price|aggregateRating|ratingValue|review)":/i)
  })
  test('every public route publishes canonical, open graph, twitter and robots metadata', async ({
    page,
  }) => {
    for (const route of [...STRUCTURAL_ROUTES, ...SERVICE_SLUGS.map((slug) => `/${slug}/`)]) {
      const response = await page.goto(`${BASE}${route}`)

      expect(response?.status(), route).toBe(200)

      const canonical = page.locator('link[rel="canonical"]')

      await expect(canonical, route).toHaveCount(1)

      const href = await canonical.getAttribute('href')

      expect(href, route).toBe(route === '/' ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${route}`)

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
            'WebSite',
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

    expect(contactSchemas.map((schema) => schema['@type'])).toContain('LocalBusiness')
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

  test('all nine service pages have distinct conversion and SEO contracts', async ({ page }) => {
    test.setTimeout(240_000)

    const titles = new Set<string>()
    const descriptions = new Set<string>()

    for (const slug of SERVICE_SLUGS) {
      const route = `/${slug}/`
      const response = await page.goto(`${BASE}${route}`)
      expect(response?.status(), route).toBe(200)

      await expect(page.locator('h1'), route).toHaveCount(1)
      await expect(page.getByRole('heading', { level: 1 }), route).toHaveText(SERVICE_H1[slug])
      await expect(page.locator('link[rel="canonical"]'), route).toHaveAttribute(
        'href',
        `${CANONICAL_ORIGIN}${route}`,
      )

      titles.add(await page.title())
      descriptions.add(
        (await page.locator('meta[name="description"]').getAttribute('content')) || '',
      )

      const schemas = await structuredData(page)
      expect(schemas.some((schema) => schema['@type'] === 'Service'), route).toBe(true)
      expect(schemas.some((schema) => schema['@type'] === 'BreadcrumbList'), route).toBe(true)
      expect(schemas.some((schema) => schema['@type'] === 'FAQPage'), route).toBe(true)

      await expect(page.locator('select[name="service"]'), route).toHaveValue(slug)
      await expect(page.locator('input[name="photo"]'), route).toHaveAttribute('type', 'file')
      expect(await page.locator('.service-related-grid a, .sofa-related-grid a').count(), route).toBeGreaterThanOrEqual(2)
      expect(await page.locator('.service-area-chips span').count(), route).toBeGreaterThan(0)
      await expect(page.locator('.service-areas-section a[href="/#areas-we-serve"]'), route).toHaveCount(1)

      const images = page.locator('.service-page img')
      const imageCount = await images.count()
      expect(imageCount, route).toBeGreaterThanOrEqual(3)
      for (let index = 0; index < imageCount; index += 1) {
        const image = images.nth(index)
        await image.scrollIntoViewIfNeeded()
        await expect
          .poll(
            () =>
              image.evaluate(
                (element) =>
                  (element as HTMLImageElement).complete &&
                  (element as HTMLImageElement).naturalWidth > 0,
              ),
            { message: `${route} image ${index + 1}`, timeout: 15_000 },
          )
          .toBe(true)
        const dimensions = await image.evaluate((element) => ({
          height: (element as HTMLImageElement).naturalHeight,
          src: (element as HTMLImageElement).currentSrc,
          width: (element as HTMLImageElement).naturalWidth,
        }))
        expect(dimensions.src, route).not.toBe('')
        expect(dimensions.width, `${route} ${dimensions.src}`).toBeGreaterThan(0)
        expect(dimensions.height, `${route} ${dimensions.src}`).toBeGreaterThan(0)
      }

      const body = await page.locator('body').innerText()
      expect(body, route).not.toMatch(/customer testimonial|five[- ]star|rated 5|★★★★★/i)
      expect(body, route).toContain('Ajman workshop')
    }

    expect(titles.size).toBe(SERVICE_SLUGS.length)
    expect(descriptions.size).toBe(SERVICE_SLUGS.length)
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
