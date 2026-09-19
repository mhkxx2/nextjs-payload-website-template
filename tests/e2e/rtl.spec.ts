import { test, expect } from '@playwright/test'

test.describe('Locale & RTL Direction', () => {
  test('defaults to lang=en and dir=ltr', async ({ page }) => {
    await page.goto('/')

    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', 'en')
    await expect(html).toHaveAttribute('dir', 'ltr')
  })

  test('supports ?dir=rtl searchParam override in non-production mode', async ({ page }) => {
    await page.goto('/?dir=rtl')

    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
  })
})
