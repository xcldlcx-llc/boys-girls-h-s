import Link from "next/link";
import { school } from "@/lib/data";

/* Kangaroo mascot rail: a decorative strip where the school mascot hops
   left-to-right in an endless loop. Pure CSS (see .mascot-* rules in
   globals.css) so there's no client JS cost. Pauses on hover/reduced-motion. */
function MascotRail() {
  return (
    <div className="mascot-rail" aria-hidden="true">
      <span className="ground-line" />
      <span className="mascot-bubble">Go Kangaroos!</span>
      <div className="mascot-track">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mascot-kangaroo.png" alt="" className="mascot-hop" />
        <span className="mascot-shadow" />
      </div>
    </div>
  );
}

function FooterLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = "inline-block text-white no-underline transition-[color,transform] duration-200 hover:text-gold hover:translate-x-1";
  if (external) {
    return (
      <a className={cls} href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
      {children}
    </Link>
  );
}

export function Footer() {
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
            <a href={school.social.facebook} aria-label="BGHS on Facebook" className="w-[38px] h-[38px] rounded-full bg-white/10 grid place-items-center font-black text-[.8rem] text-white no-underline transition hover:bg-red hover:-translate-y-0.5">FB</a>
            <a href={school.social.twitter} aria-label="BGHS on X (Twitter)" className="w-[38px] h-[38px] rounded-full bg-white/10 grid place-items-center font-black text-[.8rem] text-white no-underline transition hover:bg-red hover:-translate-y-0.5">X</a>
            <a href={school.social.instagram} aria-label="BGHS on Instagram" className="w-[38px] h-[38px] rounded-full bg-white/10 grid place-items-center font-black text-[.8rem] text-white no-underline transition hover:bg-red hover:-translate-y-0.5">IG</a>
            <a href={school.social.youtube} aria-label="BGHS on YouTube" className="w-[38px] h-[38px] rounded-full bg-white/10 grid place-items-center font-black text-[.8rem] text-white no-underline transition hover:bg-red hover:-translate-y-0.5">YT</a>
          </div>
        </div>
        <div>
          <h2 className="text-[.9rem] uppercase tracking-[.12em] text-gold font-black">For Families</h2>
          <ul className="list-none m-0 p-0 grid gap-1.5">
            <li><FooterLink href="/families">Family Hub</FooterLink></li>
            <li><FooterLink href="/families/ptca">PTCA</FooterLink></li>
            <li><FooterLink href="https://www.schools.nyc.gov/school-life/food/menus" external>School Food Menu</FooterLink></li>
            <li><FooterLink href="https://www.schools.nyc.gov/get-involved/families" external>NYCPS Family Info</FooterLink></li>
          </ul>
        </div>
        <div>
          <h2 className="text-[.9rem] uppercase tracking-[.12em] text-gold font-black">For Students</h2>
          <ul className="list-none m-0 p-0 grid gap-1.5">
            <li><FooterLink href="/students">Student Hub</FooterLink></li>
            <li><FooterLink href="https://pupilpath.skedula.com/" external>PupilPath</FooterLink></li>
            <li><FooterLink href="https://sites.google.com/schools.nyc.gov/bghscampuslibrary/home" external>BGHS Library</FooterLink></li>
            <li><FooterLink href="http://www.psal.org/profiles/school-profile.aspx#16502" external>BGHS PSAL</FooterLink></li>
          </ul>
        </div>
        <div>
          <h2 className="text-[.9rem] uppercase tracking-[.12em] text-gold font-black">For Staff</h2>
          <ul className="list-none m-0 p-0 grid gap-1.5">
            <li><FooterLink href="/staff">Staff Hub</FooterLink></li>
            <li><FooterLink href="https://teachhub.schools.nyc/" external>TeachHub</FooterLink></li>
            <li><FooterLink href="https://www.boysandgirlshs.org/apps/staff/" external>Staff Directory</FooterLink></li>
            <li><FooterLink href="/accessibility">Accessibility Statement</FooterLink></li>
          </ul>
        </div>
      </div>

      <MascotRail />

      <div className="border-t border-white/20">
        <div className="max-w-site mx-auto px-5 py-5 flex flex-wrap gap-6 items-center text-[.85rem]">
          <a href="https://www.schools.nyc.gov" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={school.doeLogo} alt={school.doeLogoAlt} className="w-[120px]" />
          </a>
          <span>© {new Date().getFullYear()} {school.name} · {school.district} · DBN {school.dbn}</span>
          <Link className="text-white" href="/accessibility">Accessibility</Link>
          <Link className="text-white/50 hover:text-white text-[.8rem]" href="/admin">Site Admin</Link>
        </div>
      </div>
    </footer>
  );
}
