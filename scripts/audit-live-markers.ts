import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

const hits: string[] = []

const inspect = (value: unknown, path: string) => {
  if (typeof value === 'string' && value.includes('QA-')) hits.push(`${path}=${value}`)
  if (Array.isArray(value)) value.forEach((item, index) => inspect(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => inspect(item, `${path}.${key}`))
  }
}

async function main() {
  const payload = await getPayload({ config: configPromise })
  try {
    for (const slug of ['homepage', 'about-page', 'contact-page', 'archive-settings', 'header', 'site-settings'] as const) {
      for (const draft of [false, true]) {
        inspect(
          await payload.findGlobal({ slug, depth: 0, draft, locale: 'en', overrideAccess: true }),
          `${draft ? 'latest' : 'published'}.${slug}`,
        )
      }
    }
    for (const collection of ['services', 'media'] as const) {
      for (const draft of [false, true]) {
        const result = await payload.find({
          collection,
          depth: 0,
          draft,
          limit: 1000,
          locale: 'en',
          overrideAccess: true,
          pagination: false,
        })
        inspect(result.docs, `${draft ? 'latest' : 'published'}.${collection}`)
      }
    }
    console.log(JSON.stringify({ hits }, null, 2))
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
