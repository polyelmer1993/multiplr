"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useSite } from "@/components/SiteProvider";
import { useOnScroll } from "@/hooks/useOnScroll";
import { clamp, span } from "@/lib/motion";

const CURVE = "M10 170 C 90 170, 120 40, 190 40 C 260 40, 300 150, 400 165 C 470 174, 520 176, 550 177";
const AREA = `${CURVE} L550 178 L10 178 Z`;

const SEGMENTS = [
  { label: "Innovators", share: "2.5%", x0: 10, x1: 120, note: "Trying new tools before they're proven. It's where I usually am, so you don't have to be." },
  { label: "Early", share: "13.5%", x0: 120, x1: 260, note: "Adopting once there's a clear win. The sweet spot for most small businesses, and where I help you land." },
  { label: "Majority", share: "68%", x0: 260, x1: 400, note: "Waiting until everyone around you is doing it. Safe, but most of the advantage has gone." },
  { label: "Late", share: "16%", x0: 400, x1: 550, note: "Catching up because you have to. It costs more, and the upside has passed." },
];

const segmentAt = (x: number) => Math.max(0, SEGMENTS.findIndex((s) => x >= s.x0 && x < s.x1));

/**
 * The technology adoption curve. It draws itself as you scroll into view; then
 * hover, drag or tap along it (or use the arrow keys) to explore each group.
 */
export function AdoptionCurve() {
  const { reduced } = useSite();
  const figRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const samples = useRef<{ x: number; y: number }[]>([]);
  const [active, setActive] = useState(0);
  const [exploring, setExploring] = useState(false);

  // Scroll-driven draw-in, like the original.
  const drawn = useMotionValue(0);
  useOnScroll(({ vh }) => {
    const r = figRef.current?.closest("section")?.getBoundingClientRect();
    if (r) drawn.set(reduced ? 1 : clamp((vh * 0.8 - r.top) / (r.height * 0.55), 0, 1));
  });
  const dashOffset = useTransform(drawn, (c) => 1 - c);
  const markOpacity = useTransform(drawn, (c) => span(c, 0.45, 0.6));
  const labelOpacity = useTransform(drawn, (c) => span(c, 0.55, 0.7));
  const ready = useTransform(drawn, (c) => span(c, 0.7, 0.9));
  const bandOpacity = useTransform(ready, (v) => v * 0.12);

  // Sample the curve once so we can find its height at any x.
  useEffect(() => {
    const path = pathRef.current!;
    const len = path.getTotalLength();
    samples.current = Array.from({ length: 241 }, (_, i) => {
      const pt = path.getPointAtLength((i / 240) * len);
      return { x: pt.x, y: pt.y };
    });
  }, []);
  const yAt = (x: number) => {
    const s = samples.current;
    if (!s.length) return 170;
    const k = s.findIndex((pt) => pt.x >= x);
    if (k <= 0) return s[0].y;
    const a = s[k - 1], b = s[k];
    return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x || 1);
  };

  // The explorer dot springs along the curve.
  const spring = { stiffness: 260, damping: 28 };
  const px = useSpring(120, spring);
  const py = useSpring(96, spring);
  const moveTo = (x: number) => {
    const cx = clamp(x, 12, 548);
    px.set(cx);
    py.set(yAt(cx));
    setActive(segmentAt(cx));
  };
  const toSegment = (i: number) => {
    setExploring(true);
    moveTo((SEGMENTS[i].x0 + SEGMENTS[i].x1) / 2);
  };

  const onPointer = (e: PointerEvent<SVGSVGElement>) => {
    const r = svgRef.current!.getBoundingClientRect();
    setExploring(true);
    moveTo(((e.clientX - r.left) / r.width) * 560);
  };

  // Highlight band under the curve for the current group.
  const seg = SEGMENTS[active];

  return (
    <figure ref={figRef} className="mt-[clamp(48px,8vh,80px)] max-w-[680px]">
      <svg
        ref={svgRef}
        viewBox="0 0 560 214"
        role="img"
        aria-label="The technology adoption curve, from innovators to late adopters."
        className="block h-auto w-full cursor-crosshair touch-pan-y overflow-visible"
        onPointerMove={onPointer}
        onPointerDown={onPointer}
      >
        <defs>
          <clipPath id="seg-clip">
            <motion.rect y="0" height="214" initial={false} animate={{ x: seg.x0, width: seg.x1 - seg.x0 }} transition={{ type: "spring", stiffness: 220, damping: 30 }} />
          </clipPath>
        </defs>

        {/* Group boundaries */}
        {SEGMENTS.slice(1).map((s) => (
          <motion.line key={s.x0} x1={s.x0} x2={s.x0} y1="30" y2="178" strokeDasharray="2 5" className="stroke-hair" style={{ opacity: ready }} />
        ))}

        {/* Soft fill under the active group */}
        <motion.path d={AREA} clipPath="url(#seg-clip)" className="fill-hd" style={{ opacity: bandOpacity }} />

        <path d={CURVE} fill="none" strokeWidth="2" className="stroke-hair" />
        <motion.path
          ref={pathRef}
          d={CURVE}
          pathLength="1"
          fill="none"
          strokeWidth="2.5"
          strokeDasharray="1"
          className="stroke-fg"
          style={{ strokeDashoffset: dashOffset }}
        />
        <path d="M10 178 H550" strokeWidth="1" className="stroke-hair" />

        {/* "Usually here" marker, with a gentle pulse */}
        <motion.g style={{ opacity: markOpacity }}>
          <line x1="120" y1="178" x2="120" y2="96" strokeWidth="2" strokeDasharray="4 5" className="stroke-hd" />
          {!reduced && (
            <motion.circle
              cx="120"
              cy="96"
              r="7.5"
              className="fill-hd"
              style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
              animate={{ scale: [1, 2.4], opacity: [0.35, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <circle cx="120" cy="96" r="7.5" className="fill-hd" />
        </motion.g>
        <motion.text x="120" y="76" textAnchor="middle" className="fill-hd font-mono text-[17px] font-medium tracking-[.1em]" style={{ opacity: labelOpacity }}>
          USUALLY HERE
        </motion.text>

        {/* Explorer dot that follows your pointer along the curve */}
        {exploring && (
          <motion.g style={{ x: px, y: py }}>
            <circle r="11" className="fill-bgc stroke-fg" strokeWidth="1.5" />
            <circle r="4" className="fill-fg" />
          </motion.g>
        )}
      </svg>

      {/* Group picker: works for touch, keyboard and screen readers */}
      <div
        role="tablist"
        aria-label="Adopter groups"
        className="mt-3 grid grid-cols-4 border-t border-hair"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            const i = (active + (e.key === "ArrowRight" ? 1 : SEGMENTS.length - 1)) % SEGMENTS.length;
            toSegment(i);
            (e.currentTarget.children[i] as HTMLElement).focus();
          }
        }}
      >
        {SEGMENTS.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.label}
              type="button"
              role="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => toSegment(i)}
              onMouseEnter={() => toSegment(i)}
              className={`relative cursor-pointer pt-3 text-center font-mono text-[11px] font-medium tracking-[.1em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hd md:text-[13px] ${
                on ? "text-hd" : "text-fg-soft hover:text-fg"
              }`}
            >
              {on && <motion.span layoutId="curve-tab" className="absolute inset-x-2 -top-px h-[2px] bg-hd" />}
              {s.label}
            </button>
          );
        })}
      </div>

      <figcaption className="mt-5 min-h-[4.5em] text-[14.5px] text-fg-soft" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={active}
            className="block"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <span className="mr-2 font-mono text-[13px] font-semibold text-hd">{seg.share}</span>
            <span className="text-fg">{seg.label === "Early" ? "Early adopters" : seg.label === "Late" ? "Late adopters" : seg.label}.</span>{" "}
            {seg.note}
          </motion.span>
        </AnimatePresence>
      </figcaption>
    </figure>
  );
}
