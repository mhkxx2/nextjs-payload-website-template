const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://alruknfurniture.ae')

/**
 * `next-sitemap` only writes the legacy per-collection sitemap files. The public
 * `/robots.txt` and `/sitemap.xml` are owned by the App Router
 * (`src/app/(frontend)/robots.ts` and `src/app/(frontend)/sitemap.ts`), so
 * generating copies into `public/` would shadow them at build time.
 *
 * @type {import('next-sitemap').IConfig}
 */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false,
  outDir: 'out',
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
