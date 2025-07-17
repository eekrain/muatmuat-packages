// middleware.ts
import { NextResponse } from "next/server";

const LIST_PUBLIC_FILES = [
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/logo.png",
  "/icons/",
  "/img/",
];

export function middleware(request) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Exclude Next.js static files, known public assets, and any file with an extension from rewrite
  if (
    LIST_PUBLIC_FILES.some((file) => url.pathname.startsWith(file)) ||
    /\.[^\/]+$/.test(url.pathname) // matches any path with a file extension
  ) {
    return NextResponse.next();
  }

  // --- TRANSPORTER SUBDOMAIN HANDLER ---
  if (process.env.NEXT_PUBLIC_APP_MODE === "transporter") {
    // Redirect root path based on environment
    if (url.pathname === "/") {
      const isDevEnvironment = process.env.NEXT_PUBLIC_ENVIRONMENT === "dev";
      url.pathname = isDevEnvironment ? "/dev-login" : "/login";
      return NextResponse.redirect(url);
    }

    // Rewrite all transporter paths
    url.pathname = `/transporter${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // --- SHIPPER SUBDOMAIN HANDLER ---
  if (process.env.NEXT_PUBLIC_APP_MODE === "shipper") {
    // 1. Redirect / to /sewaarmada
    if (url.pathname === "/") {
      url.pathname = "/sewaarmada";
      return NextResponse.redirect(url);
    }

    // 2. Setup formid for sewaarmada, it will be used for an identifier for the current draft
    if (url.pathname === "/sewaarmada") {
      const searchParams = new URLSearchParams(url.search);
      if (!searchParams.get("formid")) {
        // Generate a random formid if not present
        const randomId = Math.random().toString(36).substring(2, 15);
        searchParams.set("formid", randomId);
        url.search = searchParams.toString();
        return NextResponse.redirect(url);
      }
    }

    // 3. Redirect /example paths to /sewaarmada in production
    if (
      process.env.NODE_ENV !== "development" &&
      url.pathname.startsWith("/example")
    ) {
      url.pathname = "/sewaarmada";
      return NextResponse.redirect(url);
    }

    // 4. Always rewrite to /shipper path for all other requests
    url.pathname = `/shipper${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // --- DEFAULT: Pass through ---
  return NextResponse.next();
}
