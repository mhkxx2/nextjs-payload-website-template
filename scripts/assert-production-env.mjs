#!/usr/bin/env node

import { existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import dotenv from 'dotenv'

const CANONICAL_PRODUCTION_URL = 'https://alruknfurniture.ae/'
const REQUIRED_KEYS = [
  'DATABASE_URI',
  'PAYLOAD_SECRET',
  'NEXT_PUBLIC_SERVER_URL',
  'GOOGLE_PLACES_API_KEY',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM_EMAIL',
  'SMTP_FROM_NAME',
  'SMTP_TO_EMAIL',
]

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
  const GOOGLE_PLACES_API_KEY = requireString(env, 'GOOGLE_PLACES_API_KEY').trim()
  const SMTP_HOST = requireString(env, 'SMTP_HOST')
  const smtpPortValue = requireString(env, 'SMTP_PORT')
  const smtpSecureValue = requireString(env, 'SMTP_SECURE')
  const SMTP_USER = requireString(env, 'SMTP_USER')
  const SMTP_PASS = requireString(env, 'SMTP_PASS')
  const SMTP_FROM_EMAIL = requireString(env, 'SMTP_FROM_EMAIL')
  const SMTP_FROM_NAME = requireString(env, 'SMTP_FROM_NAME')
  const SMTP_TO_EMAIL = requireString(env, 'SMTP_TO_EMAIL')

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

  const SMTP_PORT = Number(smtpPortValue)
  if (!Number.isInteger(SMTP_PORT) || SMTP_PORT < 1 || SMTP_PORT > 65535) {
    throw new Error('SMTP_PORT must be an integer from 1 to 65535')
  }

  if (smtpSecureValue !== 'true' && smtpSecureValue !== 'false') {
    throw new Error('SMTP_SECURE must be true or false')
  }
  const SMTP_SECURE = smtpSecureValue === 'true'

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(SMTP_FROM_EMAIL)) throw new Error('SMTP_FROM_EMAIL must be an email address')
  if (!emailPattern.test(SMTP_TO_EMAIL)) throw new Error('SMTP_TO_EMAIL must be an email address')

  return {
    DATABASE_URI,
    PAYLOAD_SECRET,
    NEXT_PUBLIC_SERVER_URL,
    GOOGLE_PLACES_API_KEY,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM_EMAIL,
    SMTP_FROM_NAME,
    SMTP_TO_EMAIL,
  }
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
