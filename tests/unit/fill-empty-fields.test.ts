import { describe, expect, it } from 'vitest'

import { fillEmptyFields } from '@/lib/fillEmptyFields'

describe('fillEmptyFields', () => {
  it('fills only empty scalar and nested fields', () => {
    const current = {
      heading: 'Editor heading',
      introduction: null,
      labels: {
        primary: 'Editor CTA',
        secondary: '',
      },
    }

    expect(
      fillEmptyFields(current, {
        heading: 'Bootstrap heading',
        introduction: 'Bootstrap introduction',
        labels: {
          primary: 'Bootstrap CTA',
          secondary: 'Bootstrap secondary CTA',
        },
      }),
    ).toEqual({
      heading: 'Editor heading',
      introduction: 'Bootstrap introduction',
      labels: {
        primary: 'Editor CTA',
        secondary: 'Bootstrap secondary CTA',
      },
    })
  })

  it('fills empty arrays without replacing editor-managed array items', () => {
    expect(fillEmptyFields({ items: [] }, { items: [{ label: 'Bootstrap' }] })).toEqual({
      items: [{ label: 'Bootstrap' }],
    })
    expect(
      fillEmptyFields(
        { items: [{ label: 'Editor item' }] },
        { items: [{ label: 'Bootstrap' }] },
      ),
    ).toEqual({ items: [{ label: 'Editor item' }] })
  })
})
