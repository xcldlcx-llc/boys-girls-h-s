"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Try again.");
      setLoading(false);
    }
  }

  return (
    <main id="main" className="min-h-[70vh] grid place-items-center px-5 py-16">
      <form onSubmit={onSubmit} className="w-full max-w-sm panel">
        <h1 className="text-2xl mb-1">Site Admin</h1>
        <p className="text-ink-soft text-[.9rem] mb-6">Sign in to manage site settings.</p>
        <label className="block text-[.85rem] font-black uppercase tracking-wide text-ink-soft mb-1.5" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-line rounded-lg py-2.5 px-3.5 text-base mb-4 outline-none focus-visible:border-focus"
          autoComplete="current-password"
        />
        {error ? <p className="text-red-text text-[.9rem] mb-4" role="alert">{error}</p> : null}
        <button type="submit" disabled={loading} className="btn btn--primary w-full text-center disabled:opacity-60">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </main>
  );
}
