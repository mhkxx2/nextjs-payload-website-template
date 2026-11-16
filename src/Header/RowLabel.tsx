'use client'

import type { Header } from '@/payload-types'
import { type RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['navigation']>[number]>()
  const suffix = data.rowNumber !== undefined ? data.rowNumber + 1 : ''
  return <div>{data.data?.label ? `Navigation item ${suffix}: ${data.data.label}` : 'Navigation item'}</div>
}
