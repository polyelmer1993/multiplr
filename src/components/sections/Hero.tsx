import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Perch } from "@/components/ui/Perch";
import { FadeIn, Reveal, RevealLine } from "@/components/ui/Reveal";

/** 64 bars of a gently rippling "signal". Heights are fixed so server and client agree. */
const BARS = Array.from({ length: 64 }, (_, i) => ({
  lo: (0.22 + 0.62 * Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.113))).toFixed(2),
  delay: `${(-(i * 0.085)).toFixed(3)}s`,
  color: ["bg-deep", "bg-strike", "bg-[#bdbab1]"][i % 3],
}));

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-svh items-center pt-[120px] pb-[90px]">
      <Container>
        <Reveal>
          <Perch className="top-0 right-[22px] ml:top-2 ml:right-14" />
          <div
            aria-hidden="true"
            className="mb-[clamp(32px,5vh,52px)] flex h-[76px] max-w-[calc(100%-64px)] items-end gap-[5px] md:max-w-[430px]"
          >
            {BARS.map((b, i) => (
              <i
                key={i}
                className={`h-full max-w-[5px] min-w-[2px] flex-1 origin-bottom animate-ripple motion-reduce:scale-y-(--lo) motion-reduce:animate-none ${b.color}`}
                style={{ "--lo": b.lo, animationDelay: b.delay } as React.CSSProperties}
              />
            ))}
          </div>

          <h1
            id="hero-title"
            className="text-[clamp(2.2rem,5.6vw,6.2rem)] leading-[1.02] font-medium tracking-[-.05em] text-hd"
          >
            <RevealLine index={0}>Improving the systems</RevealLine>
            <RevealLine index={1}>your business runs on,</RevealLine>
            <RevealLine index={2} className="whitespace-nowrap">one piece at a time.</RevealLine>
          </h1>

          <FadeIn delay={0.35}>
            <p className="mt-[clamp(24px,3.5vw,40px)] text-[clamp(1.08rem,1.45vw,1.35rem)] leading-[1.45] text-fg-soft">
              Practical AI, websites that turn visitors into enquiries, and workflows that give your team time back.
            </p>
          </FadeIn>

          <FadeIn delay={0.5} className="mt-[clamp(28px,4vw,40px)] flex flex-wrap gap-3">
            <Button href="#talk" arrow>Let&apos;s talk</Button>
            <Button href="#ways" variant="ghost">What I do</Button>
          </FadeIn>
        </Reveal>
      </Container>
    </section>
  );
}
