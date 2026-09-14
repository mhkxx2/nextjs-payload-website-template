import { postgresAdapter, sql } from '@payloadcms/db-postgres'
import { uniqueIndex } from '@payloadcms/db-postgres/drizzle/pg-core'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { FAQs } from './collections/FAQs'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Redirects } from './collections/Redirects'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { defaultLexical } from '@/fields/defaultLexical'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },

  editor: defaultLexical,
  db: postgresAdapter({
    afterSchemaInit: [
      ({ adapter, extendTable, schema }) => {
        extendTable({
          table: schema.tables.redirects!,
          extraConfig: (table) => ({
            redirectsActiveSourceUnique: uniqueIndex('redirects_active_source_unique')
              .on(table.source)
              .where(sql`${table.active} = true`),
          }),
        })

        adapter.fieldConstraints.redirects ??= {}
        adapter.fieldConstraints.redirects.redirects_active_source_unique = 'source'

        return schema
      },
    ],
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    schemaName: process.env.NODE_ENV === 'test' ? process.env.PAYLOAD_TEST_SCHEMA : undefined,
  }),
  collections: [
    Pages,
    Posts,
    Projects,
    Services,
    FAQs,
    Testimonials,
    Leads,
    Redirects,
    Users,
    Media,
    Categories,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }): boolean => Boolean(req.user),
    },
    tasks: [],
  },
})
