import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('Portfolio accessibility', () => {
  test('has no automatically detectable WCAG A or AA violations', async ({ page }) => {
    await page.goto('/portfolio/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Furniture Designs for Every Room')
    await expect(page.locator('.portfolio-card img').first()).toBeVisible()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('keeps the design viewer keyboard operable', async ({ page }) => {
    await page.goto('/portfolio/')
    const firstCard = page.getByRole('button', { name: /^View / }).first()
    await firstCard.click()
    const closeViewer = page.getByRole('button', { name: 'Close design viewer' })
    await expect(closeViewer).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(page.getByRole('button', { name: 'Next design' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(closeViewer).toBeFocused()
    const originalURL = page.url()
    await page.keyboard.press('ArrowRight')
    await expect.poll(() => page.url()).not.toBe(originalURL)

    const requestButton = page.getByRole('button', { name: 'Request Similar Design' })
    await requestButton.click()
    const closeQuote = page.getByRole('button', { name: 'Close quotation form' })
    await expect(closeQuote).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(page.getByRole('button', { name: 'Request a Quotation' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(requestButton).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: /design viewer/ })).toBeHidden()
    await expect(firstCard).toBeFocused()
  })
})
