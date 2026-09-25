import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ScrollTheme } from "@/components/layout/ScrollTheme";
import { SectionLinks } from "@/components/layout/SectionLinks";
import { SiteProvider } from "@/components/SiteProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: { default: "Multiplr", template: "%s · Multiplr" },
  description:
    "Multiplr helps business owners put technology to work, through practical AI, better websites and workflows.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#e8e6e0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans">
        <SiteProvider>
          <SectionLinks />
          <ScrollTheme />
          <ScrollProgress />
          <Header />
          {children}
          <Footer />
        </SiteProvider>
      </body>
    </html>
  );
}
