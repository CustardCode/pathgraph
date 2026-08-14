# PathGraph global data architecture

Status: production foundation implemented; ingestion and PostgreSQL activation remain future phases. Reviewed 2026-08-14.

## A. Audit findings

Before this change, `app/page.tsx` contained the canonical presentation copy, all 40 country-career market records, four country configurations, currency formatting, availability rules and country-specific rendering branches. The page implicitly treated the US career object as both identity and US data. Canada used zero as a missing employment value. Capability and licence state were not machine-readable. Adding a country required changing data, logic and JSX together.

The visual design is strong and was preserved. The risk was the data boundary: expanding the previous pattern to 30 countries and 500 careers would create 15,000 coupled records with no reliable provenance, missing-data semantics or taxonomy lifecycle.

## B. Target architecture

```text
official source / API / file
        ↓ immutable raw release + hash
country adapter → normalized facts + national occupation nodes
        ↓                         ↓
source/licence registry     reviewed mapping edges
        ↓                         ↓
PostgreSQL fact store ← PathGraph canonical career graph
        ↓
capability + availability service
        ↓
country-aware page / compare API / SEO routes
```

The authoritative product identity is `canonical_careers`. National occupations are versioned nodes in their own taxonomies. Facts attach to a canonical career and, when applicable, the national occupation that generated them. Mapping edges are reviewable evidence, not hidden columns on a career row.

The implemented TypeScript foundation lives in `lib/pathgraph`: `catalog.ts`, `registry.ts`, `model.ts`, one adapter per country, and a UI-facing service. PostgreSQL is the production target; the local prototype still uses typed static seed records so the current local workflow remains simple.

## C. Schema and provenance

The executable design is in [`postgres-schema.sql`](./postgres-schema.sql). It includes:

- canonical careers, localized aliases and career-to-career relations;
- versioned taxonomy systems and hierarchical occupation nodes;
- many-to-many career/occupation mappings with quality, method, confidence, source, notes and review date;
- generic geography types and nodes, supporting country → region → state/province → metro without hardcoding names;
- source, immutable source release, licence and source/licence-scope registries;
- typed facts with explicit status, unit, geography, reference period, quality and source release;
- derived-fact formulas and input-fact lineage;
- country capability and career-country availability materializations;
- ingestion runs, schedules and human review queue.

Every available fact must contain exactly one value and a source release. Every unavailable fact must contain no value. `0` is therefore a real zero, never a missing-data marker. Derived annual values preserve native facts and record the formula and assumptions. Currency conversion, if later offered, must create a new derived fact with exchange-rate source and date; it must never overwrite native currency.

## D. Country adapter contract

Each adapter must return the same `CountryAdapter` contract:

```ts
type CountryAdapter = {
  countryId: CountryId;
  schemaVersion: "1.0";
  records: Record<CareerKey, CareerMarketRecord>;
};
```

An adapter owns only source-specific concerns: retrieval, parsing, national codes, native units, suppression markers and release metadata. It may not substitute another country. The shared service owns formatting, capability-aware display and comparisons.

Adapter tests must verify record count, taxonomy version, source release, units, status/value invariants, minimum coverage and the absence of cross-country source IDs. A new country is exposed only when its registry thresholds pass.

## E. Career identity and crosswalk strategy

Use a hybrid model:

1. PathGraph canonical careers are stable product concepts at a user-comprehensible level.
2. ISCO-08 is the international anchor and discovery layer, not the product’s primary key. The ILO describes 436 unit groups in a four-level global hierarchy; unit groups can still be broader than a PathGraph career.
3. National taxonomies remain authoritative for national facts: O*NET-SOC/SOC in the US, OSCA/ANZSCO in Australia, NOC in Canada, SOC 2020 in the UK and NOL in New Zealand.
4. ESCO is a valuable multilingual EU occupation/skills overlay. It should enrich skills and translations, not replace national wage mappings.
5. Prefer official concordances. Where none exists, use title-and-task review, record the method, and queue low-confidence or many-to-many cases for human review.

Mappings are edges with effective dates. One canonical career may map to several national occupations with coverage weights; one national occupation may map to several canonical careers. Aggregation is allowed only when the source concepts and denominator permit it. Otherwise the fact is `NOT_AVAILABLE` or a broader benchmark clearly labelled as such.

## F. Country selection and SEO

The production URL model is country-first:

- `/{country}/careers/{career-slug}`
- `/{country}/compare/{career-a}-vs-{career-b}`
- `/{country}/careers`

The selector is generated from the enabled country registry. A cookie may remember preference, but it must not be the canonical identity. Browser/locale detection may suggest a country on the neutral landing page; it must not silently redirect crawlers or overwrite an explicit URL choice.

Each country page self-canonicalizes. Every equivalent page publishes `hreflang` only for country/locale variants that meet availability thresholds, plus `x-default` to the neutral selector. A comparison page is indexable only when both careers have publishable core facts in that country. Query-string country variants are non-canonical. Slugs are stable; renamed careers use permanent redirects recorded in the alias table.

The current single-page prototype has not been split into routes yet. That is deliberately the next presentation layer, after database/API activation, not a reason to couple the data layer again.

## G. Capability and graceful degradation

Country capability is declared for salary, employment, outlook, education, licensing and subnational detail with both a quality level and a fact status. UI rows are generated from fact availability; the frontend no longer contains a separate hardcoded table for every country.

Publication thresholds are stricter than individual fact availability:

- **Career profile:** reviewed national mapping, localized title/description, a current official salary or employment fact, education/credential context, and at least three publishable core facts.
- **Comparison:** both profiles publishable and at least two shared quantitative metrics, including pay or employment. A page with only two titles and missing boxes is not created.
- **Similar-career page:** both profiles publishable plus reviewed similarity/work-signal coverage. A national salary mapping alone is insufficient.

The materialized publication state is `FULL`, `GOOD`, `LIMITED`, `MAPPED_ONLY`, `UNAVAILABLE` or `REVIEW`; only the first three can be considered for indexing, and `LIMITED` requires a country-specific editorial decision.

Display rules:

- `AVAILABLE`: show the value, native unit, reference period and provenance.
- `NOT_AVAILABLE`: show “Not available”; do not render zero or a substitute.
- `NOT_APPLICABLE`: explain the national data model, such as Canada’s province-specific outlook.
- `SUPPRESSED`: say “Suppressed” and preserve the official suppression reason.
- `STALE`: show the last reference period and an update-pending warning; exclude it from rankings by default.

The comparison engine uses only metrics available for both careers. Priority scoring uses the registry’s declared local momentum metric; it becomes neutral where none exists. Work-signal proxies are explicitly labelled.

## H. Licensing and compliance

Licensing is a release gate, not a note in a spreadsheet. Each source links to a licence record with commercial-reuse, attribution, derivative-work and review status. Exact attribution text and source release are retained alongside every public fact.

The initial registry includes conservative records for US public-domain material, O*NET CC BY 4.0, ABS CC BY 4.0, Canada’s Open Government Licence, UK OGL v3 and a review-required NZGOAL entry. Source-specific exceptions, logos, photographs, narrative text and website terms still require review even when the statistical dataset is open. Scraping is not automatically authorized by an open-data licence; access terms and robots/rate limits are separate checks.

Before enabling a country: verify commercial reuse; save the licence version and access date; record mandatory attribution; test whether transformed/derived values are allowed; identify API rate limits; and document deletion/correction obligations.

## I. Country expansion roadmap

See [`country-roadmap.md`](./country-roadmap.md). The recommended first wave is New Zealand, Netherlands, Sweden, Norway, Denmark and Finland. They combine strong official structured data, manageable classifications and comparatively clear reuse terms. Singapore follows because its official occupational wage coverage is excellent but access/licence details need confirmation. France and Germany offer strong career systems but greater parser and reuse complexity. Ireland is useful for audience adjacency but currently has weak detailed occupation-level earnings coverage from CSO, so it should not be assumed equivalent to the UK.

## J. Migration plan

1. **Complete now:** define canonical IDs, registry, capability/status types, adapter boundary and provenance model.
2. **Complete now:** migrate the four prototype markets into separate adapters and make the UI consume the shared service.
3. **Complete now:** New Zealand and Singapore are enabled through the standard adapter contract with explicit local provenance and missing-data states.
4. Activate PostgreSQL and seed taxonomy/source/licence registries.
5. Build raw-release storage, idempotent parsers and validation quarantine.
6. Import the current 40 records as immutable releases; dual-read against static adapters and compare outputs.
7. Move UI presentation copy/work signals into canonical career tables; remove the final page-local catalogue.
8. Add country-first routes, provenance drawers, canonical/hreflang metadata and a neutral country landing page.
9. Complete NOL mappings and NZ sources; enable only when threshold tests pass.
10. Expand careers in reviewed batches, prioritizing high-demand user queries and low-ambiguity mappings.

Rollback during dual-read is a feature flag back to the static adapters. No destructive migration is required. Imported releases are append-only; corrections close the previous fact’s `valid_to` and create a new version.

## K. Operational system

Each source has an update cadence and stale-after interval. The scheduler checks for new release identifiers or content hashes, stores raw inputs, runs a versioned parser, validates schema and coverage, then either publishes or quarantines. Sudden coverage loss, unit change, taxonomy version change, value outliers and unexplained suppression create review-queue items.

Successful imports enqueue only affected career, comparison, ranking, sitemap and hreflang materializations. An Australian update never triggers a blind Canada rebuild.

Recommended service objectives: source freshness visible within one business day of a scheduled release; 100% provenance completeness; zero cross-country fallbacks; 100% available facts passing unit/status constraints; and mapping review coverage above the country threshold.

Country onboarding is a checklist: source inventory → legal review → taxonomy import → official concordances → 10-career pilot → mapping review → adapter tests → UI copy/provenance QA → SEO availability QA → enable flag. Ownership must be named for data, mapping and legal review.

## L. Fifth-country proof

New Zealand is enabled through `nzAdapter` using Stats NZ NOL 3.0 mappings and clearly labelled Tahatū range midpoints. Singapore is enabled through `sgAdapter` using SSOC 2024 and the open MOM resident occupational wage dataset. Neither adapter contains a US or Australian labour-market fallback, and both meet the same record, provenance and mapping gates as the original markets.

## Key official references

- [ILO ISCO-08 structure](https://isco.ilo.org/en/isco-08/)
- [O*NET crosswalk files](https://www.onetcenter.org/crosswalks.html)
- [ESCO API and licence](https://esco.ec.europa.eu/en/use-esco/use-esco-services-api)
- [ABS ANZSCO–ISCO correspondence](https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021)
- [Stats NZ National Occupation List](https://www.stats.govt.nz/methods/about-the-national-occupation-list)
