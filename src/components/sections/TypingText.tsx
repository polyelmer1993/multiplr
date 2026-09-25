"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { PITCHES } from "@/lib/content";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** The pitch line, typed out letter by letter, then erased and replaced with the next one. */
export function TypingText() {
  const { reduced } = useSite();
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const text = reduced ? PITCHES[0] : typed;

  useEffect(() => {
    if (reduced) return;
    let alive = true;
    (async () => {
      await wait(600);
      for (let i = 0; alive; i = (i + 1) % PITCHES.length) {
        const line = PITCHES[i];
        setTyping(true);
        for (let n = 1; n <= line.length && alive; n++) {
          setTyped(line.slice(0, n));
          // Uneven rhythm reads as a person typing; a touch slower after spaces.
          await wait(40 + ((n * 37) % 40) + (line[n - 1] === " " ? 60 : 0));
        }
        setTyping(false);
        await wait(1600);
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
  }, [reduced]);

  return (
    <p className="relative mt-[.12em] block min-h-[2.3em] text-[clamp(26px,7.4vw,34px)] leading-[1.1] font-medium tracking-[-.045em] text-balance text-strike md:min-h-[1.15em] md:text-[clamp(32px,4.6vw,60px)]">
      <span className="sr-only">{PITCHES.join(" ")}</span>
      <span aria-hidden="true">
        {text}
        <span
          className={`ml-[.04em] inline-block h-[.9em] w-[.06em] translate-y-[.1em] bg-strike ${
            typing ? "" : "animate-[caret_1s_steps(1)_infinite]"
          }`}
        />
      </span>
    </p>
  );
}
