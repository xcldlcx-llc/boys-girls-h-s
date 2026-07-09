import Link from "next/link";
import { siteData, fmtDate, route } from "@/lib/data";

export const metadata = { title: "News & Announcements", description: "All news and family notices from Boys and Girls High School." };

export default function NewsPage() {
  return (
    <>
      <div className="bg-ink text-white py-12 pb-10">
        <div className="max-w-site mx-auto px-5">
          <nav className="text-[.85rem] mb-2.5 text-[#d9d6d0]" aria-label="Breadcrumb">
            <Link href="/" className="text-white">Home</Link><span className="mx-2 text-gold" aria-hidden="true">›</span><span aria-current="page">News</span>
          </nav>
          <h1 className="text-white m-0 text-[clamp(1.9rem,4vw,2.7rem)]">News &amp; Announcements</h1>
          <p className="text-[#e8e6e1] mt-2.5 mb-0">Every notice opens in an accessible viewer on this page, with a text summary for every attachment.</p>
        </div>
      </div>
      <main id="main">
        <section className="py-12">
          <div className="max-w-site mx-auto px-5 grid--3">
            {siteData.news.map((n) => (
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
        </section>
      </main>
    </>
  );
}
