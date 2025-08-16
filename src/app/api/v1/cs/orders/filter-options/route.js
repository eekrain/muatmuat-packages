import { NextResponse } from "next/server";

import { filterOptionsData } from "./mockData";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return NextResponse.json({ Data: filterOptionsData });
}
