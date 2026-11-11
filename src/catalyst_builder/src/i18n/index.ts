import en from './en.json';
import de from './de.json';
import fr from './fr.json';
import it from './it.json';
import es from './es.json';

export const locales = ['en', 'de', 'fr', 'it', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** en.json is the schema source of truth for all dictionaries. */
export type Dict = typeof en;

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Objects merge recursively, arrays replace wholesale, undefined falls back to base. */
function deepMerge<T>(base: T, over: unknown): T {
  if (isObj(base) && isObj(over)) {
    const out: Record<string, unknown> = { ...base };
    for (const k of Object.keys(over)) {
      out[k] = deepMerge((base as Record<string, unknown>)[k], over[k]);
    }
    return out as T;
  }
  return (over === undefined ? base : over) as T;
}

/**
 * Endonyms — deliberately NOT dictionary keys. A visitor picks their own
 * language, so every menu shows each name in its own language ("Français",
 * never "Francés"); translating them would defeat the control.
 */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
};

/**
 * Root-relative link target for a locale, with the trailing slash the
 * canonical/hreflang URLs use: `/catalyst_builder/` for the default locale,
 * `/catalyst_builder/de/` otherwise. Keep this the only definition of "what is
 * a locale URL" — nav links, canonicals and hreflangs must agree exactly,
 * otherwise `trailingSlash: 'ignore'` silently doubles every page.
 */
export function localePath(l: Locale): string {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');
  return l === defaultLocale ? `${base}/` : `${base}/${l}/`;
}

/**
 * Client-side locale preference contract, shared by the negotiation script in
 * pages/index.astro and LanguageSwitcher's click handler. Both are `is:inline`
 * scripts and must agree byte-for-byte, so the names live here and are passed
 * in via `define:vars` rather than duplicated as literals.
 */
export const LOCALE_STORAGE_KEY = 'cb-locale';
export const LOCALE_DECIDED_KEY = 'cb-locale-decided';

const dicts: Record<Locale, unknown> = { en, de, fr, it, es };

const get = (o: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((a, c) => (a as Record<string, unknown>)?.[c], o);

export function useTranslations(locale: Locale) {
  const dict = deepMerge<Dict>(en, dicts[locale]);
  const t = (key: string): string => {
    const v = get(dict, key);
    return typeof v === 'string' ? v : ((get(en, key) as string | undefined) ?? `[${key}]`);
  };
  return { t, dict, locale };
}
