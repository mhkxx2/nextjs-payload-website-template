import { readFileSync } from 'node:fs'

import dotenv from 'dotenv'
import { Client } from 'pg'
import { describe, expect, it } from 'vitest'

const envFile = process.env.ENV_FILE || '/etc/alruknfurniture/.env'

try {
  const runtimeEnvironment = dotenv.parse(readFileSync(envFile))
  if (runtimeEnvironment.DATABASE_URI) Object.assign(process.env, runtimeEnvironment)
} catch {
  // The assertion below reports the missing runtime contract clearly.
}

describe('PostgreSQL runtime', () => {
  it('connects as the least-privilege application role', async () => {
    expect(process.env.DATABASE_URI, `DATABASE_URI must be available via ${envFile}`).toBeTruthy()

    const client = new Client({ connectionString: process.env.DATABASE_URI })
    await client.connect()

    try {
      const result = await client.query<{
        bypasses_row_security: boolean
        can_create_database: boolean
        can_create_role: boolean
        can_replicate: boolean
        current_database: string
        current_user: string
        is_superuser: boolean
        server_address: string
      }>(`
        SELECT
          current_user,
          current_database(),
          rolsuper AS is_superuser,
          rolcreatedb AS can_create_database,
          rolcreaterole AS can_create_role,
          rolreplication AS can_replicate,
          rolbypassrls AS bypasses_row_security,
          host(inet_server_addr()) AS server_address
        FROM pg_roles
        WHERE rolname = current_user
      `)

      expect(result.rows).toEqual([
        {
          bypasses_row_security: false,
          can_create_database: false,
          can_create_role: false,
          can_replicate: false,
          current_database: 'alrukn_furniture',
          current_user: 'alrukn_app',
          is_superuser: false,
          server_address: '127.0.0.1',
        },
      ])
    } finally {
      await client.end()
    }
  })
})
