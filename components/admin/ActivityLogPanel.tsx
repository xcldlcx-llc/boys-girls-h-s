import type { ChangelogEntry } from "@/lib/changelog";

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ActivityLogPanel({ entries }: { entries: ChangelogEntry[] }) {
  return (
    <div>
      <h2 className="text-2xl m-0 mb-1">Activity Log</h2>
      <p className="text-ink-soft text-[.85rem] mb-4">Every save to any settings panel, most recent first.</p>
      {entries.length === 0 ? (
        <p className="text-ink-soft text-[.9rem]">No changes have been saved yet.</p>
      ) : (
        <ul className="list-none m-0 p-0 grid gap-3">
          {entries.map((entry, idx) => (
            <li key={idx} className="border border-line rounded-xl p-4">
              <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1.5">
                <span className="font-black text-[.92rem]">{entry.panel}</span>
                <span className="text-ink-soft text-[.8rem]">{formatTimestamp(entry.timestamp)}</span>
              </div>
              <p className="text-[.85rem] text-ink-soft m-0 mb-1">{entry.email}</p>
              <p className="text-[.88rem] m-0 break-words">{entry.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
