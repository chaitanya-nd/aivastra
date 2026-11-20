import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum__pages_v_version_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum_posts_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum__posts_v_version_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum_guides_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum__guides_v_version_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum_cases_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum__cases_v_version_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum_updates_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum__updates_v_version_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum_reviews_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum__reviews_v_version_review_status" AS ENUM('none', 'pending');
  CREATE TYPE "public"."enum_activity_log_action" AS ENUM('create', 'update', 'publish', 'unpublish', 'trash', 'restore', 'delete', 'login', 'settings');
  CREATE TYPE "public"."enum_site_settings_opening_hours_days" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  CREATE TYPE "public"."enum_site_settings_timezone" AS ENUM('Asia/Kolkata', 'UTC', 'Asia/Dubai', 'Asia/Singapore', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Australia/Sydney');
  CREATE TYPE "public"."enum_site_settings_date_format" AS ENUM('MMM d, yyyy', 'MMMM d, yyyy', 'd MMMM yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy');
  CREATE TYPE "public"."enum_site_settings_homepage_displays" AS ENUM('page', 'posts');
  CREATE TYPE "public"."enum_site_settings_org_type" AS ENUM('Organization', 'Corporation', 'LocalBusiness', 'ProfessionalService', 'Store', 'OnlineBusiness');
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'author' BEFORE 'subscriber';
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'contributor' BEFORE 'subscriber';
  ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'rankSnapshot' BEFORE 'schedulePublish';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'rankSnapshot' BEFORE 'schedulePublish';
  ALTER TYPE "public"."enum_site_settings_pages_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_site_settings_pages_schema_type" ADD VALUE 'HowTo' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_pages_schema_type" ADD VALUE 'Product' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_pages_schema_type" ADD VALUE 'SoftwareApplication' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_pages_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_posts_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_site_settings_posts_schema_type" ADD VALUE 'HowTo' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_posts_schema_type" ADD VALUE 'Product' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_posts_schema_type" ADD VALUE 'SoftwareApplication' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_posts_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_guides_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_site_settings_guides_schema_type" ADD VALUE 'HowTo' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_guides_schema_type" ADD VALUE 'Product' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_guides_schema_type" ADD VALUE 'SoftwareApplication' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_guides_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_cases_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_site_settings_cases_schema_type" ADD VALUE 'HowTo' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_cases_schema_type" ADD VALUE 'Product' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_cases_schema_type" ADD VALUE 'SoftwareApplication' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_cases_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_updates_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_site_settings_updates_schema_type" ADD VALUE 'HowTo' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_updates_schema_type" ADD VALUE 'Product' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_updates_schema_type" ADD VALUE 'SoftwareApplication' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_updates_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_reviews_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_site_settings_reviews_schema_type" ADD VALUE 'HowTo' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_reviews_schema_type" ADD VALUE 'Product' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_reviews_schema_type" ADD VALUE 'SoftwareApplication' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_reviews_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_categories_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_site_settings_categories_schema_type" ADD VALUE 'HowTo' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_categories_schema_type" ADD VALUE 'Product' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_categories_schema_type" ADD VALUE 'SoftwareApplication' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_categories_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_tags_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_site_settings_tags_schema_type" ADD VALUE 'HowTo' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_tags_schema_type" ADD VALUE 'Product' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_tags_schema_type" ADD VALUE 'SoftwareApplication' BEFORE 'none';
  ALTER TYPE "public"."enum_site_settings_tags_schema_type" ADD VALUE 'Course' BEFORE 'none';
  CREATE TABLE "rank_snapshots" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" varchar NOT NULL,
  	"query" varchar,
  	"page" varchar,
  	"clicks" numeric,
  	"impressions" numeric,
  	"ctr" numeric,
  	"position" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "activity_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"action" "enum_activity_log_action",
  	"summary" varchar,
  	"target" varchar,
  	"target_id" varchar,
  	"user_id" integer,
  	"user_email" varchar,
  	"ip" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "auto_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"case_sensitive" boolean DEFAULT false,
  	"new_tab" boolean DEFAULT false,
  	"nofollow" boolean DEFAULT false,
  	"max_per_page" numeric DEFAULT 1,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "role_capabilities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"matrix" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_opening_hours_days" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_site_settings_opening_hours_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"opens" varchar,
  	"closes" varchar
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "pages" ADD COLUMN "review_status" "enum_pages_review_status" DEFAULT 'none';
  ALTER TABLE "pages" ADD COLUMN "seo_score" numeric;
  ALTER TABLE "_pages_v" ADD COLUMN "version_created_by_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_review_status" "enum__pages_v_version_review_status" DEFAULT 'none';
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_score" numeric;
  ALTER TABLE "posts" ADD COLUMN "review_status" "enum_posts_review_status" DEFAULT 'none';
  ALTER TABLE "posts" ADD COLUMN "seo_score" numeric;
  ALTER TABLE "_posts_v" ADD COLUMN "version_review_status" "enum__posts_v_version_review_status" DEFAULT 'none';
  ALTER TABLE "_posts_v" ADD COLUMN "version_seo_score" numeric;
  ALTER TABLE "guides" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "guides" ADD COLUMN "review_status" "enum_guides_review_status" DEFAULT 'none';
  ALTER TABLE "guides" ADD COLUMN "seo_score" numeric;
  ALTER TABLE "_guides_v" ADD COLUMN "version_created_by_id" integer;
  ALTER TABLE "_guides_v" ADD COLUMN "version_review_status" "enum__guides_v_version_review_status" DEFAULT 'none';
  ALTER TABLE "_guides_v" ADD COLUMN "version_seo_score" numeric;
  ALTER TABLE "cases" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "cases" ADD COLUMN "review_status" "enum_cases_review_status" DEFAULT 'none';
  ALTER TABLE "cases" ADD COLUMN "seo_score" numeric;
  ALTER TABLE "_cases_v" ADD COLUMN "version_created_by_id" integer;
  ALTER TABLE "_cases_v" ADD COLUMN "version_review_status" "enum__cases_v_version_review_status" DEFAULT 'none';
  ALTER TABLE "_cases_v" ADD COLUMN "version_seo_score" numeric;
  ALTER TABLE "updates" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "updates" ADD COLUMN "review_status" "enum_updates_review_status" DEFAULT 'none';
  ALTER TABLE "updates" ADD COLUMN "seo_score" numeric;
  ALTER TABLE "_updates_v" ADD COLUMN "version_created_by_id" integer;
  ALTER TABLE "_updates_v" ADD COLUMN "version_review_status" "enum__updates_v_version_review_status" DEFAULT 'none';
  ALTER TABLE "_updates_v" ADD COLUMN "version_seo_score" numeric;
  ALTER TABLE "reviews" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "reviews" ADD COLUMN "review_status" "enum_reviews_review_status" DEFAULT 'none';
  ALTER TABLE "reviews" ADD COLUMN "seo_score" numeric;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_created_by_id" integer;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_review_status" "enum__reviews_v_version_review_status" DEFAULT 'none';
  ALTER TABLE "_reviews_v" ADD COLUMN "version_seo_score" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_large_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_large_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_large_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_large_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_large_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_large_filename" varchar;
  ALTER TABLE "users" ADD COLUMN "totp_enabled" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "totp_secret" varchar;
  ALTER TABLE "users" ADD COLUMN "totp_pending" varchar;
  ALTER TABLE "users" ADD COLUMN "recovery_codes" jsonb;
  ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT true;
  ALTER TABLE "users" ADD COLUMN "verify_token" varchar;
  ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "users" ADD COLUMN "api_key" varchar;
  ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;
  ALTER TABLE "comments" ADD COLUMN "notify_replies" boolean DEFAULT false;
  ALTER TABLE "payload_jobs" ADD COLUMN "meta" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "rank_snapshots_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "activity_log_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "auto_links_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "site_language" varchar DEFAULT 'en';
  ALTER TABLE "site_settings" ADD COLUMN "timezone" "enum_site_settings_timezone" DEFAULT 'Asia/Kolkata';
  ALTER TABLE "site_settings" ADD COLUMN "date_format" "enum_site_settings_date_format" DEFAULT 'MMM d, yyyy';
  ALTER TABLE "site_settings" ADD COLUMN "homepage_displays" "enum_site_settings_homepage_displays" DEFAULT 'page';
  ALTER TABLE "site_settings" ADD COLUMN "homepage_page_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "privacy_policy_page_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "maintenance_mode" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "maintenance_title" varchar DEFAULT 'We’ll be back soon';
  ALTER TABLE "site_settings" ADD COLUMN "maintenance_message" varchar DEFAULT 'We are doing some scheduled maintenance. Please check back shortly.';
  ALTER TABLE "site_settings" ADD COLUMN "org_type" "enum_site_settings_org_type" DEFAULT 'Organization';
  ALTER TABLE "site_settings" ADD COLUMN "local_address_street" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "local_address_locality" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "local_address_region" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "local_address_postal_code" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "local_address_country" varchar DEFAULT 'IN';
  ALTER TABLE "site_settings" ADD COLUMN "geo_lat" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "geo_lng" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "price_range" varchar;
  ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_opening_hours_days" ADD CONSTRAINT "site_settings_opening_hours_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings_opening_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_opening_hours" ADD CONSTRAINT "site_settings_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "rank_snapshots_date_idx" ON "rank_snapshots" USING btree ("date");
  CREATE INDEX "rank_snapshots_query_idx" ON "rank_snapshots" USING btree ("query");
  CREATE INDEX "rank_snapshots_page_idx" ON "rank_snapshots" USING btree ("page");
  CREATE INDEX "rank_snapshots_updated_at_idx" ON "rank_snapshots" USING btree ("updated_at");
  CREATE INDEX "rank_snapshots_created_at_idx" ON "rank_snapshots" USING btree ("created_at");
  CREATE INDEX "activity_log_action_idx" ON "activity_log" USING btree ("action");
  CREATE INDEX "activity_log_target_idx" ON "activity_log" USING btree ("target");
  CREATE INDEX "activity_log_user_idx" ON "activity_log" USING btree ("user_id");
  CREATE INDEX "activity_log_updated_at_idx" ON "activity_log" USING btree ("updated_at");
  CREATE INDEX "activity_log_created_at_idx" ON "activity_log" USING btree ("created_at");
  CREATE INDEX "auto_links_updated_at_idx" ON "auto_links" USING btree ("updated_at");
  CREATE INDEX "auto_links_created_at_idx" ON "auto_links" USING btree ("created_at");
  CREATE INDEX "site_settings_opening_hours_days_order_idx" ON "site_settings_opening_hours_days" USING btree ("order");
  CREATE INDEX "site_settings_opening_hours_days_parent_idx" ON "site_settings_opening_hours_days" USING btree ("parent_id");
  CREATE INDEX "site_settings_opening_hours_order_idx" ON "site_settings_opening_hours" USING btree ("_order");
  CREATE INDEX "site_settings_opening_hours_parent_id_idx" ON "site_settings_opening_hours" USING btree ("_parent_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases" ADD CONSTRAINT "cases_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v" ADD CONSTRAINT "_cases_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "updates" ADD CONSTRAINT "updates_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_updates_v" ADD CONSTRAINT "_updates_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rank_snapshots_fk" FOREIGN KEY ("rank_snapshots_id") REFERENCES "public"."rank_snapshots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_activity_log_fk" FOREIGN KEY ("activity_log_id") REFERENCES "public"."activity_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_auto_links_fk" FOREIGN KEY ("auto_links_id") REFERENCES "public"."auto_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_homepage_page_id_pages_id_fk" FOREIGN KEY ("homepage_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_privacy_policy_page_id_pages_id_fk" FOREIGN KEY ("privacy_policy_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_created_by_idx" ON "pages" USING btree ("created_by_id");
  CREATE INDEX "pages_review_status_idx" ON "pages" USING btree ("review_status");
  CREATE INDEX "pages_seo_score_idx" ON "pages" USING btree ("seo_score");
  CREATE INDEX "_pages_v_version_version_created_by_idx" ON "_pages_v" USING btree ("version_created_by_id");
  CREATE INDEX "_pages_v_version_version_review_status_idx" ON "_pages_v" USING btree ("version_review_status");
  CREATE INDEX "_pages_v_version_version_seo_score_idx" ON "_pages_v" USING btree ("version_seo_score");
  CREATE INDEX "posts_review_status_idx" ON "posts" USING btree ("review_status");
  CREATE INDEX "posts_seo_score_idx" ON "posts" USING btree ("seo_score");
  CREATE INDEX "_posts_v_version_version_review_status_idx" ON "_posts_v" USING btree ("version_review_status");
  CREATE INDEX "_posts_v_version_version_seo_score_idx" ON "_posts_v" USING btree ("version_seo_score");
  CREATE INDEX "guides_created_by_idx" ON "guides" USING btree ("created_by_id");
  CREATE INDEX "guides_review_status_idx" ON "guides" USING btree ("review_status");
  CREATE INDEX "guides_seo_score_idx" ON "guides" USING btree ("seo_score");
  CREATE INDEX "_guides_v_version_version_created_by_idx" ON "_guides_v" USING btree ("version_created_by_id");
  CREATE INDEX "_guides_v_version_version_review_status_idx" ON "_guides_v" USING btree ("version_review_status");
  CREATE INDEX "_guides_v_version_version_seo_score_idx" ON "_guides_v" USING btree ("version_seo_score");
  CREATE INDEX "cases_created_by_idx" ON "cases" USING btree ("created_by_id");
  CREATE INDEX "cases_review_status_idx" ON "cases" USING btree ("review_status");
  CREATE INDEX "cases_seo_score_idx" ON "cases" USING btree ("seo_score");
  CREATE INDEX "_cases_v_version_version_created_by_idx" ON "_cases_v" USING btree ("version_created_by_id");
  CREATE INDEX "_cases_v_version_version_review_status_idx" ON "_cases_v" USING btree ("version_review_status");
  CREATE INDEX "_cases_v_version_version_seo_score_idx" ON "_cases_v" USING btree ("version_seo_score");
  CREATE INDEX "updates_created_by_idx" ON "updates" USING btree ("created_by_id");
  CREATE INDEX "updates_review_status_idx" ON "updates" USING btree ("review_status");
  CREATE INDEX "updates_seo_score_idx" ON "updates" USING btree ("seo_score");
  CREATE INDEX "_updates_v_version_version_created_by_idx" ON "_updates_v" USING btree ("version_created_by_id");
  CREATE INDEX "_updates_v_version_version_review_status_idx" ON "_updates_v" USING btree ("version_review_status");
  CREATE INDEX "_updates_v_version_version_seo_score_idx" ON "_updates_v" USING btree ("version_seo_score");
  CREATE INDEX "reviews_created_by_idx" ON "reviews" USING btree ("created_by_id");
  CREATE INDEX "reviews_review_status_idx" ON "reviews" USING btree ("review_status");
  CREATE INDEX "reviews_seo_score_idx" ON "reviews" USING btree ("seo_score");
  CREATE INDEX "_reviews_v_version_version_created_by_idx" ON "_reviews_v" USING btree ("version_created_by_id");
  CREATE INDEX "_reviews_v_version_version_review_status_idx" ON "_reviews_v" USING btree ("version_review_status");
  CREATE INDEX "_reviews_v_version_version_seo_score_idx" ON "_reviews_v" USING btree ("version_seo_score");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "payload_locked_documents_rels_rank_snapshots_id_idx" ON "payload_locked_documents_rels" USING btree ("rank_snapshots_id");
  CREATE INDEX "payload_locked_documents_rels_activity_log_id_idx" ON "payload_locked_documents_rels" USING btree ("activity_log_id");
  CREATE INDEX "payload_locked_documents_rels_auto_links_id_idx" ON "payload_locked_documents_rels" USING btree ("auto_links_id");
  CREATE INDEX "site_settings_homepage_page_idx" ON "site_settings" USING btree ("homepage_page_id");
  CREATE INDEX "site_settings_privacy_policy_page_idx" ON "site_settings" USING btree ("privacy_policy_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rank_snapshots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "activity_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "auto_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "role_capabilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_opening_hours_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_opening_hours" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_stats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "rank_snapshots" CASCADE;
  DROP TABLE "activity_log" CASCADE;
  DROP TABLE "auto_links" CASCADE;
  DROP TABLE "role_capabilities" CASCADE;
  DROP TABLE "site_settings_opening_hours_days" CASCADE;
  DROP TABLE "site_settings_opening_hours" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_created_by_id_users_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_created_by_id_users_id_fk";
  
  ALTER TABLE "guides" DROP CONSTRAINT "guides_created_by_id_users_id_fk";
  
  ALTER TABLE "_guides_v" DROP CONSTRAINT "_guides_v_version_created_by_id_users_id_fk";
  
  ALTER TABLE "cases" DROP CONSTRAINT "cases_created_by_id_users_id_fk";
  
  ALTER TABLE "_cases_v" DROP CONSTRAINT "_cases_v_version_created_by_id_users_id_fk";
  
  ALTER TABLE "updates" DROP CONSTRAINT "updates_created_by_id_users_id_fk";
  
  ALTER TABLE "_updates_v" DROP CONSTRAINT "_updates_v_version_created_by_id_users_id_fk";
  
  ALTER TABLE "reviews" DROP CONSTRAINT "reviews_created_by_id_users_id_fk";
  
  ALTER TABLE "_reviews_v" DROP CONSTRAINT "_reviews_v_version_created_by_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_rank_snapshots_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_activity_log_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_auto_links_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_homepage_page_id_pages_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_privacy_policy_page_id_pages_id_fk";
  
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'seo', 'editor', 'subscriber');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  ALTER TABLE "site_settings" ALTER COLUMN "pages_schema_type" SET DATA TYPE text;
  ALTER TABLE "site_settings" ALTER COLUMN "pages_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_site_settings_pages_schema_type";
  CREATE TYPE "public"."enum_site_settings_pages_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  ALTER TABLE "site_settings" ALTER COLUMN "pages_schema_type" SET DEFAULT 'auto'::"public"."enum_site_settings_pages_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "pages_schema_type" SET DATA TYPE "public"."enum_site_settings_pages_schema_type" USING "pages_schema_type"::"public"."enum_site_settings_pages_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "posts_schema_type" SET DATA TYPE text;
  ALTER TABLE "site_settings" ALTER COLUMN "posts_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_site_settings_posts_schema_type";
  CREATE TYPE "public"."enum_site_settings_posts_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  ALTER TABLE "site_settings" ALTER COLUMN "posts_schema_type" SET DEFAULT 'auto'::"public"."enum_site_settings_posts_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "posts_schema_type" SET DATA TYPE "public"."enum_site_settings_posts_schema_type" USING "posts_schema_type"::"public"."enum_site_settings_posts_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "guides_schema_type" SET DATA TYPE text;
  ALTER TABLE "site_settings" ALTER COLUMN "guides_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_site_settings_guides_schema_type";
  CREATE TYPE "public"."enum_site_settings_guides_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  ALTER TABLE "site_settings" ALTER COLUMN "guides_schema_type" SET DEFAULT 'auto'::"public"."enum_site_settings_guides_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "guides_schema_type" SET DATA TYPE "public"."enum_site_settings_guides_schema_type" USING "guides_schema_type"::"public"."enum_site_settings_guides_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "cases_schema_type" SET DATA TYPE text;
  ALTER TABLE "site_settings" ALTER COLUMN "cases_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_site_settings_cases_schema_type";
  CREATE TYPE "public"."enum_site_settings_cases_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  ALTER TABLE "site_settings" ALTER COLUMN "cases_schema_type" SET DEFAULT 'auto'::"public"."enum_site_settings_cases_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "cases_schema_type" SET DATA TYPE "public"."enum_site_settings_cases_schema_type" USING "cases_schema_type"::"public"."enum_site_settings_cases_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "updates_schema_type" SET DATA TYPE text;
  ALTER TABLE "site_settings" ALTER COLUMN "updates_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_site_settings_updates_schema_type";
  CREATE TYPE "public"."enum_site_settings_updates_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  ALTER TABLE "site_settings" ALTER COLUMN "updates_schema_type" SET DEFAULT 'auto'::"public"."enum_site_settings_updates_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "updates_schema_type" SET DATA TYPE "public"."enum_site_settings_updates_schema_type" USING "updates_schema_type"::"public"."enum_site_settings_updates_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "reviews_schema_type" SET DATA TYPE text;
  ALTER TABLE "site_settings" ALTER COLUMN "reviews_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_site_settings_reviews_schema_type";
  CREATE TYPE "public"."enum_site_settings_reviews_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  ALTER TABLE "site_settings" ALTER COLUMN "reviews_schema_type" SET DEFAULT 'auto'::"public"."enum_site_settings_reviews_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "reviews_schema_type" SET DATA TYPE "public"."enum_site_settings_reviews_schema_type" USING "reviews_schema_type"::"public"."enum_site_settings_reviews_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "categories_schema_type" SET DATA TYPE text;
  ALTER TABLE "site_settings" ALTER COLUMN "categories_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_site_settings_categories_schema_type";
  CREATE TYPE "public"."enum_site_settings_categories_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  ALTER TABLE "site_settings" ALTER COLUMN "categories_schema_type" SET DEFAULT 'auto'::"public"."enum_site_settings_categories_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "categories_schema_type" SET DATA TYPE "public"."enum_site_settings_categories_schema_type" USING "categories_schema_type"::"public"."enum_site_settings_categories_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "tags_schema_type" SET DATA TYPE text;
  ALTER TABLE "site_settings" ALTER COLUMN "tags_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_site_settings_tags_schema_type";
  CREATE TYPE "public"."enum_site_settings_tags_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'none');
  ALTER TABLE "site_settings" ALTER COLUMN "tags_schema_type" SET DEFAULT 'auto'::"public"."enum_site_settings_tags_schema_type";
  ALTER TABLE "site_settings" ALTER COLUMN "tags_schema_type" SET DATA TYPE "public"."enum_site_settings_tags_schema_type" USING "tags_schema_type"::"public"."enum_site_settings_tags_schema_type";
  DROP INDEX "pages_created_by_idx";
  DROP INDEX "pages_review_status_idx";
  DROP INDEX "pages_seo_score_idx";
  DROP INDEX "_pages_v_version_version_created_by_idx";
  DROP INDEX "_pages_v_version_version_review_status_idx";
  DROP INDEX "_pages_v_version_version_seo_score_idx";
  DROP INDEX "posts_review_status_idx";
  DROP INDEX "posts_seo_score_idx";
  DROP INDEX "_posts_v_version_version_review_status_idx";
  DROP INDEX "_posts_v_version_version_seo_score_idx";
  DROP INDEX "guides_created_by_idx";
  DROP INDEX "guides_review_status_idx";
  DROP INDEX "guides_seo_score_idx";
  DROP INDEX "_guides_v_version_version_created_by_idx";
  DROP INDEX "_guides_v_version_version_review_status_idx";
  DROP INDEX "_guides_v_version_version_seo_score_idx";
  DROP INDEX "cases_created_by_idx";
  DROP INDEX "cases_review_status_idx";
  DROP INDEX "cases_seo_score_idx";
  DROP INDEX "_cases_v_version_version_created_by_idx";
  DROP INDEX "_cases_v_version_version_review_status_idx";
  DROP INDEX "_cases_v_version_version_seo_score_idx";
  DROP INDEX "updates_created_by_idx";
  DROP INDEX "updates_review_status_idx";
  DROP INDEX "updates_seo_score_idx";
  DROP INDEX "_updates_v_version_version_created_by_idx";
  DROP INDEX "_updates_v_version_version_review_status_idx";
  DROP INDEX "_updates_v_version_version_seo_score_idx";
  DROP INDEX "reviews_created_by_idx";
  DROP INDEX "reviews_review_status_idx";
  DROP INDEX "reviews_seo_score_idx";
  DROP INDEX "_reviews_v_version_version_created_by_idx";
  DROP INDEX "_reviews_v_version_version_review_status_idx";
  DROP INDEX "_reviews_v_version_version_seo_score_idx";
  DROP INDEX "media_sizes_medium_sizes_medium_filename_idx";
  DROP INDEX "media_sizes_large_sizes_large_filename_idx";
  DROP INDEX "payload_locked_documents_rels_rank_snapshots_id_idx";
  DROP INDEX "payload_locked_documents_rels_activity_log_id_idx";
  DROP INDEX "payload_locked_documents_rels_auto_links_id_idx";
  DROP INDEX "site_settings_homepage_page_idx";
  DROP INDEX "site_settings_privacy_policy_page_idx";
  ALTER TABLE "pages" DROP COLUMN "created_by_id";
  ALTER TABLE "pages" DROP COLUMN "review_status";
  ALTER TABLE "pages" DROP COLUMN "seo_score";
  ALTER TABLE "_pages_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_review_status";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_score";
  ALTER TABLE "posts" DROP COLUMN "review_status";
  ALTER TABLE "posts" DROP COLUMN "seo_score";
  ALTER TABLE "_posts_v" DROP COLUMN "version_review_status";
  ALTER TABLE "_posts_v" DROP COLUMN "version_seo_score";
  ALTER TABLE "guides" DROP COLUMN "created_by_id";
  ALTER TABLE "guides" DROP COLUMN "review_status";
  ALTER TABLE "guides" DROP COLUMN "seo_score";
  ALTER TABLE "_guides_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "_guides_v" DROP COLUMN "version_review_status";
  ALTER TABLE "_guides_v" DROP COLUMN "version_seo_score";
  ALTER TABLE "cases" DROP COLUMN "created_by_id";
  ALTER TABLE "cases" DROP COLUMN "review_status";
  ALTER TABLE "cases" DROP COLUMN "seo_score";
  ALTER TABLE "_cases_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "_cases_v" DROP COLUMN "version_review_status";
  ALTER TABLE "_cases_v" DROP COLUMN "version_seo_score";
  ALTER TABLE "updates" DROP COLUMN "created_by_id";
  ALTER TABLE "updates" DROP COLUMN "review_status";
  ALTER TABLE "updates" DROP COLUMN "seo_score";
  ALTER TABLE "_updates_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "_updates_v" DROP COLUMN "version_review_status";
  ALTER TABLE "_updates_v" DROP COLUMN "version_seo_score";
  ALTER TABLE "reviews" DROP COLUMN "created_by_id";
  ALTER TABLE "reviews" DROP COLUMN "review_status";
  ALTER TABLE "reviews" DROP COLUMN "seo_score";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_review_status";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_seo_score";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_url";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_width";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_height";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_large_url";
  ALTER TABLE "media" DROP COLUMN "sizes_large_width";
  ALTER TABLE "media" DROP COLUMN "sizes_large_height";
  ALTER TABLE "media" DROP COLUMN "sizes_large_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_large_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_large_filename";
  ALTER TABLE "users" DROP COLUMN "totp_enabled";
  ALTER TABLE "users" DROP COLUMN "totp_secret";
  ALTER TABLE "users" DROP COLUMN "totp_pending";
  ALTER TABLE "users" DROP COLUMN "recovery_codes";
  ALTER TABLE "users" DROP COLUMN "email_verified";
  ALTER TABLE "users" DROP COLUMN "verify_token";
  ALTER TABLE "users" DROP COLUMN "enable_a_p_i_key";
  ALTER TABLE "users" DROP COLUMN "api_key";
  ALTER TABLE "users" DROP COLUMN "api_key_index";
  ALTER TABLE "comments" DROP COLUMN "notify_replies";
  ALTER TABLE "payload_jobs" DROP COLUMN "meta";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "rank_snapshots_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "activity_log_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "auto_links_id";
  ALTER TABLE "site_settings" DROP COLUMN "site_language";
  ALTER TABLE "site_settings" DROP COLUMN "timezone";
  ALTER TABLE "site_settings" DROP COLUMN "date_format";
  ALTER TABLE "site_settings" DROP COLUMN "homepage_displays";
  ALTER TABLE "site_settings" DROP COLUMN "homepage_page_id";
  ALTER TABLE "site_settings" DROP COLUMN "privacy_policy_page_id";
  ALTER TABLE "site_settings" DROP COLUMN "maintenance_mode";
  ALTER TABLE "site_settings" DROP COLUMN "maintenance_title";
  ALTER TABLE "site_settings" DROP COLUMN "maintenance_message";
  ALTER TABLE "site_settings" DROP COLUMN "org_type";
  ALTER TABLE "site_settings" DROP COLUMN "local_address_street";
  ALTER TABLE "site_settings" DROP COLUMN "local_address_locality";
  ALTER TABLE "site_settings" DROP COLUMN "local_address_region";
  ALTER TABLE "site_settings" DROP COLUMN "local_address_postal_code";
  ALTER TABLE "site_settings" DROP COLUMN "local_address_country";
  ALTER TABLE "site_settings" DROP COLUMN "geo_lat";
  ALTER TABLE "site_settings" DROP COLUMN "geo_lng";
  ALTER TABLE "site_settings" DROP COLUMN "price_range";
  DROP TYPE "public"."enum_pages_review_status";
  DROP TYPE "public"."enum__pages_v_version_review_status";
  DROP TYPE "public"."enum_posts_review_status";
  DROP TYPE "public"."enum__posts_v_version_review_status";
  DROP TYPE "public"."enum_guides_review_status";
  DROP TYPE "public"."enum__guides_v_version_review_status";
  DROP TYPE "public"."enum_cases_review_status";
  DROP TYPE "public"."enum__cases_v_version_review_status";
  DROP TYPE "public"."enum_updates_review_status";
  DROP TYPE "public"."enum__updates_v_version_review_status";
  DROP TYPE "public"."enum_reviews_review_status";
  DROP TYPE "public"."enum__reviews_v_version_review_status";
  DROP TYPE "public"."enum_activity_log_action";
  DROP TYPE "public"."enum_site_settings_opening_hours_days";
  DROP TYPE "public"."enum_site_settings_timezone";
  DROP TYPE "public"."enum_site_settings_date_format";
  DROP TYPE "public"."enum_site_settings_homepage_displays";
  DROP TYPE "public"."enum_site_settings_org_type";`)
}
