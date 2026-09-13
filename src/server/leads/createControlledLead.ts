import { INTERNAL_LEAD_CREATE_CAPABILITY } from '@/access/leadAccess'

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
): Promise<TResult> {
  return payload.create({
    collection: 'leads',
    context: {
      internalLeadCreateCapability: INTERNAL_LEAD_CREATE_CAPABILITY,
    },
    data,
    overrideAccess: false,
  })
}
