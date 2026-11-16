/**
 * Mandatory CMS live-update acceptance for /bed-upholstery/.
 *
 * Usage (against the running Next/Payload process):
 *   LIVE_CONTENT_QA_URL=http://127.0.0.1:3100 pnpm exec tsx scripts/bed-upholstery-live-update-qa.ts
 */
import 'dotenv/config'

import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import path from 'node:path'

import configPromise from '@payload-config'
import { chromium, type APIResponse, type BrowserContext, type Page } from '@playwright/test'
import { getPayload } from 'payload'

const baseURL = process.env.LIVE_CONTENT_QA_URL ?? 'http://127.0.0.1:3100'
const localeQuery = 'locale=en'
const runID = Date.now().toString(36).toUpperCase()
const SLUG = 'bed-upholstery'
const PATH = `/${SLUG}/`

const assertResponse = async (response: APIResponse, label: string) => {
  if (response.ok()) return
  throw new Error(`${label} failed (${response.status()}): ${await response.text()}`)
}

const pageContains = async (page: Page, pathName: string, marker: string): Promise<boolean> => {
  const response = await page.goto(`${baseURL}${pathName}`, { waitUntil: 'domcontentloaded' })
  if (!response?.ok()) throw new Error(`${pathName} returned ${response?.status()}`)
  return (await page.locator('body').innerText()).includes(marker)
}

const updateDocument = async (
  context: BrowserContext,
  collection: string,
  id: number,
  data: Record<string, unknown>,
) => {
  const response = await context.request.patch(
    `${baseURL}/api/${collection}/${id}/?${localeQuery}&draft=false`,
    { data, timeout: 120_000 },
  )
  await assertResponse(response, `update ${collection}/${id}`)
}

async function main() {
  const buildBefore = readFileSync(path.join(process.cwd(), '.next/BUILD_ID'), 'utf8').trim()
  const payload = await getPayload({ config: configPromise })
  const email = `bed-live-qa-${randomUUID()}@example.invalid`
  const password = randomUUID()
  let userID: number | null = null

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ baseURL })
  const page = await context.newPage()
  page.setDefaultNavigationTimeout(120_000)

  try {
    const user = await payload.create({
      collection: 'users',
      data: { email, name: 'Bed upholstery live QA', password },
      overrideAccess: true,
    })
    userID = user.id

    const login = await context.request.post(`${baseURL}/api/users/login/`, {
      data: { email, password },
      timeout: 120_000,
    })
    await assertResponse(login, 'temporary admin login')
    const loginData = (await login.json()) as { token?: string }
    if (!loginData.token) throw new Error('Temporary admin login returned no token')
    await context.setExtraHTTPHeaders({ Authorization: `JWT ${loginData.token}` })

    const found = await payload.find({
      collection: 'services',
      depth: 0,
      draft: false,
      limit: 1,
      locale: 'en',
      overrideAccess: true,
      where: { slug: { equals: SLUG }, _status: { equals: 'published' } },
    })
    const service = found.docs[0]
    if (!service) throw new Error(`Published ${SLUG} service not found`)

    const warm = await page.goto(`${baseURL}${PATH}`, { waitUntil: 'domcontentloaded' })
    if (!warm?.ok()) throw new Error(`Warm-up ${PATH} returned ${warm?.status()}`)

    // Bed landing renders presentationLabels.workshopNote (not benefitsHeading).
    const marker = `QA-BED-${runID}`
    const originalLabels = service.presentationLabels ?? {}
    await updateDocument(context, 'services', service.id, {
      _status: 'published',
      presentationLabels: { ...originalLabels, workshopNote: marker },
    })

    const visible = await pageContains(page, PATH, marker)
    if (!visible) throw new Error(`Live update marker absent on first refresh: ${marker}`)

    await updateDocument(context, 'services', service.id, {
      _status: 'published',
      presentationLabels: originalLabels,
    })
    if (await pageContains(page, PATH, marker)) {
      throw new Error(`Restore failed: marker still visible (${marker})`)
    }

    const buildAfter = readFileSync(path.join(process.cwd(), '.next/BUILD_ID'), 'utf8').trim()
    if (buildBefore !== buildAfter) {
      throw new Error(`BUILD_ID changed during live update (${buildBefore} → ${buildAfter})`)
    }

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          path: PATH,
          marker,
          buildId: buildBefore,
          serviceId: service.id,
          restored: true,
        },
        null,
        2,
      )}\n`,
    )
  } finally {
    await browser.close().catch(() => undefined)
    if (userID != null) {
      await payload.delete({ collection: 'users', id: userID, overrideAccess: true }).catch(() => undefined)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
