"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/TiltCard";
import { SERVICES } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { ServiceChips, ServicesHeader, ServiceSketch, serviceTitle } from "./shared";

const SPANS = ["md:col-span-4 md:row-span-2", "md:col-span-2", "md:col-span-2"];

/**
 * Option E · Bento grid. A featured tile plus two smaller ones, each tilting
 * towards the cursor with a spotlight; tiles rise in one after another.
 */
export function ServicesBento({ titleId }: { titleId: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <>
      <ServicesHeader titleId={titleId} />
      <ul ref={ref} className="mt-[clamp(28px,5vh,48px)] grid auto-rows-[minmax(240px,auto)] grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
        {SERVICES.map((s, i) => (
          <motion.li
            key={i}
            className={SPANS[i]}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
          >
            <Tile index={i} featured={i === 0} drawn={inView} title={s.title} body={s.body} chips={s.chips} />
          </motion.li>
        ))}
        <motion.li
          className="md:col-span-6"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
        >
          <div className="flex h-full flex-wrap items-center justify-between gap-5 rounded-[22px] bg-deep p-[clamp(22px,3vw,36px)] text-bone">
            <p className="max-w-[560px] text-[clamp(1.3rem,2.2vw,2rem)] leading-[1.15] font-medium tracking-[-.04em]">
              Not sure which piece to start with? We&apos;ll work it out together.
            </p>
            <Button href="/#talk" arrow className="border-bone! bg-bone! text-deep!">
              Let&apos;s talk
            </Button>
          </div>
        </motion.li>
      </ul>
    </>
  );
}

function Tile({
  index,
  featured,
  drawn,
  title,
  body,
  chips,
}: {
  index: number;
  featured: boolean;
  drawn: boolean;
  title: string[];
  body: string;
  chips: string[];
}) {
  const [hover, setHover] = useState(false);
  return (
    <TiltCard max={featured ? 3 : 5} className="rounded-[22px]">
      <article
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        className={`flex h-full flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-paper p-[clamp(20px,2.4vw,32px)] transition-shadow duration-500 hover:shadow-[0_30px_60px_-40px_rgba(13,19,85,.6)] ${
          featured ? "md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-8" : ""
        }`}
      >
        <motion.div
          className={`border border-ink/8 bg-bone/32 ${featured ? "aspect-4/3 md:order-2" : "mb-5 aspect-2/1"}`}
          animate={{ scale: hover ? 1.03 : 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <ServiceSketch index={index} drawn={drawn} className="h-full w-full p-[6%]" />
        </motion.div>
        <div className={featured ? "mt-6 md:order-1 md:mt-0" : ""}>
          <p className="font-mono text-[11px] font-medium tracking-[.2em] text-fg-soft uppercase">0{index + 1}</p>
          <h3
            className={`mt-2 leading-[1.04] font-medium tracking-[-.05em] text-strike ${
              featured ? "text-[clamp(1.8rem,3.4vw,3.2rem)]" : "text-[clamp(1.35rem,2vw,1.8rem)]"
            }`}
          >
            {serviceTitle(title)}
          </h3>
          <p className={`mt-3 text-fg-soft ${featured ? "text-[clamp(1rem,1.2vw,1.12rem)]" : "text-[15px]"}`}>{body}</p>
          {featured && <ServiceChips chips={chips} className="mt-5 text-fg" />}
        </div>
      </article>
    </TiltCard>
  );
}
