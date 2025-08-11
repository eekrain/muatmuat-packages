// app/api/v1/dashboard/summary/route.js
import { NextResponse } from "next/server";

import {
  mockAccountStatusData,
  mockDashboardSummaryData,
  serverErrorResponse,
  successShell,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  try {
    // Simulate a realistic network delay for the dashboard load
    await delay(750);
    const responseData = {
      summary: mockDashboardSummaryData.sections,
      accountStatus: mockAccountStatusData,
    };

    const response = { ...successShell };
    response.Data = responseData;

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
