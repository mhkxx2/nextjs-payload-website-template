import { test, expect } from '@playwright/test'

test.describe('Navigation Chrome & Interaction', () => {
  test('header and footer load with canonical links', async ({ page }) => {
    await page.goto('/')

    const logo = page.locator('header a[aria-label="Al Rukn Furniture Homepage"]')
    await expect(logo).toBeVisible()

    const nav = page.locator('nav[aria-label="Main navigation"]')
    await expect(nav).toBeVisible()

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText('CGMC+486, Al Jerf 1')
  })

  for (const viewport of [
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
  ]) {
    test(`mobile nav is a full-screen accessible overlay at ${viewport.width}px`, async ({ page }) => {
      const browserErrors: string[] = []
      page.on('console', (message) => {
        if (message.type() === 'error') browserErrors.push(message.text())
      })
      page.on('pageerror', (error) => browserErrors.push(error.message))

      await page.setViewportSize(viewport)
      await page.goto('/')

      const menuButton = page.locator('.menu-trigger')
      await expect(menuButton).toBeVisible()
      await expect(menuButton).toHaveAttribute('aria-label', 'Open navigation menu')

      await menuButton.click()

      const drawer = page.locator('.mobile-drawer')
      const closeButton = page.locator('button[aria-label="Close navigation menu"]')
      await expect(drawer).toBeVisible()

      const drawerBox = await drawer.boundingBox()
      expect(drawerBox).not.toBeNull()
      expect(drawerBox?.x).toBeCloseTo(0, 0)
      expect(drawerBox?.y).toBeCloseTo(0, 0)
      expect(drawerBox?.width).toBeCloseTo(viewport.width, 0)
      expect(drawerBox?.height).toBeCloseTo(viewport.height, 0)
      await expect(drawer).toHaveAttribute('aria-modal', 'true')
      await expect(closeButton).toBeFocused()
      await expect(page.locator('.mobile-sticky-bar')).toBeHidden()
      await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
      await expect(menuButton).toHaveAttribute('aria-controls', 'mobile-navigation-drawer')

      const drawerScroll = drawer.locator('.mobile-drawer-scroll')
      await expect(drawerScroll).toHaveCSS('overflow-y', 'auto')
      expect(await drawerScroll.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
      await drawerScroll.evaluate((element) => element.scrollTo(0, element.scrollHeight))
      await expect(drawer.locator('nav a').last()).toBeInViewport()
      await expect(closeButton).toBeInViewport()

      if (viewport.width === 390) {
        await page.setViewportSize({ width: viewport.height, height: viewport.width })
        const landscapeBox = await drawer.boundingBox()
        expect(landscapeBox?.width).toBeCloseTo(viewport.height, 0)
        expect(landscapeBox?.height).toBeCloseTo(viewport.width, 0)
        await page.setViewportSize(viewport)
      }

      await page.keyboard.press('Escape')
      await expect(drawer).not.toBeVisible()
      await expect(menuButton).toBeFocused()
      if (viewport.width < 768) {
        await expect(page.locator('.mobile-sticky-bar')).toBeVisible()
      } else {
        await expect(page.locator('.mobile-sticky-bar')).toBeHidden()
      }
      await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
      expect(browserErrors).toEqual([])
    })
  }
})
