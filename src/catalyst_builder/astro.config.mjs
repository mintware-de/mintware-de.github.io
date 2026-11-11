// @ts-check
import { readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mermaid from 'astro-mermaid';
import { devSitemap } from './scripts/dev-sitemap.mjs';
import { catalystDark } from './src/styles/shiki-theme';

// GitHub Pages USER site (mintware-de/mintware-de.github.io): served from the
// domain root, so the site lives under `base` — the deploy workflow nests the
// build output at that path in the Pages artifact. When the path changes,
// update `base` here + the Sitemap line in public/robots.txt + the staging
// path in .github/workflows/catalyst_builder.yml — nothing else references the prefix.
const site = 'https://mintware-de.github.io';
const base = '/catalyst_builder';

const locales = ['en', 'de', 'fr', 'it', 'es'];
const defaultLocale = 'en';

// The [lang] routes are hand-rolled (getStaticPaths); the sitemap plugin
// correlates locale pages itself once told which URL segment is the locale
// (values here are hreflang output tags, not paths).
const sitemapI18n = {
  defaultLocale,
  locales: Object.fromEntries(locales.map((l) => [l, l])),
};

// Docs URLs are `/docs/<slug>`, served by a `[slug]` route whose values come
// from getStaticPaths — which `astro dev` never runs, so the dev sitemap would
// otherwise lose every docs page but the index. The slugs are just the content
// file names, so enumerate them here and hand them to the dev sitemap.
// Read once at config load: a file added while the dev server is running shows
// up after a restart, which is the same staleness the rest of the config has.
// (A page marked `draft: true` would still be listed in dev; the build drops
// it at getStaticPaths, so the divergence is dev-only and self-corrects.)
const docsSlugs = readdirSync(new URL('./src/content/docs', import.meta.url), {
  recursive: true,
})
  .map(String)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));
const docsPaths = docsSlugs.flatMap((slug) => [
  `/docs/${slug}`,
  ...locales.filter((l) => l !== defaultLocale).map((l) => `/${l}/docs/${slug}`),
]);

export default defineConfig({
  site,
  base,
  output: 'static',
  // Default outDir (dist/ inside the project) — the Pages workflow stages it
  // at <artifact>/catalyst_builder/ so it serves under `base`.
  trailingSlash: 'ignore',
  // `devSitemap` is a no-op during build; @astrojs/sitemap only writes files
  // in astro:build:done, so this is what serves the XML under `astro dev`.
  // `mermaid` is here for its injected client renderer — the only piece we use.
  // Our docs fences are converted to `<pre class="mermaid">` by our own remark
  // plugin (src/plugins/docs-links.mjs), because the docs are rendered through
  // a pipeline we own rather than the config-level markdown chain. The script
  // loads mermaid lazily and only on pages that actually contain a diagram.
  // `autoTheme` is off: this site is dark-only, there is no data-theme to follow.
  integrations: [
    mermaid({ theme: 'dark', autoTheme: false }),
    sitemap({ i18n: sitemapI18n }),
    devSitemap({ site, base, locales, defaultLocale, extraPaths: docsPaths }),
  ],
  i18n: {
    defaultLocale,
    locales,
    // No route-level `fallback` map on purpose: with hand-rolled [lang]
    // routes it made Astro render every route under every locale prefix
    // (/it/de/, /de/404/, …), shipping ~20 duplicate pages. Missing
    // translation *keys* still fall back to en via the deepMerge in
    // src/i18n/index.ts.
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: { theme: catalystDark, wrap: false },
  },
});
