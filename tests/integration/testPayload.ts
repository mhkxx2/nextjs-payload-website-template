import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'

import dotenv from 'dotenv'
import { getPayload, type Payload } from 'payload'
import { Client } from 'pg'

const envFile = process.env.ENV_FILE || '/etc/alruknfurniture/.env'
const safeIdentifier = /^[a-z][a-z0-9_]*$/

export type IsolatedPayload = {
  destroy: () => Promise<void>
  payload: Payload
}

/**
 * Boot Payload against a fresh schema selected through PostgreSQL search_path.
 * This keeps development schema push away from the shared public schema and
 * makes its create-only diff non-interactive.
 */
export async function startIsolatedPayload(suite: string): Promise<IsolatedPayload> {
  Object.assign(process.env, dotenv.parse(readFileSync(envFile)))
  process.env.PAYLOAD_SECRET ||= 'task-5-integration-test-secret-at-least-32-characters'

  const databaseURI = process.env.DATABASE_URI
  if (!databaseURI) throw new Error('DATABASE_URI is required for integration tests.')

  const normalizedSuite = suite.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  const schema = `task5_${normalizedSuite}_${randomUUID().replaceAll('-', '')}`
  if (!safeIdentifier.test(schema)) throw new Error('Generated an unsafe test schema identifier.')

  const adminClient = new Client({ connectionString: databaseURI })
  await adminClient.connect()
  await adminClient.query(`CREATE SCHEMA "${schema}"`)
  await adminClient.end()

  const isolatedURI = new URL(databaseURI)
  isolatedURI.searchParams.set('options', `-csearch_path=${schema}`)
  process.env.DATABASE_URI = isolatedURI.toString()
  process.env.PAYLOAD_TEST_SCHEMA = schema

  let payload: Payload | undefined
  try {
    const { default: config } = await import('@/payload.config')
    payload = await getPayload({ config })
  } catch (error) {
    process.env.DATABASE_URI = databaseURI
    delete process.env.PAYLOAD_TEST_SCHEMA
    const cleanupClient = new Client({ connectionString: databaseURI })
    await cleanupClient.connect()
    await cleanupClient.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
    await cleanupClient.end()
    throw error
  }

  return {
    payload,
    destroy: async () => {
      try {
        await payload.destroy()
      } finally {
        process.env.DATABASE_URI = databaseURI
        delete process.env.PAYLOAD_TEST_SCHEMA
        const cleanupClient = new Client({ connectionString: databaseURI })
        await cleanupClient.connect()
        await cleanupClient.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
        await cleanupClient.end()
      }
    },
  }
}
