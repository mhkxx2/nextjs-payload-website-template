export interface DocumentLocale {
  lang: 'en' | 'ar'
  dir: 'ltr' | 'rtl'
}

export function getDocumentLocale(
  locale?: string,
  searchParams?: Record<string, string | string[] | undefined>
): DocumentLocale {
  const isArabic = locale === 'ar'
  const lang: 'en' | 'ar' = isArabic ? 'ar' : 'en'
  let dir: 'ltr' | 'rtl' = isArabic ? 'rtl' : 'ltr'

  if (process.env.NODE_ENV !== 'production' && searchParams) {
    const rawDir = searchParams.dir
    const paramDir = Array.isArray(rawDir) ? rawDir[0] : rawDir
    if (paramDir === 'rtl') {
      dir = 'rtl'
    } else if (paramDir === 'ltr') {
      dir = 'ltr'
    }
  }

  return { lang, dir }
}
