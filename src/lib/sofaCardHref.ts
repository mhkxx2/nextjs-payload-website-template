/** Resolve CMS card paths to safe internal routes. */
export function resolveSofaCardHref(value: unknown): string | null {
  if (typeof value !== 'string' || !/^\/(?!\/)[^\s\\]*$/.test(value)) return null

  try {
    // URL resolves literal/encoded dot segments as browsers do. Decode the pathname
    // as routing does, then normalize again to cover encoded names and separators.
    const destination = new URL(value, 'https://internal.invalid')
    const pathname = decodeURIComponent(destination.pathname)
    // Reject nested encodings rather than emit a path that changes on another decode.
    if (/[\s\\%]/.test(pathname)) return null
    destination.pathname = pathname.replace(/\/+/g, '/')
    return `${destination.pathname}${destination.search}${destination.hash}`
  } catch {
    return null
  }
}
