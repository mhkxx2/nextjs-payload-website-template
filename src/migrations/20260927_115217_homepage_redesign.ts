import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_areas_group" AS ENUM('dubai', 'sharjah', 'ras-al-khaimah', 'other-uae');
  CREATE TYPE "public"."enum_areas_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__areas_v_version_group" AS ENUM('dubai', 'sharjah', 'ras-al-khaimah', 'other-uae');
  CREATE TYPE "public"."enum__areas_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__areas_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_lead_media_purpose" AS ENUM('quotation-reference');
  CREATE TYPE "public"."enum_homepage_blocks_custom_furniture_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_homepage_blocks_upholstery_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_homepage_blocks_majlis_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_blocks_custom_furniture_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__homepage_v_blocks_upholstery_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__homepage_v_blocks_majlis_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_published_locale" AS ENUM('en');
  ALTER TYPE "public"."enum_header_navigation_destination" ADD VALUE 'areas' BEFORE 'blog';
  CREATE TABLE "areas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"group" "enum_areas_group",
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"landing_page_id" integer,
  	"status" "enum_areas_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_areas_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "areas_locales" (
  	"name" varchar,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_areas_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_group" "enum__areas_v_version_group",
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_landing_page_id" integer,
  	"version_status" "enum__areas_v_version_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__areas_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__areas_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_areas_v_locales" (
  	"version_name" varchar,
  	"version_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "lead_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"original_name" varchar NOT NULL,
  	"purpose" "enum_lead_media_purpose" DEFAULT 'quotation-reference' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_preview_url" varchar,
  	"sizes_preview_width" numeric,
  	"sizes_preview_height" numeric,
  	"sizes_preview_mime_type" varchar,
  	"sizes_preview_filesize" numeric,
  	"sizes_preview_filename" varchar
  );
  
  CREATE TABLE "homepage_trust_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_trust_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_services_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_custom_furniture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"image_id" integer,
  	"image_position" "enum_homepage_blocks_custom_furniture_image_position" DEFAULT 'right',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_custom_furniture_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_upholstery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"image_id" integer,
  	"image_position" "enum_homepage_blocks_upholstery_image_position" DEFAULT 'right',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_upholstery_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_majlis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"image_id" integer,
  	"image_position" "enum_homepage_blocks_majlis_image_position" DEFAULT 'right',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_majlis_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_projects_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_process_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_process_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_why_choose_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_why_choose_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_why_choose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_why_choose_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_areas_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_local_content_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_local_content_paragraphs_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_local_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_local_content_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_testimonials_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"enable_schema" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_faqs_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_final_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_final_cta_locales" (
  	"heading" varchar,
  	"description" varchar,
  	"whats_app_label" varchar,
  	"quote_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_image_id" integer,
  	"hero_enabled" boolean DEFAULT true,
  	"hero_image_id" integer,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_copy" varchar,
  	"hero_primary_label" varchar,
  	"hero_whats_app_label" varchar,
  	"hero_trust_line" varchar,
  	"hero_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"projects_id" integer,
  	"areas_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "_homepage_v_version_trust_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_trust_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_services_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_custom_furniture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"image_id" integer,
  	"image_position" "enum__homepage_v_blocks_custom_furniture_image_position" DEFAULT 'right',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_custom_furniture_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_upholstery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"image_id" integer,
  	"image_position" "enum__homepage_v_blocks_upholstery_image_position" DEFAULT 'right',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_upholstery_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_majlis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"image_id" integer,
  	"image_position" "enum__homepage_v_blocks_majlis_image_position" DEFAULT 'right',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_majlis_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_projects_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_process_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_process_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_why_choose_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_why_choose_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_why_choose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_why_choose_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_areas_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_local_content_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_local_content_paragraphs_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_local_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_local_content_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_testimonials_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"enable_schema" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_faqs_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_blocks_final_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_final_cta_locales" (
  	"heading" varchar,
  	"description" varchar,
  	"whats_app_label" varchar,
  	"quote_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_seo_image_id" integer,
  	"version_hero_enabled" boolean DEFAULT true,
  	"version_hero_image_id" integer,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__homepage_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_homepage_v_locales" (
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_copy" varchar,
  	"version_hero_primary_label" varchar,
  	"version_hero_whats_app_label" varchar,
  	"version_hero_trust_line" varchar,
  	"version_hero_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"projects_id" integer,
  	"areas_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer
  );
  
  ALTER TABLE "leads" DROP CONSTRAINT "leads_reference_media_id_media_id_fk";
  
  UPDATE "seo_defaults"
  SET "local_business_schema_business_type" = 'LocalBusiness'
  WHERE "local_business_schema_business_type" = 'FurnitureStore';
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_schema_business_type" SET DATA TYPE text;
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_schema_business_type" SET DEFAULT 'LocalBusiness'::text;
  DROP TYPE "public"."enum_seo_defaults_local_business_schema_business_type";
  CREATE TYPE "public"."enum_seo_defaults_local_business_schema_business_type" AS ENUM('LocalBusiness');
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_schema_business_type" SET DEFAULT 'LocalBusiness'::"public"."enum_seo_defaults_local_business_schema_business_type";
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_schema_business_type" SET DATA TYPE "public"."enum_seo_defaults_local_business_schema_business_type" USING "local_business_schema_business_type"::"public"."enum_seo_defaults_local_business_schema_business_type";
  ALTER TABLE "projects" ADD COLUMN "before_image_id" integer;
  ALTER TABLE "projects" ADD COLUMN "after_image_id" integer;
  ALTER TABLE "projects" ADD COLUMN "verified" boolean DEFAULT false;
  ALTER TABLE "_projects_v" ADD COLUMN "version_before_image_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_after_image_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_verified" boolean DEFAULT false;
  ALTER TABLE "leads" ADD COLUMN "area" varchar;
  UPDATE "leads" SET "area" = 'Not specified (legacy)' WHERE "area" IS NULL;
  ALTER TABLE "leads" ALTER COLUMN "area" SET NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "areas_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_media_id" integer;
  ALTER TABLE "areas" ADD CONSTRAINT "areas_landing_page_id_pages_id_fk" FOREIGN KEY ("landing_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "areas" ADD CONSTRAINT "areas_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "areas" ADD CONSTRAINT "areas_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "areas_locales" ADD CONSTRAINT "areas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_areas_v" ADD CONSTRAINT "_areas_v_parent_id_areas_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_areas_v" ADD CONSTRAINT "_areas_v_version_landing_page_id_pages_id_fk" FOREIGN KEY ("version_landing_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_areas_v" ADD CONSTRAINT "_areas_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_areas_v" ADD CONSTRAINT "_areas_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_areas_v_locales" ADD CONSTRAINT "_areas_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_areas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_trust_items" ADD CONSTRAINT "homepage_trust_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_trust_items_locales" ADD CONSTRAINT "homepage_trust_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_trust_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_services" ADD CONSTRAINT "homepage_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_services_locales" ADD CONSTRAINT "homepage_blocks_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_custom_furniture" ADD CONSTRAINT "homepage_blocks_custom_furniture_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_custom_furniture" ADD CONSTRAINT "homepage_blocks_custom_furniture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_custom_furniture_locales" ADD CONSTRAINT "homepage_blocks_custom_furniture_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_custom_furniture"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_upholstery" ADD CONSTRAINT "homepage_blocks_upholstery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_upholstery" ADD CONSTRAINT "homepage_blocks_upholstery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_upholstery_locales" ADD CONSTRAINT "homepage_blocks_upholstery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_upholstery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_majlis" ADD CONSTRAINT "homepage_blocks_majlis_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_majlis" ADD CONSTRAINT "homepage_blocks_majlis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_majlis_locales" ADD CONSTRAINT "homepage_blocks_majlis_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_majlis"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_projects" ADD CONSTRAINT "homepage_blocks_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_projects_locales" ADD CONSTRAINT "homepage_blocks_projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_process_steps" ADD CONSTRAINT "homepage_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_process_steps_locales" ADD CONSTRAINT "homepage_blocks_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_process" ADD CONSTRAINT "homepage_blocks_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_process_locales" ADD CONSTRAINT "homepage_blocks_process_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_why_choose_items" ADD CONSTRAINT "homepage_blocks_why_choose_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_why_choose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_why_choose_items_locales" ADD CONSTRAINT "homepage_blocks_why_choose_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_why_choose_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_why_choose" ADD CONSTRAINT "homepage_blocks_why_choose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_why_choose_locales" ADD CONSTRAINT "homepage_blocks_why_choose_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_why_choose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_areas" ADD CONSTRAINT "homepage_blocks_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_areas_locales" ADD CONSTRAINT "homepage_blocks_areas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_local_content_paragraphs" ADD CONSTRAINT "homepage_blocks_local_content_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_local_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_local_content_paragraphs_locales" ADD CONSTRAINT "homepage_blocks_local_content_paragraphs_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_local_content_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_local_content" ADD CONSTRAINT "homepage_blocks_local_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_local_content_locales" ADD CONSTRAINT "homepage_blocks_local_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_local_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_testimonials" ADD CONSTRAINT "homepage_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_testimonials_locales" ADD CONSTRAINT "homepage_blocks_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faqs" ADD CONSTRAINT "homepage_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faqs_locales" ADD CONSTRAINT "homepage_blocks_faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_final_cta" ADD CONSTRAINT "homepage_blocks_final_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_final_cta_locales" ADD CONSTRAINT "homepage_blocks_final_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_final_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_locales" ADD CONSTRAINT "homepage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_areas_fk" FOREIGN KEY ("areas_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_trust_items" ADD CONSTRAINT "_homepage_v_version_trust_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_trust_items_locales" ADD CONSTRAINT "_homepage_v_version_trust_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_trust_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_services" ADD CONSTRAINT "_homepage_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_services_locales" ADD CONSTRAINT "_homepage_v_blocks_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_custom_furniture" ADD CONSTRAINT "_homepage_v_blocks_custom_furniture_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_custom_furniture" ADD CONSTRAINT "_homepage_v_blocks_custom_furniture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_custom_furniture_locales" ADD CONSTRAINT "_homepage_v_blocks_custom_furniture_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_custom_furniture"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_upholstery" ADD CONSTRAINT "_homepage_v_blocks_upholstery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_upholstery" ADD CONSTRAINT "_homepage_v_blocks_upholstery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_upholstery_locales" ADD CONSTRAINT "_homepage_v_blocks_upholstery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_upholstery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_majlis" ADD CONSTRAINT "_homepage_v_blocks_majlis_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_majlis" ADD CONSTRAINT "_homepage_v_blocks_majlis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_majlis_locales" ADD CONSTRAINT "_homepage_v_blocks_majlis_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_majlis"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_projects" ADD CONSTRAINT "_homepage_v_blocks_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_projects_locales" ADD CONSTRAINT "_homepage_v_blocks_projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_process_steps" ADD CONSTRAINT "_homepage_v_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_process_steps_locales" ADD CONSTRAINT "_homepage_v_blocks_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_process" ADD CONSTRAINT "_homepage_v_blocks_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_process_locales" ADD CONSTRAINT "_homepage_v_blocks_process_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_why_choose_items" ADD CONSTRAINT "_homepage_v_blocks_why_choose_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_why_choose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_why_choose_items_locales" ADD CONSTRAINT "_homepage_v_blocks_why_choose_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_why_choose_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_why_choose" ADD CONSTRAINT "_homepage_v_blocks_why_choose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_why_choose_locales" ADD CONSTRAINT "_homepage_v_blocks_why_choose_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_why_choose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_areas" ADD CONSTRAINT "_homepage_v_blocks_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_areas_locales" ADD CONSTRAINT "_homepage_v_blocks_areas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_local_content_paragraphs" ADD CONSTRAINT "_homepage_v_blocks_local_content_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_local_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_local_content_paragraphs_locales" ADD CONSTRAINT "_homepage_v_blocks_local_content_paragraphs_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_local_content_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_local_content" ADD CONSTRAINT "_homepage_v_blocks_local_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_local_content_locales" ADD CONSTRAINT "_homepage_v_blocks_local_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_local_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_testimonials" ADD CONSTRAINT "_homepage_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_testimonials_locales" ADD CONSTRAINT "_homepage_v_blocks_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_faqs" ADD CONSTRAINT "_homepage_v_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_faqs_locales" ADD CONSTRAINT "_homepage_v_blocks_faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_final_cta" ADD CONSTRAINT "_homepage_v_blocks_final_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_final_cta_locales" ADD CONSTRAINT "_homepage_v_blocks_final_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_final_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_locales" ADD CONSTRAINT "_homepage_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_areas_fk" FOREIGN KEY ("areas_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "areas_slug_idx" ON "areas" USING btree ("slug");
  CREATE INDEX "areas_featured_idx" ON "areas" USING btree ("featured");
  CREATE INDEX "areas_order_idx" ON "areas" USING btree ("order");
  CREATE INDEX "areas_landing_page_idx" ON "areas" USING btree ("landing_page_id");
  CREATE INDEX "areas_status_idx" ON "areas" USING btree ("status");
  CREATE INDEX "areas_published_at_idx" ON "areas" USING btree ("published_at");
  CREATE INDEX "areas_created_by_idx" ON "areas" USING btree ("created_by_id");
  CREATE INDEX "areas_updated_by_idx" ON "areas" USING btree ("updated_by_id");
  CREATE INDEX "areas_updated_at_idx" ON "areas" USING btree ("updated_at");
  CREATE INDEX "areas_created_at_idx" ON "areas" USING btree ("created_at");
  CREATE INDEX "areas__status_idx" ON "areas" USING btree ("_status");
  CREATE UNIQUE INDEX "areas_locales_locale_parent_id_unique" ON "areas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_areas_v_parent_idx" ON "_areas_v" USING btree ("parent_id");
  CREATE INDEX "_areas_v_version_version_slug_idx" ON "_areas_v" USING btree ("version_slug");
  CREATE INDEX "_areas_v_version_version_featured_idx" ON "_areas_v" USING btree ("version_featured");
  CREATE INDEX "_areas_v_version_version_order_idx" ON "_areas_v" USING btree ("version_order");
  CREATE INDEX "_areas_v_version_version_landing_page_idx" ON "_areas_v" USING btree ("version_landing_page_id");
  CREATE INDEX "_areas_v_version_version_status_idx" ON "_areas_v" USING btree ("version_status");
  CREATE INDEX "_areas_v_version_version_published_at_idx" ON "_areas_v" USING btree ("version_published_at");
  CREATE INDEX "_areas_v_version_version_created_by_idx" ON "_areas_v" USING btree ("version_created_by_id");
  CREATE INDEX "_areas_v_version_version_updated_by_idx" ON "_areas_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_areas_v_version_version_updated_at_idx" ON "_areas_v" USING btree ("version_updated_at");
  CREATE INDEX "_areas_v_version_version_created_at_idx" ON "_areas_v" USING btree ("version_created_at");
  CREATE INDEX "_areas_v_version_version__status_idx" ON "_areas_v" USING btree ("version__status");
  CREATE INDEX "_areas_v_created_at_idx" ON "_areas_v" USING btree ("created_at");
  CREATE INDEX "_areas_v_updated_at_idx" ON "_areas_v" USING btree ("updated_at");
  CREATE INDEX "_areas_v_snapshot_idx" ON "_areas_v" USING btree ("snapshot");
  CREATE INDEX "_areas_v_published_locale_idx" ON "_areas_v" USING btree ("published_locale");
  CREATE INDEX "_areas_v_latest_idx" ON "_areas_v" USING btree ("latest");
  CREATE INDEX "_areas_v_autosave_idx" ON "_areas_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_areas_v_locales_locale_parent_id_unique" ON "_areas_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "lead_media_updated_at_idx" ON "lead_media" USING btree ("updated_at");
  CREATE INDEX "lead_media_created_at_idx" ON "lead_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "lead_media_filename_idx" ON "lead_media" USING btree ("filename");
  CREATE INDEX "lead_media_sizes_preview_sizes_preview_filename_idx" ON "lead_media" USING btree ("sizes_preview_filename");
  CREATE INDEX "homepage_trust_items_order_idx" ON "homepage_trust_items" USING btree ("_order");
  CREATE INDEX "homepage_trust_items_parent_id_idx" ON "homepage_trust_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_trust_items_locales_locale_parent_id_unique" ON "homepage_trust_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_services_order_idx" ON "homepage_blocks_services" USING btree ("_order");
  CREATE INDEX "homepage_blocks_services_parent_id_idx" ON "homepage_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_services_path_idx" ON "homepage_blocks_services" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_services_locales_locale_parent_id_unique" ON "homepage_blocks_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_custom_furniture_order_idx" ON "homepage_blocks_custom_furniture" USING btree ("_order");
  CREATE INDEX "homepage_blocks_custom_furniture_parent_id_idx" ON "homepage_blocks_custom_furniture" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_custom_furniture_path_idx" ON "homepage_blocks_custom_furniture" USING btree ("_path");
  CREATE INDEX "homepage_blocks_custom_furniture_image_idx" ON "homepage_blocks_custom_furniture" USING btree ("image_id");
  CREATE UNIQUE INDEX "homepage_blocks_custom_furniture_locales_locale_parent_id_un" ON "homepage_blocks_custom_furniture_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_upholstery_order_idx" ON "homepage_blocks_upholstery" USING btree ("_order");
  CREATE INDEX "homepage_blocks_upholstery_parent_id_idx" ON "homepage_blocks_upholstery" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_upholstery_path_idx" ON "homepage_blocks_upholstery" USING btree ("_path");
  CREATE INDEX "homepage_blocks_upholstery_image_idx" ON "homepage_blocks_upholstery" USING btree ("image_id");
  CREATE UNIQUE INDEX "homepage_blocks_upholstery_locales_locale_parent_id_unique" ON "homepage_blocks_upholstery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_majlis_order_idx" ON "homepage_blocks_majlis" USING btree ("_order");
  CREATE INDEX "homepage_blocks_majlis_parent_id_idx" ON "homepage_blocks_majlis" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_majlis_path_idx" ON "homepage_blocks_majlis" USING btree ("_path");
  CREATE INDEX "homepage_blocks_majlis_image_idx" ON "homepage_blocks_majlis" USING btree ("image_id");
  CREATE UNIQUE INDEX "homepage_blocks_majlis_locales_locale_parent_id_unique" ON "homepage_blocks_majlis_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_projects_order_idx" ON "homepage_blocks_projects" USING btree ("_order");
  CREATE INDEX "homepage_blocks_projects_parent_id_idx" ON "homepage_blocks_projects" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_projects_path_idx" ON "homepage_blocks_projects" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_projects_locales_locale_parent_id_unique" ON "homepage_blocks_projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_process_steps_order_idx" ON "homepage_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "homepage_blocks_process_steps_parent_id_idx" ON "homepage_blocks_process_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_blocks_process_steps_locales_locale_parent_id_uniqu" ON "homepage_blocks_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_process_order_idx" ON "homepage_blocks_process" USING btree ("_order");
  CREATE INDEX "homepage_blocks_process_parent_id_idx" ON "homepage_blocks_process" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_process_path_idx" ON "homepage_blocks_process" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_process_locales_locale_parent_id_unique" ON "homepage_blocks_process_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_why_choose_items_order_idx" ON "homepage_blocks_why_choose_items" USING btree ("_order");
  CREATE INDEX "homepage_blocks_why_choose_items_parent_id_idx" ON "homepage_blocks_why_choose_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_blocks_why_choose_items_locales_locale_parent_id_un" ON "homepage_blocks_why_choose_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_why_choose_order_idx" ON "homepage_blocks_why_choose" USING btree ("_order");
  CREATE INDEX "homepage_blocks_why_choose_parent_id_idx" ON "homepage_blocks_why_choose" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_why_choose_path_idx" ON "homepage_blocks_why_choose" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_why_choose_locales_locale_parent_id_unique" ON "homepage_blocks_why_choose_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_areas_order_idx" ON "homepage_blocks_areas" USING btree ("_order");
  CREATE INDEX "homepage_blocks_areas_parent_id_idx" ON "homepage_blocks_areas" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_areas_path_idx" ON "homepage_blocks_areas" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_areas_locales_locale_parent_id_unique" ON "homepage_blocks_areas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_local_content_paragraphs_order_idx" ON "homepage_blocks_local_content_paragraphs" USING btree ("_order");
  CREATE INDEX "homepage_blocks_local_content_paragraphs_parent_id_idx" ON "homepage_blocks_local_content_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_blocks_local_content_paragraphs_locales_locale_pare" ON "homepage_blocks_local_content_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_local_content_order_idx" ON "homepage_blocks_local_content" USING btree ("_order");
  CREATE INDEX "homepage_blocks_local_content_parent_id_idx" ON "homepage_blocks_local_content" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_local_content_path_idx" ON "homepage_blocks_local_content" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_local_content_locales_locale_parent_id_uniqu" ON "homepage_blocks_local_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_testimonials_order_idx" ON "homepage_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "homepage_blocks_testimonials_parent_id_idx" ON "homepage_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_testimonials_path_idx" ON "homepage_blocks_testimonials" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_testimonials_locales_locale_parent_id_unique" ON "homepage_blocks_testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_faqs_order_idx" ON "homepage_blocks_faqs" USING btree ("_order");
  CREATE INDEX "homepage_blocks_faqs_parent_id_idx" ON "homepage_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_faqs_path_idx" ON "homepage_blocks_faqs" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_faqs_locales_locale_parent_id_unique" ON "homepage_blocks_faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_final_cta_order_idx" ON "homepage_blocks_final_cta" USING btree ("_order");
  CREATE INDEX "homepage_blocks_final_cta_parent_id_idx" ON "homepage_blocks_final_cta" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_final_cta_path_idx" ON "homepage_blocks_final_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_final_cta_locales_locale_parent_id_unique" ON "homepage_blocks_final_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_seo_seo_image_idx" ON "homepage" USING btree ("seo_image_id");
  CREATE INDEX "homepage_hero_hero_image_idx" ON "homepage" USING btree ("hero_image_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE UNIQUE INDEX "homepage_locales_locale_parent_id_unique" ON "homepage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_services_id_idx" ON "homepage_rels" USING btree ("services_id");
  CREATE INDEX "homepage_rels_projects_id_idx" ON "homepage_rels" USING btree ("projects_id");
  CREATE INDEX "homepage_rels_areas_id_idx" ON "homepage_rels" USING btree ("areas_id");
  CREATE INDEX "homepage_rels_testimonials_id_idx" ON "homepage_rels" USING btree ("testimonials_id");
  CREATE INDEX "homepage_rels_faqs_id_idx" ON "homepage_rels" USING btree ("faqs_id");
  CREATE INDEX "_homepage_v_version_trust_items_order_idx" ON "_homepage_v_version_trust_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_trust_items_parent_id_idx" ON "_homepage_v_version_trust_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_homepage_v_version_trust_items_locales_locale_parent_id_uni" ON "_homepage_v_version_trust_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_services_order_idx" ON "_homepage_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_services_parent_id_idx" ON "_homepage_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_services_path_idx" ON "_homepage_v_blocks_services" USING btree ("_path");
  CREATE UNIQUE INDEX "_homepage_v_blocks_services_locales_locale_parent_id_unique" ON "_homepage_v_blocks_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_custom_furniture_order_idx" ON "_homepage_v_blocks_custom_furniture" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_custom_furniture_parent_id_idx" ON "_homepage_v_blocks_custom_furniture" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_custom_furniture_path_idx" ON "_homepage_v_blocks_custom_furniture" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_custom_furniture_image_idx" ON "_homepage_v_blocks_custom_furniture" USING btree ("image_id");
  CREATE UNIQUE INDEX "_homepage_v_blocks_custom_furniture_locales_locale_parent_id" ON "_homepage_v_blocks_custom_furniture_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_upholstery_order_idx" ON "_homepage_v_blocks_upholstery" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_upholstery_parent_id_idx" ON "_homepage_v_blocks_upholstery" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_upholstery_path_idx" ON "_homepage_v_blocks_upholstery" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_upholstery_image_idx" ON "_homepage_v_blocks_upholstery" USING btree ("image_id");
  CREATE UNIQUE INDEX "_homepage_v_blocks_upholstery_locales_locale_parent_id_uniqu" ON "_homepage_v_blocks_upholstery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_majlis_order_idx" ON "_homepage_v_blocks_majlis" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_majlis_parent_id_idx" ON "_homepage_v_blocks_majlis" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_majlis_path_idx" ON "_homepage_v_blocks_majlis" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_majlis_image_idx" ON "_homepage_v_blocks_majlis" USING btree ("image_id");
  CREATE UNIQUE INDEX "_homepage_v_blocks_majlis_locales_locale_parent_id_unique" ON "_homepage_v_blocks_majlis_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_projects_order_idx" ON "_homepage_v_blocks_projects" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_projects_parent_id_idx" ON "_homepage_v_blocks_projects" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_projects_path_idx" ON "_homepage_v_blocks_projects" USING btree ("_path");
  CREATE UNIQUE INDEX "_homepage_v_blocks_projects_locales_locale_parent_id_unique" ON "_homepage_v_blocks_projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_process_steps_order_idx" ON "_homepage_v_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_process_steps_parent_id_idx" ON "_homepage_v_blocks_process_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_homepage_v_blocks_process_steps_locales_locale_parent_id_un" ON "_homepage_v_blocks_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_process_order_idx" ON "_homepage_v_blocks_process" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_process_parent_id_idx" ON "_homepage_v_blocks_process" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_process_path_idx" ON "_homepage_v_blocks_process" USING btree ("_path");
  CREATE UNIQUE INDEX "_homepage_v_blocks_process_locales_locale_parent_id_unique" ON "_homepage_v_blocks_process_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_why_choose_items_order_idx" ON "_homepage_v_blocks_why_choose_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_why_choose_items_parent_id_idx" ON "_homepage_v_blocks_why_choose_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_homepage_v_blocks_why_choose_items_locales_locale_parent_id" ON "_homepage_v_blocks_why_choose_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_why_choose_order_idx" ON "_homepage_v_blocks_why_choose" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_why_choose_parent_id_idx" ON "_homepage_v_blocks_why_choose" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_why_choose_path_idx" ON "_homepage_v_blocks_why_choose" USING btree ("_path");
  CREATE UNIQUE INDEX "_homepage_v_blocks_why_choose_locales_locale_parent_id_uniqu" ON "_homepage_v_blocks_why_choose_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_areas_order_idx" ON "_homepage_v_blocks_areas" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_areas_parent_id_idx" ON "_homepage_v_blocks_areas" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_areas_path_idx" ON "_homepage_v_blocks_areas" USING btree ("_path");
  CREATE UNIQUE INDEX "_homepage_v_blocks_areas_locales_locale_parent_id_unique" ON "_homepage_v_blocks_areas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_local_content_paragraphs_order_idx" ON "_homepage_v_blocks_local_content_paragraphs" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_local_content_paragraphs_parent_id_idx" ON "_homepage_v_blocks_local_content_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_homepage_v_blocks_local_content_paragraphs_locales_locale_p" ON "_homepage_v_blocks_local_content_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_local_content_order_idx" ON "_homepage_v_blocks_local_content" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_local_content_parent_id_idx" ON "_homepage_v_blocks_local_content" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_local_content_path_idx" ON "_homepage_v_blocks_local_content" USING btree ("_path");
  CREATE UNIQUE INDEX "_homepage_v_blocks_local_content_locales_locale_parent_id_un" ON "_homepage_v_blocks_local_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_testimonials_order_idx" ON "_homepage_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_testimonials_parent_id_idx" ON "_homepage_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_testimonials_path_idx" ON "_homepage_v_blocks_testimonials" USING btree ("_path");
  CREATE UNIQUE INDEX "_homepage_v_blocks_testimonials_locales_locale_parent_id_uni" ON "_homepage_v_blocks_testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_faqs_order_idx" ON "_homepage_v_blocks_faqs" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_faqs_parent_id_idx" ON "_homepage_v_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_faqs_path_idx" ON "_homepage_v_blocks_faqs" USING btree ("_path");
  CREATE UNIQUE INDEX "_homepage_v_blocks_faqs_locales_locale_parent_id_unique" ON "_homepage_v_blocks_faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_blocks_final_cta_order_idx" ON "_homepage_v_blocks_final_cta" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_final_cta_parent_id_idx" ON "_homepage_v_blocks_final_cta" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_final_cta_path_idx" ON "_homepage_v_blocks_final_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_homepage_v_blocks_final_cta_locales_locale_parent_id_unique" ON "_homepage_v_blocks_final_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_seo_version_seo_image_idx" ON "_homepage_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_homepage_v_version_hero_version_hero_image_idx" ON "_homepage_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_snapshot_idx" ON "_homepage_v" USING btree ("snapshot");
  CREATE INDEX "_homepage_v_published_locale_idx" ON "_homepage_v" USING btree ("published_locale");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_autosave_idx" ON "_homepage_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_homepage_v_locales_locale_parent_id_unique" ON "_homepage_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_services_id_idx" ON "_homepage_v_rels" USING btree ("services_id");
  CREATE INDEX "_homepage_v_rels_projects_id_idx" ON "_homepage_v_rels" USING btree ("projects_id");
  CREATE INDEX "_homepage_v_rels_areas_id_idx" ON "_homepage_v_rels" USING btree ("areas_id");
  CREATE INDEX "_homepage_v_rels_testimonials_id_idx" ON "_homepage_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "_homepage_v_rels_faqs_id_idx" ON "_homepage_v_rels" USING btree ("faqs_id");
  ALTER TABLE "projects" ADD CONSTRAINT "projects_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_before_image_id_media_id_fk" FOREIGN KEY ("version_before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_after_image_id_media_id_fk" FOREIGN KEY ("version_after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_reference_media_id_lead_media_id_fk" FOREIGN KEY ("reference_media_id") REFERENCES "public"."lead_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_areas_fk" FOREIGN KEY ("areas_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_media_fk" FOREIGN KEY ("lead_media_id") REFERENCES "public"."lead_media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_before_image_idx" ON "projects" USING btree ("before_image_id");
  CREATE INDEX "projects_after_image_idx" ON "projects" USING btree ("after_image_id");
  CREATE INDEX "projects_verified_idx" ON "projects" USING btree ("verified");
  CREATE INDEX "_projects_v_version_version_before_image_idx" ON "_projects_v" USING btree ("version_before_image_id");
  CREATE INDEX "_projects_v_version_version_after_image_idx" ON "_projects_v" USING btree ("version_after_image_id");
  CREATE INDEX "_projects_v_version_version_verified_idx" ON "_projects_v" USING btree ("version_verified");
  CREATE INDEX "payload_locked_documents_rels_areas_id_idx" ON "payload_locked_documents_rels" USING btree ("areas_id");
  CREATE INDEX "payload_locked_documents_rels_lead_media_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_media_id");
  ALTER TABLE "seo_defaults" DROP COLUMN "local_business_schema_price_range";
  DROP TYPE "public"."enum_seo_defaults_local_business_schema_price_range";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_seo_defaults_local_business_schema_price_range" AS ENUM('moderate', 'premium');
  ALTER TYPE "public"."enum_seo_defaults_local_business_schema_business_type" ADD VALUE 'FurnitureStore' BEFORE 'LocalBusiness';
  ALTER TABLE "areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "areas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_areas_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_areas_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lead_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_trust_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_trust_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_custom_furniture" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_custom_furniture_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_upholstery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_upholstery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_majlis" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_majlis_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_process_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_process_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_why_choose_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_why_choose_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_why_choose" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_why_choose_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_areas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_local_content_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_local_content_paragraphs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_local_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_local_content_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_testimonials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_faqs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_final_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_final_cta_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_version_trust_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_version_trust_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_custom_furniture" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_custom_furniture_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_upholstery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_upholstery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_majlis" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_majlis_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_process_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_process_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_why_choose_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_why_choose_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_why_choose" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_why_choose_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_areas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_local_content_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_local_content_paragraphs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_local_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_local_content_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_testimonials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_faqs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_final_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_final_cta_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "areas" CASCADE;
  DROP TABLE "areas_locales" CASCADE;
  DROP TABLE "_areas_v" CASCADE;
  DROP TABLE "_areas_v_locales" CASCADE;
  DROP TABLE "lead_media" CASCADE;
  DROP TABLE "homepage_trust_items" CASCADE;
  DROP TABLE "homepage_trust_items_locales" CASCADE;
  DROP TABLE "homepage_blocks_services" CASCADE;
  DROP TABLE "homepage_blocks_services_locales" CASCADE;
  DROP TABLE "homepage_blocks_custom_furniture" CASCADE;
  DROP TABLE "homepage_blocks_custom_furniture_locales" CASCADE;
  DROP TABLE "homepage_blocks_upholstery" CASCADE;
  DROP TABLE "homepage_blocks_upholstery_locales" CASCADE;
  DROP TABLE "homepage_blocks_majlis" CASCADE;
  DROP TABLE "homepage_blocks_majlis_locales" CASCADE;
  DROP TABLE "homepage_blocks_projects" CASCADE;
  DROP TABLE "homepage_blocks_projects_locales" CASCADE;
  DROP TABLE "homepage_blocks_process_steps" CASCADE;
  DROP TABLE "homepage_blocks_process_steps_locales" CASCADE;
  DROP TABLE "homepage_blocks_process" CASCADE;
  DROP TABLE "homepage_blocks_process_locales" CASCADE;
  DROP TABLE "homepage_blocks_why_choose_items" CASCADE;
  DROP TABLE "homepage_blocks_why_choose_items_locales" CASCADE;
  DROP TABLE "homepage_blocks_why_choose" CASCADE;
  DROP TABLE "homepage_blocks_why_choose_locales" CASCADE;
  DROP TABLE "homepage_blocks_areas" CASCADE;
  DROP TABLE "homepage_blocks_areas_locales" CASCADE;
  DROP TABLE "homepage_blocks_local_content_paragraphs" CASCADE;
  DROP TABLE "homepage_blocks_local_content_paragraphs_locales" CASCADE;
  DROP TABLE "homepage_blocks_local_content" CASCADE;
  DROP TABLE "homepage_blocks_local_content_locales" CASCADE;
  DROP TABLE "homepage_blocks_testimonials" CASCADE;
  DROP TABLE "homepage_blocks_testimonials_locales" CASCADE;
  DROP TABLE "homepage_blocks_faqs" CASCADE;
  DROP TABLE "homepage_blocks_faqs_locales" CASCADE;
  DROP TABLE "homepage_blocks_final_cta" CASCADE;
  DROP TABLE "homepage_blocks_final_cta_locales" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_locales" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_version_trust_items" CASCADE;
  DROP TABLE "_homepage_v_version_trust_items_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_services" CASCADE;
  DROP TABLE "_homepage_v_blocks_services_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_custom_furniture" CASCADE;
  DROP TABLE "_homepage_v_blocks_custom_furniture_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_upholstery" CASCADE;
  DROP TABLE "_homepage_v_blocks_upholstery_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_majlis" CASCADE;
  DROP TABLE "_homepage_v_blocks_majlis_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_projects" CASCADE;
  DROP TABLE "_homepage_v_blocks_projects_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_process_steps" CASCADE;
  DROP TABLE "_homepage_v_blocks_process_steps_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_process" CASCADE;
  DROP TABLE "_homepage_v_blocks_process_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_why_choose_items" CASCADE;
  DROP TABLE "_homepage_v_blocks_why_choose_items_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_why_choose" CASCADE;
  DROP TABLE "_homepage_v_blocks_why_choose_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_areas" CASCADE;
  DROP TABLE "_homepage_v_blocks_areas_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_local_content_paragraphs" CASCADE;
  DROP TABLE "_homepage_v_blocks_local_content_paragraphs_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_local_content" CASCADE;
  DROP TABLE "_homepage_v_blocks_local_content_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_testimonials" CASCADE;
  DROP TABLE "_homepage_v_blocks_testimonials_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_faqs" CASCADE;
  DROP TABLE "_homepage_v_blocks_faqs_locales" CASCADE;
  DROP TABLE "_homepage_v_blocks_final_cta" CASCADE;
  DROP TABLE "_homepage_v_blocks_final_cta_locales" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_locales" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  ALTER TABLE "projects" DROP CONSTRAINT "projects_before_image_id_media_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_after_image_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_before_image_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_after_image_id_media_id_fk";
  
  ALTER TABLE "leads" DROP CONSTRAINT "leads_reference_media_id_lead_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_areas_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lead_media_fk";
  
  ALTER TABLE "header_navigation" ALTER COLUMN "destination" SET DATA TYPE text;
  DROP TYPE "public"."enum_header_navigation_destination";
  CREATE TYPE "public"."enum_header_navigation_destination" AS ENUM('home', 'services', 'projects', 'blog', 'about', 'contact');
  ALTER TABLE "header_navigation" ALTER COLUMN "destination" SET DATA TYPE "public"."enum_header_navigation_destination" USING "destination"::"public"."enum_header_navigation_destination";
  DROP INDEX "projects_before_image_idx";
  DROP INDEX "projects_after_image_idx";
  DROP INDEX "projects_verified_idx";
  DROP INDEX "_projects_v_version_version_before_image_idx";
  DROP INDEX "_projects_v_version_version_after_image_idx";
  DROP INDEX "_projects_v_version_version_verified_idx";
  DROP INDEX "payload_locked_documents_rels_areas_id_idx";
  DROP INDEX "payload_locked_documents_rels_lead_media_id_idx";
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_schema_business_type" SET DEFAULT 'FurnitureStore';
  ALTER TABLE "seo_defaults" ADD COLUMN "local_business_schema_price_range" "enum_seo_defaults_local_business_schema_price_range";
  ALTER TABLE "leads" ADD CONSTRAINT "leads_reference_media_id_media_id_fk" FOREIGN KEY ("reference_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" DROP COLUMN "before_image_id";
  ALTER TABLE "projects" DROP COLUMN "after_image_id";
  ALTER TABLE "projects" DROP COLUMN "verified";
  ALTER TABLE "_projects_v" DROP COLUMN "version_before_image_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_after_image_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_verified";
  ALTER TABLE "leads" DROP COLUMN "area";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "areas_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lead_media_id";
  DROP TYPE "public"."enum_areas_group";
  DROP TYPE "public"."enum_areas_status";
  DROP TYPE "public"."enum__areas_v_version_group";
  DROP TYPE "public"."enum__areas_v_version_status";
  DROP TYPE "public"."enum__areas_v_published_locale";
  DROP TYPE "public"."enum_lead_media_purpose";
  DROP TYPE "public"."enum_homepage_blocks_custom_furniture_image_position";
  DROP TYPE "public"."enum_homepage_blocks_upholstery_image_position";
  DROP TYPE "public"."enum_homepage_blocks_majlis_image_position";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_blocks_custom_furniture_image_position";
  DROP TYPE "public"."enum__homepage_v_blocks_upholstery_image_position";
  DROP TYPE "public"."enum__homepage_v_blocks_majlis_image_position";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum__homepage_v_published_locale";`)
}
