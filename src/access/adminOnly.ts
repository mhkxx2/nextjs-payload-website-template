import type { Access, AccessArgs } from 'payload'

/** All authenticated Payload users are trusted CMS administrators. */
export function isAdmin({ req: { user } }: AccessArgs): boolean {
  return Boolean(user)
}

export const adminOnly: Access = isAdmin
