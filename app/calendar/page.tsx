import Link from "next/link";
import { EventList } from "@/app/page";

export const metadata = { title: "Calendar & Events", description: "Upcoming events and key dates at Boys and Girls High School." };

export default function CalendarPage() {
  return (
    <>
      <div className="bg-ink text-white py-12 pb-10">
        <div className="max-w-site mx-auto px-5">
          <nav className="text-[.85rem] mb-2.5 text-[#d9d6d0]" aria-label="Breadcrumb">
            <Link href="/" className="text-white">Home</Link><span className="mx-2 text-gold" aria-hidden="true">›</span><span aria-current="page">Calendar</span>
          </nav>
          <h1 className="text-white m-0 text-[clamp(1.9rem,4vw,2.7rem)]">Calendar &amp; Events</h1>
          <p className="text-[#e8e6e1] mt-2.5 mb-0">Key dates for students and families.</p>
        </div>
      </div>
      <main id="main">
        <section className="py-12">
          <div className="max-w-site mx-auto px-5">
            <EventList />
            <div className="note mt-6">
              Citywide dates (holidays, testing, recess) live on the{" "}
              <a href="https://www.schools.nyc.gov/calendar" rel="noopener noreferrer">NYCPS calendar</a>. PSAL game schedules are on the{" "}
              <a href="http://www.psal.org/events-and-standings/school-calendar.aspx?schid=16502" rel="noopener noreferrer">athletic calendar</a>.
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
