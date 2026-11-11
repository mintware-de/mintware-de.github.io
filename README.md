# catalyst_builder landing page

Static marketing site for the Dart package [catalyst_builder](https://pub.dev/packages/catalyst_builder), built with [Astro](https://astro.build) and deployed to GitHub Pages.

Five locales — `en` (default, at `/`), `de`, `fr`, `it`, `es` (at `/de/`, `/fr/`, …). English is the fallback for both missing pages (`i18n.fallback` in the Astro config) and missing dictionary keys (the `deepMerge` in `src/i18n/index.ts`).

The Astro project lives in **`src/catalyst_builder/`**; the build output goes to **`docs/catalyst_builder/`** (set via `outDir`, git-ignored). The Pages workflow uploads that directory as the artifact, so published URLs don't depend on the output location.

## Commands

Run from the repo root (or `cd src/catalyst_builder` and drop the `--prefix`):

| Command | What it does |
| --- | --- |
| `npm run dev --prefix src/catalyst_builder` | Dev server with hot reload |
| `npm run build --prefix src/catalyst_builder` | Static build to `docs/catalyst_builder/` |
| `npm run preview --prefix src/catalyst_builder` | Serve the built site |
| `npm run check --prefix src/catalyst_builder` | Type check + i18n key-parity check |

## Where things live

- `src/catalyst_builder/src/pages/index.astro` — English page; `[lang]/index.astro` — generates the four prefixed locales via `getStaticPaths`. Both render the shared `Landing.astro`.
- `src/catalyst_builder/src/i18n/{en,de,fr,it,es}.json` — all translatable copy. **`en.json` is the schema**: add a key there first, then to the others (`npm run check` fails if they drift). Sentences may contain `` `inline code` `` backticks, rendered by `RichText.astro`.
- `src/catalyst_builder/src/data/content.ts` — deliberately **not** translated: version, package names, URLs, facts values, and all code snippets.
- `src/catalyst_builder/src/styles/global.css` — design tokens (`--accent`, `--bg`, …) as CSS variables; the only file with raw hex colors. Code highlighting palette lives in `src/styles/shiki-theme.ts`.
- `src/catalyst_builder/src/components/` — one component per page section plus `Snippet.astro` (Dart → Shiki, shell → plain text with accent `$`) and the SVG icons.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds from `src/catalyst_builder/` and publishes `docs/catalyst_builder/` via `actions/deploy-pages`. Set the repo's **Pages → Source** to **GitHub Actions** once.

Before the first push, set your actual GitHub username and repo name in **both**:

1. `src/catalyst_builder/astro.config.mjs` — `site` (user root, e.g. `https://<user>.github.io`) and `base` (e.g. `/<repo>`).
2. `src/catalyst_builder/public/robots.txt` — the `Sitemap:` line.

Everything else (asset URLs, sitemap, canonical/hreflang) derives from those two values.

## Reference

`reference/generated.original.html` is the original design-canvas export; `reference/page.static.html` is the resolved markup it was ported from (via `scripts/extract-static.mjs`). They are kept for diffing future changes, never shipped.
