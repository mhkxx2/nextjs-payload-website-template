import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_footer_navigation_groups_items_destination" ADD VALUE 'areas' AFTER 'projects';
    ALTER TYPE "public"."enum_footer_navigation_groups_items_destination" ADD VALUE 'portfolio' AFTER 'areas';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "footer_navigation_groups_items" WHERE "destination"::text IN ('areas', 'portfolio');
    ALTER TABLE "footer_navigation_groups_items" ALTER COLUMN "destination" SET DATA TYPE text;
    DROP TYPE "public"."enum_footer_navigation_groups_items_destination";
    CREATE TYPE "public"."enum_footer_navigation_groups_items_destination" AS ENUM('home', 'services', 'projects', 'blog', 'about', 'contact', 'privacy', 'terms');
    ALTER TABLE "footer_navigation_groups_items" ALTER COLUMN "destination" SET DATA TYPE "public"."enum_footer_navigation_groups_items_destination" USING "destination"::"public"."enum_footer_navigation_groups_items_destination";
  `)
}
