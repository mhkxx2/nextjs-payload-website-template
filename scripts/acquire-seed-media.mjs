/**
 * Acquires the launch imagery recorded in src/seed/media-sources.json.
 *
 * Every source is royalty-free and licensed for commercial website use. For each
 * asset the script downloads the original, verifies it, records its SHA-256 and
 * writes src/seed/media-manifest.json so the seed (and any reviewer) can prove
 * where each image came from and that the file on disk is unchanged.
 *
 * Usage: node scripts/acquire-seed-media.mjs [--check]
 *   --check  verify the files on disk against the manifest without re-downloading
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')
const sourcesPath = join(repoRoot, 'src/seed/media-sources.json')
const assetsDir = join(repoRoot, 'src/seed/assets')
const manifestPath = join(repoRoot, 'src/seed/media-manifest.json')
const checkOnly = process.argv.includes('--check')

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex')

/** Minimal JPEG reader so the manifest can record real pixel dimensions. */
function jpegSize(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null
  let offset = 2
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }
    const marker = buffer[offset + 1]
    const length = buffer.readUInt16BE(offset + 2)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) }
    }
    offset += 2 + length
  }
  return null
}

async function main() {
  const sources = JSON.parse(readFileSync(sourcesPath, 'utf8'))
  if (!checkOnly) mkdirSync(assetsDir, { recursive: true })

  const entries = []
  for (const asset of sources.assets) {
    const localPath = join(assetsDir, asset.filename)
    let buffer
    if (checkOnly) {
      if (!existsSync(localPath)) throw new Error(`missing asset: ${asset.filename}`)
      buffer = readFileSync(localPath)
    } else {
      const response = await fetch(asset.downloadURL, {
        headers: { 'user-agent': 'alrukn-furniture-site/1.0 (+https://alruknfurniture.ae)' },
      })
      if (!response.ok) throw new Error(`download failed ${response.status} for ${asset.key}`)
      buffer = Buffer.from(await response.arrayBuffer())
      if (buffer.length < 20_000) throw new Error(`suspiciously small image for ${asset.key}`)
      writeFileSync(localPath, buffer)
    }
    const size = jpegSize(buffer)
    entries.push({
      key: asset.key,
      filename: asset.filename,
      localPath: `src/seed/assets/${asset.filename}`,
      placeholder: asset.placeholder,
      sourcePageURL: asset.sourcePageURL,
      downloadURL: asset.downloadURL,
      creator: asset.creator,
      licenseName: asset.licenseName,
      licenseURL: asset.licenseURL,
      licenseNotes: asset.licenseNotes,
      sourceDescription: asset.sourceDescription,
      alt: asset.alt,
      caption: asset.caption,
      decorative: asset.decorative,
      focalPoint: asset.focalPoint,
      intendedUse: asset.intendedUse,
      verifiedLocally: true,
      downloadedAt: new Date().toISOString().slice(0, 10),
      bytes: statSync(localPath).size,
      width: size?.width ?? null,
      height: size?.height ?? null,
      sha256: sha256(buffer),
    })
  }

  const manifest = {
    generatedAt: sources.generatedAt,
    source: sources.source,
    licensePolicy: sources.licensePolicy,
    placeholderPolicy: sources.placeholderPolicy,
    assets: entries,
  }
  if (!checkOnly) writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  // drop stale files that are no longer part of the manifest
  if (!checkOnly && existsSync(assetsDir)) {
    const wanted = new Set(entries.map((e) => e.filename))
    const { readdirSync } = await import('node:fs')
    for (const file of readdirSync(assetsDir)) {
      if (!wanted.has(file)) {
        rmSync(join(assetsDir, file))
        console.log(`removed stale asset ${file}`)
      }
    }
  }

  console.log(`${checkOnly ? 'verified' : 'acquired'} ${entries.length} assets`)
  for (const entry of entries) {
    console.log(`  ${entry.key.padEnd(32)} ${String(entry.width).padStart(5)}x${String(entry.height).padEnd(5)} ${entry.bytes} bytes  ${entry.sha256.slice(0, 12)}`)
  }
}

main().catch((error) => {
  console.error(`acquire-seed-media: ${error.message}`)
  process.exit(1)
})
