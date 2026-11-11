// Live package details from the pub.dev JSON API, fetched once per build/dev-server
// (memoized). The site is statically generated, so this runs at build time only —
// visitors never hit pub.dev. If the API is unreachable the static values from
// content.ts are used as a fallback so the build never fails.

import { packageName, version as staticVersion, facts as staticFacts } from './content';

export interface PackageInfo {
  /** Latest published version, e.g. `6.2.1`. */
  version: string;
  /** SPDX license identifier, e.g. `MIT`. */
  license: string;
  /** Values for the facts strip, in the same shape/order as `facts` in content.ts. */
  facts: { value: string; suffix?: string }[];
  /** False when the fallback values from content.ts are being used. */
  live: boolean;
}

interface PubPackageResponse {
  latest?: { version?: string };
}

interface PubScoreResponse {
  grantedPoints?: number;
  maxPoints?: number;
  tags?: string[];
}

const LICENSE_TAGS = new Set(['license:fsf-libre', 'license:osi-approved']);
const FETCH_TIMEOUT_MS = 5_000;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return (await res.json()) as T;
}

function deriveFacts(pkg: PubPackageResponse, score: PubScoreResponse, license: string): PackageInfo['facts'] {
  const tags = score.tags ?? [];
  const platformCount = tags.filter((t) => t.startsWith('platform:')).length;
  const verifiedPublisher = tags.some((t) => t.startsWith('publisher:'));
  return [
    { value: pkg.latest?.version ?? staticVersion },
    {
      value: String(score.grantedPoints ?? ''),
      suffix: score.maxPoints != null ? `/${score.maxPoints}` : undefined,
    },
    { value: String(platformCount) },
    { value: license },
    { value: verifiedPublisher ? '✓' : '–' },
  ];
}

async function load(): Promise<PackageInfo> {
  const [pkg, score] = await Promise.all([
    fetchJson<PubPackageResponse>(`https://pub.dev/api/packages/${packageName}`),
    fetchJson<PubScoreResponse>(`https://pub.dev/api/packages/${packageName}/score`),
  ]);
  const license =
    (score.tags ?? [])
      .filter((t) => t.startsWith('license:') && !LICENSE_TAGS.has(t))
      .map((t) => t.slice('license:'.length).toUpperCase())[0] ?? 'MIT';
  return {
    version: pkg.latest?.version ?? staticVersion,
    license,
    facts: deriveFacts(pkg, score, license),
    live: true,
  };
}

let pending: Promise<PackageInfo> | undefined;

/** Memoized: every component that awaits this shares one pair of HTTP requests. */
export function getPackageInfo(): Promise<PackageInfo> {
  pending ??= load().catch((err: unknown) => {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[pub] could not fetch package details (${reason}); using static fallback from content.ts.`);
    return { version: staticVersion, license: 'MIT', facts: staticFacts, live: false } satisfies PackageInfo;
  });
  return pending;
}
