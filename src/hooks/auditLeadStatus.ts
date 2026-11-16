import type { CollectionBeforeChangeHook } from 'payload'

export type LeadStatus = 'contacted' | 'lost' | 'new' | 'quotation-sent' | 'won'

type AuditEntry = {
  changedAt: string
  changedBy: number | string
  from: LeadStatus
  to: LeadStatus
}

const transitions: Record<LeadStatus, readonly LeadStatus[]> = {
  contacted: ['quotation-sent'],
  lost: [],
  new: ['contacted'],
  'quotation-sent': ['won', 'lost'],
  won: [],
}

const relationID = (value: unknown): number | string | undefined =>
  typeof value === 'object' && value !== null && 'id' in value
    ? (value as { id?: unknown }).id as number | string | undefined
    : typeof value === 'number' || typeof value === 'string'
      ? value
      : undefined

const asStatus = (value: unknown): LeadStatus | undefined =>
  value === 'new' ||
  value === 'contacted' ||
  value === 'quotation-sent' ||
  value === 'won' ||
  value === 'lost'
    ? value
    : undefined

const existingAudit = (value: unknown): AuditEntry[] => (Array.isArray(value) ? (value as AuditEntry[]) : [])

/** The sole trusted writer for lead state, timestamps, and accountable transition history. */
export const auditLeadStatus: CollectionBeforeChangeHook = ({ data, operation, originalDoc, req }) => {
  const next = { ...data }
  const now = new Date().toISOString()

  if (operation === 'create') {
    next.status = 'new'
    next.statusAudit = []
    next.submittedAt = now
    next.statusUpdatedAt = now
    return next
  }

  const from = asStatus(originalDoc?.status)
  if (!from) throw new Error('The existing lead has an invalid status.')
  const to = asStatus(next.status) ?? from

  next.statusAudit = existingAudit(originalDoc?.statusAudit)
  next.submittedAt = originalDoc?.submittedAt
  next.statusUpdatedAt = originalDoc?.statusUpdatedAt

  if (to === from) {
    next.status = from
    return next
  }

  const changedBy = relationID(req.user)
  if (changedBy == null) {
    throw new Error('An authenticated staff actor is required to change lead status.')
  }
  if (!transitions[from].includes(to)) {
    throw new Error(`Illegal lead status transition from “${from}” to “${to}”.`)
  }

  next.status = to
  next.statusUpdatedAt = now
  next.statusAudit = [
    ...existingAudit(originalDoc?.statusAudit),
    { changedAt: now, changedBy, from, to },
  ]
  return next
}

export const legalLeadTransitions = transitions
