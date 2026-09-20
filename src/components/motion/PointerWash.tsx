"use client";

import { useCallback, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * The pointer-tracked wash shared by every interactive plate.
 *
 * `usePointerWash` writes the cursor position to two custom properties on the
 * host element — no React state, so moving the mouse never re-renders. Render
 * `<PointerWash />` inside that host, and put `group` on it so the wash fades
 * in with the rest of the hover state.
 *
 * The colour is Indigo Strike at a low alpha: a tint of a locked hue, not a
 * new one. Reduced motion leaves the properties at their resting centre, so
 * the wash renders as a still, centred glow rather than following anything.
 */
export function usePointerWash<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      if (reduce) return;
      const el = ref.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${event.clientX - box.left}px`);
      el.style.setProperty("--my", `${event.clientY - box.top}px`);
    },
    [reduce],
  );

  /** Spread onto the host element. */
  const washProps = {
    ref,
    onPointerMove,
    style: { "--mx": "50%", "--my": "50%" } as React.CSSProperties,
  };

  return washProps;
}

export function PointerWash({
  radius = 240,
  alpha = 0.06,
  className,
}: {
  radius?: number;
  alpha?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 ease-calm",
        "group-hover:opacity-100 group-focus-visible:opacity-100",
        className,
      )}
      style={{
        background: `radial-gradient(${radius}px circle at var(--mx) var(--my), rgb(25 37 170 / ${alpha}), transparent 72%)`,
      }}
    />
  );
}

/** The 2px Strike rule that draws along a plate's top edge on hover. */
export function TopRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-strike",
        "transition-transform duration-[420ms] ease-calm",
        "group-hover:scale-x-100 group-focus-visible:scale-x-100",
        className,
      )}
    />
  );
}

/** The oversized number that rises into a plate's corner on hover. */
export function GhostIndex({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -top-s-4 right-s-4 -z-10 select-none font-display text-[6rem] leading-none text-strike/0",
        "transition-[color,transform] duration-500 ease-calm",
        "group-hover:translate-y-s-3 group-hover:text-strike/[0.08]",
        "group-focus-visible:translate-y-s-3 group-focus-visible:text-strike/[0.08]",
        className,
      )}
    >
      {children}
    </span>
  );
}
