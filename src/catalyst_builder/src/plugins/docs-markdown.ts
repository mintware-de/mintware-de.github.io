// Pinned to exactly the version astro@5.16 depends on (see package.json). This
// must stay in lockstep with Astro's own copy: it is the same markdown engine,
// and a second major alongside Astro's would mean docs and any config-level
// markdown (astro-mermaid's plugins, markdown.shikiConfig) diverge.
import { createMarkdownProcessor, parseFrontmatter } from '@astrojs/markdown-remark';
import type { Locale } from '../i18n';
import { docsPath } from '../i18n';
import { catalystDarkSurface } from '../styles/shiki-theme';
import { docsLinks, mermaidBlocks } from './docs-links.mjs';

/**
 * Docs are rendered here instead of with `render()` from `astro:content`.
 *
 * `astro:content`'s render takes no render options — the markdown is
 * pre-compiled by the content layer (see `renderEntry` in
 * `astro/dist/content/runtime.js`), so any plugins passed to it are dropped
 * silently. The links would keep their `docs:` scheme and mermaid fences would
 * reach the page as inert code. Owning the pipeline costs us a little wiring
 * (shiki config + the two plugins below) and buys the locale, which a markdown
 * plugin cannot otherwise know.
 *
 * The processor is cached per locale because unified options are fixed at
 * construction — the `docsLinks` prefix is the only thing that varies, and
 * building a shiki highlighter per page would be pure waste.
 */
type DocsProcessor = Awaited<ReturnType<typeof createMarkdownProcessor>>;

const processors = new Map<Locale, Promise<DocsProcessor>>();

function getProcessor(locale: Locale): Promise<DocsProcessor> {
  let cached = processors.get(locale);
  if (!cached) {
    cached = createMarkdownProcessor({
      syntaxHighlight: 'shiki',
      // The surface variant, not catalystDark: see the comment in shiki-theme.ts.
      shikiConfig: { theme: catalystDarkSurface, wrap: false },
      // Factories + options tuples, never pre-built transformers (see docs-links.mjs).
      remarkPlugins: [mermaidBlocks, [docsLinks, { prefix: docsPath(locale) }]],
    });
    processors.set(locale, cached);
  }
  return cached;
}

export interface RenderedDoc {
  html: string;
  headings: { depth: number; slug: string; text: string }[];
}

/**
 * Renders a docs entry's body for one locale.
 *
 * `parseFrontmatter` is not optional: `processor.render` does not strip it, so
 * a `---` block is parsed as a setext heading and every page grows a heading
 * titled "title: …\ndescription: …". The validated frontmatter already lives on
 * `entry.data`, put there by the collection schema.
 */
export async function renderDoc(body: string | undefined, locale: Locale): Promise<RenderedDoc> {
  const { content } = parseFrontmatter(body ?? '', { frontmatter: 'remove' });
  const { code, metadata } = await (await getProcessor(locale)).render(content);
  return { html: code, headings: metadata.headings ?? [] };
}
