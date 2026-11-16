import type { Field } from 'payload'
import { describe, expect, it } from 'vitest'

import { Services } from '@/collections/Services'

const namedField = (fields: Field[], name: string) => {
  const field = fields.find((candidate) => 'name' in candidate && candidate.name === name)
  if (!field) throw new Error(`Missing field ${name}`)
  return field
}

describe('Services database identifiers', () => {
  it('shortens the warned sofa landing database identifiers while preserving editor field names', () => {
    const landing = namedField(Services.fields, 'sofaUpholsteryLanding')
    expect(landing).toMatchObject({ name: 'sofaUpholsteryLanding', type: 'group' })
    if (landing.type !== 'group') throw new Error('Expected sofaUpholsteryLanding group')

    const foamComfort = namedField(landing.fields, 'foamComfort')
    expect(foamComfort).toMatchObject({ name: 'foamComfort', type: 'group' })
    if (foamComfort.type !== 'group') throw new Error('Expected foamComfort group')

    const items = namedField(foamComfort.fields, 'items')
    expect(items).toMatchObject({
      dbName: 'services_sofa_foam_items',
      name: 'items',
      type: 'array',
    })

    const versionTable = '_services_sofa_foam_items_v'
    const generatedIdentifiers = [
      `${versionTable}_order_idx`,
      `${versionTable}_parent_id_idx`,
      `${versionTable}_parent_id_fk`,
    ]
    expect(generatedIdentifiers.every((identifier) => identifier.length <= 63)).toBe(true)
    expect(new Set(generatedIdentifiers).size).toBe(generatedIdentifiers.length)

    expect(namedField(landing.fields, 'popularServices')).toMatchObject({
      dbName: 'services_sofa_popular',
      name: 'popularServices',
      type: 'array',
    })
    expect(namedField(landing.fields, 'fabricCards')).toMatchObject({
      dbName: 'services_sofa_fabrics',
      name: 'fabricCards',
      type: 'array',
    })

    const bedTeaser = namedField(landing.fields, 'bedTeaser')
    expect(bedTeaser).toMatchObject({
      label: 'Bed Upholstery Teaser',
      name: 'bedTeaser',
      type: 'group',
    })
    if (bedTeaser.type !== 'group') throw new Error('Expected bedTeaser group')
    expect(namedField(bedTeaser.fields, 'description')).toMatchObject({ name: 'description', type: 'textarea' })
  })
})
