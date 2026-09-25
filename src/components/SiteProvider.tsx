"use client";

import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Reads the OS "reduce motion" setting. Always false on the server, so hydration matches. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}

type SiteState = {
  /** True once the visitor has scrolled through the entrance door. */
  inside: boolean;
  setInside: (v: boolean) => void;
  /** True when the visitor prefers reduced motion. */
  reduced: boolean;
};

const SiteContext = createContext<SiteState | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [inside, setInside] = useState(false);
  // Only the home page has the entrance door; everywhere else you start inside.
  const hasDoor = usePathname() === "/";

  return (
    <SiteContext value={{ inside: inside || reduced || !hasDoor, setInside, reduced }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SiteContext>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
