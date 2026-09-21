import { readFileSync } from 'node:fs'

import dotenv from 'dotenv'
import { getPayload, type Payload } from 'payload'

import { removeSeedBatch, seedAlRukn } from '@/seed'

/**
 * Seeds the Al Rukn launch experience.
 *
 * Usage:
 *   pnpm seed                 # create anything that is missing, refresh untouched seed records
 *   SEED_FORCE=true pnpm seed # also overwrite records an editor has changed (never in production)
 *   pnpm seed --rollback <batchId>
 *
 * The first run needs an uploader for the media library. Set SEED_ADMIN_EMAIL
 * and SEED_ADMIN_PASSWORD to create the first admin user, or SEED_UPLOADED_BY to
 * reuse an existing user id. Credentials are never logged.
 */

const envFile = process.env.ENV_FILE || '/etc/alruknfurniture/.env'

try {
  Object.assign(process.env, dotenv.parse(readFileSync(envFile)))
} catch {
  // Local runs may export the environment directly instead of using ENV_FILE.
}

const args = process.argv.slice(2)
const flag = (name: string): boolean => args.includes(`--${name}`)
const option = (name: string): string | undefined => {
  const index = args.indexOf(`--${name}`)
  if (index >= 0) return args[index + 1]
  const inline = args.find((argument) => argument.startsWith(`--${name}=`))
  return inline?.slice(name.length + 3)
}

const force = flag('force') || process.env.SEED_FORCE === 'true'
const rollback = option('rollback')

const resolveUploader = async (payload: Payload): Promise<number> => {
  const override = process.env.SEED_UPLOADED_BY
  if (override) {
    const parsed = Number(override)
    if (!Number.isFinite(parsed)) {
      throw new Error('SEED_UPLOADED_BY must be a numeric user id.')
    }
    return parsed
  }

  const existing = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    sort: 'createdAt',
  })

  const firstUser = existing.docs[0]
  if (firstUser) return firstUser.id

  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error(
      'No user exists yet. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (first run only) or SEED_UPLOADED_BY, then run the seed again.',
    )
  }

  const created = await payload.create({
    collection: 'users',
    data: { email, password, name: 'Al Rukn admin' },
    overrideAccess: true,
  })

  payload.logger.info(`seed: created the first admin user ${email} (password read from SEED_ADMIN_PASSWORD, not logged)`)

  return created.id
}

if (!process.env.DATABASE_URI) {
  throw new Error(`DATABASE_URI is not set. Expected it in ${envFile} or the environment.`)
}

const { default: config } = await import('@/payload.config')
const payload = await getPayload({ config })

try {
  if (rollback) {
    const outcome = await removeSeedBatch(payload, rollback)
    payload.logger.info(
      `seed: rollback ${rollback} → deleted ${outcome.deleted}, retained ${outcome.retained} (changed since the seed run)`,
    )
  } else {
    const result = await seedAlRukn(payload, {
      uploadedBy: await resolveUploader(payload),
      force,
    })

    payload.logger.info(
      `seed: batch ${result.batchId} → created ${result.created}, updated ${result.updated}, skipped ${result.skipped}, services ${Object.keys(result.services).length}, faqs ${result.faqs.length}, pages ${Object.keys(result.pages).length}`,
    )
  }
} finally {
  payload.logger.info('seed: closing the database pool')
  await payload.destroy()
  payload.logger.info('seed: done')
}

// The CLI is a one-shot process: once the pool is closed the job is over, and any
// handle Payload kept open (monitoring, image pipeline) must not hold the shell that
// runs `pnpm seed && pnpm seed` hostage.
process.exit(process.exitCode ?? 0)
