-- PathGraph global data core (PostgreSQL 16+). IDs use UUIDs so imports can be
-- prepared offline and merged safely. Times are UTC. Raw values are immutable;
-- corrections arrive as a new source_release and fact version.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), iso2 char(2) UNIQUE NOT NULL,
  iso3 char(3) UNIQUE NOT NULL, slug text UNIQUE NOT NULL, name text NOT NULL,
  default_locale text NOT NULL, currency_code char(3) NOT NULL,
  enabled boolean NOT NULL DEFAULT false, pilot boolean NOT NULL DEFAULT true,
  adapter_key text UNIQUE NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE country_locales (
  country_id uuid REFERENCES countries ON DELETE CASCADE, locale text NOT NULL,
  is_default boolean NOT NULL DEFAULT false, PRIMARY KEY (country_id, locale)
);
CREATE TABLE geography_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), country_id uuid NOT NULL REFERENCES countries,
  code text NOT NULL, label text NOT NULL, level smallint NOT NULL,
  UNIQUE(country_id, code), UNIQUE(country_id, level)
);
CREATE TABLE geographies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), country_id uuid NOT NULL REFERENCES countries,
  geography_type_id uuid NOT NULL REFERENCES geography_types,
  parent_id uuid REFERENCES geographies, external_code text NOT NULL, name text NOT NULL,
  valid_from date, valid_to date, UNIQUE(country_id, geography_type_id, external_code)
);

CREATE TABLE taxonomy_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), country_id uuid REFERENCES countries,
  system_key text NOT NULL, version text NOT NULL, label text NOT NULL,
  is_international boolean NOT NULL DEFAULT false, valid_from date, valid_to date,
  source_url text, UNIQUE(system_key, version)
);
CREATE TABLE occupations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), taxonomy_version_id uuid NOT NULL REFERENCES taxonomy_versions,
  code text NOT NULL, parent_id uuid REFERENCES occupations, preferred_title text NOT NULL,
  description text, level smallint, valid_from date, valid_to date,
  UNIQUE(taxonomy_version_id, code)
);
CREATE INDEX occupations_parent_idx ON occupations(parent_id);

CREATE TABLE canonical_careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text UNIQUE NOT NULL,
  preferred_title text NOT NULL, description text NOT NULL,
  status text NOT NULL CHECK(status IN ('DRAFT','ACTIVE','RETIRED')),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE career_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), canonical_career_id uuid NOT NULL REFERENCES canonical_careers,
  country_id uuid REFERENCES countries, locale text NOT NULL, alias text NOT NULL,
  alias_type text NOT NULL CHECK(alias_type IN ('DISPLAY','SEARCH','LEGACY','LOCAL_TITLE')),
  UNIQUE(canonical_career_id, country_id, locale, alias)
);
CREATE TABLE career_relations (
  from_career_id uuid NOT NULL REFERENCES canonical_careers,
  to_career_id uuid NOT NULL REFERENCES canonical_careers,
  relation_type text NOT NULL CHECK(relation_type IN ('BROADER','NARROWER','RELATED','POSSIBLE_TRANSITION')),
  weight numeric(5,4), notes text, PRIMARY KEY(from_career_id,to_career_id,relation_type)
);

CREATE TABLE licences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), key text UNIQUE NOT NULL, name text NOT NULL,
  version text, url text NOT NULL, commercial_reuse boolean,
  attribution_required boolean, derivative_works_allowed boolean,
  redistribution_allowed boolean, api_terms_url text,
  status text NOT NULL CHECK(status IN ('VERIFIED','REVIEW_REQUIRED','RESTRICTED')),
  reviewed_at timestamptz, review_notes text
);
CREATE TABLE sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), key text UNIQUE NOT NULL,
  country_id uuid REFERENCES countries, publisher text NOT NULL, dataset_name text NOT NULL,
  landing_url text NOT NULL, access_method text NOT NULL,
  quality_tier text NOT NULL CHECK(quality_tier IN ('PRIMARY_OFFICIAL','OFFICIAL_BENCHMARK','SECONDARY_VALIDATED','UNVERIFIED')),
  update_cadence text, parser_key text, active boolean NOT NULL DEFAULT true
);
CREATE TABLE source_licences (
  source_id uuid REFERENCES sources ON DELETE CASCADE, licence_id uuid REFERENCES licences,
  scope_notes text, PRIMARY KEY(source_id, licence_id)
);
CREATE TABLE source_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_id uuid NOT NULL REFERENCES sources,
  release_key text NOT NULL, published_at timestamptz, reference_period_start date,
  reference_period_end date, retrieved_at timestamptz NOT NULL,
  content_hash text NOT NULL, raw_object_uri text, parser_version text NOT NULL,
  UNIQUE(source_id, release_key, content_hash)
);

CREATE TABLE career_occupation_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), canonical_career_id uuid NOT NULL REFERENCES canonical_careers,
  occupation_id uuid NOT NULL REFERENCES occupations, source_release_id uuid NOT NULL REFERENCES source_releases,
  mapping_quality text NOT NULL CHECK(mapping_quality IN ('EXACT','CLOSE','BROADER','NARROWER','PARTIAL','MANUAL_REVIEW')),
  mapping_method text NOT NULL CHECK(mapping_method IN ('OFFICIAL_CONCORDANCE','EXPERT_REVIEW','TITLE_AND_TASK_REVIEW','MODEL_ASSISTED')),
  confidence text NOT NULL CHECK(confidence IN ('HIGH','MEDIUM','LOW')),
  coverage_weight numeric(5,4), notes text, reviewed_by text, reviewed_at timestamptz NOT NULL,
  valid_from date, valid_to date,
  UNIQUE(canonical_career_id, occupation_id, valid_from)
);
CREATE INDEX mapping_career_idx ON career_occupation_mappings(canonical_career_id);
CREATE INDEX mapping_occupation_idx ON career_occupation_mappings(occupation_id);

CREATE TABLE career_country_profiles (
  country_id uuid NOT NULL REFERENCES countries,
  canonical_career_id uuid NOT NULL REFERENCES canonical_careers,
  locale text NOT NULL, local_title text NOT NULL,
  country_specific_description text, education_notes text,
  licensing_requirements text, regulatory_notes text, title_variants jsonb NOT NULL DEFAULT '[]',
  source_release_id uuid NOT NULL REFERENCES source_releases,
  reviewed_at timestamptz NOT NULL,
  PRIMARY KEY(country_id,canonical_career_id,locale)
);

CREATE TABLE metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), key text UNIQUE NOT NULL, label text NOT NULL,
  value_type text NOT NULL CHECK(value_type IN ('NUMERIC','TEXT','BOOLEAN','JSON')),
  comparison_semantics text NOT NULL CHECK(comparison_semantics IN ('HIGHER','LOWER','CONTEXT','NONE')),
  concept_definition text NOT NULL
);
CREATE TABLE units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), key text UNIQUE NOT NULL,
  currency_code char(3), period text, denominator text, label text NOT NULL
);
CREATE TABLE facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), canonical_career_id uuid NOT NULL REFERENCES canonical_careers,
  occupation_id uuid REFERENCES occupations, country_id uuid NOT NULL REFERENCES countries,
  geography_id uuid NOT NULL REFERENCES geographies, metric_id uuid NOT NULL REFERENCES metrics,
  source_release_id uuid NOT NULL REFERENCES source_releases, unit_id uuid REFERENCES units,
  status text NOT NULL CHECK(status IN ('AVAILABLE','NOT_AVAILABLE','NOT_APPLICABLE','SUPPRESSED','STALE')),
  numeric_value numeric, text_value text, boolean_value boolean, json_value jsonb,
  quality_status text NOT NULL CHECK(quality_status IN ('OFFICIAL','DERIVED','BENCHMARK','PROVISIONAL','ESTIMATED')),
  reference_period_start date, reference_period_end date, valid_from timestamptz NOT NULL DEFAULT now(),
  valid_to timestamptz, suppression_reason text, notes text,
  CHECK (
    (status <> 'AVAILABLE' AND numeric_value IS NULL AND text_value IS NULL AND boolean_value IS NULL AND json_value IS NULL)
    OR
    (status = 'AVAILABLE' AND num_nonnulls(numeric_value,text_value,boolean_value,json_value) = 1)
  )
);
CREATE UNIQUE INDEX facts_current_unique ON facts(canonical_career_id,country_id,geography_id,metric_id)
  WHERE valid_to IS NULL;
CREATE INDEX facts_lookup_idx ON facts(country_id,canonical_career_id,metric_id,status);
CREATE INDEX facts_release_idx ON facts(source_release_id);

CREATE TABLE fact_derivations (
  fact_id uuid PRIMARY KEY REFERENCES facts ON DELETE CASCADE,
  method_key text NOT NULL, formula text NOT NULL, assumptions jsonb NOT NULL DEFAULT '[]',
  code_version text NOT NULL, calculated_at timestamptz NOT NULL
);
CREATE TABLE fact_derivation_inputs (
  derived_fact_id uuid REFERENCES fact_derivations(fact_id) ON DELETE CASCADE,
  input_fact_id uuid REFERENCES facts, PRIMARY KEY(derived_fact_id,input_fact_id)
);

CREATE TABLE country_capabilities (
  country_id uuid REFERENCES countries ON DELETE CASCADE, metric_id uuid REFERENCES metrics,
  level text NOT NULL CHECK(level IN ('EXCELLENT','GOOD','LIMITED','UNAVAILABLE')),
  status text NOT NULL CHECK(status IN ('AVAILABLE','NOT_AVAILABLE','NOT_APPLICABLE','SUPPRESSED','STALE')),
  notes text NOT NULL, reviewed_at timestamptz NOT NULL,
  PRIMARY KEY(country_id,metric_id)
);
CREATE TABLE career_country_availability (
  country_id uuid REFERENCES countries ON DELETE CASCADE,
  canonical_career_id uuid REFERENCES canonical_careers ON DELETE CASCADE,
  status text NOT NULL CHECK(status IN ('FULL','GOOD','LIMITED','MAPPED_ONLY','UNAVAILABLE','REVIEW')),
  core_fact_count int NOT NULL DEFAULT 0, mapping_reviewed boolean NOT NULL DEFAULT false,
  profile_publishable boolean NOT NULL DEFAULT false,
  comparison_publishable boolean NOT NULL DEFAULT false,
  similar_career_publishable boolean NOT NULL DEFAULT false,
  computed_at timestamptz NOT NULL, PRIMARY KEY(country_id,canonical_career_id)
);

CREATE TABLE ingestion_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_id uuid NOT NULL REFERENCES sources,
  started_at timestamptz NOT NULL, finished_at timestamptz,
  status text NOT NULL CHECK(status IN ('QUEUED','RUNNING','SUCCEEDED','FAILED','QUARANTINED')),
  parser_version text NOT NULL, records_read int, records_written int, records_rejected int,
  error_summary jsonb
);
CREATE TABLE update_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_id uuid NOT NULL REFERENCES sources,
  schedule text NOT NULL, next_run_at timestamptz, expected_next_release timestamptz,
  last_successful_import timestamptz, latest_source_release_id uuid REFERENCES source_releases,
  enabled boolean NOT NULL DEFAULT true,
  stale_after interval NOT NULL, owner text NOT NULL
);
CREATE TABLE materialization_dirty_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), country_id uuid NOT NULL REFERENCES countries,
  canonical_career_id uuid REFERENCES canonical_careers,
  target text NOT NULL CHECK(target IN ('CAREER','COMPARISON','RANKING','SITEMAP','HREFLANG')),
  reason text NOT NULL, queued_at timestamptz NOT NULL DEFAULT now(), processed_at timestamptz
);
CREATE TABLE review_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), entity_type text NOT NULL,
  entity_id uuid NOT NULL, reason text NOT NULL, severity text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN', created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz, resolved_by text
);
