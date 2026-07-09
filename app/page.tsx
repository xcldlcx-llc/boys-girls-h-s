import Link from "next/link";
import { HeroSlides } from "@/components/Interactive";
import { siteData, school, fmtDate, route, isExternal } from "@/lib/data";
import { getPhotosSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { description: `${school.vision} ${school.tagline} — ${school.district}.` };

function QuickTiles() {
  return (
    <div className="grid gap-3.5 grid-cols-2 md:grid-cols-4">
      {siteData.quickLinks.map((q) => {
        const href = route(q.href);
        const ext = isExternal(href);
        const cls = "reveal bg-white/75 backdrop-blur-sm border border-line/70 rounded-xl py-4 px-3.5 text-center no-underline text-ink font-black text-[.92rem] tracking-wide transition shadow-[inset_0_1px_0_rgba(255,255,255,.8)] hover:-translate-y-1 hover:shadow-lift hover:border-red hover:text-red-text block";
        const icon = <span className="block text-2xl mb-1.5 text-red-text" aria-hidden="true" dangerouslySetInnerHTML={{ __html: q.icon }} />;
        return ext ? (
          <a key={q.label} href={href} className={cls} rel="noopener noreferrer" target="_blank">
            {icon}{q.label}<span className="sr-only"> (opens in a new window)</span>
          </a>
        ) : (
          <Link key={q.label} href={href} className={cls}>{icon}{q.label}</Link>
        );
      })}
    </div>
  );
}

function NewsGrid({ limit }: { limit?: number }) {
  const items = limit ? siteData.news.slice(0, limit) : siteData.news;
  return (
    <div className="grid--3">
      {items.map((n) => (
        <article key={n.id} className="card reveal">
          {n.image ? (
            <div className="aspect-video overflow-hidden bg-paper-gray">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.image} alt={n.imageAlt || n.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
          ) : null}
          <div className="card-body">
            <span className="card-date">{fmtDate(n.date).full}</span>
            <h3 className="m-0 text-[1.1rem]">{n.title}</h3>
            {n.summary ? <p className="m-0 text-ink-soft text-[.95rem]">{n.summary}</p> : null}
            {n.attachment ? (
              <button type="button" className="doc-open card-link bg-transparent border-0 p-0 text-left cursor-pointer" data-doc={n.attachment}>
                Read the notice <span className="chev" aria-hidden="true">›</span>
              </button>
            ) : (
              <Link className="card-link" href={route(n.link) || "/news"}>Read more <span className="chev" aria-hidden="true">›</span></Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export function EventList({ limit }: { limit?: number }) {
  const items = limit ? siteData.events.slice(0, limit) : siteData.events;
  return (
    <ul className="list-none m-0 p-0 grid gap-3">
      {items.map((ev, idx) => {
        const d = fmtDate(ev.date);
        return (
          <li key={idx}>
            <Link href={route(ev.link) || "/calendar"} className="event-item">
              <span className="flex-none w-16 text-center bg-paper-warm rounded-lg py-1.5 border border-line" aria-hidden="true">
                <span className="block text-[.72rem] font-black uppercase text-red-text">{d.m}</span>
                <span className="block text-[1.35rem] font-black leading-tight">{d.day}</span>
              </span>
              <span>
                <span className="font-bold">{ev.title}</span><br />
                <span className="text-[.85rem] text-ink-soft">{d.full}{ev.time ? ` · ${ev.time}` : ""}{ev.location ? ` · ${ev.location}` : ""}</span>
              </span>
              <span className="chev" aria-hidden="true">›</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default async function Home() {
  const photosSettings = await getPhotosSettings();
  return (
    <main id="main">
      {/* BKNHS-style top: giant headline band above the imagery */}
      <section className="bg-paper" aria-label="Welcome">
        <div className="max-w-site mx-auto px-5 pt-10 pb-8 text-center">
          <p className="eyebrow">{school.tagline} · {school.district}</p>
          <h1 className="uppercase font-black leading-[1.05] text-[clamp(2.4rem,6.5vw,4.6rem)] max-w-[18ch] mx-auto">
            Welcome to Boys and Girls High School
          </h1>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/admissions" className="btn btn--primary">Apply to BGHS</Link>
            <Link href="/about/mission" className="btn btn--ink">Our story</Link>
          </div>
        </div>
      </section>

      {/* Image band with mission words overlaid, slideshow behind */}
      <section className="relative bg-ink text-white overflow-hidden h-[440px] md:h-[520px]" aria-label="School photos">
        <HeroSlides intervalMs={photosSettings.slideShowInterval * 1000} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 z-[1]" aria-hidden="true" />
        <div className="absolute inset-0 z-[2] max-w-site mx-auto px-5 flex flex-col justify-between py-8 pointer-events-none">
          <p className="uppercase font-black text-white text-[clamp(1.3rem,3vw,2.2rem)] leading-tight max-w-[14ch] [text-shadow:0_2px_12px_rgba(0,0,0,.6)]">
            Achieve your full potential
          </p>
          <p className="uppercase font-black text-white text-[clamp(1.3rem,3vw,2.2rem)] leading-tight max-w-[14ch] self-end text-right [text-shadow:0_2px_12px_rgba(0,0,0,.6)]">
            A plan for life after high school
          </p>
        </div>
      </section>

      <section className="py-14" aria-label="Quick links">
        <div className="max-w-site mx-auto px-5"><QuickTiles /></div>
      </section>

      <section className="py-14 bg-paper-warm" aria-label="Mission and principal">
        <div className="max-w-site mx-auto px-5 grid--2">
          <div className="panel reveal">
            <span className="eyebrow">Our mission</span>
            <h2 className="text-3xl">Every scholar, a plan for life</h2>
            <p>{school.mission}</p>
            <Link className="card-link" href="/about/mission">Mission &amp; vision <span className="chev" aria-hidden="true">›</span></Link>
          </div>
          <div className="panel reveal">
            <span className="eyebrow">From the principal</span>
            <h2 className="text-3xl">A message from Dr. Harrison</h2>
            <p>“There are no limits on your ability to achieve except for those you place on yourself. I believe in you. However, it is more important that you believe in yourself. Stay strong!”</p>
            <p><strong>Dr. Grecian Harrison, Ed.D.</strong> · Principal</p>
            <Link className="card-link" href="/about/principals-message">Read the full message <span className="chev" aria-hidden="true">›</span></Link>
          </div>
        </div>
      </section>

      <section className="py-14 bg-ink text-white" aria-label="School statistics">
        <div className="max-w-site mx-auto px-5">
          <span className="eyebrow !text-gold">Here at BGHS</span>
          <h2 className="text-white text-3xl">The numbers tell the story</h2>
          <div className="grid gap-5 grid-cols-2 md:grid-cols-4 text-center mt-6">
            {siteData.stats.map((s) => (
              <div key={s.label} className="reveal">
                <div className="text-[clamp(1.9rem,4vw,2.6rem)] font-black text-gold leading-none">{s.value}</div>
                <div className="text-[.9rem] font-bold uppercase tracking-wide mt-2 text-[#e8e6e1]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14" aria-label="News and announcements">
        <div className="max-w-site mx-auto px-5">
          <span className="eyebrow">What&rsquo;s happening</span>
          <h2 className="text-3xl">News &amp; announcements</h2>
          <p>Notices open right here on the page — no separate download needed.</p>
          <NewsGrid limit={6} />
          <p className="mt-6"><Link href="/news" className="btn btn--ink">Show all news</Link></p>
        </div>
      </section>

      <section className="py-14 bg-paper-warm" aria-label="Upcoming events">
        <div className="max-w-site mx-auto px-5 grid--2">
          <div>
            <span className="eyebrow">Mark your calendar</span>
            <h2 className="text-3xl">Upcoming events</h2>
            <EventList limit={5} />
            <p className="mt-5"><Link href="/calendar" className="btn btn--ink">View full calendar</Link></p>
          </div>
          <div className="panel reveal self-start">
            <span className="eyebrow">A legacy of leaders</span>
            <h2 className="text-3xl">Chisholm. Horne. Asimov.</h2>
            <p>The first Black woman elected to Congress. A legend of stage and screen. One of the most prolific authors in history. They all walked these halls — your scholar is next.</p>
            <Link className="card-link" href="/admissions/noted-alumni">Meet our noted alumni <span className="chev" aria-hidden="true">›</span></Link>
          </div>
        </div>
      </section>

      <section className="py-14" aria-label="Video spotlight">
        <div className="max-w-site mx-auto px-5 panel panel--message reveal">
          <div>
            <span className="eyebrow">In the spotlight</span>
            <h2 className="text-3xl">Tour Boys and Girls High School</h2>
            <p>Watch the open house orientation tour — classrooms, programs, and student life — right here on the page.</p>
            <button type="button" className="doc-open btn btn--primary !no-underline" data-doc="doc-open-house-video">Watch the tour</button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://1.cdn.edl.io/TQQSzLIy4fJ2sK0ImaU559LdqjRAEtojMvwfOVLqE4rMFnF7.jpg" alt="Front of the Boys and Girls High School campus on Fulton Street" className="rounded-xl" />
        </div>
      </section>
    </main>
  );
}
