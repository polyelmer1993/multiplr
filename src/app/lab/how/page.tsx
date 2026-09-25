import type { Metadata } from "next";
import { LabPage } from "@/components/lab/LabPage";
import { HowIWork } from "@/components/sections/how/HowIWork";
import { HOW_LAYOUT, type HowLayout } from "@/lib/site-config";

export const metadata: Metadata = { title: "How I work layouts" };

const OPTIONS = [
  { key: "scrolly", name: "Scrollytelling", about: "Steps on a timeline on the left; the graphic stays on the right and plays as you read." },
  { key: "horizontal", name: "Sideways scroll", about: "The section pins and scrolling slides the steps across; the centre card grows into focus." },
  { key: "stepper", name: "Scroll stepper", about: "Scrolling opens each step in turn and swaps the graphic. Click a step to jump to it." },
  { key: "path", name: "Winding path", about: "A road snakes between the steps and draws as you scroll, with a marker riding along it." },
];

export default function HowLab() {
  return (
    <LabPage
      title="Choose a How I work layout"
      setting="HOW_LAYOUT"
      current={HOW_LAYOUT}
      options={OPTIONS}
      render={(key) => <HowIWork layout={key as HowLayout} id={`option-${key}`} />}
    />
  );
}
