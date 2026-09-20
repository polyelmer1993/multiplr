"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The image slot, until there is an image. A drifting hairline field with one
 * Strike diagonal crossing it on a loop — a holding pattern that reads as
 * "asset pending" rather than as a broken picture.
 *
 * Replace the whole component with `next/image` when the case-study shot
 * lands; the surrounding card does not change.
 */
export function PlatePattern() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-bone">
      <motion.svg
        className="absolute inset-0 h-full w-full"
        animate={reduce ? undefined : { x: [0, -48], y: [0, -48] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <pattern id="plate-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="1"
              opacity="0.22"
            />
          </pattern>
        </defs>
        {/* Oversized so the drift never exposes an edge. */}
        <rect x="-64" y="-64" width="200%" height="200%" fill="url(#plate-grid)" />
      </motion.svg>

      {/* One Strike diagonal, sweeping across on a slow loop. */}
      {!reduce ? (
        <motion.span
          className="absolute -inset-y-[40%] w-px bg-strike/40"
          style={{ rotate: -24 }}
          animate={{ left: ["-10%", "110%"] }}
          transition={{ duration: 11, repeat: Infinity, repeatDelay: 2, ease: [0.22, 0.61, 0.36, 1] }}
        />
      ) : null}
    </div>
  );
}
