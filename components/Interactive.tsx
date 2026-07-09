"use client";
/* Hero slideshow (pausable, WCAG "pause moving content") + scroll-reveal observer. */
import { useEffect, useState, useSyncExternalStore } from "react";
import { siteData } from "@/lib/data";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export function HeroSlides({ intervalMs = 6000 }: { intervalMs?: number }) {
  const slides = siteData.slides || [];
  const [i, setI] = useState(0);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const playing = !prefersReducedMotion && !manuallyPaused;

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), intervalMs);
    return () => clearInterval(t);
  }, [playing, slides.length, intervalMs]);

  return (
    <>
      <div className="absolute inset-0" aria-live="off">
        {slides.map((s, n) => (
          <div key={s.src} className={`hero-slide${n === i ? " active" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.alt} loading={n === 0 ? "eager" : "lazy"} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute right-4 bottom-4 z-[3] flex gap-2">
        <button type="button" aria-label="Previous slide" onClick={() => setI((i - 1 + slides.length) % slides.length)} className="bg-black/55 border border-white/40 text-white w-[42px] h-[42px] rounded-full cursor-pointer">‹</button>
        <button type="button" aria-label={playing ? "Pause slideshow" : "Play slideshow"} onClick={() => setManuallyPaused(!manuallyPaused)} className="bg-black/55 border border-white/40 text-white w-[42px] h-[42px] rounded-full cursor-pointer">
          {playing ? "❚❚" : "▶"}
        </button>
        <button type="button" aria-label="Next slide" onClick={() => setI((i + 1) % slides.length)} className="bg-black/55 border border-white/40 text-white w-[42px] h-[42px] rounded-full cursor-pointer">›</button>
      </div>
    </>
  );
}

export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
