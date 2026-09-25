import type { Metadata } from "next";
import { LabPage } from "@/components/lab/LabPage";
import { Services } from "@/components/sections/services/Services";
import { SERVICES_LAYOUT, type ServicesLayout } from "@/lib/site-config";

export const metadata: Metadata = { title: "Services layouts" };

const OPTIONS = [
  { key: "carousel", name: "Carousel", about: "Swipe or use the arrows. The next card peeks in so people know there's more." },
  { key: "accordion", name: "Expanding panels", about: "Hover a panel and it widens; the others fold into slim vertical tabs." },
  { key: "stack", name: "Stacking cards", about: "Each card sticks while the next slides over it, with a looping animated graphic." },
  { key: "list", name: "Editorial list", about: "Big numbered rows. A preview follows your cursor, and clicking opens the details." },
  { key: "bento", name: "Bento grid", about: "A featured tile and two smaller ones that tilt towards the cursor with a spotlight." },
];

export default function ServicesLab() {
  return (
    <LabPage
      title="Choose a services layout"
      setting="SERVICES_LAYOUT"
      current={SERVICES_LAYOUT}
      options={OPTIONS}
      render={(key) => <Services layout={key as ServicesLayout} id={`option-${key}`} />}
    />
  );
}
