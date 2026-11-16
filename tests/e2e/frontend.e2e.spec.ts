import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle('Custom Furniture & Sofa Upholstery Dubai | Al Rukn')
    await expect(page.locator('body')).toContainText('Al Rukn Furniture')
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Custom Furniture & Sofa Upholstery in Dubai')
  })

  test('about page presents the workshop story in the homepage design system', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/about-us/')

    expect(response?.status()).toBe(200)
    await expect(page.locator('.about-hero')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('About Al Rukn Furniture')
    await expect(
      page.getByRole('heading', { name: 'A Workshop, Not a Showroom Floor' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'From Your Idea to Finished Furniture' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Request a Free Quotation' }).first()).toBeVisible()
    await expect(page.locator('.about-story img')).toHaveAttribute('alt', /\S/)

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    )
    expect(overflows).toBe(false)
  })

  test('about page shows the same complete service-area collection as the homepage', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/')
    const homepageAreas = await page.locator('#areas-we-serve .area-chips > *').allTextContents()

    await page.goto('http://localhost:3000/about-us/')
    const aboutAreas = await page.locator('.about-area-list > *').allTextContents()

    expect(aboutAreas.length).toBeGreaterThan(40)
    expect(aboutAreas).toContain('Dubai Marina')
    expect(new Set(aboutAreas)).toEqual(new Set(homepageAreas))
  })

  test('contact page presents current hours and the homepage quotation flow', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/contact/')

    expect(response?.status()).toBe(200)
    await expect(page.locator('.contact-hero')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contact Al Rukn Furniture')
    await expect(page.getByText('9:00 AM – 11:00 PM', { exact: true })).toBeVisible()
    await expect(page.getByText('Friday', { exact: true })).toBeVisible()
    await expect(page.getByText('Closed', { exact: true })).toBeVisible()

    const quote = page.locator('#request-quote')
    await expect(quote.getByRole('heading', { name: 'Request a Free Quotation' })).toBeVisible()
    await expect(quote.locator('input[name="photo"]')).toHaveAttribute('required', '')
    await expect(quote.locator('#quote-area-options option')).toHaveCount(52)
  })

  test('contact page matches homepage coverage and publishes focused SEO metadata', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/')
    const homepageAreas = await page.locator('#areas-we-serve .area-chips > *').allTextContents()

    await page.goto('http://localhost:3000/contact/')
    const contactAreas = await page.locator('.contact-area-chips > *').allTextContents()
    const description = await page.locator('meta[name="description"]').getAttribute('content')

    expect(contactAreas.length).toBeGreaterThan(40)
    expect(new Set(contactAreas)).toEqual(new Set(homepageAreas))
    expect(await page.title()).toContain('Contact Al Rukn Furniture')
    expect(description).toMatch(/custom furniture/i)
    expect(description).toMatch(/free quotation/i)
  })
})
