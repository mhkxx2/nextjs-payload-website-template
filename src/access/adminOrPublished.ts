import type { Access, Where } from 'payload'

/**
 * Authenticated CMS users may read every record. Public reads are always
 * constrained to records whose explicit publication time has arrived.
 */
export const adminOrPublished: Access = ({ req: { user } }) => {
  if (user) return true

  const publicWhere: Where = {
    and: [
      {
        _status: {
          equals: 'published',
        },
      },
      {
        status: {
          equals: 'published',
        },
      },
      {
        publishedAt: {
          less_than_equal: new Date().toISOString(),
        },
      },
    ],
  }

  return publicWhere
}
