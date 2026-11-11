// Fail if any locale dictionary drifts from en.json's key shape (arrays compared
// by length + per-index key sets). Run via `npm run check`.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'i18n');
const locales = ['de', 'fr', 'it', 'es'];

const shape = (v) => {
  if (Array.isArray(v)) return v.map(shape);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, shape(v[k])]));
  return typeof v;
};

const en = JSON.parse(readFileSync(join(root, 'en.json'), 'utf8'));
let failed = false;

for (const locale of locales) {
  const dict = JSON.parse(readFileSync(join(root, `${locale}.json`), 'utf8'));
  const diffs = [];
  (function walk(a, b, path) {
    if (Array.isArray(a) || Array.isArray(b)) {
      if (!Array.isArray(a) || !Array.isArray(b)) { diffs.push(`${path}: array/type mismatch`); return; }
      if (a.length !== b.length) { diffs.push(`${path}: length ${a.length} vs ${b.length}`); return; }
      a.forEach((x, i) => walk(x, b[i], `${path}[${i}]`));
      return;
    }
    if (a && typeof a === 'object') {
      if (!b || typeof b !== 'object') { diffs.push(`${path}: object missing/typed wrong`); return; }
      const ka = Object.keys(a), kb = Object.keys(b);
      for (const k of ka) if (!(k in b)) diffs.push(`${path}.${k}: missing`);
      for (const k of kb) if (!(k in a)) diffs.push(`${path}.${k}: extra`);
      for (const k of ka) if (k in b) walk(a[k], b[k], `${path}.${k}`);
      return;
    }
    if (typeof a !== typeof b) diffs.push(`${path}: type ${typeof a} vs ${typeof b}`);
  })(en, dict, locale);

  if (diffs.length) {
    failed = true;
    console.error(`\n${locale}.json drifts from en.json:`);
    for (const d of diffs) console.error(`  - ${d}`);
  } else {
    console.log(`${locale}.json: in sync with en.json`);
  }
}

process.exit(failed ? 1 : 0);
