import { ButtonLink } from "@/components/Button";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";
import { Highlight } from "@/components/hero/Highlight";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden py-s-9">
      <HeroBackdrop compact />

      <div className="stage relative">
        <p className="eyebrow">404</p>
        <h1 className="mt-s-4 max-w-[16ch] font-display text-display text-strike">
          This sheet does not <Highlight delay={0.4}>exist</Highlight>.
        </h1>
        <p className="mt-s-6 max-w-measure text-body text-muted">
          The page you asked for is not here. The index is.
        </p>
        <div className="mt-s-8 flex flex-col gap-s-4 sm:flex-row">
          <ButtonLink href="/" variant="primary" markAccent>
            Back to home
          </ButtonLink>
          <ButtonLink href="/work" variant="secondary">
            See the work
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
