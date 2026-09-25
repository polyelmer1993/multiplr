"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { LitText } from "@/components/ui/LitText";
import { Perch } from "@/components/ui/Perch";
import { AdoptionCurve } from "./AdoptionCurve";

export function Story() {
  return (
    <section id="story" aria-labelledby="story-title" className="relative py-[clamp(100px,15vh,170px)]">
      <Container>
        <Perch className="top-0 right-[22px] ml:top-[clamp(40px,8vh,90px)] ml:right-14" />
        <div className="grid grid-cols-1 gap-6 pt-[62px] md:grid-cols-[minmax(0,1fr)_110px] ml:pt-0">
          <div className="space-y-[clamp(28px,5vh,52px)]">
            <LitText as="h2" id="story-title">
              I spent the last seven years at Uber in San Francisco, leading strategy globally across payments and
              financial services, and most recently as GM of the US and Canada financial services business. I worked
              with tech teams every day to build tasteful products for hundreds of millions of customers.
            </LitText>
            <LitText>
              Now I&apos;m{" "}
              <Image
                src="/portrait.webp"
                alt=""
                width={40}
                height={40}
                className="mx-[.06em] inline-block size-[.95em] rounded-full object-cover object-[50%_22%] align-[-.12em] opacity-25 grayscale transition-opacity duration-[450ms] group-data-on/lit:opacity-100"
              />{" "}
              back in Melbourne, putting AI to work to help business owners take the leap and realise tangible,
              data-driven benefits.
            </LitText>
            <LitText>Multiplr is where I do this, one useful change at a time.</LitText>
          </div>
        </div>

        <AdoptionCurve />
      </Container>
    </section>
  );
}
