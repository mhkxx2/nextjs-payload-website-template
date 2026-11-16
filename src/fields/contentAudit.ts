import type { Field, FieldAccess } from 'payload'

/** Caller input is stripped before collection beforeChange hooks run. */
export const denyAuditFieldWrite: FieldAccess = () => false

export const contentAuditFields = (): Field[] => [
  {
    name: 'createdBy',
    type: 'relationship',
    access: { create: denyAuditFieldWrite, update: denyAuditFieldWrite },
    admin: { readOnly: true },
    relationTo: 'users',
  },
  {
    name: 'updatedBy',
    type: 'relationship',
    access: { create: denyAuditFieldWrite, update: denyAuditFieldWrite },
    admin: { readOnly: true },
    relationTo: 'users',
  },
]
