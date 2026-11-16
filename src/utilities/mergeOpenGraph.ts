import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Al Rukn Furniture.',
  images: [
    {
      url: `${getServerSideURL()}/al-rukn-social-card.svg`,
    },
  ],
  siteName: 'Al Rukn Furniture',
  title: 'Al Rukn Furniture',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
