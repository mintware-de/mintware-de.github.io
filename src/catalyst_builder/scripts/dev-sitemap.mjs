// @ts-check

/**
 * Dev-server companion to @astrojs/sitemap.
 *
 * @astrojs/sitemap only writes sitemap files in the `astro:build:done` hook,
 * so `astro dev` has no /sitemap-index.xml to hit. This integration serves
 * byte-compatible index + urlset XML from the dev server's middleware stack,
 * derived from the resolved route tree so it tracks page additions.
 *
 * Only meaningful in `dev`; a no-op during build (the real integration owns
 * the files then).
 */

const XML_DECL = '<?xml version="1.0" encoding="UTF-8"?>';
const URLSET_NS =
  'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
  'xmlns:xhtml="http://www.w3.org/1999/xhtml"';
const INDEX_NS = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

/**
 * @typedef {{
 *   site: string,          // canonical origin, no trailing slash
 *   base: string,          // path prefix, e.g. '/catalyst_builder' ('' for root)
 *   locales: string[],     // locale codes, in output order
 *   defaultLocale: string, // locale served without a prefix
 * }} DevSitemapOptions
 */

const escape = (/** @type {string} */ s) =>
  s.replace(
    /[<>&'"]/g,
    (c) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] ?? c,
  );

/** Strip the `base` prefix and any trailing slash; '/' stays '/'. */
const normalize = (/** @type {string} */ pathname, /** @type {string} */ base) => {
  let p = pathname;
  if (base && (p === base || p.startsWith(base + '/'))) p = p.slice(base.length);
  p = p.replace(/\/+$/, '');
  return p === '' ? '/' : p;
};

/** '/de' -> '/de/', '/' -> '/'. Matches @astrojs/sitemap `trailingSlash: 'ignore'` output. */
const withTrailing = (/** @type {string} */ p) => (p === '/' ? '/' : p + '/');

/** '/de/pricing' -> '/pricing' (locale segment removed); '/pricing' -> '/pricing'. */
const pageKey = (/** @type {string} */ p, /** @type {string[]} */ locales) => {
  const segs = p.split('/').filter(Boolean);
  if (segs.length > 0 && locales.includes(segs[0])) {
    const rest = segs.slice(1).join('/');
    return rest === '' ? '/' : '/' + rest;
  }
  return p;
};

/** Every locale's path for a page key, in `locales` order. */
const localeVariants = (
  /** @type {string} */ key,
  /** @type {DevSitemapOptions} */ opts,
) =>
  opts.locales.map((l) => ({
    locale: l,
    path:
      l === opts.defaultLocale
        ? key
        : key === '/'
          ? '/' + l
          : key + '/' + l,
  }));

/**
 * Concrete static paths from resolved route pathnames: `[lang]`/`{lang}`
 * segments expanded to the locale list; any other dynamic segment (or 404)
 * makes the route unenumerable and it is skipped.
 */
const expandRoutes = (
  /** @type {string[]} */ pathnames,
  /** @type {DevSitemapOptions} */ opts,
) => {
  /** @type {Set<string>} */
  const paths = new Set();
  for (const pathname of pathnames) {
    if (pathname === '/404' || pathname.endsWith('/404')) continue;
    const segs = pathname.split('/').filter(Boolean);
    const dynamic = segs.filter((s) => /^[[{]/.test(s));
    if (dynamic.length === 0) {
      paths.add(pathname);
    } else if (dynamic.every((s) => s === '[lang]' || s === '{lang}')) {
      for (const l of opts.locales) {
        if (l === opts.defaultLocale) continue; // [lang] routes skip the default
        paths.add('/' + segs.map((s) => (s === '[lang]' || s === '{lang}' ? l : s)).join('/'));
      }
    }
    // other dynamic routes can't be enumerated statically — omit
  }
  return paths;
};

/**
 * Group paths into locale-correlated pages. A group is only emitted when
 * every locale variant exists, so partial translations never advertise
 * missing alternates.
 */
const buildPages = (
  /** @type {Set<string>} */ paths,
  /** @type {DevSitemapOptions} */ opts,
) => {
  /** @type {Map<string, Set<string>>} */
  const groups = new Map();
  for (const p of paths) {
    const key = pageKey(p, opts.locales);
    const group = groups.get(key) ?? new Set();
    groups.set(key, group);
    group.add(p);
  }
  /** @type {{ locale: string, path: string }[][]} */
  const pages = [];
  for (const key of [...groups.keys()].sort()) {
    const existing = groups.get(key);
    if (!existing) continue;
    const variants = localeVariants(key, opts);
    if (variants.every((v) => existing.has(v.path))) pages.push(variants);
  }
  return pages;
};

const urlsetXml = (
  /** @type {Set<string>} */ paths,
  /** @type {DevSitemapOptions} */ opts,
) => {
  const origin = opts.site.replace(/\/+$/, '') + (opts.base === '/' ? '' : opts.base);
  const loc = (/** @type {string} */ p) => escape(origin + withTrailing(p));
  let xml = `${XML_DECL}<urlset ${URLSET_NS}>`;
  for (const page of buildPages(expandRoutes([...paths], opts), opts)) {
    for (const v of page) {
      xml += `<url><loc>${loc(v.path)}</loc>`;
      for (const a of page) {
        xml += `<xhtml:link rel="alternate" hreflang="${a.locale}" href="${loc(a.path)}"/>`;
      }
      xml += '</url>';
    }
  }
  return xml + '</urlset>';
};

const indexXml = (/** @type {DevSitemapOptions} */ opts) => {
  const origin = opts.site.replace(/\/+$/, '') + (opts.base === '/' ? '' : opts.base);
  return (
    XML_DECL +
    `<sitemapindex ${INDEX_NS}>` +
    `<sitemap><loc>${escape(origin + '/sitemap-0.xml')}</loc></sitemap>` +
    '</sitemapindex>'
  );
};

/**
 * Astro integration: serves `/sitemap-index.xml` and `/sitemap-0.xml` (with
 * or without the `base` prefix) from the dev server.
 *
 * @param {DevSitemapOptions} options
 * @returns {import('astro').AstroIntegration}
 */
export function devSitemap(options) {
  /** @type {Set<string>} */
  let pathnames = new Set();
  /** @type {import('astro').AstroIntegration} */
  return {
    name: 'dev-sitemap',
    hooks: {
      'astro:routes:resolved': ({ routes }) => {
        // In dev, dynamic routes have no `pathname` — `pattern` (without the
        // base prefix) is the reliable source.
        pathnames = new Set(
          routes
            .filter((r) => r.type === 'page')
            // 404 is excluded in expandRoutes; the component field isn't on
            // the public route type from this hook.
            .map((r) => normalize(r.pathname ?? r.pattern ?? '/', options.base)),
        );
      },
      'astro:config:setup': ({ command, updateConfig }) => {
        if (command !== 'dev') return;
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'dev-sitemap:middleware',
                configureServer(server) {
                  server.middlewares.use((req, res, next) => {
                    const raw = decodeURIComponent((req.url ?? '').split('?')[0]);
                    const p = normalize(raw, options.base);
                    const xml =
                      p === '/sitemap-index.xml'
                        ? indexXml(options)
                        : p === '/sitemap-0.xml'
                          ? urlsetXml(pathnames, options)
                          : null;
                    if (xml === null) return next();
                    res.setHeader('Content-Type', 'application/xml');
                    res.end(xml);
                  });
                },
              },
            ],
          },
        });
      },
    },
  };
}
