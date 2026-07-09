"use client";
/* Floating action rail pinned to the right edge (BKNHS-style popup side nav):
   Contact Us, Enroll Now, and Search. Labels slide out on hover/focus.
   Search opens a full overlay that filters pages, news, and documents client-side.
   WCAG: buttons labelled, Esc closes the overlay, focus moves in and is restored. */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { allPages, siteData, documents } from "@/lib/data";

function RailItem({ children, label, className }: { children: React.ReactNode; label: string; className?: string }) {
  return (
    <span className={`group flex items-center justify-end ${className || ""}`}>
      <span className="pointer-events-none mr-2 max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-ink text-white text-[.8rem] font-black px-0 py-2 opacity-0 transition-all duration-300 group-hover:max-w-[160px] group-hover:px-4 group-hover:opacity-100 group-focus-within:max-w-[160px] group-focus-within:px-4 group-focus-within:opacity-100">
        {label}
      </span>
      {children}
    </span>
  );
}

const btnBase =
  "w-[52px] h-[52px] rounded-full grid place-items-center text-white text-xl shadow-lift border-4 cursor-pointer no-underline";

export default function SideRail() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => { setSearchOpen(false); setQ(""); lastFocus.current?.focus(); }, []);

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [searchOpen, close]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return null;
    const hit = (s?: string | null) => (s || "").toLowerCase().includes(term);
    return {
      pages: allPages.filter((p) => hit(p.title) || hit(p.description) || hit(p.section)).slice(0, 8),
      news: siteData.news.filter((n) => hit(n.title) || hit(n.summary)).slice(0, 5),
      docs: documents.filter((d) => hit(d.title) || hit(d.description)).slice(0, 5),
    };
  }, [q]);

  return (
    <>
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[200] hidden md:flex flex-col gap-3 pr-3" role="navigation" aria-label="Quick actions">
        <RailItem label="Contact Us">
          <Link href="/about/contact" aria-label="Contact Us" className={`${btnBase} bg-red border-ink`}>
            <span aria-hidden="true">✆</span>
          </Link>
        </RailItem>
        <RailItem label="Enroll Now">
          <Link href="/admissions" aria-label="Enroll Now" className={`${btnBase} bg-ink border-red`}>
            <span aria-hidden="true">🎓</span>
          </Link>
        </RailItem>
        <RailItem label="Search">
          <button
            type="button"
            aria-label="Search the site"
            className={`${btnBase} bg-red border-ink`}
            onClick={(e) => { lastFocus.current = e.currentTarget; setSearchOpen(true); }}
          >
            <span aria-hidden="true">⌕</span>
          </button>
        </RailItem>
      </div>

      {/* Mobile: compact bottom rail */}
      <div className="fixed bottom-3 right-3 z-[200] flex md:hidden gap-2" role="navigation" aria-label="Quick actions">
        <Link href="/about/contact" aria-label="Contact Us" className={`${btnBase} bg-red border-ink !w-12 !h-12`}><span aria-hidden="true">✆</span></Link>
        <Link href="/admissions" aria-label="Enroll Now" className={`${btnBase} bg-ink border-red !w-12 !h-12`}><span aria-hidden="true">🎓</span></Link>
        <button type="button" aria-label="Search the site" className={`${btnBase} bg-red border-ink !w-12 !h-12`} onClick={(e) => { lastFocus.current = e.currentTarget; setSearchOpen(true); }}>
          <span aria-hidden="true">⌕</span>
        </button>
      </div>

      {searchOpen ? (
        <div className="fixed inset-0 z-[300] flex items-start justify-center p-6 pt-[10vh]">
          <div className="absolute inset-0 bg-[rgba(15,15,17,.72)]" onClick={close} aria-hidden="true" />
          <div className="modal-box relative bg-paper rounded-2xl w-full max-w-[720px] max-h-[80vh] flex flex-col shadow-lift" role="dialog" aria-modal="true" aria-label="Search the site">
            <div className="flex items-center gap-3 p-4 border-b border-line">
              <span className="text-xl text-red-text" aria-hidden="true">⌕</span>
              <input
                ref={inputRef}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pages, news, and documents…"
                aria-label="Search pages, news, and documents"
                className="flex-1 border-0 outline-none text-lg bg-transparent"
              />
              <button type="button" onClick={close} aria-label="Close search" className="bg-paper-warm border border-line rounded-full w-[38px] h-[38px] font-black cursor-pointer">✕</button>
            </div>
            <div className="overflow-auto p-4">
              {!results ? (
                <p className="text-ink-soft m-0">Type at least two characters — try “regents”, “PTA”, or “bell schedule”.</p>
              ) : (
                <>
                  {results.pages.length > 0 && (
                    <section aria-label="Matching pages">
                      <h2 className="eyebrow">Pages</h2>
                      <ul className="list-none m-0 mb-4 p-0 grid gap-1">
                        {results.pages.map((p) => (
                          <li key={p.route}>
                            <Link href={p.route} onClick={close} className="block py-2 px-3 rounded-lg no-underline text-ink hover:bg-paper-warm">
                              <strong>{p.title}</strong> <span className="text-ink-soft text-[.85rem]">— {p.section || "Home"}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {results.news.length > 0 && (
                    <section aria-label="Matching news">
                      <h2 className="eyebrow">News</h2>
                      <ul className="list-none m-0 mb-4 p-0 grid gap-1">
                        {results.news.map((n) => (
                          <li key={n.id}>
                            <Link href="/news" onClick={close} className="block py-2 px-3 rounded-lg no-underline text-ink hover:bg-paper-warm">{n.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {results.docs.length > 0 && (
                    <section aria-label="Matching documents">
                      <h2 className="eyebrow">Documents</h2>
                      <ul className="list-none m-0 p-0 grid gap-1">
                        {results.docs.map((d) => (
                          <li key={d.id}>
                            <button type="button" className="doc-open block w-full text-left py-2 px-3 rounded-lg !no-underline text-ink hover:bg-paper-warm" data-doc={d.id} onClick={() => setSearchOpen(false)}>
                              <strong className="text-ink">{d.title}</strong> <span className="text-ink-soft text-[.85rem] font-normal">— {d.description}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {results.pages.length + results.news.length + results.docs.length === 0 && (
                    <p className="text-ink-soft m-0">No matches for “{q}”. Try a different word, or browse the menus above.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
