import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_portfolio_items_room_category" AS ENUM('bedroom', 'living-room', 'kids-room', 'dining-room', 'bathroom', 'office-study', 'storage');
  CREATE TYPE "public"."enum_portfolio_items_furniture_type" AS ENUM('beds', 'tv-beds', 'bedside-tables', 'dressing-tables', 'chest-of-drawers', 'headboards', 'wardrobes', 'stools', 'sectional-sofas', 'sofas', 'tv-units', 'coffee-tables', 'chairs', 'buffet-tables', 'chaise-lounges', 'daybeds', 'dining-tables', 'hallway-furniture', 'love-seats', 'ottoman-benches', 'bunk-beds', 'single-beds', 'baby-cribs', 'baby-room-drawers', 'bookcases', 'study-tables', 'storage-furniture', 'bathroom-furniture');
  CREATE TYPE "public"."enum_portfolio_items_style" AS ENUM('Modern', 'Minimal', 'Luxury', 'Classic', 'Contemporary');
  ALTER TYPE "public"."enum_header_navigation_destination" ADD VALUE 'portfolio' BEFORE 'projects';
  CREATE TABLE "portfolio_items_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "portfolio_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"room_category" "enum_portfolio_items_room_category" NOT NULL,
  	"furniture_type" "enum_portfolio_items_furniture_type" NOT NULL,
  	"style" "enum_portfolio_items_style",
  	"cover_image_id" integer NOT NULL,
  	"related_service_id" integer NOT NULL,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 1000 NOT NULL,
  	"published" boolean DEFAULT false NOT NULL,
  	"source_site" varchar DEFAULT 'eco-furniture.ae' NOT NULL,
  	"source_u_r_l" varchar NOT NULL,
  	"source_category" varchar NOT NULL,
  	"original_filename" varchar NOT NULL,
  	"is_real_al_rukn_project" boolean DEFAULT false NOT NULL,
  	"seo_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "portfolio_items_locales" (
  	"short_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "leads" ADD COLUMN "portfolio_item_id" integer;
  ALTER TABLE "leads" ADD COLUMN "portfolio_design_title" varchar;
  ALTER TABLE "media" ADD COLUMN "source_site" varchar;
  ALTER TABLE "media" ADD COLUMN "source_category" varchar;
  ALTER TABLE "media" ADD COLUMN "source_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "source_hash" varchar;
  ALTER TABLE "media" ADD COLUMN "import_note" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "portfolio_items_id" integer;
  ALTER TABLE "portfolio_items_gallery" ADD CONSTRAINT "portfolio_items_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_items_gallery" ADD CONSTRAINT "portfolio_items_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_related_service_id_services_id_fk" FOREIGN KEY ("related_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_items_locales" ADD CONSTRAINT "portfolio_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "portfolio_items_gallery_order_idx" ON "portfolio_items_gallery" USING btree ("_order");
  CREATE INDEX "portfolio_items_gallery_parent_id_idx" ON "portfolio_items_gallery" USING btree ("_parent_id");
  CREATE INDEX "portfolio_items_gallery_image_idx" ON "portfolio_items_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "portfolio_items_slug_idx" ON "portfolio_items" USING btree ("slug");
  CREATE INDEX "portfolio_items_room_category_idx" ON "portfolio_items" USING btree ("room_category");
  CREATE INDEX "portfolio_items_furniture_type_idx" ON "portfolio_items" USING btree ("furniture_type");
  CREATE INDEX "portfolio_items_cover_image_idx" ON "portfolio_items" USING btree ("cover_image_id");
  CREATE INDEX "portfolio_items_related_service_idx" ON "portfolio_items" USING btree ("related_service_id");
  CREATE INDEX "portfolio_items_featured_idx" ON "portfolio_items" USING btree ("featured");
  CREATE INDEX "portfolio_items_sort_order_idx" ON "portfolio_items" USING btree ("sort_order");
  CREATE INDEX "portfolio_items_published_idx" ON "portfolio_items" USING btree ("published");
  CREATE UNIQUE INDEX "portfolio_items_source_u_r_l_idx" ON "portfolio_items" USING btree ("source_u_r_l");
  CREATE INDEX "portfolio_items_updated_at_idx" ON "portfolio_items" USING btree ("updated_at");
  CREATE INDEX "portfolio_items_created_at_idx" ON "portfolio_items" USING btree ("created_at");
  CREATE UNIQUE INDEX "portfolio_items_locales_locale_parent_id_unique" ON "portfolio_items_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "leads" ADD CONSTRAINT "leads_portfolio_item_id_portfolio_items_id_fk" FOREIGN KEY ("portfolio_item_id") REFERENCES "public"."portfolio_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_items_fk" FOREIGN KEY ("portfolio_items_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "leads_portfolio_item_idx" ON "leads" USING btree ("portfolio_item_id");
  CREATE INDEX "media_source_hash_idx" ON "media" USING btree ("source_hash");
  CREATE INDEX "payload_locked_documents_rels_portfolio_items_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_items_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "leads" DROP CONSTRAINT IF EXISTS "leads_portfolio_item_id_portfolio_items_id_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_portfolio_items_fk";
  DROP INDEX IF EXISTS "leads_portfolio_item_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_portfolio_items_id_idx";
  ALTER TABLE "portfolio_items_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio_items_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "portfolio_items_gallery" CASCADE;
  DROP TABLE "portfolio_items" CASCADE;
  DROP TABLE "portfolio_items_locales" CASCADE;
  DELETE FROM "header_navigation" WHERE "destination"::text = 'portfolio';
  ALTER TABLE "header_navigation" ALTER COLUMN "destination" SET DATA TYPE text;
  DROP TYPE "public"."enum_header_navigation_destination";
  CREATE TYPE "public"."enum_header_navigation_destination" AS ENUM('home', 'services', 'projects', 'areas', 'blog', 'about', 'contact');
  ALTER TABLE "header_navigation" ALTER COLUMN "destination" SET DATA TYPE "public"."enum_header_navigation_destination" USING "destination"::"public"."enum_header_navigation_destination";
  ALTER TABLE "leads" DROP COLUMN "portfolio_item_id";
  ALTER TABLE "leads" DROP COLUMN "portfolio_design_title";
  ALTER TABLE "media" DROP COLUMN "source_site";
  ALTER TABLE "media" DROP COLUMN "source_category";
  ALTER TABLE "media" DROP COLUMN "source_filename";
  DROP INDEX IF EXISTS "media_source_hash_idx";
  ALTER TABLE "media" DROP COLUMN "source_hash";
  ALTER TABLE "media" DROP COLUMN "import_note";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "portfolio_items_id";
  DROP TYPE "public"."enum_portfolio_items_room_category";
  DROP TYPE "public"."enum_portfolio_items_furniture_type";
  DROP TYPE "public"."enum_portfolio_items_style";`)
}
