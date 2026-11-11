# catalyst_builder landing page

Static marketing site for the Dart package [catalyst_builder](https://pub.dev/packages/catalyst_builder), built with [Astro](https://astro.build) and deployed to GitHub Pages at `https://mintware-de.github.io/catalyst_builder/`.

Five locales — `en` (default, at `/`), `de`, `fr`, `it`, `es` (at `/de/`, `/fr/`, …). English is the fallback for both missing pages (`i18n.fallback` in the Astro config) and missing dictionary keys (the `deepMerge` in `src/i18n/index.ts`).

This project lives in `src/catalyst_builder/` of the [pages repo](../..), which hosts the landing pages for all my projects — see the [root README](../../README.md).

## Commands

Run from this directory:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the built site |
| `npm run check` | Type check + i18n key-parity check |

## Where things live

- `src/pages/index.astro` — English page; `[lang]/index.astro` — generates the four prefixed locales via `getStaticPaths`. Both render the shared `Landing.astro`.
- `src/i18n/{en,de,fr,it,es}.json` — all translatable copy. **`en.json` is the schema**: add a key there first, then to the others (`npm run check` fails if they drift). Sentences may contain `` `inline code` `` backticks, rendered by `RichText.astro`.
- `src/data/content.ts` — deliberately **not** translated: version, package names, URLs, facts values, and all code snippets.
- `src/styles/global.css` — design tokens (`--accent`, `--bg`, …) as CSS variables; the only file with raw hex colors. Code highlighting palette lives in `src/styles/shiki-theme.ts`.
- `src/components/` — one component per page section plus `Snippet.astro` (Dart → Shiki, shell → plain text with accent `$`) and the SVG icons.

## Deploying to GitHub Pages

The repo is a user site (`mintware-de.github.io`), served from the domain root, so Astro builds with `base: '/catalyst_builder'` (default `outDir`, `dist/`) and the workflow at `.github/workflows/catalyst_builder.yml` stages the build into the Pages artifact nested at that path. Repo **Pages → Source** must be **GitHub Actions**.

The URL prefix lives in exactly three places — change all three together if it ever moves:

1. `astro.config.mjs` — `site` and `base`.
2. `public/robots.txt` — the `Sitemap:` line.
3. `.github/workflows/catalyst_builder.yml` — the staging path.

Everything else (asset URLs, sitemap, canonical/hreflang) derives from those values.
