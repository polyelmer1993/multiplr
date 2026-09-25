"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Seal } from "@/components/ui/Seal";
import { EMAIL, NAV } from "@/lib/content";
import { EASE } from "@/lib/motion";

const WORD = "MULTIPLR×";

const link = "self-start text-[15px] text-ink/75 no-underline transition-colors hover:text-strike focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strike";
const head = "font-mono text-[10.5px] font-medium tracking-[.14em] text-ink/45 uppercase";

/** Site footer: link columns, then the wordmark rising letter by letter as it comes into view. */
export function Footer() {
  return (
    <footer className="relative z-10 -mt-7 overflow-hidden rounded-t-[28px] bg-paper pt-14 text-ink md:-mt-10 md:rounded-t-[40px] md:pt-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Seal aria-hidden="true" />
            <p className="mt-6 max-w-[300px] text-[15px] text-ink/60">
              Practical AI, better websites and workflows for business owners.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-3">
            <div className="flex flex-col gap-2.5">
              <p className={head}>On this page</p>
              {NAV.map(({ id, label }) => (
                <Link key={id} className={link} href={`/#${id}`}>
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <p className={head}>Work</p>
              <Link className={link} href="/case-studies">
                Case studies
              </Link>
              <Link className={link} href="/#talk">
                Let&apos;s talk
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className={head}>Contact</p>
              <a className={link} href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <span className="text-[15px] text-ink/60">Melbourne, Australia</span>
            </div>
          </nav>
        </div>

        <motion.p
          aria-hidden="true"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="mt-16 flex justify-between font-mono text-[clamp(3.2rem,15.4vw,15rem)] leading-[.8] font-semibold tracking-[-.04em] text-deep select-none md:mt-24"
        >
          {[...WORD].map((ch, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[.06em]">
              <motion.span
                className={`inline-block ${ch === "×" ? "text-strike" : ""}`}
                variants={{
                  hidden: { y: "100%", rotate: ch === "×" ? -90 : 0 },
                  show: { y: 0, rotate: 0, transition: { duration: 1.1, ease: EASE, delay: i * 0.06 } },
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </motion.p>

        <div className="flex flex-wrap justify-between gap-4 border-t border-ink/10 py-6 font-mono text-[11px] tracking-[.06em] text-ink/50">
          <span>&copy; {new Date().getFullYear()} Multiplr</span>
          <span>One piece at a time.</span>
        </div>
      </Container>
    </footer>
  );
}
