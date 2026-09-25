"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { useSite } from "@/components/SiteProvider";
import { useOnScroll } from "@/hooks/useOnScroll";

const ROWS = ["MUL", "TIP", "LR"];
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789×+/";

/**
 * The Multiplr seal: MUL / TIP / LR×.
 * - On first load the letters decode from random glyphs into place.
 * - Hovering (or focusing the parent link) decodes them again.
 * - The × turns as you scroll, like a dial.
 */
export function Seal({ className = "", ...props }: ComponentProps<"div">) {
  const { reduced } = useSite();
  const [rows, setRows] = useState(ROWS);
  const xRef = useRef<HTMLElement>(null);
  const raf = useRef(0);

  const decode = () => {
    if (reduced) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 650;
      // Each letter settles at its own moment, left to right, top to bottom.
      setRows(
        ROWS.map((row, r) =>
          [...row]
            .map((ch, c) => (t > 0.25 + (r * 3 + c) * 0.08 ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join(""),
        ),
      );
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setRows(ROWS);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const t = setTimeout(decode, 250);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useOnScroll(() => {
    if (xRef.current) xRef.current.style.transform = `rotate(${(window.scrollY * 0.18) % 360}deg)`;
  }, !reduced);

  return (
    <div
      onPointerEnter={decode}
      className={`grid size-[52px] flex-none grid-rows-3 border-[1.5px] border-current px-[7px] py-[5px] font-mono text-[9px] leading-[1.4] font-semibold tracking-[.28em] ${className}`}
      {...props}
    >
      <span aria-hidden="true">{rows[0]}</span>
      <span aria-hidden="true">{rows[1]}</span>
      <span aria-hidden="true">
        {rows[2]}
        <i ref={xRef} className="inline-block text-strike not-italic">
          &times;
        </i>
      </span>
      <span className="sr-only">Multiplr</span>
    </div>
  );
}
