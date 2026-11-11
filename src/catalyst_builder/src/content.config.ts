import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Docs migrated out of the GitHub wiki (mintware-de/catalyst_builder/wiki).
 * The slugs and `group`/`order` values reproduce `_Sidebar.md`, with
 * `configure-your-project` — which the wiki sidebar never linked — inserted
 * after the quickstart it belongs to.
 *
 * URLs are flat (`/docs/<slug>`): grouping is presentation, so it lives in
 * frontmatter rather than in the path. Content is English-only for now; the
 * surrounding chrome is translated, and a future `docs/<locale>/` tree can be
 * resolved with a per-locale lookup that falls back to this one.
 */
const docs = defineCollection({
  loader: glob({ base: './src/content/docs', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    group: z.enum(['Guides', 'Upgrading']),
    order: z.number().int(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs };
