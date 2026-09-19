import { test, expect } from '@playwright/test'

test.describe('Keyboard Accessibility', () => {
  test('focuses skip link on first Tab press', async ({ page }) => {
    await page.goto('/')

    await page.keyboard.press('Tab')
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeFocused()
  })
})
