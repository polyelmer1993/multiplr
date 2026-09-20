"use client";

import { Parallax } from "@/components/motion/Parallax";
import { PlatePattern } from "./PlatePattern";
import { cn } from "@/lib/cn";

/**
 * The image slot, everywhere one appears. Until a real asset lands it holds
 * `<PlatePattern />`; to ship the real thing, swap that one component for
 * `next/image` and write real alt text — nothing around it changes.
 *
 * On hover of the surrounding `group`, Strike wipes up from the base and the
 * caption inverts to bone. `overlayLabel` adds the read-more cue for plates
 * that sit inside a link; plates that are not links leave it out, so nothing
 * claims an affordance it does not have.
 */
export function MediaPlate({
  alt,
  caption,
  overlayLabel,
  aspect = "aspect-[16/7]",
  parallax = 40,
  className,
}: {
  alt: string;
  caption: string;
  overlayLabel?: string;
  aspect?: string;
  /** Y travel for the pattern inside the frame. 0 pins it. */
  parallax?: number;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative overflow-hidden border-hairline border-muted/60", aspect, className)}
    >
      {parallax ? (
        <Parallax distance={parallax} className="absolute -inset-y-[18%] inset-x-0">
          <div className="relative h-full w-full">
            <PlatePattern />
          </div>
        </Parallax>
      ) : (
        <PlatePattern />
      )}

      {/* Strike wipes up from the base. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-strike/[0.92] transition-transform duration-[420ms] ease-calm group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />

      <span className="absolute bottom-0 left-0 p-s-4 font-mono text-mono-micro uppercase text-muted transition-colors duration-300 ease-calm group-hover:text-bone group-focus-visible:text-bone">
        {caption}
      </span>

      {overlayLabel ? (
        <span
          aria-hidden="true"
          className="absolute right-s-4 top-s-4 font-mono text-mono-label uppercase text-bone opacity-0 transition-opacity duration-300 ease-calm group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          {overlayLabel}
        </span>
      ) : null}
    </div>
  );
}
