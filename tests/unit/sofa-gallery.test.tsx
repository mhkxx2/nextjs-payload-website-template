import { readFileSync } from 'node:fs'
import postcss from 'postcss'
import { cleanup, fireEvent, render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Media, Service } from '@/payload-types'
import { SofaUpholsteryPage } from '@/components/sofa-upholstery/SofaUpholsteryPage'

const query = vi.hoisted(() => vi.fn())
vi.mock('@/lib/publicQueries', () => ({ queryPublicDocBySlug: query }))
vi.mock('@/utilities/getGlobals', () => ({ getCachedGlobal: () => async () => ({}) }))
vi.mock('@/lib/schema', async (original) => ({
  ...(await original<typeof import('@/lib/schema')>()),
  getSchemaGlobals: async () => ({}),
}))
vi.mock('@/components/google-reviews/GoogleReviewsSection', () => ({
  GoogleReviewsSection: () => null,
}))

const caption = (text: string): Media['caption'] => ({
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text }] }],
  },
})
const media = (index: number): Media => ({
  id: index + 1,
  alt: `Sofa design ${index + 1}`,
  decorative: false,
  url: `/media/sofa-${index + 1}.jpg`,
  width: index % 2 ? 800 : 1200,
  height: 800,
  caption: caption(`Catalogue inspiration ${index + 1}.`),
  sourceURL: 'https://fixtures.example.test/catalogue',
  license: 'Owned catalogue',
  uploadedBy: 1,
  updatedAt: '2026-10-01T00:00:00Z',
  createdAt: '2026-10-01T00:00:00Z',
})
const service = (images = Array.from({ length: 8 }, (_, index) => media(index))): Service => ({
  id: 1,
  title: 'Sofa Upholstery',
  slug: 'sofa-upholstery',
  status: 'published',
  seo: { canonicalURL: 'https://alruknfurniture.ae/sofa-upholstery/' },
  galleryHeading: 'Sofa Upholstery Gallery',
  galleryIntro: 'Catalogue and design inspiration.',
  gallery: images.map((image) => ({ id: `slot-${image.id}`, image })),
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
})
async function gallery(record = service()) {
  query.mockResolvedValue(record)
  const view = render(await SofaUpholsteryPage())
  const section = view.container.querySelector('.service-gallery-section') as HTMLElement
  return {
    ...view,
    section,
    images: within(section).queryAllByRole('img'),
    triggers: within(section).queryAllByRole('button', { name: /^View / }),
  }
}
const dialog = () => within(document.body).getByRole('dialog', { name: 'Sofa Upholstery Gallery' })
const openFirst = (triggers: HTMLElement[]) => {
  expect(triggers.length).toBeGreaterThan(0)
  triggers[0]!.focus()
  fireEvent.click(triggers[0]!)
  return dialog()
}

beforeEach(() => {
  query.mockReset()
  document.body.style.overflow = 'scroll'
  // jsdom has no native modal top layer; browser specs exercise the real API.
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.setAttribute('open', '')
    },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.removeAttribute('open')
    },
  })
})
afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
  vi.restoreAllMocks()
})

describe('CMS sofa gallery and modal viewer', () => {
  it('keeps closed-gallery captions above WCAG AA contrast on the actual section background', async () => {
    const stylesheet = document.createElement('style')
    const css = postcss.parse(readFileSync('src/app/(frontend)/globals.css', 'utf8'))
    // jsdom does not run Tailwind's compiler or resolve its package imports.
    css.walkAtRules(/^(import|config|custom-variant|plugin|source|theme|variant)$/, (rule) => {
      rule.remove()
    })
    stylesheet.textContent = css.toString()
    document.head.append(stylesheet)
    try {
      const view = await gallery()
      const luminance = (color: string) => {
        const channels = color
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number)
        expect(channels).toHaveLength(3)
        const linear = channels.map((channel) => {
          const srgb = channel / 255
          return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
        })
        return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722
      }
      const background = luminance(getComputedStyle(view.section).backgroundColor)
      for (const caption of view.section.querySelectorAll('figcaption')) {
        const foreground = luminance(getComputedStyle(caption).color)
        const ratio =
          (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05)
        expect(ratio).toBeGreaterThanOrEqual(4.5)
      }
    } finally {
      stylesheet.remove()
    }
  })

  it.each([8, 16])(
    'renders %i lazy images with intrinsic dimensions and named button triggers',
    async (count) => {
      const view = await gallery(service(Array.from({ length: count }, (_, index) => media(index))))
      expect(view.images).toHaveLength(count)
      expect(view.triggers).toHaveLength(count)
      for (const image of view.images) {
        expect(image.getAttribute('alt')?.trim()).toBeTruthy()
        expect(Number(image.getAttribute('width'))).toBeGreaterThan(0)
        expect(image.getAttribute('height')).toBe('800')
        expect(image.getAttribute('loading')).toBe('lazy')
        expect(image.getAttribute('sizes')).toBeTruthy()
        expect(image.getAttribute('fetchpriority')).not.toBe('high')
      }
      expect(query).toHaveBeenCalledExactlyOnceWith('services', 'sofa-upholstery', 2)
    },
  )

  it('omits blank-alt, decorative, unresolved and dimensionless legacy media without inventing content', async () => {
    const record = service([
      media(0),
      { ...media(1), alt: '  ' },
      { ...media(2), decorative: true },
      { ...media(3), width: null },
      { ...media(4), height: 0 },
      { ...media(5), url: null },
    ])
    record.gallery!.push({ image: 1234, id: 'unresolved' })
    const view = await gallery(record)
    expect(view.images).toHaveLength(1)
    expect(view.triggers).toHaveLength(1)
    expect(view.images[0]!.getAttribute('alt')).toBe('Sofa design 1')
  })

  it('caps legacy overpopulation at sixteen valid CMS items without duplicating sparse content', async () => {
    const view = await gallery(service(Array.from({ length: 18 }, (_, index) => media(index))))
    expect(view.images).toHaveLength(16)
    expect(view.section.textContent).not.toContain('Catalogue inspiration 17.')
  })

  it('shows CMS captions on figures and the selected modal image with modal semantics', async () => {
    const view = await gallery()
    expect(within(view.section).getByText('Catalogue inspiration 1.').tagName).toBe('FIGCAPTION')
    const viewer = openFirst(view.triggers)
    expect(viewer.tagName).toBe('DIALOG')
    expect(viewer.getAttribute('aria-modal')).toBe('true')
    expect(within(viewer).getByRole('img').getAttribute('alt')).toBe('Sofa design 1')
    expect(within(viewer).getByText('Catalogue inspiration 1.')).toBeTruthy()
    const description = viewer.getAttribute('aria-describedby')!
    expect(document.getElementById(description)?.textContent).toBe('Catalogue inspiration 1.')
    expect(document.activeElement).toBe(
      within(viewer).getByRole('button', { name: 'Close gallery' }),
    )
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('labels uncaptioned media as inspiration and renders CMS text without interpreting markup', async () => {
    const view = await gallery(
      service([
        { ...media(0), caption: null },
        { ...media(1), caption: caption('<script>alert("catalogue")</script>') },
      ]),
    )
    expect(within(view.section).getByText('Design inspiration').tagName).toBe('FIGCAPTION')
    expect(within(view.section).getByText('<script>alert("catalogue")</script>')).toBeTruthy()
    expect(view.section.querySelector('script')).toBeNull()
  })

  it('navigates with buttons and arrows, wraps at both ends, and preserves control focus', async () => {
    const view = await gallery()
    const viewer = openFirst(view.triggers)
    const next = within(viewer).getByRole('button', { name: 'Next image' })
    next.focus()
    fireEvent.click(next)
    expect(within(viewer).getByRole('img').getAttribute('alt')).toBe('Sofa design 2')
    expect(document.activeElement).toBe(next)
    fireEvent.keyDown(viewer, { key: 'ArrowLeft' })
    expect(within(viewer).getByRole('img').getAttribute('alt')).toBe('Sofa design 1')
    fireEvent.click(within(viewer).getByRole('button', { name: 'Previous image' }))
    expect(within(viewer).getByRole('img').getAttribute('alt')).toBe('Sofa design 8')
    fireEvent.keyDown(viewer, { key: 'ArrowRight' })
    expect(within(viewer).getByRole('img').getAttribute('alt')).toBe('Sofa design 1')
    expect(within(viewer).getByRole('status').textContent).toBe('1 / 8')
  })

  it('contains Tab and Shift+Tab focus at both boundaries', async () => {
    const view = await gallery()
    const viewer = openFirst(view.triggers)
    const close = within(viewer).getByRole('button', { name: 'Close gallery' })
    const next = within(viewer).getByRole('button', { name: 'Next image' })
    close.focus()
    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(next)
    fireEvent.keyDown(next, { key: 'Tab' })
    expect(document.activeElement).toBe(close)
  })

  it.each(['Escape', 'close button', 'native cancel', 'native close'])(
    'cleans up overflow and restores the exact trigger on %s',
    async (path) => {
      const view = await gallery()
      const trigger = view.triggers[3]!
      trigger.focus()
      fireEvent.click(trigger)
      const viewer = dialog()
      if (path === 'Escape') fireEvent.keyDown(viewer, { key: 'Escape' })
      if (path === 'close button')
        fireEvent.click(within(viewer).getByRole('button', { name: 'Close gallery' }))
      if (path === 'native cancel')
        fireEvent(viewer, new Event('cancel', { bubbles: false, cancelable: true }))
      if (path === 'native close') fireEvent(viewer, new Event('close', { bubbles: false }))
      expect(within(document.body).queryByRole('dialog')).toBeNull()
      expect(document.activeElement).toBe(trigger)
      expect(document.body.style.overflow).toBe('scroll')
    },
  )

  it('restores body overflow on unmount and leaves no document keyboard handler behind', async () => {
    const view = await gallery()
    openFirst(view.triggers)
    view.unmount()
    expect(document.body.style.overflow).toBe('scroll')
    expect(() => fireEvent.keyDown(document, { key: 'ArrowRight' })).not.toThrow()
  })

  it('swipes horizontally in either direction while ignoring vertical scroll, small motion, multitouch and cancelled gestures', async () => {
    const view = await gallery()
    const viewer = openFirst(view.triggers)
    const figure = within(viewer).getByRole('img').closest('figure')!
    const start = (x: number, y: number, extra = false) =>
      fireEvent.touchStart(figure, {
        touches: [{ clientX: x, clientY: y }, ...(extra ? [{ clientX: x + 20, clientY: y }] : [])],
      })
    const end = (x: number, y: number) =>
      fireEvent.touchEnd(figure, { changedTouches: [{ clientX: x, clientY: y }] })
    start(200, 100)
    end(100, 105)
    expect(within(viewer).getByRole('img').getAttribute('alt')).toBe('Sofa design 2')
    start(100, 100)
    end(200, 105)
    expect(within(viewer).getByRole('img').getAttribute('alt')).toBe('Sofa design 1')
    start(200, 100)
    end(180, 100)
    start(200, 100)
    end(120, 250)
    start(200, 100, true)
    end(100, 100)
    start(200, 100)
    fireEvent.touchCancel(figure)
    end(100, 100)
    expect(within(viewer).getByRole('img').getAttribute('alt')).toBe('Sofa design 1')
  })
})
