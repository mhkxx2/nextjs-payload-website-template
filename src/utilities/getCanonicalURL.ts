const canonicalProductionURL = 'https://alruknfurniture.ae'

export const getCanonicalURL = (): string =>
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : canonicalProductionURL)