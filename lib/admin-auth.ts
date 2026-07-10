import { auth0 } from "@/lib/auth0";

function getAllowedEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export type AdminAuthState =
  | { status: "signed-out" }
  | { status: "forbidden"; email: string }
  | { status: "authorized"; email: string; name?: string | null };

export async function getAdminAuthState(): Promise<AdminAuthState> {
  const session = await auth0.getSession();
  const email = session?.user?.email;
  if (!email) return { status: "signed-out" };

  const allowed = getAllowedEmails();
  if (!allowed.includes(email.toLowerCase())) {
    return { status: "forbidden", email };
  }
  return { status: "authorized", email, name: session?.user?.name };
}

/** For API routes: true only if signed in AND on the allowlist. */
export async function isAuthorizedAdmin(): Promise<boolean> {
  const state = await getAdminAuthState();
  return state.status === "authorized";
}
