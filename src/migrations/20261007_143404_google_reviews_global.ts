import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

type SchemaColumn = {
  table: string
  column: string
  type: string
  notNull: boolean
  default: string | null
}

type SchemaConstraint = {
  table: string
  name: string
  type: string
  definition: string
  validated: boolean
  deferrable: boolean
  initiallyDeferred: boolean
}

type SchemaIndex = {
  table: string
  name: string
  definition: string
  valid: boolean
  unique: boolean
  primary: boolean
}

type GoogleReviewsSchema = {
  columns: SchemaColumn[]
  constraints: SchemaConstraint[]
  indexes: SchemaIndex[]
  localeEnum: string[]
  sequences: Array<{ name: string | null; start: string | null; increment: string | null }>
}

const expectedSchema: GoogleReviewsSchema = {
  columns: [
    { table: 'google_reviews', column: 'id', type: 'integer', notNull: true, default: "nextval('google_reviews_id_seq'::regclass)" },
    { table: 'google_reviews', column: 'enabled', type: 'boolean', notNull: false, default: 'false' },
    { table: 'google_reviews', column: 'place_id', type: 'character varying', notNull: false, default: null },
    { table: 'google_reviews', column: 'review_limit', type: 'numeric', notNull: false, default: '5' },
    { table: 'google_reviews', column: 'maps_url', type: 'character varying', notNull: false, default: "'https://maps.app.goo.gl/zUhpC9PNhgwM69qp6'::character varying" },
    { table: 'google_reviews', column: 'write_review_url', type: 'character varying', notNull: false, default: "'https://g.page/r/CZ5_iPy3nYpdEBM/review'::character varying" },
    { table: 'google_reviews', column: 'updated_at', type: 'timestamp(3) with time zone', notNull: false, default: null },
    { table: 'google_reviews', column: 'created_at', type: 'timestamp(3) with time zone', notNull: false, default: null },
    { table: 'google_reviews_locales', column: 'heading', type: 'character varying', notNull: false, default: "'What Our Customers Say'::character varying" },
    { table: 'google_reviews_locales', column: 'subheading', type: 'character varying', notNull: false, default: null },
    { table: 'google_reviews_locales', column: 'id', type: 'integer', notNull: true, default: "nextval('google_reviews_locales_id_seq'::regclass)" },
    { table: 'google_reviews_locales', column: '_locale', type: '_locales', notNull: true, default: null },
    { table: 'google_reviews_locales', column: '_parent_id', type: 'integer', notNull: true, default: null },
  ],
  constraints: [
    { table: 'google_reviews', name: 'google_reviews_pkey', type: 'p', definition: 'PRIMARY KEY (id)', validated: true, deferrable: false, initiallyDeferred: false },
    { table: 'google_reviews_locales', name: 'google_reviews_locales_parent_id_fk', type: 'f', definition: 'FOREIGN KEY (_parent_id) REFERENCES google_reviews(id) ON DELETE CASCADE', validated: true, deferrable: false, initiallyDeferred: false },
    { table: 'google_reviews_locales', name: 'google_reviews_locales_pkey', type: 'p', definition: 'PRIMARY KEY (id)', validated: true, deferrable: false, initiallyDeferred: false },
  ],
  indexes: [
    { table: 'google_reviews', name: 'google_reviews_pkey', definition: 'CREATE UNIQUE INDEX google_reviews_pkey ON public.google_reviews USING btree (id)', valid: true, unique: true, primary: true },
    { table: 'google_reviews_locales', name: 'google_reviews_locales_locale_parent_id_unique', definition: 'CREATE UNIQUE INDEX google_reviews_locales_locale_parent_id_unique ON public.google_reviews_locales USING btree (_locale, _parent_id)', valid: true, unique: true, primary: false },
    { table: 'google_reviews_locales', name: 'google_reviews_locales_pkey', definition: 'CREATE UNIQUE INDEX google_reviews_locales_pkey ON public.google_reviews_locales USING btree (id)', valid: true, unique: true, primary: true },
  ],
  localeEnum: ['en'],
  sequences: [
    { name: 'public.google_reviews_id_seq', start: '1', increment: '1' },
    { name: 'public.google_reviews_locales_id_seq', start: '1', increment: '1' },
  ],
}

async function readGoogleReviewsSchema(db: MigrateUpArgs['db']): Promise<GoogleReviewsSchema> {
  const { rows } = await db.execute(sql`
    SELECT jsonb_build_object(
      'columns', (
        SELECT jsonb_agg(jsonb_build_object(
          'table', c.table_name,
          'column', c.column_name,
          'type', format_type(a.atttypid, a.atttypmod),
          'notNull', a.attnotnull,
          'default', pg_get_expr(d.adbin, d.adrelid)
        ) ORDER BY c.table_name, c.ordinal_position)
        FROM information_schema.columns c
        JOIN pg_namespace n ON n.nspname = c.table_schema
        JOIN pg_class t ON t.relnamespace = n.oid AND t.relname = c.table_name
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attname = c.column_name AND NOT a.attisdropped
        LEFT JOIN pg_attrdef d ON d.adrelid = t.oid AND d.adnum = a.attnum
        WHERE c.table_schema = 'public' AND c.table_name IN ('google_reviews', 'google_reviews_locales')
      ),
      'constraints', (
        SELECT jsonb_agg(jsonb_build_object(
          'table', t.relname,
          'name', c.conname,
          'type', c.contype,
          'definition', pg_get_constraintdef(c.oid, true),
          'validated', c.convalidated,
          'deferrable', c.condeferrable,
          'initiallyDeferred', c.condeferred
        ) ORDER BY t.relname, c.conname)
        FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        JOIN pg_namespace n ON n.oid = t.relnamespace
        WHERE n.nspname = 'public' AND t.relname IN ('google_reviews', 'google_reviews_locales')
      ),
      'indexes', (
        SELECT jsonb_agg(jsonb_build_object(
          'table', t.relname,
          'name', i.relname,
          'definition', pg_get_indexdef(i.oid),
          'valid', x.indisvalid,
          'unique', x.indisunique,
          'primary', x.indisprimary
        ) ORDER BY t.relname, i.relname)
        FROM pg_index x
        JOIN pg_class i ON i.oid = x.indexrelid
        JOIN pg_class t ON t.oid = x.indrelid
        JOIN pg_namespace n ON n.oid = t.relnamespace
        WHERE n.nspname = 'public' AND t.relname IN ('google_reviews', 'google_reviews_locales')
      ),
      'localeEnum', (
        SELECT jsonb_agg(e.enumlabel ORDER BY e.enumsortorder)
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE n.nspname = 'public' AND t.typname = '_locales'
      ),
      'sequences', (
        SELECT jsonb_agg(jsonb_build_object(
          'name', format('%I.%I', sn.nspname, s.relname),
          'start', q.seqstart::text,
          'increment', q.seqincrement::text
        ) ORDER BY s.relname)
        FROM pg_class t
        JOIN pg_namespace n ON n.oid = t.relnamespace
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attname = 'id' AND NOT a.attisdropped
        JOIN pg_depend dep ON dep.refobjid = t.oid AND dep.refobjsubid = a.attnum AND dep.deptype IN ('a', 'i')
        JOIN pg_class s ON s.oid = dep.objid AND s.relkind = 'S'
        JOIN pg_namespace sn ON sn.oid = s.relnamespace
        JOIN pg_sequence q ON q.seqrelid = s.oid
        WHERE n.nspname = 'public' AND t.relname IN ('google_reviews', 'google_reviews_locales')
      )
    ) AS schema
  `)

  return rows[0]?.schema as GoogleReviewsSchema
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const { rows } = await db.execute(sql`
    SELECT
      to_regclass('public.google_reviews') IS NOT NULL AS has_reviews,
      to_regclass('public.google_reviews_locales') IS NOT NULL AS has_locales
  `)
  const existence = rows[0] as { has_reviews: boolean; has_locales: boolean }
  const { has_reviews: hasReviews, has_locales: hasLocales } = existence

  if (!hasReviews && !hasLocales) {
    await db.execute(sql`
      CREATE TABLE "google_reviews" (
        "id" serial PRIMARY KEY NOT NULL,
        "enabled" boolean DEFAULT false,
        "place_id" varchar,
        "review_limit" numeric DEFAULT 5,
        "maps_url" varchar DEFAULT 'https://maps.app.goo.gl/zUhpC9PNhgwM69qp6',
        "write_review_url" varchar DEFAULT 'https://g.page/r/CZ5_iPy3nYpdEBM/review',
        "updated_at" timestamp(3) with time zone,
        "created_at" timestamp(3) with time zone
      );

      CREATE TABLE "google_reviews_locales" (
        "heading" varchar DEFAULT 'What Our Customers Say',
        "subheading" varchar,
        "id" serial PRIMARY KEY NOT NULL,
        "_locale" "_locales" NOT NULL,
        "_parent_id" integer NOT NULL
      );

      ALTER TABLE "google_reviews_locales" ADD CONSTRAINT "google_reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."google_reviews"("id") ON DELETE cascade ON UPDATE no action;
      CREATE UNIQUE INDEX "google_reviews_locales_locale_parent_id_unique" ON "google_reviews_locales" USING btree ("_locale", "_parent_id");
    `)
    return
  }

  if (hasReviews !== hasLocales) {
    throw new Error('Google Reviews schema reconciliation refused: only one of google_reviews and google_reviews_locales exists.')
  }

  const actualSchema = await readGoogleReviewsSchema(db)
  const canonicalize = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(canonicalize)
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, nested]) => [key, canonicalize(nested)]),
      )
    }
    return value
  }

  if (JSON.stringify(canonicalize(actualSchema)) !== JSON.stringify(canonicalize(expectedSchema))) {
    throw new Error(`Google Reviews schema reconciliation refused: existing schema does not exactly match the migration. Actual schema: ${JSON.stringify(actualSchema)}`)
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error('Google Reviews migration cannot be rolled back automatically because its schema may have existed before migration reconciliation.')
}
