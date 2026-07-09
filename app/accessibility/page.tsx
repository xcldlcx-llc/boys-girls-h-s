import Link from "next/link";
import { school } from "@/lib/data";

export const metadata = { title: "Accessibility", description: "Accessibility statement for the Boys and Girls High School website (WCAG 2.2 AA)." };

export default function AccessibilityPage() {
  return (
    <>
      <div className="bg-ink text-white py-12 pb-10">
        <div className="max-w-site mx-auto px-5">
          <nav className="text-[.85rem] mb-2.5 text-[#d9d6d0]" aria-label="Breadcrumb">
            <Link href="/" className="text-white">Home</Link><span className="mx-2 text-gold" aria-hidden="true">›</span><span aria-current="page">Accessibility</span>
          </nav>
          <h1 className="text-white m-0 text-[clamp(1.9rem,4vw,2.7rem)]">Accessibility Statement</h1>
        </div>
      </div>
      <main id="main">
        <section className="py-12">
          <div className="max-w-[800px] mx-auto px-5 content-block">
            <p>The DOE is committed to creating and supporting learning environments that reflect the diversity of New York City. To ensure that our website serves the needs of everyone, it follows the <a href="https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/" rel="noopener noreferrer">Web Content Accessibility Guidelines 2.2 AA</a> level. That means the site works for people with disabilities, including those who are blind and partially sighted.</p>
            <p>We are committed to creating accessible digital experiences for all website visitors. If you need assistance with a particular page or document on our site, please call <a href="tel:+17184671700">{school.phone}</a>, or mail to: {school.address}, and we will provide the information you need in an accessible format.</p>
            <h2>What we do</h2>
            <ul>
              <li>Every image, document, and video on this site carries descriptive alternative text.</li>
              <li>Documents open in an in-page viewer with a text description, plus download and new-tab options.</li>
              <li>All interactive elements work with a keyboard alone; the Escape key closes every dialog.</li>
              <li>Motion respects your &ldquo;reduce motion&rdquo; system setting, and moving content can be paused.</li>
              <li>Color contrast meets or exceeds 4.5:1 for text.</li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
