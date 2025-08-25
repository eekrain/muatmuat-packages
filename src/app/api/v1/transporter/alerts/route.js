import { NextResponse } from "next/server";

import {
  periodFilterOptions,
  serverErrorResponse,
  successShell,
} from "./mockData";

export async function GET(req) {
  try {
    await new Promise((res) => setTimeout(res, 500));

    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get("endpoint") || "";

    if (endpoint === "new-reviews/period-filter") {
      const response = { ...successShell };
      response.Message.Text = "Period filter options retrieved";
      response.Data = periodFilterOptions;
      response.Type = "PERIOD_FILTER_OPTIONS";

      return NextResponse.json(response, { status: 200 });
    }

    return NextResponse.json(
      {
        Message: { Code: 400, Text: "Invalid endpoint parameter" },
        Data: {
          errors: [
            { field: "endpoint", message: "Endpoint not found or invalid" },
          ],
        },
        Type: "BAD_REQUEST",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
