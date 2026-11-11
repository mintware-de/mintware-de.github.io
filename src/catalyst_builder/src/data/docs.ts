import type { CollectionEntry } from 'astro:content';

export type DocsEntry = CollectionEntry<'docs'>;

/** `guides/x.md` and `x.md` both reduce to the URL slug `x`. */
export function docsSlug(entry: DocsEntry): string {
  return entry.id.replace(/\.md$/, '');
}

/** Sidebar order: the wiki's two sections, then `order` within each. */
const GROUP_RANK: Record<DocsEntry['data']['group'], number> = { Guides: 0, Upgrading: 1 };

export function compareDocs(a: DocsEntry, b: DocsEntry): number {
  return GROUP_RANK[a.data.group] - GROUP_RANK[b.data.group] || a.data.order - b.data.order;
}

/** Everything that should be reachable: published, in sidebar order. */
export function selectDocs(entries: DocsEntry[]): DocsEntry[] {
  return entries.filter((e) => !e.data.draft).sort(compareDocs);
}

/** The entries of the same section, for a grouped sidebar. */
export function docsGroups(entries: DocsEntry[]): [DocsEntry['data']['group'], DocsEntry[]][] {
  const groups = new Map<DocsEntry['data']['group'], DocsEntry[]>();
  for (const entry of entries) {
    const list = groups.get(entry.data.group) ?? [];
    list.push(entry);
    groups.set(entry.data.group, list);
  }
  return [...groups.entries()];
}
