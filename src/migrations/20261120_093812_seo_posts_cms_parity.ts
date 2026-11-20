import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum_pages_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum__pages_v_version_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum__pages_v_version_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum_posts_visibility" AS ENUM('public', 'password', 'private');
  CREATE TYPE "public"."enum_posts_format" AS ENUM('standard', 'aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio', 'chat');
  CREATE TYPE "public"."enum_posts_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum_posts_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum__posts_v_version_visibility" AS ENUM('public', 'password', 'private');
  CREATE TYPE "public"."enum__posts_v_version_format" AS ENUM('standard', 'aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio', 'chat');
  CREATE TYPE "public"."enum__posts_v_version_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum__posts_v_version_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum_guides_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum_guides_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum__guides_v_version_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum__guides_v_version_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum_cases_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum_cases_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum__cases_v_version_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum__cases_v_version_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum_updates_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum_updates_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum__updates_v_version_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum__updates_v_version_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum_reviews_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum_reviews_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum__reviews_v_version_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum__reviews_v_version_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum_categories_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum_categories_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum_tags_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum_tags_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum_section_categories_meta_schema_data_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly');
  CREATE TYPE "public"."enum_section_categories_meta_schema_data_event_mode" AS ENUM('OnlineEventAttendanceMode', 'OfflineEventAttendanceMode', 'MixedEventAttendanceMode');
  CREATE TYPE "public"."enum_plugin_settings_related_mode" AS ENUM('latest', 'related');
  ALTER TYPE "public"."enum_pages_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_pages_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_pages_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_pages_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_pages_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum_pages_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum__pages_v_version_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum__pages_v_version_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__pages_v_version_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__pages_v_version_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum__pages_v_version_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum__pages_v_version_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum_posts_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_posts_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_posts_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_posts_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_posts_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum_posts_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum__posts_v_version_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum__posts_v_version_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__posts_v_version_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__posts_v_version_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum__posts_v_version_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum__posts_v_version_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum_guides_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_guides_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_guides_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_guides_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_guides_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum_guides_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum__guides_v_version_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum__guides_v_version_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__guides_v_version_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__guides_v_version_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum__guides_v_version_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum__guides_v_version_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum_cases_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_cases_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_cases_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_cases_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_cases_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum_cases_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum__cases_v_version_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum__cases_v_version_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__cases_v_version_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__cases_v_version_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum__cases_v_version_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum__cases_v_version_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum_updates_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_updates_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_updates_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_updates_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_updates_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum_updates_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum__updates_v_version_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum__updates_v_version_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__updates_v_version_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__updates_v_version_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum__updates_v_version_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum__updates_v_version_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum_reviews_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_reviews_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_reviews_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_reviews_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_reviews_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum_reviews_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum__reviews_v_version_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum__reviews_v_version_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__reviews_v_version_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum__reviews_v_version_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum__reviews_v_version_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum__reviews_v_version_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum_categories_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_categories_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_categories_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_categories_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_categories_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum_categories_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum_tags_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_tags_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_tags_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_tags_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_tags_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum_tags_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum_section_categories_meta_schema_type" ADD VALUE 'NewsArticle' BEFORE 'WebPage';
  ALTER TYPE "public"."enum_section_categories_meta_schema_type" ADD VALUE 'HowTo' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_section_categories_meta_schema_type" ADD VALUE 'Product' BEFORE 'SoftwareApplication';
  ALTER TYPE "public"."enum_section_categories_meta_schema_type" ADD VALUE 'Course' BEFORE 'none';
  ALTER TYPE "public"."enum_section_categories_meta_schema_type" ADD VALUE 'Event' BEFORE 'none';
  ALTER TYPE "public"."enum_section_categories_meta_schema_type" ADD VALUE 'VideoObject' BEFORE 'none';
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'subscriber';
  CREATE TABLE "pages_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar
  );
  
  CREATE TABLE "_pages_v_version_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "posts_custom_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "posts_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar
  );
  
  CREATE TABLE "_posts_v_version_custom_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "guides_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar
  );
  
  CREATE TABLE "_guides_v_version_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cases_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar
  );
  
  CREATE TABLE "_cases_v_version_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "updates_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar
  );
  
  CREATE TABLE "_updates_v_version_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "reviews_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar
  );
  
  CREATE TABLE "_reviews_v_version_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "categories_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar
  );
  
  CREATE TABLE "tags_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar
  );
  
  CREATE TABLE "section_categories_meta_schema_data_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"image" varchar
  );
  
  CREATE TABLE "patterns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" varchar,
  	"content_html" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "media" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "meta_secondary_keywords" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_name" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_total_time" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_price" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_availability" "enum_pages_meta_schema_data_availability";
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_brand" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_sku" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_rating_value" numeric;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_review_count" numeric;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_provider" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_event_mode" "enum_pages_meta_schema_data_event_mode";
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_location" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_video_url" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_duration" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "pages" ADD COLUMN "meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_secondary_keywords" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_name" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_total_time" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_price" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_availability" "enum__pages_v_version_meta_schema_data_availability";
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_brand" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_sku" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_rating_value" numeric;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_review_count" numeric;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_provider" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_event_mode" "enum__pages_v_version_meta_schema_data_event_mode";
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_location" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_video_url" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_duration" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "posts" ADD COLUMN "visibility" "enum_posts_visibility" DEFAULT 'public';
  ALTER TABLE "posts" ADD COLUMN "post_password" varchar;
  ALTER TABLE "posts" ADD COLUMN "sticky" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "format" "enum_posts_format" DEFAULT 'standard';
  ALTER TABLE "posts" ADD COLUMN "meta_secondary_keywords" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_name" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_description" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_total_time" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_price" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_availability" "enum_posts_meta_schema_data_availability";
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_brand" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_sku" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_rating_value" numeric;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_review_count" numeric;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_provider" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_event_mode" "enum_posts_meta_schema_data_event_mode";
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_location" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_video_url" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_duration" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_visibility" "enum__posts_v_version_visibility" DEFAULT 'public';
  ALTER TABLE "_posts_v" ADD COLUMN "version_post_password" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_sticky" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_format" "enum__posts_v_version_format" DEFAULT 'standard';
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_secondary_keywords" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_name" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_description" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_total_time" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_price" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_availability" "enum__posts_v_version_meta_schema_data_availability";
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_brand" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_sku" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_rating_value" numeric;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_review_count" numeric;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_provider" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_event_mode" "enum__posts_v_version_meta_schema_data_event_mode";
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_location" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_video_url" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_duration" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_secondary_keywords" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_name" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_description" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_total_time" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_price" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_availability" "enum_guides_meta_schema_data_availability";
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_brand" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_sku" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_rating_value" numeric;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_review_count" numeric;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_provider" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_event_mode" "enum_guides_meta_schema_data_event_mode";
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_location" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_video_url" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_duration" varchar;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "guides" ADD COLUMN "meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_secondary_keywords" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_name" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_description" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_total_time" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_price" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_availability" "enum__guides_v_version_meta_schema_data_availability";
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_brand" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_sku" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_rating_value" numeric;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_review_count" numeric;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_provider" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_event_mode" "enum__guides_v_version_meta_schema_data_event_mode";
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_location" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_video_url" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_duration" varchar;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "_guides_v" ADD COLUMN "version_meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_secondary_keywords" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_name" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_description" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_total_time" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_price" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_availability" "enum_cases_meta_schema_data_availability";
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_brand" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_sku" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_rating_value" numeric;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_review_count" numeric;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_provider" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_event_mode" "enum_cases_meta_schema_data_event_mode";
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_location" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_video_url" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_duration" varchar;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "cases" ADD COLUMN "meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_secondary_keywords" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_name" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_description" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_total_time" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_price" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_availability" "enum__cases_v_version_meta_schema_data_availability";
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_brand" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_sku" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_rating_value" numeric;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_review_count" numeric;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_provider" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_event_mode" "enum__cases_v_version_meta_schema_data_event_mode";
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_location" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_video_url" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_duration" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "_cases_v" ADD COLUMN "version_meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_secondary_keywords" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_name" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_description" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_total_time" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_price" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_availability" "enum_updates_meta_schema_data_availability";
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_brand" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_sku" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_rating_value" numeric;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_review_count" numeric;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_provider" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_event_mode" "enum_updates_meta_schema_data_event_mode";
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_location" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_video_url" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_duration" varchar;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "updates" ADD COLUMN "meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_secondary_keywords" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_name" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_description" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_total_time" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_price" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_availability" "enum__updates_v_version_meta_schema_data_availability";
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_brand" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_sku" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_rating_value" numeric;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_review_count" numeric;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_provider" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_event_mode" "enum__updates_v_version_meta_schema_data_event_mode";
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_location" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_video_url" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_duration" varchar;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "_updates_v" ADD COLUMN "version_meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_secondary_keywords" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_name" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_description" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_total_time" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_price" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_availability" "enum_reviews_meta_schema_data_availability";
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_brand" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_sku" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_rating_value" numeric;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_review_count" numeric;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_provider" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_event_mode" "enum_reviews_meta_schema_data_event_mode";
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_location" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_video_url" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_duration" varchar;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "reviews" ADD COLUMN "meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_secondary_keywords" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_name" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_description" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_total_time" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_price" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_availability" "enum__reviews_v_version_meta_schema_data_availability";
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_brand" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_sku" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_rating_value" numeric;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_review_count" numeric;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_provider" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_event_mode" "enum__reviews_v_version_meta_schema_data_event_mode";
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_location" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_video_url" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_duration" varchar;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_secondary_keywords" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_name" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_description" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_total_time" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_price" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_availability" "enum_categories_meta_schema_data_availability";
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_brand" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_sku" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_rating_value" numeric;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_review_count" numeric;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_provider" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_event_mode" "enum_categories_meta_schema_data_event_mode";
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_location" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_video_url" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_duration" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "categories" ADD COLUMN "meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_secondary_keywords" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_name" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_description" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_total_time" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_price" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_availability" "enum_tags_meta_schema_data_availability";
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_brand" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_sku" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_rating_value" numeric;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_review_count" numeric;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_provider" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_event_mode" "enum_tags_meta_schema_data_event_mode";
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_location" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_video_url" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_duration" varchar;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "tags" ADD COLUMN "meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_secondary_keywords" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_name" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_description" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_total_time" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_price" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_currency" varchar DEFAULT 'INR';
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_availability" "enum_section_categories_meta_schema_data_availability";
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_brand" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_sku" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_application_category" varchar DEFAULT 'BusinessApplication';
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_operating_system" varchar DEFAULT 'Web';
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_rating_value" numeric;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_review_count" numeric;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_provider" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_start_date" timestamp(3) with time zone;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_end_date" timestamp(3) with time zone;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_event_mode" "enum_section_categories_meta_schema_data_event_mode";
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_location" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_video_url" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_duration" varchar;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_upload_date" timestamp(3) with time zone;
  ALTER TABLE "section_categories" ADD COLUMN "meta_schema_data_thumbnail_url" varchar;
  ALTER TABLE "media" ADD COLUMN "folder_id" integer;
  ALTER TABLE "users" ADD COLUMN "slug" varchar;
  ALTER TABLE "users" ADD COLUMN "job_title" varchar;
  ALTER TABLE "users" ADD COLUMN "website" varchar;
  ALTER TABLE "users" ADD COLUMN "twitter" varchar;
  ALTER TABLE "users" ADD COLUMN "linkedin" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "patterns_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_folders_id" integer;
  ALTER TABLE "plugin_settings" ADD COLUMN "notify_on_publish" boolean DEFAULT false;
  ALTER TABLE "plugin_settings" ADD COLUMN "notify_on_publish_to" varchar;
  ALTER TABLE "plugin_settings" ADD COLUMN "related_mode" "enum_plugin_settings_related_mode" DEFAULT 'latest';
  ALTER TABLE "plugin_settings" ADD COLUMN "show_prev_next" boolean DEFAULT false;
  ALTER TABLE "plugin_settings" ADD COLUMN "users_can_register" boolean DEFAULT false;
  ALTER TABLE "plugin_settings" ADD COLUMN "index_now_enabled" boolean DEFAULT true;
  ALTER TABLE "plugin_settings" ADD COLUMN "index_now_key" varchar;
  ALTER TABLE "plugin_settings" ADD COLUMN "date_archives" boolean DEFAULT true;
  ALTER TABLE "plugin_settings" ADD COLUMN "author_archives" boolean DEFAULT true;
  ALTER TABLE "plugin_settings" ADD COLUMN "news_sitemap" boolean DEFAULT false;
  ALTER TABLE "plugin_settings" ADD COLUMN "news_publication_name" varchar DEFAULT 'AI Vastra';
  ALTER TABLE "plugin_settings" ADD COLUMN "video_sitemap" boolean DEFAULT false;
  ALTER TABLE "pages_meta_schema_data_steps" ADD CONSTRAINT "pages_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_meta_schema_data_steps" ADD CONSTRAINT "_pages_v_version_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_custom_fields" ADD CONSTRAINT "posts_custom_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_meta_schema_data_steps" ADD CONSTRAINT "posts_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_custom_fields" ADD CONSTRAINT "_posts_v_version_custom_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_meta_schema_data_steps" ADD CONSTRAINT "_posts_v_version_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_meta_schema_data_steps" ADD CONSTRAINT "guides_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_guides_v_version_meta_schema_data_steps" ADD CONSTRAINT "_guides_v_version_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_guides_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_meta_schema_data_steps" ADD CONSTRAINT "cases_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_version_meta_schema_data_steps" ADD CONSTRAINT "_cases_v_version_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "updates_meta_schema_data_steps" ADD CONSTRAINT "updates_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_updates_v_version_meta_schema_data_steps" ADD CONSTRAINT "_updates_v_version_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_updates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews_meta_schema_data_steps" ADD CONSTRAINT "reviews_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reviews_v_version_meta_schema_data_steps" ADD CONSTRAINT "_reviews_v_version_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reviews_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_meta_schema_data_steps" ADD CONSTRAINT "categories_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_meta_schema_data_steps" ADD CONSTRAINT "tags_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "section_categories_meta_schema_data_steps" ADD CONSTRAINT "section_categories_meta_schema_data_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."section_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_meta_schema_data_steps_order_idx" ON "pages_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "pages_meta_schema_data_steps_parent_id_idx" ON "pages_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_meta_schema_data_steps_order_idx" ON "_pages_v_version_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_version_meta_schema_data_steps_parent_id_idx" ON "_pages_v_version_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "posts_custom_fields_order_idx" ON "posts_custom_fields" USING btree ("_order");
  CREATE INDEX "posts_custom_fields_parent_id_idx" ON "posts_custom_fields" USING btree ("_parent_id");
  CREATE INDEX "posts_meta_schema_data_steps_order_idx" ON "posts_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "posts_meta_schema_data_steps_parent_id_idx" ON "posts_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_custom_fields_order_idx" ON "_posts_v_version_custom_fields" USING btree ("_order");
  CREATE INDEX "_posts_v_version_custom_fields_parent_id_idx" ON "_posts_v_version_custom_fields" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_meta_schema_data_steps_order_idx" ON "_posts_v_version_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "_posts_v_version_meta_schema_data_steps_parent_id_idx" ON "_posts_v_version_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "guides_meta_schema_data_steps_order_idx" ON "guides_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "guides_meta_schema_data_steps_parent_id_idx" ON "guides_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "_guides_v_version_meta_schema_data_steps_order_idx" ON "_guides_v_version_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "_guides_v_version_meta_schema_data_steps_parent_id_idx" ON "_guides_v_version_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "cases_meta_schema_data_steps_order_idx" ON "cases_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "cases_meta_schema_data_steps_parent_id_idx" ON "cases_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "_cases_v_version_meta_schema_data_steps_order_idx" ON "_cases_v_version_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "_cases_v_version_meta_schema_data_steps_parent_id_idx" ON "_cases_v_version_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "updates_meta_schema_data_steps_order_idx" ON "updates_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "updates_meta_schema_data_steps_parent_id_idx" ON "updates_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "_updates_v_version_meta_schema_data_steps_order_idx" ON "_updates_v_version_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "_updates_v_version_meta_schema_data_steps_parent_id_idx" ON "_updates_v_version_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "reviews_meta_schema_data_steps_order_idx" ON "reviews_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "reviews_meta_schema_data_steps_parent_id_idx" ON "reviews_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "_reviews_v_version_meta_schema_data_steps_order_idx" ON "_reviews_v_version_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "_reviews_v_version_meta_schema_data_steps_parent_id_idx" ON "_reviews_v_version_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "categories_meta_schema_data_steps_order_idx" ON "categories_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "categories_meta_schema_data_steps_parent_id_idx" ON "categories_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "tags_meta_schema_data_steps_order_idx" ON "tags_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "tags_meta_schema_data_steps_parent_id_idx" ON "tags_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "section_categories_meta_schema_data_steps_order_idx" ON "section_categories_meta_schema_data_steps" USING btree ("_order");
  CREATE INDEX "section_categories_meta_schema_data_steps_parent_id_idx" ON "section_categories_meta_schema_data_steps" USING btree ("_parent_id");
  CREATE INDEX "patterns_updated_at_idx" ON "patterns" USING btree ("updated_at");
  CREATE INDEX "patterns_created_at_idx" ON "patterns" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_folders_name_idx" ON "media_folders" USING btree ("name");
  CREATE INDEX "media_folders_updated_at_idx" ON "media_folders" USING btree ("updated_at");
  CREATE INDEX "media_folders_created_at_idx" ON "media_folders" USING btree ("created_at");
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_media_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."media_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_patterns_fk" FOREIGN KEY ("patterns_id") REFERENCES "public"."patterns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_folders_fk" FOREIGN KEY ("media_folders_id") REFERENCES "public"."media_folders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_visibility_idx" ON "posts" USING btree ("visibility");
  CREATE INDEX "posts_sticky_idx" ON "posts" USING btree ("sticky");
  CREATE INDEX "_posts_v_version_version_visibility_idx" ON "_posts_v" USING btree ("version_visibility");
  CREATE INDEX "_posts_v_version_version_sticky_idx" ON "_posts_v" USING btree ("version_sticky");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE UNIQUE INDEX "users_slug_idx" ON "users" USING btree ("slug");
  CREATE INDEX "payload_locked_documents_rels_patterns_id_idx" ON "payload_locked_documents_rels" USING btree ("patterns_id");
  CREATE INDEX "payload_locked_documents_rels_media_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("media_folders_id");
  -- Author archive slugs for existing users
  UPDATE "users" SET "slug" = trim(both '-' from lower(regexp_replace("name", '[^a-zA-Z0-9]+', '-', 'g'))) WHERE "slug" IS NULL AND "name" IS NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_custom_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_custom_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_guides_v_version_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cases_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cases_v_version_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "updates_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_updates_v_version_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reviews_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reviews_v_version_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tags_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "section_categories_meta_schema_data_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "patterns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_folders" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_meta_schema_data_steps" CASCADE;
  DROP TABLE "_pages_v_version_meta_schema_data_steps" CASCADE;
  DROP TABLE "posts_custom_fields" CASCADE;
  DROP TABLE "posts_meta_schema_data_steps" CASCADE;
  DROP TABLE "_posts_v_version_custom_fields" CASCADE;
  DROP TABLE "_posts_v_version_meta_schema_data_steps" CASCADE;
  DROP TABLE "guides_meta_schema_data_steps" CASCADE;
  DROP TABLE "_guides_v_version_meta_schema_data_steps" CASCADE;
  DROP TABLE "cases_meta_schema_data_steps" CASCADE;
  DROP TABLE "_cases_v_version_meta_schema_data_steps" CASCADE;
  DROP TABLE "updates_meta_schema_data_steps" CASCADE;
  DROP TABLE "_updates_v_version_meta_schema_data_steps" CASCADE;
  DROP TABLE "reviews_meta_schema_data_steps" CASCADE;
  DROP TABLE "_reviews_v_version_meta_schema_data_steps" CASCADE;
  DROP TABLE "categories_meta_schema_data_steps" CASCADE;
  DROP TABLE "tags_meta_schema_data_steps" CASCADE;
  DROP TABLE "section_categories_meta_schema_data_steps" CASCADE;
  DROP TABLE "patterns" CASCADE;
  DROP TABLE "media_folders" CASCADE;
  ALTER TABLE "media" DROP CONSTRAINT "media_folder_id_media_folders_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_patterns_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_folders_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_pages_meta_schema_type";
  CREATE TYPE "public"."enum_pages_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "pages" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::"public"."enum_pages_meta_schema_type";
  ALTER TABLE "pages" ALTER COLUMN "meta_schema_type" SET DATA TYPE "public"."enum_pages_meta_schema_type" USING "meta_schema_type"::"public"."enum_pages_meta_schema_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum__pages_v_version_meta_schema_type";
  CREATE TYPE "public"."enum__pages_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::"public"."enum__pages_v_version_meta_schema_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE "public"."enum__pages_v_version_meta_schema_type" USING "version_meta_schema_type"::"public"."enum__pages_v_version_meta_schema_type";
  ALTER TABLE "posts" ALTER COLUMN "meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "posts" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_posts_meta_schema_type";
  CREATE TYPE "public"."enum_posts_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "posts" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::"public"."enum_posts_meta_schema_type";
  ALTER TABLE "posts" ALTER COLUMN "meta_schema_type" SET DATA TYPE "public"."enum_posts_meta_schema_type" USING "meta_schema_type"::"public"."enum_posts_meta_schema_type";
  ALTER TABLE "_posts_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "_posts_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum__posts_v_version_meta_schema_type";
  CREATE TYPE "public"."enum__posts_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "_posts_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::"public"."enum__posts_v_version_meta_schema_type";
  ALTER TABLE "_posts_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE "public"."enum__posts_v_version_meta_schema_type" USING "version_meta_schema_type"::"public"."enum__posts_v_version_meta_schema_type";
  ALTER TABLE "guides" ALTER COLUMN "meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "guides" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_guides_meta_schema_type";
  CREATE TYPE "public"."enum_guides_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "guides" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::"public"."enum_guides_meta_schema_type";
  ALTER TABLE "guides" ALTER COLUMN "meta_schema_type" SET DATA TYPE "public"."enum_guides_meta_schema_type" USING "meta_schema_type"::"public"."enum_guides_meta_schema_type";
  ALTER TABLE "_guides_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "_guides_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum__guides_v_version_meta_schema_type";
  CREATE TYPE "public"."enum__guides_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "_guides_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::"public"."enum__guides_v_version_meta_schema_type";
  ALTER TABLE "_guides_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE "public"."enum__guides_v_version_meta_schema_type" USING "version_meta_schema_type"::"public"."enum__guides_v_version_meta_schema_type";
  ALTER TABLE "cases" ALTER COLUMN "meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "cases" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_cases_meta_schema_type";
  CREATE TYPE "public"."enum_cases_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "cases" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::"public"."enum_cases_meta_schema_type";
  ALTER TABLE "cases" ALTER COLUMN "meta_schema_type" SET DATA TYPE "public"."enum_cases_meta_schema_type" USING "meta_schema_type"::"public"."enum_cases_meta_schema_type";
  ALTER TABLE "_cases_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "_cases_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum__cases_v_version_meta_schema_type";
  CREATE TYPE "public"."enum__cases_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "_cases_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::"public"."enum__cases_v_version_meta_schema_type";
  ALTER TABLE "_cases_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE "public"."enum__cases_v_version_meta_schema_type" USING "version_meta_schema_type"::"public"."enum__cases_v_version_meta_schema_type";
  ALTER TABLE "updates" ALTER COLUMN "meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "updates" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_updates_meta_schema_type";
  CREATE TYPE "public"."enum_updates_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "updates" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::"public"."enum_updates_meta_schema_type";
  ALTER TABLE "updates" ALTER COLUMN "meta_schema_type" SET DATA TYPE "public"."enum_updates_meta_schema_type" USING "meta_schema_type"::"public"."enum_updates_meta_schema_type";
  ALTER TABLE "_updates_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "_updates_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum__updates_v_version_meta_schema_type";
  CREATE TYPE "public"."enum__updates_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "_updates_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::"public"."enum__updates_v_version_meta_schema_type";
  ALTER TABLE "_updates_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE "public"."enum__updates_v_version_meta_schema_type" USING "version_meta_schema_type"::"public"."enum__updates_v_version_meta_schema_type";
  ALTER TABLE "reviews" ALTER COLUMN "meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "reviews" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_reviews_meta_schema_type";
  CREATE TYPE "public"."enum_reviews_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "reviews" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::"public"."enum_reviews_meta_schema_type";
  ALTER TABLE "reviews" ALTER COLUMN "meta_schema_type" SET DATA TYPE "public"."enum_reviews_meta_schema_type" USING "meta_schema_type"::"public"."enum_reviews_meta_schema_type";
  ALTER TABLE "_reviews_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "_reviews_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum__reviews_v_version_meta_schema_type";
  CREATE TYPE "public"."enum__reviews_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "_reviews_v" ALTER COLUMN "version_meta_schema_type" SET DEFAULT 'auto'::"public"."enum__reviews_v_version_meta_schema_type";
  ALTER TABLE "_reviews_v" ALTER COLUMN "version_meta_schema_type" SET DATA TYPE "public"."enum__reviews_v_version_meta_schema_type" USING "version_meta_schema_type"::"public"."enum__reviews_v_version_meta_schema_type";
  ALTER TABLE "categories" ALTER COLUMN "meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "categories" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_categories_meta_schema_type";
  CREATE TYPE "public"."enum_categories_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "categories" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::"public"."enum_categories_meta_schema_type";
  ALTER TABLE "categories" ALTER COLUMN "meta_schema_type" SET DATA TYPE "public"."enum_categories_meta_schema_type" USING "meta_schema_type"::"public"."enum_categories_meta_schema_type";
  ALTER TABLE "tags" ALTER COLUMN "meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "tags" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_tags_meta_schema_type";
  CREATE TYPE "public"."enum_tags_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "tags" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::"public"."enum_tags_meta_schema_type";
  ALTER TABLE "tags" ALTER COLUMN "meta_schema_type" SET DATA TYPE "public"."enum_tags_meta_schema_type" USING "meta_schema_type"::"public"."enum_tags_meta_schema_type";
  ALTER TABLE "section_categories" ALTER COLUMN "meta_schema_type" SET DATA TYPE text;
  ALTER TABLE "section_categories" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_section_categories_meta_schema_type";
  CREATE TYPE "public"."enum_section_categories_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  ALTER TABLE "section_categories" ALTER COLUMN "meta_schema_type" SET DEFAULT 'auto'::"public"."enum_section_categories_meta_schema_type";
  ALTER TABLE "section_categories" ALTER COLUMN "meta_schema_type" SET DATA TYPE "public"."enum_section_categories_meta_schema_type" USING "meta_schema_type"::"public"."enum_section_categories_meta_schema_type";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'seo', 'editor');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  DROP INDEX "posts_visibility_idx";
  DROP INDEX "posts_sticky_idx";
  DROP INDEX "_posts_v_version_version_visibility_idx";
  DROP INDEX "_posts_v_version_version_sticky_idx";
  DROP INDEX "media_folder_idx";
  DROP INDEX "users_slug_idx";
  DROP INDEX "payload_locked_documents_rels_patterns_id_idx";
  DROP INDEX "payload_locked_documents_rels_media_folders_id_idx";
  ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "pages" DROP COLUMN "meta_secondary_keywords";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_name";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_description";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_total_time";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_price";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_currency";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_availability";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_brand";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_sku";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_application_category";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_operating_system";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_rating_value";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_review_count";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_provider";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_start_date";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_end_date";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_event_mode";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_location";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_video_url";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_duration";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_upload_date";
  ALTER TABLE "pages" DROP COLUMN "meta_schema_data_thumbnail_url";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_secondary_keywords";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_name";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_total_time";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_price";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_currency";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_availability";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_brand";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_sku";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_application_category";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_operating_system";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_rating_value";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_review_count";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_provider";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_start_date";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_end_date";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_event_mode";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_location";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_video_url";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_duration";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_upload_date";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_schema_data_thumbnail_url";
  ALTER TABLE "posts" DROP COLUMN "visibility";
  ALTER TABLE "posts" DROP COLUMN "post_password";
  ALTER TABLE "posts" DROP COLUMN "sticky";
  ALTER TABLE "posts" DROP COLUMN "format";
  ALTER TABLE "posts" DROP COLUMN "meta_secondary_keywords";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_name";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_description";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_total_time";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_price";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_currency";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_availability";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_brand";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_sku";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_application_category";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_operating_system";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_rating_value";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_review_count";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_provider";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_start_date";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_end_date";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_event_mode";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_location";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_video_url";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_duration";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_upload_date";
  ALTER TABLE "posts" DROP COLUMN "meta_schema_data_thumbnail_url";
  ALTER TABLE "_posts_v" DROP COLUMN "version_visibility";
  ALTER TABLE "_posts_v" DROP COLUMN "version_post_password";
  ALTER TABLE "_posts_v" DROP COLUMN "version_sticky";
  ALTER TABLE "_posts_v" DROP COLUMN "version_format";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_secondary_keywords";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_name";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_description";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_total_time";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_price";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_currency";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_availability";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_brand";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_sku";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_application_category";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_operating_system";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_rating_value";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_review_count";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_provider";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_start_date";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_end_date";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_event_mode";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_location";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_video_url";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_duration";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_upload_date";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_schema_data_thumbnail_url";
  ALTER TABLE "guides" DROP COLUMN "meta_secondary_keywords";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_name";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_description";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_total_time";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_price";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_currency";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_availability";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_brand";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_sku";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_application_category";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_operating_system";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_rating_value";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_review_count";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_provider";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_start_date";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_end_date";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_event_mode";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_location";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_video_url";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_duration";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_upload_date";
  ALTER TABLE "guides" DROP COLUMN "meta_schema_data_thumbnail_url";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_secondary_keywords";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_name";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_description";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_total_time";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_price";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_currency";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_availability";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_brand";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_sku";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_application_category";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_operating_system";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_rating_value";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_review_count";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_provider";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_start_date";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_end_date";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_event_mode";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_location";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_video_url";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_duration";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_upload_date";
  ALTER TABLE "_guides_v" DROP COLUMN "version_meta_schema_data_thumbnail_url";
  ALTER TABLE "cases" DROP COLUMN "meta_secondary_keywords";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_name";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_description";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_total_time";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_price";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_currency";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_availability";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_brand";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_sku";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_application_category";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_operating_system";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_rating_value";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_review_count";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_provider";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_start_date";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_end_date";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_event_mode";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_location";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_video_url";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_duration";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_upload_date";
  ALTER TABLE "cases" DROP COLUMN "meta_schema_data_thumbnail_url";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_secondary_keywords";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_name";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_description";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_total_time";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_price";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_currency";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_availability";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_brand";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_sku";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_application_category";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_operating_system";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_rating_value";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_review_count";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_provider";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_start_date";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_end_date";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_event_mode";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_location";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_video_url";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_duration";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_upload_date";
  ALTER TABLE "_cases_v" DROP COLUMN "version_meta_schema_data_thumbnail_url";
  ALTER TABLE "updates" DROP COLUMN "meta_secondary_keywords";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_name";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_description";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_total_time";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_price";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_currency";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_availability";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_brand";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_sku";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_application_category";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_operating_system";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_rating_value";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_review_count";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_provider";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_start_date";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_end_date";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_event_mode";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_location";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_video_url";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_duration";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_upload_date";
  ALTER TABLE "updates" DROP COLUMN "meta_schema_data_thumbnail_url";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_secondary_keywords";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_name";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_description";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_total_time";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_price";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_currency";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_availability";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_brand";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_sku";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_application_category";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_operating_system";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_rating_value";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_review_count";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_provider";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_start_date";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_end_date";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_event_mode";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_location";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_video_url";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_duration";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_upload_date";
  ALTER TABLE "_updates_v" DROP COLUMN "version_meta_schema_data_thumbnail_url";
  ALTER TABLE "reviews" DROP COLUMN "meta_secondary_keywords";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_name";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_description";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_total_time";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_price";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_currency";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_availability";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_brand";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_sku";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_application_category";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_operating_system";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_rating_value";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_review_count";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_provider";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_start_date";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_end_date";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_event_mode";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_location";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_video_url";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_duration";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_upload_date";
  ALTER TABLE "reviews" DROP COLUMN "meta_schema_data_thumbnail_url";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_secondary_keywords";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_name";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_description";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_total_time";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_price";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_currency";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_availability";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_brand";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_sku";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_application_category";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_operating_system";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_rating_value";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_review_count";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_provider";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_start_date";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_end_date";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_event_mode";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_location";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_video_url";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_duration";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_upload_date";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_meta_schema_data_thumbnail_url";
  ALTER TABLE "categories" DROP COLUMN "meta_secondary_keywords";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_name";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_description";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_total_time";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_price";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_currency";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_availability";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_brand";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_sku";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_application_category";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_operating_system";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_rating_value";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_review_count";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_provider";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_start_date";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_end_date";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_event_mode";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_location";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_video_url";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_duration";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_upload_date";
  ALTER TABLE "categories" DROP COLUMN "meta_schema_data_thumbnail_url";
  ALTER TABLE "tags" DROP COLUMN "meta_secondary_keywords";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_name";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_description";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_total_time";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_price";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_currency";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_availability";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_brand";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_sku";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_application_category";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_operating_system";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_rating_value";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_review_count";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_provider";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_start_date";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_end_date";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_event_mode";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_location";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_video_url";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_duration";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_upload_date";
  ALTER TABLE "tags" DROP COLUMN "meta_schema_data_thumbnail_url";
  ALTER TABLE "section_categories" DROP COLUMN "meta_secondary_keywords";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_name";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_description";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_total_time";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_price";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_currency";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_availability";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_brand";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_sku";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_application_category";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_operating_system";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_rating_value";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_review_count";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_provider";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_start_date";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_end_date";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_event_mode";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_location";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_video_url";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_duration";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_upload_date";
  ALTER TABLE "section_categories" DROP COLUMN "meta_schema_data_thumbnail_url";
  ALTER TABLE "media" DROP COLUMN "folder_id";
  ALTER TABLE "users" DROP COLUMN "slug";
  ALTER TABLE "users" DROP COLUMN "job_title";
  ALTER TABLE "users" DROP COLUMN "website";
  ALTER TABLE "users" DROP COLUMN "twitter";
  ALTER TABLE "users" DROP COLUMN "linkedin";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "patterns_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_folders_id";
  ALTER TABLE "plugin_settings" DROP COLUMN "notify_on_publish";
  ALTER TABLE "plugin_settings" DROP COLUMN "notify_on_publish_to";
  ALTER TABLE "plugin_settings" DROP COLUMN "related_mode";
  ALTER TABLE "plugin_settings" DROP COLUMN "show_prev_next";
  ALTER TABLE "plugin_settings" DROP COLUMN "users_can_register";
  ALTER TABLE "plugin_settings" DROP COLUMN "index_now_enabled";
  ALTER TABLE "plugin_settings" DROP COLUMN "index_now_key";
  ALTER TABLE "plugin_settings" DROP COLUMN "date_archives";
  ALTER TABLE "plugin_settings" DROP COLUMN "author_archives";
  ALTER TABLE "plugin_settings" DROP COLUMN "news_sitemap";
  ALTER TABLE "plugin_settings" DROP COLUMN "news_publication_name";
  ALTER TABLE "plugin_settings" DROP COLUMN "video_sitemap";
  DROP TYPE "public"."enum_pages_meta_schema_data_availability";
  DROP TYPE "public"."enum_pages_meta_schema_data_event_mode";
  DROP TYPE "public"."enum__pages_v_version_meta_schema_data_availability";
  DROP TYPE "public"."enum__pages_v_version_meta_schema_data_event_mode";
  DROP TYPE "public"."enum_posts_visibility";
  DROP TYPE "public"."enum_posts_format";
  DROP TYPE "public"."enum_posts_meta_schema_data_availability";
  DROP TYPE "public"."enum_posts_meta_schema_data_event_mode";
  DROP TYPE "public"."enum__posts_v_version_visibility";
  DROP TYPE "public"."enum__posts_v_version_format";
  DROP TYPE "public"."enum__posts_v_version_meta_schema_data_availability";
  DROP TYPE "public"."enum__posts_v_version_meta_schema_data_event_mode";
  DROP TYPE "public"."enum_guides_meta_schema_data_availability";
  DROP TYPE "public"."enum_guides_meta_schema_data_event_mode";
  DROP TYPE "public"."enum__guides_v_version_meta_schema_data_availability";
  DROP TYPE "public"."enum__guides_v_version_meta_schema_data_event_mode";
  DROP TYPE "public"."enum_cases_meta_schema_data_availability";
  DROP TYPE "public"."enum_cases_meta_schema_data_event_mode";
  DROP TYPE "public"."enum__cases_v_version_meta_schema_data_availability";
  DROP TYPE "public"."enum__cases_v_version_meta_schema_data_event_mode";
  DROP TYPE "public"."enum_updates_meta_schema_data_availability";
  DROP TYPE "public"."enum_updates_meta_schema_data_event_mode";
  DROP TYPE "public"."enum__updates_v_version_meta_schema_data_availability";
  DROP TYPE "public"."enum__updates_v_version_meta_schema_data_event_mode";
  DROP TYPE "public"."enum_reviews_meta_schema_data_availability";
  DROP TYPE "public"."enum_reviews_meta_schema_data_event_mode";
  DROP TYPE "public"."enum__reviews_v_version_meta_schema_data_availability";
  DROP TYPE "public"."enum__reviews_v_version_meta_schema_data_event_mode";
  DROP TYPE "public"."enum_categories_meta_schema_data_availability";
  DROP TYPE "public"."enum_categories_meta_schema_data_event_mode";
  DROP TYPE "public"."enum_tags_meta_schema_data_availability";
  DROP TYPE "public"."enum_tags_meta_schema_data_event_mode";
  DROP TYPE "public"."enum_section_categories_meta_schema_data_availability";
  DROP TYPE "public"."enum_section_categories_meta_schema_data_event_mode";
  DROP TYPE "public"."enum_plugin_settings_related_mode";`)
}
