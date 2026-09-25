"use client";

import type { ReactNode } from "react";
import { AiSketch, FlowSketch, WebSketch } from "@/components/illustrations/ServiceSketches";
import { FadeIn, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SKETCHES = [AiSketch, WebSketch, FlowSketch];

/** "Our services." title and intro, with an optional slot on the right (e.g. carousel controls). */
export function ServicesHeader({ titleId, aside }: { titleId: string; aside?: ReactNode }) {
  return (
    <Reveal className="relative flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-[620px]">
        <SectionHeading id={titleId}>Our services.</SectionHeading>
        <FadeIn delay={0.25}>
          <p className="mt-3 text-[clamp(.98rem,1.15vw,1.08rem)] text-fg-soft">
            Start with the piece that matters most. Most people add the next one once the first is working.
          </p>
        </FadeIn>
      </div>
      {aside && <FadeIn delay={0.35}>{aside}</FadeIn>}
    </Reveal>
  );
}

/** The line sketch for service `index`. Draws itself in when `drawn` turns true. */
export function ServiceSketch({ index, drawn, className = "" }: { index: number; drawn: boolean; className?: string }) {
  const Sketch = SKETCHES[index];
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={`sketch ${drawn ? "drawn" : ""} ${className}`}>
      <Sketch />
    </svg>
  );
}

export function ServiceChips({ chips, className = "" }: { chips: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Includes">
      {chips.map((c) => (
        <li key={c} className="border border-current/15 px-3 py-[7px] text-[13px] font-medium">
          {c}
        </li>
      ))}
    </ul>
  );
}

export const serviceTitle = (t: string[]) => (
  <>
    {t[0]} <span className="whitespace-nowrap">{t[1]}</span>
  </>
);
