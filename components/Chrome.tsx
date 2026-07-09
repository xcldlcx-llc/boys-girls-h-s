"use client";
/* Header with BKNHS-style split navigation around the centered circular BGHS logo.
   Left links | logo | right links on desktop; hamburger menu on mobile.
   All menus keyboard operable; Esc closes. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV, school, siteData, type NavItem } from "@/lib/data";

const LEFT = ["About", "Academics", "Students", "Calendar"];
const RIGHT = ["Families", "Admissions", "Staff", "News"];

export function AlertBar() {
  const a = siteData.alert;
  if (!a?.active) return null;
  return (
    <div className="bg-gold text-[#3a2c04] font-bold py-2 px-5 text-center text-[.95rem]" role="region" aria-label="School alert">
      {a.text} {a.link ? <a className="text-[#3a2c04]" href={a.link}>{a.linkText || "Learn more"}</a> : null}
    </div>
  );
}

export function Ticker() {
  const [paused, setPaused] = useState(false);
  const items = siteData.ticker || [];
  const row = items.map((t, i) => (
    <span key={i} className="font-bold tracking-wide">
      {t} <span className="text-gold" aria-hidden="true"> ●</span>
    </span>
  ));
  return (
    <div className={`ticker bg-ink text-white overflow-hidden flex items-center${paused ? " paused" : ""}`} role="region" aria-label="Announcements ticker">
      <button
        type="button"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
        aria-label={paused ? "Play announcements" : "Pause announcements"}
        className="flex-none bg-transparent border-0 text-white text-base py-2 px-4 cursor-pointer border-r border-white/25"
      >
        {paused ? "▶" : "❚❚"}
      </button>
      <div className="ticker-track">{row}{row}</div>
    </div>
  );
}

function NavMenuItem({
  item,
  expanded,
  setExpanded,
  align = "left",
}: {
  item: NavItem;
  expanded: string | null;
  setExpanded: (label: string | null) => void;
  align?: "left" | "right";
}) {
  if (!item.children) {
    return (
      <li>
        <Link href={item.href ?? "#"} className="block py-2.5 px-3 font-bold text-[.95rem] text-ink no-underline rounded-lg whitespace-nowrap hover:bg-paper-warm hover:text-red-text">
          {item.label}
        </Link>
      </li>
    );
  }
  const open = expanded === item.label;
  return (
    <li className="relative">
      <button
        type="button"
        className="nav-parent block w-full text-left py-2.5 px-3 font-bold text-[.95rem] text-ink bg-transparent border-0 cursor-pointer rounded-lg whitespace-nowrap hover:bg-paper-warm hover:text-red-text"
        aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setExpanded(open ? null : item.label); }}
      >
        {item.label}<span className="chev" aria-hidden="true">▾</span>
      </button>
      <ul className={`dropdown lg:absolute lg:top-full ${align === "right" ? "lg:right-0" : "lg:left-0"} lg:min-w-[240px] bg-paper lg:border lg:border-line lg:rounded-xl lg:shadow-lift p-2 list-none m-0 lg:z-50 pl-4 lg:pl-2`}>
        {item.children.map(([t, h]) => (
          <li key={h}>
            <Link href={h} className="block py-2 px-3 text-ink no-underline rounded-lg hover:bg-paper-warm hover:text-red-text" onClick={() => setExpanded(null)}>
              {t}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(null);
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("nav")) setExpanded(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, []);

  const items = (labels: string[]) => labels.map((l) => NAV.find((n) => n.label === l)).filter((n): n is NavItem => Boolean(n));
  const logo = (
    <Link href="/" className="justify-self-center no-underline text-ink text-center" aria-label={`${school.name} — home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={school.logo} alt={school.logoAlt} width={750} height={142} className="h-12 w-auto object-contain mx-auto" />
      <span className="sr-only">{school.name}</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-[100] bg-paper border-b border-line">
      {/* Desktop: split nav around the centered logo */}
      <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-4 max-w-site mx-auto py-2 px-5">
        <nav aria-label="Main navigation — left">
          <ul className="flex justify-end gap-1 list-none m-0 p-0">
            {items(LEFT).map((item) => (
              <NavMenuItem key={item.label} item={item} expanded={expanded} setExpanded={setExpanded} />
            ))}
          </ul>
        </nav>
        {logo}
        <nav aria-label="Main navigation — right">
          <ul className="flex justify-start gap-1 list-none m-0 p-0">
            {items(RIGHT).map((item) => (
              <NavMenuItem key={item.label} item={item} expanded={expanded} setExpanded={setExpanded} align="right" />
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile: logo + hamburger */}
      <div className="lg:hidden flex items-center gap-4 py-2.5 px-5">
        <Link href="/" className="flex items-center gap-3 no-underline text-ink mr-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={school.logo} alt={school.logoAlt} width={750} height={142} className="h-8 w-auto object-contain" />
          <span className="font-black leading-tight">{school.shortName}<span className="block font-normal text-[.75rem] text-ink-soft">{school.tagline}</span></span>
        </Link>
        <button
          type="button"
          className="bg-transparent border-2 border-ink rounded-lg py-2 px-3 font-bold cursor-pointer"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
      </div>
      <nav id="mobile-nav" aria-label="Main navigation" className={`${open ? "block" : "hidden"} lg:hidden px-5 pb-4`}>
        <ul className="flex flex-col gap-1 list-none m-0 p-0">
          {items([...LEFT, ...RIGHT]).map((item) => (
            <NavMenuItem key={item.label} item={item} expanded={expanded} setExpanded={setExpanded} />
          ))}
          <li>
            <Link href="/admissions" className="block bg-red-text text-white rounded-full py-2.5 px-5 font-black no-underline text-center hover:bg-red-dark mt-2">
              Enroll Now
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
