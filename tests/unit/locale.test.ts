import { describe, expect, it } from 'vitest'
import { getDocumentLocale } from '@/lib/locale'

describe('getDocumentLocale', () => {
  it('returns en/ltr by default', () => {
    const result = getDocumentLocale()
    expect(result).toEqual({ lang: 'en', dir: 'ltr' })
  })

  it('returns ar/rtl when locale is ar', () => {
    const result = getDocumentLocale('ar')
    expect(result).toEqual({ lang: 'ar', dir: 'rtl' })
  })

  it('allows dir=rtl override in non-production environments when requested via searchParams', () => {
    const env = process.env as Record<string, string | undefined>
    const originalEnv = env.NODE_ENV
    try {
      env.NODE_ENV = 'development'
      const result = getDocumentLocale('en', { dir: 'rtl' })
      expect(result).toEqual({ lang: 'en', dir: 'rtl' })
    } finally {
      env.NODE_ENV = originalEnv
    }
  })

  it('forbids dir=rtl searchParams override in production', () => {
    const env = process.env as Record<string, string | undefined>
    const originalEnv = env.NODE_ENV
    try {
      env.NODE_ENV = 'production'
      const result = getDocumentLocale('en', { dir: 'rtl' })
      expect(result).toEqual({ lang: 'en', dir: 'ltr' })
    } finally {
      env.NODE_ENV = originalEnv
    }
  })
})
