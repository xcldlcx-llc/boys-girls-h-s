"use client";
import { useState } from "react";
import { SETTINGS_CATEGORIES, IMPLEMENTED_CATEGORIES, type PhotosSettings } from "@/lib/settings";
import PhotosPanel from "./PhotosPanel";

export default function AdminDashboard({ photos, email }: { photos: PhotosSettings; email: string }) {
  const [active, setActive] = useState<string>("Photos");

  return (
    <main id="main" className="max-w-site mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl m-0">Settings</h1>
          <p className="text-ink-soft text-[.85rem] m-0">Signed in as {email}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- SDK-mounted route, not an app page */}
        <a href="/auth/logout?returnTo=/" className="btn btn--ink !py-2 !px-4 text-[.85rem]">Sign out</a>
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
