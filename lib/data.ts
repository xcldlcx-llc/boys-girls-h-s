import site from "@/data/site.json";
import pages from "@/data/pages.json";

export interface School {
  name: string;
  shortName: string;
  tagline: string;
  district: string;
  dbn: string;
  address: string;
  phone: string;
  fax: string;
  principal: string;
  parentCoordinator: string;
  parentCoordinatorPhone: string;
  logo: string;
  logoAlt: string;
  doeLogo: string;
  doeLogoAlt: string;
  mission: string;
  vision: string;
  social: { facebook: string; twitter: string; instagram: string; youtube: string };
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  summary?: string;
  image?: string;
  imageAlt?: string;
  attachment?: string;
  link?: string;
}

export interface EventItem {
  date: string;
  title: string;
  time?: string;
  location?: string;
  link?: string;
}

export interface DocumentItem {
  id: string;
  category: string;
  type: "pdf" | "image" | "video" | string;
  title: string;
  file: string;
  description?: string;
  alt?: string;
}

export interface Slide {
  src: string;
  alt: string;
}

export interface QuickLink {
  label: string;
  href: string;
  icon: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Page {
  route: string;
  slug: string[];
  section: string;
  title: string;
  description: string;
  body: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: Array<[string, string]>;
}

interface SiteData {
  school: School;
  alert: { active: boolean; text: string; link: string; linkText: string };
  ticker: string[];
  slides: Slide[];
  quickLinks: QuickLink[];
  stats: Stat[];
  news: NewsItem[];
  events: EventItem[];
  documents: DocumentItem[];
}

const siteData = site as unknown as SiteData;
const allPages = pages as unknown as Page[];

/** Convert a static-site href ("admissions/index.html") into a Next route ("/admissions"). */
export function route(href?: string | null): string {
  if (!href || /^(https?:|tel:|mailto:|#)/.test(href)) return href ?? "";
  const p = href.replace(/\.html$/, "").replace(/\/index$/, "");
  if (p === "index" || p === "") return "/";
  return p.startsWith("/") ? p : "/" + p;
}

export const isExternal = (href?: string | null) => /^https?:/.test(href || "");

/** Documents + gallery images derived from hero slides (same convention as the static build). */
export const documents: DocumentItem[] = [
  ...siteData.documents,
  ...siteData.slides.map((s, i) => ({
    id: `media-${i + 1}`,
    category: "media",
    type: "image",
    title: `BGHS photo ${i + 1}`,
    file: s.src,
    description: s.alt,
    alt: s.alt,
  })),
];

export const getDoc = (id: string | null) => documents.find((d) => d.id === id);
export const getPage = (slug: string[]) => allPages.find((p) => p.slug.join("/") === slug.join("/"));
export { allPages };
export const school = siteData.school;
export { siteData };

export function fmtDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return {
    m: d.toLocaleString("en-US", { month: "short" }),
    day: d.getDate(),
    full: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  };
}

export const NAV: NavItem[] = [
  { label: "About", children: [
    ["Mission & Vision", "/about/mission"],
    ["Principal's Message", "/about/principals-message"],
    ["Our History", "/about/history"],
    ["School Leadership Team", "/about/slt"],
    ["FAQs", "/about/faqs"],
    ["Campus & Directions", "/about/campus-map"],
    ["Photos & Videos", "/about/media"],
    ["Contact Us", "/about/contact"],
  ]},
  { label: "Academics", children: [
    ["Departments Overview", "/academics"],
    ["Academic Programs", "/academics/programs"],
    ["Course Catalog", "/academics/course-catalog"],
    ["Graduation Requirements", "/academics/graduation-requirements"],
    ["Curriculum & Pacing Guides", "/academics/curriculum"],
    ["Bell Schedule", "/academics/bell-schedule"],
    ["Guest Wi-Fi", "/academics/wifi"],
  ]},
  { label: "Students", children: [
    ["Student Hub", "/students"],
    ["Athletics", "/students/athletics"],
    ["College & Career Corner", "/students/college-corner"],
    ["Student Government", "/students/student-government"],
    ["Student Handbook", "/students/handbook"],
    ["Safety & Reporting", "/students/safety"],
  ]},
  { label: "Families", children: [
    ["Family Hub", "/families"],
    ["Parent Coordinator", "/families/parent-coordinator"],
    ["PTCA", "/families/ptca"],
    ["Parents' Bill of Rights", "/families/bill-of-rights"],
    ["Counseling & Support", "/families/counseling"],
    ["Grief Support", "/families/grief-support"],
    ["Volunteer", "/families/volunteer"],
  ]},
  { label: "Admissions", children: [
    ["How to Apply", "/admissions"],
    ["Noted Alumni", "/admissions/noted-alumni"],
  ]},
  { label: "Staff", href: "/staff" },
  { label: "Calendar", href: "/calendar" },
  { label: "News", href: "/news" },
];
