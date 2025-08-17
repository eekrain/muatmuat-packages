import { NextResponse } from "next/server";

import { dashboardData } from "./mockData";

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json(dashboardData);
}
