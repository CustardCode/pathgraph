# Country expansion roadmap

Scores are directional (1 low, 5 high) and should be revalidated during onboarding. “Source” means official occupational data exists; it does not mean every PathGraph metric is available at the desired detail.

| Rank | Country | Demand | Data quality | API/structure | Mapping | Licence clarity | Complexity | Recommended phase |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | New Zealand | 4 | 4 | 4 | 5 | 3 | 2 | Pilot now |
| 2 | Netherlands | 4 | 5 | 5 | 4 | 5 | 2 | Wave 1 |
| 3 | Sweden | 3 | 5 | 5 | 4 | 5 | 2 | Wave 1 |
| 4 | Norway | 3 | 5 | 5 | 4 | 5 | 2 | Wave 1 |
| 5 | Denmark | 3 | 5 | 5 | 4 | 5 | 2 | Wave 1 |
| 6 | Finland | 3 | 5 | 5 | 4 | 5 | 2 | Wave 1 |
| 7 | Singapore | 4 | 5 | 3 | 3 | 2 | 3 | Wave 2 after legal/API review |
| 8 | France | 5 | 4 | 4 | 4 | 4 | 4 | Wave 2 |
| 9 | Germany | 5 | 5 | 2 | 3 | 2 | 4 | Wave 2 after terms review |
| 10 | Switzerland | 3 | 5 | 4 | 4 | 4 | 4 | Wave 2 multilingual |
| 11 | Spain | 4 | 4 | 4 | 4 | 4 | 3 | Wave 3; wage detail may be broad |
| 12 | Japan | 5 | 5 | 2 | 2 | 2 | 5 | Wave 3 localized product |
| 13 | South Korea | 4 | 4 | 4 | 2 | 3 | 5 | Wave 3 localized product |
| 14 | Ireland | 4 | 4 | 4 | 5 | 4 | 2 | Hold: detailed occupational pay gap |
| 15 | Portugal | 3 | 4 | 3 | 4 | 4 | 3 | Wave 3 |

## Why the first wave

- **New Zealand:** adjacent audience and a current NOL with concordances to ANZSCO and ISCO-08. Stats NZ provides a machine-readable API portal, but the exact pay/outlook source and licence scope must be signed off before facts are enabled.
- **Netherlands:** CBS exposes StatLine as machine-readable OData and identifies its portal data as CC BY 4.0.
- **Sweden:** Statistics Sweden exposes official data by API under CC0, reducing licence friction.
- **Norway:** Statistics Norway exposes Statbank and classification APIs without registration under CC BY 4.0.
- **Denmark:** StatBank provides a documented API and explicitly permits commercial reuse under CC BY 4.0 with attribution.
- **Finland:** StatFin uses PxWeb, publishes an open classifications API, and uses CC BY 4.0.

## Important holds

- **Ireland:** CSO says its current detailed earnings release reaches only three broad occupation groups, so it cannot yet support ten specific careers with a comparable salary metric without a second authoritative source.
- **Germany:** Entgeltatlas is valuable but production access and reuse terms need source-specific legal and technical review; do not build on browser scraping.
- **Japan:** MHLW job tag is unusually rich, but the terms, machine access, Japanese taxonomy alignment and full localization make it a separate product phase.
- **Singapore:** MOM publishes annual wages across 300+ SSOC-coded occupations. Validate bulk/API access and commercial reuse terms before implementation.

## Official evidence used

- [Stats NZ NOL and concordances](https://www.stats.govt.nz/methods/about-the-national-occupation-list)
- [CBS StatLine open data](https://www.cbs.nl/en-gb/onze-diensten/open-data/statline-as-open-data)
- [Statistics Sweden open API / CC0](https://www.scb.se/en/services/open-data-api/)
- [Statistics Norway APIs / CC BY 4.0](https://www.ssb.no/en/api)
- [Statistics Denmark API / CC BY 4.0](https://www.dst.dk/en/Statistik/hjaelp-til-statistikbanken/api)
- [Statistics Finland open data / CC BY 4.0](https://stat.fi/en/services/statistical-data-services/open-data-and-interfaces)
- [Singapore MOM occupational wages](https://stats.mom.gov.sg/SL/Pages/Occupational-Wages-Data-and-Other-Resources.aspx)
- [Ireland CSO earnings FAQ](https://www.cso.ie/en/methods/earnings/earnings-faqs/)
- [Spain INE API](https://www.ine.es/dyngs/DAB/en/index.htm?cid=1100)
- [Japan MHLW job tag](https://shigoto.mhlw.go.jp/User/)
- [Korea KOSIS OpenAPI](https://sso.kosis.kr/openapi/devGuide/devGuide_0201List.do)
- [Swiss FSO occupational salary table](https://www.pxweb.bfs.admin.ch/pxweb/en/px-x-0304010000_205/px-x-0304010000_205/px-x-0304010000_205.px/)

