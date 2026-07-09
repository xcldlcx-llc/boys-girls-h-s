import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { AlertBar, Header, Ticker } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import SideRail from "@/components/SideRail";
import DocViewer from "@/components/DocViewer";
import { RevealObserver } from "@/components/Interactive";
import { AgentationProvider } from "@/components/AgentationProvider";
import { school } from "@/lib/data";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: school.name, template: `%s | ${school.name}` },
  description: school.vision,
  icons: { icon: school.logo },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lato.variable}>
      <body>
        <a className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-[400] focus:bg-ink focus:text-white focus:py-3 focus:px-5 focus:font-bold" href="#main">
          Skip to main content
        </a>
        <AlertBar />
        <Header />
        <Ticker />
        {children}
        <Footer />
        <SideRail />
        <DocViewer />
        <RevealObserver />
        <AgentationProvider />
      </body>
    </html>
  );
}
