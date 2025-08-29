import { NextResponse } from "next/server";

import { successResponse } from "./mockData";

export async function GET() {
  return NextResponse.json(successResponse);
}
