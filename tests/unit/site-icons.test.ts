import { describe, expect, it } from 'vitest'

import { SITE_ICON_PATHS } from '@/lib/siteIcons'
import { PRIVATE_PATH_DISALLOW } from '@/lib/seo'

describe('site icons for Google Search', () => {
  it('exposes crawlable public paths outside /api/', () => {
    expect(SITE_ICON_PATHS.favicon).toBe('/favicon.ico')
    expect(SITE_ICON_PATHS.icon).toBe('/icon.png')
    expect(SITE_ICON_PATHS.apple).toBe('/apple-touch-icon.png')

    for (const iconPath of Object.values(SITE_ICON_PATHS)) {
      expect(iconPath.startsWith('/api/')).toBe(false)
      for (const blocked of PRIVATE_PATH_DISALLOW) {
        expect(iconPath.startsWith(blocked.replace(/\/$/, '')) || iconPath.startsWith(blocked)).toBe(
          false,
        )
      }
    }
  })

  it('keeps /api/ disallowed so media URLs must not be used as favicon hrefs', () => {
    expect(PRIVATE_PATH_DISALLOW).toContain('/api/')
  })
})
