import { randomUUID } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'

import sharp from 'sharp'
import { UnauthorizedError, ValidationError, type CollectionBeforeOperationHook } from 'payload'

export const MAX_MEDIA_UPLOAD_BYTES = 12 * 1024 * 1024

const allowedTypes = {
  'image/avif': ['avif'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
} as const

type AllowedMime = keyof typeof allowedTypes

type DetectedImage = {
  extension: 'avif' | 'jpg' | 'png' | 'webp'
  mime: AllowedMime
}

function uploadError(message: string): never {
  throw new ValidationError({ errors: [{ message, path: 'file' }] })
}

function hasPrefix(buffer: Buffer, prefix: readonly number[]): boolean {
  return prefix.every((byte, index) => buffer[index] === byte)
}

function validPNGContainer(buffer: Buffer): boolean {
  if (!hasPrefix(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return false

  let offset = 8
  let sawHeader = false
  while (offset < buffer.length) {
    if (offset + 12 > buffer.length) return false
    const length = buffer.readUInt32BE(offset)
    const end = offset + 12 + length
    if (end > buffer.length) return false

    const chunk = buffer.toString('ascii', offset + 4, offset + 8)
    if (!sawHeader) {
      if (chunk !== 'IHDR' || length !== 13) return false
      sawHeader = true
    }
    if (chunk === 'IEND') return length === 0 && end === buffer.length
    offset = end
  }
  return false
}

function validWebPContainer(buffer: Buffer): boolean {
  if (
    buffer.length < 20 ||
    buffer.toString('ascii', 0, 4) !== 'RIFF' ||
    buffer.toString('ascii', 8, 12) !== 'WEBP' ||
    buffer.readUInt32LE(4) + 8 !== buffer.length
  ) {
    return false
  }

  let offset = 12
  let sawImageChunk = false
  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) return false
    const chunk = buffer.toString('ascii', offset, offset + 4)
    const length = buffer.readUInt32LE(offset + 4)
    const end = offset + 8 + length + (length % 2)
    if (end > buffer.length) return false
    if (chunk === 'VP8 ' || chunk === 'VP8L' || chunk === 'VP8X') sawImageChunk = true
    offset = end
  }
  return offset === buffer.length && sawImageChunk
}

function validAVIFContainer(buffer: Buffer): boolean {
  if (buffer.length < 16 || buffer.toString('ascii', 4, 8) !== 'ftyp') return false

  let offset = 0
  let avifBrand = false
  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) return false
    let boxSize = buffer.readUInt32BE(offset)
    let headerSize = 8
    if (boxSize === 1) {
      if (offset + 16 > buffer.length) return false
      const extendedSize = buffer.readBigUInt64BE(offset + 8)
      if (extendedSize > BigInt(Number.MAX_SAFE_INTEGER)) return false
      boxSize = Number(extendedSize)
      headerSize = 16
    }
    if (boxSize < headerSize || offset + boxSize > buffer.length) return false

    if (buffer.toString('ascii', offset + 4, offset + 8) === 'ftyp') {
      const brandOffset = offset + headerSize
      if (boxSize < headerSize + 8 || (boxSize - headerSize - 8) % 4 !== 0) return false

      const majorBrand = buffer.toString('ascii', brandOffset, brandOffset + 4)
      if (majorBrand === 'avif' || majorBrand === 'avis') avifBrand = true

      for (
        let compatibleBrandOffset = brandOffset + 8;
        compatibleBrandOffset + 4 <= offset + boxSize;
        compatibleBrandOffset += 4
      ) {
        const brand = buffer.toString('ascii', compatibleBrandOffset, compatibleBrandOffset + 4)
        if (brand === 'avif' || brand === 'avis') avifBrand = true
      }
    }
    offset += boxSize
  }
  return offset === buffer.length && avifBrand
}

function detectImage(buffer: Buffer): DetectedImage | undefined {
  if (
    buffer.length >= 4 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[buffer.length - 2] === 0xff &&
    buffer[buffer.length - 1] === 0xd9
  ) {
    return { extension: 'jpg', mime: 'image/jpeg' }
  }
  if (validPNGContainer(buffer)) return { extension: 'png', mime: 'image/png' }
  if (validWebPContainer(buffer)) return { extension: 'webp', mime: 'image/webp' }
  if (validAVIFContainer(buffer)) return { extension: 'avif', mime: 'image/avif' }
  return undefined
}

async function getUploadBuffer(file: NonNullable<Parameters<CollectionBeforeOperationHook>[0]['req']['file']>) {
  if (file.tempFilePath) {
    const fileStats = await stat(file.tempFilePath).catch(() => uploadError('Uploaded file could not be read.'))
    if (!fileStats.isFile()) uploadError('Uploaded file is not a regular file.')
    if (fileStats.size > MAX_MEDIA_UPLOAD_BYTES) uploadError('Images must not exceed 12 MB.')
    const buffer = await readFile(file.tempFilePath).catch(() => uploadError('Uploaded file could not be read.'))
    if (buffer.length !== fileStats.size) uploadError('Uploaded file size changed during validation.')
    return buffer
  }

  if (!Buffer.isBuffer(file.data)) uploadError('Uploaded image bytes are required.')
  if (file.data.length > MAX_MEDIA_UPLOAD_BYTES) uploadError('Images must not exceed 12 MB.')
  return file.data
}

export const validateAndRandomizeMediaUpload: CollectionBeforeOperationHook = async ({
  operation,
  overrideAccess,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update' && operation !== 'updateByID') return
  if (!overrideAccess && !req.user) throw new UnauthorizedError(req.t)
  if (!req.file) return

  const buffer = await getUploadBuffer(req.file)
  if (buffer.length === 0 || req.file.size !== buffer.length) {
    uploadError('Uploaded file size does not match its bytes.')
  }

  const detected = detectImage(buffer)
  if (!detected) uploadError('Only complete JPEG, PNG, WebP, or AVIF images are allowed.')

  if (!(req.file.mimetype in allowedTypes) || req.file.mimetype !== detected.mime) {
    uploadError('The declared MIME type does not match the uploaded image bytes.')
  }

  const incomingExtension = req.file.name.split('.').pop()?.toLowerCase()
  if (!incomingExtension || !allowedTypes[detected.mime].includes(incomingExtension as never)) {
    uploadError('The filename extension does not match the uploaded image bytes.')
  }

  try {
    const metadata = await sharp(buffer, { failOn: 'error', limitInputPixels: 40_000_000 }).metadata()
    const expectedFormat =
      detected.extension === 'jpg' ? 'jpeg' : detected.extension === 'avif' ? 'heif' : detected.extension
    if (detected.extension === 'avif' && metadata.compression !== 'av1') {
      uploadError('Only AV1-encoded AVIF images are allowed.')
    }
    if (!metadata.width || !metadata.height || metadata.format !== expectedFormat) {
      uploadError('The uploaded image is malformed or could not be decoded.')
    }
    await sharp(buffer, { failOn: 'error', limitInputPixels: 40_000_000 }).toBuffer()
  } catch (error) {
    if (error instanceof ValidationError) throw error
    uploadError('The uploaded image is malformed or could not be decoded.')
  }

  req.file.name = `${randomUUID()}.${detected.extension}`
}
