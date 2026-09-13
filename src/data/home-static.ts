import type { RequiredDataFromCollectionSlug } from 'payload'

// Neutral, repository-owned fallback shown until a homepage is published in Payload.
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  status: 'published',
  publishedAt: '2026-09-12T00:00:00.000Z',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Al Rukn Furniture',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Website content is being prepared.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  meta: {
    description: 'Al Rukn Furniture.',
    title: 'Al Rukn Furniture',
  },
  seo: {
    canonicalURL: 'https://alruknfurniture.ae/',
  },
  title: 'Home',
  layout: [],
}
