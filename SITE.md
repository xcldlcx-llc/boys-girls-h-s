# Boys and Girls High School Website

> Home of the Kangaroos — NYC Public Schools, Brooklyn North, District 16.

## Brand Identity
- Personality: Bold, proud, official — a real NYC public school site (DOE-style), not a generic template.
- Colors: School red (`#e81c25`) as the main accent, near-black "ink" for dark sections and text, warm off-white "paper" tones for backgrounds, and gold (`#f2b01e`) for highlights like the alert bar and stats.
- Fonts: Lato (bold/black weights for headings, regular for body text).

## What's On Your Site

### Pages
- **Homepage** (`/`) - Welcome banner, a rotating photo slideshow, quick-link tiles (Enroll, Bell Schedule, Calendar, etc.), the mission statement and a message from the principal, school stats (graduation rate, attendance, etc.), the latest news, upcoming events, and a video tour of the school.
- **News & Announcements** (`/news`) - Every school notice and flyer, each opens right on the page (no separate downloads).
- **Calendar & Events** (`/calendar`) - The full list of upcoming events and dates, with links to the citywide NYCPS calendar and the sports (PSAL) calendar.
- **Accessibility Statement** (`/accessibility`) - Explains how the site meets accessibility guidelines (WCAG 2.2 AA).
- **31 content pages** covering About, Academics, Students, Families, Admissions, and Staff sections (e.g. `/about/mission`, `/academics/bell-schedule`, `/admissions/noted-alumni`). Each page automatically shows a sidebar with links to the other pages in its section.

### Shared Elements
- **Alert bar** - A gold banner at the very top for urgent school-wide announcements (currently turned off — turn it on by editing `data/site.json`).
- **Scrolling ticker** - A dark strip under the alert bar with short scrolling announcements. Visitors can pause it.
- **Header** - The circular BGHS logo in the center with menus split left and right (About, Academics, Students, Calendar on the left; Families, Admissions, Staff, News on the right). Becomes a hamburger menu on phones.
- **Floating action buttons** - Contact Us, Enroll Now, and Search icons that float on the right edge of the screen (bottom of the screen on phones). Search looks through every page, news item, and document.
- **Footer** - School contact info and social links, quick links for Families, Students, and Staff, and the NYCPS/DOE logo at the very bottom. Just above that bottom bar there's a reddish running-track strip with white lane lines, where the school's kangaroo mascot hops across on a loop. Hover over it and it pauses with a "Go Kangaroos!" bubble.
- **Document viewer** - Any flyer, PDF, photo, or video on the site opens in a popup right on the page instead of a new tab.

## How the Content Works
All the real school content — news, events, staff, page text, photos — lives in two files so it's easy to find:
- `data/site.json` - School info, news, events, the photo slideshow, quick links, stats, and documents.
- `data/pages.json` - The written content for all 31 section pages.

Editing either file updates the site automatically; no code changes needed for text/content updates.

## Recent Changes
- 2026-07-09: Replaced the starter homepage with the full Boys and Girls High School website — home page, news, calendar, accessibility statement, and 31 section pages — built from a pre-made Next.js/Tailwind package the user provided. Brought over the school's real content (news, events, stats, staff, page text) and its red/ink/gold brand system.
- 2026-07-09: Fixed the logo in the top menu, mobile menu, and footer — it's a wide rectangular badge, not a circle, so it was being squeezed into a tiny circular frame and looked broken. It now shows at full size and reads clearly.
- 2026-07-09: Security check — updated the website software (Next.js) to patch known security bugs, cleaned up other outdated tools, and added standard browser security headers. See the "Data & Security" section below for what this does and does not cover.
- 2026-07-09: Redesigned the footer — the Families/Students/Staff links now nudge over and turn gold on hover, and there's a new reddish "running track" strip where an AI-generated kangaroo mascot hops across on a loop (it pauses and says "Go Kangaroos!" when you hover over it, and holds still for anyone with reduced-motion turned on).
- 2026-07-09: Gave every card-style box on the site — news cards, quick-link tiles, the mission/principal boxes, event rows, document cards — a light "frosted glass" polish: a touch of see-through softness and a subtle glow along the top edge, instead of flat white.
- 2026-07-09: Added a password-protected Site Admin page (linked at the very bottom of the footer). First panel built: **Photos**, matching the reference screenshot. Settings save to a real, separate storage system (Vercel Edge Config), not just a file, so changes actually take effect on the live site. See "Site Admin" section below.

## Site Admin
- URL: `/admin` (small "Site Admin" link at the bottom of the footer). Sign in with the password shared in chat — change it any time by updating the `ADMIN_PASSWORD` value in the Vercel project's environment variables.
- Sidebar lists all the category names from the old Edlio admin panel; only **Photos** is wired up so far. The rest are greyed out with "Coming soon" until their fields are specced out.
- **Photos panel fields and what they actually do:**
  - Page Title → the heading and browser tab title on the Photos & Videos page (`/about/media`)
  - Show My Album → shows/hides a "submit your photos" prompt (no upload system exists yet, so this only shows or hides the prompt for now)
  - View Effect → photos open either in an on-page popup or a new browser tab
  - Show Upload Disclaimer → shows/hides a student-photo consent notice on the page
  - Maximum Image Width / Thumbnail Width / Thumbnail Height / JPEG Quality → control the real size and image quality of the photo gallery
  - Slide Show Refresh Interval → controls both the Photos gallery and the homepage's rotating photo banner
- Settings are stored in a Vercel Edge Config store (not a file on disk), so they persist correctly once deployed, not just in the local preview.
- **One setup step still pending:** saving currently fails safely with a clear on-screen error until a Vercel API token is added (I can't generate this one myself for security reasons — see chat for the two-minute manual step).

## Data & Security
- **This site does not currently collect or store any visitor or student data.** No forms, no sign-in, no database, no analytics/tracking scripts. Everything on the site (news, events, staff names, page text) comes from two files you already control (`data/site.json`, `data/pages.json`) and is public information equivalent to what the school already publishes.
- I checked every page and found no student records, grades, IDs, health, or disciplinary information anywhere in the content.
- I patched known security vulnerabilities in the underlying Next.js framework and other build tools, and added baseline browser security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- **I can't certify legal compliance** (FERPA, NY Education Law 2-d, COPPA, or NYC DOE's own data-privacy rules) — that requires a real review by the school's or DOE's data privacy office, not an AI. It matters most the moment this site adds anything that collects data: a contact form, a CMS login, or the Supabase database option mentioned above. Until then, the compliance surface is small because there's nothing here to protect yet.
- **One thing worth confirming with the school/DOE directly:** this site uses the real school name, principal's name, staff names, and the official DOE logo. Worth double-checking it's authorized to represent the school publicly under that branding before it goes live, separate from anything technical.

## How to Customize
- To change the school's phone, address, social links, or logo: edit `data/site.json` under `"school"`.
- To add or edit news, events, or documents: edit the matching list in `data/site.json`.
- To edit the text on any section page (like Mission & Vision or Bell Schedule): find its entry in `data/pages.json` and edit the `"body"` field.
- To change the site's colors or fonts: edit the `@theme` section at the top of `app/globals.css`.
- To turn on the gold alert banner: set `"active": true` under `"alert"` in `data/site.json`.
- To swap the hopping mascot picture: replace `public/mascot-kangaroo.png` with a new image (transparent background works best).
