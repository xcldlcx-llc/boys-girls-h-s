/** Server-only. Writes go through the Vercel API, not the @vercel/edge-config SDK (that's read-only). */
export async function writeSetting(key: string, value: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const writeToken = process.env.VERCEL_WRITE_TOKEN;

  if (!edgeConfigId || !writeToken) {
    return {
      ok: false,
      error:
        "Settings storage isn't fully connected yet — a Vercel API token (VERCEL_WRITE_TOKEN) still needs to be added. Changes were not saved.",
    };
  }

  const res = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${writeToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ operation: "upsert", key, value }],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, error: `Vercel Edge Config write failed (${res.status}): ${text.slice(0, 300)}` };
  }

  return { ok: true };
}
