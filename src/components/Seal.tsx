import { cn } from "@/lib/cn";

type SealVariant = "default" | "inverted" | "plate";

const GROUND: Record<SealVariant, string> = {
  // On bone or paper: Deep Indigo border and letters, Indigo Strike multiply mark.
  default: "border-deep text-deep",
  // Inverted on a full-bleed Strike band: bone throughout.
  inverted: "border-bone text-bone",
  // Paper plate, for when a bleed needs a stamp.
  plate: "bg-paper border-deep text-deep",
};

const MARK: Record<SealVariant, string> = {
  default: "text-strike",
  inverted: "text-bone",
  plate: "text-strike",
};

export function Seal({
  variant = "default",
  className,
}: {
  variant?: SealVariant;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="Multiplr"
      className={cn(
        "inline-grid select-none border-hairline px-s-3 py-s-2 font-mono text-mono-label leading-[1.3] tracking-[0.02em]",
        GROUND[variant],
        className,
      )}
    >
      <span aria-hidden="true">MUL</span>
      <span aria-hidden="true">TIP</span>
      <span aria-hidden="true">
        LR<span className={MARK[variant]}>&#215;</span>
      </span>
    </span>
  );
}
