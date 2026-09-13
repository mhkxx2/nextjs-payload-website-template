import type { FieldHook, RowField, TextField } from 'payload'
import { slugField as payloadSlugField } from 'payload'

import { normalizeSlug, validatePageSlug } from '@/lib/slug'

type PayloadSlugFieldOptions = NonNullable<Parameters<typeof payloadSlugField>[0]>

type SlugFieldOptions = PayloadSlugFieldOptions & {
  validateReserved?: boolean
}

const duplicateMessage = (slug: string) =>
  `The slug “${slug}” is already in use. Please choose a different slug.`

export function slugField({ validateReserved = false, ...options }: SlugFieldOptions = {}): RowField {
  const field = payloadSlugField(options)
  const slugName = options.name ?? 'slug'
  const slug = field.fields.find(
    (candidate): candidate is TextField =>
      'name' in candidate && candidate.name === slugName && candidate.type === 'text',
  )

  if (!slug) {
    throw new Error(`Payload slug field “${slugName}” could not be configured.`)
  }

  const enforceNormalizedUniqueSlug: FieldHook = async ({ collection, originalDoc, req, value }) => {
    if (typeof value !== 'string') {
      return value
    }

    const normalized = normalizeSlug(value)
    if (validateReserved) {
      const validationResult = validatePageSlug(normalized)
      if (validationResult !== true) {
        throw new Error(validationResult)
      }
    }

    if (!collection) {
      throw new Error('Slug fields can only be used in Payload collections.')
    }

    const currentID = originalDoc?.id
    const duplicate = await req.payload.find({
      collection: collection.slug,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where:
        currentID == null
          ? { [slugName]: { equals: normalized } }
          : {
              and: [{ [slugName]: { equals: normalized } }, { id: { not_equals: currentID } }],
            },
    })

    if (duplicate.docs.length > 0) {
      throw new Error(duplicateMessage(normalized))
    }

    return normalized
  }

  slug.hooks = {
    ...slug.hooks,
    beforeValidate: [...(slug.hooks?.beforeValidate ?? []), enforceNormalizedUniqueSlug],
  }
  slug.index = true
  slug.unique = true

  return field
}
