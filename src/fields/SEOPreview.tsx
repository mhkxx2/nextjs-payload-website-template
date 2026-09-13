'use client'

import { useFormFields } from '@payloadcms/ui'
import type { UIFieldClientProps } from 'payload'

const EMPTY_PREVIEW = 'Not set'

type SEOPreviewProps = UIFieldClientProps & {
  canonicalPath: string
  descriptionPath: string
  imagePath: string
  titlePath: string
}

function siblingPath(componentPath: string, fieldPath: string): string {
  const separator = componentPath.lastIndexOf('.')
  return separator === -1 ? fieldPath : `${componentPath.slice(0, separator)}.${fieldPath}`
}

function displayText(value: unknown): string {
  return typeof value === 'string' && value.trim() !== '' ? value : EMPTY_PREVIEW
}

type ImagePreview = {
  alt: string
  label: string
  src?: string
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined
}

function imagePreview(value: unknown): ImagePreview {
  if (typeof value === 'string' || typeof value === 'number') {
    return { alt: 'Selected social image', label: `Selected media ID: ${String(value)}` }
  }

  if (!value || typeof value !== 'object') {
    return { alt: 'Selected social image', label: EMPTY_PREVIEW }
  }

  const media = value as Record<string, unknown>
  const alt = nonEmptyString(media.alt)
  const filename = nonEmptyString(media.filename)
  const id = typeof media.id === 'string' || typeof media.id === 'number' ? String(media.id) : undefined
  const src = nonEmptyString(media.thumbnailURL) ?? nonEmptyString(media.url)
  const label =
    alt && filename
      ? `${alt} — ${filename}`
      : (alt ?? filename ?? (id ? `Selected media ID: ${id}` : EMPTY_PREVIEW))

  return { alt: alt ?? filename ?? 'Selected social image', label, src }
}

/** Read-only preview of the public canonical and Open Graph values. */
export const SEOPreview = ({
  canonicalPath,
  descriptionPath,
  imagePath,
  path,
  titlePath,
}: SEOPreviewProps) => {
  const preview = useFormFields(([fields]) => ({
    canonical: fields[siblingPath(path, canonicalPath)]?.value,
    description: fields[siblingPath(path, descriptionPath)]?.value,
    image: fields[siblingPath(path, imagePath)]?.value,
    title: fields[siblingPath(path, titlePath)]?.value,
  }))
  const image = imagePreview(preview.image)

  return (
    <section aria-label="Search and social preview" style={{ marginBlock: '1rem' }}>
      <strong style={{ display: 'block', marginBlockEnd: '0.5rem' }}>
        Search and social preview
      </strong>
      <div
        style={{
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '4px',
          padding: '1rem',
        }}
      >
        <div style={{ color: 'var(--theme-success-500)', overflowWrap: 'anywhere' }}>
          {displayText(preview.canonical)}
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBlock: '0.35rem' }}>
          {displayText(preview.title)}
        </div>
        <div>{displayText(preview.description)}</div>
        <div style={{ marginBlockStart: '0.75rem' }}>
          <strong style={{ display: 'block', marginBlockEnd: '0.35rem' }}>Social image</strong>
          {image.src ? (
            // Payload media URLs are dynamic and cannot use a statically configured Next Image loader.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={image.alt}
              src={image.src}
              style={{ display: 'block', height: 'auto', maxHeight: '12rem', maxWidth: '100%' }}
            />
          ) : null}
          <div style={{ marginBlockStart: image.src ? '0.35rem' : undefined }}>{image.label}</div>
        </div>
      </div>
    </section>
  )
}
