import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "inverse";

type Common = {
  variant?: Variant;
  /** Primary only — the optional leading multiply square. */
  markAccent?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Hover is a wipe, not a fade. A fill sweeps in from the left edge over 260ms
 * on the calm curve while a second copy of the label is revealed by a clip in
 * exact step with it, so the label never sits on a half-painted ground. The
 * multiply mark turns a quarter turn and inverts as the fill passes it.
 *
 * The documented hairline shift is untouched: padding still steps down 1px so
 * the 1px -> 2px border moves nothing around it. All of this is CSS, so the
 * component stays server-rendered and the global reduced-motion rule freezes
 * it at the final state.
 */
const BASE =
  "group relative isolate inline-flex items-center justify-center gap-s-2 overflow-hidden font-sans text-ui transition-colors duration-200 ease-calm disabled:opacity-disabled disabled:pointer-events-none";

const VARIANT: Record<Variant, string> = {
  // A fill has no border to thicken, so the fill itself steps Deep -> Strike.
  primary: "bg-deep text-bone px-s-5 py-s-3",
  secondary:
    "bg-transparent text-ink border-hairline border-strike px-[24px] py-[12px] hover:border-active hover:border-deep hover:px-[23px] hover:py-[11px]",
  // For use inside the full-bleed Indigo Strike band, where muted and ink
  // both fall below 2:1. Bone is the only legible label colour there.
  inverse:
    "bg-transparent text-bone border-hairline border-bone px-[24px] py-[12px] hover:border-active hover:px-[23px] hover:py-[11px]",
};

/** The fill that wipes across — always the other half of an existing pair. */
const FILL: Record<Variant, string> = {
  primary: "bg-strike",
  secondary: "bg-strike",
  inverse: "bg-bone",
};

/** The label colour that is legible once the fill has arrived. */
const ON_FILL: Record<Variant, string> = {
  primary: "text-bone",
  secondary: "text-bone",
  inverse: "text-deep",
};

/** The multiply square, inverted so it still reads against the fill. */
const MARK_ON_FILL: Record<Variant, string> = {
  primary: "bg-bone text-strike",
  secondary: "bg-bone text-strike",
  inverse: "bg-deep text-bone",
};

function Inner({
  markAccent,
  variant,
  onFill,
  children,
}: {
  markAccent?: boolean;
  variant: Variant;
  onFill?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      {markAccent ? (
        <span
          aria-hidden="true"
          className={cn(
            "grid h-s-4 w-s-4 place-items-center font-mono text-mono-micro transition-transform duration-300 ease-calm group-hover:rotate-90 group-focus-visible:rotate-90",
            onFill ? MARK_ON_FILL[variant] : "bg-strike text-bone",
          )}
        >
          &#215;
        </span>
      ) : null}
      <span>{children}</span>
    </>
  );
}

function Shell({
  variant,
  markAccent,
  children,
}: {
  variant: Variant;
  markAccent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* The fill. Negative z keeps it above the button ground, below the label. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-[260ms] ease-calm",
          "group-hover:scale-x-100 group-focus-visible:scale-x-100",
          FILL[variant],
        )}
      />

      <Inner variant={variant} markAccent={markAccent}>
        {children}
      </Inner>

      {/* The same label, clipped open in step with the fill. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-s-2 transition-[clip-path] duration-[260ms] ease-calm",
          "[clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)]",
          ON_FILL[variant],
        )}
      >
        <Inner variant={variant} markAccent={markAccent} onFill>
          {children}
        </Inner>
      </span>
    </>
  );
}

export function Button({
  variant = "primary",
  markAccent,
  className,
  children,
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(BASE, VARIANT[variant], className)} {...rest}>
      <Shell variant={variant} markAccent={markAccent && variant === "primary"}>
        {children}
      </Shell>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  markAccent,
  className,
  children,
  href,
}: Common & { href: string }) {
  return (
    <Link href={href} className={cn(BASE, VARIANT[variant], className)}>
      <Shell variant={variant} markAccent={markAccent && variant === "primary"}>
        {children}
      </Shell>
    </Link>
  );
}
