import { cookies } from "next/headers";
import { verifySessionCookieValue, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { getPhotosSettings } from "@/lib/settings";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Site Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authed = verifySessionCookieValue(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  if (!authed) return <AdminLogin />;

  const photos = await getPhotosSettings();
  return <AdminDashboard photos={photos} />;
}
