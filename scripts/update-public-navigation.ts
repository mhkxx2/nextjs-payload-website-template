import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { GLOBAL_SEEDS } from '@/seed/site'

const context = { disableRevalidate: true } as const

async function main() {
  const payload = await getPayload({ config: configPromise })
  const [header, footer] = await Promise.all([
    payload.findGlobal({ slug: 'header', depth: 0, locale: 'en', overrideAccess: true }),
    payload.findGlobal({ slug: 'footer', depth: 0, locale: 'en', overrideAccess: true }),
  ])

  const navigation = GLOBAL_SEEDS.header.navigation.map((item) => ({
    ...item,
    id: header.navigation?.find((existing) => existing.destination === item.destination)?.id,
  }))

  await payload.updateGlobal({
    slug: 'header',
    locale: 'en',
    overrideAccess: true,
    context,
    data: {
      navigation,
      serviceLinks: header.serviceLinks,
      conversionActions: header.conversionActions,
      mobileNavigation: header.mobileNavigation,
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    locale: 'en',
    overrideAccess: true,
    context,
    data: {
      navigationGroups: GLOBAL_SEEDS.footer.navigationGroups,
      serviceLinks: footer.serviceLinks,
      legalLinks: footer.legalLinks,
      supportingCopy: footer.supportingCopy,
      conversionContent: footer.conversionContent,
    },
  })

  const [updatedHeader, updatedFooter] = await Promise.all([
    payload.findGlobal({ slug: 'header', depth: 0, locale: 'en', overrideAccess: true }),
    payload.findGlobal({ slug: 'footer', depth: 0, locale: 'en', overrideAccess: true }),
  ])

  console.log(
    JSON.stringify(
      {
        header: updatedHeader.navigation?.map(({ destination, label }) => ({
          destination,
          label,
        })),
        footer: updatedFooter.navigationGroups?.map(({ heading, items }) => ({
          heading,
          items: items?.map(({ destination, label }) => ({ destination, label })),
        })),
      },
      null,
      2,
    ),
  )

  await payload.destroy()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
