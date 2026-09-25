import type { ReactNode } from "react";
import { Perch } from "./Perch";

/**
 * The small mono section label, with a leading dot: "• HOW I WORK".
 * With `perch`, the companion cube lands just above it, lined up with the
 * text's left edge, so it never sits on top of a headline.
 */
export function Label({ children, className = "", perch }: { children: ReactNode; className?: string; perch?: boolean }) {
  return (
    <p className={`relative flex items-center gap-2.5 font-mono text-[11.5px] font-medium tracking-[.14em] uppercase ${className}`}>
      {perch && <Perch className="bottom-[calc(100%+24px)] left-0" />}
      <span aria-hidden="true" className="size-[5px] rounded-full bg-current" />
      {children}
    </p>
  );
}
