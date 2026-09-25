/**
 * An invisible landing spot. The companion cube hops between perches
 * as you scroll, so place one near each section heading.
 */
export function Perch({ className = "" }: { className?: string }) {
  return (
    <span
      data-perch
      aria-hidden="true"
      className={`pointer-events-none invisible absolute size-[42px] md:size-[60px] ${className}`}
    />
  );
}
