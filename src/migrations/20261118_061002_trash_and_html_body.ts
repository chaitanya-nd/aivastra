import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "content_html" varchar;
  ALTER TABLE "pages" ADD COLUMN "menu_order" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "version_content_html" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_menu_order" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "content_html" varchar;
  ALTER TABLE "posts" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content_html" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "guides" ADD COLUMN "content_html" varchar;
  ALTER TABLE "guides" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_guides_v" ADD COLUMN "version_content_html" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "cases" ADD COLUMN "content_html" varchar;
  ALTER TABLE "cases" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_cases_v" ADD COLUMN "version_content_html" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "updates" ADD COLUMN "content_html" varchar;
  ALTER TABLE "updates" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_updates_v" ADD COLUMN "version_content_html" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "reviews" ADD COLUMN "content_html" varchar;
  ALTER TABLE "reviews" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_content_html" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "_pages_v_version_version_deleted_at_idx" ON "_pages_v" USING btree ("version_deleted_at");
  CREATE INDEX "posts_deleted_at_idx" ON "posts" USING btree ("deleted_at");
  CREATE INDEX "_posts_v_version_version_deleted_at_idx" ON "_posts_v" USING btree ("version_deleted_at");
  CREATE INDEX "guides_deleted_at_idx" ON "guides" USING btree ("deleted_at");
  CREATE INDEX "_guides_v_version_version_deleted_at_idx" ON "_guides_v" USING btree ("version_deleted_at");
  CREATE INDEX "cases_deleted_at_idx" ON "cases" USING btree ("deleted_at");
  CREATE INDEX "_cases_v_version_version_deleted_at_idx" ON "_cases_v" USING btree ("version_deleted_at");
  CREATE INDEX "updates_deleted_at_idx" ON "updates" USING btree ("deleted_at");
  CREATE INDEX "_updates_v_version_version_deleted_at_idx" ON "_updates_v" USING btree ("version_deleted_at");
  CREATE INDEX "reviews_deleted_at_idx" ON "reviews" USING btree ("deleted_at");
  CREATE INDEX "_reviews_v_version_version_deleted_at_idx" ON "_reviews_v" USING btree ("version_deleted_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "pages_deleted_at_idx";
  DROP INDEX "_pages_v_version_version_deleted_at_idx";
  DROP INDEX "posts_deleted_at_idx";
  DROP INDEX "_posts_v_version_version_deleted_at_idx";
  DROP INDEX "guides_deleted_at_idx";
  DROP INDEX "_guides_v_version_version_deleted_at_idx";
  DROP INDEX "cases_deleted_at_idx";
  DROP INDEX "_cases_v_version_version_deleted_at_idx";
  DROP INDEX "updates_deleted_at_idx";
  DROP INDEX "_updates_v_version_version_deleted_at_idx";
  DROP INDEX "reviews_deleted_at_idx";
  DROP INDEX "_reviews_v_version_version_deleted_at_idx";
  ALTER TABLE "pages" DROP COLUMN "content_html";
  ALTER TABLE "pages" DROP COLUMN "menu_order";
  ALTER TABLE "pages" DROP COLUMN "deleted_at";
  ALTER TABLE "_pages_v" DROP COLUMN "version_content_html";
  ALTER TABLE "_pages_v" DROP COLUMN "version_menu_order";
  ALTER TABLE "_pages_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "posts" DROP COLUMN "content_html";
  ALTER TABLE "posts" DROP COLUMN "deleted_at";
  ALTER TABLE "_posts_v" DROP COLUMN "version_content_html";
  ALTER TABLE "_posts_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "guides" DROP COLUMN "content_html";
  ALTER TABLE "guides" DROP COLUMN "deleted_at";
  ALTER TABLE "_guides_v" DROP COLUMN "version_content_html";
  ALTER TABLE "_guides_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "cases" DROP COLUMN "content_html";
  ALTER TABLE "cases" DROP COLUMN "deleted_at";
  ALTER TABLE "_cases_v" DROP COLUMN "version_content_html";
  ALTER TABLE "_cases_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "updates" DROP COLUMN "content_html";
  ALTER TABLE "updates" DROP COLUMN "deleted_at";
  ALTER TABLE "_updates_v" DROP COLUMN "version_content_html";
  ALTER TABLE "_updates_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "reviews" DROP COLUMN "content_html";
  ALTER TABLE "reviews" DROP COLUMN "deleted_at";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_content_html";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_deleted_at";`)
}
