import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Additive CTA label columns. Production already received these columns during
 * an earlier schema push, so `up` is idempotent and only adds missing columns.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "presentation_labels_hero_quote_label" varchar;
    ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "presentation_labels_process_cta_label" varchar;
    ALTER TABLE "services_locales" ADD COLUMN IF NOT EXISTS "presentation_labels_quote_whats_app_label" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN IF NOT EXISTS "version_presentation_labels_hero_quote_label" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN IF NOT EXISTS "version_presentation_labels_process_cta_label" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN IF NOT EXISTS "version_presentation_labels_quote_whats_app_label" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "presentation_labels_hero_quote_label";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "presentation_labels_process_cta_label";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "presentation_labels_quote_whats_app_label";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_presentation_labels_hero_quote_label";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_presentation_labels_process_cta_label";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_presentation_labels_quote_whats_app_label";
  `)
}
