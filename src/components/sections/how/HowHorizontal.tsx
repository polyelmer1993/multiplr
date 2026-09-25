"use client";

import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { Container } from "@/components/ui/Container";
import { STEPS } from "@/lib/content";
import { clamp, eio, span } from "@/lib/motion";
import { DIAGRAMS, HowHeader } from "./shared";

const N = STEPS.length;

/**
 * Option B · Sideways scroll. The section pins and scrolling down slides the
 * steps across. The card in the middle grows into focus and its diagram plays.
 */
export function HowHorizontal({ titleId }: { titleId: string }) {
  const { reduced } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [over, setOver] = useState(0);

  // How far the track needs to travel to show the last card.
  useEffect(() => {
    const track = trackRef.current!;
    const measure = () => setOver(Math.max(0, track.scrollWidth - track.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const p = reduced ? done : scrollYProgress;
  const t = useTransform(p, (v) => eio(span(v, 0.08, 0.92)));
  const x = useTransform(t, (v) => -over * v);

  if (reduced) {
    return (
      <div ref={ref} className="py-[clamp(90px,14vh,160px)]">
        <Container>
          <HowHeader titleId={titleId} />
          <ol ref={trackRef} className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Card key={i} index={i} t={done} title={s.title} body={s.body} />
            ))}
          </ol>
        </Container>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-16">
        <Container>
          <HowHeader titleId={titleId} className="mb-[clamp(20px,4vh,40px)]" />
          <motion.ol ref={trackRef} className="flex gap-[clamp(16px,2vw,28px)] overflow-visible" style={{ x }}>
            {STEPS.map((s, i) => (
              <Card key={i} index={i} t={t} title={s.title} body={s.body} />
            ))}
          </motion.ol>

          <div className="mt-[clamp(18px,3vh,32px)] flex items-center gap-4">
            <div aria-hidden="true" className="relative h-px flex-1 bg-hair">
              <motion.div className="absolute inset-0 origin-left bg-strike" style={{ scaleX: t }} />
            </div>
            <Counter t={t} />
          </div>
        </Container>
      </div>
    </div>
  );
}

function Counter({ t }: { t: MotionValue<number> }) {
  const [i, setI] = useState(0);
  useEffect(() => t.on("change", (v) => setI(Math.min(N - 1, Math.round(v * (N - 1))))), [t]);
  return (
    <p className="font-mono text-[12px] font-medium tracking-[.2em] text-fg-soft">
      <span className="text-fg">0{i + 1}</span> / 0{N}
    </p>
  );
}

function Card({ index, t, title, body }: { index: number; t: MotionValue<number>; title: string; body: string }) {
  // Where this card sits on the 0→1 track, and how close it is to centre stage.
  const at = N === 1 ? 0 : index / (N - 1);
  const focus = useTransform(t, (v) => 1 - clamp(Math.abs(v - at) * (N - 1), 0, 1));
  const scale = useTransform(focus, [0, 1], [0.92, 1]);
  const opacity = useTransform(focus, [0, 1], [0.45, 1]);
  // The diagram plays as the card slides into focus.
  const p = useTransform(t, (v) => clamp((v - at) * (N - 1) + 1, 0, 1));
  const D = DIAGRAMS[index];

  return (
    <motion.li
      style={{ scale, opacity }}
      className="flex w-[min(80vw,560px)] shrink-0 flex-col border border-hair bg-paper p-[clamp(18px,2vw,28px)] shadow-[0_30px_60px_-45px_rgba(13,19,85,.6)] md:w-[min(52vw,620px)]"
    >
      <div aria-hidden="true" className="border border-ink/8 bg-bone/32 [&_svg]:block [&_svg]:aspect-16/10 [&_svg]:h-auto [&_svg]:max-h-[38svh] [&_svg]:w-full">
        <D p={p} />
      </div>
      <div className="mt-5 flex items-baseline gap-4">
        <span className="font-mono text-[12px] font-semibold tracking-[.2em] text-fg-soft">0{index + 1}</span>
        <div>
          <h3 className="text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.08] font-medium tracking-[-.04em] text-strike">{title}</h3>
          <p className="mt-2 text-[clamp(.95rem,1.05vw,1.05rem)] text-fg-soft">{body}</p>
        </div>
      </div>
    </motion.li>
  );
}
