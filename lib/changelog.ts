import { get } from "@vercel/edge-config";
import { writeSetting } from "@/lib/settings-write";

export interface ChangelogEntry {
  timestamp: string;
  email: string;
  panel: string;
  summary: string;
}

const MAX_ENTRIES = 100;

export async function getChangelog(): Promise<ChangelogEntry[]> {
  try {
    const value = await get<ChangelogEntry[]>("changelog");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export async function appendChangelogEntry(entry: ChangelogEntry): Promise<{ ok: true } | { ok: false; error: string }> {
  const current = await getChangelog();
  const next = [entry, ...current].slice(0, MAX_ENTRIES);
  return writeSetting("changelog", next);
}

/** Compares two flat settings objects and produces a human-readable summary of what changed. */
export function diffSummary<T extends object>(before: T, after: T): string {
  const changes: string[] = [];
  for (const key of Object.keys(after) as (keyof T)[]) {
    const beforeVal = before[key];
    const afterVal = after[key];
    if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
      changes.push(`${String(key)}: ${JSON.stringify(beforeVal)} → ${JSON.stringify(afterVal)}`);
    }
  }
  return changes.length ? changes.join("; ") : "No changes";
}
