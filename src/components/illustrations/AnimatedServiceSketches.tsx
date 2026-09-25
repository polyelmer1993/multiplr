"use client";

import { motion, type Transition } from "framer-motion";
import { useSite } from "@/components/SiteProvider";

/**
 * Living versions of the service sketches. The outline draws itself in,
 * then a small scene loops for as long as the card is on screen:
 *   0 · AI: a conversation plays out with an assistant.
 *   1 · Websites: a visitor's cursor lands on the button and an enquiry comes in.
 *   2 · Workflows: a job travels through each step and gets ticked off.
 * Colour comes from `currentColor`, so set a text colour on the parent.
 */
export function AnimatedServiceSketch({ index, active, className = "" }: { index: number; active: boolean; className?: string }) {
  const { reduced } = useSite();
  const play = active && !reduced;
  const Scene = [AiScene, WebScene, FlowScene][index];
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={`sketch stroke-current ${active ? "drawn" : ""} ${className}`}
    >
      <Scene play={play} still={reduced} />
    </svg>
  );
}

type SceneProps = { play: boolean; still: boolean };

/** A looping keyframe animation that only runs while `play` is true. */
const loop = (duration: number, times: number[], delay = 1.2): Transition => ({
  duration,
  times,
  repeat: Infinity,
  ease: "easeInOut",
  delay,
});

function AiScene({ play, still }: SceneProps) {
  const T = 6;
  // Each bubble: pops in at its moment, stays, then everything clears at the end.
  const pop = (at: number) =>
    play
      ? { opacity: [0, 0, 1, 1, 0], scale: [0.6, 0.6, 1, 1, 0.9], transition: loop(T, [0, at, at + 0.06, 0.92, 1]) }
      : { opacity: still ? 1 : 0, scale: 1 };
  return (
    <>
      <rect className="dr" pathLength="1" x="30" y="40" width="340" height="300" />
      <path className="dr" pathLength="1" d="M30 82h340" />
      <circle cx="54" cy="61" r="4" fill="currentColor" stroke="none" />
      <circle cx="70" cy="61" r="4" fill="currentColor" stroke="none" />

      {/* Question */}
      <motion.g style={{ originX: "60px", originY: "174px" }} animate={pop(0.05)}>
        <path d="M60 112h170v44H86l-26 18z" />
        <path d="M80 130h120M80 142h70" />
      </motion.g>
      {/* Typing dots, then the answer */}
      <motion.g
        animate={play ? { opacity: [0, 0, 1, 1, 0, 0] } : { opacity: 0 }}
        transition={loop(T, [0, 0.2, 0.24, 0.4, 0.44, 1])}
      >
        {[0, 1, 2].map((k) => (
          <motion.circle
            key={k}
            cx={300 + k * 14}
            cy="218"
            r="4"
            fill="currentColor"
            stroke="none"
            animate={play ? { y: [0, -6, 0] } : {}}
            transition={{ duration: 0.6, repeat: Infinity, delay: k * 0.12 }}
          />
        ))}
      </motion.g>
      <motion.g style={{ originX: "340px", originY: "266px" }} animate={pop(0.44)}>
        <path d="M340 188H170v60h144l26 18z" />
        <path d="M190 208h120M190 228h80" />
      </motion.g>

      {/* Input bar with a blinking caret and a send button that pulses */}
      <path className="dr" pathLength="1" d="M60 294h250v26H60z" />
      <motion.path
        d="M74 300v14"
        animate={play ? { opacity: [1, 0, 1] } : { opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d="M332 307l14-8v16z"
        fill="currentColor"
        style={{ originX: "339px", originY: "307px" }}
        animate={play ? { scale: [1, 1, 1.35, 1, 1] } : {}}
        transition={loop(T, [0, 0.36, 0.4, 0.46, 1])}
      />
    </>
  );
}

function WebScene({ play, still }: SceneProps) {
  const T = 5;
  const rise = (k: number) =>
    play
      ? { y: [24, 24, 0, 0, 24], opacity: [0, 0, 1, 1, 0], transition: loop(T, [0, 0.04 + k * 0.06, 0.16 + k * 0.06, 0.92, 1]) }
      : { y: 0, opacity: still ? 1 : 0 };
  return (
    <>
      <rect className="dr" pathLength="1" x="30" y="40" width="340" height="310" />
      <path className="dr" pathLength="1" d="M30 78h340" />
      <path className="dr" pathLength="1" d="M120 59h200" />
      {[50, 66, 82].map((cx) => (
        <circle key={cx} cx={cx} cy="59" r="4" fill="currentColor" stroke="none" />
      ))}
      <path className="dr" pathLength="1" d="M60 110h180M60 132h140" />

      {/* Call-to-action button: fills when "clicked" */}
      <path d="M60 158h92v30H60z" />
      <motion.rect
        x="60"
        y="158"
        width="92"
        height="30"
        fill="currentColor"
        stroke="none"
        animate={play ? { opacity: [0, 0, 0.9, 0.9, 0] } : { opacity: 0 }}
        transition={loop(T, [0, 0.55, 0.6, 0.92, 1])}
      />

      {/* Content cards rising in */}
      {[60, 158, 256].map((x, k) => (
        <motion.rect key={x} x={x} y="220" width="84" height="100" animate={rise(k)} />
      ))}

      {/* Enquiry notification */}
      <motion.g
        animate={play ? { opacity: [0, 0, 1, 1, 0], x: [16, 16, 0, 0, 0] } : { opacity: 0 }}
        transition={loop(T, [0, 0.62, 0.7, 0.9, 1])}
      >
        <rect x="236" y="96" width="112" height="40" rx="6" fill="currentColor" fillOpacity=".1" />
        <circle cx="256" cy="116" r="7" fill="currentColor" stroke="none" />
        <path d="M272 110h60M272 122h40" />
      </motion.g>

      {/* The visitor's cursor */}
      <motion.path
        d="M0 0l0 22 6-6 5 11 4-2-5-11 8 0z"
        fill="var(--color-paper)"
        strokeWidth="1.4"
        animate={
          play
            ? { x: [330, 330, 118, 118, 118, 330], y: [300, 300, 170, 170, 170, 300], scale: [1, 1, 1, 0.8, 1, 1] }
            : { x: 118, y: 170 }
        }
        transition={loop(T, [0, 0.2, 0.52, 0.56, 0.6, 1])}
      />
    </>
  );
}

function FlowScene({ play, still }: SceneProps) {
  const T = 5;
  // Waypoints the job travels through, box centre to box centre.
  const xs = [75, 205, 330, 330, 205, 205];
  const ys = [105, 105, 105, 210, 210, 290];
  const times = [0, 0.18, 0.36, 0.52, 0.66, 0.8];
  const lit = (at: number) =>
    play
      ? { opacity: [0, 0, 0.18, 0.18, 0], transition: loop(T, [0, at, at + 0.04, 0.95, 1]) }
      : { opacity: still ? 0.18 : 0 };
  return (
    <>
      {[
        [30, 70, 90, 70],
        [160, 70, 90, 70],
        [290, 70, 80, 70],
      ].map(([x, y, w, h], k) => (
        <g key={x}>
          <rect className="dr" pathLength="1" x={x} y={y} width={w} height={h} />
          <motion.rect x={x} y={y} width={w} height={h} fill="currentColor" stroke="none" animate={lit(times[k])} />
        </g>
      ))}
      <path className="dr" pathLength="1" d="M120 105h40M150 97l10 8-10 8" />
      <path className="dr" pathLength="1" d="M250 105h40M280 97l10 8-10 8" />
      <path className="dr" pathLength="1" d="M330 140v70H205v40" />
      <rect className="dr" pathLength="1" x="150" y="250" width="110" height="80" />
      <motion.rect x="150" y="250" width="110" height="80" fill="currentColor" stroke="none" animate={lit(0.8)} />
      <path className="dr" pathLength="1" d="M150 290H75V140" />
      <path className="dr" pathLength="1" d="M67 150l8-10 8 10" />

      {/* The tick draws each time the job lands */}
      <motion.path
        d="M186 290l14 14 26-30"
        strokeWidth="2.4"
        initial={{ pathLength: still ? 1 : 0 }}
        animate={play ? { pathLength: [0, 0, 1, 1, 0] } : { pathLength: still ? 1 : 0 }}
        transition={loop(T, [0, 0.8, 0.88, 0.96, 1])}
      />

      {/* The job itself */}
      <motion.circle
        r="7"
        fill="currentColor"
        stroke="none"
        initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
        animate={play ? { cx: xs, cy: ys, opacity: [1, 1, 1, 1, 1, 0] } : { opacity: 0 }}
        transition={{ duration: T * 0.8, times: times.map((t) => t / 0.8), repeat: Infinity, repeatDelay: T * 0.2, ease: "easeInOut", delay: 1.2 }}
      />
    </>
  );
}
