import Link from "next/link";
import { notFound } from "next/navigation";
import { allPages, getPage, NAV, type Page } from "@/lib/data";

// "about/media" has its own dedicated route (app/about/media/page.tsx) so its
// settings-driven gallery can be rendered — excluded here to avoid a route collision.
const DEDICATED_ROUTES = new Set(["about/media"]);

export function generateStaticParams() {
  return allPages.filter((p) => !DEDICATED_ROUTES.has(p.slug.join("/"))).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};
  return { title: page.title, description: page.description };
}

function SideNav({ page }: { page: Page }) {
  const sec = NAV.find((n) => n.label === page.section && n.children);
  if (!sec?.children) return null;
  return (
    <aside className="sticky top-[110px] self-start bg-paper-warm rounded-2xl p-5" aria-label={`${page.section} section pages`}>
      <h2 className="text-[.85rem] uppercase tracking-[.1em] text-ink-soft font-black">In this section</h2>
      <ul className="list-none m-0 p-0 grid gap-0.5">
        {sec.children.map(([t, h]) => {
          const current = h === page.route;
          return (
            <li key={h}>
              <Link
                href={h}
                aria-current={current ? "page" : undefined}
                className={`block py-2 px-2.5 rounded-lg no-underline text-[.95rem] ${current ? "bg-red-text text-white font-black" : "text-ink hover:bg-white hover:text-red-text"}`}
              >
                {t}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (DEDICATED_ROUTES.has(slug.join("/"))) notFound();
  const page = getPage(slug);
  if (!page) notFound();
  return (
    <>
      <div className="bg-ink text-white py-12 pb-10">
        <div className="max-w-site mx-auto px-5">
          <nav className="text-[.85rem] mb-2.5 text-[#d9d6d0]" aria-label="Breadcrumb">
            <Link href="/" className="text-white">Home</Link>
            <span className="mx-2 text-gold" aria-hidden="true">›</span>
            {page.section ? (<>{page.section}<span className="mx-2 text-gold" aria-hidden="true">›</span></>) : null}
            <span aria-current="page">{page.title}</span>
          </nav>
          <h1 className="text-white m-0 text-[clamp(1.9rem,4vw,2.7rem)]">{page.title}</h1>
          <p className="max-w-[65ch] text-[#e8e6e1] mt-2.5 mb-0">{page.description}</p>
        </div>
      </div>
      <main id="main">
        <div className="max-w-site mx-auto px-5 grid gap-10 py-12 lg:grid-cols-[1fr_280px]">
          <div className="content-block min-w-0" dangerouslySetInnerHTML={{ __html: page.body }} />
          <SideNav page={page} />
        </div>
      </main>
    </>
  );
}
