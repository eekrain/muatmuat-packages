// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const cleanHost = hostname.replace(":3000", "");

  if (cleanHost.startsWith("shipper.")) {
    url.pathname = `/shipper${url.pathname}`;
  } else if (cleanHost.startsWith("transporter.")) {
    url.pathname = `/transporter${url.pathname}`;
  }

  return NextResponse.rewrite(url);
}
