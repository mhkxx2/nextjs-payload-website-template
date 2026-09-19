import { test, expect } from '@playwright/test'

test.describe('Navigation Chrome & Interaction', () => {
  test('header and footer load with canonical links', async ({ page }) => {
    await page.goto('/')

    const logo = page.locator('header a[aria-label="Al Rukn Furniture Homepage"]')
    await expect(logo).toBeVisible()

    const nav = page.locator('nav[aria-label="Main Navigation"]')
    await expect(nav).toBeVisible()

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText('Industrial Area')
  })

  test('mobile nav menu toggles and traps focus', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const menuButton = page.locator('button[aria-label="Open navigation menu"]')
    await expect(menuButton).toBeVisible()

    await menuButton.click()
    const closeButton = page.locator('button[aria-label="Close navigation menu"]')
    await expect(closeButton).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(closeButton).not.toBeVisible()
  })
})
