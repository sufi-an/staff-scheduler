import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/sign-in" || path === "/sign-up" || path === "/";

  const token = request.cookies.get("auth-token")?.value || "";

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }

  if (isPublicPath && token && path === "/sign-in") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/dashboard/:path*", "/api/users/:path*"],
};
