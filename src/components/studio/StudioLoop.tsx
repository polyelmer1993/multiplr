"use client";

import { motion, useReducedMotion } from "framer-motion";

const COLS = 6;
const ROWS = 6;
const CELL = 24;
const PAD = 18;
const SIZE = PAD * 2 + CELL * COLS;
const CYCLE = 2.4;
const STEP = 0.16;

/**
 * The studio graphic: a multiplier, drawn with the only two shapes the brand
 * owns. A diagonal wave of Indigo Strike crosses a six-by-six field while two
 * square rules counter-rotate around it and one hairline scans down.
 *
 * It loops — which the house motion note otherwise rules out — because this is
 * an illustration of continuous work, not a UI state. It stays slow, it stays
 * one accent, and reduced motion renders a single still frame of it.
 */
export function StudioLoop() {
  const reduce = useReducedMotion();

  const cells = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      cells.push({ r, c });
    }
  }

  return (
    <div className="relative aspect-square w-full border-hairline border-muted/40 bg-paper">
      {/* Corner ticks — the plate reads as a measured field, not a panel. */}
      <span aria-hidden="true" className="absolute left-0 top-0 h-s-4 w-px bg-strike" />
      <span aria-hidden="true" className="absolute left-0 top-0 h-px w-s-4 bg-strike" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 h-s-4 w-px bg-strike" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 h-px w-s-4 bg-strike" />

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full"
        role="img"
        aria-label="Animated diagram: a wave of filled squares crossing a grid inside two rotating square rules — the studio's multiply mark."
      >
        {/* Two square rules, counter-rotating on a slow cycle. */}
        <motion.rect
          x={PAD - 8}
          y={PAD - 8}
          width={SIZE - (PAD - 8) * 2}
          height={SIZE - (PAD - 8) * 2}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="1"
          opacity="0.5"
          style={{ transformOrigin: "50% 50%" }}
          animate={reduce ? undefined : { rotate: 90 }}
          transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
        />
        <motion.rect
          x={SIZE / 2 - 34}
          y={SIZE / 2 - 34}
          width={68}
          height={68}
          fill="none"
          stroke="var(--strike)"
          strokeWidth="1"
          opacity="0.35"
          style={{ transformOrigin: "50% 50%" }}
          animate={reduce ? undefined : { rotate: -90 }}
          transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
        />

        {/* The field. Every cell is a resting hairline square. */}
        {cells.map(({ r, c }) => (
          <rect
            key={`rest-${r}-${c}`}
            x={PAD + c * CELL + 4}
            y={PAD + r * CELL + 4}
            width={CELL - 8}
            height={CELL - 8}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="1"
            opacity="0.28"
          />
        ))}

        {/* The wave. Delay by (row + column) so it crosses on the diagonal. */}
        {cells.map(({ r, c }) => (
          <motion.rect
            key={`wave-${r}-${c}`}
            x={PAD + c * CELL + 4}
            y={PAD + r * CELL + 4}
            width={CELL - 8}
            height={CELL - 8}
            fill="var(--strike)"
            initial={{ opacity: 0 }}
            animate={reduce ? { opacity: r === c ? 0.9 : 0 } : { opacity: [0, 0.92, 0] }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: CYCLE,
                    delay: (r + c) * STEP,
                    repeat: Infinity,
                    repeatDelay: 1.6,
                    ease: [0.22, 0.61, 0.36, 1],
                  }
            }
          />
        ))}

        {/* The multiply mark, held at centre. */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--deep)"
          fontFamily="var(--font-mono)"
          fontSize="30"
          fontWeight="500"
        >
          &#215;
        </text>

        {/* One hairline scanning down the plate. */}
        {!reduce ? (
          <motion.line
            x1="0"
            x2={SIZE}
            stroke="var(--strike)"
            strokeWidth="1"
            initial={{ y1: 0, y2: 0, opacity: 0 }}
            animate={{ y1: [0, SIZE], y2: [0, SIZE], opacity: [0, 0.55, 0.55, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: [0.22, 0.61, 0.36, 1],
              opacity: { duration: 7, repeat: Infinity, repeatDelay: 2.5, times: [0, 0.1, 0.85, 1] },
            }}
          />
        ) : null}
      </svg>

      {/* Mono readout, in the house label voice. */}
      <p className="absolute bottom-s-4 left-s-4 font-mono text-mono-micro uppercase text-muted">
        Fig. 01 — leverage, applied continuously
      </p>
    </div>
  );
}
