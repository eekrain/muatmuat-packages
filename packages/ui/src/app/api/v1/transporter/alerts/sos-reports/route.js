import { NextResponse } from "next/server";

import { fetcherSosReports } from "@/services/Transporter/alerts/getSosReports";

const successShell = {
  Message: { Code: 200, Text: "Request processed successfully" },
  Data: {},
  Type: "SUCCESS",
};

const serverErrorResponse = {
  Message: { Code: 500, Text: "Internal Server Error" },
  Data: {
    errors: [{ field: "general", message: "An unexpected error occurred." }],
  },
  Type: "INTERNAL_SERVER_ERROR",
};

export async function GET(req) {
  try {
    // Use the service fetcher to get SOS reports data
    const sosReportsData = await fetcherSosReports("sos-reports");

    const response = { ...successShell };
    response.Message.Text = "SOS reports retrieved successfully";
    response.Data = sosReportsData;
    response.Type = "SOS_REPORTS_LIST";

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);

    // Handle specific error types
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json(
        {
          Message: { Code: 401, Text: "Unauthorized - Please login again" },
          Data: {
            errors: [{ field: "auth", message: error.message }],
          },
          Type: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    if (error.message?.includes("Forbidden")) {
      return NextResponse.json(
        {
          Message: { Code: 403, Text: "Forbidden - Access denied" },
          Data: {
            errors: [{ field: "permission", message: error.message }],
          },
          Type: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    if (error.message?.includes("not found")) {
      return NextResponse.json(
        {
          Message: { Code: 404, Text: "SOS reports not found" },
          Data: {
            errors: [{ field: "data", message: error.message }],
          },
          Type: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    if (error.message?.includes("Network error")) {
      return NextResponse.json(
        {
          Message: { Code: 503, Text: "Service unavailable" },
          Data: {
            errors: [{ field: "network", message: error.message }],
          },
          Type: "SERVICE_UNAVAILABLE",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
