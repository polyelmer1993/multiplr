/**
 * Site-wide design choices. Compare the options at /lab, then set the ones
 * you want the home page to use.
 */
export const SERVICES_LAYOUT: ServicesLayout = "stack";

export type ServicesLayout = "carousel" | "accordion" | "stack" | "list" | "bento";

export const HOW_LAYOUT: HowLayout = "stepper";

export type HowLayout = "scrolly" | "horizontal" | "stepper" | "path";
