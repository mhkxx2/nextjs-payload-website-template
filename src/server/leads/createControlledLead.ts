import type { Payload, RequiredDataFromCollectionSlug } from 'payload'

import { INTERNAL_LEAD_CREATE_CAPABILITY } from '@/access/leadAccess'
import type { Lead } from '@/payload-types'

export type ControlledLeadCreateOptions<TData> = {
  collection: 'leads'
  context: {
    internalLeadCreateCapability: typeof INTERNAL_LEAD_CREATE_CAPABILITY
  }
  data: TData
  overrideAccess: false
}

type ControlledLeadPayload<TData, TResult> = {
  create: (options: ControlledLeadCreateOptions<TData>) => Promise<TResult>
}

/**
 * The only supported Local API entry point for unauthenticated lead creation.
 *
 * Keep this module under `src/server`: callers cannot separate access checking
 * from the module-identity capability required by `leadAccess.create`.
 */
export function createControlledLead<TData, TResult>(
  payload: ControlledLeadPayload<TData, TResult>,
  data: TData,
): Promise<TResult>
export function createControlledLead(
  payload: Payload,
  data: RequiredDataFromCollectionSlug<'leads'>,
): Promise<Lead>
export function createControlledLead(
  payload: Payload | ControlledLeadPayload<unknown, unknown>,
  data: unknown,
): Promise<Lead> | Promise<unknown> {
  const create = payload.create as unknown as ControlledLeadPayload<unknown, unknown>['create']
  return create({
    collection: 'leads',
    context: {
      internalLeadCreateCapability: INTERNAL_LEAD_CREATE_CAPABILITY,
    },
    data,
    overrideAccess: false,
  })
}
