import type React from 'react'
import { notFound } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

/** Redirects are emitted by src/proxy.ts, where the full request URL and exact status are available. */
export const PayloadRedirects: React.FC<Props> = ({ disableNotFound }) => {
  if (disableNotFound) return null

  notFound()
}
