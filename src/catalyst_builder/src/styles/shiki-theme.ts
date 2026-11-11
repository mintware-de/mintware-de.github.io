// Custom Shiki theme reproducing the hand-picked code palette of the original page.
// Used both by <Code> from 'astro:assets' (code blocks) and, for consistency,
// by markdown if it is ever introduced.
import type { ThemeRegistration } from '@shikijs/types';

export const catalystDark: ThemeRegistration = {
  name: 'catalyst-dark',
  type: 'dark',
  colors: {
    'editor.background': 'transparent',
    'editor.foreground': '#ECEFF4',
  },
  settings: [
    { settings: { foreground: '#ECEFF4', background: 'transparent' } },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#8D97A7' },
    },
    {
      scope: [
        'keyword',
        'storage',
        'storage.type',
        'storage.modifier',
        'keyword.control',
        'constant.language',
        'variable.language',
      ],
      settings: { foreground: '#5CC8FF' },
    },
    {
      scope: ['string', 'string.quoted.single.dart', 'string.quoted.double.dart'],
      settings: { foreground: '#F5C27A' },
    },
    {
      scope: ['meta.decorator', 'meta.decorator.dart', 'storage.type.annotation.dart', 'entity.name.type.annotation.dart', 'entity.name.tag.dart'],
      settings: { foreground: '#B8F34A' },
    },
  ],
};

/**
 * `catalystDark` is transparent on purpose: <Snippet> paints its own card and
 * lets the code sit on it. Markdown code blocks have no such wrapper, and Astro
 * inlines the theme background into a `style` attribute on the `<pre>`, which
 * CSS cannot override — so the docs code surface has to come from the theme.
 * Derived from `catalystDark` so the palette cannot drift; `#161B23` is
 * `--code-bg` in global.css.
 */
export const catalystDarkSurface: ThemeRegistration = {
  ...catalystDark,
  name: 'catalyst-dark-surface',
  colors: { ...catalystDark.colors, 'editor.background': '#161B23' },
  settings: (catalystDark.settings ?? []).map((rule, i) =>
    i === 0 ? { ...rule, settings: { ...rule.settings, background: '#161B23' } } : rule,
  ),
};
