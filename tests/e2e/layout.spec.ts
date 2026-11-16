import { test, expect } from '@playwright/test'

test.describe('Layout & Responsive Viewports', () => {
  const viewports = [
    { width: 375, height: 812, name: 'Mobile' },
    { width: 430, height: 932, name: 'Mobile Large' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1024, height: 768, name: 'Desktop' },
    { width: 1440, height: 900, name: 'Desktop Large' },
    { width: 1920, height: 1080, name: 'Desktop XL' },
  ]

  for (const vp of viewports) {
    test(`no horizontal overflow at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    })
  }

  test('contains skip link and main content landmark', async ({ page }) => {
    await page.goto('/')

    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeAttached()
    await expect(skipLink).toHaveText(/skip/i)

    const mainLandmark = page.locator('main#main-content')
    await expect(mainLandmark).toBeAttached()
  })
})
