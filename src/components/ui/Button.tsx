"use client";

import { motion, useSpring, type Variants } from "framer-motion";
import Link from "next/link";
import type { ComponentProps, PointerEvent } from "react";
import { useSite } from "@/components/SiteProvider";
import { EASE } from "@/lib/motion";
import { ArrowIcon } from "./ArrowIcon";

type ButtonProps = Omit<ComponentProps<"a">, "ref" | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> & {
  href: string;
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  /** Show the diagonal arrow after the label. */
  arrow?: boolean;
};

const base =
  "inline-flex origin-bottom items-center gap-3 border-[1.5px] font-semibold leading-none no-underline " +
  "transition-colors duration-[350ms] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-hd";

const variants = {
  primary: "border-ac bg-ac text-bgc",
  ghost: "border-fg bg-transparent text-fg hover:bg-fg hover:text-bgc",
};

const sizes = {
  md: "min-h-12 px-[26px] py-[15px] text-[15px]",
  sm: "min-h-10 px-[18px] py-[11px] text-[13.5px]",
};

// On hover the button does the seal cube's little hop: squash, spring up, land.
const body: Variants = {
  rest: { y: 0, scaleX: 1, scaleY: 1 },
  hover: {
    y: [0, 0, -5, 0, 0],
    scaleX: [1, 1.06, 0.96, 1.03, 1],
    scaleY: [1, 0.9, 1.06, 0.97, 1],
    transition: { duration: 0.6, times: [0, 0.18, 0.45, 0.75, 1], ease: "easeOut" },
  },
  tap: { scaleX: 1.04, scaleY: 0.94, y: 1 },
};

// ...and the arrow flips like a face of the cube turning over.
const arrowFlip: Variants = {
  rest: { rotateY: 0, transition: { duration: 0 } },
  hover: { rotateY: 360, transition: { duration: 0.7, ease: EASE, delay: 0.08 } },
};

const MotionLink = motion.create(Link);

/** The site's call-to-action link. Uses Next <Link> for pages, a plain <a> for mail and section links. */
export function Button({ href, variant = "primary", size = "md", arrow, className = "", children, ...props }: ButtonProps) {
  // Magnetic pull: the button leans a few pixels towards the cursor.
  const { reduced } = useSite();
  const mx = useSpring(0, { stiffness: 250, damping: 18 });
  const my = useSpring(0, { stiffness: 250, damping: 18 });
  const pull = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const release = () => {
    mx.set(0);
    my.set(0);
  };

  const shared = {
    className: `${base} ${variants[variant]} ${sizes[size]} ${className}`,
    initial: "rest",
    animate: "rest",
    whileHover: "hover",
    whileFocus: "hover",
    whileTap: "tap",
    variants: body,
    ...props,
  } as const;

  const content = (
    <>
      {children}
      {arrow && (
        <motion.span variants={arrowFlip} className="flex-none" style={{ transformPerspective: 200 }}>
          <ArrowIcon />
        </motion.span>
      )}
    </>
  );

  const isPage = href.startsWith("/") && !href.startsWith("/#");
  return (
    <motion.span className="inline-flex" style={{ x: mx, y: my }} onPointerMove={pull} onPointerLeave={release}>
      {isPage ? (
        <MotionLink href={href} {...shared}>{content}</MotionLink>
      ) : (
        <motion.a href={href} {...shared}>{content}</motion.a>
      )}
    </motion.span>
  );
}
