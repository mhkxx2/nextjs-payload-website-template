import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { validateProductionEnv } from '../../scripts/assert-production-env.mjs'

const execFileAsync = promisify(execFile)

const validEnvironment = {
  DATABASE_URI: 'postgresql://alrukn_app:local-development-only@127.0.0.1:5432/alrukn_furniture',
  PAYLOAD_SECRET: 'x'.repeat(32),
  NEXT_PUBLIC_SERVER_URL: 'https://alruknfurniture.ae',
  GOOGLE_PLACES_API_KEY: 'synthetic-server-places-key-never-a-real-credential',
  SMTP_FROM_EMAIL: 'website@example.com',
  SMTP_FROM_NAME: 'Al Rukn Furniture',
  SMTP_HOST: 'smtp.example.com',
  SMTP_PASS: 'smtp-password',
  SMTP_PORT: '465',
  SMTP_SECURE: 'true',
  SMTP_TO_EMAIL: 'sales@example.com',
  SMTP_USER: 'website@example.com',
}

const cliEnvironment = (overrides: Record<string, string> = {}) => {
  const environment: NodeJS.ProcessEnv = { ...process.env, ...validEnvironment, ENV_FILE: '/dev/null', ...overrides }
  delete environment.NODE_CHANNEL_FD
  for (const key of Object.keys(environment)) {
    if (key.startsWith('VITEST')) delete environment[key]
  }
  return environment
}

describe('production environment contract', () => {
  it('requires exact production variable names and canonical URL', () => {
    expect(validateProductionEnv(validEnvironment)).toEqual({
      DATABASE_URI: validEnvironment.DATABASE_URI,
      PAYLOAD_SECRET: validEnvironment.PAYLOAD_SECRET,
      NEXT_PUBLIC_SERVER_URL: new URL('https://alruknfurniture.ae'),
      GOOGLE_PLACES_API_KEY: validEnvironment.GOOGLE_PLACES_API_KEY,
      SMTP_FROM_EMAIL: validEnvironment.SMTP_FROM_EMAIL,
      SMTP_FROM_NAME: validEnvironment.SMTP_FROM_NAME,
      SMTP_HOST: validEnvironment.SMTP_HOST,
      SMTP_PASS: validEnvironment.SMTP_PASS,
      SMTP_PORT: 465,
      SMTP_SECURE: true,
      SMTP_TO_EMAIL: validEnvironment.SMTP_TO_EMAIL,
      SMTP_USER: validEnvironment.SMTP_USER,
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
    [{ ...validEnvironment, SMTP_HOST: '' }, 'SMTP_HOST'],
    [{ ...validEnvironment, GOOGLE_PLACES_API_KEY: '' }, 'GOOGLE_PLACES_API_KEY'],
    [{ ...validEnvironment, GOOGLE_PLACES_API_KEY: '   ' }, 'GOOGLE_PLACES_API_KEY'],
    [{ ...validEnvironment, SMTP_PORT: 'not-a-port' }, 'SMTP_PORT'],
    [{ ...validEnvironment, SMTP_SECURE: 'sometimes' }, 'SMTP_SECURE'],
    [{ ...validEnvironment, SMTP_FROM_EMAIL: 'not-an-email' }, 'SMTP_FROM_EMAIL'],
    [{ ...validEnvironment, SMTP_TO_EMAIL: 'not-an-email' }, 'SMTP_TO_EMAIL'],
  ])('rejects invalid production configuration', (environment, key) => {
    expect(() => validateProductionEnv(environment)).toThrow(key)
  })

  it('documents an empty server Places key in the tracked example', async () => {
    const example = await readFile(path.resolve('.env.example'), 'utf8')
    expect(example).toMatch(/^GOOGLE_PLACES_API_KEY=$/m)
    expect(example).not.toMatch(/^NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=/m)
  })

  it('does not accept a Payload field or browser key instead of the server Places key', () => {
    const { GOOGLE_PLACES_API_KEY: apiKey, ...environment } = validEnvironment
    expect(() => validateProductionEnv({
      ...environment,
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: apiKey,
      GOOGLE_MAPS_API_KEY: apiKey,
      PAYLOAD_GOOGLE_MAPS_API_KEY: apiKey,
      googleReviews: { apiKey },
    })).toThrow('GOOGLE_PLACES_API_KEY is required')
  })

  it('prints only validation status, never credential values', async () => {
    const result = await execFileAsync(process.execPath, [
      path.resolve('scripts/assert-production-env.mjs'),
    ], { env: cliEnvironment() })
    expect(result.stdout).toContain('GOOGLE_PLACES_API_KEY=valid (value redacted)')
    expect(result.stderr).toBe('')
    for (const credential of [validEnvironment.DATABASE_URI, validEnvironment.PAYLOAD_SECRET,
      validEnvironment.SMTP_PASS, validEnvironment.GOOGLE_PLACES_API_KEY]) {
      expect(result.stdout + result.stderr).not.toContain(credential)
    }
  })

  it('reports a missing Places key by name without leaking other credentials', async () => {
    await expect(execFileAsync(process.execPath, [
      path.resolve('scripts/assert-production-env.mjs'),
    ], { env: cliEnvironment({ GOOGLE_PLACES_API_KEY: '' }) }))
      .rejects.toMatchObject({ code: 1, stdout: '', stderr: 'GOOGLE_PLACES_API_KEY is required\n' })
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
