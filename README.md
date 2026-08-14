# PathGraph

Global career comparison and career intelligence website using country-specific labour-market data.

[View the GitHub Pages site](https://custardcode.github.io/pathgraph/)

## Current coverage

- Six countries: United States, Australia, Canada, United Kingdom, New Zealand and Singapore
- 20 quality-gated career profiles
- 76 approved career comparisons
- 101 indexable production pages

PathGraph combines official, source-dated salary, labour-market, occupation-classification and education information. Career information is informational only and is not personal career, immigration, licensing or financial advice.

## Local development

Requirements: Node.js 22.13+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000/`.

## Validation and production build

```bash
pnpm lint
pnpm test
```

The GitHub Pages build uses configurable deployment values:

```bash
NEXT_PUBLIC_SITE_URL=https://custardcode.github.io \
NEXT_PUBLIC_BASE_PATH=/pathgraph \
pnpm build

pnpm test:pages
```

- `NEXT_PUBLIC_SITE_URL` is the public origin.
- `NEXT_PUBLIC_BASE_PATH` is the repository subpath.
- Canonicals, sitemap URLs, robots.txt, Open Graph assets, application assets and internal links derive from these settings.

Changing those two values is the only URL-architecture change required when PathGraph moves to its permanent domain.

## Data architecture

- `lib/pathgraph/catalog.ts`: canonical career identities and ISCO anchors
- `lib/pathgraph/registry.ts`: country, capability, source and licence registries
- `lib/pathgraph/adapters/`: normalized country adapters
- `architecture/country-source-audit-2026-08.md`: current source and licensing audit
- `architecture/global-data-architecture.md`: international expansion model

## Deployment

Pushes to `main` run lint, create a complete static export, test every sitemap URL, upload `dist/client` and deploy through the official GitHub Pages Actions workflow in `.github/workflows/deploy-pages.yml`.
