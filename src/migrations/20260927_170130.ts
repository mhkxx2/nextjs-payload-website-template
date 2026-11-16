import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_feature_sections_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_services_visual_variant" AS ENUM('image-right', 'full-bleed', 'editorial', 'product');
  CREATE TYPE "public"."enum__services_v_version_feature_sections_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__services_v_version_visual_variant" AS ENUM('image-right', 'full-bleed', 'editorial', 'product');
  CREATE TABLE "services_trust_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_trust_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_service_options_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "services_service_options_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_feature_sections_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_feature_sections_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_feature_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum_services_feature_sections_image_position" DEFAULT 'right'
  );
  
  CREATE TABLE "services_feature_sections_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"copy" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_comparison_left_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_comparison_left_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_comparison_right_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_comparison_right_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_services_v_version_trust_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_trust_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_service_options_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_service_options_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_feature_sections_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_feature_sections_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_feature_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum__services_v_version_feature_sections_image_position" DEFAULT 'right',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_feature_sections_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"copy" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_comparison_left_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_comparison_left_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_comparison_right_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_comparison_right_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "services" ADD COLUMN "visual_variant" "enum_services_visual_variant" DEFAULT 'image-right';
  ALTER TABLE "services_locales" ADD COLUMN "service_options_eyebrow" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "service_options_heading" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "service_options_intro" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "materials_heading" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "process_heading" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "comparison_heading" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "comparison_intro" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "comparison_left_title" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "comparison_right_title" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "gallery_heading" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "gallery_intro" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "service_area_heading" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "service_area_copy" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "area_link_label" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "quotation_context_button_label" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "related_heading" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_visual_variant" "enum__services_v_version_visual_variant" DEFAULT 'image-right';
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_service_options_eyebrow" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_service_options_heading" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_service_options_intro" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_materials_heading" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_process_heading" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_comparison_heading" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_comparison_intro" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_comparison_left_title" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_comparison_right_title" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_gallery_heading" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_gallery_intro" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_service_area_heading" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_service_area_copy" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_area_link_label" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_quotation_context_button_label" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_related_heading" varchar;
  ALTER TABLE "services_trust_items" ADD CONSTRAINT "services_trust_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_trust_items_locales" ADD CONSTRAINT "services_trust_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_trust_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_service_options_items" ADD CONSTRAINT "services_service_options_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_service_options_items" ADD CONSTRAINT "services_service_options_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_service_options_items_locales" ADD CONSTRAINT "services_service_options_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_service_options_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_feature_sections_bullets" ADD CONSTRAINT "services_feature_sections_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_feature_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_feature_sections_bullets_locales" ADD CONSTRAINT "services_feature_sections_bullets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_feature_sections_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_feature_sections" ADD CONSTRAINT "services_feature_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_feature_sections" ADD CONSTRAINT "services_feature_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_feature_sections_locales" ADD CONSTRAINT "services_feature_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_feature_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_comparison_left_items" ADD CONSTRAINT "services_comparison_left_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_comparison_left_items_locales" ADD CONSTRAINT "services_comparison_left_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_comparison_left_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_comparison_right_items" ADD CONSTRAINT "services_comparison_right_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_comparison_right_items_locales" ADD CONSTRAINT "services_comparison_right_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_comparison_right_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_trust_items" ADD CONSTRAINT "_services_v_version_trust_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_trust_items_locales" ADD CONSTRAINT "_services_v_version_trust_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_trust_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_service_options_items" ADD CONSTRAINT "_services_v_version_service_options_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_version_service_options_items" ADD CONSTRAINT "_services_v_version_service_options_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_service_options_items_locales" ADD CONSTRAINT "_services_v_version_service_options_items_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_service_options_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_feature_sections_bullets" ADD CONSTRAINT "_services_v_version_feature_sections_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_feature_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_feature_sections_bullets_locales" ADD CONSTRAINT "_services_v_version_feature_sections_bullets_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_feature_sections_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_feature_sections" ADD CONSTRAINT "_services_v_version_feature_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_version_feature_sections" ADD CONSTRAINT "_services_v_version_feature_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_feature_sections_locales" ADD CONSTRAINT "_services_v_version_feature_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_feature_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_comparison_left_items" ADD CONSTRAINT "_services_v_version_comparison_left_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_comparison_left_items_locales" ADD CONSTRAINT "_services_v_version_comparison_left_items_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_comparison_left_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_comparison_right_items" ADD CONSTRAINT "_services_v_version_comparison_right_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_comparison_right_items_locales" ADD CONSTRAINT "_services_v_version_comparison_right_items_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_comparison_right_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_trust_items_order_idx" ON "services_trust_items" USING btree ("_order");
  CREATE INDEX "services_trust_items_parent_id_idx" ON "services_trust_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_trust_items_locales_locale_parent_id_unique" ON "services_trust_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_service_options_items_order_idx" ON "services_service_options_items" USING btree ("_order");
  CREATE INDEX "services_service_options_items_parent_id_idx" ON "services_service_options_items" USING btree ("_parent_id");
  CREATE INDEX "services_service_options_items_image_idx" ON "services_service_options_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "services_service_options_items_locales_locale_parent_id_uniq" ON "services_service_options_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_feature_sections_bullets_order_idx" ON "services_feature_sections_bullets" USING btree ("_order");
  CREATE INDEX "services_feature_sections_bullets_parent_id_idx" ON "services_feature_sections_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_feature_sections_bullets_locales_locale_parent_id_u" ON "services_feature_sections_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_feature_sections_order_idx" ON "services_feature_sections" USING btree ("_order");
  CREATE INDEX "services_feature_sections_parent_id_idx" ON "services_feature_sections" USING btree ("_parent_id");
  CREATE INDEX "services_feature_sections_image_idx" ON "services_feature_sections" USING btree ("image_id");
  CREATE UNIQUE INDEX "services_feature_sections_locales_locale_parent_id_unique" ON "services_feature_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_comparison_left_items_order_idx" ON "services_comparison_left_items" USING btree ("_order");
  CREATE INDEX "services_comparison_left_items_parent_id_idx" ON "services_comparison_left_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_comparison_left_items_locales_locale_parent_id_uniq" ON "services_comparison_left_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_comparison_right_items_order_idx" ON "services_comparison_right_items" USING btree ("_order");
  CREATE INDEX "services_comparison_right_items_parent_id_idx" ON "services_comparison_right_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_comparison_right_items_locales_locale_parent_id_uni" ON "services_comparison_right_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_trust_items_order_idx" ON "_services_v_version_trust_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_trust_items_parent_id_idx" ON "_services_v_version_trust_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_trust_items_locales_locale_parent_id_uni" ON "_services_v_version_trust_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_service_options_items_order_idx" ON "_services_v_version_service_options_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_service_options_items_parent_id_idx" ON "_services_v_version_service_options_items" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_service_options_items_image_idx" ON "_services_v_version_service_options_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_services_v_version_service_options_items_locales_locale_par" ON "_services_v_version_service_options_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_feature_sections_bullets_order_idx" ON "_services_v_version_feature_sections_bullets" USING btree ("_order");
  CREATE INDEX "_services_v_version_feature_sections_bullets_parent_id_idx" ON "_services_v_version_feature_sections_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_feature_sections_bullets_locales_locale_" ON "_services_v_version_feature_sections_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_feature_sections_order_idx" ON "_services_v_version_feature_sections" USING btree ("_order");
  CREATE INDEX "_services_v_version_feature_sections_parent_id_idx" ON "_services_v_version_feature_sections" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_feature_sections_image_idx" ON "_services_v_version_feature_sections" USING btree ("image_id");
  CREATE UNIQUE INDEX "_services_v_version_feature_sections_locales_locale_parent_i" ON "_services_v_version_feature_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_comparison_left_items_order_idx" ON "_services_v_version_comparison_left_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_comparison_left_items_parent_id_idx" ON "_services_v_version_comparison_left_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_comparison_left_items_locales_locale_par" ON "_services_v_version_comparison_left_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_comparison_right_items_order_idx" ON "_services_v_version_comparison_right_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_comparison_right_items_parent_id_idx" ON "_services_v_version_comparison_right_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_comparison_right_items_locales_locale_pa" ON "_services_v_version_comparison_right_items_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "services_trust_items" CASCADE;
  DROP TABLE "services_trust_items_locales" CASCADE;
  DROP TABLE "services_service_options_items" CASCADE;
  DROP TABLE "services_service_options_items_locales" CASCADE;
  DROP TABLE "services_feature_sections_bullets" CASCADE;
  DROP TABLE "services_feature_sections_bullets_locales" CASCADE;
  DROP TABLE "services_feature_sections" CASCADE;
  DROP TABLE "services_feature_sections_locales" CASCADE;
  DROP TABLE "services_comparison_left_items" CASCADE;
  DROP TABLE "services_comparison_left_items_locales" CASCADE;
  DROP TABLE "services_comparison_right_items" CASCADE;
  DROP TABLE "services_comparison_right_items_locales" CASCADE;
  DROP TABLE "_services_v_version_trust_items" CASCADE;
  DROP TABLE "_services_v_version_trust_items_locales" CASCADE;
  DROP TABLE "_services_v_version_service_options_items" CASCADE;
  DROP TABLE "_services_v_version_service_options_items_locales" CASCADE;
  DROP TABLE "_services_v_version_feature_sections_bullets" CASCADE;
  DROP TABLE "_services_v_version_feature_sections_bullets_locales" CASCADE;
  DROP TABLE "_services_v_version_feature_sections" CASCADE;
  DROP TABLE "_services_v_version_feature_sections_locales" CASCADE;
  DROP TABLE "_services_v_version_comparison_left_items" CASCADE;
  DROP TABLE "_services_v_version_comparison_left_items_locales" CASCADE;
  DROP TABLE "_services_v_version_comparison_right_items" CASCADE;
  DROP TABLE "_services_v_version_comparison_right_items_locales" CASCADE;
  ALTER TABLE "services" DROP COLUMN "visual_variant";
  ALTER TABLE "services_locales" DROP COLUMN "service_options_eyebrow";
  ALTER TABLE "services_locales" DROP COLUMN "service_options_heading";
  ALTER TABLE "services_locales" DROP COLUMN "service_options_intro";
  ALTER TABLE "services_locales" DROP COLUMN "materials_heading";
  ALTER TABLE "services_locales" DROP COLUMN "process_heading";
  ALTER TABLE "services_locales" DROP COLUMN "comparison_heading";
  ALTER TABLE "services_locales" DROP COLUMN "comparison_intro";
  ALTER TABLE "services_locales" DROP COLUMN "comparison_left_title";
  ALTER TABLE "services_locales" DROP COLUMN "comparison_right_title";
  ALTER TABLE "services_locales" DROP COLUMN "gallery_heading";
  ALTER TABLE "services_locales" DROP COLUMN "gallery_intro";
  ALTER TABLE "services_locales" DROP COLUMN "service_area_heading";
  ALTER TABLE "services_locales" DROP COLUMN "service_area_copy";
  ALTER TABLE "services_locales" DROP COLUMN "area_link_label";
  ALTER TABLE "services_locales" DROP COLUMN "quotation_context_button_label";
  ALTER TABLE "services_locales" DROP COLUMN "related_heading";
  ALTER TABLE "_services_v" DROP COLUMN "version_visual_variant";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_service_options_eyebrow";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_service_options_heading";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_service_options_intro";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_materials_heading";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_process_heading";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_comparison_heading";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_comparison_intro";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_comparison_left_title";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_comparison_right_title";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_gallery_heading";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_gallery_intro";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_service_area_heading";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_service_area_copy";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_area_link_label";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_quotation_context_button_label";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_related_heading";
  DROP TYPE "public"."enum_services_feature_sections_image_position";
  DROP TYPE "public"."enum_services_visual_variant";
  DROP TYPE "public"."enum__services_v_version_feature_sections_image_position";
  DROP TYPE "public"."enum__services_v_version_visual_variant";`)
}
