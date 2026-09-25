"use client";

import { useEffect, useRef } from "react";

type Viewport = { vw: number; vh: number };

/**
 * Calls `onFrame` at most once per animation frame whenever the page scrolls
 * or resizes (and once on mount, and again when web fonts finish loading).
 * Use it for scroll-linked effects that need to read layout directly.
 */
export function useOnScroll(onFrame: (v: Viewport) => void, enabled = true) {
  const cb = useRef(onFrame);
  useEffect(() => {
    cb.current = onFrame;
  });

  useEffect(() => {
    if (!enabled) return;
    let ticking = false;
    let raf = 0;
    const frame = () => {
      ticking = false;
      cb.current({ vw: window.innerWidth, vh: window.innerHeight });
    };
    const req = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    document.fonts?.ready.then(req);
    frame();
    return () => {
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);
}
