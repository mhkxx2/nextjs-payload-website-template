import { expect, test } from '@playwright/test'

type DataLayerEvent = Record<string, string>

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

async function blockContactNavigation(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    document.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null
      if (link?.href.startsWith('tel:') || link?.href.startsWith('https://wa.me/')) {
        event.preventDefault()
      }
    }, true)
  })
}

async function events(page: import('@playwright/test').Page): Promise<DataLayerEvent[]> {
  const applicationEvents = ['whatsapp_click', 'phone_call_click', 'generate_lead']
  return page.evaluate(() => (window.dataLayer ?? []).filter(
    (item): item is DataLayerEvent => Boolean(
      item && typeof item === 'object' && 'event' in item,
    ),
  )).then((items) => items.filter((item) => applicationEvents.includes(item.event ?? '')))
}

async function waitForTrackedContactHydration(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const link = document.querySelector<HTMLAnchorElement>(
      '.service-hero a[href^="https://wa.me/"]',
    )
    return typeof link?.onclick === 'function'
  })
}

async function waitForReactControlHydration(
  page: import('@playwright/test').Page,
  selector: string,
) {
  await page.waitForFunction((target) => {
    const control = document.querySelector(target)
    return Boolean(control && Object.keys(control).some((key) => key.startsWith('__reactProps$')))
  }, selector)
}

test.describe('Analytics event layer', () => {
  test('sofa hero, quote and shared contacts retain exact event names and service context', async ({ page }) => {
    await page.goto('/sofa-upholstery/')
    await waitForTrackedContactHydration(page)
    await blockContactNavigation(page)
    for (const section of ['.service-hero', '#request-service-quote']) {
      await page.locator(`${section} a[href^="https://wa.me/"]`).click()
      await page.locator(`${section} a[href^="tel:"]`).click()
    }
    await page.locator('.header-whatsapp').click()
    await expect.poll(() => events(page)).toEqual([
      ...['service_hero', 'service_quote'].flatMap((cta_location) => [
        expect.objectContaining({ event: 'whatsapp_click', cta_location, service: 'sofa-upholstery', page_path: '/sofa-upholstery/' }),
        expect.objectContaining({ event: 'phone_call_click', cta_location, service: 'sofa-upholstery', page_path: '/sofa-upholstery/' }),
      ]),
      expect.objectContaining({ event: 'whatsapp_click', cta_location: 'header', service: 'sofa-upholstery' }),
    ])
  })

  test('sofa quote emits one generate_lead only after success without customer details', async ({ page }) => {
    // Intercept submission: this assertion must not create a live customer lead.
    let accepted = false
    await page.route('**/api/quote-request', (route) => route.fulfill({
      status: accepted ? 200 : 422,
      contentType: 'application/json',
      body: JSON.stringify({ message: accepted ? 'Received' : 'Please try again' }),
    }))
    await page.goto('/sofa-upholstery/')
    const form = page.locator('#request-service-quote form')
    await form.locator('[name="name"]').fill('Test Customer')
    await form.locator('[name="phone"]').fill('+971500000000')
    await form.locator('[name="area"]').fill('Dubai Marina')
    await form.locator('[name="message"]').fill('Private sofa enquiry')
    await form.locator('[name="photo"]').setInputFiles({ name: 'private-sofa.png', mimeType: 'image/png', buffer: Buffer.from('test photo') })
    await waitForReactControlHydration(page, '#request-service-quote [name="consent"]')
    await form.locator('[name="consent"]').check()
    await form.getByRole('button', { name: 'Request My Sofa Quote' }).click()
    await expect(form.getByRole('status')).toHaveText('Please try again')
    expect((await events(page)).filter((item) => item.event === 'generate_lead')).toEqual([])
    accepted = true
    await form.getByRole('button', { name: 'Request My Sofa Quote' }).click()
    await expect.poll(async () => (await events(page)).filter((item) => item.event === 'generate_lead')).toEqual([
      expect.objectContaining({ event: 'generate_lead', cta_location: 'service_quote', lead_type: 'service_quote', service: 'sofa-upholstery', page_path: '/sofa-upholstery/' }),
    ])
    expect(JSON.stringify(await events(page))).not.toMatch(/Test Customer|971500000000|Private sofa enquiry|private-sofa.png/)
  })
  test('emits one event for homepage WhatsApp and call controls', async ({ page }) => {
    await page.goto('/')
    await blockContactNavigation(page)

    await page.locator('.home-hero .button-whatsapp').click()
    await page.locator('.header-call').click()

    await expect.poll(() => events(page)).toEqual([
      expect.objectContaining({ cta_location: 'homepage_hero', event: 'whatsapp_click', page_path: '/' }),
      expect.objectContaining({ cta_location: 'header', event: 'phone_call_click', page_path: '/' }),
    ])
  })

  test('adds service context to a shared contact control on service routes', async ({ page }) => {
    await page.goto('/sofa-upholstery/')
    await blockContactNavigation(page)

    await page.locator('.header-whatsapp').click()

    await expect.poll(() => events(page)).toEqual([
      expect.objectContaining({
        cta_location: 'header',
        event: 'whatsapp_click',
        page_path: '/sofa-upholstery/',
        service: 'sofa-upholstery',
      }),
    ])
  })

  test('emits portfolio and contact context without customer data', async ({ page }) => {
    await page.goto('/portfolio/')
    await blockContactNavigation(page)
    await page.locator('.portfolio-card-trigger').first().click()
    await page.locator('.portfolio-lightbox .button-whatsapp').click()

    const [portfolioEvent] = await events(page)
    expect(portfolioEvent).toEqual(expect.objectContaining({
      category: expect.any(String),
      cta_location: 'portfolio',
      event: 'whatsapp_click',
      portfolio_item: expect.any(String),
      service: expect.any(String),
    }))
    expect(portfolioEvent).not.toHaveProperty('customer_name')
    expect(portfolioEvent).not.toHaveProperty('customer_email')
    expect(portfolioEvent).not.toHaveProperty('customer_phone')

    await page.goto('/contact/')
    await blockContactNavigation(page)
    await page.locator('.contact-primary-link[href^="tel:"]').click()
    await expect.poll(() => events(page)).toEqual([
      expect.objectContaining({ cta_location: 'contact_details', event: 'phone_call_click' }),
    ])
  })

  test('emits one event from each mobile contact surface', async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto('/')
    await blockContactNavigation(page)

    await page.locator('.mobile-sticky-bar a[href*="wa.me"]').click()
    await page.getByRole('button', { name: 'Open navigation menu' }).click()
    await page.locator('.mobile-drawer a[href^="tel:"]').click()

    await expect.poll(() => events(page)).toEqual([
      expect.objectContaining({ cta_location: 'mobile_sticky', event: 'whatsapp_click' }),
      expect.objectContaining({ cta_location: 'mobile_navigation', event: 'phone_call_click' }),
    ])
  })
})
