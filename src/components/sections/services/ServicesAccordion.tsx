"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SERVICES } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { ServiceChips, ServicesHeader, ServiceSketch, serviceTitle } from "./shared";

/**
 * Option B · Expanding panels. Three tall panels side by side; hover or tap
 * one and it widens to show the details while the others fold to slim
 * vertical tabs. On phones it becomes a regular accordion.
 */
export function ServicesAccordion({ titleId }: { titleId: string }) {
  const [open, setOpen] = useState(0);

  return (
    <>
      <ServicesHeader titleId={titleId} />
      <div className="mt-[clamp(28px,5vh,48px)] flex flex-col gap-3 md:h-[clamp(460px,62vh,560px)] md:flex-row">
        {SERVICES.map((s, i) => {
          const on = i === open;
          const panelId = `${titleId}-panel-${i}`;
          return (
            <div
              key={i}
              onMouseEnter={() => setOpen(i)}
              style={{ "--g": on ? 4.2 : 1 } as React.CSSProperties}
              className={`relative overflow-hidden rounded-[22px] border transition-[flex-grow,background-color,border-color] duration-700 ease-site md:min-w-0 md:flex-[var(--g)_1_0%] ${
                on ? "border-ink/14 bg-paper shadow-[0_30px_60px_-40px_rgba(13,19,85,.6)]" : "border-ink/10 bg-paper/45 hover:bg-paper/75"
              }`}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={panelId}
                  onClick={() => setOpen(i)}
                  className={`flex w-full cursor-pointer items-center gap-4 p-5 text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-hd md:p-7 ${
                    on ? "" : "md:absolute md:inset-0 md:flex-col md:items-start md:justify-between"
                  }`}
                >
                  <span className="font-mono text-[12px] font-semibold tracking-[.2em] text-fg-soft">0{i + 1}</span>
                  <span
                    className={`text-[clamp(1.3rem,2.2vw,2rem)] leading-[1.05] font-medium tracking-[-.045em] transition-colors duration-500 ${
                      on ? "text-strike md:sr-only" : "text-fg md:rotate-180 md:[writing-mode:vertical-rl]"
                    }`}
                  >
                    {serviceTitle(s.title)}
                  </span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: on ? 45 : 0 }}
                    className="ml-auto text-[22px] leading-none text-fg-soft md:hidden"
                  >
                    +
                  </motion.span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    id={panelId}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto", transition: { duration: 0.5, ease: EASE, opacity: { delay: 0.15 } } }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 px-5 pb-6 md:min-w-[520px] md:grid-cols-[minmax(0,1fr)_minmax(0,.85fr)] md:px-7 md:pb-8">
                      <div className="flex flex-col">
                        <p className="hidden text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.04] font-medium tracking-[-.05em] text-strike md:block">
                          {serviceTitle(s.title)}
                        </p>
                        <p className="text-[clamp(.95rem,1.1vw,1.05rem)] text-fg-soft md:mt-4">{s.body}</p>
                        <ServiceChips chips={s.chips} className="mt-5 text-fg" />
                      </div>
                      <div className="aspect-4/3 border border-ink/8 bg-bone/32 md:aspect-square">
                        <ServiceSketch index={i} drawn className="h-full w-full p-[8%]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}
