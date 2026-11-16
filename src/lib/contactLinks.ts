const e164 = /^\+[1-9]\d{7,14}$/

const validE164 = (value: null | string | undefined): string | null =>
  typeof value === 'string' && e164.test(value) ? value : null

export const phoneHref = (value: null | string | undefined): string | null => {
  const number = validE164(value)
  return number ? `tel:${number}` : null
}

export const whatsappHref = (
  value: null | string | undefined,
  message?: null | string,
): string | null => {
  const number = validE164(value)
  if (!number) return null

  const href = new URL(`https://wa.me/${number.slice(1)}`)
  if (message?.trim()) href.searchParams.set('text', message.trim())
  return href.toString()
}
