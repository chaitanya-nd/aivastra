import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_redirects_comparison" AS ENUM('exact', 'contains', 'start', 'end', 'regex');
  CREATE TYPE "public"."enum_site_settings_robots_global" AS ENUM('noindex', 'nofollow', 'noarchive', 'noimageindex', 'nosnippet');
  CREATE TYPE "public"."enum_site_settings_pages_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'noimageindex', 'nosnippet');
  CREATE TYPE "public"."enum_site_settings_posts_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'noimageindex', 'nosnippet');
  CREATE TYPE "public"."enum_site_settings_guides_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'noimageindex', 'nosnippet');
  CREATE TYPE "public"."enum_site_settings_cases_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'noimageindex', 'nosnippet');
  CREATE TYPE "public"."enum_site_settings_updates_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'noimageindex', 'nosnippet');
  CREATE TYPE "public"."enum_site_settings_reviews_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'noimageindex', 'nosnippet');
  CREATE TYPE "public"."enum_site_settings_categories_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'noimageindex', 'nosnippet');
  CREATE TYPE "public"."enum_site_settings_tags_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'noimageindex', 'nosnippet');
  CREATE TYPE "public"."enum_site_settings_separator" AS ENUM('-', '–', '—', '·', '•', '|', '»', '~');
  CREATE TYPE "public"."enum_site_settings_twitter_card" AS ENUM('summary_large_image', 'summary');
  CREATE TYPE "public"."enum_site_settings_pages_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  CREATE TYPE "public"."enum_site_settings_posts_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  CREATE TYPE "public"."enum_site_settings_guides_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  CREATE TYPE "public"."enum_site_settings_cases_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  CREATE TYPE "public"."enum_site_settings_updates_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  CREATE TYPE "public"."enum_site_settings_reviews_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  CREATE TYPE "public"."enum_site_settings_categories_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  CREATE TYPE "public"."enum_site_settings_tags_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  CREATE TYPE "public"."enum_plugin_settings_toc_depth" AS ENUM('2', '3', '4');
  ALTER TYPE "public"."enum_redirects_type" ADD VALUE '307';
  ALTER TYPE "public"."enum_redirects_type" ADD VALUE '410';
  ALTER TYPE "public"."enum_redirects_type" ADD VALUE '451';
  CREATE TABLE "not_found_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"uri" varchar NOT NULL,
  	"hits" numeric DEFAULT 1,
  	"referer" varchar,
  	"user_agent" varchar,
  	"last_seen" timestamp(3) with time zone,
  	"redirect_to" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_robots_global" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_robots_global",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_pages_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_pages_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_posts_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_posts_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_guides_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_guides_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_cases_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_cases_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_updates_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_updates_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_reviews_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_reviews_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_categories_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_categories_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_tags_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_tags_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "plugin_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sitemap_enabled" boolean DEFAULT true,
  	"sitemap_max_links" numeric DEFAULT 200,
  	"sitemap_images" boolean DEFAULT true,
  	"sitemap_exclude_posts" varchar,
  	"sitemap_exclude_terms" varchar,
  	"bc_separator" varchar DEFAULT '/',
  	"bc_home_label" varchar DEFAULT 'Home',
  	"bc_show_home" boolean DEFAULT true,
  	"bc_link_current" boolean DEFAULT false,
  	"bc_hide" boolean DEFAULT false,
  	"toc_title" varchar DEFAULT 'Table of contents',
  	"toc_min_headings" numeric DEFAULT 2,
  	"toc_depth" "enum_plugin_settings_toc_depth" DEFAULT '4',
  	"toc_numbered" boolean DEFAULT true,
  	"toc_enabled" boolean DEFAULT true,
  	"mc_audience_id" varchar,
  	"mc_double_opt_in" boolean DEFAULT false,
  	"mc_tags" varchar,
  	"header_scripts" varchar,
  	"body_open_scripts" varchar,
  	"footer_scripts" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "redirects" ALTER COLUMN "type" SET DEFAULT '301';
  ALTER TABLE "site_settings" ALTER COLUMN "title_template" SET DEFAULT '%s - AI Vastra';
  ALTER TABLE "redirects" ADD COLUMN "comparison" "enum_redirects_comparison" DEFAULT 'exact';
  ALTER TABLE "redirects" ADD COLUMN "ignore_case" boolean DEFAULT true;
  ALTER TABLE "redirects" ADD COLUMN "active" boolean DEFAULT true;
  ALTER TABLE "redirects" ADD COLUMN "hits" numeric DEFAULT 0;
  ALTER TABLE "redirects" ADD COLUMN "last_accessed" timestamp(3) with time zone;
  ALTER TABLE "forms" ADD COLUMN "messages_validation_error" varchar DEFAULT 'One or more fields have an error. Please check and try again.';
  ALTER TABLE "forms" ADD COLUMN "messages_mail_failed" varchar DEFAULT 'There was an error trying to send your message. Please try again later.';
  ALTER TABLE "forms" ADD COLUMN "messages_invalid_required" varchar DEFAULT 'Please fill out this field.';
  ALTER TABLE "forms" ADD COLUMN "messages_invalid_email" varchar DEFAULT 'Please enter a valid email address.';
  ALTER TABLE "forms" ADD COLUMN "additional_settings" varchar;
  ALTER TABLE "forms" ADD COLUMN "store_submissions" boolean DEFAULT true;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "not_found_log_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "separator" "enum_site_settings_separator" DEFAULT '-';
  ALTER TABLE "site_settings" ADD COLUMN "twitter_card" "enum_site_settings_twitter_card" DEFAULT 'summary_large_image';
  ALTER TABLE "site_settings" ADD COLUMN "facebook_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "home_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "home_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "home_og_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "pages_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "pages_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "pages_in_sitemap" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "pages_schema_type" "enum_site_settings_pages_schema_type" DEFAULT 'auto';
  ALTER TABLE "site_settings" ADD COLUMN "posts_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "posts_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "posts_in_sitemap" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "posts_schema_type" "enum_site_settings_posts_schema_type" DEFAULT 'auto';
  ALTER TABLE "site_settings" ADD COLUMN "guides_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "guides_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "guides_in_sitemap" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "guides_schema_type" "enum_site_settings_guides_schema_type" DEFAULT 'auto';
  ALTER TABLE "site_settings" ADD COLUMN "cases_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "cases_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "cases_in_sitemap" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "cases_schema_type" "enum_site_settings_cases_schema_type" DEFAULT 'auto';
  ALTER TABLE "site_settings" ADD COLUMN "updates_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "updates_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "updates_in_sitemap" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "updates_schema_type" "enum_site_settings_updates_schema_type" DEFAULT 'auto';
  ALTER TABLE "site_settings" ADD COLUMN "reviews_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "reviews_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "reviews_in_sitemap" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "reviews_schema_type" "enum_site_settings_reviews_schema_type" DEFAULT 'auto';
  ALTER TABLE "site_settings" ADD COLUMN "categories_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "categories_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "categories_in_sitemap" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "categories_schema_type" "enum_site_settings_categories_schema_type" DEFAULT 'auto';
  ALTER TABLE "site_settings" ADD COLUMN "tags_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "tags_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "tags_in_sitemap" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "tags_schema_type" "enum_site_settings_tags_schema_type" DEFAULT 'auto';
  ALTER TABLE "site_settings" ADD COLUMN "search_title" varchar DEFAULT 'Search results for %search_query% %sep% %sitename%';
  ALTER TABLE "site_settings" ADD COLUMN "not_found_title" varchar DEFAULT 'Page Not Found %sep% %sitename%';
  ALTER TABLE "site_settings" ADD COLUMN "noindex_search" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "noindex_paginated" boolean DEFAULT true;
  ALTER TABLE "site_settings_robots_global" ADD CONSTRAINT "site_settings_robots_global_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_pages_robots" ADD CONSTRAINT "site_settings_pages_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_posts_robots" ADD CONSTRAINT "site_settings_posts_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_guides_robots" ADD CONSTRAINT "site_settings_guides_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_cases_robots" ADD CONSTRAINT "site_settings_cases_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_updates_robots" ADD CONSTRAINT "site_settings_updates_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_reviews_robots" ADD CONSTRAINT "site_settings_reviews_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_categories_robots" ADD CONSTRAINT "site_settings_categories_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_tags_robots" ADD CONSTRAINT "site_settings_tags_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "not_found_log_uri_idx" ON "not_found_log" USING btree ("uri");
  CREATE INDEX "not_found_log_updated_at_idx" ON "not_found_log" USING btree ("updated_at");
  CREATE INDEX "not_found_log_created_at_idx" ON "not_found_log" USING btree ("created_at");
  CREATE INDEX "site_settings_robots_global_order_idx" ON "site_settings_robots_global" USING btree ("order");
  CREATE INDEX "site_settings_robots_global_parent_idx" ON "site_settings_robots_global" USING btree ("parent_id");
  CREATE INDEX "site_settings_pages_robots_order_idx" ON "site_settings_pages_robots" USING btree ("order");
  CREATE INDEX "site_settings_pages_robots_parent_idx" ON "site_settings_pages_robots" USING btree ("parent_id");
  CREATE INDEX "site_settings_posts_robots_order_idx" ON "site_settings_posts_robots" USING btree ("order");
  CREATE INDEX "site_settings_posts_robots_parent_idx" ON "site_settings_posts_robots" USING btree ("parent_id");
  CREATE INDEX "site_settings_guides_robots_order_idx" ON "site_settings_guides_robots" USING btree ("order");
  CREATE INDEX "site_settings_guides_robots_parent_idx" ON "site_settings_guides_robots" USING btree ("parent_id");
  CREATE INDEX "site_settings_cases_robots_order_idx" ON "site_settings_cases_robots" USING btree ("order");
  CREATE INDEX "site_settings_cases_robots_parent_idx" ON "site_settings_cases_robots" USING btree ("parent_id");
  CREATE INDEX "site_settings_updates_robots_order_idx" ON "site_settings_updates_robots" USING btree ("order");
  CREATE INDEX "site_settings_updates_robots_parent_idx" ON "site_settings_updates_robots" USING btree ("parent_id");
  CREATE INDEX "site_settings_reviews_robots_order_idx" ON "site_settings_reviews_robots" USING btree ("order");
  CREATE INDEX "site_settings_reviews_robots_parent_idx" ON "site_settings_reviews_robots" USING btree ("parent_id");
  CREATE INDEX "site_settings_categories_robots_order_idx" ON "site_settings_categories_robots" USING btree ("order");
  CREATE INDEX "site_settings_categories_robots_parent_idx" ON "site_settings_categories_robots" USING btree ("parent_id");
  CREATE INDEX "site_settings_tags_robots_order_idx" ON "site_settings_tags_robots" USING btree ("order");
  CREATE INDEX "site_settings_tags_robots_parent_idx" ON "site_settings_tags_robots" USING btree ("parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_not_found_log_fk" FOREIGN KEY ("not_found_log_id") REFERENCES "public"."not_found_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_home_og_image_id_media_id_fk" FOREIGN KEY ("home_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_not_found_log_id_idx" ON "payload_locked_documents_rels" USING btree ("not_found_log_id");
  CREATE INDEX "site_settings_home_og_image_idx" ON "site_settings" USING btree ("home_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "not_found_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_robots_global" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_pages_robots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_posts_robots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_guides_robots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_cases_robots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_updates_robots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_reviews_robots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_categories_robots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_tags_robots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "plugin_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "not_found_log" CASCADE;
  DROP TABLE "site_settings_robots_global" CASCADE;
  DROP TABLE "site_settings_pages_robots" CASCADE;
  DROP TABLE "site_settings_posts_robots" CASCADE;
  DROP TABLE "site_settings_guides_robots" CASCADE;
  DROP TABLE "site_settings_cases_robots" CASCADE;
  DROP TABLE "site_settings_updates_robots" CASCADE;
  DROP TABLE "site_settings_reviews_robots" CASCADE;
  DROP TABLE "site_settings_categories_robots" CASCADE;
  DROP TABLE "site_settings_tags_robots" CASCADE;
  DROP TABLE "plugin_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_not_found_log_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_home_og_image_id_media_id_fk";
  
  ALTER TABLE "redirects" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_redirects_type";
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  ALTER TABLE "redirects" ALTER COLUMN "type" SET DATA TYPE "public"."enum_redirects_type" USING "type"::"public"."enum_redirects_type";
  DROP INDEX "payload_locked_documents_rels_not_found_log_id_idx";
  DROP INDEX "site_settings_home_og_image_idx";
  ALTER TABLE "redirects" ALTER COLUMN "type" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "title_template" SET DEFAULT '%s | AI Vastra';
  ALTER TABLE "redirects" DROP COLUMN "comparison";
  ALTER TABLE "redirects" DROP COLUMN "ignore_case";
  ALTER TABLE "redirects" DROP COLUMN "active";
  ALTER TABLE "redirects" DROP COLUMN "hits";
  ALTER TABLE "redirects" DROP COLUMN "last_accessed";
  ALTER TABLE "forms" DROP COLUMN "messages_validation_error";
  ALTER TABLE "forms" DROP COLUMN "messages_mail_failed";
  ALTER TABLE "forms" DROP COLUMN "messages_invalid_required";
  ALTER TABLE "forms" DROP COLUMN "messages_invalid_email";
  ALTER TABLE "forms" DROP COLUMN "additional_settings";
  ALTER TABLE "forms" DROP COLUMN "store_submissions";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "not_found_log_id";
  ALTER TABLE "site_settings" DROP COLUMN "separator";
  ALTER TABLE "site_settings" DROP COLUMN "twitter_card";
  ALTER TABLE "site_settings" DROP COLUMN "facebook_url";
  ALTER TABLE "site_settings" DROP COLUMN "home_title";
  ALTER TABLE "site_settings" DROP COLUMN "home_description";
  ALTER TABLE "site_settings" DROP COLUMN "home_og_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "pages_title";
  ALTER TABLE "site_settings" DROP COLUMN "pages_description";
  ALTER TABLE "site_settings" DROP COLUMN "pages_in_sitemap";
  ALTER TABLE "site_settings" DROP COLUMN "pages_schema_type";
  ALTER TABLE "site_settings" DROP COLUMN "posts_title";
  ALTER TABLE "site_settings" DROP COLUMN "posts_description";
  ALTER TABLE "site_settings" DROP COLUMN "posts_in_sitemap";
  ALTER TABLE "site_settings" DROP COLUMN "posts_schema_type";
  ALTER TABLE "site_settings" DROP COLUMN "guides_title";
  ALTER TABLE "site_settings" DROP COLUMN "guides_description";
  ALTER TABLE "site_settings" DROP COLUMN "guides_in_sitemap";
  ALTER TABLE "site_settings" DROP COLUMN "guides_schema_type";
  ALTER TABLE "site_settings" DROP COLUMN "cases_title";
  ALTER TABLE "site_settings" DROP COLUMN "cases_description";
  ALTER TABLE "site_settings" DROP COLUMN "cases_in_sitemap";
  ALTER TABLE "site_settings" DROP COLUMN "cases_schema_type";
  ALTER TABLE "site_settings" DROP COLUMN "updates_title";
  ALTER TABLE "site_settings" DROP COLUMN "updates_description";
  ALTER TABLE "site_settings" DROP COLUMN "updates_in_sitemap";
  ALTER TABLE "site_settings" DROP COLUMN "updates_schema_type";
  ALTER TABLE "site_settings" DROP COLUMN "reviews_title";
  ALTER TABLE "site_settings" DROP COLUMN "reviews_description";
  ALTER TABLE "site_settings" DROP COLUMN "reviews_in_sitemap";
  ALTER TABLE "site_settings" DROP COLUMN "reviews_schema_type";
  ALTER TABLE "site_settings" DROP COLUMN "categories_title";
  ALTER TABLE "site_settings" DROP COLUMN "categories_description";
  ALTER TABLE "site_settings" DROP COLUMN "categories_in_sitemap";
  ALTER TABLE "site_settings" DROP COLUMN "categories_schema_type";
  ALTER TABLE "site_settings" DROP COLUMN "tags_title";
  ALTER TABLE "site_settings" DROP COLUMN "tags_description";
  ALTER TABLE "site_settings" DROP COLUMN "tags_in_sitemap";
  ALTER TABLE "site_settings" DROP COLUMN "tags_schema_type";
  ALTER TABLE "site_settings" DROP COLUMN "search_title";
  ALTER TABLE "site_settings" DROP COLUMN "not_found_title";
  ALTER TABLE "site_settings" DROP COLUMN "noindex_search";
  ALTER TABLE "site_settings" DROP COLUMN "noindex_paginated";
  DROP TYPE "public"."enum_redirects_comparison";
  DROP TYPE "public"."enum_site_settings_robots_global";
  DROP TYPE "public"."enum_site_settings_pages_robots";
  DROP TYPE "public"."enum_site_settings_posts_robots";
  DROP TYPE "public"."enum_site_settings_guides_robots";
  DROP TYPE "public"."enum_site_settings_cases_robots";
  DROP TYPE "public"."enum_site_settings_updates_robots";
  DROP TYPE "public"."enum_site_settings_reviews_robots";
  DROP TYPE "public"."enum_site_settings_categories_robots";
  DROP TYPE "public"."enum_site_settings_tags_robots";
  DROP TYPE "public"."enum_site_settings_separator";
  DROP TYPE "public"."enum_site_settings_twitter_card";
  DROP TYPE "public"."enum_site_settings_pages_schema_type";
  DROP TYPE "public"."enum_site_settings_posts_schema_type";
  DROP TYPE "public"."enum_site_settings_guides_schema_type";
  DROP TYPE "public"."enum_site_settings_cases_schema_type";
  DROP TYPE "public"."enum_site_settings_updates_schema_type";
  DROP TYPE "public"."enum_site_settings_reviews_schema_type";
  DROP TYPE "public"."enum_site_settings_categories_schema_type";
  DROP TYPE "public"."enum_site_settings_tags_schema_type";
  DROP TYPE "public"."enum_plugin_settings_toc_depth";`)
}
