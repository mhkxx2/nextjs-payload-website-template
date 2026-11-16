import type { GlobalAfterChangeHook } from 'payload'

import { invalidateGlobalContent } from '@/globals/hooks/revalidateGlobalContent'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req }) => {
  invalidateGlobalContent('footer', req as unknown as Parameters<typeof invalidateGlobalContent>[1])

  return doc
}
