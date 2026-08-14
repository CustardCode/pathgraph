# PathGraph V1 URL strategy

V1 publishes one canonical global page per career and one per approved comparison:

- `/careers/[career-slug]`
- `/compare/[canonical-pair]`

The country selector changes the page's evidence through `?country=us|au|ca|uk`. Query variants are not separate indexable pages; every page self-canonicalises to the clean global URL. UTM parameters are preserved when the country changes.

This avoids four near-identical country copies before each market has enough unique local depth. Career identity remains separate from country occupation records, so future local routes such as `/au/careers/registered-nurse` can use the same career template and adapter when local content becomes independently valuable. Those future pages should receive their own canonical, metadata and sitemap eligibility rather than being created automatically.

Comparison routes use the approved manifest in `lib/pathgraph/publishing.ts`. Only pairs passing both the editorial approval and live data-quality gates enter the comparison directory, static parameters and sitemap. Reversed pair URLs redirect to the deterministic canonical slug.
