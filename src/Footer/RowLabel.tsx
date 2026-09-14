'use client'

import type { Footer } from '@/payload-types'
import { type RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['navigationGroups']>[number]>()
  const suffix = data.rowNumber !== undefined ? data.rowNumber + 1 : ''
  return <div>{data.data?.heading ? `Footer group ${suffix}: ${data.data.heading}` : 'Footer group'}</div>
}
