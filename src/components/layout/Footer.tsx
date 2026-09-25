import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Seal } from "@/components/ui/Seal";
import { EMAIL } from "@/lib/content";
import { WalkAgainButton } from "./WalkAgainButton";

const link = "self-start border-b border-transparent no-underline hover:border-current";

/** Site footer. The page fades to navy as you reach it (see ScrollTheme). */
export function Footer() {
  return (
    <footer
      id="contact"
      className="relative pt-14 pb-[30px] text-fg"
      data-theme-bg="#0d1355"
      data-theme-fg="#e8e6e0"
      data-theme-hd="#e8e6e0"
      data-theme-ac="#ffffff"
    >
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-7 border-t border-hair pt-[34px]">
          <Seal aria-hidden="true" />
          <div className="flex flex-col gap-1.5 text-[15px]">
            <a className={link} href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <Link className={link} href="/#talk">Let&apos;s talk</Link>
          </div>
          <div className="flex flex-col gap-1.5 text-[15px]">
            <Link className={link} href="/#ways">What I do</Link>
            <Link className={link} href="/case-studies">Case studies</Link>
            <Link className={link} href="/#story">Story</Link>
            <WalkAgainButton className={`${link} cursor-pointer text-left`} />
          </div>
        </div>
        <div className="mt-11 flex flex-wrap justify-between gap-4 font-mono text-[11px] tracking-[.06em] text-fg-soft">
          <span>&copy; {new Date().getFullYear()} Multiplr</span>
          <span>Melbourne, Australia</span>
        </div>
      </Container>
    </footer>
  );
}
