"use client";

import { useRef, useState } from "react";

/** Copies `text` to the clipboard and briefly confirms it. */
export function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState("Copy");
  const timer = useRef<number>(undefined);

  const done = (ok: boolean) => {
    setLabel(ok ? "Copied" : "Press and hold to copy");
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLabel("Copy"), 2200);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      done(true);
    } catch {
      done(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="ml-2 cursor-pointer border border-hair bg-transparent px-2.5 py-[5px] text-[13px] font-medium text-fg hover:border-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strike"
    >
      {label}
    </button>
  );
}
