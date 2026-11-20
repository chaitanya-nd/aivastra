import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "indexing_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"indexing_allowed" boolean,
  	"changed_by_id" integer,
  	"changed_by_email" varchar,
  	"host" varchar,
  	"still_blocked_by" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "site_settings" ALTER COLUMN "block_indexing" SET DEFAULT true;
  ALTER TABLE "media" ADD COLUMN "external_url" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "indexing_log_id" integer;
  ALTER TABLE "indexing_log" ADD CONSTRAINT "indexing_log_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "indexing_log_changed_by_idx" ON "indexing_log" USING btree ("changed_by_id");
  CREATE INDEX "indexing_log_updated_at_idx" ON "indexing_log" USING btree ("updated_at");
  CREATE INDEX "indexing_log_created_at_idx" ON "indexing_log" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_indexing_log_fk" FOREIGN KEY ("indexing_log_id") REFERENCES "public"."indexing_log"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_indexing_log_id_idx" ON "payload_locked_documents_rels" USING btree ("indexing_log_id");

  -- Fail closed: every existing database starts with search engines BLOCKED.
  UPDATE "site_settings" SET "block_indexing" = true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "indexing_log" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "indexing_log" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_indexing_log_fk";
  
  DROP INDEX "payload_locked_documents_rels_indexing_log_id_idx";
  ALTER TABLE "site_settings" ALTER COLUMN "block_indexing" SET DEFAULT false;
  ALTER TABLE "media" DROP COLUMN "external_url";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "indexing_log_id";`)
}
