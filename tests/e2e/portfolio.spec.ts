import { expect, test } from '@playwright/test'

test.describe('Portfolio experience', () => {
  test('renders local images, URL-aware filters and incremental pagination', async ({ page }) => {
    const browserErrors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') browserErrors.push(message.text())
    })

    const response = await page.goto('/portfolio/')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Furniture Designs for Every Room')
    await expect(page.getByRole('button', { name: /^View / })).toHaveCount(18)

    const firstImage = page.locator('.portfolio-card img').first()
    await expect(firstImage).toBeVisible()
    await expect.poll(() => firstImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)

    const loadMore = page.getByRole('link', { name: 'Load More Designs' })
    await expect(loadMore).toHaveAttribute('href', /page=2/)
    await loadMore.click()
    await expect(page).toHaveURL(/page=2/, { timeout: 30_000 })
    await expect(page.getByRole('button', { name: /^View / })).toHaveCount(36, { timeout: 30_000 })

    await page.getByRole('link', { name: /^Bedroom/ }).click()
    await expect(page).toHaveURL(/category=bedroom/, { timeout: 30_000 })
    await expect(page.getByRole('link', { name: /^Bedroom/ })).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('.portfolio-card-copy').first()).toContainText('Bedroom')
    expect(browserErrors).toEqual([])
  })

  test('supports lightbox keyboard controls and preselected quotation flow', async ({ page }) => {
    await page.goto('/portfolio/')
    const firstCard = page.getByRole('button', { name: /^View / }).first()
    const title = (await firstCard.getAttribute('aria-label'))?.replace(/^View /, '')
    expect(title).toBeTruthy()
    await firstCard.click()

    const viewer = page.getByRole('dialog', { name: new RegExp(`${title} design viewer`) })
    await expect(viewer).toBeVisible()
    await expect(page).toHaveURL(/design=/)
    const initialURL = page.url()
    await page.keyboard.press('ArrowRight')
    await expect.poll(() => page.url()).not.toBe(initialURL)

    const whatsapp = page.getByRole('link', { name: 'Send on WhatsApp' })
    await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa\.me\//)
    await expect(whatsapp).toHaveAttribute('href', /portfolio/)

    await page.getByRole('button', { name: 'Request Similar Design' }).click()
    const form = page.getByRole('dialog', { name: /^Request / })
    await expect(form).toBeVisible()
    await expect(form.locator('input[name="portfolioItem"]')).not.toHaveValue('')
    await expect(form.locator('input[name="service"]')).not.toHaveValue('')
    await expect(form.locator('input[name="photo"]')).not.toHaveAttribute('required', '')
    await page.keyboard.press('Escape')
    await expect(form).toBeHidden()
    await page.keyboard.press('Escape')
    await expect(viewer).toBeHidden()
    await expect(page).not.toHaveURL(/design=/)
  })

  test('can dismiss a design opened from a direct link', async ({ page }) => {
    await page.goto('/portfolio/')
    await page.getByRole('button', { name: /^View / }).first().click()
    const directLink = page.url()
    expect(directLink).toContain('design=')

    await page.goto(directLink)
    await expect(page.getByRole('dialog', { name: /design viewer/ })).toBeVisible()
    await page.getByRole('button', { name: 'Close design viewer' }).click()
    await expect(page.getByRole('dialog', { name: /design viewer/ })).toBeHidden()
    await expect(page).not.toHaveURL(/design=/)
  })
})
