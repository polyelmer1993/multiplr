"use client";

import { AnimatePresence, motion, useAnimationFrame, useInView, useMotionValue, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { AnimatedServiceSketch } from "@/components/illustrations/AnimatedServiceSketches";
import { Orbit } from "@/components/illustrations/Orbit";
import { useSite } from "@/components/SiteProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { RiseText } from "@/components/ui/RiseText";
import { Sheet } from "@/components/ui/Sheet";
import { SERVICES } from "@/lib/content";
import { EASE } from "@/lib/motion";

/** How long each service stays up before the panel moves on, in ms. */
const DWELL = 8000;

/** Tab labels for narrow screens. */
const SHORT = ["AI", "Websites", "Workflows"];

const ICONS = [
  // AI: a chat bubble with a spark
  <path key="ai" d="M4 5h16v11H10l-4 3v-3H4zM12 8v5M9.5 10.5h5" />,
  // Websites: a browser window
  <path key="web" d="M3 5h18v14H3zM3 9h18M6 7h.01M8.5 7h.01M7 13h6M7 16h4" />,
  // Workflows: two boxes and a hand-off
  <path key="flow" d="M2.5 8h6v8h-6zM15.5 8h6v8h-6zM9 12h6M12.5 9.5L15 12l-2.5 2.5" />,
];

/**
 * "Our services" on the deep navy sheet. A sphere and its orbits turn as you
 * scroll; below, a tabbed panel walks through each service on a timer (paused
 * while you hover or focus it), with its living sketch alongside.
 */
export function Services() {
  const { reduced } = useSite();
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const inView = useInView(panelRef, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useMotionValue(0);

  const pick = (i: number) => {
    setActive(i);
    timer.set(0);
  };

  useAnimationFrame((_, delta) => {
    if (reduced || paused || !inView) return;
    const t = timer.get() + delta / DWELL;
    if (t >= 1) pick((active + 1) % SERVICES.length);
    else timer.set(t);
  });

  const s = SERVICES[active];

  return (
    <Sheet ref={ref} id="services" tone="deep" aria-labelledby="services-title" className="z-10 overflow-hidden py-[clamp(90px,14vh,150px)]">
      <Orbit progress={scrollYProgress} className="absolute top-[-8%] right-[-22%] w-[min(92vw,900px)] opacity-90 md:right-[-8%]" />

      <Container className="relative">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Label perch className="text-glow">
              Services
            </Label>
            <RiseText
              id="services-title"
              lines={["Three ways to put", { text: "technology to work.", accent: true }]}
              accentClassName="text-glow"
              className="mt-5 text-[clamp(2.1rem,4.4vw,4.4rem)] leading-[1] font-light tracking-[-.045em] text-bone"
            />
          </div>
          <p className="max-w-[400px] text-[clamp(1rem,1.15vw,1.1rem)] text-bone/65 md:col-span-4 md:col-start-9">
            Start with the piece that matters most. Most people add the next one once the first is working.
          </p>
        </div>

        <div
          ref={panelRef}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="mt-[clamp(40px,7vh,72px)] rounded-[22px] border border-bone/12 bg-deep/40 p-2 backdrop-blur-xl md:p-3"
        >
          {/* Tabs */}
          <div role="tablist" aria-label="Services" className="grid grid-cols-3 gap-1 rounded-[14px] bg-bone/[.06] p-1">
            {SERVICES.map((svc, i) => {
              const on = i === active;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  id={`svc-tab-${i}`}
                  aria-selected={on}
                  aria-controls="svc-panel"
                  onClick={() => pick(i)}
                  className={`relative cursor-pointer overflow-hidden rounded-[10px] px-3 py-3 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-glow md:px-5 md:py-4 ${
                    on ? "bg-bone text-deep" : "text-bone/60 hover:bg-bone/[.06] hover:text-bone"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="hidden size-5 flex-none fill-none stroke-current stroke-[1.5] md:block [stroke-linecap:round] [stroke-linejoin:round]">
                      {ICONS[i]}
                    </svg>
                    <span className="font-mono text-[10.5px] font-medium tracking-[.1em] uppercase md:text-[11.5px]">
                      <span className="md:hidden">{SHORT[i]}</span>
                      <span className="max-md:hidden">{svc.title.join(" ")}</span>
                    </span>
                  </span>
                  {on && !reduced && (
                    <motion.span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-strike" style={{ scaleX: timer }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${active}`} className="relative grid md:min-h-[460px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: EASE }}
                className="grid gap-6 p-4 md:grid-cols-12 md:items-center md:gap-10 md:p-8"
              >
                <div className="aspect-4/3 rounded-[14px] border border-bone/12 bg-bone/[.04] md:col-span-6 md:aspect-square md:max-h-[420px]">
                  <AnimatedServiceSketch index={active} active={inView} className="h-full w-full p-[9%] text-glow" />
                </div>
                <div className="md:col-span-6">
                  <p className="font-mono text-[11px] font-medium tracking-[.14em] text-bone/45 uppercase">
                    0{active + 1} / 0{SERVICES.length}
                  </p>
                  <h3 className="mt-3 text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.02] font-light tracking-[-.045em] text-bone">
                    {s.title[0]} <span className="whitespace-nowrap">{s.title[1]}</span>
                  </h3>
                  <p className="mt-4 max-w-[480px] text-[clamp(1rem,1.15vw,1.1rem)] text-bone/70">{s.body}</p>
                  <ul aria-label="Includes" className="mt-6 flex flex-col border-t border-bone/12">
                    {s.chips.map((c, k) => (
                      <li key={c} className="flex items-center gap-4 border-b border-bone/12 py-3 text-[14.5px] text-bone/85">
                        <span className="font-mono text-[10.5px] text-glow">0{k + 1}</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                  <Button href="#talk" variant="light" arrow className="mt-7">
                    Start with this piece
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Sheet>
  );
}
