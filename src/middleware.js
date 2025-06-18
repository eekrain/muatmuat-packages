// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/sewaarmada";
    return NextResponse.redirect(url);
  }

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

  return NextResponse.next();
}
