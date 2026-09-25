/** Shared easing and maths helpers for the scroll-driven animations. */

/** The site's signature curve, used for CSS transitions and Framer Motion. */
export const EASE = [0.2, 0.7, 0.1, 1] as const;

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/** Maps p from the range [a, b] onto [0, 1], clamped. */
export const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);

/** Cubic ease-in-out. */
export const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Cubic ease-out. */
export const eout = (t: number) => 1 - Math.pow(1 - t, 3);

/** Cubic ease-in. */
export const ein = (t: number) => t * t * t;
