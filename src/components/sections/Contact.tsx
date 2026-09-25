import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Perch } from "@/components/ui/Perch";
import { FadeIn, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EMAIL } from "@/lib/content";
import { CopyButton } from "./CopyButton";

export function Contact() {
  return (
    <section id="talk" aria-labelledby="talk-title" className="relative pt-[clamp(110px,18vh,200px)] pb-[clamp(90px,14vh,150px)]">
      <Container>
        <Reveal>
          <Perch className="top-[clamp(30px,6vh,70px)] right-[22px] ml:right-14" />
          <div className="grid grid-cols-1 items-end gap-[clamp(24px,5vw,80px)] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div>
              <SectionHeading id="talk-title">Want to work together?</SectionHeading>
              <FadeIn delay={0.35}>
                <p className="mt-[18px] text-[clamp(1.02rem,1.3vw,1.2rem)] text-fg-soft">
                  Bring me your problems or ideas, and I&apos;ll find you a solution worth implementing.
                </p>
              </FadeIn>
            </div>

            <FadeIn delay={0.5} className="flex flex-wrap justify-start gap-3 md:justify-end">
              <Button href={`mailto:${EMAIL}?subject=Let%27s%20talk`} arrow>Start a conversation</Button>
              <Button href="/#ways" variant="ghost">What I do</Button>
              <p className="mt-1.5 basis-full text-left text-[14.5px] text-fg-soft md:text-right">
                or email{" "}
                <a href={`mailto:${EMAIL}`} className="border-b border-hair text-fg no-underline hover:border-fg">
                  {EMAIL}
                </a>
                <CopyButton text={EMAIL} />
              </p>
            </FadeIn>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
