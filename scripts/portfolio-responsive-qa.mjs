import { writeFile } from 'node:fs/promises'

import { chromium } from '@playwright/test'

const baseURL = process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:3101/portfolio/'
const widths = [375, 430, 768, 1024, 1440, 1920]
const browser = await chromium.launch({ headless: true })
const results = []

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { height: width < 768 ? 844 : 1000, width } })
    const consoleErrors = []
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    const response = await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
    await page.locator('h1').waitFor()
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(420, window.innerHeight * 0.7)) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 80))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(500)

    const metrics = await page.evaluate(() => ({
      brokenPortfolioImages: Array.from(document.querySelectorAll('.portfolio-page img')).filter((image) => {
        const element = image
        return element.complete && element.naturalWidth === 0
      }).length,
      cards: document.querySelectorAll('.portfolio-card').length,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    }))

    let interaction = null
    if (width === 375 || width === 1440) {
      const card = page.getByRole('button', { name: /^View / }).first()
      await card.click()
      const viewer = page.getByRole('dialog', { name: /design viewer/ })
      await viewer.waitFor()
      const before = page.url()
      await page.keyboard.press('ArrowRight')
      await page.waitForFunction((url) => window.location.href !== url, before)
      await page.getByRole('button', { name: 'Request Similar Design' }).click()
      const quote = page.getByRole('dialog', { name: /^Request / })
      await quote.waitFor()
      interaction = {
        keyboardNext: page.url() !== before,
        quotePortfolioID: await quote.locator('input[name="portfolioItem"]').inputValue(),
        quoteVisible: await quote.isVisible(),
      }
      await page.keyboard.press('Escape')
      await page.keyboard.press('Escape')
    }

    await page.screenshot({ fullPage: true, path: `/tmp/alrukn-portfolio-${width}.png` })
    results.push({ consoleErrors, interaction, status: response?.status(), width, ...metrics })
    await page.close()
  }
} finally {
  await browser.close()
}

const reportPath = '/tmp/alrukn-portfolio-responsive-qa.json'
await writeFile(reportPath, `${JSON.stringify(results, null, 2)}\n`)
console.log(JSON.stringify({ reportPath, results }, null, 2))

if (results.some((result) => result.status !== 200 || result.horizontalOverflow || result.brokenPortfolioImages || result.consoleErrors.length)) {
  process.exitCode = 1
}
