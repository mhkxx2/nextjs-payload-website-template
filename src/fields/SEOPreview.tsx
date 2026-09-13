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

function displayImage(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && 'id' in value) return String(value.id)
  return EMPTY_PREVIEW
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
        <div style={{ marginBlockStart: '0.5rem' }}>
          Social image: {displayImage(preview.image)}
        </div>
      </div>
    </section>
  )
}
