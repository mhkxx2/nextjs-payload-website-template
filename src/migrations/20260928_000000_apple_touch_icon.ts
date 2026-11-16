import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "apple_touch_icon_id" integer;
    DO $$ BEGIN
      ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_apple_touch_icon_id_media_id_fk" FOREIGN KEY ("apple_touch_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    CREATE INDEX IF NOT EXISTS "site_settings_apple_touch_icon_idx" ON "site_settings" USING btree ("apple_touch_icon_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "site_settings_apple_touch_icon_idx";
    ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_apple_touch_icon_id_media_id_fk";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "apple_touch_icon_id";
  `)
}
