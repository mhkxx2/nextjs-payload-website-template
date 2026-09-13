#!/usr/bin/env node

import { existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import dotenv from 'dotenv'

const CANONICAL_PRODUCTION_URL = 'https://alruknfurniture.ae/'
const REQUIRED_KEYS = ['DATABASE_URI', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SERVER_URL']

const requireString = (env, key) => {
  const value = env[key]
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${key} is required`)
  }
  return value
}

export const validateProductionEnv = (env) => {
  const DATABASE_URI = requireString(env, 'DATABASE_URI')
  const PAYLOAD_SECRET = requireString(env, 'PAYLOAD_SECRET')
  const serverURL = requireString(env, 'NEXT_PUBLIC_SERVER_URL')

  let databaseURL
  try {
    databaseURL = new URL(DATABASE_URI)
  } catch {
    throw new Error('DATABASE_URI must be a valid PostgreSQL URI')
  }

  if (
    databaseURL.protocol !== 'postgresql:' ||
    databaseURL.pathname !== '/alrukn_furniture' ||
    !databaseURL.username ||
    !databaseURL.password
  ) {
    throw new Error(
      'DATABASE_URI must use PostgreSQL credentials and database alrukn_furniture',
    )
  }

  if (
    PAYLOAD_SECRET.length < 32 ||
    /\s/.test(PAYLOAD_SECRET) ||
    /^replace[-_]/i.test(PAYLOAD_SECRET)
  ) {
    throw new Error('PAYLOAD_SECRET must contain at least 32 non-placeholder characters')
  }

  let NEXT_PUBLIC_SERVER_URL
  try {
    NEXT_PUBLIC_SERVER_URL = new URL(serverURL)
  } catch {
    throw new Error('NEXT_PUBLIC_SERVER_URL must be a valid URL')
  }

  if (NEXT_PUBLIC_SERVER_URL.href !== CANONICAL_PRODUCTION_URL) {
    throw new Error(`NEXT_PUBLIC_SERVER_URL must be ${CANONICAL_PRODUCTION_URL}`)
  }

  return { DATABASE_URI, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL }
}

const run = () => {
  const envFile = process.env.ENV_FILE || path.resolve('.env')
  if (existsSync(envFile)) dotenv.config({ path: envFile, override: false, quiet: true })

  try {
    validateProductionEnv(process.env)
    for (const key of REQUIRED_KEYS) console.log(`${key}=valid (value redacted)`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) run()
