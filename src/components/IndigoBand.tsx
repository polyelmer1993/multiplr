import { cn } from "@/lib/cn";
import { FadeUp } from "./FadeUp";
import { Parallax } from "./motion/Parallax";
import { ContactBackdrop } from "./contact/ContactBackdrop";

/**
 * The single full-bleed Indigo Strike band. One per page, maximum —
 * this is where a headline lives. Body copy stays on bone.
 *
 * The band carries its own parallax ground; the content rides a shallower
 * rate than the graphic behind it, which is what reads as depth.
 */
export function IndigoBand({
  eyebrow,
  children,
  footer,
  className,
  backdrop = true,
}: {
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  backdrop?: boolean;
}) {
  return (
    <div
      className={cn(
        "on-strike relative isolate overflow-hidden bg-strike py-s-9 md:py-[128px]",
        className,
      )}
    >
      {backdrop ? <ContactBackdrop /> : null}

      <div className="stage relative">
        <Parallax distance={32} innerClassName="max-w-[46rem]">
          <FadeUp>
            {eyebrow ? (
              <p className="font-mono text-mono-label uppercase text-bone/70">{eyebrow}</p>
            ) : null}
            <div className="mt-s-5 text-bone">{children}</div>
            {footer ? <div className="mt-s-7">{footer}</div> : null}
          </FadeUp>
        </Parallax>
      </div>
    </div>
  );
}
