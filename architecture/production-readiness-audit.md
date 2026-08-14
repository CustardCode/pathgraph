# PathGraph production-readiness data audit

Audited 14 August 2026. The original review covered ten careers and four countries; the same controls now govern twenty careers and six countries.

| Visible field | Origin | Production treatment |
| --- | --- | --- |
| Annual median earnings | Country adapter fact with source/release/reference-period provenance. Australia and Canada values are explicitly annualised; the UK Dental Hygienist value is a published range midpoint. | Shown when `AVAILABLE`; otherwise the headline and career library show “Not currently available”. |
| Native weekly/hourly earnings and published salary range | Country adapter fact. | Shown only when one side is `AVAILABLE`; hourly values retain cents. |
| Employment and employment change | Country adapter fact where supported. | Hidden when neither career has a supported fact. |
| Projected growth / openings / local market signal | Country adapter and registry capability declaration. | Unsupported values are never substituted from another country. Canada explicitly shows “Varies by province”; other unavailable values show “Not available”. |
| Typical education and credential route | Country adapter fact, with a visible warning that credentials must be checked with the local regulator. | Shown as context, not scored as an official ranking. |
| Work signals | Seeded O*NET-derived percentile model. Non-US pages declare that the signals are a US O*NET proxy, not local labour-market evidence. | Kept as comparison context with the proxy disclosure visible. These are not ratings. |
| Similarity score and component scores | Seeded PathGraph experimental model output for the original covered pairs. | Kept, but labelled as an experimental PathGraph calculation rather than an official statistic or transition-feasibility measure. New or missing pairs render an explicit unavailable state instead of inventing a score. |
| Priority fit score | Client-side calculation using official pay/trend inputs plus editorial entry/schedule bands and work-signal percentiles. | Kept as an exploration tool with a prominent experimental/not-a-recommendation disclosure. Missing official inputs use a neutral score rather than a fabricated fact. |
| Career summaries, kickers and strengths | Editorial copy informed by occupation descriptions and O*NET-derived domains. | Market-neutral language only. No country-specific demand claim is embedded in shared copy. |

## Status handling

- `AVAILABLE`: format and display the fact.
- `NOT_AVAILABLE`: display only when its comparison row is otherwise relevant; otherwise omit the unsupported row.
- `NOT_APPLICABLE`: show the declared registry explanation, such as Canada’s province-level outlook limitation.
- `SUPPRESSED`: show “Suppressed” when the paired row is visible.
- `STALE`: show “Update pending”; stale facts are never silently presented as current.

## Operational warnings

- Current official values are curated snapshots, not an automated ingestion pipeline. Release and reference-period provenance are retained per fact, but refresh checks are still manual.
- Several occupation mappings are broad or manually reviewed. The interface exposes differing local titles and mapping quality rather than pretending they are exact.
- Work signals are locally sourced only for the United States. Other markets visibly use the US O*NET proxy declared by the country registry.
- The experimental model and editorial scoring bands need a versioned methodology and calibration process before PathGraph can present them as anything stronger than exploratory guidance.

## Route readiness

Canonical career keys, country IDs, adapter-backed market views and unordered pair keys are already separated from the homepage UI. This is sufficient to add `/careers/[career]` and `/compare/[left]-vs-[right]` routes without changing the data model. The remaining work is URL/state synchronisation, metadata and invalid-route handling.
