import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { mkdtemp } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

import { scanTemplateDemoArtifacts } from '../../scripts/assert-template-clean.mjs'

const root = process.cwd()

describe('template provenance and cleanup', () => {
  it('contains no template demo identity or records', async () => {
    expect(await scanTemplateDemoArtifacts(root)).toEqual([])
  })

  it('scans root configuration and public metadata for generated identifiers', async () => {
    const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'al-rukn-template-scan-'))
    await mkdir(path.join(fixtureRoot, 'src'), { recursive: true })
    await writeFile(
      path.join(fixtureRoot, 'package.json'),
      JSON.stringify({ description: 'Website template for Payload' }),
    )
    await writeFile(
      path.join(fixtureRoot, 'next-sitemap.config.cjs'),
      "module.exports = { siteUrl: 'https://example.com' }\n",
    )
    await writeFile(
      path.join(fixtureRoot, 'src', 'layout.tsx'),
      "export const metadata = { twitter: { creator: '@payloadcms' }, icons: '/favicon.ico' }\n",
    )

    expect(await scanTemplateDemoArtifacts(fixtureRoot)).toEqual([
      'text: next-sitemap.config.cjs -> https://example.com',
      'text: package.json -> Website template for Payload',
      'text: src/layout.tsx -> /favicon.ico',
      "text: src/layout.tsx -> creator: '@payloadcms'",
    ])
  })

  it('ships a safe PostgreSQL example environment using the required variable names', async () => {
    const source = await readFile(path.join(root, '.env.example'), 'utf8')
    const declarations = await readFile(path.join(root, 'src/environment.d.ts'), 'utf8')
    const payloadConfig = await readFile(path.join(root, 'src/payload.config.ts'), 'utf8')

    expect(source).toContain('DATABASE_URI=postgresql://')
    expect(source).toContain('PAYLOAD_SECRET=replace-with-')
    expect(source).toContain('NEXT_PUBLIC_SERVER_URL=https://alruknfurniture.ae')
    expect(source).toContain('PREVIEW_SECRET=replace-with-a-separate-random-secret')
    expect(source).toContain('REVALIDATION_SECRET=replace-with-a-separate-random-secret')
    expect(source).not.toMatch(/mongodb|DATABASE_URL=|CRON_SECRET=/i)
    expect(declarations).toContain('DATABASE_URI: string')
    expect(declarations).not.toContain('DATABASE_URL')
    expect(payloadConfig).toContain('process.env.DATABASE_URI')
    expect(payloadConfig).not.toContain('process.env.DATABASE_URL')
  })

  it('provisions only a local PostgreSQL development service', async () => {
    const source = await readFile(path.join(root, 'docker-compose.yml'), 'utf8')

    expect(source).toMatch(/postgres:\s*\n\s*image: postgres:/)
    expect(source).toContain(
      'DATABASE_URI: postgresql://alrukn_app:local-development-only@postgres:5432/alrukn_furniture',
    )
    expect(source).toContain('POSTGRES_PASSWORD: local-development-only')
    expect(source).not.toMatch(/mongo/i)
  })

  it('references the repository-owned SVG favicon without a missing ICO request', async () => {
    const layout = await readFile(path.join(root, 'src/app/(frontend)/layout.tsx'), 'utf8')
    const favicon = await readFile(path.join(root, 'public/favicon.svg'), 'utf8')

    expect(layout).toContain('href="/favicon.svg"')
    expect(layout).not.toContain('/favicon.ico')
    expect(favicon).toContain('<svg')
  })
})
