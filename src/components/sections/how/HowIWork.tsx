import { useId } from "react";
import { HOW_LAYOUT, type HowLayout } from "@/lib/site-config";
import { HowHorizontal } from "./HowHorizontal";
import { HowPath } from "./HowPath";
import { HowScrolly } from "./HowScrolly";
import { HowStepper } from "./HowStepper";

const LAYOUTS = {
  scrolly: HowScrolly,
  horizontal: HowHorizontal,
  stepper: HowStepper,
  path: HowPath,
} satisfies Record<HowLayout, React.ComponentType<{ titleId: string }>>;

/** The "How I work" section, in whichever layout is chosen in site-config.ts. */
export function HowIWork({ layout = HOW_LAYOUT, id = "how" }: { layout?: HowLayout; id?: string }) {
  const titleId = useId();
  const Layout = LAYOUTS[layout];
  return (
    <section id={id} aria-labelledby={titleId} className="relative">
      <Layout titleId={titleId} />
    </section>
  );
}
