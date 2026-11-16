import { postgresAdapter, sql } from '@payloadcms/db-postgres'
import { uniqueIndex } from '@payloadcms/db-postgres/drizzle/pg-core'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Areas } from './collections/Areas'
import { CurtainBlindCategories } from './collections/CurtainBlindCategories'
import { CurtainBlindProducts } from './collections/CurtainBlindProducts'
import { FAQs } from './collections/FAQs'
import { Leads } from './collections/Leads'
import { LeadMedia } from './collections/LeadMedia'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { PortfolioItems } from './collections/PortfolioItems'
import { Projects } from './collections/Projects'
import { Redirects } from './collections/Redirects'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { ContactInformation } from './globals/ContactInformation'
import { SEODefaults } from './globals/SEODefaults'
import { SiteSettings } from './globals/SiteSettings'
import { GoogleReviews } from './globals/GoogleReviews'
import { Homepage } from './globals/Homepage'
import { SocialMedia } from './globals/SocialMedia'
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'
import { ArchiveSettings } from './globals/ArchiveSettings'
import { defaultLexical } from '@/fields/defaultLexical'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/getURL'
import { quoteRequestEndpoint } from './endpoints/quoteRequest'

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
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_EMAIL ?? '',
    defaultFromName: process.env.SMTP_FROM_NAME ?? '',
    transportOptions: {
      auth: {
        pass: process.env.SMTP_PASS,
        user: process.env.SMTP_USER,
      },
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
    },
  }),
  db: postgresAdapter({
    beforeSchemaInit: [
      ({ adapter, schema }) => {
        for (const { columnKey, constraintName, tableName } of [
          {
            columnKey: 'sofaUpholsteryLanding_bedTeaser_image',
            constraintName: 'services_sofa_bed_image_media_fk',
            tableName: 'services',
          },
          {
            columnKey: 'version_sofaUpholsteryLanding_bedTeaser_image',
            constraintName: '_services_v_sofa_bed_image_media_fk',
            tableName: '_services_v',
          },
        ] as const) {
          const table = adapter.rawTables[tableName]
          const column = table?.columns[columnKey]
          const reference = column?.reference
          if (!table || !column || !reference) {
            throw new Error(`Missing expected ${tableName}.${columnKey} database reference.`)
          }

          delete column.reference
          table.foreignKeys ??= {}
          table.foreignKeys[constraintName] = {
            columns: [columnKey],
            foreignColumns: [{ name: reference.name, table: reference.table }],
            name: constraintName,
            onDelete: reference.onDelete,
          }
        }

        return schema
      },
    ],
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
    // Integration and build verification can opt into an isolated schema without
    // mutating the shared development database. Production leaves this unset.
    schemaName: process.env.PAYLOAD_TEST_SCHEMA || undefined,
  }),
  collections: [
    Areas,
    Pages,
    Posts,
    PortfolioItems,
    Projects,
    Services,
    CurtainBlindCategories,
    CurtainBlindProducts,
    FAQs,
    Testimonials,
    Leads,
    LeadMedia,
    Redirects,
    Users,
    Media,
    Categories,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  endpoints: [quoteRequestEndpoint],
  localization: {
    defaultLocale: 'en',
    fallback: true,
    locales: [{ code: 'en', label: 'English' }],
  },
  globals: [
    Homepage,
    AboutPage,
    ContactPage,
    ArchiveSettings,
    SiteSettings,
    GoogleReviews,
    Header,
    Footer,
    ContactInformation,
    SEODefaults,
    SocialMedia,
  ],
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
