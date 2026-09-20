import { cn } from "@/lib/cn";

type Variant = "locked" | "working" | "open";

const VARIANT: Record<Variant, string> = {
  locked: "bg-deep text-bone border-hairline border-deep",
  working: "bg-transparent text-strike border-hairline border-strike",
  open: "bg-transparent text-muted border-hairline border-dashed border-muted",
};

export function Chip({
  variant = "working",
  children,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block px-s-2 py-s-1 font-mono text-mono-label uppercase",
        VARIANT[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
