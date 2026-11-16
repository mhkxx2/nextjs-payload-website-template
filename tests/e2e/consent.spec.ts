import { expect, test, type Page } from '@playwright/test'

const STORAGE_KEY = 'alrukn_cookie_consent_v1'

async function startWithoutConsent(page: Page) {
  await page.goto('/')
  await page.evaluate((key) => window.localStorage.removeItem(key), STORAGE_KEY)
  await page.reload()
  await expect(page.getByRole('region', { name: 'Cookie consent' })).toBeVisible()
}

async function storedConsent(page: Page) {
  return page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? 'null'), STORAGE_KEY)
}

async function consentCommands(page: Page) {
  return page.evaluate(() => (window.dataLayer ?? [])
    .map((item) => Array.from(item as ArrayLike<unknown>))
    .filter((item) => item[0] === 'consent' && item[1] === 'update'))
}

async function blockContactNavigation(page: Page) {
  await page.evaluate(() => {
    document.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null
      if (link?.href.startsWith('tel:') || link?.href.startsWith('https://wa.me/')) {
        event.preventDefault()
      }
    }, true)
  })
}

test.describe('Cookie consent and Consent Mode', () => {
  test('accepts all and rejects optional cookies with exact Google updates', async ({ page }) => {
    await startWithoutConsent(page)
    await page.getByRole('button', { name: 'Accept All' }).click()

    await expect.poll(() => storedConsent(page)).toEqual(expect.objectContaining({
      advertising: true,
      analytics: true,
      version: 1,
    }))
    await expect.poll(() => consentCommands(page)).toEqual([
      ['consent', 'update', {
        ad_personalization: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        analytics_storage: 'granted',
      }],
    ])

    await page.evaluate((key) => window.localStorage.removeItem(key), STORAGE_KEY)
    await page.reload()
    await page.getByRole('button', { name: 'Reject Optional' }).click()

    await expect.poll(() => storedConsent(page)).toEqual(expect.objectContaining({
      advertising: false,
      analytics: false,
      version: 1,
    }))
    await expect.poll(() => consentCommands(page)).toEqual([
      ['consent', 'update', {
        ad_personalization: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        analytics_storage: 'denied',
      }],
    ])
  })

  test('persists custom preferences and reopens them from the footer', async ({ page }) => {
    await startWithoutConsent(page)
    await page.getByRole('button', { name: 'Manage Preferences' }).click()
    await page.getByRole('switch', { name: 'Analytics Cookies' }).check()
    await page.getByRole('button', { name: 'Save Preferences' }).click()

    await page.reload()
    await expect(page.getByRole('region', { name: 'Cookie consent' })).toBeHidden()
    await page.getByRole('button', { name: 'Cookie Settings' }).scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Cookie Settings' }).click()

    await expect(page.getByRole('dialog', { name: 'Cookie preferences' })).toBeVisible()
    await expect(page.getByRole('switch', { name: 'Analytics Cookies' })).toBeChecked()
    await expect(page.getByRole('switch', { name: 'Advertising Cookies' })).not.toBeChecked()
  })

  test('traps focus, closes with Escape, and restores focus to the trigger', async ({ page }) => {
    await startWithoutConsent(page)
    const manage = page.getByRole('button', { name: 'Manage Preferences' })
    await manage.focus()
    await manage.click()

    const close = page.getByRole('button', { name: 'Close cookie preferences' })
    await expect(close).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(page.getByRole('button', { name: 'Accept All' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(close).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Cookie preferences' })).toBeHidden()
    await expect(manage).toBeFocused()
  })

  for (const width of [375, 430, 768, 1440]) {
    test(`fits the consent experience without overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ height: 900, width })
      await startWithoutConsent(page)

      const geometry = await page.evaluate(() => {
        const banner = document.querySelector('.cookie-consent-banner')?.getBoundingClientRect()
        const sticky = document.querySelector('.mobile-sticky-bar')?.getBoundingClientRect()
        return {
          banner: banner && { bottom: banner.bottom, left: banner.left, right: banner.right, top: banner.top },
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          sticky: sticky && { bottom: sticky.bottom, left: sticky.left, right: sticky.right, top: sticky.top },
        }
      })

      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.innerWidth)
      expect(geometry.banner?.left).toBeGreaterThanOrEqual(0)
      expect(geometry.banner?.right).toBeLessThanOrEqual(geometry.innerWidth)
      if (width < 768) expect(geometry.banner?.bottom).toBeLessThanOrEqual(geometry.sticky?.top ?? 0)

      await page.getByRole('button', { name: 'Manage Preferences' }).click()
      await expect(page.getByRole('dialog', { name: 'Cookie preferences' })).toBeInViewport()
    })
  }

  test('keeps contact and successful-lead events single-fire after consent changes', async ({ page }) => {
    await page.route('**/api/quote-request', (route) => route.fulfill({
      body: JSON.stringify({ message: 'Saved' }),
      contentType: 'application/json',
      status: 200,
    }))
    await startWithoutConsent(page)
    await page.getByRole('button', { name: 'Accept All' }).click()
    await blockContactNavigation(page)
    await page.evaluate(() => { window.dataLayer = [] })

    await page.locator('.home-hero .button-whatsapp').click()
    await page.locator('.header-call').click()
    await page.getByLabel('Name').fill('Private Customer')
    await page.getByLabel('Phone / WhatsApp').fill('+971500000000')
    await page.getByLabel('Service').selectOption({ index: 1 })
    await page.getByLabel('Area').fill('Dubai Marina')
    await page.getByRole('textbox', { name: 'Message', exact: true }).fill('Private message')
    await page.getByLabel('Furniture / design photo').setInputFiles({
      buffer: Buffer.from('test image'),
      mimeType: 'image/jpeg',
      name: 'private-photo.jpg',
    })
    await page.getByRole('checkbox', { name: /I agree that Al Rukn/i }).check()
    await page.getByRole('button', { name: 'Request a Quote' }).click()

    await expect.poll(() => page.evaluate(() => (window.dataLayer ?? []).filter(
      (item) => item && typeof item === 'object' && 'event' in item
        && ['whatsapp_click', 'phone_call_click', 'generate_lead'].includes(String(item.event)),
    ))).toEqual([
      expect.objectContaining({ event: 'whatsapp_click' }),
      expect.objectContaining({ event: 'phone_call_click' }),
      expect.objectContaining({ event: 'generate_lead' }),
    ])
  })
})
