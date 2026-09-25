import { Companion } from "@/components/layout/Companion";
import { SideNav } from "@/components/layout/SideNav";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Contact } from "@/components/sections/Contact";
import { Entrance } from "@/components/sections/Entrance";
import { Hero } from "@/components/sections/Hero";
import { HowIWork } from "@/components/sections/how/HowIWork";
import { Services } from "@/components/sections/services/Services";
import { Statement } from "@/components/sections/Statement";
import { Story } from "@/components/sections/Story";
import { SkipLink } from "@/components/ui/SkipLink";

export default function Home() {
  return (
    <>
      <SkipLink href="#home" />
      <SideNav />
      <Companion />
      <main>
        <Entrance />
        <Hero />
        <Statement />
        <HowIWork />
        <Services />
        <CaseStudies />
        <Story />
        <Contact />
      </main>
    </>
  );
}
