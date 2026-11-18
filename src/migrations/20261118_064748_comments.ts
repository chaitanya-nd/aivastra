import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_comments_mode" AS ENUM('default', 'open', 'closed');
  CREATE TYPE "public"."enum__posts_v_version_comments_mode" AS ENUM('default', 'open', 'closed');
  CREATE TYPE "public"."enum_comments_status" AS ENUM('approved', 'pending', 'spam', 'trash');
  CREATE TYPE "public"."enum_plugin_settings_comments_order" AS ENUM('asc', 'desc');
  CREATE TABLE "comments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" varchar NOT NULL,
  	"status" "enum_comments_status" DEFAULT 'pending' NOT NULL,
  	"parent_id" integer,
  	"author_name" varchar,
  	"author_email" varchar,
  	"author_url" varchar,
  	"user_id" integer,
  	"ip" varchar,
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "comments_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"pages_id" integer,
  	"guides_id" integer,
  	"cases_id" integer,
  	"updates_id" integer,
  	"reviews_id" integer
  );
  
  ALTER TABLE "posts" ADD COLUMN "comments_mode" "enum_posts_comments_mode" DEFAULT 'default';
  ALTER TABLE "_posts_v" ADD COLUMN "version_comments_mode" "enum__posts_v_version_comments_mode" DEFAULT 'default';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "comments_id" integer;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_enabled" boolean DEFAULT false;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_require_name_email" boolean DEFAULT true;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_logged_in_only" boolean DEFAULT false;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_close" boolean DEFAULT false;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_close_days" numeric DEFAULT 14;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_threaded" boolean DEFAULT true;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_depth" numeric DEFAULT 3;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_per_page" numeric DEFAULT 20;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_order" "enum_plugin_settings_comments_order" DEFAULT 'asc';
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_notify" boolean DEFAULT true;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_notify_email" varchar;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_hold" boolean DEFAULT false;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_known_auto" boolean DEFAULT true;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_max_links" numeric DEFAULT 2;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_mod_words" varchar;
  ALTER TABLE "plugin_settings" ADD COLUMN "comments_block_words" varchar;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_updates_fk" FOREIGN KEY ("updates_id") REFERENCES "public"."updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "comments_status_idx" ON "comments" USING btree ("status");
  CREATE INDEX "comments_parent_idx" ON "comments" USING btree ("parent_id");
  CREATE INDEX "comments_user_idx" ON "comments" USING btree ("user_id");
  CREATE INDEX "comments_updated_at_idx" ON "comments" USING btree ("updated_at");
  CREATE INDEX "comments_created_at_idx" ON "comments" USING btree ("created_at");
  CREATE INDEX "comments_rels_order_idx" ON "comments_rels" USING btree ("order");
  CREATE INDEX "comments_rels_parent_idx" ON "comments_rels" USING btree ("parent_id");
  CREATE INDEX "comments_rels_path_idx" ON "comments_rels" USING btree ("path");
  CREATE INDEX "comments_rels_posts_id_idx" ON "comments_rels" USING btree ("posts_id");
  CREATE INDEX "comments_rels_pages_id_idx" ON "comments_rels" USING btree ("pages_id");
  CREATE INDEX "comments_rels_guides_id_idx" ON "comments_rels" USING btree ("guides_id");
  CREATE INDEX "comments_rels_cases_id_idx" ON "comments_rels" USING btree ("cases_id");
  CREATE INDEX "comments_rels_updates_id_idx" ON "comments_rels" USING btree ("updates_id");
  CREATE INDEX "comments_rels_reviews_id_idx" ON "comments_rels" USING btree ("reviews_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_comments_fk" FOREIGN KEY ("comments_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_comments_id_idx" ON "payload_locked_documents_rels" USING btree ("comments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "comments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "comments_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "comments" CASCADE;
  DROP TABLE "comments_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_comments_fk";
  
  DROP INDEX "payload_locked_documents_rels_comments_id_idx";
  ALTER TABLE "posts" DROP COLUMN "comments_mode";
  ALTER TABLE "_posts_v" DROP COLUMN "version_comments_mode";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "comments_id";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_enabled";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_require_name_email";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_logged_in_only";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_close";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_close_days";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_threaded";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_depth";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_per_page";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_order";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_notify";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_notify_email";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_hold";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_known_auto";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_max_links";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_mod_words";
  ALTER TABLE "plugin_settings" DROP COLUMN "comments_block_words";
  DROP TYPE "public"."enum_posts_comments_mode";
  DROP TYPE "public"."enum__posts_v_version_comments_mode";
  DROP TYPE "public"."enum_comments_status";
  DROP TYPE "public"."enum_plugin_settings_comments_order";`)
}
