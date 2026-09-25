import { LitText } from "@/components/ui/LitText";
import { Perch } from "@/components/ui/Perch";
import { Section } from "@/components/ui/Section";

export function Statement() {
  return (
    <Section id="statement" aria-label="What I do" className="py-[clamp(90px,14vh,160px)]">
      <div className="relative grid grid-cols-1 gap-6 pt-16 md:grid-cols-[minmax(0,1fr)_110px] md:pt-0">
        <Perch className="top-0 right-0" />
        <LitText big>
          Most businesses already have the pieces: a website, a handful of processes and software, and a team that
          knows the work. I find the piece that&apos;s costing you the most or the growth opportunity you&apos;re
          missing, implement the change and move on to the next one, so the whole system gets better as we go and
          works as a force multiplier that shows up as real ROI.
        </LitText>
      </div>
    </Section>
  );
}
