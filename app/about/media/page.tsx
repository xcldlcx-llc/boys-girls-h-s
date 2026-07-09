import Image from "next/image";
import Link from "next/link";
import { NAV, documents } from "@/lib/data";
import { getPhotosSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getPhotosSettings();
  return { title: settings.pageTitle, description: "Photo gallery and video spotlight from around Boys and Girls High School." };
}

function SideNav() {
  const sec = NAV.find((n) => n.label === "About" && n.children);
  if (!sec?.children) return null;
  return (
    <aside className="sticky top-[110px] self-start bg-paper-warm rounded-2xl p-5" aria-label="About section pages">
      <h2 className="text-[.85rem] uppercase tracking-[.1em] text-ink-soft font-black">In this section</h2>
      <ul className="list-none m-0 p-0 grid gap-0.5">
        {sec.children.map(([t, h]) => {
          const current = h === "/about/media";
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

export default async function PhotosVideosPage() {
  const settings = await getPhotosSettings();
  const images = documents.filter((d) => d.type === "image");

  return (
    <>
      <div className="bg-ink text-white py-12 pb-10">
        <div className="max-w-site mx-auto px-5">
          <nav className="text-[.85rem] mb-2.5 text-[#d9d6d0]" aria-label="Breadcrumb">
            <Link href="/" className="text-white">Home</Link>
            <span className="mx-2 text-gold" aria-hidden="true">›</span>
            About<span className="mx-2 text-gold" aria-hidden="true">›</span>
            <span aria-current="page">{settings.pageTitle}</span>
          </nav>
          <h1 className="text-white m-0 text-[clamp(1.9rem,4vw,2.7rem)]">{settings.pageTitle}</h1>
          <p className="max-w-[65ch] text-[#e8e6e1] mt-2.5 mb-0">Photo gallery and video spotlight from around Boys and Girls High School.</p>
        </div>
      </div>
      <main id="main">
        <div className="max-w-site mx-auto px-5 grid gap-10 py-12 lg:grid-cols-[1fr_280px]">
          <div className="content-block min-w-0">
            {settings.showUploadDisclaimer ? (
              <div className="note mb-6">
                Photos of students on this page are used with parental/guardian consent on file, per DOE guidance.
              </div>
            ) : null}

            <h2>Around the school</h2>
            <p>Select any photo to view it larger, right on this page.</p>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${settings.thumbnailWidth}px, 1fr))` }}
            >
              {images.map((img) =>
                settings.viewEffect === "magnific" ? (
                  <button
                    key={img.id}
                    type="button"
                    className="doc-open border-0 p-0 bg-transparent cursor-pointer rounded-xl overflow-hidden"
                    data-doc={img.id}
                    data-max-width={settings.maxImageWidth}
                  >
                    <Image
                      src={img.file}
                      alt={img.alt || img.title}
                      width={settings.thumbnailWidth}
                      height={settings.thumbnailHeight}
                      quality={settings.jpegQuality}
                      className="object-cover w-full transition hover:scale-105"
                      style={{ height: settings.thumbnailHeight, width: "100%" }}
                    />
                  </button>
                ) : (
                  <a
                    key={img.id}
                    href={img.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-0 p-0 rounded-xl overflow-hidden"
                  >
                    <Image
                      src={img.file}
                      alt={img.alt || img.title}
                      width={settings.thumbnailWidth}
                      height={settings.thumbnailHeight}
                      quality={settings.jpegQuality}
                      className="object-cover w-full transition hover:scale-105"
                      style={{ height: settings.thumbnailHeight, width: "100%" }}
                    />
                    <span className="sr-only"> (opens in a new window)</span>
                  </a>
                )
              )}
            </div>

            {settings.showMyAlbum ? (
              <div className="panel mt-8">
                <span className="eyebrow">Have photos to share?</span>
                <h2 className="text-2xl">Submit your photos</h2>
                <p>Families and staff can share photos from school events for consideration in this gallery.</p>
                <a className="card-link" href="mailto:BoysandGirlsHighSchool@NYCDOE.onmicrosoft.com">Email the school <span className="chev" aria-hidden="true">›</span></a>
              </div>
            ) : null}
          </div>
          <SideNav />
        </div>
      </main>
    </>
  );
}
