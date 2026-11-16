import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('Homepage accessibility', () => {
  test('cookie preferences dialog has no detectable violations and returns keyboard focus', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.localStorage.removeItem('alrukn_cookie_consent_v1'))
    await page.reload()

    const manage = page.getByRole('button', { name: 'Manage Preferences' })
    await manage.focus()
    await manage.click()
    await expect(page.getByRole('button', { name: 'Close cookie preferences' })).toBeFocused()

    const results = await new AxeBuilder({ page })
      .include('.cookie-preferences-dialog')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
    await page.keyboard.press('Escape')
    await expect(manage).toBeFocused()
  })

  test('has no automatically detectable WCAG A or AA violations', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Custom Furniture & Sofa Upholstery in Dubai',
    )

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('keeps mobile navigation keyboard-operable', async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto('/')
    const menu = page.getByRole('button', { name: 'Open navigation menu' })
    await menu.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name: 'Close navigation menu' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu).toBeFocused()
  })

  test('service-page composition has no detectable WCAG A or AA violations', async ({ page }) => {
    await page.goto('/curtains-blinds/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Custom Curtains & Blinds in Dubai',
    )

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
