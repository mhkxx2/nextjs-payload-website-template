import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Curtains & Blinds catalogue collections. Safe to re-run when tables already exist. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_curtain_blind_categories_type" AS ENUM('curtain', 'blind');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_curtain_blind_products_product_type" AS ENUM('curtain', 'blind');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_curtain_blind_products_badge" AS ENUM('none', 'on-sale', 'new-in', 'most-selling', 'hot-selling');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE IF NOT EXISTS "curtain_blind_categories" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar NOT NULL,
      "type" "enum_curtain_blind_categories_type" NOT NULL,
      "parent_id" integer,
      "short_description" varchar,
      "featured_image_id" integer,
      "seo_title" varchar,
      "meta_description" varchar,
      "sort_order" numeric DEFAULT 1000 NOT NULL,
      "active" boolean DEFAULT true NOT NULL,
      "featured_on_shop" boolean DEFAULT false,
      "source_site" varchar DEFAULT 'curtainsandblind.ae',
      "source_u_r_l" varchar,
      "source_id" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "curtain_blind_products" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar NOT NULL,
      "product_type" "enum_curtain_blind_products_product_type" NOT NULL,
      "featured_image_id" integer NOT NULL,
      "sku" varchar,
      "regular_price" numeric,
      "sale_price" numeric,
      "price_suffix" varchar DEFAULT '',
      "badge" "enum_curtain_blind_products_badge" DEFAULT 'none',
      "short_description" varchar,
      "full_description" varchar,
      "sort_order" numeric DEFAULT 1000 NOT NULL,
      "featured" boolean DEFAULT false,
      "active" boolean DEFAULT true NOT NULL,
      "seo_title" varchar,
      "meta_description" varchar,
      "source_site" varchar DEFAULT 'curtainsandblind.ae' NOT NULL,
      "source_u_r_l" varchar NOT NULL,
      "source_id" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "curtain_blind_products_gallery" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "curtain_blind_products_features" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "curtain_blind_products_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "curtain_blind_categories_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "curtain_blind_categories"
        ADD CONSTRAINT "curtain_blind_categories_parent_id_curtain_blind_categories_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."curtain_blind_categories"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "curtain_blind_categories"
        ADD CONSTRAINT "curtain_blind_categories_featured_image_id_media_id_fk"
        FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "curtain_blind_products"
        ADD CONSTRAINT "curtain_blind_products_featured_image_id_media_id_fk"
        FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "curtain_blind_products_gallery"
        ADD CONSTRAINT "curtain_blind_products_gallery_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "curtain_blind_products_gallery"
        ADD CONSTRAINT "curtain_blind_products_gallery_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."curtain_blind_products"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "curtain_blind_products_features"
        ADD CONSTRAINT "curtain_blind_products_features_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."curtain_blind_products"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "curtain_blind_products_rels"
        ADD CONSTRAINT "curtain_blind_products_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."curtain_blind_products"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "curtain_blind_products_rels"
        ADD CONSTRAINT "curtain_blind_products_rels_curtain_blind_categories_fk"
        FOREIGN KEY ("curtain_blind_categories_id") REFERENCES "public"."curtain_blind_categories"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "curtain_blind_categories_slug_idx" ON "curtain_blind_categories" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "curtain_blind_categories_type_idx" ON "curtain_blind_categories" USING btree ("type");
    CREATE INDEX IF NOT EXISTS "curtain_blind_categories_parent_idx" ON "curtain_blind_categories" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "curtain_blind_categories_featured_image_idx" ON "curtain_blind_categories" USING btree ("featured_image_id");
    CREATE INDEX IF NOT EXISTS "curtain_blind_categories_sort_order_idx" ON "curtain_blind_categories" USING btree ("sort_order");
    CREATE INDEX IF NOT EXISTS "curtain_blind_categories_active_idx" ON "curtain_blind_categories" USING btree ("active");
    CREATE INDEX IF NOT EXISTS "curtain_blind_categories_featured_on_shop_idx" ON "curtain_blind_categories" USING btree ("featured_on_shop");
    CREATE UNIQUE INDEX IF NOT EXISTS "curtain_blind_categories_source_u_r_l_idx" ON "curtain_blind_categories" USING btree ("source_u_r_l");
    CREATE INDEX IF NOT EXISTS "curtain_blind_categories_source_id_idx" ON "curtain_blind_categories" USING btree ("source_id");
    CREATE INDEX IF NOT EXISTS "curtain_blind_categories_updated_at_idx" ON "curtain_blind_categories" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "curtain_blind_categories_created_at_idx" ON "curtain_blind_categories" USING btree ("created_at");

    CREATE UNIQUE INDEX IF NOT EXISTS "curtain_blind_products_slug_idx" ON "curtain_blind_products" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_product_type_idx" ON "curtain_blind_products" USING btree ("product_type");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_featured_image_idx" ON "curtain_blind_products" USING btree ("featured_image_id");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_sku_idx" ON "curtain_blind_products" USING btree ("sku");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_badge_idx" ON "curtain_blind_products" USING btree ("badge");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_sort_order_idx" ON "curtain_blind_products" USING btree ("sort_order");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_featured_idx" ON "curtain_blind_products" USING btree ("featured");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_active_idx" ON "curtain_blind_products" USING btree ("active");
    CREATE UNIQUE INDEX IF NOT EXISTS "curtain_blind_products_source_u_r_l_idx" ON "curtain_blind_products" USING btree ("source_u_r_l");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_source_id_idx" ON "curtain_blind_products" USING btree ("source_id");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_updated_at_idx" ON "curtain_blind_products" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_created_at_idx" ON "curtain_blind_products" USING btree ("created_at");

    CREATE INDEX IF NOT EXISTS "curtain_blind_products_gallery_order_idx" ON "curtain_blind_products_gallery" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_gallery_parent_id_idx" ON "curtain_blind_products_gallery" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_gallery_image_idx" ON "curtain_blind_products_gallery" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "curtain_blind_products_features_order_idx" ON "curtain_blind_products_features" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_features_parent_id_idx" ON "curtain_blind_products_features" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "curtain_blind_products_rels_order_idx" ON "curtain_blind_products_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_rels_parent_idx" ON "curtain_blind_products_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_rels_path_idx" ON "curtain_blind_products_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "curtain_blind_products_rels_curtain_blind_categories_id_idx" ON "curtain_blind_products_rels" USING btree ("curtain_blind_categories_id");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "curtain_blind_categories_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "curtain_blind_products_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_curtain_blind_categories_fk"
        FOREIGN KEY ("curtain_blind_categories_id") REFERENCES "public"."curtain_blind_categories"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_curtain_blind_products_fk"
        FOREIGN KEY ("curtain_blind_products_id") REFERENCES "public"."curtain_blind_products"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_curtain_blind_categories_id_idx"
      ON "payload_locked_documents_rels" USING btree ("curtain_blind_categories_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_curtain_blind_products_id_idx"
      ON "payload_locked_documents_rels" USING btree ("curtain_blind_products_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_curtain_blind_categories_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_curtain_blind_products_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_curtain_blind_categories_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_curtain_blind_products_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "curtain_blind_categories_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "curtain_blind_products_id";
    DROP TABLE IF EXISTS "curtain_blind_products_rels" CASCADE;
    DROP TABLE IF EXISTS "curtain_blind_products_features" CASCADE;
    DROP TABLE IF EXISTS "curtain_blind_products_gallery" CASCADE;
    DROP TABLE IF EXISTS "curtain_blind_products" CASCADE;
    DROP TABLE IF EXISTS "curtain_blind_categories" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_curtain_blind_products_badge";
    DROP TYPE IF EXISTS "public"."enum_curtain_blind_products_product_type";
    DROP TYPE IF EXISTS "public"."enum_curtain_blind_categories_type";
  `)
}
