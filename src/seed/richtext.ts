export type SeedRichText = Record<string, unknown>

/**
 * Minimal Lexical builders used by the Al Rukn seed.
 *
 * The seed authors rich text in code so the launch copy is reviewable in git
 * instead of living in a one-off database export.
 */

type LexicalNode = Record<string, unknown>

const FIXED = { format: '', indent: 0, version: 1, direction: 'ltr' } as const

const textNode = (text: string, format = 0): LexicalNode => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

export const paragraph = (...lines: string[]): LexicalNode => ({
  type: 'paragraph',
  textFormat: 0,
  ...FIXED,
  children: lines.map((line) => textNode(line)),
})

export const strongParagraph = (...lines: string[]): LexicalNode => ({
  type: 'paragraph',
  textFormat: 0,
  ...FIXED,
  children: lines.map((line) => textNode(line, 1)),
})

export const heading = (text: string, tag: 'h2' | 'h3' = 'h2'): LexicalNode => ({
  type: 'heading',
  tag,
  ...FIXED,
  children: [textNode(text)],
})

export const bulletList = (items: string[]): LexicalNode => ({
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  ...FIXED,
  children: items.map((item, index) => ({
    type: 'listitem',
    value: index + 1,
    checked: undefined,
    ...FIXED,
    children: [textNode(item)],
  })),
})

export const richText = (...children: LexicalNode[]): SeedRichText => ({
  root: {
    type: 'root',
    ...FIXED,
    children,
  },
})

/** Convenience wrapper for services that only need plain paragraphs. */
export const paragraphs = (...lines: string[]): SeedRichText =>
  richText(...lines.map((line) => paragraph(line)))
