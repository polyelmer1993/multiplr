"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useSite } from "@/components/SiteProvider";

/** A hairline across the top of the screen showing how far down the page you are. */
export function ScrollProgress() {
  const { inside } = useSite();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className={`fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-strike transition-opacity duration-500 ${inside ? "opacity-100" : "opacity-0"}`}
      style={{ scaleX }}
    />
  );
}
