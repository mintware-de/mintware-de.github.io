// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { catalystDark } from './src/styles/shiki-theme';

// GitHub Pages PROJECT site: `site` is the user root, `base` is the repo name.
// When the repo is created (or renamed), change `site`/`base` here + the Sitemap
// line in public/robots.txt — nothing else references the prefix.
const site = 'https://julian.github.io';
const base = '/catalyst_builder_website';

// The [lang] routes are hand-rolled (getStaticPaths); the sitemap plugin
// correlates locale pages itself once told which URL segment is the locale
// (values here are hreflang output tags, not paths).
const sitemapI18n = {
  defaultLocale: 'en',
  locales: { en: 'en', de: 'de', fr: 'fr', it: 'it', es: 'es' },
};

export default defineConfig({
  site,
  base,
  output: 'static',
  // Default outDir (dist/ inside the project) — the Pages workflow uploads
  // src/catalyst_builder/dist as the artifact.
  trailingSlash: 'ignore',
  integrations: [sitemap({ i18n: sitemapI18n })],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'it', 'es'],
    // Route-level fallback (a locale page that doesn't exist yet renders the
    // fallback locale's page instead of 404). Missing *keys* fall back to en
    // via the deepMerge in src/i18n/index.ts — different mechanism, both set.
    fallback: { de: 'en', fr: 'en', it: 'en', es: 'en' },
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: { theme: catalystDark, wrap: false },
  },
});
