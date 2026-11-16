import type { CollectionConfig } from 'payload'

import { leadAccess } from '@/access/leadAccess'
import { denyAuditFieldWrite } from '@/fields/contentAudit'
import { auditLeadStatus } from '@/hooks/auditLeadStatus'

const denyTrustedWrite = denyAuditFieldWrite
const requiredConsent = (value: unknown) => value === true || 'Explicit consent is required.'
const validHash = (value: unknown) =>
  value == null ||
  (typeof value === 'string' && /^sha256:[a-f0-9]{64}$/.test(value)) ||
  'Abuse context must be a SHA-256 digest, not raw request data.'

export const Leads: CollectionConfig = {
  slug: 'leads',
  access: leadAccess,
  admin: {
    defaultColumns: ['fullName', 'service', 'status', 'submittedAt', 'statusUpdatedAt'],
    useAsTitle: 'fullName',
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'area', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'service', type: 'relationship', relationTo: 'services', required: true },
    { name: 'message', type: 'textarea', required: true },
    { name: 'referenceMedia', type: 'upload', relationTo: 'lead-media' },
    { name: 'portfolioItem', type: 'relationship', relationTo: 'portfolio-items' },
    { name: 'portfolioDesignTitle', type: 'text' },
    { name: 'consent', type: 'checkbox', required: true, validate: requiredConsent },
    { name: 'consentAt', type: 'date', required: true },
    { name: 'sourcePath', type: 'text', required: true },
    { name: 'sourceTitle', type: 'text', required: true },
    { name: 'projectContext', type: 'textarea' },
    { name: 'referrer', type: 'text' },
    { name: 'utmSource', type: 'text' },
    { name: 'utmMedium', type: 'text' },
    { name: 'utmCampaign', type: 'text' },
    { name: 'utmTerm', type: 'text' },
    { name: 'utmContent', type: 'text' },
    {
      name: 'status',
      type: 'select',
      access: { create: denyTrustedWrite },
      admin: { position: 'sidebar' },
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quotation sent', value: 'quotation-sent' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
      ],
      required: true,
    },
    {
      name: 'submittedAt',
      type: 'date',
      access: { create: denyTrustedWrite, update: denyTrustedWrite },
      admin: { position: 'sidebar', readOnly: true },
      index: true,
    },
    {
      name: 'statusUpdatedAt',
      type: 'date',
      access: { create: denyTrustedWrite, update: denyTrustedWrite },
      admin: { position: 'sidebar', readOnly: true },
      index: true,
    },
    {
      name: 'statusAudit',
      type: 'array',
      access: { create: denyTrustedWrite, update: denyTrustedWrite },
      admin: { readOnly: true },
      fields: [
        { name: 'from', type: 'select', options: ['new', 'contacted', 'quotation-sent', 'won', 'lost'], required: true },
        { name: 'to', type: 'select', options: ['new', 'contacted', 'quotation-sent', 'won', 'lost'], required: true },
        { name: 'changedAt', type: 'date', required: true },
        { name: 'changedBy', type: 'relationship', relationTo: 'users', required: true },
      ],
    },
    {
      name: 'abuseContextHash',
      type: 'text',
      admin: {
        description: 'Optional one-way SHA-256 digest only. Never store raw IP addresses or user-agent strings.',
      },
      validate: validHash,
    },
  ],
  hooks: { beforeChange: [auditLeadStatus] },
  timestamps: true,
}
