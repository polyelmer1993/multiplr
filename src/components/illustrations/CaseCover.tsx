"use client";

import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useSite } from "@/components/SiteProvider";
import type { CaseStudy } from "@/lib/content";

/**
 * Cover art for a case study. Placeholder artwork until real project imagery
 * exists: a back layer and a front layer that drift at different speeds as
 * you scroll, giving the card depth (parallax).
 */
export function CaseCover({ motif, stat, className = "" }: { motif: CaseStudy["motif"]; stat: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useSite();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const still = useMotionValue(0.5);
  const p = reduced ? still : scrollYProgress;
  const back = useTransform(p, [0, 1], ["-6%", "6%"]);
  const front = useTransform(p, [0, 1], ["14%", "-14%"]);
  const statY = useTransform(p, [0, 1], ["30%", "-30%"]);

  return (
    <div ref={ref} aria-hidden="true" className={`relative overflow-hidden bg-deep ${className}`}>
      {/* Back layer: a drafting grid, slightly oversized so it can drift. */}
      <motion.div
        className="absolute -inset-[8%] bg-[linear-gradient(rgba(232,230,224,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(232,230,224,.07)_1px,transparent_1px)] bg-size-[32px_32px]"
        style={{ y: back }}
      />
      {/* Front layer: the motif. */}
      <motion.svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" fill="none" style={{ y: front }}>
        {MOTIFS[motif]}
      </motion.svg>
      {/* The headline result, floating above everything. */}
      <motion.p
        className="absolute bottom-[8%] left-[7%] font-mono text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold tracking-[-.02em] text-bone"
        style={{ y: statY }}
      >
        {stat}
      </motion.p>
    </div>
  );
}

const S = { stroke: "#e8e6e0", strokeOpacity: 0.55, strokeWidth: 1.4 };
const A = { stroke: "#6f7cff", strokeWidth: 2 };

const MOTIFS: Record<CaseStudy["motif"], React.ReactNode> = {
  // A browser window with a bar chart climbing.
  web: (
    <>
      <rect x="150" y="40" width="210" height="150" {...S} />
      <path d="M150 64h210" {...S} />
      <circle cx="166" cy="52" r="3" fill="#e8e6e0" fillOpacity=".55" />
      <circle cx="178" cy="52" r="3" fill="#e8e6e0" fillOpacity=".55" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={176 + i * 34} y={170 - (i + 1) * 18} width="20" height={(i + 1) * 18} fill="#6f7cff" fillOpacity={0.25 + i * 0.15} />
      ))}
      <path d="M176 142 L210 126 L244 112 L278 92 L312 76 L340 70" {...A} />
    </>
  ),
  // Boxes passing work along to a finished tick.
  flow: (
    <>
      <rect x="150" y="60" width="60" height="44" {...S} />
      <rect x="240" y="60" width="60" height="44" {...S} />
      <rect x="195" y="140" width="80" height="54" {...S} />
      <path d="M210 82h30M232 76l8 6-8 6" {...S} />
      <path d="M270 104v20h-35v16" {...S} />
      <path d="M318 82h36v76h-79" {...A} />
      <path d="M220 168l10 10 20-22" {...A} />
    </>
  ),
  // A conversation with an assistant.
  ai: (
    <>
      <path d="M150 50h150v50H176l-26 18z" {...S} />
      <path d="M170 68h110M170 82h70" {...S} />
      <path d="M370 124H220v56h124l26 18z" {...A} />
      <path d="M240 144h100M240 160h60" {...S} />
      <path d="M330 60l6 14 14 6-14 6-6 14-6-14-14-6 14-6z" fill="#6f7cff" />
    </>
  ),
};
