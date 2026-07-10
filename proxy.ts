import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  try {
    return await auth0.middleware(request);
  } catch (err) {
    console.error("auth0.middleware failed", request.nextUrl.pathname, err);
    return NextResponse.json(
      { error: "auth_middleware_failed", message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
