import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Additive bed upholstery landing schema; safe to re-run when columns already exist from push. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services_bed_popular" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "href" varchar,
      "coming_soon" boolean DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS "services_bed_popular_locales" (
      "title" varchar,
      "description" varchar,
      "cta_label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "services_bed_fabrics" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer
    );

    CREATE TABLE IF NOT EXISTS "services_bed_fabrics_locales" (
      "title" varchar,
      "best_use" varchar,
      "comfort" varchar,
      "durability" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "services_bed_headboards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer
    );

    CREATE TABLE IF NOT EXISTS "services_bed_headboards_locales" (
      "title" varchar,
      "description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "services_bed_types" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "services_bed_types_locales" (
      "title" varchar,
      "description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "services_bed_pad_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "services_bed_pad_items_locales" (
      "text" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_services_bed_popular_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "href" varchar,
      "coming_soon" boolean DEFAULT false,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_services_bed_popular_v_locales" (
      "title" varchar,
      "description" varchar,
      "cta_label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_services_bed_fabrics_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_services_bed_fabrics_v_locales" (
      "title" varchar,
      "best_use" varchar,
      "comfort" varchar,
      "durability" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_services_bed_headboards_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_services_bed_headboards_v_locales" (
      "title" varchar,
      "description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_services_bed_types_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_services_bed_types_v_locales" (
      "title" varchar,
      "description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_services_bed_pad_items_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_services_bed_pad_items_v_locales" (
      "text" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "bed_upholstery_landing_before_after_before_image_id" integer;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "bed_upholstery_landing_before_after_after_image_id" integer;
    ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "bed_upholstery_landing_padding_comfort_heading" varchar;
    ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "bed_upholstery_landing_padding_comfort_copy" varchar;
    ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "bed_upholstery_landing_padding_comfort_cta_label" varchar;
    ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "bed_upholstery_landing_before_after_heading" varchar;
    ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "bed_upholstery_landing_before_after_copy" varchar;
    ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "bed_upholstery_landing_before_after_before_caption" varchar;
    ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "bed_upholstery_landing_before_after_after_caption" varchar;
    ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "sofa_upholstery_landing_bed_teaser_href" varchar;

    ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_bed_upholstery_landing_before_after_before_image_id" integer;
    ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_bed_upholstery_landing_before_after_after_image_id" integer;
    ALTER TABLE "_services_v_locales" ADD COLUMN IF NOT EXISTS "version_bed_upholstery_landing_padding_comfort_heading" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN IF NOT EXISTS "version_bed_upholstery_landing_padding_comfort_copy" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN IF NOT EXISTS "version_bed_upholstery_landing_padding_comfort_cta_label" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN IF NOT EXISTS "version_bed_upholstery_landing_before_after_heading" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN IF NOT EXISTS "version_bed_upholstery_landing_before_after_copy" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN IF NOT EXISTS "version_bed_upholstery_landing_before_after_before_caption" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN IF NOT EXISTS "version_bed_upholstery_landing_before_after_after_caption" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN IF NOT EXISTS "version_sofa_upholstery_landing_bed_teaser_href" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "services_bed_popular" CASCADE;
    DROP TABLE IF EXISTS "services_bed_popular_locales" CASCADE;
    DROP TABLE IF EXISTS "services_bed_fabrics" CASCADE;
    DROP TABLE IF EXISTS "services_bed_fabrics_locales" CASCADE;
    DROP TABLE IF EXISTS "services_bed_headboards" CASCADE;
    DROP TABLE IF EXISTS "services_bed_headboards_locales" CASCADE;
    DROP TABLE IF EXISTS "services_bed_types" CASCADE;
    DROP TABLE IF EXISTS "services_bed_types_locales" CASCADE;
    DROP TABLE IF EXISTS "services_bed_pad_items" CASCADE;
    DROP TABLE IF EXISTS "services_bed_pad_items_locales" CASCADE;
    DROP TABLE IF EXISTS "_services_bed_popular_v" CASCADE;
    DROP TABLE IF EXISTS "_services_bed_popular_v_locales" CASCADE;
    DROP TABLE IF EXISTS "_services_bed_fabrics_v" CASCADE;
    DROP TABLE IF EXISTS "_services_bed_fabrics_v_locales" CASCADE;
    DROP TABLE IF EXISTS "_services_bed_headboards_v" CASCADE;
    DROP TABLE IF EXISTS "_services_bed_headboards_v_locales" CASCADE;
    DROP TABLE IF EXISTS "_services_bed_types_v" CASCADE;
    DROP TABLE IF EXISTS "_services_bed_types_v_locales" CASCADE;
    DROP TABLE IF EXISTS "_services_bed_pad_items_v" CASCADE;
    DROP TABLE IF EXISTS "_services_bed_pad_items_v_locales" CASCADE;

    ALTER TABLE "services" DROP COLUMN IF EXISTS "bed_upholstery_landing_before_after_before_image_id";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "bed_upholstery_landing_before_after_after_image_id";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "bed_upholstery_landing_padding_comfort_heading";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "bed_upholstery_landing_padding_comfort_copy";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "bed_upholstery_landing_padding_comfort_cta_label";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "bed_upholstery_landing_before_after_heading";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "bed_upholstery_landing_before_after_copy";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "bed_upholstery_landing_before_after_before_caption";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "bed_upholstery_landing_before_after_after_caption";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "sofa_upholstery_landing_bed_teaser_href";

    ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_bed_upholstery_landing_before_after_before_image_id";
    ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_bed_upholstery_landing_before_after_after_image_id";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_bed_upholstery_landing_padding_comfort_heading";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_bed_upholstery_landing_padding_comfort_copy";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_bed_upholstery_landing_padding_comfort_cta_label";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_bed_upholstery_landing_before_after_heading";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_bed_upholstery_landing_before_after_copy";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_bed_upholstery_landing_before_after_before_caption";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_bed_upholstery_landing_before_after_after_caption";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_sofa_upholstery_landing_bed_teaser_href";
  `)
}
