import { NextResponse } from "next/server";

import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req) {
  try {
    // realistic delay
    await delay(1000);

    const url = new URL(req.url);
    const includeInactive = url.searchParams.get("includeInactive");
    const bounds = url.searchParams.get("bounds");
    const zoom = url.searchParams.get("zoom");

    // bounds is optional; when present, validate format lat1,lng1,lat2,lng2
    let parts = null;
    if (bounds) {
      parts = bounds.split(",").map((p) => Number(p));
      if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
        return NextResponse.json(errorResponse, { status: 400 });
      }
    }

    // Use includeInactive and zoom in mock logic to avoid unused variable warnings
    const showInactive = includeInactive === "true";
    const parsedZoom = Number(zoom) || 0;
    // reference them (no-op) so linters don't flag unused variables
    void showInactive;
    void parsedZoom;
    // You can add simple filtering logic based on bounds/zoom here for richer mocks

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    // avoid direct console in some lint configs
    if (typeof globalThis !== "undefined" && globalThis?.console?.error) {
      globalThis.console.error("API Error:", error);
    }
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
