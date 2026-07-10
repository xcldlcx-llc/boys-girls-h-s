"use client";
/* Kangaroo mascot rail: a decorative strip where the school mascot hops
   left-to-right in an endless loop. Click it 5 times in a row to unlock
   a hidden 3D mini-game (public/games/kangaroo-crossing-3d.html, falling
   back to the 2D classic edition on devices without WebGL) embedded via
   the KangarooCrossing wrapper — kept as a standalone canvas/WebGL widget
   rather than a plain React component so it isn't constrained by the
   app's strict render-purity lint rules. */
import { useCallback, useRef, useState } from "react";
import KangarooCrossing from "./KangarooCrossing";

const UNLOCK_CLICKS = 5;
const UNLOCK_WINDOW_MS = 2500;

export default function MascotRail() {
  const [gameActive, setGameActive] = useState(false);
  const clickTimes = useRef<number[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    const now = Date.now();
    clickTimes.current = [...clickTimes.current, now].filter((t) => now - t < UNLOCK_WINDOW_MS);
    if (clickTimes.current.length >= UNLOCK_CLICKS) {
      clickTimes.current = [];
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) setGameActive(true);
    }
  }, []);

  const closeGame = useCallback(() => {
    setGameActive(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <div className={`mascot-rail${gameActive ? " mascot-rail--game" : ""}`}>
      {gameActive ? (
        <>
          <KangarooCrossing height={260} showChip={false} />
          <button
            type="button"
            onClick={closeGame}
            aria-label="Close mini-game"
            className="absolute top-1 right-1 z-[3] w-7 h-7 rounded-full bg-black/40 text-white text-sm font-black grid place-items-center cursor-pointer hover:bg-black/60"
          >
            ✕
          </button>
        </>
      ) : (
        <>
          <span className="ground-line" aria-hidden="true" />
          <span className="mascot-bubble" aria-hidden="true">Go Kangaroos!</span>
          <div className="mascot-track" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mascot-kangaroo.png" alt="" className="mascot-hop" />
            <span className="mascot-shadow" />
          </div>
          <button
            ref={triggerRef}
            type="button"
            onClick={handleClick}
            className="absolute inset-0 w-full h-full bg-transparent border-0 cursor-pointer"
            aria-label="Kangaroo mascot — click 5 times to play a hidden mini-game"
          />
        </>
      )}
    </div>
  );
}
