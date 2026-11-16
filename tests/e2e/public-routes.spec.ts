import { test, expect } from '@playwright/test'

/**
 * Public route contract (Task 12, plan Step 1/Step 5).
 *
 * Two classes of route are asserted here:
 *
 * 1. Structural routes (`/`, `/services/`, `/projects/`, `/blog/`, `/about-us/`,
 *    `/contact/`) always answer 200 — they render from navigation, launch copy and
 *    published collections, so they never depend on a single record existing.
 * 2. Record-backed routes (the nine fixed service paths, project detail, post detail,
 *    general `[slug]` pages) answer 200 once their record is published and 404 when it
 *    is absent. `notFound()` for absent/private records is the documented contract
 *    (`src/components/ServicePage.tsx`, `src/app/(frontend)/[slug]/page.tsx`), so a
 *    404 here means "no published record yet" — never "broken route". What must never
 *    happen, and is asserted, is a 5xx or a redirect to a non-canonical URL.
 *
 * Absent, reserved, retired and generic paths must all return a real HTTP 404.
 */

const BASE = 'http://localhost:3000'

// Mirrors FIXED_SERVICE_SLUGS in src/lib/routes.ts — each has its own top-level route
// directory (never a generic /services/[slug]). Order and spelling must match exactly.
const FIXED_SERVICE_SLUGS = [
  'sofa-upholstery',
  'custom-furniture',
  'custom-sofa',
  'majlis-furniture',
  'curtains-blinds',
  'sofa-repair',
  'custom-wardrobes',
  'custom-beds-headboards',
  'office-furniture',
]

// Structural routes: always 200, independent of which records are published.
const STRUCTURAL_ROUTES = ['/services/', '/portfolio/', '/projects/', '/blog/', '/about-us/', '/contact/']

// Paths that must be hard 404s: unknown, reserved, retired, and generic service paths.
const NOT_FOUND_ROUTES = [
  '/this-page-does-not-exist/',
  '/blog/this-post-does-not-exist/',
  '/projects/this-project-does-not-exist/',
  '/services/sofa-upholstery/',
  '/services/custom-wardrobes/',
  '/about/',
  '/posts/',
  '/blog/page/999/',
]

const statusIsPublishedOrAbsent = (status: number) =>
  status === 200 || status === 404

test.describe('Public route contract', () => {
  test('homepage resolves and renders the launch composition', async ({ page }) => {
    const response = await page.goto(`${BASE}/`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('homepage has no horizontal overflow', async ({ page }) => {
    await page.goto(`${BASE}/`)
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    )
    expect(overflows).toBe(false)
  })

  for (const path of STRUCTURAL_ROUTES) {
    test(`${path} resolves`, async ({ page }) => {
      const response = await page.goto(`${BASE}${path}`)
      expect(response?.status()).toBe(200)
    })
  }

  for (const slug of FIXED_SERVICE_SLUGS) {
    test(`service route /${slug}/ is canonical, published or absent`, async ({ page }) => {
      const response = await page.goto(`${BASE}/${slug}/`)
      const status = response?.status() ?? 0

      expect(status).toBeLessThan(500)
      expect(statusIsPublishedOrAbsent(status)).toBe(true)
      // A dedicated route must serve its own canonical URL — never redirect elsewhere.
      expect(new URL(page.url()).pathname).toBe(`/${slug}/`)

      if (status === 200) {
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      }
    })
  }

  test('unslashed public URLs normalise to the canonical trailing-slash form', async ({
    page,
  }) => {
    for (const path of ['/blog', '/about-us', '/projects']) {
      await page.goto(`${BASE}${path}`)
      expect(new URL(page.url()).pathname).toBe(`${path}/`)
    }
  })

  for (const path of NOT_FOUND_ROUTES) {
    test(`${path} returns a real 404`, async ({ page }) => {
      const response = await page.goto(`${BASE}${path}`)
      expect(response?.status()).toBe(404)
    })
  }
})
