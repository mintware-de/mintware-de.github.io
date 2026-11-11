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
