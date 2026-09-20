import type { Metadata } from "next";
// Self-hosted so the site makes no third-party font request.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/jetbrains-mono/500.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
  },
};

/**
 * Runs before the first paint, so the opening panel is either painted or never
 * painted — there is no frame in between and no hydration mismatch. It is
 * skipped for anyone who has already seen it this session, and for anyone who
 * asked for reduced motion.
 */
const PRELOADER_GATE = `try{
  var seen = sessionStorage.getItem('multiplr:preloaded') === '1';
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (seen || still) document.documentElement.dataset.preloaded = '1';
}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_GATE }} />
        {/* No script, no way to dismiss the panel — so never show it. */}
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-screen flex-col">
        <Preloader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-s-4 focus:top-s-4 focus:z-[100] focus:bg-deep focus:px-s-5 focus:py-s-3 focus:font-sans focus:text-ui focus:text-bone"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
