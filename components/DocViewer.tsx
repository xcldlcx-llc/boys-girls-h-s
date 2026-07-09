"use client";
/* Global in-page document/image/video viewer.
   Any element with class="doc-open" data-doc="<id>" opens the modal — this keeps
   the same convention as the static build, so buttons inside CMS body HTML work too.
   WCAG: Esc closes, focus is trapped and restored, backdrop click closes. */
import { useCallback, useEffect, useRef, useState } from "react";
import { getDoc, type DocumentItem } from "@/lib/data";

export default function DocViewer() {
  const [doc, setDoc] = useState<DocumentItem | null>(null);
  const [maxImageWidth, setMaxImageWidth] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => {
    setDoc(null);
    lastFocus.current?.focus();
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest(".doc-open, .gallery button[data-doc]") as HTMLElement | null;
      if (!btn) return;
      const d = getDoc(btn.getAttribute("data-doc"));
      if (d) {
        lastFocus.current = btn;
        setDoc(d);
        const maxW = Number(btn.getAttribute("data-max-width"));
        setMaxImageWidth(Number.isFinite(maxW) && maxW > 0 ? maxW : null);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!doc) return;
    document.body.style.overflow = "hidden";
    const box = boxRef.current;
    box?.querySelector<HTMLElement>(".modal-close")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && box) {
        const f = [...box.querySelectorAll<HTMLElement>("a[href], button, iframe, video")];
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [doc, close]);

  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[rgba(15,15,17,.72)]" onClick={close} aria-hidden="true" />
      <div ref={boxRef} className="modal-box relative bg-paper rounded-2xl w-full max-w-[960px] max-h-[92vh] flex flex-col shadow-lift" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex items-center gap-4 py-3.5 px-5 border-b border-line">
          <h2 id="modal-title" className="text-[1.05rem] m-0 flex-1">{doc.title}</h2>
          <button type="button" className="modal-close bg-paper-warm border border-line rounded-full w-[38px] h-[38px] text-base cursor-pointer font-black" onClick={close} aria-label="Close viewer">✕</button>
        </div>
        {doc.description ? <p className="pt-2.5 px-5 pb-0 text-[.88rem] text-ink-soft m-0">{doc.description}</p> : null}
        <div className="flex-1 min-h-[300px] p-5 overflow-auto">
          {doc.type === "image" ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={doc.file}
              alt={doc.alt || doc.description || doc.title}
              className="mx-auto rounded-lg max-w-full"
              style={maxImageWidth ? { maxWidth: maxImageWidth } : undefined}
            />
          ) : doc.type === "video" ? (
            <video controls preload="metadata" className="w-full rounded-lg">
              <source src={doc.file} />
              Your browser does not support embedded video. Use the download link below.
            </video>
          ) : (
            <>
              <iframe src={doc.file} title={doc.title} className="w-full h-[min(68vh,720px)] border border-line rounded-lg" />
              <p className="text-[.85rem] text-ink-soft mt-2.5">If the document does not display, use “Open in a new tab” or “Download” below.</p>
            </>
          )}
        </div>
        <div className="px-5 pb-4 text-[.9rem]">
          <a href={doc.file} target="_blank" rel="noopener noreferrer">Open in a new tab</a> ·{" "}
          <a href={doc.file} download>Download</a>
        </div>
      </div>
    </div>
  );
}
