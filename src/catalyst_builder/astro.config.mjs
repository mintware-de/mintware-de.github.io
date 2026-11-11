// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
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

export default defineConfig({
  site,
  base,
  output: 'static',
  // Default outDir (dist/ inside the project) — the Pages workflow stages it
  // at <artifact>/catalyst_builder/ so it serves under `base`.
  trailingSlash: 'ignore',
  // `devSitemap` is a no-op during build; @astrojs/sitemap only writes files
  // in astro:build:done, so this is what serves the XML under `astro dev`.
  integrations: [sitemap({ i18n: sitemapI18n }), devSitemap({ site, base, locales, defaultLocale })],
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
