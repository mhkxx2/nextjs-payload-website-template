import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_about_page_status" AS ENUM('draft', 'published');
  
  CREATE TYPE "public"."enum__about_page_v_version_status" AS ENUM('draft', 'published');
  
  CREATE TYPE "public"."enum__about_page_v_published_locale" AS ENUM('en');
  
  CREATE TYPE "public"."enum_contact_page_status" AS ENUM('draft', 'published');
  
  CREATE TYPE "public"."enum__contact_page_v_version_status" AS ENUM('draft', 'published');
  
  CREATE TYPE "public"."enum__contact_page_v_published_locale" AS ENUM('en');
  
  CREATE TYPE "public"."enum_archive_settings_status" AS ENUM('draft', 'published');
  
  CREATE TYPE "public"."enum__archive_settings_v_version_status" AS ENUM('draft', 'published');
  
  CREATE TYPE "public"."enum__archive_settings_v_published_locale" AS ENUM('en');
  
  CREATE TABLE "about_page_proof_items" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL
    );
  
  CREATE TABLE "about_page_proof_items_locales" (
    	"label" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" varchar NOT NULL
    );
  
  CREATE TABLE "about_page_story_paragraphs" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL
    );
  
  CREATE TABLE "about_page_story_paragraphs_locales" (
    	"text" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" varchar NOT NULL
    );
  
  CREATE TABLE "about_page_process_section_steps" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL
    );
  
  CREATE TABLE "about_page_process_section_steps_locales" (
    	"title" varchar,
    	"description" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" varchar NOT NULL
    );
  
  CREATE TABLE "about_page_principles_section_items" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL
    );
  
  CREATE TABLE "about_page_principles_section_items_locales" (
    	"title" varchar,
    	"description" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" varchar NOT NULL
    );
  
  CREATE TABLE "about_page" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"seo_image_id" integer,
    	"hero_image_id" integer,
    	"story_image_id" integer,
    	"_status" "enum_about_page_status" DEFAULT 'draft',
    	"updated_at" timestamp(3) with time zone,
    	"created_at" timestamp(3) with time zone
    );
  
  CREATE TABLE "about_page_locales" (
    	"seo_title" varchar,
    	"seo_description" varchar,
    	"hero_eyebrow" varchar,
    	"hero_heading" varchar,
    	"hero_introduction" varchar,
    	"hero_primary_label" varchar,
    	"hero_secondary_label" varchar,
    	"story_eyebrow" varchar,
    	"story_heading" varchar,
    	"services_section_eyebrow" varchar,
    	"services_section_heading" varchar,
    	"services_section_introduction" varchar,
    	"process_section_eyebrow" varchar,
    	"process_section_heading" varchar,
    	"process_section_introduction" varchar,
    	"principles_section_eyebrow" varchar,
    	"principles_section_heading" varchar,
    	"principles_section_introduction" varchar,
    	"coverage_section_eyebrow" varchar,
    	"coverage_section_heading" varchar,
    	"coverage_section_introduction" varchar,
    	"cta_eyebrow" varchar,
    	"cta_heading" varchar,
    	"cta_description" varchar,
    	"cta_primary_label" varchar,
    	"cta_whats_app_label" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );
  
  CREATE TABLE "_about_page_v_version_proof_items" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_uuid" varchar
    );
  
  CREATE TABLE "_about_page_v_version_proof_items_locales" (
    	"label" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );
  
  CREATE TABLE "_about_page_v_version_story_paragraphs" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_uuid" varchar
    );
  
  CREATE TABLE "_about_page_v_version_story_paragraphs_locales" (
    	"text" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );
  
  CREATE TABLE "_about_page_v_version_process_section_steps" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_uuid" varchar
    );
  
  CREATE TABLE "_about_page_v_version_process_section_steps_locales" (
    	"title" varchar,
    	"description" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );
  
  CREATE TABLE "_about_page_v_version_principles_section_items" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_uuid" varchar
    );
  
  CREATE TABLE "_about_page_v_version_principles_section_items_locales" (
    	"title" varchar,
    	"description" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );
  
  CREATE TABLE "_about_page_v" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"version_seo_image_id" integer,
    	"version_hero_image_id" integer,
    	"version_story_image_id" integer,
    	"version__status" "enum__about_page_v_version_status" DEFAULT 'draft',
    	"version_updated_at" timestamp(3) with time zone,
    	"version_created_at" timestamp(3) with time zone,
    	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"snapshot" boolean,
    	"published_locale" "enum__about_page_v_published_locale",
    	"latest" boolean,
    	"autosave" boolean
    );
  
  CREATE TABLE "_about_page_v_locales" (
    	"version_seo_title" varchar,
    	"version_seo_description" varchar,
    	"version_hero_eyebrow" varchar,
    	"version_hero_heading" varchar,
    	"version_hero_introduction" varchar,
    	"version_hero_primary_label" varchar,
    	"version_hero_secondary_label" varchar,
    	"version_story_eyebrow" varchar,
    	"version_story_heading" varchar,
    	"version_services_section_eyebrow" varchar,
    	"version_services_section_heading" varchar,
    	"version_services_section_introduction" varchar,
    	"version_process_section_eyebrow" varchar,
    	"version_process_section_heading" varchar,
    	"version_process_section_introduction" varchar,
    	"version_principles_section_eyebrow" varchar,
    	"version_principles_section_heading" varchar,
    	"version_principles_section_introduction" varchar,
    	"version_coverage_section_eyebrow" varchar,
    	"version_coverage_section_heading" varchar,
    	"version_coverage_section_introduction" varchar,
    	"version_cta_eyebrow" varchar,
    	"version_cta_heading" varchar,
    	"version_cta_description" varchar,
    	"version_cta_primary_label" varchar,
    	"version_cta_whats_app_label" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );
  
  CREATE TABLE "contact_page_quote_section_checklist" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL
    );
  
  CREATE TABLE "contact_page_quote_section_checklist_locales" (
    	"item" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" varchar NOT NULL
    );
  
  CREATE TABLE "contact_page" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"seo_image_id" integer,
    	"_status" "enum_contact_page_status" DEFAULT 'draft',
    	"updated_at" timestamp(3) with time zone,
    	"created_at" timestamp(3) with time zone
    );
  
  CREATE TABLE "contact_page_locales" (
    	"seo_title" varchar,
    	"seo_description" varchar,
    	"hero_eyebrow" varchar,
    	"hero_heading" varchar,
    	"hero_introduction" varchar,
    	"hero_primary_label" varchar,
    	"hero_whats_app_label" varchar,
    	"workshop_card_eyebrow" varchar,
    	"workshop_card_call_label" varchar,
    	"workshop_card_email_label" varchar,
    	"workshop_card_visit_label" varchar,
    	"workshop_card_hours_label" varchar,
    	"workshop_card_map_label" varchar,
    	"channel_labels_call" varchar,
    	"channel_labels_whats_app" varchar,
    	"channel_labels_email" varchar,
    	"channel_labels_visit" varchar,
    	"quote_section_eyebrow" varchar,
    	"quote_section_heading" varchar,
    	"quote_section_introduction" varchar,
    	"quote_section_response_note" varchar,
    	"quote_section_form_heading" varchar,
    	"hours_section_eyebrow" varchar,
    	"hours_section_heading" varchar,
    	"hours_section_introduction" varchar,
    	"hours_section_open_days_label" varchar,
    	"hours_section_closed_day_label" varchar,
    	"hours_section_closed_label" varchar,
    	"coverage_section_eyebrow" varchar,
    	"coverage_section_heading" varchar,
    	"coverage_section_introduction" varchar,
    	"services_section_eyebrow" varchar,
    	"services_section_heading" varchar,
    	"services_section_introduction" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );
  
  CREATE TABLE "_contact_page_v_version_quote_section_checklist" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_uuid" varchar
    );
  
  CREATE TABLE "_contact_page_v_version_quote_section_checklist_locales" (
    	"item" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );
  
  CREATE TABLE "_contact_page_v" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"version_seo_image_id" integer,
    	"version__status" "enum__contact_page_v_version_status" DEFAULT 'draft',
    	"version_updated_at" timestamp(3) with time zone,
    	"version_created_at" timestamp(3) with time zone,
    	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"snapshot" boolean,
    	"published_locale" "enum__contact_page_v_published_locale",
    	"latest" boolean,
    	"autosave" boolean
    );
  
  CREATE TABLE "_contact_page_v_locales" (
    	"version_seo_title" varchar,
    	"version_seo_description" varchar,
    	"version_hero_eyebrow" varchar,
    	"version_hero_heading" varchar,
    	"version_hero_introduction" varchar,
    	"version_hero_primary_label" varchar,
    	"version_hero_whats_app_label" varchar,
    	"version_workshop_card_eyebrow" varchar,
    	"version_workshop_card_call_label" varchar,
    	"version_workshop_card_email_label" varchar,
    	"version_workshop_card_visit_label" varchar,
    	"version_workshop_card_hours_label" varchar,
    	"version_workshop_card_map_label" varchar,
    	"version_channel_labels_call" varchar,
    	"version_channel_labels_whats_app" varchar,
    	"version_channel_labels_email" varchar,
    	"version_channel_labels_visit" varchar,
    	"version_quote_section_eyebrow" varchar,
    	"version_quote_section_heading" varchar,
    	"version_quote_section_introduction" varchar,
    	"version_quote_section_response_note" varchar,
    	"version_quote_section_form_heading" varchar,
    	"version_hours_section_eyebrow" varchar,
    	"version_hours_section_heading" varchar,
    	"version_hours_section_introduction" varchar,
    	"version_hours_section_open_days_label" varchar,
    	"version_hours_section_closed_day_label" varchar,
    	"version_hours_section_closed_label" varchar,
    	"version_coverage_section_eyebrow" varchar,
    	"version_coverage_section_heading" varchar,
    	"version_coverage_section_introduction" varchar,
    	"version_services_section_eyebrow" varchar,
    	"version_services_section_heading" varchar,
    	"version_services_section_introduction" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );
  
  CREATE TABLE "archive_settings" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"services_archive_seo_image_id" integer,
    	"projects_archive_seo_image_id" integer,
    	"blog_archive_seo_image_id" integer,
    	"portfolio_archive_seo_image_id" integer,
    	"_status" "enum_archive_settings_status" DEFAULT 'draft',
    	"updated_at" timestamp(3) with time zone,
    	"created_at" timestamp(3) with time zone
    );
  
  CREATE TABLE "archive_settings_locales" (
    	"services_archive_heading" varchar,
    	"services_archive_introduction" varchar,
    	"services_archive_empty_state" varchar,
    	"services_archive_cta_eyebrow" varchar,
    	"services_archive_cta_heading" varchar,
    	"services_archive_cta_description" varchar,
    	"services_archive_cta_primary_label" varchar,
    	"services_archive_cta_whats_app_label" varchar,
    	"services_archive_seo_title" varchar,
    	"services_archive_seo_description" varchar,
    	"projects_archive_heading" varchar,
    	"projects_archive_introduction" varchar,
    	"projects_archive_empty_state" varchar,
    	"projects_archive_cta_eyebrow" varchar,
    	"projects_archive_cta_heading" varchar,
    	"projects_archive_cta_description" varchar,
    	"projects_archive_cta_primary_label" varchar,
    	"projects_archive_cta_whats_app_label" varchar,
    	"projects_archive_seo_title" varchar,
    	"projects_archive_seo_description" varchar,
    	"blog_archive_heading" varchar,
    	"blog_archive_introduction" varchar,
    	"blog_archive_empty_state" varchar,
    	"blog_archive_cta_eyebrow" varchar,
    	"blog_archive_cta_heading" varchar,
    	"blog_archive_cta_description" varchar,
    	"blog_archive_cta_primary_label" varchar,
    	"blog_archive_cta_whats_app_label" varchar,
    	"blog_archive_seo_title" varchar,
    	"blog_archive_seo_description" varchar,
    	"portfolio_archive_heading" varchar,
    	"portfolio_archive_introduction" varchar,
    	"portfolio_archive_empty_state" varchar,
    	"portfolio_archive_cta_eyebrow" varchar,
    	"portfolio_archive_cta_heading" varchar,
    	"portfolio_archive_cta_description" varchar,
    	"portfolio_archive_cta_primary_label" varchar,
    	"portfolio_archive_cta_whats_app_label" varchar,
    	"portfolio_archive_seo_title" varchar,
    	"portfolio_archive_seo_description" varchar,
    	"portfolio_archive_hero_eyebrow" varchar,
    	"portfolio_archive_hero_heading" varchar,
    	"portfolio_archive_hero_introduction" varchar,
    	"portfolio_archive_hero_explore_label" varchar,
    	"portfolio_archive_hero_send_design_label" varchar,
    	"portfolio_archive_filter_labels_all" varchar,
    	"portfolio_archive_filter_labels_bedroom" varchar,
    	"portfolio_archive_filter_labels_living_room" varchar,
    	"portfolio_archive_filter_labels_kids_room" varchar,
    	"portfolio_archive_filter_labels_dining_room" varchar,
    	"portfolio_archive_filter_labels_bathroom" varchar,
    	"portfolio_archive_filter_labels_sofas" varchar,
    	"portfolio_archive_filter_labels_beds" varchar,
    	"portfolio_archive_filter_labels_wardrobes" varchar,
    	"portfolio_archive_filter_labels_office_study" varchar,
    	"portfolio_archive_filter_labels_storage" varchar,
    	"portfolio_archive_supporting_labels_room_eyebrow" varchar,
    	"portfolio_archive_supporting_labels_room_heading" varchar,
    	"portfolio_archive_supporting_labels_services_eyebrow" varchar,
    	"portfolio_archive_supporting_labels_services_heading" varchar,
    	"portfolio_archive_supporting_labels_results_heading" varchar,
    	"portfolio_archive_supporting_labels_load_more_label" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );
  
  CREATE TABLE "_archive_settings_v" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"version_services_archive_seo_image_id" integer,
    	"version_projects_archive_seo_image_id" integer,
    	"version_blog_archive_seo_image_id" integer,
    	"version_portfolio_archive_seo_image_id" integer,
    	"version__status" "enum__archive_settings_v_version_status" DEFAULT 'draft',
    	"version_updated_at" timestamp(3) with time zone,
    	"version_created_at" timestamp(3) with time zone,
    	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"snapshot" boolean,
    	"published_locale" "enum__archive_settings_v_published_locale",
    	"latest" boolean,
    	"autosave" boolean
    );
  
  CREATE TABLE "_archive_settings_v_locales" (
    	"version_services_archive_heading" varchar,
    	"version_services_archive_introduction" varchar,
    	"version_services_archive_empty_state" varchar,
    	"version_services_archive_cta_eyebrow" varchar,
    	"version_services_archive_cta_heading" varchar,
    	"version_services_archive_cta_description" varchar,
    	"version_services_archive_cta_primary_label" varchar,
    	"version_services_archive_cta_whats_app_label" varchar,
    	"version_services_archive_seo_title" varchar,
    	"version_services_archive_seo_description" varchar,
    	"version_projects_archive_heading" varchar,
    	"version_projects_archive_introduction" varchar,
    	"version_projects_archive_empty_state" varchar,
    	"version_projects_archive_cta_eyebrow" varchar,
    	"version_projects_archive_cta_heading" varchar,
    	"version_projects_archive_cta_description" varchar,
    	"version_projects_archive_cta_primary_label" varchar,
    	"version_projects_archive_cta_whats_app_label" varchar,
    	"version_projects_archive_seo_title" varchar,
    	"version_projects_archive_seo_description" varchar,
    	"version_blog_archive_heading" varchar,
    	"version_blog_archive_introduction" varchar,
    	"version_blog_archive_empty_state" varchar,
    	"version_blog_archive_cta_eyebrow" varchar,
    	"version_blog_archive_cta_heading" varchar,
    	"version_blog_archive_cta_description" varchar,
    	"version_blog_archive_cta_primary_label" varchar,
    	"version_blog_archive_cta_whats_app_label" varchar,
    	"version_blog_archive_seo_title" varchar,
    	"version_blog_archive_seo_description" varchar,
    	"version_portfolio_archive_heading" varchar,
    	"version_portfolio_archive_introduction" varchar,
    	"version_portfolio_archive_empty_state" varchar,
    	"version_portfolio_archive_cta_eyebrow" varchar,
    	"version_portfolio_archive_cta_heading" varchar,
    	"version_portfolio_archive_cta_description" varchar,
    	"version_portfolio_archive_cta_primary_label" varchar,
    	"version_portfolio_archive_cta_whats_app_label" varchar,
    	"version_portfolio_archive_seo_title" varchar,
    	"version_portfolio_archive_seo_description" varchar,
    	"version_portfolio_archive_hero_eyebrow" varchar,
    	"version_portfolio_archive_hero_heading" varchar,
    	"version_portfolio_archive_hero_introduction" varchar,
    	"version_portfolio_archive_hero_explore_label" varchar,
    	"version_portfolio_archive_hero_send_design_label" varchar,
    	"version_portfolio_archive_filter_labels_all" varchar,
    	"version_portfolio_archive_filter_labels_bedroom" varchar,
    	"version_portfolio_archive_filter_labels_living_room" varchar,
    	"version_portfolio_archive_filter_labels_kids_room" varchar,
    	"version_portfolio_archive_filter_labels_dining_room" varchar,
    	"version_portfolio_archive_filter_labels_bathroom" varchar,
    	"version_portfolio_archive_filter_labels_sofas" varchar,
    	"version_portfolio_archive_filter_labels_beds" varchar,
    	"version_portfolio_archive_filter_labels_wardrobes" varchar,
    	"version_portfolio_archive_filter_labels_office_study" varchar,
    	"version_portfolio_archive_filter_labels_storage" varchar,
    	"version_portfolio_archive_supporting_labels_room_eyebrow" varchar,
    	"version_portfolio_archive_supporting_labels_room_heading" varchar,
    	"version_portfolio_archive_supporting_labels_services_eyebrow" varchar,
    	"version_portfolio_archive_supporting_labels_services_heading" varchar,
    	"version_portfolio_archive_supporting_labels_results_heading" varchar,
    	"version_portfolio_archive_supporting_labels_load_more_label" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_workshop_note" varchar;
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_benefits_eyebrow" varchar;
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_benefits_heading" varchar;
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_materials_eyebrow" varchar;
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_process_eyebrow" varchar;
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_gallery_eyebrow" varchar;
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_areas_eyebrow" varchar;
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_faq_eyebrow" varchar;
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_faq_heading" varchar;
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_faq_introduction" varchar;
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_related_eyebrow" varchar;
  
  ALTER TABLE "services_locales" ADD COLUMN "presentation_labels_quote_eyebrow" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_workshop_note" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_benefits_eyebrow" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_benefits_heading" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_materials_eyebrow" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_process_eyebrow" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_gallery_eyebrow" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_areas_eyebrow" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_faq_eyebrow" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_faq_heading" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_faq_introduction" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_related_eyebrow" varchar;
  
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_presentation_labels_quote_eyebrow" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "shared_labels_service_card_link_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "shared_labels_project_card_link_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "shared_labels_projects_archive_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "shared_labels_final_cta_eyebrow" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "shared_labels_dubai_area_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "shared_labels_sharjah_area_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "shared_labels_ajman_area_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "shared_labels_other_emirates_area_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_name_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_phone_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_email_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_service_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_service_placeholder" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_area_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_message_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_portfolio_reference_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_photo_help" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_consent_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_privacy_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_submit_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_pending_label" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_success_message" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_error_message" varchar;
  
  ALTER TABLE "homepage_locales" ADD COLUMN "quote_form_network_error_message" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_shared_labels_service_card_link_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_shared_labels_project_card_link_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_shared_labels_projects_archive_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_shared_labels_final_cta_eyebrow" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_shared_labels_dubai_area_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_shared_labels_sharjah_area_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_shared_labels_ajman_area_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_shared_labels_other_emirates_area_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_name_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_phone_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_email_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_service_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_service_placeholder" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_area_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_message_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_portfolio_reference_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_photo_help" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_consent_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_privacy_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_submit_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_pending_label" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_success_message" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_error_message" varchar;
  
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_quote_form_network_error_message" varchar;
  
  ALTER TABLE "about_page_proof_items" ADD CONSTRAINT "about_page_proof_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "about_page_proof_items_locales" ADD CONSTRAINT "about_page_proof_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_proof_items"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "about_page_story_paragraphs" ADD CONSTRAINT "about_page_story_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "about_page_story_paragraphs_locales" ADD CONSTRAINT "about_page_story_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_story_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "about_page_process_section_steps" ADD CONSTRAINT "about_page_process_section_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "about_page_process_section_steps_locales" ADD CONSTRAINT "about_page_process_section_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_process_section_steps"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "about_page_principles_section_items" ADD CONSTRAINT "about_page_principles_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "about_page_principles_section_items_locales" ADD CONSTRAINT "about_page_principles_section_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_principles_section_items"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_story_image_id_media_id_fk" FOREIGN KEY ("story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_about_page_v_version_proof_items" ADD CONSTRAINT "_about_page_v_version_proof_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_about_page_v_version_proof_items_locales" ADD CONSTRAINT "_about_page_v_version_proof_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_version_proof_items"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_about_page_v_version_story_paragraphs" ADD CONSTRAINT "_about_page_v_version_story_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_about_page_v_version_story_paragraphs_locales" ADD CONSTRAINT "_about_page_v_version_story_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_version_story_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_about_page_v_version_process_section_steps" ADD CONSTRAINT "_about_page_v_version_process_section_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_about_page_v_version_process_section_steps_locales" ADD CONSTRAINT "_about_page_v_version_process_section_steps_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_version_process_section_steps"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_about_page_v_version_principles_section_items" ADD CONSTRAINT "_about_page_v_version_principles_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_about_page_v_version_principles_section_items_locales" ADD CONSTRAINT "_about_page_v_version_principles_section_items_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_version_principles_section_items"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_story_image_id_media_id_fk" FOREIGN KEY ("version_story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "_about_page_v_locales" ADD CONSTRAINT "_about_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "contact_page_quote_section_checklist" ADD CONSTRAINT "contact_page_quote_section_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "contact_page_quote_section_checklist_locales" ADD CONSTRAINT "contact_page_quote_section_checklist_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page_quote_section_checklist"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_contact_page_v_version_quote_section_checklist" ADD CONSTRAINT "_contact_page_v_version_quote_section_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_contact_page_v_version_quote_section_checklist_locales" ADD CONSTRAINT "_contact_page_v_version_quote_section_checklist_locales_p_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v_version_quote_section_checklist"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "_contact_page_v_locales" ADD CONSTRAINT "_contact_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "archive_settings" ADD CONSTRAINT "archive_settings_services_archive_seo_image_id_media_id_fk" FOREIGN KEY ("services_archive_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "archive_settings" ADD CONSTRAINT "archive_settings_projects_archive_seo_image_id_media_id_fk" FOREIGN KEY ("projects_archive_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "archive_settings" ADD CONSTRAINT "archive_settings_blog_archive_seo_image_id_media_id_fk" FOREIGN KEY ("blog_archive_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "archive_settings" ADD CONSTRAINT "archive_settings_portfolio_archive_seo_image_id_media_id_fk" FOREIGN KEY ("portfolio_archive_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "archive_settings_locales" ADD CONSTRAINT "archive_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."archive_settings"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_archive_settings_v" ADD CONSTRAINT "_archive_settings_v_services_seo_image_media_fk" FOREIGN KEY ("version_services_archive_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "_archive_settings_v" ADD CONSTRAINT "_archive_settings_v_projects_seo_image_media_fk" FOREIGN KEY ("version_projects_archive_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "_archive_settings_v" ADD CONSTRAINT "_archive_settings_v_blog_seo_image_media_fk" FOREIGN KEY ("version_blog_archive_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "_archive_settings_v" ADD CONSTRAINT "_archive_settings_v_portfolio_seo_image_media_fk" FOREIGN KEY ("version_portfolio_archive_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  
  ALTER TABLE "_archive_settings_v_locales" ADD CONSTRAINT "_archive_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_archive_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  
  CREATE INDEX "about_page_proof_items_order_idx" ON "about_page_proof_items" USING btree ("_order");
  
  CREATE INDEX "about_page_proof_items_parent_id_idx" ON "about_page_proof_items" USING btree ("_parent_id");
  
  CREATE UNIQUE INDEX "about_page_proof_items_locales_locale_parent_id_unique" ON "about_page_proof_items_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "about_page_story_paragraphs_order_idx" ON "about_page_story_paragraphs" USING btree ("_order");
  
  CREATE INDEX "about_page_story_paragraphs_parent_id_idx" ON "about_page_story_paragraphs" USING btree ("_parent_id");
  
  CREATE UNIQUE INDEX "about_page_story_paragraphs_locales_locale_parent_id_unique" ON "about_page_story_paragraphs_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "about_page_process_section_steps_order_idx" ON "about_page_process_section_steps" USING btree ("_order");
  
  CREATE INDEX "about_page_process_section_steps_parent_id_idx" ON "about_page_process_section_steps" USING btree ("_parent_id");
  
  CREATE UNIQUE INDEX "about_page_process_section_steps_locales_locale_parent_id_un" ON "about_page_process_section_steps_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "about_page_principles_section_items_order_idx" ON "about_page_principles_section_items" USING btree ("_order");
  
  CREATE INDEX "about_page_principles_section_items_parent_id_idx" ON "about_page_principles_section_items" USING btree ("_parent_id");
  
  CREATE UNIQUE INDEX "about_page_principles_section_items_locales_locale_parent_id" ON "about_page_principles_section_items_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "about_page_seo_seo_image_idx" ON "about_page" USING btree ("seo_image_id");
  
  CREATE INDEX "about_page_hero_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
  
  CREATE INDEX "about_page_story_story_image_idx" ON "about_page" USING btree ("story_image_id");
  
  CREATE INDEX "about_page__status_idx" ON "about_page" USING btree ("_status");
  
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "_about_page_v_version_proof_items_order_idx" ON "_about_page_v_version_proof_items" USING btree ("_order");
  
  CREATE INDEX "_about_page_v_version_proof_items_parent_id_idx" ON "_about_page_v_version_proof_items" USING btree ("_parent_id");
  
  CREATE UNIQUE INDEX "_about_page_v_version_proof_items_locales_locale_parent_id_u" ON "_about_page_v_version_proof_items_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "_about_page_v_version_story_paragraphs_order_idx" ON "_about_page_v_version_story_paragraphs" USING btree ("_order");
  
  CREATE INDEX "_about_page_v_version_story_paragraphs_parent_id_idx" ON "_about_page_v_version_story_paragraphs" USING btree ("_parent_id");
  
  CREATE UNIQUE INDEX "_about_page_v_version_story_paragraphs_locales_locale_parent" ON "_about_page_v_version_story_paragraphs_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "_about_page_v_version_process_section_steps_order_idx" ON "_about_page_v_version_process_section_steps" USING btree ("_order");
  
  CREATE INDEX "_about_page_v_version_process_section_steps_parent_id_idx" ON "_about_page_v_version_process_section_steps" USING btree ("_parent_id");
  
  CREATE UNIQUE INDEX "_about_page_v_version_process_section_steps_locales_locale_p" ON "_about_page_v_version_process_section_steps_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "_about_page_v_version_principles_section_items_order_idx" ON "_about_page_v_version_principles_section_items" USING btree ("_order");
  
  CREATE INDEX "_about_page_v_version_principles_section_items_parent_id_idx" ON "_about_page_v_version_principles_section_items" USING btree ("_parent_id");
  
  CREATE UNIQUE INDEX "_about_page_v_version_principles_section_items_locales_local" ON "_about_page_v_version_principles_section_items_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "_about_page_v_version_seo_version_seo_image_idx" ON "_about_page_v" USING btree ("version_seo_image_id");
  
  CREATE INDEX "_about_page_v_version_hero_version_hero_image_idx" ON "_about_page_v" USING btree ("version_hero_image_id");
  
  CREATE INDEX "_about_page_v_version_story_version_story_image_idx" ON "_about_page_v" USING btree ("version_story_image_id");
  
  CREATE INDEX "_about_page_v_version_version__status_idx" ON "_about_page_v" USING btree ("version__status");
  
  CREATE INDEX "_about_page_v_created_at_idx" ON "_about_page_v" USING btree ("created_at");
  
  CREATE INDEX "_about_page_v_updated_at_idx" ON "_about_page_v" USING btree ("updated_at");
  
  CREATE INDEX "_about_page_v_snapshot_idx" ON "_about_page_v" USING btree ("snapshot");
  
  CREATE INDEX "_about_page_v_published_locale_idx" ON "_about_page_v" USING btree ("published_locale");
  
  CREATE INDEX "_about_page_v_latest_idx" ON "_about_page_v" USING btree ("latest");
  
  CREATE INDEX "_about_page_v_autosave_idx" ON "_about_page_v" USING btree ("autosave");
  
  CREATE UNIQUE INDEX "_about_page_v_locales_locale_parent_id_unique" ON "_about_page_v_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "contact_page_quote_section_checklist_order_idx" ON "contact_page_quote_section_checklist" USING btree ("_order");
  
  CREATE INDEX "contact_page_quote_section_checklist_parent_id_idx" ON "contact_page_quote_section_checklist" USING btree ("_parent_id");
  
  CREATE UNIQUE INDEX "contact_page_quote_section_checklist_locales_locale_parent_i" ON "contact_page_quote_section_checklist_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "contact_page_seo_seo_image_idx" ON "contact_page" USING btree ("seo_image_id");
  
  CREATE INDEX "contact_page__status_idx" ON "contact_page" USING btree ("_status");
  
  CREATE UNIQUE INDEX "contact_page_locales_locale_parent_id_unique" ON "contact_page_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "_contact_page_v_version_quote_section_checklist_order_idx" ON "_contact_page_v_version_quote_section_checklist" USING btree ("_order");
  
  CREATE INDEX "_contact_page_v_version_quote_section_checklist_parent_id_idx" ON "_contact_page_v_version_quote_section_checklist" USING btree ("_parent_id");
  
  CREATE UNIQUE INDEX "_contact_page_v_version_quote_section_checklist_locales_loca" ON "_contact_page_v_version_quote_section_checklist_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "_contact_page_v_version_seo_version_seo_image_idx" ON "_contact_page_v" USING btree ("version_seo_image_id");
  
  CREATE INDEX "_contact_page_v_version_version__status_idx" ON "_contact_page_v" USING btree ("version__status");
  
  CREATE INDEX "_contact_page_v_created_at_idx" ON "_contact_page_v" USING btree ("created_at");
  
  CREATE INDEX "_contact_page_v_updated_at_idx" ON "_contact_page_v" USING btree ("updated_at");
  
  CREATE INDEX "_contact_page_v_snapshot_idx" ON "_contact_page_v" USING btree ("snapshot");
  
  CREATE INDEX "_contact_page_v_published_locale_idx" ON "_contact_page_v" USING btree ("published_locale");
  
  CREATE INDEX "_contact_page_v_latest_idx" ON "_contact_page_v" USING btree ("latest");
  
  CREATE INDEX "_contact_page_v_autosave_idx" ON "_contact_page_v" USING btree ("autosave");
  
  CREATE UNIQUE INDEX "_contact_page_v_locales_locale_parent_id_unique" ON "_contact_page_v_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "archive_settings_services_archive_seo_services_archive_s_idx" ON "archive_settings" USING btree ("services_archive_seo_image_id");
  
  CREATE INDEX "archive_settings_projects_archive_seo_projects_archive_s_idx" ON "archive_settings" USING btree ("projects_archive_seo_image_id");
  
  CREATE INDEX "archive_settings_blog_archive_seo_blog_archive_seo_image_idx" ON "archive_settings" USING btree ("blog_archive_seo_image_id");
  
  CREATE INDEX "archive_settings_portfolio_archive_seo_portfolio_archive_idx" ON "archive_settings" USING btree ("portfolio_archive_seo_image_id");
  
  CREATE INDEX "archive_settings__status_idx" ON "archive_settings" USING btree ("_status");
  
  CREATE UNIQUE INDEX "archive_settings_locales_locale_parent_id_unique" ON "archive_settings_locales" USING btree ("_locale","_parent_id");
  
  CREATE INDEX "_archive_settings_v_version_services_archive_seo_version_idx" ON "_archive_settings_v" USING btree ("version_services_archive_seo_image_id");
  
  CREATE INDEX "_archive_settings_v_version_projects_archive_seo_version_idx" ON "_archive_settings_v" USING btree ("version_projects_archive_seo_image_id");
  
  CREATE INDEX "_archive_settings_v_version_blog_archive_seo_version_blo_idx" ON "_archive_settings_v" USING btree ("version_blog_archive_seo_image_id");
  
  CREATE INDEX "_archive_settings_v_version_portfolio_archive_seo_versio_idx" ON "_archive_settings_v" USING btree ("version_portfolio_archive_seo_image_id");
  
  CREATE INDEX "_archive_settings_v_version_version__status_idx" ON "_archive_settings_v" USING btree ("version__status");
  
  CREATE INDEX "_archive_settings_v_created_at_idx" ON "_archive_settings_v" USING btree ("created_at");
  
  CREATE INDEX "_archive_settings_v_updated_at_idx" ON "_archive_settings_v" USING btree ("updated_at");
  
  CREATE INDEX "_archive_settings_v_snapshot_idx" ON "_archive_settings_v" USING btree ("snapshot");
  
  CREATE INDEX "_archive_settings_v_published_locale_idx" ON "_archive_settings_v" USING btree ("published_locale");
  
  CREATE INDEX "_archive_settings_v_latest_idx" ON "_archive_settings_v" USING btree ("latest");
  
  CREATE INDEX "_archive_settings_v_autosave_idx" ON "_archive_settings_v" USING btree ("autosave");
  
  CREATE UNIQUE INDEX "_archive_settings_v_locales_locale_parent_id_unique" ON "_archive_settings_v_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "about_page_proof_items" CASCADE;
  
  DROP TABLE "about_page_proof_items_locales" CASCADE;
  
  DROP TABLE "about_page_story_paragraphs" CASCADE;
  
  DROP TABLE "about_page_story_paragraphs_locales" CASCADE;
  
  DROP TABLE "about_page_process_section_steps" CASCADE;
  
  DROP TABLE "about_page_process_section_steps_locales" CASCADE;
  
  DROP TABLE "about_page_principles_section_items" CASCADE;
  
  DROP TABLE "about_page_principles_section_items_locales" CASCADE;
  
  DROP TABLE "about_page" CASCADE;
  
  DROP TABLE "about_page_locales" CASCADE;
  
  DROP TABLE "_about_page_v_version_proof_items" CASCADE;
  
  DROP TABLE "_about_page_v_version_proof_items_locales" CASCADE;
  
  DROP TABLE "_about_page_v_version_story_paragraphs" CASCADE;
  
  DROP TABLE "_about_page_v_version_story_paragraphs_locales" CASCADE;
  
  DROP TABLE "_about_page_v_version_process_section_steps" CASCADE;
  
  DROP TABLE "_about_page_v_version_process_section_steps_locales" CASCADE;
  
  DROP TABLE "_about_page_v_version_principles_section_items" CASCADE;
  
  DROP TABLE "_about_page_v_version_principles_section_items_locales" CASCADE;
  
  DROP TABLE "_about_page_v" CASCADE;
  
  DROP TABLE "_about_page_v_locales" CASCADE;
  
  DROP TABLE "contact_page_quote_section_checklist" CASCADE;
  
  DROP TABLE "contact_page_quote_section_checklist_locales" CASCADE;
  
  DROP TABLE "contact_page" CASCADE;
  
  DROP TABLE "contact_page_locales" CASCADE;
  
  DROP TABLE "_contact_page_v_version_quote_section_checklist" CASCADE;
  
  DROP TABLE "_contact_page_v_version_quote_section_checklist_locales" CASCADE;
  
  DROP TABLE "_contact_page_v" CASCADE;
  
  DROP TABLE "_contact_page_v_locales" CASCADE;
  
  DROP TABLE "archive_settings" CASCADE;
  
  DROP TABLE "archive_settings_locales" CASCADE;
  
  DROP TABLE "_archive_settings_v" CASCADE;
  
  DROP TABLE "_archive_settings_v_locales" CASCADE;
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_workshop_note";
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_benefits_eyebrow";
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_benefits_heading";
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_materials_eyebrow";
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_process_eyebrow";
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_gallery_eyebrow";
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_areas_eyebrow";
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_faq_eyebrow";
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_faq_heading";
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_faq_introduction";
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_related_eyebrow";
  
  ALTER TABLE "services_locales" DROP COLUMN "presentation_labels_quote_eyebrow";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_workshop_note";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_benefits_eyebrow";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_benefits_heading";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_materials_eyebrow";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_process_eyebrow";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_gallery_eyebrow";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_areas_eyebrow";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_faq_eyebrow";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_faq_heading";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_faq_introduction";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_related_eyebrow";
  
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_presentation_labels_quote_eyebrow";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "shared_labels_service_card_link_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "shared_labels_project_card_link_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "shared_labels_projects_archive_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "shared_labels_final_cta_eyebrow";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "shared_labels_dubai_area_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "shared_labels_sharjah_area_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "shared_labels_ajman_area_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "shared_labels_other_emirates_area_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_name_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_phone_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_email_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_service_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_service_placeholder";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_area_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_message_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_portfolio_reference_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_photo_help";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_consent_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_privacy_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_submit_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_pending_label";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_success_message";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_error_message";
  
  ALTER TABLE "homepage_locales" DROP COLUMN "quote_form_network_error_message";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_shared_labels_service_card_link_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_shared_labels_project_card_link_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_shared_labels_projects_archive_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_shared_labels_final_cta_eyebrow";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_shared_labels_dubai_area_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_shared_labels_sharjah_area_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_shared_labels_ajman_area_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_shared_labels_other_emirates_area_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_name_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_phone_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_email_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_service_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_service_placeholder";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_area_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_message_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_portfolio_reference_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_photo_help";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_consent_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_privacy_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_submit_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_pending_label";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_success_message";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_error_message";
  
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_quote_form_network_error_message";
  
  DROP TYPE "public"."enum_about_page_status";
  
  DROP TYPE "public"."enum__about_page_v_version_status";
  
  DROP TYPE "public"."enum__about_page_v_published_locale";
  
  DROP TYPE "public"."enum_contact_page_status";
  
  DROP TYPE "public"."enum__contact_page_v_version_status";
  
  DROP TYPE "public"."enum__contact_page_v_published_locale";
  
  DROP TYPE "public"."enum_archive_settings_status";
  
  DROP TYPE "public"."enum__archive_settings_v_version_status";
  
  DROP TYPE "public"."enum__archive_settings_v_published_locale";
  `)
}
