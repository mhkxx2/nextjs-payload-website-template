import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import { getCachedGlobal } from '@/utilities/getGlobals'

export async function getHomepageGlobal() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return getCachedGlobal('homepage', 2)()
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({ depth: 2, draft: true, overrideAccess: true, slug: 'homepage' })
}

