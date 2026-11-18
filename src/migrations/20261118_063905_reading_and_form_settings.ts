import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_plugin_settings_bc_separator" AS ENUM('arrow', '/', '>', '»', '|', '·');
  ALTER TABLE "plugin_settings" ALTER COLUMN "bc_separator" SET DEFAULT 'arrow'::"public"."enum_plugin_settings_bc_separator";
  ALTER TABLE "plugin_settings" ALTER COLUMN "bc_separator" SET DATA TYPE "public"."enum_plugin_settings_bc_separator" USING "bc_separator"::"public"."enum_plugin_settings_bc_separator";
  ALTER TABLE "plugin_settings" ALTER COLUMN "toc_title" SET DEFAULT 'Contents';
  ALTER TABLE "plugin_settings" ADD COLUMN "posts_per_page" numeric DEFAULT 9;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "plugin_settings" ALTER COLUMN "bc_separator" SET DATA TYPE varchar;
  ALTER TABLE "plugin_settings" ALTER COLUMN "bc_separator" SET DEFAULT '/';
  ALTER TABLE "plugin_settings" ALTER COLUMN "toc_title" SET DEFAULT 'Table of contents';
  ALTER TABLE "plugin_settings" DROP COLUMN "posts_per_page";
  DROP TYPE "public"."enum_plugin_settings_bc_separator";`)
}
