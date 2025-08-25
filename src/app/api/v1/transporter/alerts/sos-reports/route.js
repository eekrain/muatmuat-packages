import { NextResponse } from "next/server";

const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// Mock data based on api-kontrak.md
const mockSosReportsData = {
  reports: [
    {
      reportId: "SOS-2025-001",
      orderId: "ORD-2025-001234",
      orderNumber: "MTO240122001",
      driverId: "DRV-001",
      driverName: "Ahmad Suryanto",
      customerName: "PT Maju Jaya",
      reportType: "emergency",
      reportDescription: "Kecelakaan ringan di Tol Jakarta-Cikampek KM 25",
      currentLocation: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: "Tol Jakarta-Cikampek KM 25, Bekasi",
      },
      reportedAt: "2025-01-22T14:30:00Z",
      status: "active",
      priority: "high",
    },
    {
      reportId: "SOS-2025-002",
      orderId: "ORD-2025-001235",
      orderNumber: "MTO240122002",
      driverId: "DRV-002",
      driverName: "Budi Santoso",
      customerName: "CV Sejahtera",
      reportType: "emergency",
      reportDescription: "Ban bocor di Jalan Raya Bogor",
      currentLocation: {
        latitude: -6.3588,
        longitude: 106.809,
        address: "Jalan Raya Bogor, Depok",
      },
      reportedAt: "2025-01-22T15:45:00Z",
      status: "resolved",
      priority: "medium",
    },
  ],
  summary: {
    activeReports: 1,
    resolvedReports: 15,
    averageResponseTime: "7 menit",
  },
};

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
    if (useMockData) {
      // Simulate network delay
      await new Promise((res) => setTimeout(res, 500));

      const response = { ...successShell };
      response.Message.Text = "SOS reports retrieved successfully";
      response.Data = mockSosReportsData;
      response.Type = "SOS_REPORTS_LIST";

      return NextResponse.json(response, { status: 200 });
    }

    // Production API call would go here
    return NextResponse.json(
      {
        Message: {
          Code: 501,
          Text: "Production API not implemented yet",
        },
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
