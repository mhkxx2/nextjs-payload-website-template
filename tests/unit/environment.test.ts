import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

import { validateProductionEnv } from '../../scripts/assert-production-env.mjs'

const execFileAsync = promisify(execFile)

const validEnvironment = {
  DATABASE_URI: 'postgresql://alrukn_app:local-development-only@127.0.0.1:5432/alrukn_furniture',
  PAYLOAD_SECRET: 'x'.repeat(32),
  NEXT_PUBLIC_SERVER_URL: 'https://alruknfurniture.ae',
}

describe('production environment contract', () => {
  it('requires exact production variable names and canonical URL', () => {
    expect(validateProductionEnv(validEnvironment)).toEqual({
      DATABASE_URI: validEnvironment.DATABASE_URI,
      PAYLOAD_SECRET: validEnvironment.PAYLOAD_SECRET,
      NEXT_PUBLIC_SERVER_URL: new URL('https://alruknfurniture.ae'),
    })
  })

  it.each([
    [{ ...validEnvironment, DATABASE_URI: 'mongodb://127.0.0.1/alrukn_furniture' }, 'DATABASE_URI'],
    [
      {
        ...validEnvironment,
        DATABASE_URI: 'postgresql://alrukn_app:password@127.0.0.1:5432/wrong_database',
      },
      'DATABASE_URI',
    ],
    [{ ...validEnvironment, PAYLOAD_SECRET: 'short' }, 'PAYLOAD_SECRET'],
    [{ ...validEnvironment, PAYLOAD_SECRET: `x${' '.repeat(31)}` }, 'PAYLOAD_SECRET'],
    [
      { ...validEnvironment, PAYLOAD_SECRET: 'replace-with-at-least-32-random-characters' },
      'PAYLOAD_SECRET',
    ],
    [
      { ...validEnvironment, NEXT_PUBLIC_SERVER_URL: 'https://www.alruknfurniture.ae' },
      'NEXT_PUBLIC_SERVER_URL',
    ],
  ])('rejects invalid production configuration', (environment, key) => {
    expect(() => validateProductionEnv(environment)).toThrow(key)
  })

  it('ignores secret-bearing environment files but tracks the example contract', async () => {
    const ignored = await execFileAsync('git', [
      'check-ignore',
      '--no-index',
      '.env',
      '.env.local',
      '.env.production',
    ])

    expect(ignored.stdout.trim().split('\n')).toEqual(['.env', '.env.local', '.env.production'])

    await expect(
      execFileAsync('git', ['check-ignore', '--no-index', '.env.example']),
    ).rejects.toMatchObject({ code: 1 })
  })

  it('ignores repository-local backup and runtime artifact directories', async () => {
    const ignored = await execFileAsync('git', [
      'check-ignore',
      '--no-index',
      'backup/database.sql',
      'backups/media.tar.gz',
      '.next/standalone/server.js',
      'public/media/upload.webp',
      'test-results/results.json',
    ])

    expect(ignored.stdout.trim().split('\n')).toEqual([
      'backup/database.sql',
      'backups/media.tar.gz',
      '.next/standalone/server.js',
      'public/media/upload.webp',
      'test-results/results.json',
    ])
  })
})
