// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  // Redirect / to /sewaarmada
  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/sewaarmada";
    return NextResponse.redirect(url);
  }

  // Setup formid for sewaarmada, it will be used for an identifier for the current draft
  if (request.nextUrl.pathname === "/sewaarmada") {
    const url = request.nextUrl.clone();
    const searchParams = new URLSearchParams(url.search);

    if (!searchParams.get("formid")) {
      // Generate a random formid if not present
      const randomId = Math.random().toString(36).substring(2, 15);
      searchParams.set("formid", randomId);
      url.search = searchParams.toString();
      return NextResponse.redirect(url);
    }
  }

  // Redirect /example paths to /sewaarmada in production
  if (
    process.env.NODE_ENV !== "development" &&
    request.nextUrl.pathname.startsWith("/example")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/sewaarmada";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
