"use client";
/**
 * KangarooCrossing — footer mini-game embed.
 *
 * What it does beyond a plain <iframe>:
 *  1. LAZY LOAD  — the iframe (and Three.js inside it) doesn't load until the
 *     footer scrolls near the viewport, so the game costs nothing on page load.
 *  2. AUTO-PAUSE — pauses the game loop whenever it scrolls out of view
 *     (saves battery/CPU), resumes when it returns.
 *  3. SCORE EVENTS — listens to the game's postMessage API and exposes
 *     onScore / onGameOver / onHighScore callbacks + a live score chip.
 *
 * The game itself lives at public/games/kangaroo-crossing-3d.html (WebGL);
 * it falls back to a text pointer to the 2D edition
 * (public/games/kangaroo-crossing-classic.html) on devices without WebGL.
 */
import { useEffect, useRef, useState } from "react";

interface KangarooCrossingProps {
  src?: string;
  height?: number;
  title?: string;
  showChip?: boolean;
  className?: string;
  onScore?: (score: number) => void;
  onGameOver?: (score: number) => void;
  onHighScore?: (score: number) => void;
}

export default function KangarooCrossing({
  src = "/games/kangaroo-crossing-3d.html",
  height = 260,
  title = "Kangaroo Crossing — a BGHS mini game",
  showChip = true,
  className = "",
  onScore,
  onGameOver,
  onHighScore,
}: KangarooCrossingProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "paused" | "over">("idle");

  /* 1) Lazy-load the iframe when the footer approaches the viewport */
  useEffect(() => {
    if (loaded || !wrapRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoaded(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, [loaded]);

  /* 2) Auto-pause when off screen, resume when back */
  useEffect(() => {
    if (!loaded || !wrapRef.current) return;
    const post = (msg: Record<string, unknown>) =>
      frameRef.current?.contentWindow?.postMessage({ target: "kangaroo-crossing", ...msg }, "*");
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.intersectionRatio > 0.15);
        post(visible ? { type: "resume", auto: true } : { type: "pause", auto: true });
      },
      { threshold: [0, 0.15] }
    );
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, [loaded]);

  /* 3) Listen to game events (only from OUR iframe) */
  useEffect(() => {
    if (!loaded) return;
    function onMsg(e: MessageEvent) {
      if (e.source !== frameRef.current?.contentWindow) return;
      const d = (e.data || {}) as { source?: string; type?: string; value?: number | { hi: number } };
      if (d.source !== "kangaroo-crossing") return;
      switch (d.type) {
        case "kc:ready":
          setBest((d.value as { hi: number } | undefined)?.hi ?? null);
          break;
        case "kc:start":
          setStatus("running");
          setScore(0);
          break;
        case "kc:score":
          setScore(d.value as number);
          onScore?.(d.value as number);
          break;
        case "kc:paused":
          setStatus("paused");
          break;
        case "kc:resumed":
          setStatus("running");
          break;
        case "kc:hiscore":
          setBest(d.value as number);
          onHighScore?.(d.value as number);
          break;
        case "kc:gameover":
          setStatus("over");
          onGameOver?.(d.value as number);
          break;
        default:
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [loaded, onScore, onGameOver, onHighScore]);

  return (
    <section ref={wrapRef} className={className} aria-label="Kangaroo Crossing mini game">
      {showChip && (
        <div className="max-w-site mx-auto px-5 flex items-center justify-between py-2 text-[.8rem] font-black uppercase tracking-wide text-ink-soft">
          <span>
            Take a brain break — help our kangaroo through the school day
            {status === "paused" ? " (paused)" : ""}
          </span>
          <span aria-live="polite">
            {score !== null ? `Score ${score}` : ""}
            {best ? `  ·  Best ${best}` : ""}
          </span>
        </div>
      )}
      {loaded ? (
        <iframe
          ref={frameRef}
          src={src}
          title={title}
          style={{ width: "100%", height, border: 0, display: "block" }}
        />
      ) : (
        <div
          style={{ height }}
          className="grid place-items-center bg-paper-warm border-y-4 border-ink text-ink-soft text-[.9rem] font-bold"
        >
          Kangaroo Crossing loads when you get here…
        </div>
      )}
    </section>
  );
}
