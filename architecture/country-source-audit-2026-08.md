# PathGraph country source audit — August 2026

## Selection

New Zealand and Singapore were selected as Countries 5 and 6. New Zealand provides an English-language, New Zealand-specific taxonomy (NOL 3.0), open Stats NZ licensing and more than 800 official Tahatū career ideas. Singapore provides a distinct city-state labour market, the current SSOC 2024 taxonomy, open government wage data and SkillsFuture pathway context. Together they test both range-based and monthly-wage adapters without changing frontend country logic.

## New Zealand

- Occupation taxonomy: Stats NZ National Occupation List 3.0, released 1 January 2026, with ANZSCO and ISCO concordances.
- Salary source: Tahatū Career Navigator published occupation pay ranges. The midpoint is derived only for the shared annual comparison and remains labelled as a range midpoint.
- Employment source: not loaded at occupation level.
- Outlook source: not loaded; the older MBIE projection to 2028 is not presented as current occupation outlook.
- Skills source: O*NET descriptors only as a clearly labelled occupation proxy.
- Education source: Tahatū career pathways.
- Licence/reuse basis: Stats NZ and TEC/Tahatū content used under CC BY 4.0 with attribution.
- Release/review date: NOL 3.0; Tahatū pages reviewed 14 August 2026.
- Refresh method: curated release snapshot now; Tahatū Occupations API after an agreement is approved.
- Known limitations: no current occupation employment count or comparable national projection; some NOL mappings use strong concordance groupings rather than one-to-one titles.
- User action: apply for a Tahatū Occupations API agreement before automated bulk refreshes.

## Singapore

- Occupation taxonomy: Singapore Standard Occupational Classification 2024.
- Salary source: MOM Resident Occupational Wages, June 2024, distributed through data.gov.sg.
- Employment source: not loaded at granular occupation level.
- Outlook source: not loaded because there is no directly comparable occupation projection in the current adapter.
- Skills source: O*NET descriptors only as a clearly labelled occupation proxy.
- Education source: concise summaries based on SkillsFuture Skills Frameworks.
- Licence/reuse basis: MOM wage dataset under Singapore Open Data Licence v1.0. SkillsFuture is reference-only pending separate bulk-reuse confirmation.
- Release/review date: June 2024 wages, data.gov.sg dataset updated April 2026; SSOC 2024; reviewed 14 August 2026.
- Refresh method: data.gov.sg download API for wages; release-driven SSOC review.
- Known limitations: the open wage dataset covers private-sector resident employees in establishments with at least 25 employees; Dental Hygienist and Secondary School Teacher do not have a sufficiently specific wage row and remain unavailable.
- User action: none for wage refreshes. Seek SkillsFuture permission before ingesting substantial framework content automatically.
