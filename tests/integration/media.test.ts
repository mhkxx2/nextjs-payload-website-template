// @vitest-environment node

import { randomUUID } from 'node:crypto'

import type { Media, User } from '@/payload-types'
import { type Payload, UnauthorizedError } from 'payload'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { type IsolatedPayload, startIsolatedPayload } from './testPayload'

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024
// Locally generated 8×6 HEVC/HEIF fixture with `avif` written into ftyp's minor_version.
const HEVC_HEIF_WITH_AVIF_MINOR_VERSION = Buffer.from(
  'AAAAHGZ0eXBoZWljYXZpZm1pZjFoZWljbWlhZgAAAX1tZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAGhAAEAAAAAAAAAKgAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGh2YzEAAAAA/WlwcnAAAADdaXBjbwAAAHZodmNDAQNwAAAAAAAAAAAAHvAA/P34+AAADwMgAAEAGEABDAH//wNwAAADAJAAAAMAAAMAHroCQCEAAQAqQgEBA3AAAAMAkAAAAwAAAwAeoCCBBZbqrprm4CGgwIAAAAMAgAAAAwCEIgABAAZEAcFzwYkAAAAUaXNwZQAAAAAAAABAAAAAQAAAAChjbGFwAAAACAAAAAEAAAAGAAAAAf///8gAAAAC////xgAAAAIAAAATY29scm5jbHgAAQANAAaAAAAAEHBpeGkAAAAAAwgICAAAABhpcG1hAAAAAAAAAAEAAQWBAoMEBQAAADJtZGF0AAAAJigBr1IV5STm/Oq//HV/94SQwQUyJUegpEpbLaqAllpuq1CLS2yz',
  'base64',
)
const createdMediaIDs: Array<number | string> = []
let isolatedPayload: IsolatedPayload
let payload: Payload
let admin: User

const formats = [
  ['jpeg', 'image/jpeg', 'jpg'],
  ['png', 'image/png', 'png'],
  ['webp', 'image/webp', 'webp'],
  ['avif', 'image/avif', 'avif'],
] as const

type ImageFormat = (typeof formats)[number][0]

async function imageBuffer(format: ImageFormat): Promise<Buffer> {
  const image = sharp({
    create: { background: '#967259', channels: 3, height: 6, width: 8 },
  })
  return image[format]().toBuffer()
}

async function upload({
  alt = 'Walnut furniture detail',
  decorative = false,
  extension = 'png',
  license = 'CC0 1.0 Universal',
  mimetype = 'image/png',
  sourceURL = 'https://media-source.invalid/task-5-fixture',
  buffer,
}: {
  alt?: string
  buffer: Buffer
  decorative?: boolean
  extension?: string
  license?: string
  mimetype?: string
  sourceURL?: string
}): Promise<Media> {
  return payload.create({
    collection: 'media',
    data: {
      alt,
      decorative,
      focalX: 25,
      focalY: 75,
      license,
      sourceNotes: 'Task 5 integration fixture generated locally.',
      sourceURL,
      uploadedBy: admin.id,
    },
    draft: false,
    file: {
      data: buffer,
      mimetype,
      name: `../../unsafe name-${randomUUID()}.${extension}`,
      size: buffer.length,
    },
    overrideAccess: false,
    user: admin,
  })
}

beforeAll(async () => {
  isolatedPayload = await startIsolatedPayload('media')
  payload = isolatedPayload.payload
  admin = await payload.create({
    collection: 'users',
    data: {
      email: `task-5-media-${randomUUID()}@example.invalid`,
      name: 'Task 5 media administrator',
      password: randomUUID(),
    },
    overrideAccess: true,
  })
}, 60_000)

afterAll(async () => {
  for (const id of createdMediaIDs) {
    await payload.delete({ collection: 'media', id, overrideAccess: true }).catch(() => undefined)
  }
  if (admin?.id) {
    await payload.delete({ collection: 'users', id: admin.id, overrideAccess: true }).catch(() => undefined)
  }
  await isolatedPayload?.destroy()
}, 60_000)

describe('secured Media uploads', () => {
  it('enforces informative/decorative alt text and launch provenance', async () => {
    const png = await imageBuffer('png')

    await expect(upload({ alt: '   ', buffer: png })).rejects.toThrow()
    await expect(upload({ alt: 'Visible text is forbidden', buffer: png, decorative: true })).rejects.toThrow()

    await expect(upload({ buffer: png, license: '' })).rejects.toThrow()
    await expect(upload({ buffer: png, sourceURL: '' })).rejects.toThrow()
    await expect(upload({ buffer: png, sourceURL: 'http://media-source.invalid/insecure' })).rejects.toThrow()
  })

  it.each([
    ['SVG', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>'), 'image/svg+xml', 'svg'],
    ['executable', Buffer.from('MZ\u0090\u0000task-5'), 'image/jpeg', 'jpg'],
    ['spoofed MIME', Buffer.from('\u0089PNG\r\n\u001a\nspoof'), 'image/jpeg', 'jpg'],
  ])('rejects %s content', async (_label, buffer, mimetype, extension) => {
    await expect(upload({ buffer, extension, mimetype })).rejects.toThrow()
  })

  it('rejects appended polyglots, malformed/truncated images, and files over 12 MB', async () => {
    const jpeg = await imageBuffer('jpeg')
    const polyglot = Buffer.concat([jpeg, Buffer.from('\nMZ executable payload')])

    await expect(upload({ buffer: polyglot, extension: 'jpg', mimetype: 'image/jpeg' })).rejects.toThrow()
    await expect(
      upload({ buffer: jpeg.subarray(0, Math.floor(jpeg.length / 2)), extension: 'jpg', mimetype: 'image/jpeg' }),
    ).rejects.toThrow()

    const oversized = Buffer.alloc(MAX_UPLOAD_BYTES + 1)
    oversized[0] = 0xff
    oversized[1] = 0xd8
    oversized[oversized.length - 2] = 0xff
    oversized[oversized.length - 1] = 0xd9
    await expect(upload({ buffer: oversized, extension: 'jpg', mimetype: 'image/jpeg' })).rejects.toThrow()
  })

  it('rejects unauthenticated oversized malformed uploads as unauthorized before file validation', async () => {
    const oversized = Buffer.alloc(MAX_UPLOAD_BYTES + 1)

    await expect(
      payload.create({
        collection: 'media',
        data: {
          alt: 'Unauthenticated upload',
          decorative: false,
          license: 'CC0 1.0 Universal',
          sourceURL: 'https://media-source.invalid/unauthenticated',
          uploadedBy: admin.id,
        },
        file: {
          data: oversized,
          mimetype: 'image/jpeg',
          name: 'malformed.jpg',
          size: oversized.length,
        },
        overrideAccess: false,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it.each([
    [
      'minor version',
      HEVC_HEIF_WITH_AVIF_MINOR_VERSION,
      'Only complete JPEG, PNG, WebP, or AVIF images are allowed.',
    ],
    [
      'compatible brand',
      (() => {
        const buffer = Buffer.from(HEVC_HEIF_WITH_AVIF_MINOR_VERSION)
        buffer.writeUInt32BE(0, 12)
        buffer.write('avif', 16, 'ascii')
        return buffer
      })(),
      'Only AV1-encoded AVIF images are allowed.',
    ],
  ])('rejects HEVC/HEIF content spoofing AVIF through the ftyp %s', async (_label, buffer, message) => {
    await expect(upload({ buffer, extension: 'avif', mimetype: 'image/avif' })).rejects.toMatchObject({
      data: { errors: [{ message, path: 'file' }] },
    })
  })

  it.each(formats)('accepts signature-matched %s and persists upload metadata', async (format, mimetype, extension) => {
    const buffer = await imageBuffer(format)
    const doc = await upload({ buffer, extension, mimetype })
    createdMediaIDs.push(doc.id)

    expect(doc.alt).toBe('Walnut furniture detail')
    expect(doc.decorative).toBe(false)
    expect(doc.filename).toMatch(new RegExp(`^[0-9a-f-]{36}\\.${extension}$`))
    expect(doc.filename).not.toContain('..')
    expect(doc.mimeType).toBe(mimetype)
    expect(doc.width).toBe(8)
    expect(doc.height).toBe(6)
    expect(doc.focalX).toBe(25)
    expect(doc.focalY).toBe(75)
    expect(doc.createdAt).toEqual(expect.any(String))
    expect(doc.updatedAt).toEqual(expect.any(String))
    expect(typeof doc.uploadedBy === 'object' ? doc.uploadedBy.id : doc.uploadedBy).toBe(admin.id)
  })

  it('does not expose internal provenance in direct or populated anonymous reads', async () => {
    const png = await imageBuffer('png')
    const doc = await upload({ buffer: png })
    createdMediaIDs.push(doc.id)

    const direct = await payload.findByID({
      collection: 'media',
      id: doc.id,
      depth: 1,
      overrideAccess: false,
    })
    expect(direct).toMatchObject({ alt: 'Walnut furniture detail', url: expect.any(String) })
    expect(direct).not.toHaveProperty('sourceNotes')
    expect(direct).not.toHaveProperty('uploadedBy')

    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        brandName: 'Al Rukn Furniture',
        businessName: 'Al Rukn Furniture',
        canonicalSiteURL: 'https://alruknfurniture.ae',
        logo: doc.id,
      },
      context: { disableRevalidate: true },
      overrideAccess: false,
      user: admin,
    })
    const settings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      overrideAccess: false,
    })
    expect(settings.logo).toMatchObject({ alt: 'Walnut furniture detail', url: expect.any(String) })
    expect(settings.logo).not.toHaveProperty('sourceNotes')
    expect(settings.logo).not.toHaveProperty('uploadedBy')
  })

  it('accepts explicitly decorative media only with an exact empty alt', async () => {
    const png = await imageBuffer('png')
    const doc = await upload({ alt: '', buffer: png, decorative: true })
    createdMediaIDs.push(doc.id)

    expect(doc.alt).toBe('')
    expect(doc.decorative).toBe(true)
  })
})
