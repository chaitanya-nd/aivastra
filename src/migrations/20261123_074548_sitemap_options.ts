import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "plugin_settings" ADD COLUMN "sitemap_authors" boolean DEFAULT false;
  ALTER TABLE "plugin_settings" ADD COLUMN "sitemap_section_terms" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "plugin_settings" DROP COLUMN "sitemap_authors";
  ALTER TABLE "plugin_settings" DROP COLUMN "sitemap_section_terms";`)
}
