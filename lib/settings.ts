import { get } from "@vercel/edge-config";

export interface PhotosSettings {
  pageTitle: string;
  showMyAlbum: boolean;
  viewEffect: "magnific" | "newTab";
  showUploadDisclaimer: boolean;
  maxImageWidth: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  jpegQuality: number;
  slideShowInterval: number;
}

export const defaultPhotosSettings: PhotosSettings = {
  pageTitle: "Photo Album",
  showMyAlbum: false,
  viewEffect: "magnific",
  showUploadDisclaimer: false,
  maxImageWidth: 1024,
  thumbnailWidth: 150,
  thumbnailHeight: 150,
  jpegQuality: 90,
  slideShowInterval: 6,
};

export async function getPhotosSettings(): Promise<PhotosSettings> {
  try {
    const value = await get<Partial<PhotosSettings>>("photos");
    return { ...defaultPhotosSettings, ...value };
  } catch {
    return defaultPhotosSettings;
  }
}

/** Registry of settings panels. Only "photos" is wired up so far — more land here as they're specced. */
export const SETTINGS_CATEGORIES = [
  "General", "Accessibility", "Alumni Directory", "Bulletin Board", "Calendars",
  "Classroom", "Contact", "Food Menu", "Jobs", "Links", "Memoirs", "News",
  "Pages", "Payments", "Photos", "Push & Social", "Security", "SEO & Marketing",
  "Social Accounts", "Subscription Emails", "Supply Lists",
] as const;

export const IMPLEMENTED_CATEGORIES = new Set(["Photos"]);
