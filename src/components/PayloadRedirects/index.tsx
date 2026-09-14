import type React from 'react'
import { resolveRedirect } from '@/collections/Redirects'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = resolveRedirect(url, redirects)

  if (redirectItem) {
    redirect(redirectItem.destination)
  }

  if (disableNotFound) return null

  notFound()
}
