import { describe, expect, it } from 'vitest'

import { Footer } from '@/globals/Footer'
import { presentationPath } from '@/lib/presentationRoutes'
import { GLOBAL_SEEDS } from '@/seed/site'

const PUBLIC_NAVIGATION = [
  { label: 'Home', destination: 'home' },
  { label: 'Services', destination: 'services' },
  { label: 'Projects', destination: 'projects' },
  { label: 'Areas We Serve', destination: 'areas' },
  { label: 'Collection', destination: 'portfolio' },
  { label: 'Contact Us', destination: 'contact' },
] as const

describe('public navigation contract', () => {
  it('keeps the exact requested header and footer order in CMS seed data', () => {
    expect(GLOBAL_SEEDS.header.navigation).toEqual(PUBLIC_NAVIGATION)
    expect(GLOBAL_SEEDS.footer.navigationGroups).toEqual([
      { heading: 'Navigation', items: PUBLIC_NAVIGATION },
    ])
  })

  it('supports every primary destination in the Footer global schema', () => {
    const fields = Footer.fields as Array<Record<string, unknown>>
    const groups = fields.find((field) => field.name === 'navigationGroups')
    const groupFields = (groups?.fields ?? []) as Array<Record<string, unknown>>
    const items = groupFields.find((field) => field.name === 'items')
    const itemFields = (items?.fields ?? []) as Array<Record<string, unknown>>
    const destination = itemFields.find((field) => field.name === 'destination')
    const options = (destination?.options ?? []) as Array<{ value: string }>

    expect(options.map((option) => option.value)).toEqual(
      expect.arrayContaining(PUBLIC_NAVIGATION.map((item) => item.destination)),
    )
  })

  it('maps Collection and Contact Us to their public routes', () => {
    expect(presentationPath('portfolio')).toBe('/portfolio')
    expect(presentationPath('contact')).toBe('/contact')
  })
})
