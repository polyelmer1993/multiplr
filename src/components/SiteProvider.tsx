"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

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
  /** True when the visitor prefers reduced motion. Pinned scenes become plain stacked content. */
  reduced: boolean;
};

const SiteContext = createContext<SiteState | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  return (
    <SiteContext value={{ reduced }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SiteContext>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
