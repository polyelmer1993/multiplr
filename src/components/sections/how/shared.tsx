"use client";

import type { MotionValue } from "framer-motion";
import type { ComponentType } from "react";
import { FindDiagram, FixDiagram, NextDiagram } from "@/components/illustrations/StepDiagrams";
import { Perch } from "@/components/ui/Perch";
import { FadeIn, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type Diagram = ComponentType<{ p: MotionValue<number> }>;
/** One animated diagram per step, each driven by a 0→1 progress value. */
export const DIAGRAMS: Diagram[] = [FindDiagram, FixDiagram, NextDiagram];

/** "How I work" title and intro. */
export function HowHeader({ titleId, className = "" }: { titleId: string; className?: string }) {
  return (
    <Reveal className={`relative ${className}`}>
      <div className="max-w-[640px]">
        <SectionHeading id={titleId}>How I work</SectionHeading>
        <FadeIn delay={0.25}>
          <p className="mt-3 text-[clamp(.98rem,1.15vw,1.08rem)] text-fg-soft">
            Three steps, repeated. Each round makes the next one easier.
          </p>
        </FadeIn>
      </div>
      <Perch className="top-0 right-0" />
    </Reveal>
  );
}
