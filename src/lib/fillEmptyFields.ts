type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const fillEmptyFields = <Current, Fallback>(
  current: Current,
  fallback: Fallback,
): Current & Fallback => {
  if (current === null || current === undefined) return fallback as Current & Fallback
  if (typeof current === 'string') {
    return (current.trim() ? current : fallback) as Current & Fallback
  }
  if (Array.isArray(current)) return (current.length ? current : fallback) as Current & Fallback

  if (isRecord(current) && isRecord(fallback)) {
    const merged: UnknownRecord = { ...current }

    for (const [key, fallbackValue] of Object.entries(fallback)) {
      merged[key] = fillEmptyFields(current[key], fallbackValue)
    }

    return merged as Current & Fallback
  }

  return current as Current & Fallback
}
