import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Al Rukn Furniture/)
    await expect(page.locator('body')).toContainText('Al Rukn Furniture')
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Made-to-Measure Furniture in the UAE')
  })
})
