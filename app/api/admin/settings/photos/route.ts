import { NextRequest, NextResponse } from "next/server";
import { getAdminAuthState } from "@/lib/admin-auth";
import { defaultPhotosSettings, getPhotosSettings, type PhotosSettings } from "@/lib/settings";
import { writeSetting } from "@/lib/settings-write";
import { appendChangelogEntry, diffSummary } from "@/lib/changelog";

function sanitize(body: unknown): PhotosSettings | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const pageTitle = typeof b.pageTitle === "string" ? b.pageTitle.slice(0, 200) : defaultPhotosSettings.pageTitle;
  const showMyAlbum = Boolean(b.showMyAlbum);
  const viewEffect = b.viewEffect === "newTab" ? "newTab" : "magnific";
  const showUploadDisclaimer = Boolean(b.showUploadDisclaimer);

  const clampInt = (v: unknown, fallback: number, min: number, max: number) => {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, Math.round(n)));
  };

  return {
    pageTitle: pageTitle.trim() || defaultPhotosSettings.pageTitle,
    showMyAlbum,
    viewEffect,
    showUploadDisclaimer,
    maxImageWidth: clampInt(b.maxImageWidth, defaultPhotosSettings.maxImageWidth, 100, 4000),
    thumbnailWidth: clampInt(b.thumbnailWidth, defaultPhotosSettings.thumbnailWidth, 40, 1000),
    thumbnailHeight: clampInt(b.thumbnailHeight, defaultPhotosSettings.thumbnailHeight, 40, 1000),
    jpegQuality: clampInt(b.jpegQuality, defaultPhotosSettings.jpegQuality, 1, 100),
    slideShowInterval: clampInt(b.slideShowInterval, defaultPhotosSettings.slideShowInterval, 2, 120),
  };
}

export async function POST(req: NextRequest) {
  const auth = await getAdminAuthState();
  if (auth.status !== "authorized") {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const settings = sanitize(body);
  if (!settings) {
    return NextResponse.json({ ok: false, error: "Invalid settings payload." }, { status: 400 });
  }

  const before = await getPhotosSettings();

  const result = await writeSetting("photos", settings);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  await appendChangelogEntry({
    timestamp: new Date().toISOString(),
    email: auth.email,
    panel: "Photos",
    summary: diffSummary(before, settings),
  });

  return NextResponse.json({ ok: true, settings });
}
