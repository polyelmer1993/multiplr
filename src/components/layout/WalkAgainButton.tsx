"use client";

import { usePathname, useRouter } from "next/navigation";

/** Jumps back to the very top of the home page to walk through the entrance door again. */
export function WalkAgainButton({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={() => (pathname === "/" ? window.scrollTo({ top: 0, behavior: "instant" }) : router.push("/"))}
    >
      Walk through the door again
    </button>
  );
}
