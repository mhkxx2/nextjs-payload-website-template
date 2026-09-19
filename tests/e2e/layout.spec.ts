import { test, expect } from '@playwright/test'

test.describe('Layout & Responsive Viewports', () => {
  const viewports = [
    { width: 320, height: 640, name: 'Mobile Small' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1440, height: 900, name: 'Desktop Large' },
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
