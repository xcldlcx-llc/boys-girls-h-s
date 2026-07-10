"use client";
/* Kangaroo mascot rail: a decorative strip where the school mascot hops
   left-to-right in an endless loop. Click it 5 times in a row to unlock
   a hidden mini-game (public/games/kangaroo-crossing.html) embedded via
   iframe in the same strip — kept as a standalone canvas widget rather
   than a React component so it isn't constrained by the app's lint rules. */
import { useCallback, useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (!gameActive) return;
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "bghs-mascot-game-close") closeGame();
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [gameActive, closeGame]);

  return (
    <div className={`mascot-rail${gameActive ? " mascot-rail--game" : ""}`}>
      {gameActive ? (
        <iframe
          src="/games/kangaroo-crossing.html"
          title="Kangaroo Crossing — a BGHS mini game"
          style={{ width: "100%", height: "100%", border: 0, display: "block" }}
          loading="lazy"
        />
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
