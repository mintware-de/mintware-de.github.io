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
