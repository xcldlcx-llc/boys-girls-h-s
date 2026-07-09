"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SETTINGS_CATEGORIES, IMPLEMENTED_CATEGORIES, type PhotosSettings } from "@/lib/settings";
import PhotosPanel from "./PhotosPanel";

export default function AdminDashboard({ photos }: { photos: PhotosSettings }) {
  const router = useRouter();
  const [active, setActive] = useState<string>("Photos");
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <main id="main" className="max-w-site mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl m-0">Settings</h1>
        <button type="button" onClick={logout} disabled={loggingOut} className="btn btn--ink !py-2 !px-4 text-[.85rem]">
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
      <div className="grid gap-0 md:grid-cols-[240px_1fr] border border-line rounded-2xl overflow-hidden bg-paper">
        <nav aria-label="Settings categories" className="border-b md:border-b-0 md:border-r border-line bg-paper-warm">
          <ul className="list-none m-0 p-0">
            {SETTINGS_CATEGORIES.map((cat) => {
              const implemented = IMPLEMENTED_CATEGORIES.has(cat);
              const isActive = active === cat;
              return (
                <li key={cat}>
                  <button
                    type="button"
                    disabled={!implemented}
                    onClick={() => implemented && setActive(cat)}
                    className={`w-full text-left py-3 px-5 text-[.92rem] border-0 cursor-pointer ${
                      isActive ? "bg-paper font-black text-red-text" : "bg-transparent text-ink"
                    } ${implemented ? "hover:bg-paper" : "opacity-40 cursor-not-allowed"}`}
                  >
                    {cat}
                    {!implemented ? <span className="block text-[.7rem] font-normal text-ink-soft">Coming soon</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-6 md:p-8">
          {active === "Photos" ? <PhotosPanel initial={photos} /> : null}
        </div>
      </div>
    </main>
  );
}
