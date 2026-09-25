import { useId } from "react";
import { Container } from "@/components/ui/Container";
import { Perch } from "@/components/ui/Perch";
import { SERVICES_LAYOUT, type ServicesLayout } from "@/lib/site-config";
import { ServicesAccordion } from "./ServicesAccordion";
import { ServicesBento } from "./ServicesBento";
import { ServicesCarousel } from "./ServicesCarousel";
import { ServicesList } from "./ServicesList";
import { ServicesStack } from "./ServicesStack";

const LAYOUTS = {
  carousel: ServicesCarousel,
  accordion: ServicesAccordion,
  stack: ServicesStack,
  list: ServicesList,
  bento: ServicesBento,
} satisfies Record<ServicesLayout, React.ComponentType<{ titleId: string }>>;

/** The services section, in whichever layout is chosen in site-config.ts. */
export function Services({ layout = SERVICES_LAYOUT, id = "ways" }: { layout?: ServicesLayout; id?: string }) {
  const titleId = useId();
  const Layout = LAYOUTS[layout];
  return (
    <section id={id} aria-labelledby={titleId} className="relative py-[clamp(90px,14vh,160px)]">
      <Container>
        <Perch className="top-0 right-[22px] -mt-12 ml:right-14" />
        <Layout titleId={titleId} />
      </Container>
    </section>
  );
}
