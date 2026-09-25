import { SealCube } from "@/components/layout/SealCube";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { HowIWork } from "@/components/sections/HowIWork";
import { Pieces } from "@/components/sections/Pieces";
import { Services } from "@/components/sections/Services";
import { Story } from "@/components/sections/Story";
import { SkipLink } from "@/components/ui/SkipLink";

/**
 * The home page, told as one scroll: the hero pins, then each chapter slides
 * up over the last as a sheet. The seal cube shrinks out of the hero and
 * follows you down the page.
 */
export default function Home() {
  return (
    <>
      <SkipLink href="#pieces" />
      <SealCube />
      <main>
        <Hero />
        <Pieces />
        <HowIWork />
        <Services />
        <CaseStudies />
        <Story />
        <Contact />
      </main>
    </>
  );
}
