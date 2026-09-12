import { access, readFile, readdir } from 'node:fs/promises'
import { constants } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const demoPaths = [
  'public/favicon.ico',
  'public/website-template-OG.webp',
  'src/app/(frontend)/next/seed/route.ts',
  'src/components/BeforeDashboard/SeedButton',
  'src/endpoints/seed',
]

const demoStrings = [
  'Payload Website Template',
  'Demo Author',
  'demo-author@example.com',
  'demo-author@payloadcms.com',
  'website-template-OG.webp',
  'payload-logo-light.svg',
  'image-post1.webp',
  'image-post2.webp',
  'image-post3.webp',
  'image-hero1.webp',
  'seed database',
]

const textExtensions = new Set(['.cjs', '.css', '.html', '.js', '.json', '.jsx', '.md', '.mjs', '.scss', '.svg', '.ts', '.tsx'])

async function exists(file) {
  try {
    await access(file, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function collectTextFiles(entry) {
  if (!(await exists(entry))) return []
  const statEntries = await readdir(entry, { withFileTypes: true })
  const files = []
  for (const item of statEntries) {
    const target = path.join(entry, item.name)
    if (item.isDirectory()) files.push(...(await collectTextFiles(target)))
    else if (textExtensions.has(path.extname(item.name))) files.push(target)
  }
  return files
}

export async function scanTemplateDemoArtifacts(root) {
  const findings = []

  for (const relativePath of demoPaths) {
    if (await exists(path.join(root, relativePath))) findings.push(`path: ${relativePath}`)
  }

  const roots = ['public', 'src', 'tests']
  const files = (await Promise.all(roots.map((entry) => collectTextFiles(path.join(root, entry))))).flat()
  if (await exists(path.join(root, 'README.md'))) files.push(path.join(root, 'README.md'))

  for (const file of files.sort()) {
    const source = await readFile(file, 'utf8')
    const relativePath = path.relative(root, file)
    for (const needle of demoStrings) {
      if (source.toLowerCase().includes(needle.toLowerCase())) {
        findings.push(`text: ${relativePath} -> ${needle}`)
      }
    }
  }

  return findings.sort()
}

async function main() {
  const findings = await scanTemplateDemoArtifacts(process.cwd())
  if (findings.length) {
    console.error(`${findings.length} demo artifact(s) found:`)
    for (const finding of findings) console.error(`- ${finding}`)
    process.exitCode = 1
    return
  }
  console.log('0 demo artifacts')
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main()
