import type { GlobalAfterChangeHook } from 'payload'

import { invalidateGlobalContent } from '@/globals/hooks/revalidateGlobalContent'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req }) => {
  invalidateGlobalContent('header', req as unknown as Parameters<typeof invalidateGlobalContent>[1])

  return doc
}
