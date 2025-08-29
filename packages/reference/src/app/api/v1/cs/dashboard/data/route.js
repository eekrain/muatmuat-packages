import { NextResponse } from "next/server";

import { mockDashboardData, successShell } from "./mockData";

export async function GET() {
  try {
    await new Promise((res) => setTimeout(res, 1000)); // Simulate latency

    const response = { ...successShell };
    response.Data = mockDashboardData;

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { Message: { Code: 500, Text: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
