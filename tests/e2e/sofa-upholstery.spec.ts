import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

async function waitForGalleryHydration(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const trigger = document.querySelector<HTMLButtonElement>('.sofa-gallery-trigger')
    return typeof trigger?.onclick === 'function'
  })
}

// Run against an isolated app with the approved sofa CMS population, never production.
test.describe('Sofa upholstery gallery', () => {
  test('renders 8–16 reserved lazy images and keeps the native viewer keyboard accessible', async ({
    page,
  }) => {
    await page.goto('/sofa-upholstery/')
    const gallery = page.locator('.service-gallery-section')
    const triggers = gallery.getByRole('button', { name: /^View / })
    expect(await triggers.count()).toBeGreaterThanOrEqual(8)
    expect(await triggers.count()).toBeLessThanOrEqual(16)
    for (const image of await gallery.getByRole('img').all()) {
      expect((await image.getAttribute('alt'))?.trim()).toBeTruthy()
      await expect(image).toHaveAttribute('loading', 'lazy')
      expect(Number(await image.getAttribute('width'))).toBeGreaterThan(0)
      expect(Number(await image.getAttribute('height'))).toBeGreaterThan(0)
    }
    const closedResults = await new AxeBuilder({ page })
      .include('.service-gallery-section')
      .include('.service-hero')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(closedResults.violations).toEqual([])
    const trigger = triggers.nth(2)
    await waitForGalleryHydration(page)
    const originalOverflow = await page.evaluate(() => document.body.style.overflow)
    const alt = await trigger.locator('img').getAttribute('alt')
    const caption = await trigger.locator('..').locator('figcaption').textContent()
    await trigger.click()
    const viewer = page.getByRole('dialog', { name: 'Sofa Upholstery Gallery' })
    const close = viewer.getByRole('button', { name: 'Close gallery' })
    await expect(close).toBeFocused()
    await expect(viewer.getByRole('img')).toHaveAttribute('alt', alt!)
    await expect(viewer.locator('figcaption')).toHaveText(caption!)
    await page.keyboard.press('Shift+Tab')
    await expect(viewer.getByRole('button', { name: 'Next image' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(close).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect(viewer.getByRole('img')).not.toHaveAttribute('alt', alt!)
    await page.keyboard.press('ArrowLeft')
    await expect(viewer.getByRole('img')).toHaveAttribute('alt', alt!)
    const results = await new AxeBuilder({ page })
      .include('.sofa-lightbox')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(results.violations).toEqual([])
    await page.keyboard.press('Escape')
    await expect(viewer).toBeHidden()
    await expect(trigger).toBeFocused()
    expect(await page.evaluate(() => document.body.style.overflow)).toBe(originalOverflow)
  })

  test('fits mobile screens with 48px controls and horizontal swipe navigation', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/sofa-upholstery/')
    const trigger = page
      .locator('.service-gallery-section')
      .getByRole('button', { name: /^View / })
      .first()
    await waitForGalleryHydration(page)
    await trigger.click()
    const viewer = page.getByRole('dialog', { name: 'Sofa Upholstery Gallery' })
    const alt = await viewer.getByRole('img').getAttribute('alt')
    const figure = viewer.locator('figure')
    await figure.dispatchEvent('touchstart', {
      touches: [{ clientX: 250, clientY: 200, identifier: 1 }],
    })
    await figure.dispatchEvent('touchend', {
      changedTouches: [{ clientX: 100, clientY: 210, identifier: 1 }],
    })
    await expect(viewer.getByRole('img')).not.toHaveAttribute('alt', alt!)
    for (const button of await viewer.getByRole('button').all()) {
      const box = await button.boundingBox()
      expect(box?.width).toBeGreaterThanOrEqual(48)
      expect(box?.height).toBeGreaterThanOrEqual(48)
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    await viewer.getByRole('button', { name: 'Close gallery' }).click()
    await expect(trigger).toBeFocused()
  })
})
