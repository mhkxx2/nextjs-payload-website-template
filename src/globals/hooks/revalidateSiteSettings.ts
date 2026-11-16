import type { GlobalAfterChangeHook } from 'payload'
import { invalidateGlobalContent } from './revalidateGlobalContent'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ doc, req }) => {
  invalidateGlobalContent(
    'site-settings',
    req as unknown as Parameters<typeof invalidateGlobalContent>[1],
  )

  return doc
}
