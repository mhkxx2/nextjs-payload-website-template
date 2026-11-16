import type { MetadataRoute } from 'next'

import { buildRobots } from '@/lib/seo'

/**
 * `/robots.txt` — production sensitive: any deployment that is not production or
 * is not serving the production origin disallows everything.
 *
 * Next.js 16 only recognises the robots file convention at the app root
 * (`^[\\/]robots\.(ts|tsx|js|jsx|txt)$` in `lib/metadata/is-metadata-route`), so
 * this file stays next to the route groups instead of inside one.
 */
export default function robots(): MetadataRoute.Robots {
  return buildRobots()
}
