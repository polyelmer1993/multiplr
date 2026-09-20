"use client";

import { Parallax } from "@/components/motion/Parallax";
import { cn } from "@/lib/cn";

type Tone = "bone" | "strike";

const LINE: Record<Tone, string> = {
  // On the bone stage the grid is a muted hairline, barely there.
  bone: "var(--muted)",
  // Inside the full-bleed Indigo Strike band only bone reads.
  strike: "var(--bone)",
};

const RULE: Record<Tone, string> = {
  bone: "border-strike/[0.10]",
  strike: "border-bone/[0.14]",
};

/**
 * The house backdrop: a parallaxing hairline grid with two square rules
 * drifting at different depths. Decorative only — aria-hidden, pointer-events
 * off, and it never carries meaning a sighted user gets and a screen reader
 * does not.
 *
 * The parent must be `relative` and clip its overflow.
 */
export function GridBackdrop({
  tone = "bone",
  className,
  /** Grid cell in px. Larger reads calmer. */
  cell = 72,
}: {
  tone?: Tone;
  className?: string;
  cell?: number;
}) {
  const id = `grid-${tone}-${cell}`;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Layer 1 — the grid. Deepest, so it travels least. */}
      <Parallax distance={56} className="absolute -inset-y-[18%] inset-x-0" damp={false}>
        <svg className="h-full w-full" aria-hidden="true">
          <defs>
            <pattern id={id} width={cell} height={cell} patternUnits="userSpaceOnUse">
              <path
                d={`M ${cell} 0 L 0 0 0 ${cell}`}
                fill="none"
                stroke={LINE[tone]}
                strokeWidth="1"
                opacity={tone === "bone" ? 0.14 : 0.16}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
      </Parallax>

      {/* Layer 2 — a large square rule, off-stage right. */}
      <Parallax distance={-140} className="absolute -inset-y-[25%] inset-x-0">
        <div className="relative h-full w-full">
          <div
            className={cn(
              "absolute right-[-12%] top-[18%] aspect-square w-[46%] border-hairline",
              RULE[tone],
            )}
          />
        </div>
      </Parallax>

      {/* Layer 3 — a smaller square rule, shallowest, so it travels most. */}
      <Parallax distance={-220} className="absolute -inset-y-[30%] inset-x-0">
        <div className="relative h-full w-full">
          <div
            className={cn(
              "absolute left-[-6%] top-[52%] aspect-square w-[22%] border-hairline",
              RULE[tone],
            )}
          />
        </div>
      </Parallax>
    </div>
  );
}
