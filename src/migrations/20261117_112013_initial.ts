import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_buttons_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_hero_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_hero_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_image_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_image_text_cta_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_tabs_tabs_cta_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_pricing_plans_cta_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_cta_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_tone" AS ENUM('dark', 'light', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_post_feed_source" AS ENUM('posts', 'guides', 'cases', 'updates', 'reviews');
  CREATE TYPE "public"."enum_pages_template" AS ENUM('about', 'ai-showcase', 'case-studies', 'category', 'contact', 'default', 'document', 'front-page', 'guide', 'market-places', 'pricing', 'shopify', 'update', 'virtual-try-on', 'blog');
  CREATE TYPE "public"."enum_pages_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_buttons_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_cta_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_tabs_tabs_cta_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_plans_cta_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_cta_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_tone" AS ENUM('dark', 'light', 'brand');
  CREATE TYPE "public"."enum__pages_v_blocks_post_feed_source" AS ENUM('posts', 'guides', 'cases', 'updates', 'reviews');
  CREATE TYPE "public"."enum__pages_v_version_template" AS ENUM('about', 'ai-showcase', 'case-studies', 'category', 'contact', 'default', 'document', 'front-page', 'guide', 'market-places', 'pricing', 'shopify', 'update', 'virtual-try-on', 'blog');
  CREATE TYPE "public"."enum__pages_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_guides_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum_guides_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__guides_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum__guides_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_cases_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum_cases_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cases_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum__cases_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_updates_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum_updates_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__updates_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum__updates_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_reviews_platform" AS ENUM('self', 'google', 'shopify', 'g2', 'capterra', 'trustpilot', 'facebook', 'other');
  CREATE TYPE "public"."enum_reviews_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum_reviews_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reviews_v_version_platform" AS ENUM('self', 'google', 'shopify', 'g2', 'capterra', 'trustpilot', 'facebook', 'other');
  CREATE TYPE "public"."enum__reviews_v_version_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum__reviews_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_categories_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum_tags_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum_section_categories_kind" AS ENUM('guide', 'case', 'update');
  CREATE TYPE "public"."enum_section_categories_meta_schema_type" AS ENUM('auto', 'Article', 'BlogPosting', 'WebPage', 'FAQPage', 'SoftwareApplication', 'none');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'seo', 'editor');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'x', 'youtube', 'pinterest', 'other');
  CREATE TYPE "public"."enum_navigation_header_children_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_navigation_header_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_navigation_footer_columns_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_navigation_legal_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_navigation_header_button_type" AS ENUM('reference', 'custom');
  CREATE TABLE "pages_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_hero_buttons_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"style" "enum_pages_blocks_hero_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"image_id" integer,
  	"image_url" varchar,
  	"align" "enum_pages_blocks_hero_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"width" "enum_pages_blocks_rich_text_width" DEFAULT 'narrow',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_text_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_image_text_image_position" DEFAULT 'right',
  	"cta_type" "enum_pages_blocks_image_text_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar,
  	"image_id" integer,
  	"image_url" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"columns" "enum_pages_blocks_feature_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"content" varchar,
  	"image_id" integer,
  	"cta_type" "enum_pages_blocks_tabs_tabs_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_label" varchar
  );
  
  CREATE TABLE "pages_blocks_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Frequently asked questions',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"period" varchar DEFAULT '/month',
  	"description" varchar,
  	"highlighted" boolean,
  	"cta_type" "enum_pages_blocks_pricing_plans_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_label" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"cta_type" "enum_pages_blocks_cta_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"tone" "enum_pages_blocks_cta_tone" DEFAULT 'dark',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_post_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"source" "enum_pages_blocks_post_feed_source" DEFAULT 'posts',
  	"limit" numeric DEFAULT 9,
  	"category_id" integer,
  	"paginate" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"form_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_html" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "acf_accordion_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"accordion_question" varchar,
  	"accordion_answer" varchar
  );
  
  CREATE TABLE "acf_tab_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"alt" varchar
  );
  
  CREATE TABLE "acf_fashion_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tab_title" varchar
  );
  
  CREATE TABLE "acf_guide_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"hover_icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"guide_count" numeric,
  	"link_url" varchar,
  	"link_title" varchar,
  	"link_target" varchar
  );
  
  CREATE TABLE "acf_creation_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"creation_item_image" varchar,
  	"creation_item_title" varchar
  );
  
  CREATE TABLE "acf_why_teams_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"why_teams_item_title" varchar,
  	"why_teams_item_content" varchar
  );
  
  CREATE TABLE "acf_proof_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"proof_item_title" varchar,
  	"proof_item_content" varchar
  );
  
  CREATE TABLE "acf_aiphotoshoot_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"aiphotoshoot_item_image" varchar,
  	"aiphotoshoot_item_title" varchar,
  	"aiphotoshoot_item_hvr" varchar
  );
  
  CREATE TABLE "acf_aiphotoshoot_cost_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"aiphotoshoot_cost" varchar,
  	"aiphotoshoot_cost_content" varchar
  );
  
  CREATE TABLE "acf_showcase_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"showcase_item_image" varchar,
  	"showcase_item_title" varchar,
  	"showcase_item_hvr" varchar
  );
  
  CREATE TABLE "acf_built_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"built_item_image" varchar,
  	"built_item_title" varchar,
  	"built_item_content" varchar
  );
  
  CREATE TABLE "acf_sellers_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"sellers_item_image" varchar,
  	"sellers_item_title" varchar,
  	"sellers_item_content" varchar
  );
  
  CREATE TABLE "acf_comparison_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"left_content" varchar,
  	"right_content" varchar
  );
  
  CREATE TABLE "acf_math_comparison_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"math_feature" varchar,
  	"math_left_content" varchar,
  	"math_right_content" varchar
  );
  
  CREATE TABLE "acf_works_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"works_item_image" varchar,
  	"works_image_title" varchar,
  	"works_item_title" varchar,
  	"works_item_content" varchar
  );
  
  CREATE TABLE "acf_launch_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"launch_list_content" varchar
  );
  
  CREATE TABLE "acf_shopify_banner_trust_pills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shopify_banner_trust_pills_title" varchar
  );
  
  CREATE TABLE "acf_shopper_uploads_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shoper_upload_icon" varchar,
  	"shopper_uploads_title" varchar,
  	"shopper_uploads_image" varchar
  );
  
  CREATE TABLE "acf_shopify_the_real_problem_stat_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shopify_the_real_problem_stat_bar_icon" varchar,
  	"shopify_the_real_problem_stat_bar_title" varchar,
  	"shopify_the_real_problem_stat_bar_cont" varchar
  );
  
  CREATE TABLE "acf_shopify_the_real_problem_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shopify_the_real_problem_card_title" varchar,
  	"shopify_the_real_problem_card_content" varchar
  );
  
  CREATE TABLE "acf_shopify_shopping_logos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shopify_shopping_logos_images" varchar
  );
  
  CREATE TABLE "acf_shopify_how_it_works_left_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shopify_how_it_works_lft_title" varchar,
  	"shopify_how_it_works_lft_cont" varchar
  );
  
  CREATE TABLE "acf_shopify_built_for_your_catalogue_car" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shopify_built_for_your_catalogue_image" varchar,
  	"shopify_built_for_your_catalogue_card_cont" varchar,
  	"shopify_built_for_your_catalogue_card_link" varchar
  );
  
  CREATE TABLE "acf_shopify_integration_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shopify_integration_card_sml_image" varchar,
  	"shopify_integration_card_big_image" varchar,
  	"shopify_integration_card_big_image_hvr" varchar,
  	"shopify_integration_card_title" varchar
  );
  
  CREATE TABLE "acf_shopify_integration_btm_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"inr_int_item_icon" varchar,
  	"inr_int_item_number" numeric,
  	"shopify_integration_btm_card_title" varchar,
  	"shopify_integration_btm_card_cont" varchar
  );
  
  CREATE TABLE "acf_shopify_what_it_does_for_your_busine" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shopify_what_it_does_for_your_business_cord_icon" varchar,
  	"shopify_what_it_does_for_your_business_card_title" varchar,
  	"shopify_what_it_does_for_your_business_cord_cont" varchar
  );
  
  CREATE TABLE "acf_klaviyo_img_blk" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"klaviyo_icon" varchar
  );
  
  CREATE TABLE "acf_shopify_plays_well_with_your_stack_c" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shopify_plays_well_with_your_stack_card_title" varchar,
  	"shopify_plays_well_with_your_stack_card_cont" varchar
  );
  
  CREATE TABLE "acf_shopify_frm_lft_trust_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shopify_frm_lft_trust_tags_cont" varchar
  );
  
  CREATE TABLE "acf_experiences_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"experiences_items" varchar
  );
  
  CREATE TABLE "acf_mission_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mission_image" varchar,
  	"mission_list_title" varchar,
  	"mission_list_sub_title" varchar
  );
  
  CREATE TABLE "acf_virtual_experiences_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"virtual_experiences_image" varchar,
  	"virtual_experiences_item_title" varchar
  );
  
  CREATE TABLE "acf_contact_social_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"contact_social_media_link" varchar,
  	"contact_social_media_image" varchar,
  	"contact_social_media_hover_image" varchar
  );
  
  CREATE TABLE "acf_contact_locations_section_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"contact_locations_section_title" varchar,
  	"contact_locations_section_content" varchar,
  	"contact_locations_section_map" varchar,
  	"contact_locations_section_map_link" varchar
  );
  
  CREATE TABLE "acf_virtual_try_on_shoppers_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"virtual_try_on_shoppers_list_icon" varchar,
  	"virtual_try_on_shoppers_list_title" varchar,
  	"virtual_try_on_shoppers_list_sub_title" varchar,
  	"virtual_try_on_shoppers_list_image" varchar
  );
  
  CREATE TABLE "acf_virtual_try_on_business_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"virtual_try_on_business_list_text" varchar
  );
  
  CREATE TABLE "acf_virtual_try_on_wardrobe_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"virtual_try_on_wardrobe_image" varchar,
  	"virtual_try_on_wardrobe_text" varchar
  );
  
  CREATE TABLE "acf_virtual_try_on_fashion_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"virtual_try_on_fashion_list_title" varchar,
  	"virtual_try_on_fashion_list_sub_title" varchar,
  	"virtual_try_on_fashion_list_image" varchar
  );
  
  CREATE TABLE "acf_case_studies_banner_buttom_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"case_studies_buttom_title" varchar,
  	"case_studies_buttom_content" varchar
  );
  
  CREATE TABLE "pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"acf_home_banner_section" varchar,
  	"acf_home_brand_section" varchar,
  	"acf_hm_create_ready_section" varchar,
  	"acf_home_steps_section" varchar,
  	"acf_home_photoshoots_section" varchar,
  	"acf_home_choose_perfect_section" varchar,
  	"acf_home_catalogue_creation_section" varchar,
  	"acf_home_brand_choose_section" varchar,
  	"acf_home_cases_section" varchar,
  	"acf_home_customers_section" varchar,
  	"acf_home_results_section" varchar,
  	"acf_home_blog_title" varchar,
  	"acf_home_blog_sub_title" varchar,
  	"acf_inner_footer_form" varchar,
  	"acf_category_accordion_eyebrow" varchar,
  	"acf_category_accordion_title" varchar,
  	"acf_documentation_banner_title" varchar,
  	"acf_documentation_banner_content" varchar,
  	"acf_documentation_search" varchar,
  	"acf_documentation_footer_top_title" varchar,
  	"acf_documentation_footer_top_content" varchar,
  	"acf_documentation_footer_top_form_title" varchar,
  	"acf_documentation_footer_top_form" varchar,
  	"acf_banner_top_title" varchar,
  	"acf_sub_title" varchar,
  	"acf_description" varchar,
  	"acf_category_button_url" varchar,
  	"acf_category_button_title" varchar,
  	"acf_category_button_target" varchar,
  	"acf_category_form_title" varchar,
  	"acf_category_form_content" varchar,
  	"acf_creation_sub_title" varchar,
  	"acf_creation_title" varchar,
  	"acf_creation_description" varchar,
  	"acf_creation_link" varchar,
  	"acf_creation_text" varchar,
  	"acf_why_teams_sub_title" varchar,
  	"acf_why_teams_title" varchar,
  	"acf_your_western_conent" varchar,
  	"acf_proof_sub_title" varchar,
  	"acf_proof_title" varchar,
  	"acf_proof_content" varchar,
  	"acf_inner_brand_choose_section" varchar,
  	"acf_aiphotoshoot_sub_title" varchar,
  	"acf_aiphotoshoot_title" varchar,
  	"acf_aiphotoshoot_top_content" varchar,
  	"acf_aiphotoshoot_right_content" varchar,
  	"acf_aiphotoshoot_logo_image" varchar,
  	"acf_aiphotoshoot_logo_title" varchar,
  	"acf_photoshoots_link" varchar,
  	"acf_photoshoots_text" varchar,
  	"acf_showcase_sub_title" varchar,
  	"acf_showcase_title" varchar,
  	"acf_showcase_content" varchar,
  	"acf_showcase_link" varchar,
  	"acf_showcase_text" varchar,
  	"acf_models_title" varchar,
  	"acf_models_content" varchar,
  	"acf_models_book" varchar,
  	"acf_models_start" varchar,
  	"acf_answer_first_sub_title" varchar,
  	"acf_answer_first_title" varchar,
  	"acf_answer_first_content" varchar,
  	"acf_built_sub_title" varchar,
  	"acf_built_title" varchar,
  	"acf_sellers_sub_title" varchar,
  	"acf_sellers_title" varchar,
  	"acf_traditional_sub_title" varchar,
  	"acf_traditional_title" varchar,
  	"acf_table_feature_heading" varchar,
  	"acf_left_title" varchar,
  	"acf_right_title" varchar,
  	"acf_math_sub_title" varchar,
  	"acf_math_title" varchar,
  	"acf_math_content" varchar,
  	"acf_math_table_feature_heading" varchar,
  	"acf_math_left_title" varchar,
  	"acf_math_right_title" varchar,
  	"acf_math_bottom_content" varchar,
  	"acf_works_sub_title" varchar,
  	"acf_works_title" varchar,
  	"acf_launch_sub_title" varchar,
  	"acf_launch_title" varchar,
  	"acf_launch_content" varchar,
  	"acf_launch_right_sub_title" varchar,
  	"acf_launch_right_photography_count" varchar,
  	"acf_launch_right_title" varchar,
  	"acf_launch_right_content" varchar,
  	"acf_shopify_banner_sub_title" varchar,
  	"acf_shopify_banner_title" varchar,
  	"acf_shopify_banner_small_title" varchar,
  	"acf_shopify_banner_content" varchar,
  	"acf_shopify_banner_buttons" varchar,
  	"acf_shopify_banner_btm_cont" varchar,
  	"acf_catalogue_image" varchar,
  	"acf_shopify_the_real_problem_sub_title" varchar,
  	"acf_shopify_the_real_problem_title" varchar,
  	"acf_shopify_the_real_problem_content" varchar,
  	"acf_virtual_blk_img" varchar,
  	"acf_shopify_the_real_problem_btm_cont" varchar,
  	"acf_shopify_shopping_logos_sub_title" varchar,
  	"acf_shopify_how_it_works_sub_title" varchar,
  	"acf_shopify_how_it_works_title" varchar,
  	"acf_shopify_how_it_works_content" varchar,
  	"acf_shopify_how_it_works_rgt_content" varchar,
  	"acf_shopify_how_it_works_rgt_video" varchar,
  	"acf_shopify_built_for_your_catalogue_sub_title" varchar,
  	"acf_shopify_built_for_your_catalogue_title" varchar,
  	"acf_shopify_built_for_your_catalogue_content" varchar,
  	"acf_shopify_built_for_your_catalogue_btm_cont" varchar,
  	"acf_shopify_integration_sub_title" varchar,
  	"acf_shopify_integration_title" varchar,
  	"acf_shopify_integration_content" varchar,
  	"acf_shopify_what_it_does_for_your_business_sub_title" varchar,
  	"acf_shopify_what_it_does_for_your_business_title" varchar,
  	"acf_shopify_what_it_does_for_your_business_content" varchar,
  	"acf_shopify_made_for_you_if_sub_title" varchar,
  	"acf_shopify_made_for_you_if_title" varchar,
  	"acf_shopify_made_for_you_if_rgt_star_cont" varchar,
  	"acf_shopify_plays_well_with_your_stack_sub_title" varchar,
  	"acf_shopify_plays_well_with_your_stack_title" varchar,
  	"acf_shopify_plays_well_with_your_stack_content" varchar,
  	"acf_shopify_plays_well_with_your_stack_btn" varchar,
  	"acf_shopify_form_title" varchar,
  	"acf_shopify_form_content" varchar,
  	"acf_shopify_frm_lft_buttons" varchar,
  	"acf_about_banner_title" varchar,
  	"acf_about_banner_content" varchar,
  	"acf_about_banner_button_link" varchar,
  	"acf_about_banner_button_text" varchar,
  	"acf_experiences_title" varchar,
  	"acf_experiences_content" varchar,
  	"acf_experiences_button" varchar,
  	"acf_experiences_image" varchar,
  	"acf_mission_title" varchar,
  	"acf_mission_content" varchar,
  	"acf_mission_button_text" varchar,
  	"acf_mission_right_image" varchar,
  	"acf_virtual_experiences_title" varchar,
  	"acf_virtual_experiences_content" varchar,
  	"acf_virtual_experiences_button" varchar,
  	"acf_smarter_fashion_title" varchar,
  	"acf_smarter_fashion_content" varchar,
  	"acf_smarter_fashion_items" varchar,
  	"acf_table_section_title" varchar,
  	"acf_table_section_content" varchar,
  	"acf_table_section_items" varchar,
  	"acf_blog_title" varchar,
  	"acf_blog_content" varchar,
  	"acf_blog_button" varchar,
  	"acf_blog_button_link" varchar,
  	"acf_form_left_title" varchar,
  	"acf_form_left_content" varchar,
  	"acf_form_right_title" varchar,
  	"acf_form_item" varchar,
  	"acf_contact_title" varchar,
  	"acf_contact_content" varchar,
  	"acf_contact_mail_text" varchar,
  	"acf_contact_mail_link" varchar,
  	"acf_contact_phone_text" varchar,
  	"acf_contact_phone_link" varchar,
  	"acf_contact_social_media_title" varchar,
  	"acf_whatsapp_qr_link" varchar,
  	"acf_whtasapp_qr" varchar,
  	"acf_contact_form_title" varchar,
  	"acf_contact_form_block" varchar,
  	"acf_contact_locations_title" varchar,
  	"acf_contact_footer_top_title" varchar,
  	"acf_contact_footer_top_content" varchar,
  	"acf_contact_footer_top_button" varchar,
  	"acf_virtual_try_on_title" varchar,
  	"acf_virtual_try_on_sub_title" varchar,
  	"acf_virtual_try_on_content" varchar,
  	"acf_virtual_try_on_button_text" varchar,
  	"acf_virtual_try_on_button_link" varchar,
  	"acf_virtual_try_on_free_trial_image" varchar,
  	"acf_virtual_try_on_free_trial_title" varchar,
  	"acf_virtual_try_on_free_trial_content" varchar,
  	"acf_virtual_try_on_free_trial_button_text" varchar,
  	"acf_virtual_try_on_free_trial_button_link" varchar,
  	"acf_virtual_try_on_shoppers_title" varchar,
  	"acf_virtual_try_on_shoppers_content" varchar,
  	"acf_virtual_try_on_business_title" varchar,
  	"acf_virtual_try_on_business_content" varchar,
  	"acf_virtual_try_on_business_button" varchar,
  	"acf_virtual_try_on_business_button_link" varchar,
  	"acf_virtual_try_on_right_image" varchar,
  	"acf_virtual_try_on_wardrobe_title" varchar,
  	"acf_virtual_try_on_wardrobe_content" varchar,
  	"acf_virtual_try_on_wardrobe_button" varchar,
  	"acf_virtual_try_on_wardrobe_button_link" varchar,
  	"acf_virtual_try_on_fashion_title" varchar,
  	"acf_virtual_try_on_fashion_content" varchar,
  	"acf_virtual_try_on_footer_top_title" varchar,
  	"acf_virtual_try_on_footer_top_content" varchar,
  	"acf_virtual_try_on_footer_form_title" varchar,
  	"acf_virtual_try_on_footer_form" varchar,
  	"acf_pricing_banner_title" varchar,
  	"acf_pricing_banner_content" varchar,
  	"acf_pricing_block_content" varchar,
  	"acf_pricing_footer_title" varchar,
  	"acf_pricing_footer_content" varchar,
  	"acf_pricing_footer_form_title" varchar,
  	"acf_pricing_footer_form_block" varchar,
  	"acf_case_studies_banner_title" varchar,
  	"acf_case_studies_banner_content" varchar,
  	"acf_case_studies_footer_top_title" varchar,
  	"acf_case_studies_footer_top_content" varchar,
  	"acf_case_studies_footer_top_form_title" varchar,
  	"acf_case_studies_footer_top_form_content" varchar,
  	"acf_getting_started_title" varchar,
  	"acf_getting_started_content" varchar,
  	"acf_getting_started_footer_top_title" varchar,
  	"acf_getting_started_footer_top_content" varchar,
  	"acf_getting_started_footer_form_title" varchar,
  	"acf_getting_started_footer_form" varchar,
  	"acf_product_banner_title" varchar,
  	"acf_product_banner_content" varchar,
  	"content" jsonb,
  	"template" "enum_pages_template" DEFAULT 'default',
  	"legacy_template" varchar,
  	"legacy_fields" jsonb,
  	"show_footer_form" boolean DEFAULT true,
  	"hide_from_sitemap" boolean,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"modified_at" timestamp(3) with time zone,
  	"parent_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_canonical_url" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_nofollow" boolean DEFAULT false,
  	"meta_schema_type" "enum_pages_meta_schema_type" DEFAULT 'auto',
  	"meta_custom_schema" varchar,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"guides_id" integer,
  	"cases_id" integer,
  	"updates_id" integer,
  	"reviews_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_hero_buttons_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"style" "enum__pages_v_blocks_hero_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"image_id" integer,
  	"image_url" varchar,
  	"align" "enum__pages_v_blocks_hero_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"width" "enum__pages_v_blocks_rich_text_width" DEFAULT 'narrow',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_text_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_image_text_image_position" DEFAULT 'right',
  	"cta_type" "enum__pages_v_blocks_image_text_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar,
  	"image_id" integer,
  	"image_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"columns" "enum__pages_v_blocks_feature_grid_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"content" varchar,
  	"image_id" integer,
  	"cta_type" "enum__pages_v_blocks_tabs_tabs_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Frequently asked questions',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"period" varchar DEFAULT '/month',
  	"description" varchar,
  	"highlighted" boolean,
  	"cta_type" "enum__pages_v_blocks_pricing_plans_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"cta_type" "enum__pages_v_blocks_cta_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"tone" "enum__pages_v_blocks_cta_tone" DEFAULT 'dark',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_post_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"source" "enum__pages_v_blocks_post_feed_source" DEFAULT 'posts',
  	"limit" numeric DEFAULT 9,
  	"category_id" integer,
  	"paginate" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"form_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_html" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_acf_accordion_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"accordion_question" varchar,
  	"accordion_answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_tab_images_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_fashion_tabs_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tab_title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_guide_categories_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"hover_icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"guide_count" numeric,
  	"link_url" varchar,
  	"link_title" varchar,
  	"link_target" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_creation_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"creation_item_image" varchar,
  	"creation_item_title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_why_teams_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"why_teams_item_title" varchar,
  	"why_teams_item_content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_proof_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"proof_item_title" varchar,
  	"proof_item_content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_aiphotoshoot_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"aiphotoshoot_item_image" varchar,
  	"aiphotoshoot_item_title" varchar,
  	"aiphotoshoot_item_hvr" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_aiphotoshoot_cost_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"aiphotoshoot_cost" varchar,
  	"aiphotoshoot_cost_content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_showcase_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"showcase_item_image" varchar,
  	"showcase_item_title" varchar,
  	"showcase_item_hvr" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_built_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"built_item_image" varchar,
  	"built_item_title" varchar,
  	"built_item_content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_sellers_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"sellers_item_image" varchar,
  	"sellers_item_title" varchar,
  	"sellers_item_content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_comparison_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"left_content" varchar,
  	"right_content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_math_comparison_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"math_feature" varchar,
  	"math_left_content" varchar,
  	"math_right_content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_works_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"works_item_image" varchar,
  	"works_image_title" varchar,
  	"works_item_title" varchar,
  	"works_item_content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_launch_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"launch_list_content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopify_banner_trust_pills_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shopify_banner_trust_pills_title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopper_uploads_cards_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shoper_upload_icon" varchar,
  	"shopper_uploads_title" varchar,
  	"shopper_uploads_image" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopify_the_real_problem_stat_bar_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shopify_the_real_problem_stat_bar_icon" varchar,
  	"shopify_the_real_problem_stat_bar_title" varchar,
  	"shopify_the_real_problem_stat_bar_cont" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopify_the_real_problem_cards_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shopify_the_real_problem_card_title" varchar,
  	"shopify_the_real_problem_card_content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopify_shopping_logos_items_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shopify_shopping_logos_images" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopify_how_it_works_left_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shopify_how_it_works_lft_title" varchar,
  	"shopify_how_it_works_lft_cont" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopify_built_for_your_catalogue_car_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shopify_built_for_your_catalogue_image" varchar,
  	"shopify_built_for_your_catalogue_card_cont" varchar,
  	"shopify_built_for_your_catalogue_card_link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopify_integration_cards_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shopify_integration_card_sml_image" varchar,
  	"shopify_integration_card_big_image" varchar,
  	"shopify_integration_card_big_image_hvr" varchar,
  	"shopify_integration_card_title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopify_integration_btm_cards_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"inr_int_item_icon" varchar,
  	"inr_int_item_number" numeric,
  	"shopify_integration_btm_card_title" varchar,
  	"shopify_integration_btm_card_cont" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopify_what_it_does_for_your_busine_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shopify_what_it_does_for_your_business_cord_icon" varchar,
  	"shopify_what_it_does_for_your_business_card_title" varchar,
  	"shopify_what_it_does_for_your_business_cord_cont" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_klaviyo_img_blk_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"klaviyo_icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopify_plays_well_with_your_stack_c_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shopify_plays_well_with_your_stack_card_title" varchar,
  	"shopify_plays_well_with_your_stack_card_cont" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_shopify_frm_lft_trust_tags_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"shopify_frm_lft_trust_tags_cont" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_experiences_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"experiences_items" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_mission_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mission_image" varchar,
  	"mission_list_title" varchar,
  	"mission_list_sub_title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_virtual_experiences_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"virtual_experiences_image" varchar,
  	"virtual_experiences_item_title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_contact_social_media_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_social_media_link" varchar,
  	"contact_social_media_image" varchar,
  	"contact_social_media_hover_image" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_contact_locations_section_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_locations_section_title" varchar,
  	"contact_locations_section_content" varchar,
  	"contact_locations_section_map" varchar,
  	"contact_locations_section_map_link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_virtual_try_on_shoppers_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"virtual_try_on_shoppers_list_icon" varchar,
  	"virtual_try_on_shoppers_list_title" varchar,
  	"virtual_try_on_shoppers_list_sub_title" varchar,
  	"virtual_try_on_shoppers_list_image" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_virtual_try_on_business_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"virtual_try_on_business_list_text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_virtual_try_on_wardrobe_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"virtual_try_on_wardrobe_image" varchar,
  	"virtual_try_on_wardrobe_text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_virtual_try_on_fashion_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"virtual_try_on_fashion_list_title" varchar,
  	"virtual_try_on_fashion_list_sub_title" varchar,
  	"virtual_try_on_fashion_list_image" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_acf_case_studies_banner_buttom_list_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"case_studies_buttom_title" varchar,
  	"case_studies_buttom_content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_acf_home_banner_section" varchar,
  	"version_acf_home_brand_section" varchar,
  	"version_acf_hm_create_ready_section" varchar,
  	"version_acf_home_steps_section" varchar,
  	"version_acf_home_photoshoots_section" varchar,
  	"version_acf_home_choose_perfect_section" varchar,
  	"version_acf_home_catalogue_creation_section" varchar,
  	"version_acf_home_brand_choose_section" varchar,
  	"version_acf_home_cases_section" varchar,
  	"version_acf_home_customers_section" varchar,
  	"version_acf_home_results_section" varchar,
  	"version_acf_home_blog_title" varchar,
  	"version_acf_home_blog_sub_title" varchar,
  	"version_acf_inner_footer_form" varchar,
  	"version_acf_category_accordion_eyebrow" varchar,
  	"version_acf_category_accordion_title" varchar,
  	"version_acf_documentation_banner_title" varchar,
  	"version_acf_documentation_banner_content" varchar,
  	"version_acf_documentation_search" varchar,
  	"version_acf_documentation_footer_top_title" varchar,
  	"version_acf_documentation_footer_top_content" varchar,
  	"version_acf_documentation_footer_top_form_title" varchar,
  	"version_acf_documentation_footer_top_form" varchar,
  	"version_acf_banner_top_title" varchar,
  	"version_acf_sub_title" varchar,
  	"version_acf_description" varchar,
  	"version_acf_category_button_url" varchar,
  	"version_acf_category_button_title" varchar,
  	"version_acf_category_button_target" varchar,
  	"version_acf_category_form_title" varchar,
  	"version_acf_category_form_content" varchar,
  	"version_acf_creation_sub_title" varchar,
  	"version_acf_creation_title" varchar,
  	"version_acf_creation_description" varchar,
  	"version_acf_creation_link" varchar,
  	"version_acf_creation_text" varchar,
  	"version_acf_why_teams_sub_title" varchar,
  	"version_acf_why_teams_title" varchar,
  	"version_acf_your_western_conent" varchar,
  	"version_acf_proof_sub_title" varchar,
  	"version_acf_proof_title" varchar,
  	"version_acf_proof_content" varchar,
  	"version_acf_inner_brand_choose_section" varchar,
  	"version_acf_aiphotoshoot_sub_title" varchar,
  	"version_acf_aiphotoshoot_title" varchar,
  	"version_acf_aiphotoshoot_top_content" varchar,
  	"version_acf_aiphotoshoot_right_content" varchar,
  	"version_acf_aiphotoshoot_logo_image" varchar,
  	"version_acf_aiphotoshoot_logo_title" varchar,
  	"version_acf_photoshoots_link" varchar,
  	"version_acf_photoshoots_text" varchar,
  	"version_acf_showcase_sub_title" varchar,
  	"version_acf_showcase_title" varchar,
  	"version_acf_showcase_content" varchar,
  	"version_acf_showcase_link" varchar,
  	"version_acf_showcase_text" varchar,
  	"version_acf_models_title" varchar,
  	"version_acf_models_content" varchar,
  	"version_acf_models_book" varchar,
  	"version_acf_models_start" varchar,
  	"version_acf_answer_first_sub_title" varchar,
  	"version_acf_answer_first_title" varchar,
  	"version_acf_answer_first_content" varchar,
  	"version_acf_built_sub_title" varchar,
  	"version_acf_built_title" varchar,
  	"version_acf_sellers_sub_title" varchar,
  	"version_acf_sellers_title" varchar,
  	"version_acf_traditional_sub_title" varchar,
  	"version_acf_traditional_title" varchar,
  	"version_acf_table_feature_heading" varchar,
  	"version_acf_left_title" varchar,
  	"version_acf_right_title" varchar,
  	"version_acf_math_sub_title" varchar,
  	"version_acf_math_title" varchar,
  	"version_acf_math_content" varchar,
  	"version_acf_math_table_feature_heading" varchar,
  	"version_acf_math_left_title" varchar,
  	"version_acf_math_right_title" varchar,
  	"version_acf_math_bottom_content" varchar,
  	"version_acf_works_sub_title" varchar,
  	"version_acf_works_title" varchar,
  	"version_acf_launch_sub_title" varchar,
  	"version_acf_launch_title" varchar,
  	"version_acf_launch_content" varchar,
  	"version_acf_launch_right_sub_title" varchar,
  	"version_acf_launch_right_photography_count" varchar,
  	"version_acf_launch_right_title" varchar,
  	"version_acf_launch_right_content" varchar,
  	"version_acf_shopify_banner_sub_title" varchar,
  	"version_acf_shopify_banner_title" varchar,
  	"version_acf_shopify_banner_small_title" varchar,
  	"version_acf_shopify_banner_content" varchar,
  	"version_acf_shopify_banner_buttons" varchar,
  	"version_acf_shopify_banner_btm_cont" varchar,
  	"version_acf_catalogue_image" varchar,
  	"version_acf_shopify_the_real_problem_sub_title" varchar,
  	"version_acf_shopify_the_real_problem_title" varchar,
  	"version_acf_shopify_the_real_problem_content" varchar,
  	"version_acf_virtual_blk_img" varchar,
  	"version_acf_shopify_the_real_problem_btm_cont" varchar,
  	"version_acf_shopify_shopping_logos_sub_title" varchar,
  	"version_acf_shopify_how_it_works_sub_title" varchar,
  	"version_acf_shopify_how_it_works_title" varchar,
  	"version_acf_shopify_how_it_works_content" varchar,
  	"version_acf_shopify_how_it_works_rgt_content" varchar,
  	"version_acf_shopify_how_it_works_rgt_video" varchar,
  	"version_acf_shopify_built_for_your_catalogue_sub_title" varchar,
  	"version_acf_shopify_built_for_your_catalogue_title" varchar,
  	"version_acf_shopify_built_for_your_catalogue_content" varchar,
  	"version_acf_shopify_built_for_your_catalogue_btm_cont" varchar,
  	"version_acf_shopify_integration_sub_title" varchar,
  	"version_acf_shopify_integration_title" varchar,
  	"version_acf_shopify_integration_content" varchar,
  	"version_acf_shopify_what_it_does_for_your_business_sub_title" varchar,
  	"version_acf_shopify_what_it_does_for_your_business_title" varchar,
  	"version_acf_shopify_what_it_does_for_your_business_content" varchar,
  	"version_acf_shopify_made_for_you_if_sub_title" varchar,
  	"version_acf_shopify_made_for_you_if_title" varchar,
  	"version_acf_shopify_made_for_you_if_rgt_star_cont" varchar,
  	"version_acf_shopify_plays_well_with_your_stack_sub_title" varchar,
  	"version_acf_shopify_plays_well_with_your_stack_title" varchar,
  	"version_acf_shopify_plays_well_with_your_stack_content" varchar,
  	"version_acf_shopify_plays_well_with_your_stack_btn" varchar,
  	"version_acf_shopify_form_title" varchar,
  	"version_acf_shopify_form_content" varchar,
  	"version_acf_shopify_frm_lft_buttons" varchar,
  	"version_acf_about_banner_title" varchar,
  	"version_acf_about_banner_content" varchar,
  	"version_acf_about_banner_button_link" varchar,
  	"version_acf_about_banner_button_text" varchar,
  	"version_acf_experiences_title" varchar,
  	"version_acf_experiences_content" varchar,
  	"version_acf_experiences_button" varchar,
  	"version_acf_experiences_image" varchar,
  	"version_acf_mission_title" varchar,
  	"version_acf_mission_content" varchar,
  	"version_acf_mission_button_text" varchar,
  	"version_acf_mission_right_image" varchar,
  	"version_acf_virtual_experiences_title" varchar,
  	"version_acf_virtual_experiences_content" varchar,
  	"version_acf_virtual_experiences_button" varchar,
  	"version_acf_smarter_fashion_title" varchar,
  	"version_acf_smarter_fashion_content" varchar,
  	"version_acf_smarter_fashion_items" varchar,
  	"version_acf_table_section_title" varchar,
  	"version_acf_table_section_content" varchar,
  	"version_acf_table_section_items" varchar,
  	"version_acf_blog_title" varchar,
  	"version_acf_blog_content" varchar,
  	"version_acf_blog_button" varchar,
  	"version_acf_blog_button_link" varchar,
  	"version_acf_form_left_title" varchar,
  	"version_acf_form_left_content" varchar,
  	"version_acf_form_right_title" varchar,
  	"version_acf_form_item" varchar,
  	"version_acf_contact_title" varchar,
  	"version_acf_contact_content" varchar,
  	"version_acf_contact_mail_text" varchar,
  	"version_acf_contact_mail_link" varchar,
  	"version_acf_contact_phone_text" varchar,
  	"version_acf_contact_phone_link" varchar,
  	"version_acf_contact_social_media_title" varchar,
  	"version_acf_whatsapp_qr_link" varchar,
  	"version_acf_whtasapp_qr" varchar,
  	"version_acf_contact_form_title" varchar,
  	"version_acf_contact_form_block" varchar,
  	"version_acf_contact_locations_title" varchar,
  	"version_acf_contact_footer_top_title" varchar,
  	"version_acf_contact_footer_top_content" varchar,
  	"version_acf_contact_footer_top_button" varchar,
  	"version_acf_virtual_try_on_title" varchar,
  	"version_acf_virtual_try_on_sub_title" varchar,
  	"version_acf_virtual_try_on_content" varchar,
  	"version_acf_virtual_try_on_button_text" varchar,
  	"version_acf_virtual_try_on_button_link" varchar,
  	"version_acf_virtual_try_on_free_trial_image" varchar,
  	"version_acf_virtual_try_on_free_trial_title" varchar,
  	"version_acf_virtual_try_on_free_trial_content" varchar,
  	"version_acf_virtual_try_on_free_trial_button_text" varchar,
  	"version_acf_virtual_try_on_free_trial_button_link" varchar,
  	"version_acf_virtual_try_on_shoppers_title" varchar,
  	"version_acf_virtual_try_on_shoppers_content" varchar,
  	"version_acf_virtual_try_on_business_title" varchar,
  	"version_acf_virtual_try_on_business_content" varchar,
  	"version_acf_virtual_try_on_business_button" varchar,
  	"version_acf_virtual_try_on_business_button_link" varchar,
  	"version_acf_virtual_try_on_right_image" varchar,
  	"version_acf_virtual_try_on_wardrobe_title" varchar,
  	"version_acf_virtual_try_on_wardrobe_content" varchar,
  	"version_acf_virtual_try_on_wardrobe_button" varchar,
  	"version_acf_virtual_try_on_wardrobe_button_link" varchar,
  	"version_acf_virtual_try_on_fashion_title" varchar,
  	"version_acf_virtual_try_on_fashion_content" varchar,
  	"version_acf_virtual_try_on_footer_top_title" varchar,
  	"version_acf_virtual_try_on_footer_top_content" varchar,
  	"version_acf_virtual_try_on_footer_form_title" varchar,
  	"version_acf_virtual_try_on_footer_form" varchar,
  	"version_acf_pricing_banner_title" varchar,
  	"version_acf_pricing_banner_content" varchar,
  	"version_acf_pricing_block_content" varchar,
  	"version_acf_pricing_footer_title" varchar,
  	"version_acf_pricing_footer_content" varchar,
  	"version_acf_pricing_footer_form_title" varchar,
  	"version_acf_pricing_footer_form_block" varchar,
  	"version_acf_case_studies_banner_title" varchar,
  	"version_acf_case_studies_banner_content" varchar,
  	"version_acf_case_studies_footer_top_title" varchar,
  	"version_acf_case_studies_footer_top_content" varchar,
  	"version_acf_case_studies_footer_top_form_title" varchar,
  	"version_acf_case_studies_footer_top_form_content" varchar,
  	"version_acf_getting_started_title" varchar,
  	"version_acf_getting_started_content" varchar,
  	"version_acf_getting_started_footer_top_title" varchar,
  	"version_acf_getting_started_footer_top_content" varchar,
  	"version_acf_getting_started_footer_form_title" varchar,
  	"version_acf_getting_started_footer_form" varchar,
  	"version_acf_product_banner_title" varchar,
  	"version_acf_product_banner_content" varchar,
  	"version_content" jsonb,
  	"version_template" "enum__pages_v_version_template" DEFAULT 'default',
  	"version_legacy_template" varchar,
  	"version_legacy_fields" jsonb,
  	"version_show_footer_form" boolean DEFAULT true,
  	"version_hide_from_sitemap" boolean,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_modified_at" timestamp(3) with time zone,
  	"version_parent_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_canonical_url" varchar,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_meta_nofollow" boolean DEFAULT false,
  	"version_meta_schema_type" "enum__pages_v_version_meta_schema_type" DEFAULT 'auto',
  	"version_meta_custom_schema" varchar,
  	"version_meta_og_title" varchar,
  	"version_meta_og_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"guides_id" integer,
  	"cases_id" integer,
  	"updates_id" integer,
  	"reviews_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "posts_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"featured_image_url" varchar,
  	"featured_image_alt" varchar,
  	"content" jsonb,
  	"faq_title" varchar,
  	"primary_category_id" integer,
  	"author_id" integer,
  	"show_toc" boolean DEFAULT true,
  	"reading_time" numeric,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"modified_at" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_canonical_url" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_nofollow" boolean DEFAULT false,
  	"meta_schema_type" "enum_posts_meta_schema_type" DEFAULT 'auto',
  	"meta_custom_schema" varchar,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_posts_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_featured_image_id" integer,
  	"version_featured_image_url" varchar,
  	"version_featured_image_alt" varchar,
  	"version_content" jsonb,
  	"version_faq_title" varchar,
  	"version_primary_category_id" integer,
  	"version_author_id" integer,
  	"version_show_toc" boolean DEFAULT true,
  	"version_reading_time" numeric,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_modified_at" timestamp(3) with time zone,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_canonical_url" varchar,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_meta_nofollow" boolean DEFAULT false,
  	"version_meta_schema_type" "enum__posts_v_version_meta_schema_type" DEFAULT 'auto',
  	"version_meta_custom_schema" varchar,
  	"version_meta_og_title" varchar,
  	"version_meta_og_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "guides_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "guides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"featured_image_url" varchar,
  	"featured_image_alt" varchar,
  	"content" jsonb,
  	"faq_title" varchar,
  	"category_id" integer,
  	"order" numeric DEFAULT 0,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"modified_at" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_canonical_url" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_nofollow" boolean DEFAULT false,
  	"meta_schema_type" "enum_guides_meta_schema_type" DEFAULT 'auto',
  	"meta_custom_schema" varchar,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_guides_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_guides_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_guides_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_featured_image_id" integer,
  	"version_featured_image_url" varchar,
  	"version_featured_image_alt" varchar,
  	"version_content" jsonb,
  	"version_faq_title" varchar,
  	"version_category_id" integer,
  	"version_order" numeric DEFAULT 0,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_modified_at" timestamp(3) with time zone,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_canonical_url" varchar,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_meta_nofollow" boolean DEFAULT false,
  	"version_meta_schema_type" "enum__guides_v_version_meta_schema_type" DEFAULT 'auto',
  	"version_meta_custom_schema" varchar,
  	"version_meta_og_title" varchar,
  	"version_meta_og_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__guides_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cases_study_top" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar
  );
  
  CREATE TABLE "cases_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "cases_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"client" varchar,
  	"study_paragraph" varchar,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"featured_image_url" varchar,
  	"featured_image_alt" varchar,
  	"content" jsonb,
  	"faq_title" varchar,
  	"category_id" integer,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"modified_at" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_canonical_url" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_nofollow" boolean DEFAULT false,
  	"meta_schema_type" "enum_cases_meta_schema_type" DEFAULT 'auto',
  	"meta_custom_schema" varchar,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_cases_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_cases_v_version_study_top" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cases_v_version_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cases_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cases_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_client" varchar,
  	"version_study_paragraph" varchar,
  	"version_excerpt" varchar,
  	"version_featured_image_id" integer,
  	"version_featured_image_url" varchar,
  	"version_featured_image_alt" varchar,
  	"version_content" jsonb,
  	"version_faq_title" varchar,
  	"version_category_id" integer,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_modified_at" timestamp(3) with time zone,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_canonical_url" varchar,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_meta_nofollow" boolean DEFAULT false,
  	"version_meta_schema_type" "enum__cases_v_version_meta_schema_type" DEFAULT 'auto',
  	"version_meta_custom_schema" varchar,
  	"version_meta_og_title" varchar,
  	"version_meta_og_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__cases_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "updates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"featured_image_url" varchar,
  	"featured_image_alt" varchar,
  	"content" jsonb,
  	"category_id" integer,
  	"version" varchar,
  	"release_date" timestamp(3) with time zone,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"modified_at" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_canonical_url" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_nofollow" boolean DEFAULT false,
  	"meta_schema_type" "enum_updates_meta_schema_type" DEFAULT 'auto',
  	"meta_custom_schema" varchar,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_updates_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_updates_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_featured_image_url" varchar,
  	"version_featured_image_alt" varchar,
  	"version_content" jsonb,
  	"version_category_id" integer,
  	"version_version" varchar,
  	"version_release_date" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_modified_at" timestamp(3) with time zone,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_canonical_url" varchar,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_meta_nofollow" boolean DEFAULT false,
  	"version_meta_schema_type" "enum__updates_v_version_meta_schema_type" DEFAULT 'auto',
  	"version_meta_custom_schema" varchar,
  	"version_meta_og_title" varchar,
  	"version_meta_og_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__updates_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "reviews_made_for_you_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"star" varchar,
  	"text" varchar,
  	"profile" varchar,
  	"author" varchar
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"reviewer" varchar,
  	"reviewer_role" varchar,
  	"rating" numeric,
  	"platform" "enum_reviews_platform" DEFAULT 'self',
  	"source_url" varchar,
  	"body" varchar,
  	"content" jsonb,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"modified_at" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_canonical_url" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_nofollow" boolean DEFAULT false,
  	"meta_schema_type" "enum_reviews_meta_schema_type" DEFAULT 'auto',
  	"meta_custom_schema" varchar,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_reviews_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_reviews_v_version_made_for_you_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"star" varchar,
  	"text" varchar,
  	"profile" varchar,
  	"author" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reviews_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_reviewer" varchar,
  	"version_reviewer_role" varchar,
  	"version_rating" numeric,
  	"version_platform" "enum__reviews_v_version_platform" DEFAULT 'self',
  	"version_source_url" varchar,
  	"version_body" varchar,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_modified_at" timestamp(3) with time zone,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_canonical_url" varchar,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_meta_nofollow" boolean DEFAULT false,
  	"version_meta_schema_type" "enum__reviews_v_version_meta_schema_type" DEFAULT 'auto',
  	"version_meta_custom_schema" varchar,
  	"version_meta_og_title" varchar,
  	"version_meta_og_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reviews_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"parent_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_canonical_url" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_nofollow" boolean DEFAULT false,
  	"meta_schema_type" "enum_categories_meta_schema_type" DEFAULT 'auto',
  	"meta_custom_schema" varchar,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_canonical_url" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_nofollow" boolean DEFAULT false,
  	"meta_schema_type" "enum_tags_meta_schema_type" DEFAULT 'auto',
  	"meta_custom_schema" varchar,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "section_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"kind" "enum_section_categories_kind" DEFAULT 'guide' NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_canonical_url" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_nofollow" boolean DEFAULT false,
  	"meta_schema_type" "enum_section_categories_meta_schema_type" DEFAULT 'auto',
  	"meta_custom_schema" varchar,
  	"meta_og_title" varchar,
  	"meta_og_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"avatar_id" integer,
  	"bio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"type" "enum_redirects_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"guides_id" integer,
  	"cases_id" integer,
  	"updates_id" integer,
  	"reviews_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"mailchimp_sync" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"guides_id" integer,
  	"cases_id" integer,
  	"updates_id" integer,
  	"reviews_id" integer,
  	"categories_id" integer,
  	"tags_id" integer,
  	"section_categories_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"redirects_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform",
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'AI Vastra' NOT NULL,
  	"tagline" varchar,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"title_template" varchar DEFAULT '%s | AI Vastra',
  	"default_description" varchar,
  	"default_og_image_id" integer,
  	"twitter_handle" varchar,
  	"block_indexing" boolean DEFAULT false,
  	"legal_name" varchar,
  	"founding_year" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"address" varchar,
  	"head_scripts" varchar,
  	"body_scripts" varchar,
  	"robots_extra" varchar,
  	"llms_txt" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_header_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_navigation_header_children_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "navigation_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_navigation_header_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "navigation_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_navigation_footer_columns_links_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_navigation_legal_links_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_button_type" "enum_navigation_header_button_type" DEFAULT 'custom',
  	"header_button_new_tab" boolean,
  	"header_button_url" varchar,
  	"header_button_label" varchar,
  	"copyright" varchar DEFAULT '© {year} AI Vastra. All rights reserved.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"guides_id" integer,
  	"cases_id" integer,
  	"updates_id" integer,
  	"reviews_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "acf_social_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"social_media_link" varchar,
  	"social_media_image" varchar,
  	"social_media_hover_image" varchar
  );
  
  CREATE TABLE "global_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"catalogue_content" varchar,
  	"sign_link" varchar,
  	"sign_text" varchar,
  	"google_play_link" varchar,
  	"google_play_image" varchar,
  	"shopify_link" varchar,
  	"shopify_image" varchar,
  	"footer_form_left_title" varchar,
  	"footer_form_left_content" varchar,
  	"footer_form_right_title" varchar,
  	"corporate_title" varchar,
  	"corporate_content" varchar,
  	"head_title" varchar,
  	"head_content" varchar,
  	"mail_link" varchar,
  	"mail_text" varchar,
  	"phone_link" varchar,
  	"phone_text" varchar,
  	"google_link" varchar,
  	"google_image" varchar,
  	"whatsapp_link" varchar,
  	"whatsapp_image" varchar,
  	"footer_top_left_title" varchar,
  	"footer_top_left_content" varchar,
  	"footer_top_right_title" varchar,
  	"footer_top_form" varchar,
  	"fashion_insights_title" varchar,
  	"fashion_insights_content" varchar,
  	"fashion_insights_block" varchar,
  	"contact_form_id" integer,
  	"newsletter_form_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_hero_buttons" ADD CONSTRAINT "pages_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text_bullets" ADD CONSTRAINT "pages_blocks_image_text_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items" ADD CONSTRAINT "pages_blocks_feature_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items" ADD CONSTRAINT "pages_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_steps" ADD CONSTRAINT "pages_blocks_steps_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_steps" ADD CONSTRAINT "pages_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_tabs" ADD CONSTRAINT "pages_blocks_tabs_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_tabs" ADD CONSTRAINT "pages_blocks_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs" ADD CONSTRAINT "pages_blocks_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans_features" ADD CONSTRAINT "pages_blocks_pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans" ADD CONSTRAINT "pages_blocks_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_post_feed" ADD CONSTRAINT "pages_blocks_post_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_post_feed" ADD CONSTRAINT "pages_blocks_post_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form_details" ADD CONSTRAINT "pages_blocks_contact_form_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_html" ADD CONSTRAINT "pages_blocks_html_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_accordion_list" ADD CONSTRAINT "acf_accordion_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_tab_images" ADD CONSTRAINT "acf_tab_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."acf_fashion_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_fashion_tabs" ADD CONSTRAINT "acf_fashion_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_guide_categories" ADD CONSTRAINT "acf_guide_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_creation_list" ADD CONSTRAINT "acf_creation_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_why_teams_list" ADD CONSTRAINT "acf_why_teams_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_proof_list" ADD CONSTRAINT "acf_proof_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_aiphotoshoot_list" ADD CONSTRAINT "acf_aiphotoshoot_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_aiphotoshoot_cost_list" ADD CONSTRAINT "acf_aiphotoshoot_cost_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_showcase_list" ADD CONSTRAINT "acf_showcase_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_built_list" ADD CONSTRAINT "acf_built_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_sellers_list" ADD CONSTRAINT "acf_sellers_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_comparison_list" ADD CONSTRAINT "acf_comparison_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_math_comparison_list" ADD CONSTRAINT "acf_math_comparison_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_works_list" ADD CONSTRAINT "acf_works_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_launch_list" ADD CONSTRAINT "acf_launch_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopify_banner_trust_pills" ADD CONSTRAINT "acf_shopify_banner_trust_pills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopper_uploads_cards" ADD CONSTRAINT "acf_shopper_uploads_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopify_the_real_problem_stat_bar" ADD CONSTRAINT "acf_shopify_the_real_problem_stat_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopify_the_real_problem_cards" ADD CONSTRAINT "acf_shopify_the_real_problem_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopify_shopping_logos_items" ADD CONSTRAINT "acf_shopify_shopping_logos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopify_how_it_works_left_list" ADD CONSTRAINT "acf_shopify_how_it_works_left_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopify_built_for_your_catalogue_car" ADD CONSTRAINT "acf_shopify_built_for_your_catalogue_car_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopify_integration_cards" ADD CONSTRAINT "acf_shopify_integration_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopify_integration_btm_cards" ADD CONSTRAINT "acf_shopify_integration_btm_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopify_what_it_does_for_your_busine" ADD CONSTRAINT "acf_shopify_what_it_does_for_your_busine_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_klaviyo_img_blk" ADD CONSTRAINT "acf_klaviyo_img_blk_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."acf_shopify_plays_well_with_your_stack_c"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopify_plays_well_with_your_stack_c" ADD CONSTRAINT "acf_shopify_plays_well_with_your_stack_c_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_shopify_frm_lft_trust_tags" ADD CONSTRAINT "acf_shopify_frm_lft_trust_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_experiences_list" ADD CONSTRAINT "acf_experiences_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_mission_list" ADD CONSTRAINT "acf_mission_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_virtual_experiences_list" ADD CONSTRAINT "acf_virtual_experiences_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_contact_social_media" ADD CONSTRAINT "acf_contact_social_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_contact_locations_section_list" ADD CONSTRAINT "acf_contact_locations_section_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_virtual_try_on_shoppers_list" ADD CONSTRAINT "acf_virtual_try_on_shoppers_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_virtual_try_on_business_list" ADD CONSTRAINT "acf_virtual_try_on_business_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_virtual_try_on_wardrobe_list" ADD CONSTRAINT "acf_virtual_try_on_wardrobe_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_virtual_try_on_fashion_list" ADD CONSTRAINT "acf_virtual_try_on_fashion_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_case_studies_banner_buttom_list" ADD CONSTRAINT "acf_case_studies_banner_buttom_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_updates_fk" FOREIGN KEY ("updates_id") REFERENCES "public"."updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text_bullets" ADD CONSTRAINT "_pages_v_blocks_image_text_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_items" ADD CONSTRAINT "_pages_v_blocks_feature_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_items" ADD CONSTRAINT "_pages_v_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD CONSTRAINT "_pages_v_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_steps" ADD CONSTRAINT "_pages_v_blocks_steps_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_steps" ADD CONSTRAINT "_pages_v_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_tabs_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs" ADD CONSTRAINT "_pages_v_blocks_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_plans_features" ADD CONSTRAINT "_pages_v_blocks_pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_plans" ADD CONSTRAINT "_pages_v_blocks_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_post_feed" ADD CONSTRAINT "_pages_v_blocks_post_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_post_feed" ADD CONSTRAINT "_pages_v_blocks_post_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form_details" ADD CONSTRAINT "_pages_v_blocks_contact_form_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_html" ADD CONSTRAINT "_pages_v_blocks_html_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_accordion_list_v" ADD CONSTRAINT "_acf_accordion_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_tab_images_v" ADD CONSTRAINT "_acf_tab_images_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_acf_fashion_tabs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_fashion_tabs_v" ADD CONSTRAINT "_acf_fashion_tabs_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_guide_categories_v" ADD CONSTRAINT "_acf_guide_categories_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_creation_list_v" ADD CONSTRAINT "_acf_creation_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_why_teams_list_v" ADD CONSTRAINT "_acf_why_teams_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_proof_list_v" ADD CONSTRAINT "_acf_proof_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_aiphotoshoot_list_v" ADD CONSTRAINT "_acf_aiphotoshoot_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_aiphotoshoot_cost_list_v" ADD CONSTRAINT "_acf_aiphotoshoot_cost_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_showcase_list_v" ADD CONSTRAINT "_acf_showcase_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_built_list_v" ADD CONSTRAINT "_acf_built_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_sellers_list_v" ADD CONSTRAINT "_acf_sellers_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_comparison_list_v" ADD CONSTRAINT "_acf_comparison_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_math_comparison_list_v" ADD CONSTRAINT "_acf_math_comparison_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_works_list_v" ADD CONSTRAINT "_acf_works_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_launch_list_v" ADD CONSTRAINT "_acf_launch_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopify_banner_trust_pills_v" ADD CONSTRAINT "_acf_shopify_banner_trust_pills_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopper_uploads_cards_v" ADD CONSTRAINT "_acf_shopper_uploads_cards_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopify_the_real_problem_stat_bar_v" ADD CONSTRAINT "_acf_shopify_the_real_problem_stat_bar_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopify_the_real_problem_cards_v" ADD CONSTRAINT "_acf_shopify_the_real_problem_cards_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopify_shopping_logos_items_v" ADD CONSTRAINT "_acf_shopify_shopping_logos_items_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopify_how_it_works_left_list_v" ADD CONSTRAINT "_acf_shopify_how_it_works_left_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopify_built_for_your_catalogue_car_v" ADD CONSTRAINT "_acf_shopify_built_for_your_catalogue_car_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopify_integration_cards_v" ADD CONSTRAINT "_acf_shopify_integration_cards_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopify_integration_btm_cards_v" ADD CONSTRAINT "_acf_shopify_integration_btm_cards_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopify_what_it_does_for_your_busine_v" ADD CONSTRAINT "_acf_shopify_what_it_does_for_your_busine_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_klaviyo_img_blk_v" ADD CONSTRAINT "_acf_klaviyo_img_blk_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_acf_shopify_plays_well_with_your_stack_c_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopify_plays_well_with_your_stack_c_v" ADD CONSTRAINT "_acf_shopify_plays_well_with_your_stack_c_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_shopify_frm_lft_trust_tags_v" ADD CONSTRAINT "_acf_shopify_frm_lft_trust_tags_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_experiences_list_v" ADD CONSTRAINT "_acf_experiences_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_mission_list_v" ADD CONSTRAINT "_acf_mission_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_virtual_experiences_list_v" ADD CONSTRAINT "_acf_virtual_experiences_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_contact_social_media_v" ADD CONSTRAINT "_acf_contact_social_media_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_contact_locations_section_list_v" ADD CONSTRAINT "_acf_contact_locations_section_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_virtual_try_on_shoppers_list_v" ADD CONSTRAINT "_acf_virtual_try_on_shoppers_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_virtual_try_on_business_list_v" ADD CONSTRAINT "_acf_virtual_try_on_business_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_virtual_try_on_wardrobe_list_v" ADD CONSTRAINT "_acf_virtual_try_on_wardrobe_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_virtual_try_on_fashion_list_v" ADD CONSTRAINT "_acf_virtual_try_on_fashion_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_acf_case_studies_banner_buttom_list_v" ADD CONSTRAINT "_acf_case_studies_banner_buttom_list_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_updates_fk" FOREIGN KEY ("updates_id") REFERENCES "public"."updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_faq" ADD CONSTRAINT "posts_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_primary_category_id_categories_id_fk" FOREIGN KEY ("primary_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_faq" ADD CONSTRAINT "_posts_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_primary_category_id_categories_id_fk" FOREIGN KEY ("version_primary_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_faq" ADD CONSTRAINT "guides_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_category_id_section_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."section_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v_version_faq" ADD CONSTRAINT "_guides_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_guides_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_parent_id_guides_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."guides"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_version_category_id_section_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."section_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases_study_top" ADD CONSTRAINT "cases_study_top_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_metrics" ADD CONSTRAINT "cases_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_faq" ADD CONSTRAINT "cases_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases" ADD CONSTRAINT "cases_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases" ADD CONSTRAINT "cases_category_id_section_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."section_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases" ADD CONSTRAINT "cases_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v_version_study_top" ADD CONSTRAINT "_cases_v_version_study_top_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_version_metrics" ADD CONSTRAINT "_cases_v_version_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_version_faq" ADD CONSTRAINT "_cases_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v" ADD CONSTRAINT "_cases_v_parent_id_cases_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v" ADD CONSTRAINT "_cases_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v" ADD CONSTRAINT "_cases_v_version_category_id_section_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."section_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v" ADD CONSTRAINT "_cases_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "updates" ADD CONSTRAINT "updates_category_id_section_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."section_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "updates" ADD CONSTRAINT "updates_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_updates_v" ADD CONSTRAINT "_updates_v_parent_id_updates_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."updates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_updates_v" ADD CONSTRAINT "_updates_v_version_category_id_section_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."section_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_updates_v" ADD CONSTRAINT "_updates_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews_made_for_you_items" ADD CONSTRAINT "reviews_made_for_you_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v_version_made_for_you_items" ADD CONSTRAINT "_reviews_v_version_made_for_you_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reviews_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_parent_id_reviews_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "section_categories" ADD CONSTRAINT "section_categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_updates_fk" FOREIGN KEY ("updates_id") REFERENCES "public"."updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_updates_fk" FOREIGN KEY ("updates_id") REFERENCES "public"."updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_section_categories_fk" FOREIGN KEY ("section_categories_id") REFERENCES "public"."section_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_children" ADD CONSTRAINT "navigation_header_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_legal_links" ADD CONSTRAINT "navigation_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_updates_fk" FOREIGN KEY ("updates_id") REFERENCES "public"."updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acf_social_media" ADD CONSTRAINT "acf_social_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_content" ADD CONSTRAINT "global_content_contact_form_id_forms_id_fk" FOREIGN KEY ("contact_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "global_content" ADD CONSTRAINT "global_content_newsletter_form_id_forms_id_fk" FOREIGN KEY ("newsletter_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_buttons_order_idx" ON "pages_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_buttons_parent_id_idx" ON "pages_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_bullets_order_idx" ON "pages_blocks_image_text_bullets" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_bullets_parent_id_idx" ON "pages_blocks_image_text_bullets" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_order_idx" ON "pages_blocks_image_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_parent_id_idx" ON "pages_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_path_idx" ON "pages_blocks_image_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_image_idx" ON "pages_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_feature_grid_items_order_idx" ON "pages_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_items_parent_id_idx" ON "pages_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_items_image_idx" ON "pages_blocks_feature_grid_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_feature_grid_order_idx" ON "pages_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_parent_id_idx" ON "pages_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_path_idx" ON "pages_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_steps_steps_order_idx" ON "pages_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_steps_parent_id_idx" ON "pages_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_steps_image_idx" ON "pages_blocks_steps_steps" USING btree ("image_id");
  CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_tabs_tabs_order_idx" ON "pages_blocks_tabs_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_tabs_tabs_parent_id_idx" ON "pages_blocks_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tabs_tabs_image_idx" ON "pages_blocks_tabs_tabs" USING btree ("image_id");
  CREATE INDEX "pages_blocks_tabs_order_idx" ON "pages_blocks_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_tabs_parent_id_idx" ON "pages_blocks_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tabs_path_idx" ON "pages_blocks_tabs" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_items_image_idx" ON "pages_blocks_testimonials_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_pricing_plans_features_order_idx" ON "pages_blocks_pricing_plans_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_features_parent_id_idx" ON "pages_blocks_pricing_plans_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_plans_order_idx" ON "pages_blocks_pricing_plans" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_parent_id_idx" ON "pages_blocks_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_order_idx" ON "pages_blocks_pricing" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_parent_id_idx" ON "pages_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_path_idx" ON "pages_blocks_pricing" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_post_feed_order_idx" ON "pages_blocks_post_feed" USING btree ("_order");
  CREATE INDEX "pages_blocks_post_feed_parent_id_idx" ON "pages_blocks_post_feed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_post_feed_path_idx" ON "pages_blocks_post_feed" USING btree ("_path");
  CREATE INDEX "pages_blocks_post_feed_category_idx" ON "pages_blocks_post_feed" USING btree ("category_id");
  CREATE INDEX "pages_blocks_contact_form_details_order_idx" ON "pages_blocks_contact_form_details" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_details_parent_id_idx" ON "pages_blocks_contact_form_details" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_form_form_idx" ON "pages_blocks_contact_form" USING btree ("form_id");
  CREATE INDEX "pages_blocks_html_order_idx" ON "pages_blocks_html" USING btree ("_order");
  CREATE INDEX "pages_blocks_html_parent_id_idx" ON "pages_blocks_html" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_html_path_idx" ON "pages_blocks_html" USING btree ("_path");
  CREATE INDEX "acf_accordion_list_order_idx" ON "acf_accordion_list" USING btree ("_order");
  CREATE INDEX "acf_accordion_list_parent_id_idx" ON "acf_accordion_list" USING btree ("_parent_id");
  CREATE INDEX "acf_tab_images_order_idx" ON "acf_tab_images" USING btree ("_order");
  CREATE INDEX "acf_tab_images_parent_id_idx" ON "acf_tab_images" USING btree ("_parent_id");
  CREATE INDEX "acf_fashion_tabs_order_idx" ON "acf_fashion_tabs" USING btree ("_order");
  CREATE INDEX "acf_fashion_tabs_parent_id_idx" ON "acf_fashion_tabs" USING btree ("_parent_id");
  CREATE INDEX "acf_guide_categories_order_idx" ON "acf_guide_categories" USING btree ("_order");
  CREATE INDEX "acf_guide_categories_parent_id_idx" ON "acf_guide_categories" USING btree ("_parent_id");
  CREATE INDEX "acf_creation_list_order_idx" ON "acf_creation_list" USING btree ("_order");
  CREATE INDEX "acf_creation_list_parent_id_idx" ON "acf_creation_list" USING btree ("_parent_id");
  CREATE INDEX "acf_why_teams_list_order_idx" ON "acf_why_teams_list" USING btree ("_order");
  CREATE INDEX "acf_why_teams_list_parent_id_idx" ON "acf_why_teams_list" USING btree ("_parent_id");
  CREATE INDEX "acf_proof_list_order_idx" ON "acf_proof_list" USING btree ("_order");
  CREATE INDEX "acf_proof_list_parent_id_idx" ON "acf_proof_list" USING btree ("_parent_id");
  CREATE INDEX "acf_aiphotoshoot_list_order_idx" ON "acf_aiphotoshoot_list" USING btree ("_order");
  CREATE INDEX "acf_aiphotoshoot_list_parent_id_idx" ON "acf_aiphotoshoot_list" USING btree ("_parent_id");
  CREATE INDEX "acf_aiphotoshoot_cost_list_order_idx" ON "acf_aiphotoshoot_cost_list" USING btree ("_order");
  CREATE INDEX "acf_aiphotoshoot_cost_list_parent_id_idx" ON "acf_aiphotoshoot_cost_list" USING btree ("_parent_id");
  CREATE INDEX "acf_showcase_list_order_idx" ON "acf_showcase_list" USING btree ("_order");
  CREATE INDEX "acf_showcase_list_parent_id_idx" ON "acf_showcase_list" USING btree ("_parent_id");
  CREATE INDEX "acf_built_list_order_idx" ON "acf_built_list" USING btree ("_order");
  CREATE INDEX "acf_built_list_parent_id_idx" ON "acf_built_list" USING btree ("_parent_id");
  CREATE INDEX "acf_sellers_list_order_idx" ON "acf_sellers_list" USING btree ("_order");
  CREATE INDEX "acf_sellers_list_parent_id_idx" ON "acf_sellers_list" USING btree ("_parent_id");
  CREATE INDEX "acf_comparison_list_order_idx" ON "acf_comparison_list" USING btree ("_order");
  CREATE INDEX "acf_comparison_list_parent_id_idx" ON "acf_comparison_list" USING btree ("_parent_id");
  CREATE INDEX "acf_math_comparison_list_order_idx" ON "acf_math_comparison_list" USING btree ("_order");
  CREATE INDEX "acf_math_comparison_list_parent_id_idx" ON "acf_math_comparison_list" USING btree ("_parent_id");
  CREATE INDEX "acf_works_list_order_idx" ON "acf_works_list" USING btree ("_order");
  CREATE INDEX "acf_works_list_parent_id_idx" ON "acf_works_list" USING btree ("_parent_id");
  CREATE INDEX "acf_launch_list_order_idx" ON "acf_launch_list" USING btree ("_order");
  CREATE INDEX "acf_launch_list_parent_id_idx" ON "acf_launch_list" USING btree ("_parent_id");
  CREATE INDEX "acf_shopify_banner_trust_pills_order_idx" ON "acf_shopify_banner_trust_pills" USING btree ("_order");
  CREATE INDEX "acf_shopify_banner_trust_pills_parent_id_idx" ON "acf_shopify_banner_trust_pills" USING btree ("_parent_id");
  CREATE INDEX "acf_shopper_uploads_cards_order_idx" ON "acf_shopper_uploads_cards" USING btree ("_order");
  CREATE INDEX "acf_shopper_uploads_cards_parent_id_idx" ON "acf_shopper_uploads_cards" USING btree ("_parent_id");
  CREATE INDEX "acf_shopify_the_real_problem_stat_bar_order_idx" ON "acf_shopify_the_real_problem_stat_bar" USING btree ("_order");
  CREATE INDEX "acf_shopify_the_real_problem_stat_bar_parent_id_idx" ON "acf_shopify_the_real_problem_stat_bar" USING btree ("_parent_id");
  CREATE INDEX "acf_shopify_the_real_problem_cards_order_idx" ON "acf_shopify_the_real_problem_cards" USING btree ("_order");
  CREATE INDEX "acf_shopify_the_real_problem_cards_parent_id_idx" ON "acf_shopify_the_real_problem_cards" USING btree ("_parent_id");
  CREATE INDEX "acf_shopify_shopping_logos_items_order_idx" ON "acf_shopify_shopping_logos_items" USING btree ("_order");
  CREATE INDEX "acf_shopify_shopping_logos_items_parent_id_idx" ON "acf_shopify_shopping_logos_items" USING btree ("_parent_id");
  CREATE INDEX "acf_shopify_how_it_works_left_list_order_idx" ON "acf_shopify_how_it_works_left_list" USING btree ("_order");
  CREATE INDEX "acf_shopify_how_it_works_left_list_parent_id_idx" ON "acf_shopify_how_it_works_left_list" USING btree ("_parent_id");
  CREATE INDEX "acf_shopify_built_for_your_catalogue_car_order_idx" ON "acf_shopify_built_for_your_catalogue_car" USING btree ("_order");
  CREATE INDEX "acf_shopify_built_for_your_catalogue_car_parent_id_idx" ON "acf_shopify_built_for_your_catalogue_car" USING btree ("_parent_id");
  CREATE INDEX "acf_shopify_integration_cards_order_idx" ON "acf_shopify_integration_cards" USING btree ("_order");
  CREATE INDEX "acf_shopify_integration_cards_parent_id_idx" ON "acf_shopify_integration_cards" USING btree ("_parent_id");
  CREATE INDEX "acf_shopify_integration_btm_cards_order_idx" ON "acf_shopify_integration_btm_cards" USING btree ("_order");
  CREATE INDEX "acf_shopify_integration_btm_cards_parent_id_idx" ON "acf_shopify_integration_btm_cards" USING btree ("_parent_id");
  CREATE INDEX "acf_shopify_what_it_does_for_your_busine_order_idx" ON "acf_shopify_what_it_does_for_your_busine" USING btree ("_order");
  CREATE INDEX "acf_shopify_what_it_does_for_your_busine_parent_id_idx" ON "acf_shopify_what_it_does_for_your_busine" USING btree ("_parent_id");
  CREATE INDEX "acf_klaviyo_img_blk_order_idx" ON "acf_klaviyo_img_blk" USING btree ("_order");
  CREATE INDEX "acf_klaviyo_img_blk_parent_id_idx" ON "acf_klaviyo_img_blk" USING btree ("_parent_id");
  CREATE INDEX "acf_shopify_plays_well_with_your_stack_c_order_idx" ON "acf_shopify_plays_well_with_your_stack_c" USING btree ("_order");
  CREATE INDEX "acf_shopify_plays_well_with_your_stack_c_parent_id_idx" ON "acf_shopify_plays_well_with_your_stack_c" USING btree ("_parent_id");
  CREATE INDEX "acf_shopify_frm_lft_trust_tags_order_idx" ON "acf_shopify_frm_lft_trust_tags" USING btree ("_order");
  CREATE INDEX "acf_shopify_frm_lft_trust_tags_parent_id_idx" ON "acf_shopify_frm_lft_trust_tags" USING btree ("_parent_id");
  CREATE INDEX "acf_experiences_list_order_idx" ON "acf_experiences_list" USING btree ("_order");
  CREATE INDEX "acf_experiences_list_parent_id_idx" ON "acf_experiences_list" USING btree ("_parent_id");
  CREATE INDEX "acf_mission_list_order_idx" ON "acf_mission_list" USING btree ("_order");
  CREATE INDEX "acf_mission_list_parent_id_idx" ON "acf_mission_list" USING btree ("_parent_id");
  CREATE INDEX "acf_virtual_experiences_list_order_idx" ON "acf_virtual_experiences_list" USING btree ("_order");
  CREATE INDEX "acf_virtual_experiences_list_parent_id_idx" ON "acf_virtual_experiences_list" USING btree ("_parent_id");
  CREATE INDEX "acf_contact_social_media_order_idx" ON "acf_contact_social_media" USING btree ("_order");
  CREATE INDEX "acf_contact_social_media_parent_id_idx" ON "acf_contact_social_media" USING btree ("_parent_id");
  CREATE INDEX "acf_contact_locations_section_list_order_idx" ON "acf_contact_locations_section_list" USING btree ("_order");
  CREATE INDEX "acf_contact_locations_section_list_parent_id_idx" ON "acf_contact_locations_section_list" USING btree ("_parent_id");
  CREATE INDEX "acf_virtual_try_on_shoppers_list_order_idx" ON "acf_virtual_try_on_shoppers_list" USING btree ("_order");
  CREATE INDEX "acf_virtual_try_on_shoppers_list_parent_id_idx" ON "acf_virtual_try_on_shoppers_list" USING btree ("_parent_id");
  CREATE INDEX "acf_virtual_try_on_business_list_order_idx" ON "acf_virtual_try_on_business_list" USING btree ("_order");
  CREATE INDEX "acf_virtual_try_on_business_list_parent_id_idx" ON "acf_virtual_try_on_business_list" USING btree ("_parent_id");
  CREATE INDEX "acf_virtual_try_on_wardrobe_list_order_idx" ON "acf_virtual_try_on_wardrobe_list" USING btree ("_order");
  CREATE INDEX "acf_virtual_try_on_wardrobe_list_parent_id_idx" ON "acf_virtual_try_on_wardrobe_list" USING btree ("_parent_id");
  CREATE INDEX "acf_virtual_try_on_fashion_list_order_idx" ON "acf_virtual_try_on_fashion_list" USING btree ("_order");
  CREATE INDEX "acf_virtual_try_on_fashion_list_parent_id_idx" ON "acf_virtual_try_on_fashion_list" USING btree ("_parent_id");
  CREATE INDEX "acf_case_studies_banner_buttom_list_order_idx" ON "acf_case_studies_banner_buttom_list" USING btree ("_order");
  CREATE INDEX "acf_case_studies_banner_buttom_list_parent_id_idx" ON "acf_case_studies_banner_buttom_list" USING btree ("_parent_id");
  CREATE INDEX "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "pages_breadcrumbs_doc_idx" ON "pages_breadcrumbs" USING btree ("doc_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_guides_id_idx" ON "pages_rels" USING btree ("guides_id");
  CREATE INDEX "pages_rels_cases_id_idx" ON "pages_rels" USING btree ("cases_id");
  CREATE INDEX "pages_rels_updates_id_idx" ON "pages_rels" USING btree ("updates_id");
  CREATE INDEX "pages_rels_reviews_id_idx" ON "pages_rels" USING btree ("reviews_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_blocks_hero_buttons_order_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_buttons_parent_id_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_bullets_order_idx" ON "_pages_v_blocks_image_text_bullets" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_bullets_parent_id_idx" ON "_pages_v_blocks_image_text_bullets" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_order_idx" ON "_pages_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_parent_id_idx" ON "_pages_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_path_idx" ON "_pages_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_image_idx" ON "_pages_v_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_order_idx" ON "_pages_v_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_parent_id_idx" ON "_pages_v_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_items_image_idx" ON "_pages_v_blocks_feature_grid_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_order_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_parent_id_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_path_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_steps_steps_order_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_steps_parent_id_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_steps_image_idx" ON "_pages_v_blocks_steps_steps" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_order_idx" ON "_pages_v_blocks_tabs_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_parent_id_idx" ON "_pages_v_blocks_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_image_idx" ON "_pages_v_blocks_tabs_tabs" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_tabs_order_idx" ON "_pages_v_blocks_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tabs_parent_id_idx" ON "_pages_v_blocks_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_path_idx" ON "_pages_v_blocks_tabs" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_image_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pricing_plans_features_order_idx" ON "_pages_v_blocks_pricing_plans_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_plans_features_parent_id_idx" ON "_pages_v_blocks_pricing_plans_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_plans_order_idx" ON "_pages_v_blocks_pricing_plans" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_plans_parent_id_idx" ON "_pages_v_blocks_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_order_idx" ON "_pages_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_parent_id_idx" ON "_pages_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_path_idx" ON "_pages_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_post_feed_order_idx" ON "_pages_v_blocks_post_feed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_post_feed_parent_id_idx" ON "_pages_v_blocks_post_feed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_post_feed_path_idx" ON "_pages_v_blocks_post_feed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_post_feed_category_idx" ON "_pages_v_blocks_post_feed" USING btree ("category_id");
  CREATE INDEX "_pages_v_blocks_contact_form_details_order_idx" ON "_pages_v_blocks_contact_form_details" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_details_parent_id_idx" ON "_pages_v_blocks_contact_form_details" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_form_form_idx" ON "_pages_v_blocks_contact_form" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_html_order_idx" ON "_pages_v_blocks_html" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_html_parent_id_idx" ON "_pages_v_blocks_html" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_html_path_idx" ON "_pages_v_blocks_html" USING btree ("_path");
  CREATE INDEX "_acf_accordion_list_v_order_idx" ON "_acf_accordion_list_v" USING btree ("_order");
  CREATE INDEX "_acf_accordion_list_v_parent_id_idx" ON "_acf_accordion_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_tab_images_v_order_idx" ON "_acf_tab_images_v" USING btree ("_order");
  CREATE INDEX "_acf_tab_images_v_parent_id_idx" ON "_acf_tab_images_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_fashion_tabs_v_order_idx" ON "_acf_fashion_tabs_v" USING btree ("_order");
  CREATE INDEX "_acf_fashion_tabs_v_parent_id_idx" ON "_acf_fashion_tabs_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_guide_categories_v_order_idx" ON "_acf_guide_categories_v" USING btree ("_order");
  CREATE INDEX "_acf_guide_categories_v_parent_id_idx" ON "_acf_guide_categories_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_creation_list_v_order_idx" ON "_acf_creation_list_v" USING btree ("_order");
  CREATE INDEX "_acf_creation_list_v_parent_id_idx" ON "_acf_creation_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_why_teams_list_v_order_idx" ON "_acf_why_teams_list_v" USING btree ("_order");
  CREATE INDEX "_acf_why_teams_list_v_parent_id_idx" ON "_acf_why_teams_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_proof_list_v_order_idx" ON "_acf_proof_list_v" USING btree ("_order");
  CREATE INDEX "_acf_proof_list_v_parent_id_idx" ON "_acf_proof_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_aiphotoshoot_list_v_order_idx" ON "_acf_aiphotoshoot_list_v" USING btree ("_order");
  CREATE INDEX "_acf_aiphotoshoot_list_v_parent_id_idx" ON "_acf_aiphotoshoot_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_aiphotoshoot_cost_list_v_order_idx" ON "_acf_aiphotoshoot_cost_list_v" USING btree ("_order");
  CREATE INDEX "_acf_aiphotoshoot_cost_list_v_parent_id_idx" ON "_acf_aiphotoshoot_cost_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_showcase_list_v_order_idx" ON "_acf_showcase_list_v" USING btree ("_order");
  CREATE INDEX "_acf_showcase_list_v_parent_id_idx" ON "_acf_showcase_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_built_list_v_order_idx" ON "_acf_built_list_v" USING btree ("_order");
  CREATE INDEX "_acf_built_list_v_parent_id_idx" ON "_acf_built_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_sellers_list_v_order_idx" ON "_acf_sellers_list_v" USING btree ("_order");
  CREATE INDEX "_acf_sellers_list_v_parent_id_idx" ON "_acf_sellers_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_comparison_list_v_order_idx" ON "_acf_comparison_list_v" USING btree ("_order");
  CREATE INDEX "_acf_comparison_list_v_parent_id_idx" ON "_acf_comparison_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_math_comparison_list_v_order_idx" ON "_acf_math_comparison_list_v" USING btree ("_order");
  CREATE INDEX "_acf_math_comparison_list_v_parent_id_idx" ON "_acf_math_comparison_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_works_list_v_order_idx" ON "_acf_works_list_v" USING btree ("_order");
  CREATE INDEX "_acf_works_list_v_parent_id_idx" ON "_acf_works_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_launch_list_v_order_idx" ON "_acf_launch_list_v" USING btree ("_order");
  CREATE INDEX "_acf_launch_list_v_parent_id_idx" ON "_acf_launch_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopify_banner_trust_pills_v_order_idx" ON "_acf_shopify_banner_trust_pills_v" USING btree ("_order");
  CREATE INDEX "_acf_shopify_banner_trust_pills_v_parent_id_idx" ON "_acf_shopify_banner_trust_pills_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopper_uploads_cards_v_order_idx" ON "_acf_shopper_uploads_cards_v" USING btree ("_order");
  CREATE INDEX "_acf_shopper_uploads_cards_v_parent_id_idx" ON "_acf_shopper_uploads_cards_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopify_the_real_problem_stat_bar_v_order_idx" ON "_acf_shopify_the_real_problem_stat_bar_v" USING btree ("_order");
  CREATE INDEX "_acf_shopify_the_real_problem_stat_bar_v_parent_id_idx" ON "_acf_shopify_the_real_problem_stat_bar_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopify_the_real_problem_cards_v_order_idx" ON "_acf_shopify_the_real_problem_cards_v" USING btree ("_order");
  CREATE INDEX "_acf_shopify_the_real_problem_cards_v_parent_id_idx" ON "_acf_shopify_the_real_problem_cards_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopify_shopping_logos_items_v_order_idx" ON "_acf_shopify_shopping_logos_items_v" USING btree ("_order");
  CREATE INDEX "_acf_shopify_shopping_logos_items_v_parent_id_idx" ON "_acf_shopify_shopping_logos_items_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopify_how_it_works_left_list_v_order_idx" ON "_acf_shopify_how_it_works_left_list_v" USING btree ("_order");
  CREATE INDEX "_acf_shopify_how_it_works_left_list_v_parent_id_idx" ON "_acf_shopify_how_it_works_left_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopify_built_for_your_catalogue_car_v_order_idx" ON "_acf_shopify_built_for_your_catalogue_car_v" USING btree ("_order");
  CREATE INDEX "_acf_shopify_built_for_your_catalogue_car_v_parent_id_idx" ON "_acf_shopify_built_for_your_catalogue_car_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopify_integration_cards_v_order_idx" ON "_acf_shopify_integration_cards_v" USING btree ("_order");
  CREATE INDEX "_acf_shopify_integration_cards_v_parent_id_idx" ON "_acf_shopify_integration_cards_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopify_integration_btm_cards_v_order_idx" ON "_acf_shopify_integration_btm_cards_v" USING btree ("_order");
  CREATE INDEX "_acf_shopify_integration_btm_cards_v_parent_id_idx" ON "_acf_shopify_integration_btm_cards_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopify_what_it_does_for_your_busine_v_order_idx" ON "_acf_shopify_what_it_does_for_your_busine_v" USING btree ("_order");
  CREATE INDEX "_acf_shopify_what_it_does_for_your_busine_v_parent_id_idx" ON "_acf_shopify_what_it_does_for_your_busine_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_klaviyo_img_blk_v_order_idx" ON "_acf_klaviyo_img_blk_v" USING btree ("_order");
  CREATE INDEX "_acf_klaviyo_img_blk_v_parent_id_idx" ON "_acf_klaviyo_img_blk_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopify_plays_well_with_your_stack_c_v_order_idx" ON "_acf_shopify_plays_well_with_your_stack_c_v" USING btree ("_order");
  CREATE INDEX "_acf_shopify_plays_well_with_your_stack_c_v_parent_id_idx" ON "_acf_shopify_plays_well_with_your_stack_c_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_shopify_frm_lft_trust_tags_v_order_idx" ON "_acf_shopify_frm_lft_trust_tags_v" USING btree ("_order");
  CREATE INDEX "_acf_shopify_frm_lft_trust_tags_v_parent_id_idx" ON "_acf_shopify_frm_lft_trust_tags_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_experiences_list_v_order_idx" ON "_acf_experiences_list_v" USING btree ("_order");
  CREATE INDEX "_acf_experiences_list_v_parent_id_idx" ON "_acf_experiences_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_mission_list_v_order_idx" ON "_acf_mission_list_v" USING btree ("_order");
  CREATE INDEX "_acf_mission_list_v_parent_id_idx" ON "_acf_mission_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_virtual_experiences_list_v_order_idx" ON "_acf_virtual_experiences_list_v" USING btree ("_order");
  CREATE INDEX "_acf_virtual_experiences_list_v_parent_id_idx" ON "_acf_virtual_experiences_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_contact_social_media_v_order_idx" ON "_acf_contact_social_media_v" USING btree ("_order");
  CREATE INDEX "_acf_contact_social_media_v_parent_id_idx" ON "_acf_contact_social_media_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_contact_locations_section_list_v_order_idx" ON "_acf_contact_locations_section_list_v" USING btree ("_order");
  CREATE INDEX "_acf_contact_locations_section_list_v_parent_id_idx" ON "_acf_contact_locations_section_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_virtual_try_on_shoppers_list_v_order_idx" ON "_acf_virtual_try_on_shoppers_list_v" USING btree ("_order");
  CREATE INDEX "_acf_virtual_try_on_shoppers_list_v_parent_id_idx" ON "_acf_virtual_try_on_shoppers_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_virtual_try_on_business_list_v_order_idx" ON "_acf_virtual_try_on_business_list_v" USING btree ("_order");
  CREATE INDEX "_acf_virtual_try_on_business_list_v_parent_id_idx" ON "_acf_virtual_try_on_business_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_virtual_try_on_wardrobe_list_v_order_idx" ON "_acf_virtual_try_on_wardrobe_list_v" USING btree ("_order");
  CREATE INDEX "_acf_virtual_try_on_wardrobe_list_v_parent_id_idx" ON "_acf_virtual_try_on_wardrobe_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_virtual_try_on_fashion_list_v_order_idx" ON "_acf_virtual_try_on_fashion_list_v" USING btree ("_order");
  CREATE INDEX "_acf_virtual_try_on_fashion_list_v_parent_id_idx" ON "_acf_virtual_try_on_fashion_list_v" USING btree ("_parent_id");
  CREATE INDEX "_acf_case_studies_banner_buttom_list_v_order_idx" ON "_acf_case_studies_banner_buttom_list_v" USING btree ("_order");
  CREATE INDEX "_acf_case_studies_banner_buttom_list_v_parent_id_idx" ON "_acf_case_studies_banner_buttom_list_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_doc_idx" ON "_pages_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_guides_id_idx" ON "_pages_v_rels" USING btree ("guides_id");
  CREATE INDEX "_pages_v_rels_cases_id_idx" ON "_pages_v_rels" USING btree ("cases_id");
  CREATE INDEX "_pages_v_rels_updates_id_idx" ON "_pages_v_rels" USING btree ("updates_id");
  CREATE INDEX "_pages_v_rels_reviews_id_idx" ON "_pages_v_rels" USING btree ("reviews_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "posts_faq_order_idx" ON "posts_faq" USING btree ("_order");
  CREATE INDEX "posts_faq_parent_id_idx" ON "posts_faq" USING btree ("_parent_id");
  CREATE INDEX "posts_featured_image_idx" ON "posts" USING btree ("featured_image_id");
  CREATE INDEX "posts_primary_category_idx" ON "posts" USING btree ("primary_category_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX "_posts_v_version_faq_order_idx" ON "_posts_v_version_faq" USING btree ("_order");
  CREATE INDEX "_posts_v_version_faq_parent_id_idx" ON "_posts_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_featured_image_idx" ON "_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_posts_v_version_version_primary_category_idx" ON "_posts_v" USING btree ("version_primary_category_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_tags_id_idx" ON "_posts_v_rels" USING btree ("tags_id");
  CREATE INDEX "guides_faq_order_idx" ON "guides_faq" USING btree ("_order");
  CREATE INDEX "guides_faq_parent_id_idx" ON "guides_faq" USING btree ("_parent_id");
  CREATE INDEX "guides_featured_image_idx" ON "guides" USING btree ("featured_image_id");
  CREATE INDEX "guides_category_idx" ON "guides" USING btree ("category_id");
  CREATE UNIQUE INDEX "guides_slug_idx" ON "guides" USING btree ("slug");
  CREATE INDEX "guides_meta_meta_image_idx" ON "guides" USING btree ("meta_image_id");
  CREATE INDEX "guides_updated_at_idx" ON "guides" USING btree ("updated_at");
  CREATE INDEX "guides_created_at_idx" ON "guides" USING btree ("created_at");
  CREATE INDEX "guides__status_idx" ON "guides" USING btree ("_status");
  CREATE INDEX "_guides_v_version_faq_order_idx" ON "_guides_v_version_faq" USING btree ("_order");
  CREATE INDEX "_guides_v_version_faq_parent_id_idx" ON "_guides_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_guides_v_parent_idx" ON "_guides_v" USING btree ("parent_id");
  CREATE INDEX "_guides_v_version_version_featured_image_idx" ON "_guides_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_guides_v_version_version_category_idx" ON "_guides_v" USING btree ("version_category_id");
  CREATE INDEX "_guides_v_version_version_slug_idx" ON "_guides_v" USING btree ("version_slug");
  CREATE INDEX "_guides_v_version_meta_version_meta_image_idx" ON "_guides_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_guides_v_version_version_updated_at_idx" ON "_guides_v" USING btree ("version_updated_at");
  CREATE INDEX "_guides_v_version_version_created_at_idx" ON "_guides_v" USING btree ("version_created_at");
  CREATE INDEX "_guides_v_version_version__status_idx" ON "_guides_v" USING btree ("version__status");
  CREATE INDEX "_guides_v_created_at_idx" ON "_guides_v" USING btree ("created_at");
  CREATE INDEX "_guides_v_updated_at_idx" ON "_guides_v" USING btree ("updated_at");
  CREATE INDEX "_guides_v_latest_idx" ON "_guides_v" USING btree ("latest");
  CREATE INDEX "_guides_v_autosave_idx" ON "_guides_v" USING btree ("autosave");
  CREATE INDEX "cases_study_top_order_idx" ON "cases_study_top" USING btree ("_order");
  CREATE INDEX "cases_study_top_parent_id_idx" ON "cases_study_top" USING btree ("_parent_id");
  CREATE INDEX "cases_metrics_order_idx" ON "cases_metrics" USING btree ("_order");
  CREATE INDEX "cases_metrics_parent_id_idx" ON "cases_metrics" USING btree ("_parent_id");
  CREATE INDEX "cases_faq_order_idx" ON "cases_faq" USING btree ("_order");
  CREATE INDEX "cases_faq_parent_id_idx" ON "cases_faq" USING btree ("_parent_id");
  CREATE INDEX "cases_featured_image_idx" ON "cases" USING btree ("featured_image_id");
  CREATE INDEX "cases_category_idx" ON "cases" USING btree ("category_id");
  CREATE UNIQUE INDEX "cases_slug_idx" ON "cases" USING btree ("slug");
  CREATE INDEX "cases_meta_meta_image_idx" ON "cases" USING btree ("meta_image_id");
  CREATE INDEX "cases_updated_at_idx" ON "cases" USING btree ("updated_at");
  CREATE INDEX "cases_created_at_idx" ON "cases" USING btree ("created_at");
  CREATE INDEX "cases__status_idx" ON "cases" USING btree ("_status");
  CREATE INDEX "_cases_v_version_study_top_order_idx" ON "_cases_v_version_study_top" USING btree ("_order");
  CREATE INDEX "_cases_v_version_study_top_parent_id_idx" ON "_cases_v_version_study_top" USING btree ("_parent_id");
  CREATE INDEX "_cases_v_version_metrics_order_idx" ON "_cases_v_version_metrics" USING btree ("_order");
  CREATE INDEX "_cases_v_version_metrics_parent_id_idx" ON "_cases_v_version_metrics" USING btree ("_parent_id");
  CREATE INDEX "_cases_v_version_faq_order_idx" ON "_cases_v_version_faq" USING btree ("_order");
  CREATE INDEX "_cases_v_version_faq_parent_id_idx" ON "_cases_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_cases_v_parent_idx" ON "_cases_v" USING btree ("parent_id");
  CREATE INDEX "_cases_v_version_version_featured_image_idx" ON "_cases_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_cases_v_version_version_category_idx" ON "_cases_v" USING btree ("version_category_id");
  CREATE INDEX "_cases_v_version_version_slug_idx" ON "_cases_v" USING btree ("version_slug");
  CREATE INDEX "_cases_v_version_meta_version_meta_image_idx" ON "_cases_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_cases_v_version_version_updated_at_idx" ON "_cases_v" USING btree ("version_updated_at");
  CREATE INDEX "_cases_v_version_version_created_at_idx" ON "_cases_v" USING btree ("version_created_at");
  CREATE INDEX "_cases_v_version_version__status_idx" ON "_cases_v" USING btree ("version__status");
  CREATE INDEX "_cases_v_created_at_idx" ON "_cases_v" USING btree ("created_at");
  CREATE INDEX "_cases_v_updated_at_idx" ON "_cases_v" USING btree ("updated_at");
  CREATE INDEX "_cases_v_latest_idx" ON "_cases_v" USING btree ("latest");
  CREATE INDEX "_cases_v_autosave_idx" ON "_cases_v" USING btree ("autosave");
  CREATE INDEX "updates_category_idx" ON "updates" USING btree ("category_id");
  CREATE UNIQUE INDEX "updates_slug_idx" ON "updates" USING btree ("slug");
  CREATE INDEX "updates_meta_meta_image_idx" ON "updates" USING btree ("meta_image_id");
  CREATE INDEX "updates_updated_at_idx" ON "updates" USING btree ("updated_at");
  CREATE INDEX "updates_created_at_idx" ON "updates" USING btree ("created_at");
  CREATE INDEX "updates__status_idx" ON "updates" USING btree ("_status");
  CREATE INDEX "_updates_v_parent_idx" ON "_updates_v" USING btree ("parent_id");
  CREATE INDEX "_updates_v_version_version_category_idx" ON "_updates_v" USING btree ("version_category_id");
  CREATE INDEX "_updates_v_version_version_slug_idx" ON "_updates_v" USING btree ("version_slug");
  CREATE INDEX "_updates_v_version_meta_version_meta_image_idx" ON "_updates_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_updates_v_version_version_updated_at_idx" ON "_updates_v" USING btree ("version_updated_at");
  CREATE INDEX "_updates_v_version_version_created_at_idx" ON "_updates_v" USING btree ("version_created_at");
  CREATE INDEX "_updates_v_version_version__status_idx" ON "_updates_v" USING btree ("version__status");
  CREATE INDEX "_updates_v_created_at_idx" ON "_updates_v" USING btree ("created_at");
  CREATE INDEX "_updates_v_updated_at_idx" ON "_updates_v" USING btree ("updated_at");
  CREATE INDEX "_updates_v_latest_idx" ON "_updates_v" USING btree ("latest");
  CREATE INDEX "_updates_v_autosave_idx" ON "_updates_v" USING btree ("autosave");
  CREATE INDEX "reviews_made_for_you_items_order_idx" ON "reviews_made_for_you_items" USING btree ("_order");
  CREATE INDEX "reviews_made_for_you_items_parent_id_idx" ON "reviews_made_for_you_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "reviews_slug_idx" ON "reviews" USING btree ("slug");
  CREATE INDEX "reviews_meta_meta_image_idx" ON "reviews" USING btree ("meta_image_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE INDEX "reviews__status_idx" ON "reviews" USING btree ("_status");
  CREATE INDEX "_reviews_v_version_made_for_you_items_order_idx" ON "_reviews_v_version_made_for_you_items" USING btree ("_order");
  CREATE INDEX "_reviews_v_version_made_for_you_items_parent_id_idx" ON "_reviews_v_version_made_for_you_items" USING btree ("_parent_id");
  CREATE INDEX "_reviews_v_parent_idx" ON "_reviews_v" USING btree ("parent_id");
  CREATE INDEX "_reviews_v_version_version_slug_idx" ON "_reviews_v" USING btree ("version_slug");
  CREATE INDEX "_reviews_v_version_meta_version_meta_image_idx" ON "_reviews_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_reviews_v_version_version_updated_at_idx" ON "_reviews_v" USING btree ("version_updated_at");
  CREATE INDEX "_reviews_v_version_version_created_at_idx" ON "_reviews_v" USING btree ("version_created_at");
  CREATE INDEX "_reviews_v_version_version__status_idx" ON "_reviews_v" USING btree ("version__status");
  CREATE INDEX "_reviews_v_created_at_idx" ON "_reviews_v" USING btree ("created_at");
  CREATE INDEX "_reviews_v_updated_at_idx" ON "_reviews_v" USING btree ("updated_at");
  CREATE INDEX "_reviews_v_latest_idx" ON "_reviews_v" USING btree ("latest");
  CREATE INDEX "_reviews_v_autosave_idx" ON "_reviews_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_meta_meta_image_idx" ON "categories" USING btree ("meta_image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_meta_meta_image_idx" ON "tags" USING btree ("meta_image_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "section_categories_slug_idx" ON "section_categories" USING btree ("slug");
  CREATE INDEX "section_categories_meta_meta_image_idx" ON "section_categories" USING btree ("meta_image_id");
  CREATE INDEX "section_categories_updated_at_idx" ON "section_categories" USING btree ("updated_at");
  CREATE INDEX "section_categories_created_at_idx" ON "section_categories" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "redirects_rels_guides_id_idx" ON "redirects_rels" USING btree ("guides_id");
  CREATE INDEX "redirects_rels_cases_id_idx" ON "redirects_rels" USING btree ("cases_id");
  CREATE INDEX "redirects_rels_updates_id_idx" ON "redirects_rels" USING btree ("updates_id");
  CREATE INDEX "redirects_rels_reviews_id_idx" ON "redirects_rels" USING btree ("reviews_id");
  CREATE INDEX "redirects_rels_categories_id_idx" ON "redirects_rels" USING btree ("categories_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_guides_id_idx" ON "payload_locked_documents_rels" USING btree ("guides_id");
  CREATE INDEX "payload_locked_documents_rels_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("cases_id");
  CREATE INDEX "payload_locked_documents_rels_updates_id_idx" ON "payload_locked_documents_rels" USING btree ("updates_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_section_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("section_categories_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "navigation_header_children_order_idx" ON "navigation_header_children" USING btree ("_order");
  CREATE INDEX "navigation_header_children_parent_id_idx" ON "navigation_header_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_order_idx" ON "navigation_header" USING btree ("_order");
  CREATE INDEX "navigation_header_parent_id_idx" ON "navigation_header" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_links_order_idx" ON "navigation_footer_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_links_parent_id_idx" ON "navigation_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "navigation_legal_links_order_idx" ON "navigation_legal_links" USING btree ("_order");
  CREATE INDEX "navigation_legal_links_parent_id_idx" ON "navigation_legal_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_rels_order_idx" ON "navigation_rels" USING btree ("order");
  CREATE INDEX "navigation_rels_parent_idx" ON "navigation_rels" USING btree ("parent_id");
  CREATE INDEX "navigation_rels_path_idx" ON "navigation_rels" USING btree ("path");
  CREATE INDEX "navigation_rels_pages_id_idx" ON "navigation_rels" USING btree ("pages_id");
  CREATE INDEX "navigation_rels_posts_id_idx" ON "navigation_rels" USING btree ("posts_id");
  CREATE INDEX "navigation_rels_guides_id_idx" ON "navigation_rels" USING btree ("guides_id");
  CREATE INDEX "navigation_rels_cases_id_idx" ON "navigation_rels" USING btree ("cases_id");
  CREATE INDEX "navigation_rels_updates_id_idx" ON "navigation_rels" USING btree ("updates_id");
  CREATE INDEX "navigation_rels_reviews_id_idx" ON "navigation_rels" USING btree ("reviews_id");
  CREATE INDEX "navigation_rels_categories_id_idx" ON "navigation_rels" USING btree ("categories_id");
  CREATE INDEX "acf_social_media_order_idx" ON "acf_social_media" USING btree ("_order");
  CREATE INDEX "acf_social_media_parent_id_idx" ON "acf_social_media" USING btree ("_parent_id");
  CREATE INDEX "global_content_contact_form_idx" ON "global_content" USING btree ("contact_form_id");
  CREATE INDEX "global_content_newsletter_form_idx" ON "global_content" USING btree ("newsletter_form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_buttons" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_image_text_bullets" CASCADE;
  DROP TABLE "pages_blocks_image_text" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_items" CASCADE;
  DROP TABLE "pages_blocks_feature_grid" CASCADE;
  DROP TABLE "pages_blocks_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_steps" CASCADE;
  DROP TABLE "pages_blocks_tabs_tabs" CASCADE;
  DROP TABLE "pages_blocks_tabs" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans_features" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans" CASCADE;
  DROP TABLE "pages_blocks_pricing" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_post_feed" CASCADE;
  DROP TABLE "pages_blocks_contact_form_details" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_html" CASCADE;
  DROP TABLE "acf_accordion_list" CASCADE;
  DROP TABLE "acf_tab_images" CASCADE;
  DROP TABLE "acf_fashion_tabs" CASCADE;
  DROP TABLE "acf_guide_categories" CASCADE;
  DROP TABLE "acf_creation_list" CASCADE;
  DROP TABLE "acf_why_teams_list" CASCADE;
  DROP TABLE "acf_proof_list" CASCADE;
  DROP TABLE "acf_aiphotoshoot_list" CASCADE;
  DROP TABLE "acf_aiphotoshoot_cost_list" CASCADE;
  DROP TABLE "acf_showcase_list" CASCADE;
  DROP TABLE "acf_built_list" CASCADE;
  DROP TABLE "acf_sellers_list" CASCADE;
  DROP TABLE "acf_comparison_list" CASCADE;
  DROP TABLE "acf_math_comparison_list" CASCADE;
  DROP TABLE "acf_works_list" CASCADE;
  DROP TABLE "acf_launch_list" CASCADE;
  DROP TABLE "acf_shopify_banner_trust_pills" CASCADE;
  DROP TABLE "acf_shopper_uploads_cards" CASCADE;
  DROP TABLE "acf_shopify_the_real_problem_stat_bar" CASCADE;
  DROP TABLE "acf_shopify_the_real_problem_cards" CASCADE;
  DROP TABLE "acf_shopify_shopping_logos_items" CASCADE;
  DROP TABLE "acf_shopify_how_it_works_left_list" CASCADE;
  DROP TABLE "acf_shopify_built_for_your_catalogue_car" CASCADE;
  DROP TABLE "acf_shopify_integration_cards" CASCADE;
  DROP TABLE "acf_shopify_integration_btm_cards" CASCADE;
  DROP TABLE "acf_shopify_what_it_does_for_your_busine" CASCADE;
  DROP TABLE "acf_klaviyo_img_blk" CASCADE;
  DROP TABLE "acf_shopify_plays_well_with_your_stack_c" CASCADE;
  DROP TABLE "acf_shopify_frm_lft_trust_tags" CASCADE;
  DROP TABLE "acf_experiences_list" CASCADE;
  DROP TABLE "acf_mission_list" CASCADE;
  DROP TABLE "acf_virtual_experiences_list" CASCADE;
  DROP TABLE "acf_contact_social_media" CASCADE;
  DROP TABLE "acf_contact_locations_section_list" CASCADE;
  DROP TABLE "acf_virtual_try_on_shoppers_list" CASCADE;
  DROP TABLE "acf_virtual_try_on_business_list" CASCADE;
  DROP TABLE "acf_virtual_try_on_wardrobe_list" CASCADE;
  DROP TABLE "acf_virtual_try_on_fashion_list" CASCADE;
  DROP TABLE "acf_case_studies_banner_buttom_list" CASCADE;
  DROP TABLE "pages_breadcrumbs" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text_bullets" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_plans_features" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_plans" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_post_feed" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form_details" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_html" CASCADE;
  DROP TABLE "_acf_accordion_list_v" CASCADE;
  DROP TABLE "_acf_tab_images_v" CASCADE;
  DROP TABLE "_acf_fashion_tabs_v" CASCADE;
  DROP TABLE "_acf_guide_categories_v" CASCADE;
  DROP TABLE "_acf_creation_list_v" CASCADE;
  DROP TABLE "_acf_why_teams_list_v" CASCADE;
  DROP TABLE "_acf_proof_list_v" CASCADE;
  DROP TABLE "_acf_aiphotoshoot_list_v" CASCADE;
  DROP TABLE "_acf_aiphotoshoot_cost_list_v" CASCADE;
  DROP TABLE "_acf_showcase_list_v" CASCADE;
  DROP TABLE "_acf_built_list_v" CASCADE;
  DROP TABLE "_acf_sellers_list_v" CASCADE;
  DROP TABLE "_acf_comparison_list_v" CASCADE;
  DROP TABLE "_acf_math_comparison_list_v" CASCADE;
  DROP TABLE "_acf_works_list_v" CASCADE;
  DROP TABLE "_acf_launch_list_v" CASCADE;
  DROP TABLE "_acf_shopify_banner_trust_pills_v" CASCADE;
  DROP TABLE "_acf_shopper_uploads_cards_v" CASCADE;
  DROP TABLE "_acf_shopify_the_real_problem_stat_bar_v" CASCADE;
  DROP TABLE "_acf_shopify_the_real_problem_cards_v" CASCADE;
  DROP TABLE "_acf_shopify_shopping_logos_items_v" CASCADE;
  DROP TABLE "_acf_shopify_how_it_works_left_list_v" CASCADE;
  DROP TABLE "_acf_shopify_built_for_your_catalogue_car_v" CASCADE;
  DROP TABLE "_acf_shopify_integration_cards_v" CASCADE;
  DROP TABLE "_acf_shopify_integration_btm_cards_v" CASCADE;
  DROP TABLE "_acf_shopify_what_it_does_for_your_busine_v" CASCADE;
  DROP TABLE "_acf_klaviyo_img_blk_v" CASCADE;
  DROP TABLE "_acf_shopify_plays_well_with_your_stack_c_v" CASCADE;
  DROP TABLE "_acf_shopify_frm_lft_trust_tags_v" CASCADE;
  DROP TABLE "_acf_experiences_list_v" CASCADE;
  DROP TABLE "_acf_mission_list_v" CASCADE;
  DROP TABLE "_acf_virtual_experiences_list_v" CASCADE;
  DROP TABLE "_acf_contact_social_media_v" CASCADE;
  DROP TABLE "_acf_contact_locations_section_list_v" CASCADE;
  DROP TABLE "_acf_virtual_try_on_shoppers_list_v" CASCADE;
  DROP TABLE "_acf_virtual_try_on_business_list_v" CASCADE;
  DROP TABLE "_acf_virtual_try_on_wardrobe_list_v" CASCADE;
  DROP TABLE "_acf_virtual_try_on_fashion_list_v" CASCADE;
  DROP TABLE "_acf_case_studies_banner_buttom_list_v" CASCADE;
  DROP TABLE "_pages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts_faq" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_faq" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "guides_faq" CASCADE;
  DROP TABLE "guides" CASCADE;
  DROP TABLE "_guides_v_version_faq" CASCADE;
  DROP TABLE "_guides_v" CASCADE;
  DROP TABLE "cases_study_top" CASCADE;
  DROP TABLE "cases_metrics" CASCADE;
  DROP TABLE "cases_faq" CASCADE;
  DROP TABLE "cases" CASCADE;
  DROP TABLE "_cases_v_version_study_top" CASCADE;
  DROP TABLE "_cases_v_version_metrics" CASCADE;
  DROP TABLE "_cases_v_version_faq" CASCADE;
  DROP TABLE "_cases_v" CASCADE;
  DROP TABLE "updates" CASCADE;
  DROP TABLE "_updates_v" CASCADE;
  DROP TABLE "reviews_made_for_you_items" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "_reviews_v_version_made_for_you_items" CASCADE;
  DROP TABLE "_reviews_v" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "section_categories" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_header_children" CASCADE;
  DROP TABLE "navigation_header" CASCADE;
  DROP TABLE "navigation_footer_columns_links" CASCADE;
  DROP TABLE "navigation_footer_columns" CASCADE;
  DROP TABLE "navigation_legal_links" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_rels" CASCADE;
  DROP TABLE "acf_social_media" CASCADE;
  DROP TABLE "global_content" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_hero_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_hero_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_hero_align";
  DROP TYPE "public"."enum_pages_blocks_rich_text_width";
  DROP TYPE "public"."enum_pages_blocks_image_text_image_position";
  DROP TYPE "public"."enum_pages_blocks_image_text_cta_type";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_tabs_tabs_cta_type";
  DROP TYPE "public"."enum_pages_blocks_pricing_plans_cta_type";
  DROP TYPE "public"."enum_pages_blocks_cta_cta_type";
  DROP TYPE "public"."enum_pages_blocks_cta_tone";
  DROP TYPE "public"."enum_pages_blocks_post_feed_source";
  DROP TYPE "public"."enum_pages_template";
  DROP TYPE "public"."enum_pages_meta_schema_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_hero_align";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_tabs_tabs_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_plans_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_tone";
  DROP TYPE "public"."enum__pages_v_blocks_post_feed_source";
  DROP TYPE "public"."enum__pages_v_version_template";
  DROP TYPE "public"."enum__pages_v_version_meta_schema_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_posts_meta_schema_type";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_meta_schema_type";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_guides_meta_schema_type";
  DROP TYPE "public"."enum_guides_status";
  DROP TYPE "public"."enum__guides_v_version_meta_schema_type";
  DROP TYPE "public"."enum__guides_v_version_status";
  DROP TYPE "public"."enum_cases_meta_schema_type";
  DROP TYPE "public"."enum_cases_status";
  DROP TYPE "public"."enum__cases_v_version_meta_schema_type";
  DROP TYPE "public"."enum__cases_v_version_status";
  DROP TYPE "public"."enum_updates_meta_schema_type";
  DROP TYPE "public"."enum_updates_status";
  DROP TYPE "public"."enum__updates_v_version_meta_schema_type";
  DROP TYPE "public"."enum__updates_v_version_status";
  DROP TYPE "public"."enum_reviews_platform";
  DROP TYPE "public"."enum_reviews_meta_schema_type";
  DROP TYPE "public"."enum_reviews_status";
  DROP TYPE "public"."enum__reviews_v_version_platform";
  DROP TYPE "public"."enum__reviews_v_version_meta_schema_type";
  DROP TYPE "public"."enum__reviews_v_version_status";
  DROP TYPE "public"."enum_categories_meta_schema_type";
  DROP TYPE "public"."enum_tags_meta_schema_type";
  DROP TYPE "public"."enum_section_categories_kind";
  DROP TYPE "public"."enum_section_categories_meta_schema_type";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_site_settings_socials_platform";
  DROP TYPE "public"."enum_navigation_header_children_link_type";
  DROP TYPE "public"."enum_navigation_header_link_type";
  DROP TYPE "public"."enum_navigation_footer_columns_links_link_type";
  DROP TYPE "public"."enum_navigation_legal_links_link_type";
  DROP TYPE "public"."enum_navigation_header_button_type";`)
}
