"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";
import { useSite } from "@/components/SiteProvider";
import { SERVICES } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { ServiceChips, ServicesHeader, ServiceSketch, serviceTitle } from "./shared";

/**
 * Option D · Editorial list. Big numbered rows; hovering one floats a preview
 * card that follows your cursor, and clicking opens the details.
 */
export function ServicesList({ titleId }: { titleId: string }) {
  const { reduced } = useSite();
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  const [hover, setHover] = useState<number | null>(null);

  // Floating preview position, with a lean based on how fast you move.
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const rawX = useMotionValue(0);
  const rotate = useTransform(useVelocity(rawX), [-1500, 1500], [-10, 10], { clamp: true });
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = listRef.current!.getBoundingClientRect();
    rawX.set(e.clientX);
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <>
      <ServicesHeader titleId={titleId} />
      <ul
        ref={listRef}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        className="relative mt-[clamp(28px,5vh,48px)] border-b border-hair"
      >
        {SERVICES.map((s, i) => {
          const on = open === i;
          const panelId = `${titleId}-row-${i}`;
          return (
            <li key={i} className="border-t border-hair" onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}>
              <h3>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={panelId}
                  onClick={() => setOpen(on ? null : i)}
                  className="group flex w-full cursor-pointer items-center gap-[clamp(16px,3vw,40px)] py-[clamp(20px,3.4vh,36px)] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hd"
                >
                  <span className="w-8 font-mono text-[12px] font-semibold tracking-[.2em] text-fg-soft">0{i + 1}</span>
                  <span
                    className={`flex-1 text-[clamp(1.7rem,4.4vw,4rem)] leading-[1] font-medium tracking-[-.05em] transition-[color,transform] duration-500 ease-site group-hover:translate-x-3 ${
                      on || hover === i ? "text-strike" : "text-fg"
                    }`}
                  >
                    {serviceTitle(s.title)}
                  </span>
                  <span aria-hidden="true" className="relative grid size-11 flex-none place-items-center rounded-full border border-hair transition-colors duration-300 group-hover:border-fg">
                    <span className="absolute h-[1.5px] w-3.5 bg-fg" />
                    <motion.span className="absolute h-3.5 w-[1.5px] bg-fg" animate={{ scaleY: on ? 0 : 1 }} transition={{ duration: 0.3 }} />
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1, transition: { duration: 0.5, ease: EASE } }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.35, ease: EASE } }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 pb-8 pl-[calc(2rem+clamp(16px,3vw,40px))] md:grid-cols-[minmax(0,1fr)_200px] md:pr-16">
                      <div>
                        <p className="max-w-[620px] text-[clamp(1rem,1.2vw,1.12rem)] text-fg-soft">{s.body}</p>
                        <ServiceChips chips={s.chips} className="mt-5 text-fg" />
                      </div>
                      <div className="aspect-4/3 border border-ink/8 bg-paper md:hidden">
                        <ServiceSketch index={i} drawn className="h-full w-full p-[8%]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}

        {/* Preview card that follows the cursor (mouse only) */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block"
            style={{ x, y, rotate }}
          >
            <AnimatePresence>
              {hover !== null && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="relative ml-6 -mt-[120px] h-[200px] w-[260px] overflow-hidden border border-ink/10 bg-paper shadow-[0_30px_60px_-30px_rgba(13,19,85,.55)]"
                >
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={hover}
                      className="absolute inset-0"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <ServiceSketch index={hover} drawn className="h-full w-full p-[6%]" />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </ul>
    </>
  );
}
