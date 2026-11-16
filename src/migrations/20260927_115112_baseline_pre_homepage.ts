import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en');
  CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('default', 'centered', 'split');
  CREATE TYPE "public"."enum_pages_blocks_hero_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_rich_content_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_media_position" AS ENUM('default', 'wide', 'fullscreen');
  CREATE TYPE "public"."enum_pages_blocks_split_content_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_service_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_display_mode" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_call_to_action_variant" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum_pages_seo_schema_types" AS ENUM('Organization', 'LocalBusiness', 'Service', 'BreadcrumbList', 'Article', 'FAQPage');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('default', 'centered', 'split');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_content_width" AS ENUM('narrow', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_media_position" AS ENUM('default', 'wide', 'fullscreen');
  CREATE TYPE "public"."enum__pages_v_blocks_split_content_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_service_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_display_mode" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_call_to_action_variant" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum__pages_v_version_seo_schema_types" AS ENUM('Organization', 'LocalBusiness', 'Service', 'BreadcrumbList', 'Article', 'FAQPage');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_posts_seo_schema_types" AS ENUM('Organization', 'LocalBusiness', 'Service', 'BreadcrumbList', 'Article', 'FAQPage');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_seo_schema_types" AS ENUM('Organization', 'LocalBusiness', 'Service', 'BreadcrumbList', 'Article', 'FAQPage');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_projects_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_projects_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_projects_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_projects_blocks_media_position" AS ENUM('default', 'wide', 'fullscreen');
  CREATE TYPE "public"."enum_projects_blocks_call_to_action_variant" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum_projects_seo_schema_types" AS ENUM('Organization', 'LocalBusiness', 'Service', 'BreadcrumbList', 'Article', 'FAQPage');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__projects_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__projects_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__projects_v_blocks_media_position" AS ENUM('default', 'wide', 'fullscreen');
  CREATE TYPE "public"."enum__projects_v_blocks_call_to_action_variant" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum__projects_v_version_seo_schema_types" AS ENUM('Organization', 'LocalBusiness', 'Service', 'BreadcrumbList', 'Article', 'FAQPage');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_services_seo_schema_types" AS ENUM('Organization', 'LocalBusiness', 'Service', 'BreadcrumbList', 'Article', 'FAQPage');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_seo_schema_types" AS ENUM('Organization', 'LocalBusiness', 'Service', 'BreadcrumbList', 'Article', 'FAQPage');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_faqs_group" AS ENUM('general', 'services', 'process', 'materials-care', 'pricing-quotations');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_group" AS ENUM('general', 'services', 'process', 'materials-care', 'pricing-quotations');
  CREATE TYPE "public"."enum__faqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_leads_status_audit_from" AS ENUM('new', 'contacted', 'quotation-sent', 'won', 'lost');
  CREATE TYPE "public"."enum_leads_status_audit_to" AS ENUM('new', 'contacted', 'quotation-sent', 'won', 'lost');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'quotation-sent', 'won', 'lost');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_site_settings_locale_default_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_site_settings_locale_direction" AS ENUM('ltr');
  CREATE TYPE "public"."enum_site_settings_announcement_destination" AS ENUM('quotation', 'contact', 'projects');
  CREATE TYPE "public"."enum_site_settings_presentation_button_style" AS ENUM('solid', 'outline');
  CREATE TYPE "public"."enum_site_settings_presentation_image_shape" AS ENUM('square', 'soft', 'rounded');
  CREATE TYPE "public"."enum_header_navigation_destination" AS ENUM('home', 'services', 'projects', 'blog', 'about', 'contact');
  CREATE TYPE "public"."enum_header_conversion_actions_action" AS ENUM('quotation', 'whatsapp', 'phone');
  CREATE TYPE "public"."enum_header_conversion_actions_appearance" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_footer_navigation_groups_items_destination" AS ENUM('home', 'services', 'projects', 'blog', 'about', 'contact', 'privacy', 'terms');
  CREATE TYPE "public"."enum_footer_legal_links_legal_destination" AS ENUM('privacy', 'terms');
  CREATE TYPE "public"."enum_contact_information_opening_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_seo_defaults_local_business_schema_business_type" AS ENUM('FurnitureStore', 'LocalBusiness');
  CREATE TYPE "public"."enum_seo_defaults_local_business_schema_price_range" AS ENUM('moderate', 'premium');
  CREATE TYPE "public"."enum_social_media_links_network" AS ENUM('facebook', 'instagram', 'linkedin', 'pinterest', 'tiktok', 'x', 'youtube');
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"cta_text" varchar,
  	"cta_link" varchar,
  	"variant" "enum_pages_blocks_hero_variant" DEFAULT 'default',
  	"alignment" "enum_pages_blocks_hero_alignment" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"width" "enum_pages_blocks_rich_content_width" DEFAULT 'narrow',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"position" "enum_pages_blocks_media_position" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_split_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"media_id" integer,
  	"media_position" "enum_pages_blocks_split_content_media_position" DEFAULT 'right',
  	"cta_text" varchar,
  	"cta_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_service_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"limit" numeric DEFAULT 6,
  	"columns" "enum_pages_blocks_service_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_project_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_number" numeric,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"display_mode" "enum_pages_blocks_testimonials_display_mode" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"enable_schema" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_location_coverage_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"details" varchar
  );
  
  CREATE TABLE "pages_blocks_location_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_statistics_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"substantiation_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"button_text" varchar,
  	"button_link" varchar,
  	"variant" "enum_pages_blocks_call_to_action_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_quote_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"service_context_id" integer,
  	"form_title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_seo_schema_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_pages_seo_schema_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact',
  	"hero_rich_text" jsonb,
  	"hero_media_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"status" "enum_pages_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"seo_canonical_u_r_l" varchar,
  	"seo_open_graph_image_id" integer,
  	"seo_index" boolean DEFAULT true,
  	"seo_follow" boolean DEFAULT true,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_open_graph_title" varchar,
  	"seo_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"projects_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"cta_text" varchar,
  	"cta_link" varchar,
  	"variant" "enum__pages_v_blocks_hero_variant" DEFAULT 'default',
  	"alignment" "enum__pages_v_blocks_hero_alignment" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"width" "enum__pages_v_blocks_rich_content_width" DEFAULT 'narrow',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"position" "enum__pages_v_blocks_media_position" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"media_id" integer,
  	"media_position" "enum__pages_v_blocks_split_content_media_position" DEFAULT 'right',
  	"cta_text" varchar,
  	"cta_link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"limit" numeric DEFAULT 6,
  	"columns" "enum__pages_v_blocks_service_grid_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"limit" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step_number" numeric,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"display_mode" "enum__pages_v_blocks_testimonials_display_mode" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"enable_schema" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_location_coverage_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"details" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_location_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_statistics_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"substantiation_note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"button_text" varchar,
  	"button_link" varchar,
  	"variant" "enum__pages_v_blocks_call_to_action_variant" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_quote_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"service_context_id" integer,
  	"form_title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_seo_schema_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_version_seo_schema_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact',
  	"version_hero_rich_text" jsonb,
  	"version_hero_media_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_open_graph_image_id" integer,
  	"version_seo_index" boolean DEFAULT true,
  	"version_seo_follow" boolean DEFAULT true,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_open_graph_title" varchar,
  	"version_seo_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"projects_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "posts_seo_schema_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_posts_seo_schema_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"status" "enum_posts_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"seo_canonical_u_r_l" varchar,
  	"seo_open_graph_image_id" integer,
  	"seo_index" boolean DEFAULT true,
  	"seo_follow" boolean DEFAULT true,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"excerpt" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_open_graph_title" varchar,
  	"seo_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"categories_id" integer,
  	"services_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_posts_v_version_seo_schema_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__posts_v_version_seo_schema_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_open_graph_image_id" integer,
  	"version_seo_index" boolean DEFAULT true,
  	"version_seo_follow" boolean DEFAULT true,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_excerpt" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_open_graph_title" varchar,
  	"version_seo_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"categories_id" integer,
  	"services_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "projects_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_projects_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_projects_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_projects_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "projects_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"position" "enum_projects_blocks_media_position" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"button_text" varchar,
  	"button_link" varchar,
  	"variant" "enum_projects_blocks_call_to_action_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_seo_schema_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projects_seo_schema_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"cover_id" integer,
  	"service_id" integer,
  	"category_id" integer,
  	"location" varchar,
  	"completion_date" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"status" "enum_projects_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"seo_canonical_u_r_l" varchar,
  	"seo_open_graph_image_id" integer,
  	"seo_index" boolean DEFAULT true,
  	"seo_follow" boolean DEFAULT true,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"summary" varchar,
  	"completion_details" varchar,
  	"challenge" varchar,
  	"solution" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_open_graph_title" varchar,
  	"seo_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__projects_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__projects_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__projects_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"position" "enum__projects_v_blocks_media_position" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"button_text" varchar,
  	"button_link" varchar,
  	"variant" "enum__projects_v_blocks_call_to_action_variant" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_version_seo_schema_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__projects_v_version_seo_schema_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_cover_id" integer,
  	"version_service_id" integer,
  	"version_category_id" integer,
  	"version_location" varchar,
  	"version_completion_date" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_open_graph_image_id" integer,
  	"version_seo_index" boolean DEFAULT true,
  	"version_seo_follow" boolean DEFAULT true,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_summary" varchar,
  	"version_completion_details" varchar,
  	"version_challenge" varchar,
  	"version_solution" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_open_graph_title" varchar,
  	"version_seo_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "services_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "services_materials_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "services_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "services_service_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"area" varchar
  );
  
  CREATE TABLE "services_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "services_seo_schema_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_services_seo_schema_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"hero_image_id" integer,
  	"status" "enum_services_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"seo_canonical_u_r_l" varchar,
  	"seo_open_graph_image_id" integer,
  	"seo_index" boolean DEFAULT true,
  	"seo_follow" boolean DEFAULT true,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_locales" (
  	"summary" varchar,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_copy" varchar,
  	"details" jsonb,
  	"quotation_context_heading" varchar,
  	"quotation_context_message" varchar,
  	"whats_app_context_label" varchar,
  	"whats_app_context_message" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_open_graph_title" varchar,
  	"seo_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"faqs_id" integer,
  	"projects_id" integer,
  	"testimonials_id" integer,
  	"services_id" integer
  );
  
  CREATE TABLE "_services_v_version_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_materials_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_service_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"area" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_seo_schema_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__services_v_version_seo_schema_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_hero_image_id" integer,
  	"version_status" "enum__services_v_version_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_open_graph_image_id" integer,
  	"version_seo_index" boolean DEFAULT true,
  	"version_seo_follow" boolean DEFAULT true,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__services_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_services_v_locales" (
  	"version_summary" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_copy" varchar,
  	"version_details" jsonb,
  	"version_quotation_context_heading" varchar,
  	"version_quotation_context_message" varchar,
  	"version_whats_app_context_label" varchar,
  	"version_whats_app_context_message" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_open_graph_title" varchar,
  	"version_seo_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"faqs_id" integer,
  	"projects_id" integer,
  	"testimonials_id" integer,
  	"services_id" integer
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"group" "enum_faqs_group" DEFAULT 'general',
  	"order" numeric DEFAULT 0,
  	"schema_eligible" boolean DEFAULT false,
  	"status" "enum_faqs_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faqs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_faqs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_group" "enum__faqs_v_version_group" DEFAULT 'general',
  	"version_order" numeric DEFAULT 0,
  	"version_schema_eligible" boolean DEFAULT false,
  	"version_status" "enum__faqs_v_version_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faqs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__faqs_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_faqs_v_locales" (
  	"version_question" varchar,
  	"version_answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_faqs_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"display_name" varchar,
  	"rating" numeric,
  	"location" varchar,
  	"service_id" integer,
  	"project_id" integer,
  	"featured" boolean DEFAULT false,
  	"verification_note" varchar,
  	"verified_at" timestamp(3) with time zone,
  	"status" "enum_testimonials_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "testimonials_locales" (
  	"statement" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_display_name" varchar,
  	"version_rating" numeric,
  	"version_location" varchar,
  	"version_service_id" integer,
  	"version_project_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_verification_note" varchar,
  	"version_verified_at" timestamp(3) with time zone,
  	"version_status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__testimonials_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_testimonials_v_locales" (
  	"version_statement" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "leads_status_audit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" "enum_leads_status_audit_from" NOT NULL,
  	"to" "enum_leads_status_audit_to" NOT NULL,
  	"changed_at" timestamp(3) with time zone NOT NULL,
  	"changed_by_id" integer NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"service_id" integer NOT NULL,
  	"message" varchar NOT NULL,
  	"reference_media_id" integer,
  	"consent" boolean DEFAULT false NOT NULL,
  	"consent_at" timestamp(3) with time zone NOT NULL,
  	"source_path" varchar NOT NULL,
  	"source_title" varchar NOT NULL,
  	"project_context" varchar,
  	"referrer" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"utm_term" varchar,
  	"utm_content" varchar,
  	"status" "enum_leads_status" DEFAULT 'new' NOT NULL,
  	"submitted_at" timestamp(3) with time zone,
  	"status_updated_at" timestamp(3) with time zone,
  	"abuse_context_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" varchar NOT NULL,
  	"destination" varchar NOT NULL,
  	"type" numeric DEFAULT 301 NOT NULL,
  	"active" boolean DEFAULT true NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"decorative" boolean DEFAULT false NOT NULL,
  	"caption" jsonb,
  	"source_u_r_l" varchar NOT NULL,
  	"license" varchar NOT NULL,
  	"source_notes" varchar,
  	"uploaded_by_id" integer NOT NULL,
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
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"priority" numeric,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
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
  	"projects_id" integer,
  	"services_id" integer,
  	"faqs_id" integer,
  	"testimonials_id" integer,
  	"leads_id" integer,
  	"redirects_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"search_id" integer
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
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"favicon_id" integer,
  	"locale_default_locale" "enum_site_settings_locale_default_locale" DEFAULT 'en' NOT NULL,
  	"locale_direction" "enum_site_settings_locale_direction" DEFAULT 'ltr' NOT NULL,
  	"canonical_site_u_r_l" varchar NOT NULL,
  	"announcement_enabled" boolean DEFAULT false,
  	"announcement_destination" "enum_site_settings_announcement_destination",
  	"presentation_button_style" "enum_site_settings_presentation_button_style" DEFAULT 'solid',
  	"presentation_image_shape" "enum_site_settings_presentation_image_shape" DEFAULT 'soft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"business_name" varchar NOT NULL,
  	"brand_name" varchar NOT NULL,
  	"quotation_labels_primary_label" varchar,
  	"quotation_labels_form_heading" varchar,
  	"quotation_labels_submit_label" varchar,
  	"whats_app_copy_default_label" varchar,
  	"whats_app_copy_default_message" varchar,
  	"announcement_message" varchar,
  	"announcement_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"destination" "enum_header_navigation_destination" NOT NULL
  );
  
  CREATE TABLE "header_navigation_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_service_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_id" integer
  );
  
  CREATE TABLE "header_service_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_conversion_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"action" "enum_header_conversion_actions_action" NOT NULL,
  	"appearance" "enum_header_conversion_actions_appearance"
  );
  
  CREATE TABLE "header_conversion_actions_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"mobile_navigation_show_conversion_actions" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_locales" (
  	"mobile_navigation_menu_label" varchar,
  	"mobile_navigation_close_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_navigation_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"destination" "enum_footer_navigation_groups_items_destination" NOT NULL
  );
  
  CREATE TABLE "footer_navigation_groups_items_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_navigation_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_navigation_groups_locales" (
  	"heading" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_service_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_id" integer
  );
  
  CREATE TABLE "footer_service_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"legal_destination" "enum_footer_legal_links_legal_destination" NOT NULL
  );
  
  CREATE TABLE "footer_legal_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"supporting_copy" varchar,
  	"conversion_content_heading" varchar,
  	"conversion_content_copy" varchar,
  	"conversion_content_quotation_label" varchar,
  	"conversion_content_whats_app_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_information_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_contact_information_opening_hours_day" NOT NULL,
  	"closed" boolean DEFAULT false,
  	"opens" varchar,
  	"closes" varchar
  );
  
  CREATE TABLE "contact_information_opening_hours_locales" (
  	"display_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_information_service_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "contact_information_service_areas_locales" (
  	"area" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_information" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone_e164" varchar,
  	"whatsapp_e164" varchar,
  	"email" varchar,
  	"map_u_r_l" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_information_locales" (
  	"address_line1" varchar,
  	"address_line2" varchar,
  	"address_city" varchar,
  	"address_emirate" varchar,
  	"address_country" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "seo_defaults" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"social_image_id" integer,
  	"index" boolean DEFAULT true,
  	"follow" boolean DEFAULT true,
  	"organization_schema_logo_id" integer,
  	"local_business_schema_business_type" "enum_seo_defaults_local_business_schema_business_type" DEFAULT 'FurnitureStore',
  	"local_business_schema_price_range" "enum_seo_defaults_local_business_schema_price_range",
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_defaults_locales" (
  	"title_pattern" varchar,
  	"fallback_description" varchar,
  	"organization_schema_name" varchar,
  	"organization_schema_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "social_media_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"network" "enum_social_media_links_network" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "social_media_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "social_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_content" ADD CONSTRAINT "pages_blocks_rich_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media" ADD CONSTRAINT "pages_blocks_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media" ADD CONSTRAINT "pages_blocks_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_content" ADD CONSTRAINT "pages_blocks_split_content_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_content" ADD CONSTRAINT "pages_blocks_split_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_grid" ADD CONSTRAINT "pages_blocks_service_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_gallery" ADD CONSTRAINT "pages_blocks_project_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_items" ADD CONSTRAINT "pages_blocks_benefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits" ADD CONSTRAINT "pages_blocks_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_steps" ADD CONSTRAINT "pages_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps" ADD CONSTRAINT "pages_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faqs" ADD CONSTRAINT "pages_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_location_coverage_areas" ADD CONSTRAINT "pages_blocks_location_coverage_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_location_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_location_coverage" ADD CONSTRAINT "pages_blocks_location_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statistics_stats" ADD CONSTRAINT "pages_blocks_statistics_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statistics" ADD CONSTRAINT "pages_blocks_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_call_to_action" ADD CONSTRAINT "pages_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote_form" ADD CONSTRAINT "pages_blocks_quote_form_service_context_id_services_id_fk" FOREIGN KEY ("service_context_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote_form" ADD CONSTRAINT "pages_blocks_quote_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_seo_schema_types" ADD CONSTRAINT "pages_seo_schema_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD CONSTRAINT "_pages_v_blocks_rich_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media" ADD CONSTRAINT "_pages_v_blocks_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media" ADD CONSTRAINT "_pages_v_blocks_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_content" ADD CONSTRAINT "_pages_v_blocks_split_content_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_content" ADD CONSTRAINT "_pages_v_blocks_split_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_grid" ADD CONSTRAINT "_pages_v_blocks_service_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_gallery" ADD CONSTRAINT "_pages_v_blocks_project_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_items" ADD CONSTRAINT "_pages_v_blocks_benefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits" ADD CONSTRAINT "_pages_v_blocks_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faqs" ADD CONSTRAINT "_pages_v_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_location_coverage_areas" ADD CONSTRAINT "_pages_v_blocks_location_coverage_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_location_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_location_coverage" ADD CONSTRAINT "_pages_v_blocks_location_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statistics_stats" ADD CONSTRAINT "_pages_v_blocks_statistics_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statistics" ADD CONSTRAINT "_pages_v_blocks_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_call_to_action" ADD CONSTRAINT "_pages_v_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote_form" ADD CONSTRAINT "_pages_v_blocks_quote_form_service_context_id_services_id_fk" FOREIGN KEY ("service_context_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote_form" ADD CONSTRAINT "_pages_v_blocks_quote_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_seo_schema_types" ADD CONSTRAINT "_pages_v_version_seo_schema_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_seo_schema_types" ADD CONSTRAINT "posts_seo_schema_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_seo_schema_types" ADD CONSTRAINT "_posts_v_version_seo_schema_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_content_columns" ADD CONSTRAINT "projects_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_content" ADD CONSTRAINT "projects_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_media" ADD CONSTRAINT "projects_blocks_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_media" ADD CONSTRAINT "projects_blocks_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_call_to_action" ADD CONSTRAINT "projects_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_seo_schema_types" ADD CONSTRAINT "projects_seo_schema_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_content_columns" ADD CONSTRAINT "_projects_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_content" ADD CONSTRAINT "_projects_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_media" ADD CONSTRAINT "_projects_v_blocks_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_media" ADD CONSTRAINT "_projects_v_blocks_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_call_to_action" ADD CONSTRAINT "_projects_v_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_seo_schema_types" ADD CONSTRAINT "_projects_v_version_seo_schema_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_service_id_services_id_fk" FOREIGN KEY ("version_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_benefits" ADD CONSTRAINT "services_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_materials_capabilities" ADD CONSTRAINT "services_materials_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_process" ADD CONSTRAINT "services_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_service_areas" ADD CONSTRAINT "services_service_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_gallery" ADD CONSTRAINT "services_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_gallery" ADD CONSTRAINT "services_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_seo_schema_types" ADD CONSTRAINT "services_seo_schema_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_benefits" ADD CONSTRAINT "_services_v_version_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_materials_capabilities" ADD CONSTRAINT "_services_v_version_materials_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_process" ADD CONSTRAINT "_services_v_version_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_service_areas" ADD CONSTRAINT "_services_v_version_service_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_gallery" ADD CONSTRAINT "_services_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_version_gallery" ADD CONSTRAINT "_services_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_seo_schema_types" ADD CONSTRAINT "_services_v_version_seo_schema_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_rels" ADD CONSTRAINT "faqs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_rels" ADD CONSTRAINT "faqs_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v_locales" ADD CONSTRAINT "_faqs_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_rels" ADD CONSTRAINT "_faqs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_rels" ADD CONSTRAINT "_faqs_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_service_id_services_id_fk" FOREIGN KEY ("version_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_project_id_projects_id_fk" FOREIGN KEY ("version_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v_locales" ADD CONSTRAINT "_testimonials_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_status_audit" ADD CONSTRAINT "leads_status_audit_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads_status_audit" ADD CONSTRAINT "leads_status_audit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_reference_media_id_media_id_fk" FOREIGN KEY ("reference_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navigation" ADD CONSTRAINT "header_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navigation_locales" ADD CONSTRAINT "header_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_service_links" ADD CONSTRAINT "header_service_links_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_service_links" ADD CONSTRAINT "header_service_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_service_links_locales" ADD CONSTRAINT "header_service_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_service_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_conversion_actions" ADD CONSTRAINT "header_conversion_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_conversion_actions_locales" ADD CONSTRAINT "header_conversion_actions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_conversion_actions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation_groups_items" ADD CONSTRAINT "footer_navigation_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_navigation_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation_groups_items_locales" ADD CONSTRAINT "footer_navigation_groups_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_navigation_groups_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation_groups" ADD CONSTRAINT "footer_navigation_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation_groups_locales" ADD CONSTRAINT "footer_navigation_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_navigation_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_service_links" ADD CONSTRAINT "footer_service_links_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_service_links" ADD CONSTRAINT "footer_service_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_service_links_locales" ADD CONSTRAINT "footer_service_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_service_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links_locales" ADD CONSTRAINT "footer_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_information_opening_hours" ADD CONSTRAINT "contact_information_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_information"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_information_opening_hours_locales" ADD CONSTRAINT "contact_information_opening_hours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_information_opening_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_information_service_areas" ADD CONSTRAINT "contact_information_service_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_information"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_information_service_areas_locales" ADD CONSTRAINT "contact_information_service_areas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_information_service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_information_locales" ADD CONSTRAINT "contact_information_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_information"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_defaults" ADD CONSTRAINT "seo_defaults_social_image_id_media_id_fk" FOREIGN KEY ("social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_defaults" ADD CONSTRAINT "seo_defaults_organization_schema_logo_id_media_id_fk" FOREIGN KEY ("organization_schema_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_defaults_locales" ADD CONSTRAINT "seo_defaults_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo_defaults"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_media_links" ADD CONSTRAINT "social_media_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_media_links_locales" ADD CONSTRAINT "social_media_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_media_links"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_media_idx" ON "pages_blocks_hero" USING btree ("media_id");
  CREATE INDEX "pages_blocks_rich_content_order_idx" ON "pages_blocks_rich_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_content_parent_id_idx" ON "pages_blocks_rich_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_content_path_idx" ON "pages_blocks_rich_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_order_idx" ON "pages_blocks_media" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_parent_id_idx" ON "pages_blocks_media" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_path_idx" ON "pages_blocks_media" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_media_idx" ON "pages_blocks_media" USING btree ("media_id");
  CREATE INDEX "pages_blocks_split_content_order_idx" ON "pages_blocks_split_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_content_parent_id_idx" ON "pages_blocks_split_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_content_path_idx" ON "pages_blocks_split_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_content_media_idx" ON "pages_blocks_split_content" USING btree ("media_id");
  CREATE INDEX "pages_blocks_service_grid_order_idx" ON "pages_blocks_service_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_grid_parent_id_idx" ON "pages_blocks_service_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_grid_path_idx" ON "pages_blocks_service_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_project_gallery_order_idx" ON "pages_blocks_project_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_gallery_parent_id_idx" ON "pages_blocks_project_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_gallery_path_idx" ON "pages_blocks_project_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_benefits_items_order_idx" ON "pages_blocks_benefits_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_items_parent_id_idx" ON "pages_blocks_benefits_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_order_idx" ON "pages_blocks_benefits" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_parent_id_idx" ON "pages_blocks_benefits" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_path_idx" ON "pages_blocks_benefits" USING btree ("_path");
  CREATE INDEX "pages_blocks_process_steps_steps_order_idx" ON "pages_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_steps_parent_id_idx" ON "pages_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_order_idx" ON "pages_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_parent_id_idx" ON "pages_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_path_idx" ON "pages_blocks_process_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_faqs_order_idx" ON "pages_blocks_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faqs_parent_id_idx" ON "pages_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faqs_path_idx" ON "pages_blocks_faqs" USING btree ("_path");
  CREATE INDEX "pages_blocks_location_coverage_areas_order_idx" ON "pages_blocks_location_coverage_areas" USING btree ("_order");
  CREATE INDEX "pages_blocks_location_coverage_areas_parent_id_idx" ON "pages_blocks_location_coverage_areas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_location_coverage_order_idx" ON "pages_blocks_location_coverage" USING btree ("_order");
  CREATE INDEX "pages_blocks_location_coverage_parent_id_idx" ON "pages_blocks_location_coverage" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_location_coverage_path_idx" ON "pages_blocks_location_coverage" USING btree ("_path");
  CREATE INDEX "pages_blocks_statistics_stats_order_idx" ON "pages_blocks_statistics_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_statistics_stats_parent_id_idx" ON "pages_blocks_statistics_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statistics_order_idx" ON "pages_blocks_statistics" USING btree ("_order");
  CREATE INDEX "pages_blocks_statistics_parent_id_idx" ON "pages_blocks_statistics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statistics_path_idx" ON "pages_blocks_statistics" USING btree ("_path");
  CREATE INDEX "pages_blocks_call_to_action_order_idx" ON "pages_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "pages_blocks_call_to_action_parent_id_idx" ON "pages_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_call_to_action_path_idx" ON "pages_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "pages_blocks_quote_form_order_idx" ON "pages_blocks_quote_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_quote_form_parent_id_idx" ON "pages_blocks_quote_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quote_form_path_idx" ON "pages_blocks_quote_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_quote_form_service_context_idx" ON "pages_blocks_quote_form" USING btree ("service_context_id");
  CREATE INDEX "pages_seo_schema_types_order_idx" ON "pages_seo_schema_types" USING btree ("order");
  CREATE INDEX "pages_seo_schema_types_parent_idx" ON "pages_seo_schema_types" USING btree ("parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_status_idx" ON "pages" USING btree ("status");
  CREATE INDEX "pages_published_at_idx" ON "pages" USING btree ("published_at");
  CREATE INDEX "pages_seo_seo_open_graph_image_idx" ON "pages" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "pages_created_by_idx" ON "pages" USING btree ("created_by_id");
  CREATE INDEX "pages_updated_by_idx" ON "pages" USING btree ("updated_by_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_services_id_idx" ON "pages_rels" USING btree ("services_id");
  CREATE INDEX "pages_rels_projects_id_idx" ON "pages_rels" USING btree ("projects_id");
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id");
  CREATE INDEX "pages_rels_faqs_id_idx" ON "pages_rels" USING btree ("faqs_id");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_media_idx" ON "_pages_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_rich_content_order_idx" ON "_pages_v_blocks_rich_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_content_parent_id_idx" ON "_pages_v_blocks_rich_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_content_path_idx" ON "_pages_v_blocks_rich_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_order_idx" ON "_pages_v_blocks_media" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_parent_id_idx" ON "_pages_v_blocks_media" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_path_idx" ON "_pages_v_blocks_media" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_media_idx" ON "_pages_v_blocks_media" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_split_content_order_idx" ON "_pages_v_blocks_split_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_content_parent_id_idx" ON "_pages_v_blocks_split_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_content_path_idx" ON "_pages_v_blocks_split_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_content_media_idx" ON "_pages_v_blocks_split_content" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_service_grid_order_idx" ON "_pages_v_blocks_service_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_grid_parent_id_idx" ON "_pages_v_blocks_service_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_grid_path_idx" ON "_pages_v_blocks_service_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_project_gallery_order_idx" ON "_pages_v_blocks_project_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_gallery_parent_id_idx" ON "_pages_v_blocks_project_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_gallery_path_idx" ON "_pages_v_blocks_project_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_benefits_items_order_idx" ON "_pages_v_blocks_benefits_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_items_parent_id_idx" ON "_pages_v_blocks_benefits_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_order_idx" ON "_pages_v_blocks_benefits" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_parent_id_idx" ON "_pages_v_blocks_benefits" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_path_idx" ON "_pages_v_blocks_benefits" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_order_idx" ON "_pages_v_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_parent_id_idx" ON "_pages_v_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_order_idx" ON "_pages_v_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_parent_id_idx" ON "_pages_v_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_path_idx" ON "_pages_v_blocks_process_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faqs_order_idx" ON "_pages_v_blocks_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faqs_parent_id_idx" ON "_pages_v_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faqs_path_idx" ON "_pages_v_blocks_faqs" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_location_coverage_areas_order_idx" ON "_pages_v_blocks_location_coverage_areas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_location_coverage_areas_parent_id_idx" ON "_pages_v_blocks_location_coverage_areas" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_location_coverage_order_idx" ON "_pages_v_blocks_location_coverage" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_location_coverage_parent_id_idx" ON "_pages_v_blocks_location_coverage" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_location_coverage_path_idx" ON "_pages_v_blocks_location_coverage" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_statistics_stats_order_idx" ON "_pages_v_blocks_statistics_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_statistics_stats_parent_id_idx" ON "_pages_v_blocks_statistics_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_statistics_order_idx" ON "_pages_v_blocks_statistics" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_statistics_parent_id_idx" ON "_pages_v_blocks_statistics" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_statistics_path_idx" ON "_pages_v_blocks_statistics" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_call_to_action_order_idx" ON "_pages_v_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_call_to_action_parent_id_idx" ON "_pages_v_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_call_to_action_path_idx" ON "_pages_v_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_quote_form_order_idx" ON "_pages_v_blocks_quote_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quote_form_parent_id_idx" ON "_pages_v_blocks_quote_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quote_form_path_idx" ON "_pages_v_blocks_quote_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_quote_form_service_context_idx" ON "_pages_v_blocks_quote_form" USING btree ("service_context_id");
  CREATE INDEX "_pages_v_version_seo_schema_types_order_idx" ON "_pages_v_version_seo_schema_types" USING btree ("order");
  CREATE INDEX "_pages_v_version_seo_schema_types_parent_idx" ON "_pages_v_version_seo_schema_types" USING btree ("parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_status_idx" ON "_pages_v" USING btree ("version_status");
  CREATE INDEX "_pages_v_version_version_published_at_idx" ON "_pages_v" USING btree ("version_published_at");
  CREATE INDEX "_pages_v_version_seo_version_seo_open_graph_image_idx" ON "_pages_v" USING btree ("version_seo_open_graph_image_id");
  CREATE INDEX "_pages_v_version_version_created_by_idx" ON "_pages_v" USING btree ("version_created_by_id");
  CREATE INDEX "_pages_v_version_version_updated_by_idx" ON "_pages_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "_pages_v_rels" USING btree ("services_id");
  CREATE INDEX "_pages_v_rels_projects_id_idx" ON "_pages_v_rels" USING btree ("projects_id");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "_pages_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "_pages_v_rels_faqs_id_idx" ON "_pages_v_rels" USING btree ("faqs_id");
  CREATE INDEX "posts_seo_schema_types_order_idx" ON "posts_seo_schema_types" USING btree ("order");
  CREATE INDEX "posts_seo_schema_types_parent_idx" ON "posts_seo_schema_types" USING btree ("parent_id");
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_status_idx" ON "posts" USING btree ("status");
  CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "posts_seo_seo_open_graph_image_idx" ON "posts" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "posts_created_by_idx" ON "posts" USING btree ("created_by_id");
  CREATE INDEX "posts_updated_by_idx" ON "posts" USING btree ("updated_by_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_services_id_idx" ON "posts_rels" USING btree ("services_id");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_version_seo_schema_types_order_idx" ON "_posts_v_version_seo_schema_types" USING btree ("order");
  CREATE INDEX "_posts_v_version_seo_schema_types_parent_idx" ON "_posts_v_version_seo_schema_types" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_status_idx" ON "_posts_v" USING btree ("version_status");
  CREATE INDEX "_posts_v_version_version_published_at_idx" ON "_posts_v" USING btree ("version_published_at");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_open_graph_image_idx" ON "_posts_v" USING btree ("version_seo_open_graph_image_id");
  CREATE INDEX "_posts_v_version_version_created_by_idx" ON "_posts_v" USING btree ("version_created_by_id");
  CREATE INDEX "_posts_v_version_version_updated_by_idx" ON "_posts_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_services_id_idx" ON "_posts_v_rels" USING btree ("services_id");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE INDEX "projects_blocks_content_columns_order_idx" ON "projects_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "projects_blocks_content_columns_parent_id_idx" ON "projects_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_content_order_idx" ON "projects_blocks_content" USING btree ("_order");
  CREATE INDEX "projects_blocks_content_parent_id_idx" ON "projects_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_content_path_idx" ON "projects_blocks_content" USING btree ("_path");
  CREATE INDEX "projects_blocks_media_order_idx" ON "projects_blocks_media" USING btree ("_order");
  CREATE INDEX "projects_blocks_media_parent_id_idx" ON "projects_blocks_media" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_media_path_idx" ON "projects_blocks_media" USING btree ("_path");
  CREATE INDEX "projects_blocks_media_media_idx" ON "projects_blocks_media" USING btree ("media_id");
  CREATE INDEX "projects_blocks_call_to_action_order_idx" ON "projects_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "projects_blocks_call_to_action_parent_id_idx" ON "projects_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_call_to_action_path_idx" ON "projects_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "projects_seo_schema_types_order_idx" ON "projects_seo_schema_types" USING btree ("order");
  CREATE INDEX "projects_seo_schema_types_parent_idx" ON "projects_seo_schema_types" USING btree ("parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_service_idx" ON "projects" USING btree ("service_id");
  CREATE INDEX "projects_category_idx" ON "projects" USING btree ("category_id");
  CREATE INDEX "projects_featured_idx" ON "projects" USING btree ("featured");
  CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");
  CREATE INDEX "projects_published_at_idx" ON "projects" USING btree ("published_at");
  CREATE INDEX "projects_seo_seo_open_graph_image_idx" ON "projects" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "projects_created_by_idx" ON "projects" USING btree ("created_by_id");
  CREATE INDEX "projects_updated_by_idx" ON "projects" USING btree ("updated_by_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_pages_id_idx" ON "projects_rels" USING btree ("pages_id");
  CREATE INDEX "projects_rels_posts_id_idx" ON "projects_rels" USING btree ("posts_id");
  CREATE INDEX "_projects_v_version_gallery_order_idx" ON "_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_version_gallery_parent_id_idx" ON "_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_image_idx" ON "_projects_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_projects_v_blocks_content_columns_order_idx" ON "_projects_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_content_columns_parent_id_idx" ON "_projects_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_content_order_idx" ON "_projects_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_content_parent_id_idx" ON "_projects_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_content_path_idx" ON "_projects_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_media_order_idx" ON "_projects_v_blocks_media" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_media_parent_id_idx" ON "_projects_v_blocks_media" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_media_path_idx" ON "_projects_v_blocks_media" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_media_media_idx" ON "_projects_v_blocks_media" USING btree ("media_id");
  CREATE INDEX "_projects_v_blocks_call_to_action_order_idx" ON "_projects_v_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_call_to_action_parent_id_idx" ON "_projects_v_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_call_to_action_path_idx" ON "_projects_v_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "_projects_v_version_seo_schema_types_order_idx" ON "_projects_v_version_seo_schema_types" USING btree ("order");
  CREATE INDEX "_projects_v_version_seo_schema_types_parent_idx" ON "_projects_v_version_seo_schema_types" USING btree ("parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_cover_idx" ON "_projects_v" USING btree ("version_cover_id");
  CREATE INDEX "_projects_v_version_version_service_idx" ON "_projects_v" USING btree ("version_service_id");
  CREATE INDEX "_projects_v_version_version_category_idx" ON "_projects_v" USING btree ("version_category_id");
  CREATE INDEX "_projects_v_version_version_featured_idx" ON "_projects_v" USING btree ("version_featured");
  CREATE INDEX "_projects_v_version_version_status_idx" ON "_projects_v" USING btree ("version_status");
  CREATE INDEX "_projects_v_version_version_published_at_idx" ON "_projects_v" USING btree ("version_published_at");
  CREATE INDEX "_projects_v_version_seo_version_seo_open_graph_image_idx" ON "_projects_v" USING btree ("version_seo_open_graph_image_id");
  CREATE INDEX "_projects_v_version_version_created_by_idx" ON "_projects_v" USING btree ("version_created_by_id");
  CREATE INDEX "_projects_v_version_version_updated_by_idx" ON "_projects_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_pages_id_idx" ON "_projects_v_rels" USING btree ("pages_id");
  CREATE INDEX "_projects_v_rels_posts_id_idx" ON "_projects_v_rels" USING btree ("posts_id");
  CREATE INDEX "services_benefits_order_idx" ON "services_benefits" USING btree ("_order");
  CREATE INDEX "services_benefits_parent_id_idx" ON "services_benefits" USING btree ("_parent_id");
  CREATE INDEX "services_materials_capabilities_order_idx" ON "services_materials_capabilities" USING btree ("_order");
  CREATE INDEX "services_materials_capabilities_parent_id_idx" ON "services_materials_capabilities" USING btree ("_parent_id");
  CREATE INDEX "services_process_order_idx" ON "services_process" USING btree ("_order");
  CREATE INDEX "services_process_parent_id_idx" ON "services_process" USING btree ("_parent_id");
  CREATE INDEX "services_service_areas_order_idx" ON "services_service_areas" USING btree ("_order");
  CREATE INDEX "services_service_areas_parent_id_idx" ON "services_service_areas" USING btree ("_parent_id");
  CREATE INDEX "services_gallery_order_idx" ON "services_gallery" USING btree ("_order");
  CREATE INDEX "services_gallery_parent_id_idx" ON "services_gallery" USING btree ("_parent_id");
  CREATE INDEX "services_gallery_image_idx" ON "services_gallery" USING btree ("image_id");
  CREATE INDEX "services_seo_schema_types_order_idx" ON "services_seo_schema_types" USING btree ("order");
  CREATE INDEX "services_seo_schema_types_parent_idx" ON "services_seo_schema_types" USING btree ("parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_hero_hero_image_idx" ON "services" USING btree ("hero_image_id");
  CREATE INDEX "services_status_idx" ON "services" USING btree ("status");
  CREATE INDEX "services_published_at_idx" ON "services" USING btree ("published_at");
  CREATE INDEX "services_seo_seo_open_graph_image_idx" ON "services" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "services_created_by_idx" ON "services" USING btree ("created_by_id");
  CREATE INDEX "services_updated_by_idx" ON "services" USING btree ("updated_by_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_faqs_id_idx" ON "services_rels" USING btree ("faqs_id");
  CREATE INDEX "services_rels_projects_id_idx" ON "services_rels" USING btree ("projects_id");
  CREATE INDEX "services_rels_testimonials_id_idx" ON "services_rels" USING btree ("testimonials_id");
  CREATE INDEX "services_rels_services_id_idx" ON "services_rels" USING btree ("services_id");
  CREATE INDEX "_services_v_version_benefits_order_idx" ON "_services_v_version_benefits" USING btree ("_order");
  CREATE INDEX "_services_v_version_benefits_parent_id_idx" ON "_services_v_version_benefits" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_materials_capabilities_order_idx" ON "_services_v_version_materials_capabilities" USING btree ("_order");
  CREATE INDEX "_services_v_version_materials_capabilities_parent_id_idx" ON "_services_v_version_materials_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_process_order_idx" ON "_services_v_version_process" USING btree ("_order");
  CREATE INDEX "_services_v_version_process_parent_id_idx" ON "_services_v_version_process" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_service_areas_order_idx" ON "_services_v_version_service_areas" USING btree ("_order");
  CREATE INDEX "_services_v_version_service_areas_parent_id_idx" ON "_services_v_version_service_areas" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_gallery_order_idx" ON "_services_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_services_v_version_gallery_parent_id_idx" ON "_services_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_gallery_image_idx" ON "_services_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_services_v_version_seo_schema_types_order_idx" ON "_services_v_version_seo_schema_types" USING btree ("order");
  CREATE INDEX "_services_v_version_seo_schema_types_parent_idx" ON "_services_v_version_seo_schema_types" USING btree ("parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_hero_version_hero_image_idx" ON "_services_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_services_v_version_version_status_idx" ON "_services_v" USING btree ("version_status");
  CREATE INDEX "_services_v_version_version_published_at_idx" ON "_services_v" USING btree ("version_published_at");
  CREATE INDEX "_services_v_version_seo_version_seo_open_graph_image_idx" ON "_services_v" USING btree ("version_seo_open_graph_image_id");
  CREATE INDEX "_services_v_version_version_created_by_idx" ON "_services_v" USING btree ("version_created_by_id");
  CREATE INDEX "_services_v_version_version_updated_by_idx" ON "_services_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_snapshot_idx" ON "_services_v" USING btree ("snapshot");
  CREATE INDEX "_services_v_published_locale_idx" ON "_services_v" USING btree ("published_locale");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_autosave_idx" ON "_services_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_services_v_locales_locale_parent_id_unique" ON "_services_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX "_services_v_rels_faqs_id_idx" ON "_services_v_rels" USING btree ("faqs_id");
  CREATE INDEX "_services_v_rels_projects_id_idx" ON "_services_v_rels" USING btree ("projects_id");
  CREATE INDEX "_services_v_rels_testimonials_id_idx" ON "_services_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "_services_v_rels_services_id_idx" ON "_services_v_rels" USING btree ("services_id");
  CREATE INDEX "faqs_order_idx" ON "faqs" USING btree ("order");
  CREATE INDEX "faqs_status_idx" ON "faqs" USING btree ("status");
  CREATE INDEX "faqs_published_at_idx" ON "faqs" USING btree ("published_at");
  CREATE INDEX "faqs_created_by_idx" ON "faqs" USING btree ("created_by_id");
  CREATE INDEX "faqs_updated_by_idx" ON "faqs" USING btree ("updated_by_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs__status_idx" ON "faqs" USING btree ("_status");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_rels_order_idx" ON "faqs_rels" USING btree ("order");
  CREATE INDEX "faqs_rels_parent_idx" ON "faqs_rels" USING btree ("parent_id");
  CREATE INDEX "faqs_rels_path_idx" ON "faqs_rels" USING btree ("path");
  CREATE INDEX "faqs_rels_services_id_idx" ON "faqs_rels" USING btree ("services_id");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_order_idx" ON "_faqs_v" USING btree ("version_order");
  CREATE INDEX "_faqs_v_version_version_status_idx" ON "_faqs_v" USING btree ("version_status");
  CREATE INDEX "_faqs_v_version_version_published_at_idx" ON "_faqs_v" USING btree ("version_published_at");
  CREATE INDEX "_faqs_v_version_version_created_by_idx" ON "_faqs_v" USING btree ("version_created_by_id");
  CREATE INDEX "_faqs_v_version_version_updated_by_idx" ON "_faqs_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_version_version__status_idx" ON "_faqs_v" USING btree ("version__status");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_snapshot_idx" ON "_faqs_v" USING btree ("snapshot");
  CREATE INDEX "_faqs_v_published_locale_idx" ON "_faqs_v" USING btree ("published_locale");
  CREATE INDEX "_faqs_v_latest_idx" ON "_faqs_v" USING btree ("latest");
  CREATE INDEX "_faqs_v_autosave_idx" ON "_faqs_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_faqs_v_locales_locale_parent_id_unique" ON "_faqs_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_faqs_v_rels_order_idx" ON "_faqs_v_rels" USING btree ("order");
  CREATE INDEX "_faqs_v_rels_parent_idx" ON "_faqs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_rels_path_idx" ON "_faqs_v_rels" USING btree ("path");
  CREATE INDEX "_faqs_v_rels_services_id_idx" ON "_faqs_v_rels" USING btree ("services_id");
  CREATE INDEX "testimonials_service_idx" ON "testimonials" USING btree ("service_id");
  CREATE INDEX "testimonials_project_idx" ON "testimonials" USING btree ("project_id");
  CREATE INDEX "testimonials_featured_idx" ON "testimonials" USING btree ("featured");
  CREATE INDEX "testimonials_status_idx" ON "testimonials" USING btree ("status");
  CREATE INDEX "testimonials_published_at_idx" ON "testimonials" USING btree ("published_at");
  CREATE INDEX "testimonials_created_by_idx" ON "testimonials" USING btree ("created_by_id");
  CREATE INDEX "testimonials_updated_by_idx" ON "testimonials" USING btree ("updated_by_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_service_idx" ON "_testimonials_v" USING btree ("version_service_id");
  CREATE INDEX "_testimonials_v_version_version_project_idx" ON "_testimonials_v" USING btree ("version_project_id");
  CREATE INDEX "_testimonials_v_version_version_featured_idx" ON "_testimonials_v" USING btree ("version_featured");
  CREATE INDEX "_testimonials_v_version_version_status_idx" ON "_testimonials_v" USING btree ("version_status");
  CREATE INDEX "_testimonials_v_version_version_published_at_idx" ON "_testimonials_v" USING btree ("version_published_at");
  CREATE INDEX "_testimonials_v_version_version_created_by_idx" ON "_testimonials_v" USING btree ("version_created_by_id");
  CREATE INDEX "_testimonials_v_version_version_updated_by_idx" ON "_testimonials_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_snapshot_idx" ON "_testimonials_v" USING btree ("snapshot");
  CREATE INDEX "_testimonials_v_published_locale_idx" ON "_testimonials_v" USING btree ("published_locale");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "_testimonials_v_autosave_idx" ON "_testimonials_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_testimonials_v_locales_locale_parent_id_unique" ON "_testimonials_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "leads_status_audit_order_idx" ON "leads_status_audit" USING btree ("_order");
  CREATE INDEX "leads_status_audit_parent_id_idx" ON "leads_status_audit" USING btree ("_parent_id");
  CREATE INDEX "leads_status_audit_changed_by_idx" ON "leads_status_audit" USING btree ("changed_by_id");
  CREATE INDEX "leads_service_idx" ON "leads" USING btree ("service_id");
  CREATE INDEX "leads_reference_media_idx" ON "leads" USING btree ("reference_media_id");
  CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");
  CREATE INDEX "leads_submitted_at_idx" ON "leads" USING btree ("submitted_at");
  CREATE INDEX "leads_status_updated_at_idx" ON "leads" USING btree ("status_updated_at");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "redirects_source_idx" ON "redirects" USING btree ("source");
  CREATE INDEX "redirects_active_idx" ON "redirects" USING btree ("active");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_active_source_unique" ON "redirects" USING btree ("source") WHERE "redirects"."active" = true;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_uploaded_by_idx" ON "media" USING btree ("uploaded_by_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "categories_title_idx" ON "categories" USING btree ("title");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
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
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_dark_idx" ON "site_settings" USING btree ("logo_dark_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_navigation_order_idx" ON "header_navigation" USING btree ("_order");
  CREATE INDEX "header_navigation_parent_id_idx" ON "header_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_navigation_locales_locale_parent_id_unique" ON "header_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_service_links_order_idx" ON "header_service_links" USING btree ("_order");
  CREATE INDEX "header_service_links_parent_id_idx" ON "header_service_links" USING btree ("_parent_id");
  CREATE INDEX "header_service_links_service_idx" ON "header_service_links" USING btree ("service_id");
  CREATE UNIQUE INDEX "header_service_links_locales_locale_parent_id_unique" ON "header_service_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_conversion_actions_order_idx" ON "header_conversion_actions" USING btree ("_order");
  CREATE INDEX "header_conversion_actions_parent_id_idx" ON "header_conversion_actions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_conversion_actions_locales_locale_parent_id_unique" ON "header_conversion_actions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_navigation_groups_items_order_idx" ON "footer_navigation_groups_items" USING btree ("_order");
  CREATE INDEX "footer_navigation_groups_items_parent_id_idx" ON "footer_navigation_groups_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_navigation_groups_items_locales_locale_parent_id_uniq" ON "footer_navigation_groups_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_navigation_groups_order_idx" ON "footer_navigation_groups" USING btree ("_order");
  CREATE INDEX "footer_navigation_groups_parent_id_idx" ON "footer_navigation_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_navigation_groups_locales_locale_parent_id_unique" ON "footer_navigation_groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_service_links_order_idx" ON "footer_service_links" USING btree ("_order");
  CREATE INDEX "footer_service_links_parent_id_idx" ON "footer_service_links" USING btree ("_parent_id");
  CREATE INDEX "footer_service_links_service_idx" ON "footer_service_links" USING btree ("service_id");
  CREATE UNIQUE INDEX "footer_service_links_locales_locale_parent_id_unique" ON "footer_service_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_legal_links_locales_locale_parent_id_unique" ON "footer_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_information_opening_hours_order_idx" ON "contact_information_opening_hours" USING btree ("_order");
  CREATE INDEX "contact_information_opening_hours_parent_id_idx" ON "contact_information_opening_hours" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contact_information_opening_hours_locales_locale_parent_id_u" ON "contact_information_opening_hours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_information_service_areas_order_idx" ON "contact_information_service_areas" USING btree ("_order");
  CREATE INDEX "contact_information_service_areas_parent_id_idx" ON "contact_information_service_areas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contact_information_service_areas_locales_locale_parent_id_u" ON "contact_information_service_areas_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_information_locales_locale_parent_id_unique" ON "contact_information_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "seo_defaults_social_image_idx" ON "seo_defaults" USING btree ("social_image_id");
  CREATE INDEX "seo_defaults_organization_schema_organization_schema_log_idx" ON "seo_defaults" USING btree ("organization_schema_logo_id");
  CREATE UNIQUE INDEX "seo_defaults_locales_locale_parent_id_unique" ON "seo_defaults_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "social_media_links_order_idx" ON "social_media_links" USING btree ("_order");
  CREATE INDEX "social_media_links_parent_id_idx" ON "social_media_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "social_media_links_locales_locale_parent_id_unique" ON "social_media_links_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_rich_content" CASCADE;
  DROP TABLE "pages_blocks_media" CASCADE;
  DROP TABLE "pages_blocks_split_content" CASCADE;
  DROP TABLE "pages_blocks_service_grid" CASCADE;
  DROP TABLE "pages_blocks_project_gallery" CASCADE;
  DROP TABLE "pages_blocks_benefits_items" CASCADE;
  DROP TABLE "pages_blocks_benefits" CASCADE;
  DROP TABLE "pages_blocks_process_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_process_steps" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_faqs" CASCADE;
  DROP TABLE "pages_blocks_location_coverage_areas" CASCADE;
  DROP TABLE "pages_blocks_location_coverage" CASCADE;
  DROP TABLE "pages_blocks_statistics_stats" CASCADE;
  DROP TABLE "pages_blocks_statistics" CASCADE;
  DROP TABLE "pages_blocks_call_to_action" CASCADE;
  DROP TABLE "pages_blocks_quote_form" CASCADE;
  DROP TABLE "pages_seo_schema_types" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media" CASCADE;
  DROP TABLE "_pages_v_blocks_split_content" CASCADE;
  DROP TABLE "_pages_v_blocks_service_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_project_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits_items" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_faqs" CASCADE;
  DROP TABLE "_pages_v_blocks_location_coverage_areas" CASCADE;
  DROP TABLE "_pages_v_blocks_location_coverage" CASCADE;
  DROP TABLE "_pages_v_blocks_statistics_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_statistics" CASCADE;
  DROP TABLE "_pages_v_blocks_call_to_action" CASCADE;
  DROP TABLE "_pages_v_blocks_quote_form" CASCADE;
  DROP TABLE "_pages_v_version_seo_schema_types" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts_seo_schema_types" CASCADE;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_seo_schema_types" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects_blocks_content_columns" CASCADE;
  DROP TABLE "projects_blocks_content" CASCADE;
  DROP TABLE "projects_blocks_media" CASCADE;
  DROP TABLE "projects_blocks_call_to_action" CASCADE;
  DROP TABLE "projects_seo_schema_types" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_gallery" CASCADE;
  DROP TABLE "_projects_v_blocks_content_columns" CASCADE;
  DROP TABLE "_projects_v_blocks_content" CASCADE;
  DROP TABLE "_projects_v_blocks_media" CASCADE;
  DROP TABLE "_projects_v_blocks_call_to_action" CASCADE;
  DROP TABLE "_projects_v_version_seo_schema_types" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "services_benefits" CASCADE;
  DROP TABLE "services_materials_capabilities" CASCADE;
  DROP TABLE "services_process" CASCADE;
  DROP TABLE "services_service_areas" CASCADE;
  DROP TABLE "services_gallery" CASCADE;
  DROP TABLE "services_seo_schema_types" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "_services_v_version_benefits" CASCADE;
  DROP TABLE "_services_v_version_materials_capabilities" CASCADE;
  DROP TABLE "_services_v_version_process" CASCADE;
  DROP TABLE "_services_v_version_service_areas" CASCADE;
  DROP TABLE "_services_v_version_gallery" CASCADE;
  DROP TABLE "_services_v_version_seo_schema_types" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_locales" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "faqs_rels" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  DROP TABLE "_faqs_v_locales" CASCADE;
  DROP TABLE "_faqs_v_rels" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "_testimonials_v_locales" CASCADE;
  DROP TABLE "leads_status_audit" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "header_navigation" CASCADE;
  DROP TABLE "header_navigation_locales" CASCADE;
  DROP TABLE "header_service_links" CASCADE;
  DROP TABLE "header_service_links_locales" CASCADE;
  DROP TABLE "header_conversion_actions" CASCADE;
  DROP TABLE "header_conversion_actions_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "footer_navigation_groups_items" CASCADE;
  DROP TABLE "footer_navigation_groups_items_locales" CASCADE;
  DROP TABLE "footer_navigation_groups" CASCADE;
  DROP TABLE "footer_navigation_groups_locales" CASCADE;
  DROP TABLE "footer_service_links" CASCADE;
  DROP TABLE "footer_service_links_locales" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer_legal_links_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "contact_information_opening_hours" CASCADE;
  DROP TABLE "contact_information_opening_hours_locales" CASCADE;
  DROP TABLE "contact_information_service_areas" CASCADE;
  DROP TABLE "contact_information_service_areas_locales" CASCADE;
  DROP TABLE "contact_information" CASCADE;
  DROP TABLE "contact_information_locales" CASCADE;
  DROP TABLE "seo_defaults" CASCADE;
  DROP TABLE "seo_defaults_locales" CASCADE;
  DROP TABLE "social_media_links" CASCADE;
  DROP TABLE "social_media_links_locales" CASCADE;
  DROP TABLE "social_media" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_alignment";
  DROP TYPE "public"."enum_pages_blocks_rich_content_width";
  DROP TYPE "public"."enum_pages_blocks_media_position";
  DROP TYPE "public"."enum_pages_blocks_split_content_media_position";
  DROP TYPE "public"."enum_pages_blocks_service_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_testimonials_display_mode";
  DROP TYPE "public"."enum_pages_blocks_call_to_action_variant";
  DROP TYPE "public"."enum_pages_seo_schema_types";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_rich_content_width";
  DROP TYPE "public"."enum__pages_v_blocks_media_position";
  DROP TYPE "public"."enum__pages_v_blocks_split_content_media_position";
  DROP TYPE "public"."enum__pages_v_blocks_service_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_display_mode";
  DROP TYPE "public"."enum__pages_v_blocks_call_to_action_variant";
  DROP TYPE "public"."enum__pages_v_version_seo_schema_types";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_posts_seo_schema_types";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_seo_schema_types";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_projects_blocks_content_columns_size";
  DROP TYPE "public"."enum_projects_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_projects_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_projects_blocks_media_position";
  DROP TYPE "public"."enum_projects_blocks_call_to_action_variant";
  DROP TYPE "public"."enum_projects_seo_schema_types";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__projects_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__projects_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__projects_v_blocks_media_position";
  DROP TYPE "public"."enum__projects_v_blocks_call_to_action_variant";
  DROP TYPE "public"."enum__projects_v_version_seo_schema_types";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum_services_seo_schema_types";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_seo_schema_types";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum__services_v_published_locale";
  DROP TYPE "public"."enum_faqs_group";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum__faqs_v_version_group";
  DROP TYPE "public"."enum__faqs_v_version_status";
  DROP TYPE "public"."enum__faqs_v_published_locale";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum__testimonials_v_published_locale";
  DROP TYPE "public"."enum_leads_status_audit_from";
  DROP TYPE "public"."enum_leads_status_audit_to";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_site_settings_locale_default_locale";
  DROP TYPE "public"."enum_site_settings_locale_direction";
  DROP TYPE "public"."enum_site_settings_announcement_destination";
  DROP TYPE "public"."enum_site_settings_presentation_button_style";
  DROP TYPE "public"."enum_site_settings_presentation_image_shape";
  DROP TYPE "public"."enum_header_navigation_destination";
  DROP TYPE "public"."enum_header_conversion_actions_action";
  DROP TYPE "public"."enum_header_conversion_actions_appearance";
  DROP TYPE "public"."enum_footer_navigation_groups_items_destination";
  DROP TYPE "public"."enum_footer_legal_links_legal_destination";
  DROP TYPE "public"."enum_contact_information_opening_hours_day";
  DROP TYPE "public"."enum_seo_defaults_local_business_schema_business_type";
  DROP TYPE "public"."enum_seo_defaults_local_business_schema_price_range";
  DROP TYPE "public"."enum_social_media_links_network";`)
}
