"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Seal } from "@/components/ui/Seal";
import { useOnScroll } from "@/hooks/useOnScroll";
import { NAV } from "@/lib/content";
import { EASE } from "@/lib/motion";

const linkCls =
  "relative z-10 block rounded-[4px] px-3.5 py-2 font-mono text-[11.5px] font-medium tracking-[.1em] uppercase no-underline transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strike";

/**
 * Fixed top bar: the seal on the left, a pill of section links in the middle
 * (a highlight slides to whichever section you're in, and a hairline under it
 * fills as you read), and the call to action on the right.
 */
export function Header() {
  const home = usePathname() === "/";
  const [current, setCurrent] = useState(-1);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useOnScroll(({ vh }) => {
    setScrolled(window.scrollY > 24);
    let cur = -1;
    NAV.forEach(({ id }, i) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= vh * 0.4) cur = i;
    });
    setCurrent(home ? cur : -1);
  });

  // Close the phone menu with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 pt-3.5 transition-[padding] duration-500 ease-site md:px-10 ${
          scrolled ? "md:pt-3" : "md:pt-5"
        }`}
      >
        <Link
          href="/"
          aria-label="Multiplr home"
          className="rounded-[2px] bg-bone/80 text-ink no-underline backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-strike"
        >
          {/* The companion cube flies into this logo near the end of the page. */}
          <Seal data-home-seal />
        </Link>

        {/* Section pill (wide screens) */}
        <nav aria-label="Sections" data-nav-pill className="relative hidden lg:block">
          <ul className="flex items-center rounded-[8px] border border-ink/8 bg-paper/75 p-1 shadow-[0_12px_40px_-24px_rgba(13,19,85,.45)] backdrop-blur-xl">
            {NAV.map(({ id, label }, i) => {
              const on = i === current;
              return (
                <li key={id} className="relative">
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-[5px] bg-deep"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <a href={`/#${id}`} aria-current={on ? "location" : undefined} className={`${linkCls} ${on ? "text-bone" : "text-ink/70 hover:text-ink"}`}>
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
          <span aria-hidden="true" className="absolute inset-x-3 -bottom-[7px] h-px overflow-hidden rounded-full bg-ink/8">
            <motion.span className="block h-full origin-left bg-strike" style={{ scaleX: progress }} />
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/#talk" size="sm" arrow data-header-cta className="max-sm:hidden">
            Let&apos;s talk
          </Button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 cursor-pointer place-items-center rounded-[5px] bg-paper/80 backdrop-blur-md focus-visible:outline-2 focus-visible:outline-strike lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="relative block h-2.5 w-4">
              <span className={`absolute left-0 h-[1.5px] w-full bg-ink transition-transform duration-300 ${open ? "top-1 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-[1.5px] w-full bg-ink transition-transform duration-300 ${open ? "top-1 -rotate-45" : "top-2"}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Phone menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="site-menu"
            aria-label="Sections"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mx-5 mt-3 rounded-[12px] border border-ink/8 bg-paper/95 p-2 shadow-[0_30px_60px_-30px_rgba(13,19,85,.5)] backdrop-blur-xl md:mx-10 lg:hidden"
          >
            <ul onClick={() => setOpen(false)}>
              {NAV.map(({ id, label }, i) => (
                <li key={id}>
                  <a href={`/#${id}`} className={`${linkCls} py-3.5 text-[13px] ${i === current ? "text-strike" : "text-ink"}`}>
                    <span className="mr-3 text-ink/40">0{i + 1}</span>
                    {label}
                  </a>
                </li>
              ))}
              <li className="p-2 pt-3">
                <Button href="/#talk" arrow className="w-full justify-between">
                  Let&apos;s talk
                </Button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
