import { getAdminAuthState } from "@/lib/admin-auth";
import { getPhotosSettings } from "@/lib/settings";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Site Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const auth = await getAdminAuthState();

  if (auth.status === "signed-out") {
    return (
      <main id="main" className="min-h-[70vh] grid place-items-center px-5 py-16">
        <div className="w-full max-w-sm panel text-center">
          <h1 className="text-2xl mb-1">Site Admin</h1>
          <p className="text-ink-soft text-[.9rem] mb-6">Sign in to manage site settings.</p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- SDK-mounted route, not an app page */}
          <a href="/auth/login?returnTo=/admin" className="btn btn--primary w-full text-center">Sign In</a>
        </div>
      </main>
    );
  }

  if (auth.status === "forbidden") {
    return (
      <main id="main" className="min-h-[70vh] grid place-items-center px-5 py-16">
        <div className="w-full max-w-sm panel text-center">
          <h1 className="text-2xl mb-1">Access Denied</h1>
          <p className="text-ink-soft text-[.9rem] mb-6">
            {auth.email} isn&rsquo;t on the approved list for the site admin. Contact the site owner if you believe this is a mistake.
          </p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- SDK-mounted route, not an app page */}
          <a href="/auth/logout?returnTo=/" className="btn btn--ink w-full text-center">Sign Out</a>
        </div>
      </main>
    );
  }

  const photos = await getPhotosSettings();
  return <AdminDashboard photos={photos} email={auth.email} />;
}
