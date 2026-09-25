"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/components/SiteProvider";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Types each line out letter by letter, holds it, erases it and moves on to
 * the next, forever. Screen readers get all the lines at once.
 */
export function TypingText({
  lines,
  startDelay = 600,
  className = "",
}: {
  lines: string[];
  /** Pause before the first line starts, in ms. */
  startDelay?: number;
  className?: string;
}) {
  const { reduced } = useSite();
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const text = reduced ? lines[0] : typed;

  useEffect(() => {
    if (reduced) return;
    let alive = true;
    (async () => {
      await wait(startDelay);
      for (let i = 0; alive; i = (i + 1) % lines.length) {
        const line = lines[i];
        setTyping(true);
        for (let n = 1; n <= line.length && alive; n++) {
          setTyped(line.slice(0, n));
          // Uneven rhythm reads as a person typing; a touch slower after spaces.
          await wait(40 + ((n * 37) % 40) + (line[n - 1] === " " ? 60 : 0));
        }
        setTyping(false);
        await wait(1800);
        for (let n = line.length; n >= 0 && alive; n--) {
          setTyped(line.slice(0, n));
          await wait(16);
        }
        await wait(300);
      }
    })();
    return () => {
      alive = false;
    };
  }, [reduced, lines, startDelay]);

  return (
    <span className={`relative block ${className}`}>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true">
        {text}
        <span
          className={`ml-[.04em] inline-block h-[.82em] w-[.055em] translate-y-[.08em] bg-current ${
            typing ? "" : "animate-[caret_1s_steps(1)_infinite]"
          }`}
        />
      </span>
    </span>
  );
}
