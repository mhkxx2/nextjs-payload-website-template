import React from 'react'

import { serializeJsonLd, type JsonLdObject } from '@/lib/schema'

export type JsonLdProps = {
  id?: string
  schemas?: JsonLdObject[] | null | undefined
}

/**
 * Renders the structured data block for a route. The serializer escapes '<' so
 * no value coming from the CMS can ever close the script tag early.
 */
export const JsonLd: React.FC<JsonLdProps> = ({ id = 'structured-data', schemas }) => {
  const payload = (schemas ?? []).filter((schema) => Boolean(schema?.['@type']))

  if (payload.length === 0) return null

  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(payload) }}
      id={id}
      type="application/ld+json"
    />
  )
}

export default JsonLd
