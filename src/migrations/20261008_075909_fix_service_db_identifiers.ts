import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "services_sofa_popular" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"href" varchar,
  	"coming_soon" boolean DEFAULT false
  );
  
  CREATE TABLE "services_sofa_popular_locales" (
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_sofa_fabrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "services_sofa_fabrics_locales" (
  	"title" varchar,
  	"best_use" varchar,
  	"comfort" varchar,
  	"durability" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_sofa_foam_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_sofa_foam_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_services_sofa_popular_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"href" varchar,
  	"coming_soon" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_sofa_popular_v_locales" (
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_sofa_fabrics_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_sofa_fabrics_v_locales" (
  	"title" varchar,
  	"best_use" varchar,
  	"comfort" varchar,
  	"durability" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_sofa_foam_items_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_sofa_foam_items_v_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "services" ADD COLUMN "sofa_upholstery_landing_bed_teaser_image_id" integer;
  ALTER TABLE "services_locales" ADD COLUMN "sofa_upholstery_landing_foam_comfort_heading" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "sofa_upholstery_landing_foam_comfort_copy" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "sofa_upholstery_landing_foam_comfort_cta_label" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "sofa_upholstery_landing_bed_teaser_title" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "sofa_upholstery_landing_bed_teaser_description" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "sofa_upholstery_landing_bed_teaser_label" varchar DEFAULT 'Coming Soon';
  ALTER TABLE "_services_v" ADD COLUMN "version_sofa_upholstery_landing_bed_teaser_image_id" integer;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_sofa_upholstery_landing_foam_comfort_heading" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_sofa_upholstery_landing_foam_comfort_copy" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_sofa_upholstery_landing_foam_comfort_cta_label" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_sofa_upholstery_landing_bed_teaser_title" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_sofa_upholstery_landing_bed_teaser_description" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_sofa_upholstery_landing_bed_teaser_label" varchar DEFAULT 'Coming Soon';
  ALTER TABLE "services_sofa_popular" ADD CONSTRAINT "services_sofa_popular_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_sofa_popular" ADD CONSTRAINT "services_sofa_popular_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_sofa_popular_locales" ADD CONSTRAINT "services_sofa_popular_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_sofa_popular"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_sofa_fabrics" ADD CONSTRAINT "services_sofa_fabrics_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_sofa_fabrics" ADD CONSTRAINT "services_sofa_fabrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_sofa_fabrics_locales" ADD CONSTRAINT "services_sofa_fabrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_sofa_fabrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_sofa_foam_items" ADD CONSTRAINT "services_sofa_foam_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_sofa_foam_items_locales" ADD CONSTRAINT "services_sofa_foam_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_sofa_foam_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_sofa_popular_v" ADD CONSTRAINT "_services_sofa_popular_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_sofa_popular_v" ADD CONSTRAINT "_services_sofa_popular_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_sofa_popular_v_locales" ADD CONSTRAINT "_services_sofa_popular_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_sofa_popular_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_sofa_fabrics_v" ADD CONSTRAINT "_services_sofa_fabrics_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_sofa_fabrics_v" ADD CONSTRAINT "_services_sofa_fabrics_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_sofa_fabrics_v_locales" ADD CONSTRAINT "_services_sofa_fabrics_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_sofa_fabrics_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_sofa_foam_items_v" ADD CONSTRAINT "_services_sofa_foam_items_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_sofa_foam_items_v_locales" ADD CONSTRAINT "_services_sofa_foam_items_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_sofa_foam_items_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_sofa_popular_order_idx" ON "services_sofa_popular" USING btree ("_order");
  CREATE INDEX "services_sofa_popular_parent_id_idx" ON "services_sofa_popular" USING btree ("_parent_id");
  CREATE INDEX "services_sofa_popular_image_idx" ON "services_sofa_popular" USING btree ("image_id");
  CREATE UNIQUE INDEX "services_sofa_popular_locales_locale_parent_id_unique" ON "services_sofa_popular_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_sofa_fabrics_order_idx" ON "services_sofa_fabrics" USING btree ("_order");
  CREATE INDEX "services_sofa_fabrics_parent_id_idx" ON "services_sofa_fabrics" USING btree ("_parent_id");
  CREATE INDEX "services_sofa_fabrics_image_idx" ON "services_sofa_fabrics" USING btree ("image_id");
  CREATE UNIQUE INDEX "services_sofa_fabrics_locales_locale_parent_id_unique" ON "services_sofa_fabrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_sofa_foam_items_order_idx" ON "services_sofa_foam_items" USING btree ("_order");
  CREATE INDEX "services_sofa_foam_items_parent_id_idx" ON "services_sofa_foam_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_sofa_foam_items_locales_locale_parent_id_unique" ON "services_sofa_foam_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_sofa_popular_v_order_idx" ON "_services_sofa_popular_v" USING btree ("_order");
  CREATE INDEX "_services_sofa_popular_v_parent_id_idx" ON "_services_sofa_popular_v" USING btree ("_parent_id");
  CREATE INDEX "_services_sofa_popular_v_image_idx" ON "_services_sofa_popular_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "_services_sofa_popular_v_locales_locale_parent_id_unique" ON "_services_sofa_popular_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_sofa_fabrics_v_order_idx" ON "_services_sofa_fabrics_v" USING btree ("_order");
  CREATE INDEX "_services_sofa_fabrics_v_parent_id_idx" ON "_services_sofa_fabrics_v" USING btree ("_parent_id");
  CREATE INDEX "_services_sofa_fabrics_v_image_idx" ON "_services_sofa_fabrics_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "_services_sofa_fabrics_v_locales_locale_parent_id_unique" ON "_services_sofa_fabrics_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_sofa_foam_items_v_order_idx" ON "_services_sofa_foam_items_v" USING btree ("_order");
  CREATE INDEX "_services_sofa_foam_items_v_parent_id_idx" ON "_services_sofa_foam_items_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_sofa_foam_items_v_locales_locale_parent_id_unique" ON "_services_sofa_foam_items_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "services" ADD CONSTRAINT "services_sofa_bed_image_media_fk" FOREIGN KEY ("sofa_upholstery_landing_bed_teaser_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_sofa_bed_image_media_fk" FOREIGN KEY ("version_sofa_upholstery_landing_bed_teaser_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_sofa_upholstery_landing_bed_teaser_sofa_upholst_idx" ON "services" USING btree ("sofa_upholstery_landing_bed_teaser_image_id");
  CREATE INDEX "_services_v_version_sofa_upholstery_landing_bed_teaser_v_idx" ON "_services_v" USING btree ("version_sofa_upholstery_landing_bed_teaser_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_sofa_popular" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_sofa_popular_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_sofa_fabrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_sofa_fabrics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_sofa_foam_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_sofa_foam_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_sofa_popular_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_sofa_popular_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_sofa_fabrics_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_sofa_fabrics_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_sofa_foam_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_sofa_foam_items_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_sofa_popular" CASCADE;
  DROP TABLE "services_sofa_popular_locales" CASCADE;
  DROP TABLE "services_sofa_fabrics" CASCADE;
  DROP TABLE "services_sofa_fabrics_locales" CASCADE;
  DROP TABLE "services_sofa_foam_items" CASCADE;
  DROP TABLE "services_sofa_foam_items_locales" CASCADE;
  DROP TABLE "_services_sofa_popular_v" CASCADE;
  DROP TABLE "_services_sofa_popular_v_locales" CASCADE;
  DROP TABLE "_services_sofa_fabrics_v" CASCADE;
  DROP TABLE "_services_sofa_fabrics_v_locales" CASCADE;
  DROP TABLE "_services_sofa_foam_items_v" CASCADE;
  DROP TABLE "_services_sofa_foam_items_v_locales" CASCADE;
  ALTER TABLE "services" DROP CONSTRAINT "services_sofa_bed_image_media_fk";
  
  ALTER TABLE "_services_v" DROP CONSTRAINT "_services_v_sofa_bed_image_media_fk";
  
  DROP INDEX "services_sofa_upholstery_landing_bed_teaser_sofa_upholst_idx";
  DROP INDEX "_services_v_version_sofa_upholstery_landing_bed_teaser_v_idx";
  ALTER TABLE "services" DROP COLUMN "sofa_upholstery_landing_bed_teaser_image_id";
  ALTER TABLE "services_locales" DROP COLUMN "sofa_upholstery_landing_foam_comfort_heading";
  ALTER TABLE "services_locales" DROP COLUMN "sofa_upholstery_landing_foam_comfort_copy";
  ALTER TABLE "services_locales" DROP COLUMN "sofa_upholstery_landing_foam_comfort_cta_label";
  ALTER TABLE "services_locales" DROP COLUMN "sofa_upholstery_landing_bed_teaser_title";
  ALTER TABLE "services_locales" DROP COLUMN "sofa_upholstery_landing_bed_teaser_description";
  ALTER TABLE "services_locales" DROP COLUMN "sofa_upholstery_landing_bed_teaser_label";
  ALTER TABLE "_services_v" DROP COLUMN "version_sofa_upholstery_landing_bed_teaser_image_id";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_sofa_upholstery_landing_foam_comfort_heading";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_sofa_upholstery_landing_foam_comfort_copy";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_sofa_upholstery_landing_foam_comfort_cta_label";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_sofa_upholstery_landing_bed_teaser_title";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_sofa_upholstery_landing_bed_teaser_description";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_sofa_upholstery_landing_bed_teaser_label";`)
}
