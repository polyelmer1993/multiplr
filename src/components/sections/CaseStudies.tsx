"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Button } from "@/components/ui/Button";
import { CaseCard } from "@/components/ui/CaseCard";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { RiseText } from "@/components/ui/RiseText";
import { Sheet } from "@/components/ui/Sheet";
import { CASE_STUDIES } from "@/lib/content";
import { EASE } from "@/lib/motion";

/**
 * Case studies as a swipeable row. The track runs off the right edge of the
 * screen, cards rise in one after another, and arrow buttons step through.
 */
export function CaseStudies() {
  const trackRef = useRef<HTMLUListElement>(null);
  const inView = useInView(trackRef, { once: true, amount: 0.2 });
  const [edge, setEdge] = useState({ start: true, end: false });

  const step = (dir: 1 | -1) => {
    const track = trackRef.current!;
    const card = track.firstElementChild as HTMLElement;
    track.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: "smooth" });
  };

  const onScroll = () => {
    const t = trackRef.current!;
    setEdge({ start: t.scrollLeft < 8, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 8 });
  };

  return (
    <Sheet id="work" tone="field" aria-labelledby="work-title" className="z-10 overflow-hidden py-[clamp(90px,14vh,150px)]">
      <Container>
        <Label perch className="text-strike">
          Case studies
        </Label>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <RiseText
            id="work-title"
            lines={["The pieces we've fixed,", { text: "and what changed.", accent: true }]}
            className="text-[clamp(2.1rem,4.4vw,4.4rem)] leading-[1] font-light tracking-[-.045em] text-deep"
          />
          <div className="flex items-center gap-2">
            <ArrowButton label="Previous case study" disabled={edge.start} onClick={() => step(-1)} flip />
            <ArrowButton label="Next case study" disabled={edge.end} onClick={() => step(1)} />
          </div>
        </div>
      </Container>

      {/* The track lines up with the content on the left and bleeds off the right edge. */}
      <ul
        ref={trackRef}
        onScroll={onScroll}
        aria-label="Case studies"
        className="mt-[clamp(36px,6vh,60px)] flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] md:scroll-px-10 md:px-[max(40px,calc((100vw-1440px)/2+40px))] [&::-webkit-scrollbar]:hidden"
      >
        {CASE_STUDIES.map((study, i) => (
          <motion.li
            key={study.slug}
            initial={{ opacity: 0, y: 60, rotate: 1.5 }}
            animate={inView ? { opacity: 1, y: 0, rotate: 0 } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.12 }}
            className="w-[min(84vw,440px)] shrink-0 snap-start"
          >
            <CaseCard study={study} />
          </motion.li>
        ))}
        <motion.li
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: EASE, delay: CASE_STUDIES.length * 0.12 }}
          className="flex w-[min(70vw,300px)] shrink-0 snap-start flex-col justify-end rounded-[18px] bg-deep p-6 text-bone"
        >
          <p className="text-[clamp(1.4rem,2vw,1.8rem)] leading-[1.1] font-light tracking-[-.035em]">
            Every piece, in full: the problem, the fix and the numbers.
          </p>
          <Button href="/case-studies" variant="light" arrow className="mt-6 self-start">
            All case studies
          </Button>
        </motion.li>
      </ul>
    </Sheet>
  );
}

function ArrowButton({ label, onClick, disabled, flip }: { label: string; onClick: () => void; disabled: boolean; flip?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-12 cursor-pointer place-items-center rounded-[6px] bg-paper text-deep transition-[background-color,opacity,transform] duration-300 hover:bg-deep hover:text-bone active:scale-95 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-paper disabled:hover:text-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strike"
    >
      <ArrowIcon className={flip ? "-rotate-135" : "rotate-45"} />
    </button>
  );
}
