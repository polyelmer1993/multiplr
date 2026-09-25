import type { ComponentProps } from "react";

const TONES = {
  bone: "bg-bone text-ink",
  paper: "bg-paper text-ink",
  field: "bg-field text-ink",
  deep: "bg-deep text-bone",
};

type SheetProps = ComponentProps<"section"> & { tone?: keyof typeof TONES };

/**
 * A page section drawn as a sheet with rounded top corners. Each sheet
 * overlaps the one before it slightly, so scrolling reads as cards sliding
 * up over each other.
 */
export function Sheet({ tone = "bone", className = "", ...props }: SheetProps) {
  return (
    <section
      className={`relative -mt-7 rounded-t-[28px] shadow-[0_-24px_60px_-40px_rgba(13,19,85,.35)] md:-mt-10 md:rounded-t-[40px] ${TONES[tone]} ${className}`}
      {...props}
    />
  );
}
