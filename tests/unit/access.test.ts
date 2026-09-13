import type { Access, PayloadRequest } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { adminOnly } from '@/access/adminOnly'
import { adminOrPublished } from '@/access/adminOrPublished'
import {
  INTERNAL_LEAD_CREATE_CAPABILITY,
  leadAccess,
} from '@/access/leadAccess'
import { Users } from '@/collections/Users'

type LeadOperation = 'create' | 'delete' | 'read' | 'readVersions' | 'unlock' | 'update'
type Role = 'anonymous' | 'editor'

const user = { id: 1, collection: 'users', email: 'editor@example.com' }

function accessArgs(
  role: Role,
  options: {
    capability?: unknown
    payloadAPI?: PayloadRequest['payloadAPI']
  } = {},
): Parameters<Access>[0] {
  return {
    req: {
      context:
        options.capability === undefined
          ? {}
          : { internalLeadCreateCapability: options.capability },
      payloadAPI: options.payloadAPI ?? 'REST',
      user: role === 'editor' ? user : null,
    } as PayloadRequest,
  }
}

function runLeadAccess(role: Role, operation: LeadOperation): unknown {
  const policy = leadAccess?.[operation]
  if (!policy) throw new Error(`Missing lead ${operation} policy`)
  return policy(accessArgs(role))
}

describe('access policies', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-12T12:00:00.000Z'))
  })

  it('treats authenticated Payload users as admins and denies anonymous users', () => {
    expect(adminOnly(accessArgs('anonymous'))).toBe(false)
    expect(adminOnly(accessArgs('editor'))).toBe(true)
  })

  it('returns a publication and date query for anonymous public reads, never true', () => {
    expect(adminOrPublished(accessArgs('anonymous'))).toEqual({
      and: [
        { status: { equals: 'published' } },
        { publishedAt: { less_than_equal: '2026-09-12T12:00:00.000Z' } },
      ],
    })
    expect(adminOrPublished(accessArgs('editor'))).toBe(true)
  })

  it.each([
    ['anonymous', 'read', false],
    ['anonymous', 'create', false],
    ['anonymous', 'delete', false],
    ['anonymous', 'readVersions', false],
    ['anonymous', 'unlock', false],
    ['anonymous', 'update', false],
    ['editor', 'read', true],
    ['editor', 'create', true],
    ['editor', 'delete', true],
    ['editor', 'readVersions', true],
    ['editor', 'unlock', true],
    ['editor', 'update', true],
  ] as const)('%s lead %s => %s', (role, operation, allowed) => {
    expect(runLeadAccess(role, operation)).toBe(allowed)
  })

  it('grants only local lead creation when the unforgeable internal capability is supplied', () => {
    const localCapableRequest = accessArgs('anonymous', {
      capability: INTERNAL_LEAD_CREATE_CAPABILITY,
      payloadAPI: 'local',
    })

    expect(leadAccess?.create?.(localCapableRequest)).toBe(true)
    expect(
      leadAccess?.create?.(
        accessArgs('anonymous', {
          capability: INTERNAL_LEAD_CREATE_CAPABILITY,
          payloadAPI: 'REST',
        }),
      ),
    ).toBe(false)
    expect(
      leadAccess?.create?.(
        accessArgs('anonymous', { capability: Symbol('forged'), payloadAPI: 'local' }),
      ),
    ).toBe(false)
    expect(leadAccess?.read?.(localCapableRequest)).toBe(false)
    expect(leadAccess?.update?.(localCapableRequest)).toBe(false)
  })

  it('keeps Users registration private and provides a deny-by-default privilege policy', () => {
    const create = Users.access?.create
    if (!create) throw new Error('Users create access is not configured')

    expect(create(accessArgs('anonymous'))).toBe(false)
    expect(adminOnly(accessArgs('anonymous'))).toBe(false)
    expect(adminOnly(accessArgs('editor'))).toBe(true)
  })
})
