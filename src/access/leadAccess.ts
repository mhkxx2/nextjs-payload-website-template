import type { Access, CollectionConfig } from 'payload'

import { adminOnly, isAdmin } from './adminOnly'

/**
 * An identity token, rather than a forgeable string or boolean flag. Controlled
 * server handlers must pass it via Local API `context` when creating a lead.
 */
export const INTERNAL_LEAD_CREATE_CAPABILITY = Symbol('internal-lead-create')

const canCreateLead: Access = (args) => {
  if (isAdmin(args)) return true

  return (
    args.req.payloadAPI === 'local' &&
    args.req.context.internalLeadCreateCapability === INTERNAL_LEAD_CREATE_CAPABILITY
  )
}

/** Leads are private; only CMS admins may inspect or mutate existing records. */
export const leadAccess = {
  admin: ({ req }) => Boolean(req.user),
  create: canCreateLead,
  delete: adminOnly,
  read: adminOnly,
  readVersions: adminOnly,
  unlock: adminOnly,
  update: adminOnly,
} satisfies NonNullable<CollectionConfig['access']>
