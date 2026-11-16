import type { FieldAccess } from 'payload'

export const authenticatedField: FieldAccess = ({ req }) => Boolean(req.user)
