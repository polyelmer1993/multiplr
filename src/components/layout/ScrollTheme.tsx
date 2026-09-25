"use client";

import { useOnScroll } from "@/hooks/useOnScroll";
import { clamp, eio } from "@/lib/motion";

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const mix = (a: RGB, b: RGB, t: number): RGB => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t) as RGB;
const rgb = (c: RGB, a = 1) => `rgba(${c.map(Math.round).join(",")},${a})`;

/** The page's starting colours. */
const BASE = { bg: hex("#e8e6e0"), fg: hex("#0a0a0a"), hd: hex("#1925aa"), ac: hex("#0d1355") };

/**
 * Smoothly blends the page colours as elements marked with
 * data-theme-bg/fg/hd/ac scroll into view. Renders nothing.
 */
export function ScrollTheme() {
  useOnScroll(({ vh }) => {
    const line = vh * 0.55;
    const band = vh * 0.34;
    let { bg, fg, hd, ac } = BASE;
    document.querySelectorAll<HTMLElement>("[data-theme-bg]").forEach((el) => {
      const d = el.dataset;
      const t = eio(clamp((line + band / 2 - el.getBoundingClientRect().top) / band, 0, 1));
      // Text colours switch a beat after the background, so text stays readable.
      const tf = eio(clamp((t - 0.34) / 0.32, 0, 1));
      bg = mix(bg, hex(d.themeBg!), t);
      fg = mix(fg, hex(d.themeFg!), tf);
      hd = mix(hd, hex(d.themeHd!), tf);
      ac = mix(ac, hex(d.themeAc!), tf);
    });
    const s = document.documentElement.style;
    s.setProperty("--bgc", rgb(bg));
    s.setProperty("--fg", rgb(fg));
    s.setProperty("--hd", rgb(hd));
    s.setProperty("--ac", rgb(ac));
    s.setProperty("--fg-soft", rgb(fg, 0.66));
    s.setProperty("--fg-dim", rgb(fg, 0.17));
    s.setProperty("--hair", rgb(fg, 0.16));
  });
  return null;
}
