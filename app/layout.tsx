import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AlertBar, Header, Ticker } from "@/components/Chrome";
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

function Footer() {
  return (
    <footer className="bg-ink text-paper-gray mt-12">
      <div className="max-w-site mx-auto px-5 grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={school.logo} alt={school.logoAlt} width={750} height={142} className="w-40 h-auto mb-3" />
          <p className="m-0">
            <strong>{school.name}</strong><br />{school.address}<br />
            Phone: <a className="text-white" href="tel:+17184671700">{school.phone}</a><br />Fax: {school.fax}
          </p>
          <div className="flex gap-3 mt-3">
            <a href={school.social.facebook} aria-label="BGHS on Facebook" className="w-[38px] h-[38px] rounded-full bg-white/10 grid place-items-center font-black text-[.8rem] text-white no-underline hover:bg-red">FB</a>
            <a href={school.social.twitter} aria-label="BGHS on X (Twitter)" className="w-[38px] h-[38px] rounded-full bg-white/10 grid place-items-center font-black text-[.8rem] text-white no-underline hover:bg-red">X</a>
            <a href={school.social.instagram} aria-label="BGHS on Instagram" className="w-[38px] h-[38px] rounded-full bg-white/10 grid place-items-center font-black text-[.8rem] text-white no-underline hover:bg-red">IG</a>
            <a href={school.social.youtube} aria-label="BGHS on YouTube" className="w-[38px] h-[38px] rounded-full bg-white/10 grid place-items-center font-black text-[.8rem] text-white no-underline hover:bg-red">YT</a>
          </div>
        </div>
        <div>
          <h2 className="text-[.9rem] uppercase tracking-[.12em] text-gold font-black">For Families</h2>
          <ul className="list-none m-0 p-0 grid gap-1.5">
            <li><Link className="text-white no-underline hover:underline" href="/families">Family Hub</Link></li>
            <li><Link className="text-white no-underline hover:underline" href="/families/ptca">PTCA</Link></li>
            <li><a className="text-white no-underline hover:underline" href="https://www.schools.nyc.gov/school-life/food/menus" rel="noopener noreferrer">School Food Menu</a></li>
            <li><a className="text-white no-underline hover:underline" href="https://www.schools.nyc.gov/get-involved/families" rel="noopener noreferrer">NYCPS Family Info</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-[.9rem] uppercase tracking-[.12em] text-gold font-black">For Students</h2>
          <ul className="list-none m-0 p-0 grid gap-1.5">
            <li><Link className="text-white no-underline hover:underline" href="/students">Student Hub</Link></li>
            <li><a className="text-white no-underline hover:underline" href="https://pupilpath.skedula.com/" rel="noopener noreferrer">PupilPath</a></li>
            <li><a className="text-white no-underline hover:underline" href="https://sites.google.com/schools.nyc.gov/bghscampuslibrary/home" rel="noopener noreferrer">BGHS Library</a></li>
            <li><a className="text-white no-underline hover:underline" href="http://www.psal.org/profiles/school-profile.aspx#16502" rel="noopener noreferrer">BGHS PSAL</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-[.9rem] uppercase tracking-[.12em] text-gold font-black">For Staff</h2>
          <ul className="list-none m-0 p-0 grid gap-1.5">
            <li><Link className="text-white no-underline hover:underline" href="/staff">Staff Hub</Link></li>
            <li><a className="text-white no-underline hover:underline" href="https://teachhub.schools.nyc/" rel="noopener noreferrer">TeachHub</a></li>
            <li><a className="text-white no-underline hover:underline" href="https://www.boysandgirlshs.org/apps/staff/" rel="noopener noreferrer">Staff Directory</a></li>
            <li><Link className="text-white no-underline hover:underline" href="/accessibility">Accessibility Statement</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="max-w-site mx-auto px-5 py-5 flex flex-wrap gap-6 items-center text-[.85rem]">
          <a href="https://www.schools.nyc.gov" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={school.doeLogo} alt={school.doeLogoAlt} className="w-[120px]" />
          </a>
          <span>© {new Date().getFullYear()} {school.name} · {school.district} · DBN {school.dbn}</span>
          <Link className="text-white" href="/accessibility">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}

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
