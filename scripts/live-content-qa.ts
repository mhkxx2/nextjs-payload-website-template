import 'dotenv/config'

import configPromise from '@payload-config'
import { chromium, type APIResponse, type BrowserContext, type Page } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'

import type { Media, Service } from '@/payload-types'

const baseURL = process.env.LIVE_CONTENT_QA_URL ?? 'http://127.0.0.1:3200'
const localeQuery = 'locale=en'
const runID = Date.now().toString(36).toUpperCase()
const results: Record<string, boolean | string> = {}

const relationID = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value && typeof value.id === 'number') {
    return value.id
  }
  return null
}

const assertResponse = async (response: APIResponse, label: string) => {
  if (response.ok()) return
  throw new Error(`${label} failed (${response.status()}): ${await response.text()}`)
}

const pageContains = async (page: Page, path: string, marker: string): Promise<boolean> => {
  const response = await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' })
  if (!response?.ok()) throw new Error(`${path} returned ${response?.status()}`)
  return (await page.locator('body').innerText()).includes(marker)
}

const requireFirstRefresh = async (page: Page, path: string, marker: string, label: string) => {
  const visible = await pageContains(page, path, marker)
  results[label] = visible
  if (!visible) throw new Error(`${label}: marker was not visible on the first refresh`)
}

const updateGlobal = async (
  context: BrowserContext,
  slug: string,
  data: Record<string, unknown>,
  draft = false,
) => {
  const response = await context.request.post(
    `${baseURL}/api/globals/${slug}/?${localeQuery}&draft=${String(draft)}`,
    { data, timeout: 120_000 },
  )
  await assertResponse(response, `update global ${slug}`)
}

const updateDocument = async (
  context: BrowserContext,
  collection: string,
  id: number,
  data: Record<string, unknown>,
  draft = false,
) => {
  const response = await context.request.patch(
    `${baseURL}/api/${collection}/${id}/?${localeQuery}&draft=${String(draft)}`,
    { data, timeout: 120_000 },
  )
  await assertResponse(response, `update ${collection}/${id}`)
}

async function main() {
  const payload = await getPayload({ config: configPromise })
  const email = `live-content-qa-${randomUUID()}@example.invalid`
  const password = randomUUID()
  let userID: number | null = null
  const restores: Array<() => Promise<void>> = []
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ baseURL })
  const page = await context.newPage()
  page.setDefaultNavigationTimeout(120_000)
  const restoreLastAndVerify = async (path: string, marker: string) => {
    await restores.pop()?.()
    if (await pageContains(page, path, marker)) {
      throw new Error(`Restore verification failed for ${path}: ${marker} is still visible`)
    }
  }

  try {
    const user = await payload.create({
      collection: 'users',
      data: { email, name: 'Live content QA', password },
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

    const [homepage, about, contact, archives, header, siteSettings, servicesResult, mediaResult] =
      await Promise.all([
        payload.findGlobal({ slug: 'homepage', depth: 1, draft: false, locale: 'en', overrideAccess: true }),
        payload.findGlobal({ slug: 'about-page', depth: 1, draft: false, locale: 'en', overrideAccess: true }),
        payload.findGlobal({ slug: 'contact-page', depth: 1, draft: false, locale: 'en', overrideAccess: true }),
        payload.findGlobal({ slug: 'archive-settings', depth: 1, draft: false, locale: 'en', overrideAccess: true }),
        payload.findGlobal({ slug: 'header', depth: 1, locale: 'en', overrideAccess: true }),
        payload.findGlobal({ slug: 'site-settings', depth: 1, locale: 'en', overrideAccess: true }),
        payload.find({
          collection: 'services', depth: 1, draft: false, limit: 20, locale: 'en',
          overrideAccess: true, pagination: false, where: { _status: { equals: 'published' } },
        }),
        payload.find({ collection: 'media', depth: 0, limit: 100, overrideAccess: true, pagination: false }),
      ])
    const services = servicesResult.docs as Service[]
    const service = services.find(({ slug }) => slug === 'sofa-upholstery') ?? services[0]
    if (!service?.slug) throw new Error('No published Service is available for live QA')

    for (const path of ['/', '/about-us/', '/contact/', '/services/', '/portfolio/', `/${service.slug}/`]) {
      const response = await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' })
      if (!response?.ok()) throw new Error(`Warm-up ${path} returned ${response?.status()}`)
    }

    const homeMarker = `QA-HOME-${runID}`
    const originalSharedLabels = homepage.sharedLabels ?? {}
    await updateGlobal(context, 'homepage', {
      _status: 'published',
      sharedLabels: { ...originalSharedLabels, finalCtaEyebrow: homeMarker },
    })
    restores.push(() => updateGlobal(context, 'homepage', { _status: 'published', sharedLabels: originalSharedLabels }))
    await requireFirstRefresh(page, '/', homeMarker, 'homepageFirstRefresh')
    await restoreLastAndVerify('/', homeMarker)

    const aboutMarker = `QA-ABOUT-${runID}`
    const originalAboutHero = about.hero ?? {}
    await updateGlobal(context, 'about-page', {
      _status: 'published',
      hero: { ...originalAboutHero, heading: aboutMarker },
    })
    restores.push(() => updateGlobal(context, 'about-page', { _status: 'published', hero: originalAboutHero }))
    await requireFirstRefresh(page, '/about-us/', aboutMarker, 'aboutFirstRefresh')
    await restoreLastAndVerify('/about-us/', aboutMarker)

    const contactMarker = `QA-CONTACT-${runID}`
    const originalContactHero = contact.hero ?? {}
    await updateGlobal(context, 'contact-page', {
      _status: 'published',
      hero: { ...originalContactHero, heading: contactMarker },
    })
    restores.push(() => updateGlobal(context, 'contact-page', { _status: 'published', hero: originalContactHero }))
    await requireFirstRefresh(page, '/contact/', contactMarker, 'contactFirstRefresh')
    await restoreLastAndVerify('/contact/', contactMarker)

    const servicesArchiveMarker = `QA-SERVICES-ARCHIVE-${runID}`
    const originalServicesArchive = archives.servicesArchive ?? {}
    await updateGlobal(context, 'archive-settings', {
      _status: 'published',
      servicesArchive: { ...originalServicesArchive, heading: servicesArchiveMarker },
    })
    restores.push(() => updateGlobal(context, 'archive-settings', {
      _status: 'published', servicesArchive: originalServicesArchive,
    }))
    await requireFirstRefresh(page, '/services/', servicesArchiveMarker, 'servicesArchiveFirstRefresh')
    await restoreLastAndVerify('/services/', servicesArchiveMarker)

    const portfolioMarker = `QA-PORTFOLIO-${runID}`
    const originalPortfolioArchive = archives.portfolioArchive ?? {}
    await updateGlobal(context, 'archive-settings', {
      _status: 'published',
      portfolioArchive: {
        ...originalPortfolioArchive,
        hero: { ...originalPortfolioArchive.hero, eyebrow: portfolioMarker },
      },
    })
    restores.push(() => updateGlobal(context, 'archive-settings', {
      _status: 'published', portfolioArchive: originalPortfolioArchive,
    }))
    await requireFirstRefresh(page, '/portfolio/', portfolioMarker, 'portfolioFirstRefresh')
    await restoreLastAndVerify('/portfolio/', portfolioMarker)

    const serviceMarker = `QA-SERVICE-${runID}`
    const originalPresentationLabels = service.presentationLabels ?? {}
    await updateDocument(context, 'services', service.id, {
      _status: 'published',
      presentationLabels: { ...originalPresentationLabels, benefitsHeading: serviceMarker },
    })
    restores.push(() => updateDocument(context, 'services', service.id, {
      _status: 'published', presentationLabels: originalPresentationLabels,
    }))
    await requireFirstRefresh(page, `/${service.slug}/`, serviceMarker, 'serviceFirstRefresh')
    await restoreLastAndVerify(`/${service.slug}/`, serviceMarker)

    const headerMarker = `QA-HEADER-${runID}`
    const originalNavigation = header.navigation ?? []
    const markedNavigation = originalNavigation.map((item, index) =>
      index === 0 ? { ...item, label: headerMarker } : item,
    )
    await updateGlobal(context, 'header', { navigation: markedNavigation })
    restores.push(() => updateGlobal(context, 'header', { navigation: originalNavigation }))
    await requireFirstRefresh(page, '/', headerMarker, 'headerFirstRefresh')
    await restoreLastAndVerify('/', headerMarker)

    const originalLogoID = relationID(siteSettings.logo)
    const originalFaviconID = relationID(siteSettings.favicon)
    const originalLogo = (mediaResult.docs as Media[]).find(({ id }) => id === originalLogoID)
    const originalFavicon = (mediaResult.docs as Media[]).find(({ id }) => id === originalFaviconID)
    const alternateMedia = (mediaResult.docs as Media[]).find(
      (item) => item.id !== originalLogoID && item.id !== originalFaviconID && item.filename,
    )
    if (!alternateMedia?.filename) throw new Error('No alternate Media record is available for logo/favicon QA')

    await updateGlobal(context, 'site-settings', { logo: alternateMedia.id })
    restores.push(() => updateGlobal(context, 'site-settings', { logo: originalLogoID }))
    await page.goto(`${baseURL}/`, { waitUntil: 'domcontentloaded' })
    const logoHTML = await page.content()
    results.logoFirstRefresh = logoHTML.includes(alternateMedia.filename)
    if (!results.logoFirstRefresh) throw new Error('logo: alternate filename absent on first refresh')
    await restores.pop()?.()
    await page.goto(`${baseURL}/`, { waitUntil: 'domcontentloaded' })
    if (originalLogo?.filename && !(await page.content()).includes(originalLogo.filename)) {
      throw new Error('logo: original filename absent after restore')
    }

    await updateGlobal(context, 'site-settings', { favicon: alternateMedia.id })
    restores.push(() => updateGlobal(context, 'site-settings', { favicon: originalFaviconID }))
    await page.goto(`${baseURL}/`, { waitUntil: 'domcontentloaded' })
    const iconHrefs = await page.locator('link[rel*="icon"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href') ?? ''),
    )
    results.faviconFirstRefresh = iconHrefs.some((href) => href.includes(alternateMedia.filename ?? ''))
    if (!results.faviconFirstRefresh) throw new Error('favicon: alternate filename absent on first refresh')
    await restores.pop()?.()
    await page.goto(`${baseURL}/`, { waitUntil: 'domcontentloaded' })
    const restoredIconHrefs = await page.locator('link[rel*="icon"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href') ?? ''),
    )
    if (originalFavicon?.filename && !restoredIconHrefs.some((href) => href.includes(originalFavicon.filename ?? ''))) {
      throw new Error('favicon: original filename absent after restore')
    }

    const heroMediaID = relationID(homepage.hero?.image)
    const heroMedia = heroMediaID
      ? await payload.findByID({
          collection: 'media',
          depth: 0,
          id: heroMediaID,
          overrideAccess: true,
        })
      : null
    if (!heroMedia) throw new Error('Homepage hero Media record is unavailable for Media invalidation QA')
    const mediaMarker = `QA-MEDIA-${runID}`
    const originalMediaAlt = heroMedia.alt
    await updateDocument(context, 'media', heroMedia.id, { alt: mediaMarker })
    restores.push(() => updateDocument(context, 'media', heroMedia.id, { alt: originalMediaAlt }))
    await page.goto(`${baseURL}/`, { waitUntil: 'domcontentloaded' })
    results.mediaFirstRefresh = (await page.locator(`img[alt="${mediaMarker}"]`).count()) > 0
    if (!results.mediaFirstRefresh) throw new Error('media: updated alt absent on first refresh')
    await restoreLastAndVerify('/', mediaMarker)

    const draftGlobalMarker = `QA-DRAFT-GLOBAL-${runID}`
    await updateGlobal(context, 'about-page', {
      _status: 'draft', hero: { ...originalAboutHero, heading: draftGlobalMarker },
    }, true)
    restores.push(() => updateGlobal(context, 'about-page', {
      _status: 'draft', hero: originalAboutHero,
    }, true))
    results.globalDraftHiddenPublicly = !(await pageContains(page, '/about-us/', draftGlobalMarker))
    if (!results.globalDraftHiddenPublicly) throw new Error('Global draft leaked to the public page')
    const previewSecret = encodeURIComponent(process.env.PREVIEW_SECRET ?? '')
    await page.goto(`${baseURL}/next/preview?path=%2Fabout-us%2F&previewSecret=${previewSecret}`, {
      waitUntil: 'domcontentloaded',
    })
    results.globalDraftVisibleInPreview = (await page.locator('body').innerText()).includes(draftGlobalMarker)
    if (!results.globalDraftVisibleInPreview) throw new Error('Global draft absent from preview')
    await restoreLastAndVerify('/about-us/', draftGlobalMarker)
    await page.goto(`${baseURL}/next/exit-preview`, { waitUntil: 'domcontentloaded' })

    const draftServiceMarker = `QA-DRAFT-SERVICE-${runID}`
    const originalServiceHero = service.hero ?? {}
    await updateDocument(context, 'services', service.id, {
      _status: 'draft', hero: { ...originalServiceHero, heading: draftServiceMarker },
    }, true)
    restores.push(() => updateDocument(context, 'services', service.id, {
      _status: 'draft', hero: originalServiceHero,
    }, true))
    results.serviceDraftHiddenPublicly = !(await pageContains(page, `/${service.slug}/`, draftServiceMarker))
    if (!results.serviceDraftHiddenPublicly) throw new Error('Service draft leaked to the public page')
    await page.goto(
      `${baseURL}/next/preview?path=${encodeURIComponent(`/${service.slug}/`)}&previewSecret=${previewSecret}`,
      { waitUntil: 'domcontentloaded' },
    )
    results.serviceDraftVisibleInPreview = (await page.locator('body').innerText()).includes(draftServiceMarker)
    if (!results.serviceDraftVisibleInPreview) throw new Error('Service draft absent from preview')
    await restoreLastAndVerify(`/${service.slug}/`, draftServiceMarker)
    await page.goto(`${baseURL}/next/exit-preview`, { waitUntil: 'domcontentloaded' })

    results.restored = true
    console.log(JSON.stringify(results, null, 2))
  } finally {
    while (restores.length) {
      await restores.pop()?.().catch((error) => console.error('Restore failed:', error))
    }
    await browser.close()
    if (userID !== null) {
      await payload.delete({ collection: 'users', id: userID, overrideAccess: true }).catch((error) =>
        console.error('Temporary user cleanup failed:', error),
      )
    }
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
