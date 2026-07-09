"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PhotosSettings } from "@/lib/settings";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_320px] items-start py-4 border-b border-line last:border-b-0">
      <div>
        <label className="font-bold block">{label}</label>
        {hint ? <p className="text-[.85rem] text-ink-soft mt-1 mb-0 max-w-[46ch]">{hint}</p> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

const inputCls = "w-full border border-line rounded-lg py-2 px-3 text-base outline-none focus-visible:border-focus";

export default function PhotosPanel({ initial }: { initial: PhotosSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<PhotosSettings>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof PhotosSettings>(key: K, value: PhotosSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus("idle");
  }

  async function onSave() {
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/settings/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error || "Save failed.");
        return;
      }
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
      setError("Couldn't reach the server.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl m-0">Photos</h2>
        <button type="button" onClick={onSave} disabled={status === "saving"} className="btn btn--primary !py-2 !px-5 text-[.9rem] disabled:opacity-60">
          {status === "saving" ? "Saving…" : "Save"}
        </button>
      </div>
      {status === "saved" ? <p className="text-[.9rem] mb-4" style={{ color: "#166534" }}>Saved — the Photos &amp; Videos page and homepage slideshow now reflect these settings.</p> : null}
      {status === "error" ? <p className="text-red-text text-[.9rem] mb-4" role="alert">{error}</p> : null}

      <Field label="Page Title:">
        <input className={inputCls} type="text" value={form.pageTitle} onChange={(e) => set("pageTitle", e.target.value)} />
      </Field>

      <Field label="Show My Album:" hint="Shows a &ldquo;submit your own photos&rdquo; prompt on the Photos &amp; Videos page. (Uploading isn't wired up yet — this only shows or hides the prompt.)">
        <select className={inputCls} value={form.showMyAlbum ? "yes" : "no"} onChange={(e) => set("showMyAlbum", e.target.value === "yes")}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </Field>

      <Field label="View Effect:" hint="How a photo opens when clicked.">
        <select className={inputCls} value={form.viewEffect} onChange={(e) => set("viewEffect", e.target.value as PhotosSettings["viewEffect"])}>
          <option value="magnific">Magnific Popup (opens in a window on the page)</option>
          <option value="newTab">Open in a new tab</option>
        </select>
      </Field>

      <Field label="Show Upload Disclaimer:" hint="If set to yes, a consent notice about student photos is shown on the Photos & Videos page.">
        <select className={inputCls} value={form.showUploadDisclaimer ? "yes" : "no"} onChange={(e) => set("showUploadDisclaimer", e.target.value === "yes")}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </Field>

      <Field label="Maximum Image Width (pixels):" hint="Photos are capped to this width when opened.">
        <input className={inputCls} type="number" min={100} max={4000} value={form.maxImageWidth} onChange={(e) => set("maxImageWidth", Number(e.target.value))} />
      </Field>

      <Field label="Thumbnail Width (pixels):">
        <input className={inputCls} type="number" min={40} max={1000} value={form.thumbnailWidth} onChange={(e) => set("thumbnailWidth", Number(e.target.value))} />
      </Field>

      <Field label="Thumbnail Height (pixels):">
        <input className={inputCls} type="number" min={40} max={1000} value={form.thumbnailHeight} onChange={(e) => set("thumbnailHeight", Number(e.target.value))} />
      </Field>

      <Field label="JPEG Quality (percentage):" hint="Lower quality generates smaller file sizes.">
        <input className={inputCls} type="number" min={1} max={100} value={form.jpegQuality} onChange={(e) => set("jpegQuality", Number(e.target.value))} />
      </Field>

      <Field label="Slide Show Refresh Interval (seconds):" hint="Also controls the photo slideshow on the homepage.">
        <input className={inputCls} type="number" min={2} max={120} value={form.slideShowInterval} onChange={(e) => set("slideShowInterval", Number(e.target.value))} />
      </Field>
    </div>
  );
}
