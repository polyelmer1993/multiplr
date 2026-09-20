"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * The house motion: a section fades up once as it enters. Nothing loops,
 * nothing bounces. Reduced motion renders the final state immediately.
 */
export function FadeUp({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Tag
      className={cn(className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
